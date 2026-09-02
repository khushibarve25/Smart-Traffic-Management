import React, { useState } from "react";

export default function HistoricalAnalysis({ onNavigate, onLogout }) {
  const [activeNav, setActiveNav] = useState("analytics-reports");
  const [dateRange, setDateRange] = useState("Last 24 Hours (Oct 24)");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [recordsCount, setRecordsCount] = useState(4);

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

  const initialRecords = [
    {
      id: "EVT-992-A4",
      timestamp: "2023-10-24 14:32:01",
      nodeId: "J42",
      junction: "MG Road / Palasia Intersection",
      vehicle: "Ambulance (Type B)",
      duration: "00:01:45",
      statusColor: "bg-primary",
      statusTitle: "Cleared Standard",
    },
    {
      id: "EVT-991-B1",
      timestamp: "2023-10-24 12:15:22",
      nodeId: "J12",
      junction: "Bhawarkuan Square",
      vehicle: "Fire Response",
      duration: "00:02:10",
      statusColor: "bg-secondary shadow-secondary/50",
      statusTitle: "Delayed Clearance",
    },
    {
      id: "EVT-990-C7",
      timestamp: "2023-10-24 09:05:41",
      nodeId: "J08",
      junction: "Regal Square",
      vehicle: "Police Convoy",
      duration: "00:00:55",
      statusColor: "bg-primary",
      statusTitle: "Cleared Fast",
    },
    {
      id: "EVT-989-A2",
      timestamp: "2023-10-24 08:42:11",
      nodeId: "J55",
      junction: "LIG Intersection",
      vehicle: "Ambulance (Type A)",
      duration: "00:01:12",
      statusColor: "bg-primary",
      statusTitle: "Cleared Standard",
    },
    {
      id: "EVT-988-E3",
      timestamp: "2023-10-24 07:18:30",
      nodeId: "J19",
      junction: "Tower Square",
      vehicle: "Ambulance (Type B)",
      duration: "00:01:25",
      statusColor: "bg-primary",
      statusTitle: "Cleared Standard",
    },
    {
      id: "EVT-987-F8",
      timestamp: "2023-10-24 06:45:19",
      nodeId: "J03",
      junction: "Rajwada Main",
      vehicle: "Fire Response",
      duration: "00:02:40",
      statusColor: "bg-secondary shadow-secondary/50",
      statusTitle: "Delayed Clearance",
    },
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
          <div className="flex flex-col w-full max-w-[1440px] mx-auto px-margin-edge pb-stack-lg gap-stack-lg">
            {/* Report Header Memo Style */}
            <div className="flex flex-col gap-stack-md bg-surface-container-lowest p-stack-md shadow-sm rounded-lg relative overflow-hidden mt-stack-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
                <div className="flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-primary tracking-widest uppercase mb-2">
                    Automated Operations Report
                  </span>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface m-0 leading-none">
                    Historical Analytics & Performance
                  </h1>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="font-data-mono text-data-mono text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">fingerprint</span>{" "}
                      DOC-ID: IMC-REP-8492-A
                    </span>
                    <span className="font-data-mono text-data-mono text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">shield</span>{" "}
                      CLASSIFICATION: OFFICIAL USE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-stack-sm flex-wrap relative">
                  {/* Date Range Picker */}
                  <div className="relative">
                    <div
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="flex items-center gap-2 bg-surface p-2 rounded shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] text-on-surface cursor-pointer hover:bg-surface-container-low transition-colors select-none"
                    >
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        calendar_today
                      </span>
                      <span className="font-body-md text-body-md">{dateRange}</span>
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        arrow_drop_down
                      </span>
                    </div>

                    {isDatePickerOpen && (
                      <div className="absolute top-full mt-1 right-0 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl py-1 z-30 w-56">
                        {["Last 24 Hours (Oct 24)", "Last 7 Days", "Last 30 Days", "Custom Range"].map(
                          (option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setDateRange(option);
                                setIsDatePickerOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-surface-container text-body-md text-on-surface"
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => alert("Generating PDF Report for DOC-ID: IMC-REP-8492-A...")}
                    className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded font-label-bold text-label-bold uppercase transition-colors shadow-sm flex items-center gap-2 h-[40px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>{" "}
                    Export PDF
                  </button>
                  <button
                    onClick={() => alert("Exporting Historical Datasets (CSV/JSON)...")}
                    className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded font-label-bold text-label-bold uppercase transition-colors shadow-sm flex items-center gap-2 h-[40px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">table</span> Export
                    Data
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Congestion Trends Line Chart */}
              <div className="md:col-span-8 bg-surface-container-lowest rounded-lg shadow-sm p-stack-md flex flex-col gap-stack-md">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
                    Congestion Trends
                  </h2>
                  <span className="bg-surface-container p-1 rounded text-on-surface-variant font-label-sm text-label-sm">
                    System-wide Average
                  </span>
                </div>
                <div className="w-full h-[280px] relative mt-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                  </div>

                  {/* Y-Axis Labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-outline font-data-mono text-data-mono -ml-6 py-1 z-10 text-right">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>

                  {/* SVG Line Chart */}
                  <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 800 280">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="#b12d00" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,200 C100,180 150,250 250,150 C350,50 400,120 500,80 C600,40 700,100 800,60"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle className="text-primary" cx="250" cy="150" fill="currentColor" r="4" />
                    <circle className="text-primary" cx="500" cy="80" fill="currentColor" r="4" />
                    <circle cx="800" cy="60" fill="#b12d00" r="4" />
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="absolute -bottom-6 left-0 w-full flex justify-between text-outline font-data-mono text-data-mono px-2">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>
                </div>
              </div>

              {/* Priority Vehicle Response Times Area Chart */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-lg shadow-sm p-stack-md flex flex-col gap-stack-md">
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
                    Response Latency
                  </h2>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Priority 1 Vehicles (Seconds)
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-end relative h-[240px] mt-4">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                    <div className="w-full h-px bg-surface-container" />
                  </div>
                  <svg
                    className="w-full h-full text-secondary"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 200"
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 L50,120 L100,140 L150,90 L200,110 L250,60 L300,80 L350,40 L400,70 L400,200 L0,200 Z"
                      fill="url(#areaGrad)"
                    />
                    <path
                      d="M0,150 L50,120 L100,140 L150,90 L200,110 L250,60 L300,80 L350,40 L400,70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="absolute bottom-4 left-4">
                    <span className="font-display-lg text-display-lg text-on-surface">
                      14.2
                      <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                        s
                      </span>
                    </span>
                    <div className="font-label-bold text-label-bold text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">arrow_downward</span>{" "}
                      1.4s vs yesterday
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">
              <div className="p-stack-md bg-surface-container-lowest">
                <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
                  Priority Event Audit Log
                </h2>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-stack-md py-3 bg-surface-container font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                    <div className="col-span-3">Timestamp / Event ID</div>
                    <div className="col-span-4">Junction Node</div>
                    <div className="col-span-2">Vehicle Type</div>
                    <div className="col-span-2">Clearance Duration</div>
                    <div className="col-span-1 text-right">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col">
                    {initialRecords.slice(0, recordsCount).map((record, index) => (
                      <div
                        key={record.id}
                        className={`grid grid-cols-12 gap-4 px-stack-md py-3 items-center transition-colors group cursor-default ${
                          index % 2 === 0
                            ? "bg-surface-container-lowest hover:bg-surface-container-low"
                            : "bg-surface hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="col-span-3 flex flex-col">
                          <span className="font-data-mono text-data-mono text-on-surface">
                            {record.timestamp}
                          </span>
                          <span className="font-label-sm text-label-sm text-outline">
                            {record.id}
                          </span>
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-label-bold text-label-bold">
                            {record.nodeId}
                          </div>
                          <span className="font-body-md text-body-md text-on-surface">
                            {record.junction}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-body-md text-body-md text-on-surface">
                            {record.vehicle}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-data-mono text-data-mono text-on-surface">
                            {record.duration}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${record.statusColor} shadow-sm`}
                            title={record.statusTitle}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {recordsCount < initialRecords.length && (
                <div className="p-stack-sm bg-surface-container-low border-t-0 flex justify-center">
                  <button
                    onClick={() => setRecordsCount(initialRecords.length)}
                    className="font-label-bold text-label-bold text-primary hover:text-primary-container px-4 py-2 uppercase tracking-wide"
                  >
                    Load More Records
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
