"""
SQLAlchemy models for Smart Junction Control storage.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from backend.db.database import Base


class Junction(Base):
    __tablename__ = "junctions"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "JNC-MP-088"
    name = Column(String(100), nullable=False)             # e.g. "Rajwada Junction"
    location = Column(String(100), nullable=False)
    status = Column(String(20), default="Online")          # Online, Degraded, Offline
    cam_status = Column(String(50), default="Online (6/6)")
    cycle_length_sec = Column(Integer, default=120)
    min_green_sec = Column(Integer, default=15)
    max_green_sec = Column(Integer, default=60)
    detection_confidence = Column(Float, default=92.4)
    flow_rate = Column(Integer, default=1240)
    avg_speed = Column(Integer, default=22)


class PriorityEvent(Base):
    __tablename__ = "priority_events"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "EVT-992-A4"
    timestamp = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    junction_id = Column(String(50), index=True)
    corridor = Column(String(100))
    vehicle_type = Column(String(50))                      # Ambulance, VIP Escort, Fire Engine
    duration = Column(String(50))                          # e.g. "00:01:45"
    status = Column(String(20), default="Active")          # Active, Cleared


class TrafficHistory(Base):
    __tablename__ = "traffic_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    junction_id = Column(String(50), index=True)
    time_slot = Column(String(20))                         # e.g. "00:00", "06:00", "12:00"
    congestion_index = Column(Float, default=50.0)
    response_latency_sec = Column(Float, default=14.2)


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, default=1)
    confidence_threshold = Column(Integer, default=85)
    auto_reset_timer = Column(Integer, default=120)
