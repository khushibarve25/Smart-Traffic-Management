import React, { useState, useEffect } from "react";

export default function JunctionControlDashboard({ onLogout, onNavigate }) {
  const [currentTime, setCurrentTime] = useState("");
  const [lastUpdated, setLastUpdated] = useState("12:04:22");
  const [activeNav, setActiveNav] = useState("junction-dashboard");
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));

      if (Math.random() > 0.7) {
        setLastUpdated(now.toLocaleTimeString("en-US", { hour12: false }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "junction-dashboard", label: "JUNCTION DASHBOARD", icon: "dashboard" },
    { id: "city-wide-overview", label: "CITY-WIDE OVERVIEW", icon: "map" },
    { id: "emergency-alerts", label: "EMERGENCY ALERTS", icon: "warning", hasBadge: true },
    { id: "analytics-reports", label: "ANALYTICS & REPORTS", icon: "analytics" },
  ];

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

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.id);
                  if (onNavigate) onNavigate(item.id);
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
            onClick={(e) => {
              e.preventDefault();
              setActiveNav("admin-settings");
            }}
            href="#admin-settings"
          >
            <span className="material-symbols-outlined mr-4">settings</span>
            <span className="font-label-bold text-label-bold">ADMIN & SETTINGS</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-72">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-end px-margin-edge shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-stack-md">
            <div className="text-right flex flex-col">
              <span className="font-label-bold text-label-bold text-on-surface">Operator 402</span>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full uppercase">
                Duty Active
              </span>
            </div>
            <div
              className="w-10 h-10 rounded-full border-2 border-surface-container-high p-0.5 overflow-hidden cursor-pointer"
              title={onLogout ? "Click to switch view / logout" : "Operator Profile"}
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

        {/* Dashboard Main Content */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            <div className="px-margin-edge py-stack-lg flex flex-col gap-stack-lg max-w-container-max mx-auto w-full">
              {/* Header Title & Clock */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="font-headline-lg text-headline-lg text-primary m-0">
                    Rajwada Junction
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant m-0 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Live Operational Status
                  </p>
                </div>
                <div className="flex items-center gap-stack-md bg-surface-container rounded-full px-4 py-2 shadow-sm">
                  <span className="material-symbols-outlined text-outline">calendar_today</span>
                  <span className="font-data-mono text-data-mono text-on-surface" id="current-time">
                    {currentTime || "Loading..."}
                  </span>
                </div>
              </div>

              {/* Grid: Camera Feed + Phase Control */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                {/* Live Camera Feed */}
                <div className="lg:col-span-8 flex flex-col relative rounded-xl overflow-hidden shadow-md bg-surface-container-lowest group">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-label-bold text-label-bold text-white uppercase tracking-wider">
                      Live Feed Feed 01
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      aria-label="Zoom in"
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <span className="material-symbols-outlined">zoom_in</span>
                    </button>
                    <button
                      aria-label="Fullscreen"
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                    >
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                  <img
                    alt="High angle live traffic camera feed looking down at a busy intersection in Indore, India. Dense traffic with a mix of cars, auto-rickshaws, and two-wheelers."
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL8to9NTJXYjtuj6FOJHUyP39KlDTlXnbVQfLSU0j-EPvapIXYavOvRe-ZrE5dVMSwxNcBAhbb5O-TLwr4-btAwbfGIZmHqQb3QcODN8ndxtf8ZN6aq_qk-MZhTCpZRNla7ucvi3EivwXIGf8TG8QArfxDxOmmgY9a9t9f6d6FxAWsdNVxrqGZ2EkgnMzQNi_mSbQnLOXNepQJH7p77Cpk79TTIAuygCmzr-n55LS9gzPEOqV-qchY-A"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-white/70 uppercase">
                        Detection Confidence
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-[92%]" />
                        </div>
                        <span className="font-data-mono text-data-mono text-white">92.4%</span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-white">
                      <div className="flex flex-col items-end">
                        <span className="font-label-sm text-label-sm text-white/70 uppercase">
                          Flow Rate
                        </span>
                        <span className="font-data-mono text-data-mono">1,240 v/h</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-label-sm text-label-sm text-white/70 uppercase">
                          Avg Speed
                        </span>
                        <span className="font-data-mono text-data-mono">22 km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Control Box */}
                <div className="lg:col-span-4 flex flex-col gap-gutter">
                  <div className="bg-primary text-on-primary rounded-xl p-stack-md shadow-md flex flex-col justify-between relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm m-0">Phase Control</h2>
                        <p className="font-label-sm text-label-sm text-on-primary/70 uppercase tracking-wide mt-1">
                          Currently Active: North-South
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-3xl">traffic</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-6 relative z-10">
                      <span className="font-label-bold text-label-bold text-on-primary/80 uppercase mb-2">
                        Recommended Green
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display-lg text-display-lg font-bold tabular-nums">45</span>
                        <span className="font-body-lg text-body-lg text-on-primary/70">s</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-on-primary/10 relative z-10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-bold text-label-bold">Manual Override</span>
                        <span className="font-label-sm text-label-sm text-on-primary/60">
                          Takes precedence
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          checked={manualOverride}
                          onChange={(e) => setManualOverride(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Queue Density + Anomalies */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {/* Queue Density Chart */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-stack-md shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline-sm text-headline-sm text-primary m-0">
                      Queue Density
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                      Vehicles per Approach
                    </span>
                  </div>
                  <div className="flex items-end justify-around h-48 mt-4 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-outline-variant w-full h-px" />
                      <div className="border-b border-outline-variant w-full h-px" />
                      <div className="border-b border-outline-variant w-full h-px" />
                      <div className="border-b border-outline-variant w-full h-px" />
                    </div>

                    {/* North */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                      <span className="font-data-mono text-data-mono text-on-surface-variant group-hover:text-primary transition-colors">
                        42
                      </span>
                      <div className="w-full bg-primary/20 rounded-t-sm relative h-32 group-hover:bg-primary/30 transition-colors">
                        <div
                          className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-1000"
                          style={{ height: "75%" }}
                        />
                      </div>
                      <span className="font-label-bold text-label-bold text-on-surface">North</span>
                    </div>

                    {/* East */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                      <span className="font-data-mono text-data-mono text-secondary group-hover:text-secondary-container transition-colors">
                        86
                      </span>
                      <div className="w-full bg-secondary/20 rounded-t-sm relative h-40 group-hover:bg-secondary/30 transition-colors">
                        <div
                          className="absolute bottom-0 w-full bg-secondary rounded-t-sm transition-all duration-1000"
                          style={{ height: "95%" }}
                        />
                      </div>
                      <span className="font-label-bold text-label-bold text-on-surface">East</span>
                    </div>

                    {/* South */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                      <span className="font-data-mono text-data-mono text-on-surface-variant group-hover:text-primary transition-colors">
                        24
                      </span>
                      <div className="w-full bg-primary/20 rounded-t-sm relative h-20 group-hover:bg-primary/30 transition-colors">
                        <div
                          className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-1000"
                          style={{ height: "40%" }}
                        />
                      </div>
                      <span className="font-label-bold text-label-bold text-on-surface">South</span>
                    </div>

                    {/* West */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                      <span className="font-data-mono text-data-mono text-on-surface-variant group-hover:text-primary transition-colors">
                        31
                      </span>
                      <div className="w-full bg-primary/20 rounded-t-sm relative h-24 group-hover:bg-primary/30 transition-colors">
                        <div
                          className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-1000"
                          style={{ height: "60%" }}
                        />
                      </div>
                      <span className="font-label-bold text-label-bold text-on-surface">West</span>
                    </div>
                  </div>
                </div>

                {/* Anomalies Detected */}
                <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary m-0 mb-4">
                      Anomalies Detected
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 p-3 bg-error-container/30 rounded-lg">
                        <span
                          className="material-symbols-outlined text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          warning
                        </span>
                        <div>
                          <p className="font-label-bold text-label-bold text-on-surface m-0">
                            Stalled Vehicle - East Approach
                          </p>
                          <p className="font-body-md text-body-md text-on-surface-variant m-0 text-sm">
                            Detected 2m ago. Queue building.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                        <span
                          className="material-symbols-outlined text-outline"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          info
                        </span>
                        <div>
                          <p className="font-label-bold text-label-bold text-on-surface m-0">
                            Pedestrian Density High
                          </p>
                          <p className="font-body-md text-body-md text-on-surface-variant m-0 text-sm">
                            Adjusting crossing phase duration.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-surface hover:bg-surface-container-high text-primary font-label-bold text-label-bold uppercase rounded border border-primary/20 transition-colors">
                    View All Logs
                  </button>
                </div>
              </div>

              {/* Bottom System Status Bar */}
              <div className="bg-primary rounded-lg p-3 flex items-center justify-between text-on-primary shadow-sm mt-stack-md flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary/80">
                      Feed Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary/80">
                      Model Running
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary/80">
                      Edge Latency: 42ms
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-primary/50 text-sm">sync</span>
                  <span className="font-data-mono text-data-mono text-on-primary/80">
                    Last Updated: <span id="last-updated">{lastUpdated}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
