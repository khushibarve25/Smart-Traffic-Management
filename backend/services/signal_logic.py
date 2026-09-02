"""
Signal Logic Module for Smart Junction Control.
Implements:
1. PCU-weighted vehicle count aggregation (Indian Road Congress standard).
2. Webster-style proportional green-time allocation with min/max bounds.
3. Emergency preemption interrupt layer for priority vehicles (Ambulance, VIP Escort).
"""

from typing import Dict, List, Optional, Tuple
from pydantic import BaseModel, Field


# Standard PCU weights (IRC: 106-1990)
PCU_WEIGHTS: Dict[str, float] = {
    "car": 1.0,
    "bus": 3.0,
    "truck": 3.0,
    "auto-rickshaw": 1.2,
    "two-wheeler": 0.5,
    "ambulance": 1.0,  # Subject to preemption logic
    "vip-vehicle": 1.0, # Subject to preemption logic
}


class ApproachVolume(BaseModel):
    approach: str
    vehicle_counts: Dict[str, int] = Field(default_factory=dict)
    pcu: float = 0.0


class SignalTimingConfig(BaseModel):
    cycle_length_sec: int = 120
    lost_time_per_phase_sec: int = 5  # Yellow + All-red transition
    min_green_sec: int = 15
    max_green_sec: int = 60
    preemption_duration_sec: int = 45


class PreemptionState(BaseModel):
    is_active: bool = False
    priority_vehicle_id: Optional[str] = None
    vehicle_type: Optional[str] = None
    approach: Optional[str] = None
    remaining_seconds: int = 0
    overridden_phases: List[str] = Field(default_factory=list)


def calculate_pcu(vehicle_counts: Dict[str, int]) -> float:
    """Calculates total PCU (Passenger Car Units) for a dictionary of vehicle counts."""
    total_pcu = 0.0
    for vehicle_type, count in vehicle_counts.items():
        if count <= 0:
            continue
        normalized_type = vehicle_type.lower().strip()
        # Aliases
        if normalized_type in ("autorickshaw", "auto"):
            normalized_type = "auto-rickshaw"
        elif normalized_type in ("twowheeler", "motorcycle", "bike", "scooter"):
            normalized_type = "two-wheeler"
        elif normalized_type in ("vip", "vip_vehicle"):
            normalized_type = "vip-vehicle"

        weight = PCU_WEIGHTS.get(normalized_type, 1.0)
        total_pcu += count * weight
    return round(total_pcu, 2)


def allocate_proportional_green(
    approach_pcus: Dict[str, float],
    config: Optional[SignalTimingConfig] = None,
) -> Dict[str, int]:
    """
    Allocates green time proportionally across phases based on PCU queue demand,
    strictly bounding each phase between min_green and max_green.
    """
    if config is None:
        config = SignalTimingConfig()

    num_phases = max(1, len(approach_pcus))
    total_lost_time = num_phases * config.lost_time_per_phase_sec
    available_green = max(num_phases * config.min_green_sec, config.cycle_length_sec - total_lost_time)

    total_pcu = sum(approach_pcus.values())

    # Fallback to equal split if no vehicle volume detected
    if total_pcu <= 0:
        equal_green = max(config.min_green_sec, available_green // num_phases)
        return {app: equal_green for app in approach_pcus}

    # Initial proportional distribution
    allocated: Dict[str, float] = {}
    for app, pcu in approach_pcus.items():
        ratio = pcu / total_pcu
        raw_green = ratio * available_green
        allocated[app] = max(float(config.min_green_sec), min(float(config.max_green_sec), raw_green))

    # Second pass: normalize to match total available green
    current_sum = sum(allocated.values())
    if current_sum != available_green:
        scale_factor = available_green / max(1.0, current_sum)
        result = {}
        for app, val in allocated.items():
            bounded = max(config.min_green_sec, min(config.max_green_sec, int(round(val * scale_factor))))
            result[app] = bounded
        return result

    return {app: int(round(val)) for app, val in allocated}


class SignalLogicEngine:
    """Stateful coordinator for junction timing recommendations & emergency interrupts."""

    def __init__(self, junction_id: str, config: Optional[SignalTimingConfig] = None):
        self.junction_id = junction_id
        self.config = config or SignalTimingConfig()
        self.preemption_state = PreemptionState()
        self.current_phase: str = "North-South"
        self.last_recommended_timings: Dict[str, int] = {}

    def update_traffic(self, approach_counts: Dict[str, Dict[str, int]]) -> Dict[str, int]:
        """Processes new vehicle counts, recomputes PCUs, and returns recommended green seconds."""
        pcus = {}
        for approach, counts in approach_counts.items():
            pcus[approach] = calculate_pcu(counts)

        timings = allocate_proportional_green(pcus, self.config)
        self.last_recommended_timings = timings
        return timings

    def trigger_preemption(
        self,
        vehicle_id: str,
        vehicle_type: str,
        approach: str,
        all_approaches: List[str],
    ) -> PreemptionState:
        """
        Activates preemption for an emergency or VIP unit.
        Forces conflicting directions to Red and extends Green for the approach corridor.
        """
        overridden = [app for app in all_approaches if app != approach]
        self.preemption_state = PreemptionState(
            is_active=True,
            priority_vehicle_id=vehicle_id,
            vehicle_type=vehicle_type,
            approach=approach,
            remaining_seconds=self.config.preemption_duration_sec,
            overridden_phases=overridden,
        )
        return self.preemption_state

    def tick_preemption(self, seconds_elapsed: int = 1) -> PreemptionState:
        """Decrements remaining preemption seconds, automatically releasing when zero."""
        if not self.preemption_state.is_active:
            return self.preemption_state

        new_remaining = max(0, self.preemption_state.remaining_seconds - seconds_elapsed)
        self.preemption_state.remaining_seconds = new_remaining

        if new_remaining <= 0:
            self.release_preemption()

        return self.preemption_state

    def release_preemption(self) -> PreemptionState:
        """Releases active preemption, resuming standard adaptive cycle."""
        self.preemption_state = PreemptionState(
            is_active=False,
            priority_vehicle_id=None,
            vehicle_type=None,
            approach=None,
            remaining_seconds=0,
            overridden_phases=[],
        )
        return self.preemption_state
