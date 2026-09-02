import React, { useState, useEffect } from "react";

export default function EmergencyPriority({ onNavigate, onLogout }) {
  const [activeNav, setActiveNav] = useState("emergency-alerts");
  const [countdown, setCountdown] = useState(42);
  const [isCleared, setIsCleared] = useState(false);
  const [vehicleId, setVehicleId] = useState("AMB-IND-742");
  const [events, setEvents] = useState([]);

  // Fetch priority events from REST API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/priority-events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, []);

  // Live WebSocket updates
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket("ws://127.0.0.1:8000/ws/junction/JNC-MP-088");
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.preemption) {
            if (data.preemption.is_active && !isCleared) {
              setCountdown(data.preemption.remaining_seconds || 42);
              if (data.preemption.priority_vehicle_id) {
                setVehicleId(data.preemption.priority_vehicle_id);
              }
            }
          }
        } catch (err) {}
      };
    } catch (e) {}

    return () => {
      if (ws) ws.close();
    };
  }, [isCleared]);

  // Fallback countdown if WS paused
  useEffect(() => {
    if (isCleared) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCleared]);

  const handleAcknowledgeAndClear = async () => {
    setIsCleared(true);
    try {
      await fetch("http://127.0.0.1:8000/api/priority-events/EVT-992-A4/clear", {
        method: "POST",
      });
    } catch (e) {}
  };

  const navItems = [
    { id: "junction-dashboard", label: "JUNCTION DASHBOARD", icon: "dashboard" },
    { id: "city-wide-overview", label: "CITY-WIDE OVERVIEW", icon: "map" },
    { id: "emergency-alerts", label: "EMERGENCY ALERTS", icon: "warning", hasBadge: true },
    { id: "analytics-reports", label: "ANALYTICS & REPORTS", icon: "analytics" },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const formattedCountdown = `00:${countdown.toString().padStart(2, "0")}`;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-primary z-50 flex flex-col shadow-xl">
        <div className="p-stack-lg border-b border-on-primary/10 flex items-center gap-stack-md">
          <img
            alt="IMC Official Crest"
            className="h-10 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUyfZ6VHyAjtSH-M__FTNUz0zaI3UDyDJD16Kb8pb5nMq44LLpHtDGXclsq2ifgqH0IKT0JLnJlhC49bw8axbGY446RKfu4ybCrLBBMBrf5ErUOpfioXrrtTGG7RGOPN34jIzUFewIB2Jl_BAhjEs6KYgmzlLus1_DxOfeSzCAZwQoIMXA1zeoLNF2VEwG6PqKDy_T91MxifV40LUscYYAQWeQzTuC1jhoeDMpTWrNzrz2BUlk0Mu_SA"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-primary leading-tight">
              Smart Junction
            </span>
            <span className="font-label-sm text-label-sm text-on-primary/70 tracking-widest uppercase">
              Control Centre
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`flex items-center px-4 py-3 transition-all group relative ${
                  isActive
                    ? "bg-on-primary/10 text-on-primary border-l-4 border-secondary"
                    : "text-on-primary/70 hover:text-on-primary hover:bg-on-primary/5"
                }`}
              >
                <span className="material-symbols-outlined mr-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-label-bold text-label-bold">{item.label}</span>
                {item.hasBadge && (
                  <span className="absolute right-4 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#b12d00]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Admin & Settings */}
        <div className="px-4 py-8 border-t border-on-primary/10">
          <a
            className="flex items-center px-4 py-3 text-on-primary/70 hover:text-on-primary transition-all group cursor-pointer"
            href="#admin-settings"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("admin-settings");
            }}
          >
            <span className="material-symbols-outlined mr-4">settings</span>
            <span className="font-label-bold text-label-bold">ADMIN & SETTINGS</span>
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-between px-margin-edge shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <span className="bg-secondary/15 text-secondary text-[11px] font-label-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" /> Preemption System
              Active
            </span>
            <span className="text-[11px] text-on-surface-variant font-data-mono hidden md:inline">
              Simulated Tracking Stream (Swappable to Live RTSP Feed)
            </span>
          </div>

          <div className="flex items-center gap-stack-md">
            <div className="text-right flex flex-col">
              <span className="font-label-bold text-label-bold text-on-surface">Operator 402</span>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full uppercase">
                Duty Active
              </span>
            </div>
            <div
              className="w-10 h-10 rounded-full border-2 border-surface-container-high p-0.5 overflow-hidden cursor-pointer"
              title={onLogout ? "Logout" : "Operator Profile"}
              onClick={onLogout}
            >
              <img
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAakESKWz4xtLO62LDcrx_3P4IczKWXVtzyKlmVIK3K3EWbkPY4cko0NDlwmFOunMfWxQUn07Fe7iBhPMrkIKy-RECXEmvtrqh9pOXn3wJRw29t1hy-WFCCGb_vzfzdxsA4Pi0on15KxjdzwqKLwoCwVI_jXIm7tWdibYHSJ9frPHQpmB_zywGJMp4cPFfMoHpaankju6qDk0g-OWpiEoQBVCo56LNT5GB2k9LWBq4Qj_-wRsmFWlsisw"
              />
            </div>
          </div>
        </header>

        {/* Emergency Dashboard Content */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full p-stack-lg gap-stack-lg">
            {/* Emergency Alert Banner */}
            {!isCleared ? (
              <div className="relative bg-secondary overflow-hidden rounded-xl shadow-xl flex items-center justify-between p-stack-lg text-on-secondary animate-[pulse_2s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwUzAgMzEuMDQ2IDAgMjAgOC45NTQgMCAyMCAwczIwIDguOTU0IDIwIDIwem0wIDBjMC01LjUyMy00LjQ3Ny0xMC0xMC0xMFMxMCAxNC40NzcgMTAgMjBzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTB6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-20" />
                <div className="relative z-10 flex items-center gap-gutter">
                  <div className="bg-on-secondary/20 p-4 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <span
                      className="material-symbols-outlined text-[48px] animate-bounce text-on-secondary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      emergency_home
                    </span>
                  </div>
                  <div>
                    <span className="block font-label-bold text-label-bold tracking-widest text-on-secondary/80 uppercase mb-2">
                      Priority Override Active
                    </span>
                    <h1 className="font-display-lg text-display-lg leading-none m-0 text-on-secondary">
                      EMERGENCY VEHICLE DETECTED
                    </h1>
                    <p className="font-headline-sm text-headline-sm text-on-secondary/90 mt-2">
                      RAJWADA NORTH JUNCTION - SECTOR 4
                    </p>
                  </div>
                </div>
                <div className="relative z-10 text-right flex flex-col items-end gap-2">
                  <span className="font-label-bold text-label-bold tracking-widest text-on-secondary/80 uppercase">
                    Preemption Ends In
                  </span>
                  <div
                    className="font-data-mono text-[64px] font-bold leading-none tabular-nums text-on-secondary"
                    id="countdown"
                  >
                    {formattedCountdown}
                  </div>
                  <button
                    onClick={handleAcknowledgeAndClear}
                    className="mt-4 px-6 py-3 bg-on-secondary text-secondary font-label-bold text-label-bold uppercase rounded hover:bg-surface-container transition-colors shadow-md active:scale-95"
                  >
                    Acknowledge & Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-surface-container-high border border-outline-variant rounded-xl shadow-md flex items-center justify-between p-stack-lg text-on-surface">
                <div className="flex items-center gap-stack-md">
                  <span className="material-symbols-outlined text-primary text-[36px]">
                    check_circle
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm m-0">Preemption Cleared</h2>
                    <p className="font-body-md text-on-surface-variant m-0">
                      Standard phase timings restored to Rajwada North Junction. All-red safely cleared.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCleared(false);
                    setCountdown(42);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded font-label-bold text-label-bold uppercase"
                >
                  Simulate Trigger
                </button>
              </div>
            )}

            {/* Details and Map Split */}
            <div className="grid grid-cols-12 gap-gutter">
              {/* Map Live Routing Overlay */}
              <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl shadow-md p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
                    Live Routing Overlay
                  </h2>
                  <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" /> Live Tracking
                  </span>
                </div>
                <div
                  className="flex-1 rounded-lg overflow-hidden relative shadow-inner min-h-[400px] bg-cover bg-center"
                  data-location="Rajwada, Indore, India"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwznsGTP61Ymmdf_QqQmrqSZt6SRj1cZ8cxGgzW6mlaHcBc14SqbSPN9sYEVZtYYf3XxkZHIwYrUgWEem2jm7zrwTdwWMxJuwXVQhIZuhmEaVUtaqQYQvlNknSOBGTpwMMr6xaXx2i0tVdYROjdXV-Ck9QByT6Ry9LDF1a1XJoH6mMy1VPErjrdS-fEiwmh1MYtKAiM8f47iVcRiCp7ObG-9TsfzzsRv1yMuQsYENRWuB52RP_QrAbdw')`,
                  }}
                >
                  {/* SVG Animated Route */}
                  <div className="absolute inset-0 bg-surface/10 backdrop-blur-[2px] pointer-events-none">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
                      <path
                        className="animate-[dash_2s_linear_infinite]"
                        d="M 100,350 Q 250,200 400,200 T 700,50"
                        fill="none"
                        stroke="#ba1a1a"
                        strokeDasharray="10,10"
                        strokeWidth="4"
                      />
                      <circle className="animate-pulse" cx="700" cy="50" fill="#ba1a1a" r="8" />
                      <circle cx="100" cy="350" fill="#1a2456" r="12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Intersection Status & Telemetry */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-gutter">
                {/* Signal Overrides */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-stack-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">
                    Signal Overrides
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">traffic</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          North Bound
                        </span>
                      </div>
                      <span className="font-label-bold text-label-bold text-error uppercase">
                        Forced Red
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded border border-primary/20">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">traffic</span>
                        <span className="font-body-md text-body-md text-primary font-medium">
                          East Bound (Approach)
                        </span>
                      </div>
                      <span className="font-label-bold text-label-bold text-primary uppercase">
                        Extended Green
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">traffic</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          South Bound
                        </span>
                      </div>
                      <span className="font-label-bold text-label-bold text-error uppercase">
                        Forced Red
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">traffic</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          West Bound
                        </span>
                      </div>
                      <span className="font-label-bold text-label-bold text-error uppercase">
                        Forced Red
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Telemetry */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-stack-md flex-1">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    Vehicle Telemetry
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">
                        Est. Speed
                      </span>
                      <span className="font-data-mono text-[24px] font-semibold text-on-surface">
                        54 km/h
                      </span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">
                        Distance to Jct
                      </span>
                      <span className="font-data-mono text-[24px] font-semibold text-on-surface">
                        1.2 km
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                        Unit ID
                      </span>
                      <span className="font-data-mono text-body-md text-on-surface bg-surface-container px-2 py-1 rounded">
                        {vehicleId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-surface-container-low flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
                  Recent Priority Events
                </h2>
                <button
                  onClick={() => alert("Exporting priority events...")}
                  className="text-primary font-label-bold text-label-bold uppercase hover:bg-primary/5 px-3 py-1 rounded transition-colors"
                >
                  Export Log
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-variant/50 text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider">
                      <th className="p-4 font-medium">Timestamp</th>
                      <th className="p-4 font-medium">Vehicle Type</th>
                      <th className="p-4 font-medium">Corridor / Junction</th>
                      <th className="p-4 font-medium">Duration</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md text-on-surface">
                    {events.length > 0 ? (
                      events.map((evt) => (
                        <tr
                          key={evt.id}
                          className="border-b border-surface-variant/50 hover:bg-surface-container/30 transition-colors"
                        >
                          <td className="p-4 font-data-mono text-on-surface-variant">
                            {evt.timestamp}
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px] text-error">
                                {evt.vehicle_type === "Ambulance"
                                  ? "local_hospital"
                                  : evt.vehicle_type === "VIP Escort"
                                  ? "local_police"
                                  : "fire_truck"}
                              </span>{" "}
                              {evt.vehicle_type}
                            </span>
                          </td>
                          <td className="p-4">{evt.corridor}</td>
                          <td className="p-4 font-data-mono">{evt.duration}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                                evt.status === "Active"
                                  ? "bg-error-container text-on-error-container"
                                  : "bg-surface-variant text-on-surface-variant"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  evt.status === "Active" ? "bg-error" : "bg-outline"
                                }`}
                              />{" "}
                              {evt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-surface-variant/50">
                        <td colSpan="5" className="p-4 text-center text-on-surface-variant">
                          No events recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
