import React, { useState } from "react";
import OperatorLogin from "./OperatorLogin";
import JunctionControlDashboard from "./JunctionControlDashboard";
import CityWideOverview from "./CityWideOverview";
import EmergencyPriority from "./EmergencyPriority";
import HistoricalAnalysis from "./HistoricalAnalysis";
import AdminSettings from "./AdminSettings";

export default function App() {
  // Views: 'login', 'junction-dashboard', 'city-wide-overview', 'emergency-alerts', 'analytics-reports', 'admin-settings'
  const [currentView, setCurrentView] = useState("admin-settings");

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
  };

  return (
    <div className="relative">
      {/* Floating View Switcher Bar for fast navigation/testing across all modules */}
      <div className="fixed top-3 right-48 z-50 flex items-center bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/40 rounded-full p-1 shadow-sm gap-1 text-label-sm font-label-bold overflow-x-auto max-w-[calc(100vw-300px)]">
        <button
          onClick={() => setCurrentView("login")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "login"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView("junction-dashboard")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "junction-dashboard"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Junction Dashboard
        </button>
        <button
          onClick={() => setCurrentView("city-wide-overview")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "city-wide-overview"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          City Overview
        </button>
        <button
          onClick={() => setCurrentView("emergency-alerts")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "emergency-alerts"
              ? "bg-secondary text-on-secondary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Emergency Priority
        </button>
        <button
          onClick={() => setCurrentView("analytics-reports")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "analytics-reports"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Analytics & Reports
        </button>
        <button
          onClick={() => setCurrentView("admin-settings")}
          className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
            currentView === "admin-settings"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Admin & Settings
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

      {currentView === "analytics-reports" && (
        <HistoricalAnalysis
          onLogout={() => setCurrentView("login")}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === "admin-settings" && (
        <AdminSettings
          onLogout={() => setCurrentView("login")}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
