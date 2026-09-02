"""
WebSocket Connection Manager & Gateway.
Broadcasts real-time telemetry, vehicle queues, recommended signal allocations,
and preemption alerts to connected UI dashboards.
"""

from typing import Dict, List
import json
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # junction_id -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, junction_id: str):
        await websocket.accept()
        if junction_id not in self.active_connections:
            self.active_connections[junction_id] = []
        self.active_connections[junction_id].append(websocket)

    def disconnect(self, websocket: WebSocket, junction_id: str):
        if junction_id in self.active_connections:
            if websocket in self.active_connections[junction_id]:
                self.active_connections[junction_id].remove(websocket)

    async def broadcast_to_junction(self, junction_id: str, message: dict):
        if junction_id in self.active_connections:
            payload = json.dumps(message)
            dead_connections = []
            for connection in self.active_connections[junction_id]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                self.disconnect(dead, junction_id)


manager = ConnectionManager()
