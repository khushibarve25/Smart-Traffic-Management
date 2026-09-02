import React, { useState } from "react";
import OperatorLogin from "./OperatorLogin";
import JunctionControlDashboard from "./JunctionControlDashboard";
import CityWideOverview from "./CityWideOverview";
import EmergencyPriority from "./EmergencyPriority";

export default function App() {
  // Views: 'login', 'junction-dashboard', 'city-wide-overview', 'emergency-alerts'
  const [currentView, setCurrentView] = useState("emergency-alerts");

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
  };

  return (
    <div className="relative">
      {/* Quick View Switcher floating toolbar for rapid testing */}
      <div className="fixed top-3 right-48 z-50 flex items-center bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/40 rounded-full p-1 shadow-sm gap-1 text-label-sm font-label-bold">
        <button
          onClick={() => setCurrentView("login")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "login"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView("junction-dashboard")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "junction-dashboard"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView("city-wide-overview")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "city-wide-overview"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          City Overview
        </button>
        <button
          onClick={() => setCurrentView("emergency-alerts")}
          className={`px-3 py-1 rounded-full transition-colors ${
            currentView === "emergency-alerts"
              ? "bg-secondary text-on-secondary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Emergency Priority
        </button>
      </div>

      {/* Screen Router */}
      {currentView === "login" && (
        <OperatorLogin onLogin={() => setCurrentView("junction-dashboard")} />
      )}

      {currentView === "junction-dashboard" && (
        <JunctionControlDashboard
          onLogout={() => setCurrentView("login")}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === "city-wide-overview" && (
        <CityWideOverview
          onLogout={() => setCurrentView("login")}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === "emergency-alerts" && (
        <EmergencyPriority
          onLogout={() => setCurrentView("login")}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
