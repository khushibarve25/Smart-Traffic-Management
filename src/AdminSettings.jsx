import React, { useState, useEffect } from "react";

export default function AdminSettings({ onNavigate, onLogout }) {
  const [activeNav, setActiveNav] = useState("admin-settings");
  const [confidence, setConfidence] = useState(85);
  const [autoReset, setAutoReset] = useState(120);
  const [thresholdSaved, setThresholdSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [directoryList, setDirectoryList] = useState([]);

  useEffect(() => {
    // Fetch live system settings
    fetch("http://127.0.0.1:8000/api/system/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.confidence_threshold) setConfidence(data.confidence_threshold);
        if (data.auto_reset_timer) setAutoReset(data.auto_reset_timer);
      })
      .catch(() => {});

    // Fetch junctions from SQLite
    fetch("http://127.0.0.1:8000/api/junctions")
      .then((res) => res.json())
      .then((data) => {
        setDirectoryList(
          data.map((j) => ({
            id: j.id,
            location: j.name,
            status: j.cam_status || "Online (4/4)",
            type: j.status.toLowerCase(),
          }))
        );
      })
      .catch(() => {
        setDirectoryList([
          { id: "JNC-MP-001", location: "Palasia Square", status: "Online (4/4)", type: "online" },
          { id: "JNC-MP-042", location: "Bhawarkuan Chauraha", status: "Degraded (3/4)", type: "degraded" },
          { id: "JNC-MP-088", location: "Regal Square", status: "Online (6/6)", type: "online" },
          { id: "JNC-MP-112", location: "Geeta Bhawan", status: "Offline (0/4)", type: "offline" },
          { id: "JNC-MP-005", location: "Vijay Nagar", status: "Online (8/8)", type: "online" },
        ]);
      });
  }, []);

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

  const filteredDirectory = directoryList.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyThresholds = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/system/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confidence_threshold: parseInt(confidence, 10),
          auto_reset_timer: parseInt(autoReset, 10),
        }),
      });
    } catch (e) {}

    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2000);
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

        {/* Admin & Settings (Current Active) */}
        <div className="px-4 py-8 border-t border-on-primary/10">
          <a
            className="flex items-center px-4 py-3 transition-all group bg-on-primary/10 text-on-primary border-l-4 border-secondary"
            href="#admin-settings"
            onClick={(e) => e.preventDefault()}
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

        {/* Content */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full p-stack-lg gap-stack-lg">
            {/* Header Section */}
            <div className="flex flex-col gap-stack-sm bg-surface-container rounded-xl p-stack-md shadow-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin & Settings</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Configure system parameters, manage junction devices, and review audit trails.
                Changes here persist directly to SQLite storage and affect global recommendation
                sensitivity.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-gutter">
              {/* Left Column: Sliders & Roles */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-lg">
                {/* System Tuning */}
                <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-md flex flex-col gap-stack-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-surface-container-highest pb-stack-sm mb-stack-sm">
                    System Tuning
                  </h2>

                  {/* Confidence Slider */}
                  <div className="flex flex-col gap-stack-sm">
                    <div className="flex justify-between items-center">
                      <label
                        className="font-label-bold text-label-bold text-on-surface uppercase"
                        htmlFor="confidence-threshold"
                      >
                        Detection Confidence
                      </label>
                      <span
                        className="font-data-mono text-data-mono text-primary bg-primary-container/10 px-2 py-1 rounded"
                        id="confidence-value"
                      >
                        {confidence}%
                      </span>
                    </div>
                    <input
                      className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                      id="confidence-threshold"
                      max="99"
                      min="50"
                      type="range"
                      value={confidence}
                      onChange={(e) => setConfidence(e.target.value)}
                    />
                    <p className="font-body-md text-body-md text-on-surface-variant text-[12px] leading-tight">
                      Minimum confidence required for automatic violation logging.
                    </p>
                  </div>

                  {/* Auto-Reset Timer */}
                  <div className="flex flex-col gap-stack-sm mt-stack-md">
                    <div className="flex justify-between items-center">
                      <label
                        className="font-label-bold text-label-bold text-on-surface uppercase"
                        htmlFor="auto-reset"
                      >
                        Auto-Reset Timer (sec)
                      </label>
                      <span
                        className="font-data-mono text-data-mono text-secondary bg-secondary-container/10 px-2 py-1 rounded"
                        id="reset-value"
                      >
                        {autoReset}s
                      </span>
                    </div>
                    <input
                      className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                      id="auto-reset"
                      max="300"
                      min="30"
                      step="10"
                      type="range"
                      value={autoReset}
                      onChange={(e) => setAutoReset(e.target.value)}
                    />
                    <p className="font-body-md text-body-md text-on-surface-variant text-[12px] leading-tight">
                      Duration before manual override expires and normal cycle resumes.
                    </p>
                  </div>

                  <button
                    onClick={handleApplyThresholds}
                    className="mt-stack-sm bg-primary text-on-primary font-label-bold text-label-bold py-3 rounded-lg uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm"
                  >
                    {thresholdSaved ? "Thresholds Saved to DB!" : "Apply Thresholds"}
                  </button>
                </div>

                {/* Role Management */}
                <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-md flex flex-col gap-stack-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-surface-container-highest pb-stack-sm">
                    User Role Permissions
                  </h2>
                  <div className="flex flex-col gap-stack-sm">
                    {/* Admin */}
                    <div className="flex items-center justify-between p-stack-sm bg-surface-container-low rounded-lg group hover:bg-surface-container transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">
                            admin_panel_settings
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-bold text-label-bold text-on-surface uppercase">
                            Administrator
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Full system access
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert("Editing Administrator role permissions...")}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>

                    {/* Supervisor */}
                    <div className="flex items-center justify-between p-stack-sm bg-surface-container-low rounded-lg group hover:bg-surface-container transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-tint text-on-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">
                            supervisor_account
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-bold text-label-bold text-on-surface uppercase">
                            Supervisor
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Override & Reports
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert("Editing Supervisor role permissions...")}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>

                    {/* Operator */}
                    <div className="flex items-center justify-between p-stack-sm bg-surface-container-low rounded-lg group hover:bg-surface-container transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-outline text-on-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-bold text-label-bold text-on-surface uppercase">
                            Operator
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            View & Alert only
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert("Editing Operator role permissions...")}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Devices & Audit */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-lg">
                {/* Junctions & Feeds */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col h-[400px]">
                  <div className="flex items-center justify-between p-stack-md border-b border-surface-container-highest bg-surface-container-low">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      Junction & Camera Directory
                    </h2>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        search
                      </span>
                      <input
                        className="pl-10 pr-4 py-2 rounded border border-outline-variant bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary w-64"
                        placeholder="Search ID or Location..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-surface-container-low border-b border-surface-container-highest z-10">
                        <tr>
                          <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                            Junction ID
                          </th>
                          <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                            Location
                          </th>
                          <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                            Cam Status
                          </th>
                          <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-highest">
                        {filteredDirectory.map((item) => (
                          <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                            <td className="p-4 font-data-mono text-data-mono text-on-surface">
                              {item.id}
                            </td>
                            <td className="p-4 font-body-md text-body-md text-on-surface">
                              {item.location}
                            </td>
                            <td className="p-4">
                              {item.type === "online" && (
                                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-full">
                                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> {item.status}
                                </span>
                              )}
                              {item.type === "degraded" && (
                                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase bg-[#FFF3E0] text-[#E65100] px-2 py-1 rounded-full">
                                  <span className="w-2 h-2 rounded-full bg-[#E65100]" /> {item.status}
                                </span>
                              )}
                              {item.type === "offline" && (
                                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase bg-error-container text-on-error-container px-2 py-1 rounded-full">
                                  <span className="w-2 h-2 rounded-full bg-error" /> {item.status}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => alert(`Configuring cameras for ${item.location}...`)}
                                className="text-on-surface-variant hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined">settings</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Log */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md p-stack-md flex flex-col flex-1 min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-surface-container-highest pb-stack-sm mb-stack-sm">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      System Audit Log (Persisted)
                    </h2>
                    <button
                      onClick={() => alert("Exporting System Audit Log as CSV...")}
                      className="font-label-bold text-label-bold text-primary hover:text-primary-container uppercase flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span> Export
                      CSV
                    </button>
                  </div>
                  <div className="overflow-y-auto pr-2 space-y-3 h-full">
                    {/* Log Entry 1 */}
                    <div className="flex items-start gap-4 p-3 bg-surface-container-low rounded-lg border-l-4 border-secondary">
                      <div className="font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap pt-0.5 text-[11px]">
                        14:32:01
                        <br />
                        Today
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-label-bold">Operator 402</span> triggered{" "}
                          <span className="font-label-bold text-secondary">
                            MANUAL OVERRIDE (ALL_RED)
                          </span>{" "}
                          at JNC-MP-088.
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-data-mono">
                          Auth: BIO_VERIFIED | IP: 192.168.1.112
                        </p>
                      </div>
                    </div>

                    {/* Log Entry 2 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors">
                      <div className="font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap pt-0.5 text-[11px]">
                        09:15:44
                        <br />
                        Today
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-label-bold">System</span> auto-escalated alert for{" "}
                          <span className="font-label-bold">CAM_04_LOSS</span> at JNC-MP-112.
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-data-mono">
                          Routine: DIAG_CHECK_HOURLY
                        </p>
                      </div>
                    </div>

                    {/* Log Entry 3 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors border-l-4 border-primary">
                      <div className="font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap pt-0.5 text-[11px]">
                        18:45:00
                        <br />
                        Yesterday
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-label-bold">Admin_Sup1</span> updated{" "}
                          <span className="font-label-bold">Confidence Threshold</span> to {confidence}%.
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-data-mono">
                          Prev: 80% | Session: ADM_8829
                        </p>
                      </div>
                    </div>

                    {/* Log Entry 4 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors">
                      <div className="font-data-mono text-data-mono text-on-surface-variant whitespace-nowrap pt-0.5 text-[11px]">
                        12:00:00
                        <br />
                        Yesterday
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-label-bold">System</span> completed nightly DB
                          synchronization.
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-data-mono">
                          Rows: 145,230 | Time: 4.2s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
