"""
FastAPI Application Entry Point for Smart Junction Control.
"""

import asyncio
from contextlib import asynccontextmanager
from typing import Dict
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.routes import router as api_router, init_db_seeds
from backend.api.websocket import manager
from backend.services.detection_service import SimulatedVideoDetector, CentroidTracker
from backend.services.signal_logic import SignalLogicEngine, SignalTimingConfig

# In-memory Junction Coordinators
junction_engines: Dict[str, SignalLogicEngine] = {
    "JNC-MP-088": SignalLogicEngine("JNC-MP-088", SignalTimingConfig(cycle_length_sec=120)),
    "JNC-MP-001": SignalLogicEngine("JNC-MP-001", SignalTimingConfig(cycle_length_sec=110)),
}
detector = SimulatedVideoDetector(seed=42)
tracker = CentroidTracker()

background_task = None


async def junction_telemetry_loop():
    """Background simulator loop updating detection, tracking, signal allocation, and WebSockets."""
    frame_idx = 0
    while True:
        try:
            frame_idx += 1
            # 1. Run detection
            detections = detector.detect(frame_index=frame_idx)

            # 2. Update tracking for priority vehicles
            tracking_events = tracker.update(detections)

            # 3. Aggregate vehicle counts per approach
            counts_by_approach = {"North": {}, "East": {}, "South": {}, "West": {}}
            for d in detections:
                if d.approach in counts_by_approach:
                    counts_by_approach[d.approach][d.class_name] = (
                        counts_by_approach[d.approach].get(d.class_name, 0) + 1
                    )

            # Check priority events from tracker
            engine = junction_engines["JNC-MP-088"]
            for evt in tracking_events:
                if evt.event_type == "ENTERED":
                    engine.trigger_preemption(
                        vehicle_id=f"AMB-IND-{evt.track_id}",
                        vehicle_type=evt.vehicle_type,
                        approach=evt.approach,
                        all_approaches=["North", "East", "South", "West"],
                    )
                elif evt.event_type == "CLEARED":
                    engine.release_preemption()

            # Decrement preemption counter if active
            preempt_state = engine.tick_preemption(seconds_elapsed=1)

            # 4. Calculate Webster-style signal allocation
            recommended_timings = engine.update_traffic(counts_by_approach)

            # 5. Broadcast to connected WebSocket dashboards
            payload = {
                "junction_id": "JNC-MP-088",
                "junction_name": "Rajwada Junction",
                "is_simulated": True,
                "data_source": "Sample Footage / Simulation Engine (Swappable to RTSP)",
                "detection_confidence": 92.4,
                "flow_rate_vph": 1240,
                "avg_speed_kmh": 22,
                "current_phase": "North-South",
                "recommended_green_sec": recommended_timings.get("North", 45),
                "allocated_timings": recommended_timings,
                "approach_volumes": {
                    "North": sum(counts_by_approach["North"].values()),
                    "East": sum(counts_by_approach["East"].values()),
                    "South": sum(counts_by_approach["South"].values()),
                    "West": sum(counts_by_approach["West"].values()),
                },
                "preemption": {
                    "is_active": preempt_state.is_active,
                    "priority_vehicle_id": preempt_state.priority_vehicle_id,
                    "vehicle_type": preempt_state.vehicle_type,
                    "approach": preempt_state.approach,
                    "remaining_seconds": preempt_state.remaining_seconds,
                    "overridden_phases": preempt_state.overridden_phases,
                },
            }

            await manager.broadcast_to_junction("JNC-MP-088", payload)
            await asyncio.sleep(1.0)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[TelemetryLoop Error] {e}")
            await asyncio.sleep(1.0)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db_seeds()
    global background_task
    background_task = asyncio.create_task(junction_telemetry_loop())
    print("[Smart Junction Control] Server initialized & telemetry loop active.")
    yield
    # Shutdown
    if background_task:
        background_task.cancel()


app = FastAPI(
    title="Smart Junction Control API",
    description="Indore Municipal Corporation Smart Traffic Recommendation Engine",
    version="2.4.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "system": "Smart Junction Control",
        "authority": "Indore Municipal Corporation",
        "version": "v2.4.1-stable",
        "status": "online",
        "endpoints": {
            "api_docs": "/docs",
            "junctions": "/api/junctions",
            "history": "/api/history",
            "priority_events": "/api/priority-events",
            "websocket": "/ws/junction/{junction_id}",
        },
    }


@app.websocket("/ws/junction/{junction_id}")
async def websocket_junction_endpoint(websocket: WebSocket, junction_id: str):
    await manager.connect(websocket, junction_id)
    try:
        while True:
            # Client can send overrides or heartbeats
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, junction_id)
