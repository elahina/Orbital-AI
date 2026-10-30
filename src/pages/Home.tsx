import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, 
  Wind, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Radio
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center overflow-hidden py-4">
      {/* HUD Elements (Top Right) */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-4 sm:gap-6 z-20 glass-panel px-4 py-2 rounded border border-[#00f0ff]/20">
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Lat: 12.9716° N</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Long: 77.5946° E</p>
        </div>
        <div className="h-6 w-[1px] bg-white/10"></div>
        <div className="text-right">
          <p className="text-xs font-mono text-[#00f0ff] font-semibold">STABLE</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">SatLink Status</p>
        </div>
      </div>

      {/* EARTH ANIMATION SIMULATION (GLOBE CONTAINER) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="globe-container animate-pulse-glow">
          <div className="lat-line" style={{ top: '25%' }}></div>
          <div className="lat-line" style={{ top: '50%' }}></div>
          <div className="lat-line" style={{ top: '75%' }}></div>
          <div className="long-line animate-globe-spin" style={{ width: '30%' }}></div>
          <div className="long-line animate-globe-spin" style={{ width: '60%' }}></div>
          <div className="long-line animate-globe-spin" style={{ width: '90%' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/5 to-transparent rounded-full"></div>
          
          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[#00f0ff]/10 to-transparent animate-radar-sweep origin-center"></div>

          {/* Simulated Satellite Nodes in Orbit */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#050510] border border-[#00f0ff]/50 text-[10px] font-mono text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <Radio className="w-3 h-3 text-[#39ff14] animate-ping" /> Sentinel-1A (SAR)
          </div>
          <div className="absolute -bottom-3 left-1/3 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#050510] border border-[#39ff14]/50 text-[10px] font-mono text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.4)]">
            <Radio className="w-3 h-3 text-[#00f0ff] animate-ping" /> Sentinel-5P (TROPOMI)
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 glass-panel p-8 sm:p-12 max-w-2xl text-center flex flex-col items-center gap-6 my-auto mx-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] border border-[#00f0ff]/20">
        <div className="space-y-3">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter text-glow-blue italic font-mono">
            ORBITAL AI
          </h2>
          <p className="text-[#00f0ff] uppercase text-xs tracking-[0.3em] font-semibold opacity-80">
            Spectral Earth Rendering &amp; Atmosphere Intelligence
          </p>
        </div>
        
        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
          Experience the next generation of satellite intelligence. Combine state-of-the-art Deep Learning with SAR image colorization and high-resolution Air Quality downscaling.
        </p>

        <button 
          id="hero-start-analysis-btn"
          onClick={() => navigate('/sar-analysis')}
          className="neon-border px-10 py-3 bg-[#00f0ff]/10 text-[#00f0ff] text-sm font-bold tracking-widest hover:bg-[#00f0ff]/20 transition-all rounded cursor-pointer"
        >
          START ANALYSIS
        </button>
      </div>

      {/* FEATURE PILLARS NAVIGATION */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full pt-8">
        {/* Card 1: SAR Colorization */}
        <div 
          onClick={() => navigate('/sar-analysis')}
          className="p-4 rounded glass-panel glass-panel-hover border border-[#00f0ff]/20 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] mb-2.5 group-hover:scale-110 transition-transform">
            <Radar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#00f0ff] transition-colors">
            SAR Colorization (GAN)
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-2.5">
            SEN12MS-CR trained Pix2PixHD translating C-Band radar backscatter to optical RGB.
          </p>
          <span className="text-[11px] font-mono text-[#00f0ff] flex items-center gap-1">
            SEN12MS-CR <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Card 2: Land Cover */}
        <div 
          onClick={() => navigate('/sar-analysis')}
          className="p-4 rounded glass-panel glass-panel-hover border border-[#00f0ff]/20 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] mb-2.5 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#39ff14] transition-colors">
            Land Cover Segmentation
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-2.5">
            Semantic segmentation for Vegetation, Water, Urban, and Bare ground.
          </p>
          <span className="text-[11px] font-mono text-[#39ff14] flex items-center gap-1">
            Attention U-Net <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Card 3: Disaster Detection */}
        <div 
          onClick={() => navigate('/sar-analysis')}
          className="p-4 rounded glass-panel glass-panel-hover border border-[#00f0ff]/20 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-2.5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
            Disaster Radar Detection
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-2.5">
            Sen1Floods11 flood inundation and SpaceNet building extraction.
          </p>
          <span className="text-[11px] font-mono text-red-400 flex items-center gap-1">
            Sen1Floods11 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Card 4: AQI Downscaling */}
        <div 
          onClick={() => navigate('/aqi-intelligence')}
          className="p-4 rounded glass-panel glass-panel-hover border border-[#00f0ff]/20 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center text-[#39ff14] mb-2.5 group-hover:scale-110 transition-transform">
            <Wind className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#39ff14] transition-colors">
            AQI Downscaling (1km)
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-2.5">
            Sentinel-5P + CPCB fusion with 6-hr CNN-LSTM atmospheric forecasting.
          </p>
          <span className="text-[11px] font-mono text-[#39ff14] flex items-center gap-1">
            Sentinel-5P <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
