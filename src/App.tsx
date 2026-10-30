import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SarAnalysis } from './pages/SarAnalysis';
import { AqiIntelligence } from './pages/AqiIntelligence';
import { Reports } from './pages/Reports';
import { About } from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#050510] text-slate-100 selection:bg-[#00f0ff]/30 selection:text-[#00f0ff]">
        {/* Persistent Futuristic Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sar-analysis" element={<SarAnalysis />} />
            <Route path="/aqi-intelligence" element={<AqiIntelligence />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
