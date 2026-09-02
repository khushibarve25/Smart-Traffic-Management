import pytest
from backend.services.signal_logic import (
    calculate_pcu,
    allocate_proportional_green,
    SignalTimingConfig,
    SignalLogicEngine,
)


def test_calculate_pcu_mixed_traffic():
    """Verify PCU calculations match Indian Road Congress (IRC) standards."""
    counts = {
        "car": 10,           # 10 * 1.0 = 10.0
        "bus": 2,            # 2 * 3.0 = 6.0
        "truck": 1,          # 1 * 3.0 = 3.0
        "auto-rickshaw": 5,  # 5 * 1.2 = 6.0
        "two-wheeler": 12,   # 12 * 0.5 = 6.0
    }
    pcu = calculate_pcu(counts)
    assert pcu == 31.0


def test_calculate_pcu_aliases():
    """Verify PCU handles alias names like autorickshaw and motorcycle."""
    counts = {
        "auto": 2,           # 2 * 1.2 = 2.4
        "motorcycle": 4,     # 4 * 0.5 = 2.0
    }
    assert calculate_pcu(counts) == 4.4


def test_allocate_proportional_green_bounds():
    """Verify allocated green times respect min_green and max_green bounds."""
    config = SignalTimingConfig(
        cycle_length_sec=120,
        lost_time_per_phase_sec=5,
        min_green_sec=15,
        max_green_sec=60,
    )
    # North is completely empty, East has massive traffic
    approach_pcus = {
        "North": 0.0,
        "East": 100.0,
        "South": 15.0,
        "West": 25.0,
    }
    timings = allocate_proportional_green(approach_pcus, config)

    # Every phase must be at least min_green and at most max_green
    for app, sec in timings.items():
        assert sec >= config.min_green_sec, f"{app} green {sec} < min {config.min_green_sec}"
        assert sec <= config.max_green_sec, f"{app} green {sec} > max {config.max_green_sec}"

    # East should get maximum allocation because of high demand
    assert timings["East"] >= timings["West"]
    assert timings["West"] >= timings["South"]
    assert timings["North"] == config.min_green_sec


def test_allocate_proportional_green_zero_traffic():
    """Verify graceful handling when no traffic is detected."""
    config = SignalTimingConfig(cycle_length_sec=100, min_green_sec=15, max_green_sec=50)
    approach_pcus = {"North": 0.0, "South": 0.0, "East": 0.0, "West": 0.0}
    timings = allocate_proportional_green(approach_pcus, config)

    for app, sec in timings.items():
        assert sec >= config.min_green_sec


def test_preemption_lifecycle():
    """Verify preemption trigger, countdown ticks, and vehicle clearance release."""
    engine = SignalLogicEngine(
        junction_id="JNC-MP-088",
        config=SignalTimingConfig(preemption_duration_sec=30),
    )
    all_approaches = ["North", "East", "South", "West"]

    # 1. Trigger preemption for an Ambulance coming from East
    state = engine.trigger_preemption(
        vehicle_id="AMB-IND-742",
        vehicle_type="ambulance",
        approach="East",
        all_approaches=all_approaches,
    )
    assert state.is_active is True
    assert state.priority_vehicle_id == "AMB-IND-742"
    assert state.remaining_seconds == 30
    assert "North" in state.overridden_phases
    assert "South" in state.overridden_phases
    assert "West" in state.overridden_phases
    assert "East" not in state.overridden_phases

    # 2. Tick countdown
    state = engine.tick_preemption(seconds_elapsed=10)
    assert state.remaining_seconds == 20
    assert state.is_active is True

    # 3. Vehicle clears junction early -> manual/tracker release
    state = engine.release_preemption()
    assert state.is_active is False
    assert state.remaining_seconds == 0
    assert state.overridden_phases == []


def test_preemption_auto_expiration():
    """Verify preemption automatically releases when remaining seconds reach 0."""
    engine = SignalLogicEngine(
        junction_id="JNC-MP-088",
        config=SignalTimingConfig(preemption_duration_sec=5),
    )
    engine.trigger_preemption(
        vehicle_id="VIP-01",
        vehicle_type="vip-vehicle",
        approach="North",
        all_approaches=["North", "South"],
    )
    # Tick past the duration
    state = engine.tick_preemption(seconds_elapsed=6)
    assert state.is_active is False
    assert state.remaining_seconds == 0
