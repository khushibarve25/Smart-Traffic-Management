import React, { useState } from "react";
import OperatorLogin from "./OperatorLogin";
import JunctionControlDashboard from "./JunctionControlDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard"); // default to dashboard to preview the requested screen immediately

  return (
    <div className="relative">
      {/* Quick View Switcher floating bar for rapid development & demo */}
      <div className="fixed top-3 right-48 z-50 flex items-center bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/40 rounded-full px-2 py-1 shadow-sm gap-1 text-label-sm font-label-bold">
        <button
          onClick={() => setCurrentView("login")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "login"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Operator Login
        </button>
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "dashboard"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Junction Dashboard
        </button>
      </div>

      {/* Active Screen */}
      {currentView === "login" ? (
        <OperatorLogin onLogin={() => setCurrentView("dashboard")} />
      ) : (
        <JunctionControlDashboard onLogout={() => setCurrentView("login")} />
      )}
    </div>
  );
}
