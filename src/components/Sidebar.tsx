import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Radar, 
  Wind, 
  FileText, 
  Info
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/sar-analysis', label: 'SAR Analysis', icon: Radar },
    { path: '/aqi-intelligence', label: 'AQI Intelligence', icon: Wind },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <aside 
      id="sidebar"
      className="w-64 min-w-[256px] h-screen sticky top-0 flex flex-col justify-between glass-panel border-r border-[#00f0ff]/20 bg-[#050510]/80 relative z-40 select-none"
    >
      {/* Top Branding & Nav */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-[#00f0ff]/10 border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <span className="text-[#00f0ff] font-bold text-base">🌬</span>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-glow-blue font-mono">
            ORBITAL_AI
          </h1>
        </div>

        {/* Live Satellite Ingest Indicator */}
        <div className="mb-6 px-3 py-2 rounded bg-[#00f0ff]/5 border border-[#00f0ff]/15 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
            </span>
            <span className="text-[11px]">SENTINEL-1 / 5P</span>
          </div>
          <span className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-semibold">ONLINE</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" id="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive: active }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-r transition-all text-sm font-semibold cursor-pointer ${
                    active
                      ? 'active-nav font-bold shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-gray-400'}`} />
                <span className="tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
