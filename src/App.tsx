/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LayoutDashboard, BrainCircuit, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "./lib/utils";
import DashboardView from "./components/DashboardView";
import PredictorView from "./components/PredictorView";

export default function App() {
  const [activeView, setActiveView] = useState<"dashboard" | "predictor">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "predictor", label: "Predictor", icon: BrainCircuit },
  ];

  return (
    <div className="flex h-screen bg-bg-canvas text-ink-primary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-border-line transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <TrendingUp size={18} />
          </div>
          {isSidebarOpen && <span className="font-bold tracking-tight text-lg truncate">EPP Analytics</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                activeView === item.id 
                  ? "bg-blue-50 text-blue-700 font-bold" 
                  : "text-ink-secondary hover:bg-gray-100"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-ink-secondary hover:bg-gray-100 transition-all">
            <Settings size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-ink-secondary hover:bg-gray-100 mt-1 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border-line px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-ink-secondary"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              {activeView === "dashboard" ? "Enterprise Analytics" : "Performance Machine Learning"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-ink-primary">Admin User</p>
              <p className="text-[10px] uppercase font-bold text-ink-secondary tracking-widest">Global HRBP</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {activeView === "dashboard" ? (
            <DashboardView />
          ) : (
            <PredictorView />
          )}
        </div>
      </main>
    </div>
  );
}

// Helper icons
function TrendingUp({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

