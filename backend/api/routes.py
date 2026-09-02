"""
REST API routes for Smart Junction Control.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.db.database import get_db, Base, engine
from backend.db import models
from backend.services.signal_logic import SignalTimingConfig

router = APIRouter(prefix="/api")


# --- Pydantic Schemas ---
class OverrideRequest(BaseModel):
    enabled: bool
    mode: Optional[str] = "ALL_RED"  # ALL_RED, EXTENDED_GREEN


class PreemptionTriggerRequest(BaseModel):
    vehicle_id: str
    vehicle_type: str = "ambulance"
    approach: str = "East"


class SystemTuningRequest(BaseModel):
    confidence_threshold: int
    auto_reset_timer: int


# --- Seed Initial Database Records ---
def init_db_seeds():
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        if db.query(models.Junction).count() == 0:
            seed_junctions = [
                models.Junction(
                    id="JNC-MP-088",
                    name="Rajwada Junction",
                    location="Rajwada North Square",
                    status="Online",
                    cam_status="Online (6/6)",
                    cycle_length_sec=120,
                    min_green_sec=15,
                    max_green_sec=60,
                    detection_confidence=92.4,
                    flow_rate=1240,
                    avg_speed=22,
                ),
                models.Junction(
                    id="JNC-MP-001",
                    name="Palasia Square",
                    location="MG Road / Palasia",
                    status="Online",
                    cam_status="Online (4/4)",
                    cycle_length_sec=110,
                    detection_confidence=88.5,
                    flow_rate=980,
                    avg_speed=28,
                ),
                models.Junction(
                    id="JNC-MP-005",
                    name="Vijay Nagar Square",
                    location="AB Road / Vijay Nagar",
                    status="Online",
                    cam_status="Online (8/8)",
                    cycle_length_sec=130,
                    detection_confidence=94.1,
                    flow_rate=1450,
                    avg_speed=18,
                ),
                models.Junction(
                    id="JNC-MP-042",
                    name="Bhawarkuan Chauraha",
                    location="Bhawarkuan Ring Road",
                    status="Degraded",
                    cam_status="Degraded (3/4)",
                    cycle_length_sec=100,
                    detection_confidence=79.2,
                    flow_rate=720,
                    avg_speed=30,
                ),
                models.Junction(
                    id="JNC-MP-112",
                    name="Geeta Bhawan",
                    location="Geeta Bhawan Square",
                    status="Offline",
                    cam_status="Offline (0/4)",
                    cycle_length_sec=90,
                    detection_confidence=0.0,
                    flow_rate=0,
                    avg_speed=0,
                ),
            ]
            db.add_all(seed_junctions)

        if db.query(models.PriorityEvent).count() == 0:
            seed_events = [
                models.PriorityEvent(
                    id="EVT-992-A4",
                    timestamp="2026-10-24 14:32:05 IST",
                    junction_id="JNC-MP-088",
                    corridor="Rajwada North",
                    vehicle_type="Ambulance",
                    duration="00:01:45",
                    status="Active",
                ),
                models.PriorityEvent(
                    id="EVT-991-B1",
                    timestamp="2026-10-24 10:15:22 IST",
                    junction_id="JNC-MP-001",
                    corridor="Palasia Sq. -> LIG Sq.",
                    vehicle_type="VIP Escort",
                    duration="04m 12s",
                    status="Cleared",
                ),
                models.PriorityEvent(
                    id="EVT-990-C7",
                    timestamp="2026-10-24 08:45:10 IST",
                    junction_id="JNC-MP-042",
                    corridor="Bhawarkuan Junction",
                    vehicle_type="Fire Engine",
                    duration="02m 45s",
                    status="Cleared",
                ),
            ]
            db.add_all(seed_events)

        if db.query(models.SystemSetting).count() == 0:
            db.add(models.SystemSetting(id=1, confidence_threshold=85, auto_reset_timer=120))

        db.commit()
    finally:
        db.close()


# --- Endpoints ---

@router.get("/junctions")
def list_junctions(db: Session = Depends(get_db)):
    """Returns list of monitored junctions."""
    junctions = db.query(models.Junction).all()
    return junctions


@router.get("/junctions/{junction_id}")
def get_junction(junction_id: str, db: Session = Depends(get_db)):
    """Returns detailed configuration and state for a junction."""
    junction = db.query(models.Junction).filter(models.Junction.id == junction_id).first()
    if not junction:
        raise HTTPException(status_code=404, detail="Junction not found")
    return junction


@router.post("/junctions/{junction_id}/override")
def set_manual_override(junction_id: str, req: OverrideRequest, db: Session = Depends(get_db)):
    """Toggles manual override on the recommendation engine."""
    junction = db.query(models.Junction).filter(models.Junction.id == junction_id).first()
    if not junction:
        raise HTTPException(status_code=404, detail="Junction not found")
    return {
        "status": "success",
        "junction_id": junction_id,
        "manual_override": req.enabled,
        "mode": req.mode,
        "message": f"Manual override {'activated' if req.enabled else 'deactivated'} for {junction.name}",
    }


@router.get("/priority-events")
def list_priority_events(db: Session = Depends(get_db)):
    """Audit log of recent priority vehicle preemption events."""
    events = db.query(models.PriorityEvent).order_by(models.PriorityEvent.timestamp.desc()).all()
    return events


@router.post("/priority-events/{event_id}/clear")
def clear_priority_event(event_id: str, db: Session = Depends(get_db)):
    """Marks a priority event as cleared/acknowledged."""
    evt = db.query(models.PriorityEvent).filter(models.PriorityEvent.id == event_id).first()
    if evt:
        evt.status = "Cleared"
        db.commit()
    return {"status": "cleared", "event_id": event_id}


@router.get("/history")
def get_traffic_history():
    """Historical congestion trends and response latency times."""
    return {
        "doc_id": "IMC-REP-8492-A",
        "classification": "OFFICIAL USE",
        "date_range": "Last 24 Hours",
        "hourly_congestion": [
            {"time": "00:00", "congestion": 25},
            {"time": "06:00", "congestion": 35},
            {"time": "09:00", "congestion": 75},
            {"time": "12:00", "congestion": 65},
            {"time": "15:00", "congestion": 55},
            {"time": "18:00", "congestion": 88},
            {"time": "21:00", "congestion": 60},
            {"time": "23:59", "congestion": 30},
        ],
        "priority_response_latency_sec": 14.2,
        "latency_delta_vs_yesterday": -1.4,
    }


@router.get("/system/settings")
def get_system_settings(db: Session = Depends(get_db)):
    """Returns global system tuning parameters."""
    setting = db.query(models.SystemSetting).filter(models.SystemSetting.id == 1).first()
    if not setting:
        return {"confidence_threshold": 85, "auto_reset_timer": 120}
    return {
        "confidence_threshold": setting.confidence_threshold,
        "auto_reset_timer": setting.auto_reset_timer,
    }


@router.post("/system/settings")
def update_system_settings(req: SystemTuningRequest, db: Session = Depends(get_db)):
    """Updates detection confidence threshold and override reset timers."""
    setting = db.query(models.SystemSetting).filter(models.SystemSetting.id == 1).first()
    if not setting:
        setting = models.SystemSetting(id=1)
        db.add(setting)
    setting.confidence_threshold = req.confidence_threshold
    setting.auto_reset_timer = req.auto_reset_timer
    db.commit()
    return {"status": "saved", "confidence_threshold": req.confidence_threshold, "auto_reset_timer": req.auto_reset_timer}
