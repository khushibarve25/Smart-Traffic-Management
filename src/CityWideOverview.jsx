import React, { useState } from "react";

export default function CityWideOverview({ onNavigate, onLogout }) {
  const [activeNav, setActiveNav] = useState("city-wide-overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [broadcastActive, setBroadcastActive] = useState(false);

  const navItems = [
    { id: "junction-dashboard", label: "JUNCTION DASHBOARD", icon: "dashboard" },
    { id: "city-wide-overview", label: "CITY-WIDE OVERVIEW", icon: "map" },
    { id: "emergency-alerts", label: "EMERGENCY ALERTS", icon: "warning", hasBadge: true },
    { id: "analytics-reports", label: "ANALYTICS & REPORTS", icon: "analytics" },
  ];

  const junctions = [
    {
      id: "VN-01-M",
      name: "Vijay Nagar Square",
      status: "critical",
      congestion: 92,
      queueLength: "1.2",
      waitTime: "420",
      top: "30%",
      left: "45%",
    },
    {
      id: "PL-04-E",
      name: "Palasia Square",
      status: "warning",
      congestion: 68,
      queueLength: "0.6",
      waitTime: "185",
      top: "45%",
      left: "55%",
    },
    {
      id: "TW-11-S",
      name: "Tower Square",
      status: "optimal",
      congestion: 32,
      queueLength: "0.2",
      waitTime: "45",
      top: "60%",
      left: "40%",
    },
    {
      id: "BK-08-W",
      name: "Bhawarkuan Square",
      status: "optimal",
      congestion: 41,
      queueLength: "0.3",
      waitTime: "62",
      top: "68%",
      left: "48%",
    },
  ];

  const filteredJunctions = junctions.filter(
    (j) =>
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (onNavigate) {
      onNavigate(id);
    }
  };

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

      {/* Main Area */}
      <div className="pl-72">
        {/* Header */}
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

        {/* Content Container */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full h-full relative">
            <div className="flex flex-1 h-[calc(100vh-64px)] w-full">
              {/* Map Container */}
              <div className="flex-1 relative bg-surface-container overflow-hidden rounded-r-xl shadow-lg z-10">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  data-location="Indore, India, City View with Junctions"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAixbAjUP0PPGkt2dcQyBL1QcI-TmrQA3TLVjqEPRlQwpc1Lt3rA4FX3BvLV2MMHjjKbaqFTNmK1bkWIZeAGSeap45HZeErc59sRRl1WORDTaahZ_LUemhv8jGHUtg7G66WmTRiOsZ741lO6wdq60uMgLauLdER3UUg_X-m7Fcqz59YWkraU9ezwliZlKwx_UEw_S_6NG8n-d3rdFDsqlMv522hPCeWluBb3KqwAPgk55qPZ9mPMzo3-w')`,
                  }}
                >
                  {/* Overlay UI elements ON TOP of map */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-20 flex flex-col justify-between p-stack-lg">
                    {/* Top Controls: Legend & Broadcast */}
                    <div className="flex justify-between items-start w-full">
                      {/* Legend */}
                      <div className="pointer-events-auto bg-surface/95 backdrop-blur-sm p-stack-md rounded-xl shadow-md border border-outline/10 flex flex-col gap-stack-sm w-48">
                        <span className="font-label-bold text-label-bold text-on-surface uppercase tracking-wider">
                          Congestion Index
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-error flex-shrink-0 animate-pulse" />
                          <span className="font-body-md text-body-md text-on-surface-variant flex-1 truncate">
                            Severe (&gt;85%)
                          </span>
                          <span className="font-data-mono text-data-mono text-on-surface">3</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-secondary-container flex-shrink-0" />
                          <span className="font-body-md text-body-md text-on-surface-variant flex-1 truncate">
                            Moderate (50-84%)
                          </span>
                          <span className="font-data-mono text-data-mono text-on-surface">8</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-surface-tint flex-shrink-0" />
                          <span className="font-body-md text-body-md text-on-surface-variant flex-1 truncate">
                            Optimal (&lt;50%)
                          </span>
                          <span className="font-data-mono text-data-mono text-on-surface">14</span>
                        </div>
                      </div>

                      {/* Global Action */}
                      <button
                        onClick={() => {
                          setBroadcastActive(true);
                          setTimeout(() => setBroadcastActive(false), 2000);
                        }}
                        className={`pointer-events-auto bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors px-gutter py-stack-sm rounded-full font-label-bold text-label-bold shadow-md flex items-center gap-2 ${
                          broadcastActive ? "ring-2 ring-error" : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">emergency_share</span>
                        {broadcastActive ? "BROADCASTING..." : "BROADCAST ALL"}
                      </button>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="pointer-events-auto w-full max-w-2xl mx-auto bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg border border-outline-variant/20 p-2 flex items-center gap-gutter overflow-hidden">
                      <div className="flex-shrink-0 bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-bold text-label-bold uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                        Live Feed Active
                      </div>
                      <div className="flex-1 flex items-center gap-stack-md whitespace-nowrap overflow-x-auto no-scrollbar">
                        <span className="font-data-mono text-data-mono text-on-surface-variant">
                          Last Update: <span className="text-on-surface font-semibold">14:02:45 IST</span>
                        </span>
                        <span className="text-outline-variant/50">|</span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant">
                          Total Volume: <span className="text-on-surface font-semibold">42,891 veh/hr</span>
                        </span>
                        <span className="text-outline-variant/50">|</span>
                        <span className="font-data-mono text-data-mono text-on-surface-variant">
                          Anomalies Detected: <span className="text-error font-semibold">2</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Synthetic Map Markers */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-10" id="map-markers-layer">
                    {/* Marker 1: Severe (Vijay Nagar) */}
                    <button
                      aria-label="Vijay Nagar Square"
                      onClick={() => setSelectedJunction("VN-01-M")}
                      style={{ top: "30%", left: "45%" }}
                      className="absolute pointer-events-auto group focus:outline-none -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 hover:z-50 cursor-pointer"
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-error rounded-full opacity-40 animate-ping" />
                        <div className="relative w-4 h-4 bg-error rounded-full shadow-[0_0_12px_rgba(186,26,26,0.8)] border-2 border-surface-container-lowest" />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest rounded-lg shadow-xl p-3 w-48 pointer-events-none">
                        <div className="font-label-bold text-label-bold text-on-surface mb-1">
                          VIJAY NAGAR SQ
                        </div>
                        <div className="flex justify-between text-body-md font-body-md text-on-surface-variant">
                          <span>Congestion:</span>
                          <span className="text-error font-semibold">92%</span>
                        </div>
                      </div>
                    </button>

                    {/* Marker 2: Moderate (Palasia) */}
                    <button
                      aria-label="Palasia Square"
                      onClick={() => setSelectedJunction("PL-04-E")}
                      style={{ top: "45%", left: "55%" }}
                      className="absolute pointer-events-auto group focus:outline-none -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 hover:z-50 cursor-pointer"
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="relative w-4 h-4 bg-secondary-container rounded-full shadow-[0_0_8px_rgba(254,94,47,0.5)] border-2 border-surface-container-lowest" />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest rounded-lg shadow-xl p-3 w-48 pointer-events-none">
                        <div className="font-label-bold text-label-bold text-on-surface mb-1">
                          PALASIA SQ
                        </div>
                        <div className="flex justify-between text-body-md font-body-md text-on-surface-variant">
                          <span>Congestion:</span>
                          <span className="text-secondary-container font-semibold">68%</span>
                        </div>
                      </div>
                    </button>

                    {/* Marker 3: Optimal (Tower) */}
                    <button
                      aria-label="Tower Square"
                      onClick={() => setSelectedJunction("TW-11-S")}
                      style={{ top: "60%", left: "40%" }}
                      className="absolute pointer-events-auto group focus:outline-none -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 hover:z-50 cursor-pointer"
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="relative w-4 h-4 bg-surface-tint rounded-full shadow-[0_0_8px_rgba(81,91,144,0.5)] border-2 border-surface-container-lowest" />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest rounded-lg shadow-xl p-3 w-48 pointer-events-none">
                        <div className="font-label-bold text-label-bold text-on-surface mb-1">
                          TOWER SQ
                        </div>
                        <div className="flex justify-between text-body-md font-body-md text-on-surface-variant">
                          <span>Congestion:</span>
                          <span className="text-surface-tint font-semibold">32%</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Sidebar (Right) */}
              <aside className="w-[420px] h-full bg-surface-container-lowest shadow-[-8px_0_24px_rgba(3,13,65,0.03)] z-20 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-stack-lg py-stack-md bg-surface-container-low border-b border-surface-container-high shrink-0">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Active Nodes</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Monitoring 25 primary city junctions.
                  </p>

                  {/* Search / Filter */}
                  <div className="mt-4 flex gap-2 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      search
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors"
                      placeholder="Search junction ID or name..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      className="bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors p-2 rounded-full shrink-0 flex items-center justify-center"
                      title="Filter"
                    >
                      <span className="material-symbols-outlined text-[20px]">filter_list</span>
                    </button>
                  </div>
                </div>

                {/* Junction List */}
                <div className="flex-1 overflow-y-auto bg-surface-container-lowest p-stack-md space-y-3 custom-scrollbar">
                  {/* Vijay Nagar Square */}
                  {filteredJunctions.some((j) => j.id === "VN-01-M") && (
                    <div
                      onClick={() => setSelectedJunction("VN-01-M")}
                      className={`group relative bg-error-container/30 rounded-xl p-4 cursor-pointer hover:bg-error-container/50 transition-colors overflow-hidden ${
                        selectedJunction === "VN-01-M" ? "ring-2 ring-error" : ""
                      }`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />
                      <div className="flex justify-between items-start mb-3 pl-2">
                        <div>
                          <h3 className="font-label-bold text-label-bold text-on-error-container uppercase tracking-wide">
                            Vijay Nagar Square
                          </h3>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            ID: VN-01-M
                          </span>
                        </div>
                        <div className="bg-error text-on-error px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-sm">
                          Critical
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pl-2">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Queue Length
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-error leading-none">
                              1.2
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Wait Time
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-error leading-none">
                              420
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              sec
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pl-2">
                        <div className="flex justify-between text-[10px] font-label-bold text-on-surface-variant mb-1 uppercase">
                          <span>Capacity Load</span>
                          <span className="text-error">92%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div className="bg-error h-full rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Palasia Square */}
                  {filteredJunctions.some((j) => j.id === "PL-04-E") && (
                    <div
                      onClick={() => setSelectedJunction("PL-04-E")}
                      className={`group relative bg-surface-container-low rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-colors overflow-hidden border border-outline-variant/30 hover:border-secondary-container/50 ${
                        selectedJunction === "PL-04-E" ? "ring-2 ring-secondary-container" : ""
                      }`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-label-bold text-label-bold text-on-surface uppercase tracking-wide group-hover:text-secondary-container transition-colors">
                            Palasia Square
                          </h3>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            ID: PL-04-E
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-secondary-container mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Queue Length
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              0.6
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Wait Time
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              185
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              sec
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] font-label-bold text-on-surface-variant mb-1 uppercase">
                          <span>Capacity Load</span>
                          <span className="text-secondary-container">68%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-secondary-container h-full rounded-full"
                            style={{ width: "68%" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tower Square */}
                  {filteredJunctions.some((j) => j.id === "TW-11-S") && (
                    <div
                      onClick={() => setSelectedJunction("TW-11-S")}
                      className={`group relative bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container-low transition-colors overflow-hidden border border-outline-variant/30 hover:border-surface-tint/50 ${
                        selectedJunction === "TW-11-S" ? "ring-2 ring-surface-tint" : ""
                      }`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-tint opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-label-bold text-label-bold text-on-surface uppercase tracking-wide group-hover:text-surface-tint transition-colors">
                            Tower Square
                          </h3>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            ID: TW-11-S
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-surface-tint mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Queue Length
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              0.2
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Wait Time
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              45
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              sec
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] font-label-bold text-on-surface-variant mb-1 uppercase">
                          <span>Capacity Load</span>
                          <span className="text-surface-tint">32%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-surface-tint h-full rounded-full"
                            style={{ width: "32%" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bhawarkuan Square */}
                  {filteredJunctions.some((j) => j.id === "BK-08-W") && (
                    <div
                      onClick={() => setSelectedJunction("BK-08-W")}
                      className={`group relative bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container-low transition-colors overflow-hidden border border-outline-variant/30 hover:border-surface-tint/50 ${
                        selectedJunction === "BK-08-W" ? "ring-2 ring-surface-tint" : ""
                      }`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-tint opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-label-bold text-label-bold text-on-surface uppercase tracking-wide group-hover:text-surface-tint transition-colors">
                            Bhawarkuan Square
                          </h3>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            ID: BK-08-W
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-surface-tint mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Queue Length
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              0.3
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                            Wait Time
                          </span>
                          <div className="flex items-end gap-1">
                            <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                              62
                            </span>
                            <span className="font-data-mono text-data-mono text-on-surface-variant">
                              sec
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-stack-lg py-stack-md bg-surface-container-highest border-t border-surface-container-high shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        System Status
                      </span>
                      <span className="font-body-md text-body-md text-surface-tint font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-tint" />
                        Nominal Operation
                      </span>
                    </div>
                    <button className="text-primary hover:text-primary-container font-label-bold text-label-bold uppercase flex items-center gap-1 transition-colors">
                      View Report{" "}
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
