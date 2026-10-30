import React from 'react';
import {
  Info,
  Radar,
  Wind,
  Compass,
  FileText,
  Database,
  Globe,
  Code2,
  Server,
} from 'lucide-react';

export const About: React.FC = () => {
  const modules = [
    {
      title: 'SAR Image Analysis',
      icon: Radar,
      accent: 'text-[#00f0ff]',
      border: 'border-[#00f0ff]/25',
      description:
        'Upload a SAR satellite image or choose from 6 built-in radar presets to view natural RGB colorization, 4-class land-cover segmentation (Vegetation, Water, Urban, Bare Land), Grad-CAM heatmaps, and flood or wildfire detection.',
    },
    {
      title: 'AQI Intelligence (143 Monitored Cities)',
      icon: Wind,
      accent: 'text-[#39ff14]',
      border: 'border-[#39ff14]/25',
      description:
        'Check air quality across 143 CPCB-monitored Indian cities using official Indian AQI breakpoint formulas, a 10 km to 1 km street-level heatmap grid, and a 6-hour AQI forecast.',
    },
    {
      title: 'Virtual Sensor Mode (329 Unmonitored Cities)',
      icon: Compass,
      accent: 'text-amber-300',
      border: 'border-amber-400/25',
      description:
        'For Indian towns without a local CPCB station, automatically estimates pollutant concentrations from the 3 nearest CPCB stations via Inverse Distance Weighting (IDW), shows a validated 80% uncertainty range, maps the donor stations, and displays live satellite and weather context separately.',
    },
    {
      title: 'Dashboard & PDF Reports',
      icon: FileText,
      accent: 'text-[#00f0ff]',
      border: 'border-white/15',
      description:
        'View system overview charts, inspect saved SAR and AQI scan logs, filter or clear history, and export formatted PDF summary reports.',
    },
  ];

  const sarSources = [
    {
      name: 'SEN12MS-CR',
      source: 'TUM / DLR (Sentinel-1 & Sentinel-2)',
      usage: 'Reference paired dataset for translating grayscale C-Band SAR radar images into natural optical RGB colors.',
    },
    {
      name: 'SEN12MS',
      source: 'TUM / DLR Earth Observation',
      usage: '4-class land-cover segmentation reference (Vegetation, Water, Urban/Buildings, Bare Land).',
    },
    {
      name: 'Sen1Floods11',
      source: 'Cloud to Street / NASA Earth Science',
      usage: 'Sentinel-1 flood water detection and decision threshold calibration (0.45 cutoff), including the Kerala flood preset.',
    },
    {
      name: 'SpaceNet 6 & Umbra Open SAR',
      source: 'SpaceNet LLC / Umbra Spotlight SAR',
      usage: 'Urban building and road extraction presets (Coastal Metropolis & Tokyo Bay Port).',
    },
    {
      name: 'xBD & NASA FIRMS (MODIS / VIIRS)',
      source: 'xView2 / NASA Earthdata',
      usage: 'Structural damage check rules and active wildfire burn-scar reference (California Wildfire preset).',
    },
  ];

  const aqiSources = [
    {
      name: 'CPCB Station Reference & AQI Breakpoints',
      source: 'Central Pollution Control Board (India)',
      usage: 'Reference pollutant readings (PM2.5, PM10, NO₂, CO, O₃) for 143 monitored Indian cities and official Indian National AQI sub-index calculation.',
    },
    {
      name: 'Sentinel-5P TROPOMI NO₂',
      source: 'ESA Copernicus Level-2 Product',
      usage: 'Tropospheric NO₂ column density paired with monitored stations for 10 km → 1 km street-level heatmap downscaling.',
    },
    {
      name: 'Indian Cities & WGS84 Coordinates Directory',
      source: 'Built-in Directory (28 States & 8 UTs)',
      usage: 'Search and location validation across 472 Indian cities: 143 CPCB-monitored cities and 329 unmonitored municipalities with verified coordinates.',
    },
    {
      name: 'Historical CPCB Cross-Validation Snapshots',
      source: '143-Station Multi-Season Observations',
      usage: 'Used for leave-one-station-out testing (72 calibration stations, 71 held-out test stations) to select IDW power (p = 2) and calibrate the 80% uncertainty range.',
    },
    {
      name: 'Open-Meteo Air Quality API (Copernicus CAMS)',
      source: 'air-quality-api.open-meteo.com (Live API)',
      usage: 'Retrieves live satellite-assimilated NO₂, Aerosol Optical Depth (550 nm), and Mineral Dust displayed separately as environmental context in Virtual Sensor Mode.',
    },
    {
      name: 'Open-Meteo Weather API (ECMWF IFS)',
      source: 'api.open-meteo.com (Live API)',
      usage: 'Retrieves live 10 m wind speed, wind direction, relative humidity, and planetary boundary-layer height displayed separately in Virtual Sensor Mode.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-[#00f0ff]/15 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
          <Info className="w-3.5 h-3.5 text-[#39ff14]" />
          <span>PROJECT OVERVIEW &amp; DATA SOURCES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          About Orbital AI
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Orbital AI is a web platform for <strong className="text-white">SAR satellite image analysis</strong> and{' '}
          <strong className="text-white">Indian Air Quality Index (AQI) intelligence</strong>. It converts radar imagery into easy-to-read optical and land-cover views, provides CPCB-based AQI analysis for monitored cities, and estimates AQI for unmonitored Indian towns using a validated Virtual Sensor engine.
        </p>
      </div>

      {/* Section 1: Core Working Modules */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-wide">
          What This Project Does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className={`p-5 rounded-xl glass-panel border ${mod.border} space-y-2.5`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${mod.accent}`} />
                  <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: SAR Datasets & Sources */}
      <div className="p-6 rounded-xl glass-panel border border-[#00f0ff]/25 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Database className="w-4 h-4 text-[#00f0ff]" />
          <h2 className="text-base font-bold text-white tracking-wide">
            SAR Analysis — Datasets &amp; Sources
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">Dataset / Layer</th>
                <th className="py-2.5 px-4">Source / Provider</th>
                <th className="py-2.5 pl-4">How It Is Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sarSources.map((item) => (
                <tr key={item.name} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-mono font-semibold text-[#00f0ff] whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {item.source}
                  </td>
                  <td className="py-3 pl-4 text-slate-300 leading-relaxed">
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: AQI & Virtual Sensor Datasets & Live APIs */}
      <div className="p-6 rounded-xl glass-panel-green border border-[#39ff14]/25 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Globe className="w-4 h-4 text-[#39ff14]" />
          <h2 className="text-base font-bold text-white tracking-wide">
            AQI &amp; Virtual Sensor — Datasets &amp; Live Sources
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 pr-4">Dataset / API</th>
                <th className="py-2.5 px-4">Source / Provider</th>
                <th className="py-2.5 pl-4">How It Is Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {aqiSources.map((item) => (
                <tr key={item.name} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-mono font-semibold text-[#39ff14] whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {item.source}
                  </td>
                  <td className="py-3 pl-4 text-slate-300 leading-relaxed">
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Simple Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Code2 className="w-4 h-4 text-[#00f0ff]" />
            <h3>Frontend</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, HTML5 Canvas
          </p>
        </div>

        <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Server className="w-4 h-4 text-[#39ff14]" />
            <h3>Backend</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Node.js, Express REST API, Input Validators, CPCB AQI &amp; IDW Virtual Sensor Engine
          </p>
        </div>

        <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Database className="w-4 h-4 text-slate-300" />
            <h3>Storage &amp; Export</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Local JSON Log Storage &amp; jsPDF Report Export
          </p>
        </div>
      </div>
    </div>
  );
};
