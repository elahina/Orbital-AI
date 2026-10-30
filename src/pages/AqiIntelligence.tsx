import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Wind, 
  Search, 
  Activity, 
  MapPin, 
  Radio, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Info,
  Clock,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AqiIntelligenceResponse, HeatmapGridCell, AqiValidationResult, VirtualSensorDetails } from '../types';
import { VirtualSensorPanel } from '../components/VirtualSensorPanel';
import { validateAqiRasterInput } from '../utils/validators';
import {
  searchIndianCities,
  IndianCityEntry,
  AQI_LOCATION_MESSAGES,
} from '../utils/indianLocations';

export const AqiIntelligence: React.FC = () => {
  const [cityInput, setCityInput] = useState<string>('Bengaluru, India');
  const [scanning, setScanning] = useState<boolean>(false);
  const [result, setResult] = useState<AqiIntelligenceResponse | null>(null);
  const [virtualUnavailable, setVirtualUnavailable] = useState<VirtualSensorDetails | null>(null);
  const [validationError, setValidationError] = useState<AqiValidationResult | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapGridCell | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cityPresets = [
    'Bengaluru, India',
    'New Delhi, India',
    'Mumbai, India',
    'Hyderabad, India',
    'Kolkata, India',
    'Chennai, India',
  ];

  const suggestions = useMemo(
    () => searchIndianCities(cityInput, 200),
    [cityInput]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScanAqi = async (cityToScan?: string) => {
    const target = cityToScan !== undefined ? cityToScan : cityInput;
    const metadata = { inputMode: 'location' };

    setShowSuggestions(false);
    setHighlightedIndex(-1);

    if (!target.trim()) {
      const emptyValidation = validateAqiRasterInput('', undefined, metadata);
      setValidationError(emptyValidation);
      setResult(null);
      setVirtualUnavailable(null);
      setSelectedCell(null);
      return;
    }

    setScanning(true);
    setValidationError(null);
    setVirtualUnavailable(null);

    try {
      // Step 1: Pre-validate input with fallback
      let valData: AqiValidationResult;
      try {
        const valRes = await fetch('/api/aqi/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: target, metadata }),
        });
        if (valRes.ok) {
          valData = await valRes.json();
        } else {
          valData = validateAqiRasterInput(target, undefined, metadata);
        }
      } catch {
        valData = validateAqiRasterInput(target, undefined, metadata);
      }

      if (!valData.valid) {
        setValidationError(valData);
        setResult(null);
        setVirtualUnavailable(null);
        setSelectedCell(null);
        setScanning(false);
        return; // STOP! Never run AI prediction on invalid or unsupported inputs
      }

      // Step 2: Execute AQI super-resolution or Virtual Sensor pipeline
      const res = await fetch('/api/aqi/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: target, metadata }),
      });

      if (!res.ok) {
        try {
          const errData = await res.json();
          setValidationError({
            valid: false,
            data_type: errData.data_type || 'aqi_data_unavailable',
            source: valData.source || null,
            reason: errData.reason || errData.error || AQI_LOCATION_MESSAGES.DATA_UNAVAILABLE,
            checks: errData.checks || {
              fileFormat: { passed: false, message: 'Unavailable' },
              geospatialRaster: { passed: false, message: 'Unavailable' },
              pollutantVariable: { passed: false, message: 'Unavailable' },
              rasterValues: { passed: false, message: 'Unavailable' },
            },
          });
          setResult(null);
          setVirtualUnavailable(null);
          setSelectedCell(null);
        } catch {
          setResult(null);
          setVirtualUnavailable(null);
          setSelectedCell(null);
        }
        return;
      }

      const data = await res.json();
      if (data.isVirtualSensor && data.estimateAvailable === false && data.virtualSensor) {
        setResult(null);
        setSelectedCell(null);
        setVirtualUnavailable(data.virtualSensor);
      } else {
        setVirtualUnavailable(null);
        setResult(data);
        if (data.downscaling?.grid?.length > 0) {
          setSelectedCell(data.downscaling.grid[24] || data.downscaling.grid[0]); // Center cell
        } else {
          setSelectedCell(null);
        }
      }
    } catch (e) {
      console.warn('Scan AQI handled notice:', e);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    handleScanAqi('Bengaluru, India');
  }, []);

  const handleSelectCity = (entry: IndianCityEntry) => {
    const formatted =
      entry.city === entry.state
        ? `${entry.city}, India`
        : `${entry.city}, ${entry.state}`;
    setCityInput(formatted);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    handleScanAqi(formatted);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showSuggestions) {
        setShowSuggestions(true);
      } else if (suggestions.length > 0) {
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectCity(suggestions[highlightedIndex]);
      } else {
        setShowSuggestions(false);
        handleScanAqi();
      }
    }
  };

  const isDataUnavailableOrEmpty =
    validationError?.data_type === 'aqi_data_unavailable' ||
    validationError?.data_type === 'empty_location';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#39ff14]/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#39ff14] mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#39ff14]" />
            <span>ATMOSPHERIC SUPER-RESOLUTION &bull; SENTINEL-5P / TROPOMI &amp; CPCB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            AQI Intelligence &amp; Downscaling
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30">
            10km &rarr; 1km Deep Super-Resolution &bull; CPCB Indian AQI Standard
          </span>
        </div>
      </div>

      {/* Input and Controls Panel */}
      <div className="relative z-30 p-5 rounded-xl glass-panel-green border border-[#39ff14]/30 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Searchable Indian City Input */}
          <div ref={searchContainerRef} className="relative z-30 flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              id="aqi-location-input"
              type="text"
              value={cityInput}
              onFocus={() => {
                setShowSuggestions(true);
              }}
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search Indian city or state/UT (e.g. Bengaluru, India)"
              autoComplete="off"
              className="w-full pl-10 pr-9 py-3 rounded-xl bg-black/60 border border-[#39ff14]/30 focus:border-[#39ff14] text-sm text-white font-mono placeholder:text-slate-500 outline-none transition-all"
            />
            {cityInput && (
              <button
                type="button"
                onClick={() => {
                  setCityInput('');
                  setValidationError(null);
                  setShowSuggestions(true);
                  setHighlightedIndex(-1);
                  inputRef.current?.focus();
                }}
                title="Clear location"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Searchable Indian Cities Dropdown (All States & Union Territories) */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#070b14] border border-[#39ff14]/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
                <div className="px-3.5 py-2 border-b border-white/10 bg-black/80 flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
                  <span>INDIAN CITIES DIRECTORY (28 STATES &amp; 8 UTs)</span>
                  <span className="shrink-0 whitespace-nowrap">{suggestions.length} {suggestions.length === 1 ? 'match' : 'matches'}</span>
                </div>

                {suggestions.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto divide-y divide-white/5">
                    {suggestions.map((item, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      const label =
                        item.city === item.state
                          ? `${item.city}, India`
                          : `${item.city}, ${item.state}`;

                      return (
                        <li key={`${item.city}-${item.state}`}>
                          <button
                            type="button"
                            onClick={() => handleSelectCity(item)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 text-xs font-mono transition-colors cursor-pointer ${
                              isHighlighted
                                ? 'bg-[#39ff14]/15 text-white'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <MapPin
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  item.aqiDbKey ? 'text-[#39ff14]' : 'text-slate-500'
                                }`}
                              />
                              <span className="truncate">{label}</span>
                            </span>
                            {item.aqiDbKey ? (
                              <span className="px-2 py-0.5 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 text-[10px] text-[#39ff14] shrink-0">
                                CPCB Station
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-300/80 shrink-0">
                                Virtual Sensor
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-3.5 py-3 text-xs font-mono text-slate-400">
                    No matching Indian city in directory. Press Enter or click Downscale &amp; Forecast to validate.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Run Pipeline CTA */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <button
              id="run-aqi-scan-btn"
              onClick={() => handleScanAqi()}
              disabled={scanning}
              className={`flex-1 md:flex-initial px-6 py-3 rounded-xl font-bold font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scanning
                  ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/40 cursor-wait'
                  : 'bg-gradient-to-r from-[#39ff14] to-[#22c55e] text-slate-950 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] active:scale-95'
              }`}
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Downscaling...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Downscale &amp; Forecast</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Preset Chips (Indian Stations Only) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Quick Stations:</span>
            {cityPresets.map((c) => {
              const isSelectedPreset =
                cityInput === c || (result?.city === c && !validationError);
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCityInput(c);
                    setShowSuggestions(false);
                    handleScanAqi(c);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border cursor-pointer ${
                    isSelectedPreset
                      ? 'bg-[#39ff14]/15 border-[#39ff14] text-[#39ff14]'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-[#39ff14]/30'
                  }`}
                >
                  {c.split(',')[0]}
                </button>
              );
            })}
          </div>

          {/* Validation Status Badge */}
          <div className="text-xs font-mono">
            {validationError ? (
              isDataUnavailableOrEmpty ? (
                <span className="text-amber-400 flex items-center gap-1.5 text-[11px] font-bold">
                  <Info className="w-3.5 h-3.5" />
                  {validationError.data_type === 'empty_location' ? 'LOCATION REQUIRED' : 'DATA UNAVAILABLE'}
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1.5 text-[11px] font-bold">
                  <XCircle className="w-3.5 h-3.5" />
                  {validationError.data_type === 'non_indian_location'
                    ? 'INDIA LOCATIONS ONLY'
                    : validationError.data_type === 'location_not_found'
                    ? 'LOCATION NOT FOUND'
                    : `REJECTED (${validationError.data_type.toUpperCase()})`}
                </span>
              )
            ) : virtualUnavailable ? (
              <span className="text-amber-300 flex items-center gap-1.5 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> ESTIMATE UNAVAILABLE (VIRTUAL SENSOR)
              </span>
            ) : result?.isVirtualSensor ? (
              <span className="text-amber-300 flex items-center gap-1.5 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> ESTIMATED &mdash; VIRTUAL SENSOR
              </span>
            ) : result ? (
              <span className="text-[#39ff14] flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> TROPOMI / CPCB VERIFIED
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Location Validation / Data Availability Notification Card */}
      {validationError && (
        <div
          id="aqi-location-message"
          role="alert"
          className={`p-5 rounded-xl space-y-3 animate-in fade-in duration-200 ${
            isDataUnavailableOrEmpty
              ? 'bg-amber-950/30 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.12)]'
              : 'bg-red-950/40 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                isDataUnavailableOrEmpty
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}
            >
              {isDataUnavailableOrEmpty ? (
                <Info className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    isDataUnavailableOrEmpty
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                >
                  {validationError.data_type === 'empty_location'
                    ? 'INPUT REQUIRED'
                    : validationError.data_type === 'aqi_data_unavailable'
                    ? 'AQI DATA UNAVAILABLE'
                    : validationError.data_type === 'non_indian_location'
                    ? 'UNSUPPORTED REGION'
                    : 'INVALID LOCATION'}
                </span>
                {validationError.source && (
                  <span className="text-xs font-mono text-slate-300">
                    {validationError.source}
                  </span>
                )}
              </div>

              <p
                className={`text-sm font-medium leading-relaxed ${
                  isDataUnavailableOrEmpty ? 'text-amber-100' : 'text-red-100'
                }`}
              >
                {validationError.reason}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setCityInput('Bengaluru, India');
                handleScanAqi('Bengaluru, India');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 text-slate-200 font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#39ff14]" /> Select Supported Indian Station
            </button>
          </div>
        </div>
      )}

      {/* Virtual Sensor Mode Section (Unmonitored Indian Cities) */}
      {virtualUnavailable && (
        <VirtualSensorPanel
          virtualSensor={virtualUnavailable}
          estimatedPollutants={null}
          onSelectCity={(c) => {
            setCityInput(c);
            handleScanAqi(c);
          }}
        />
      )}

      {result && result.isVirtualSensor && result.virtualSensor && (
        <VirtualSensorPanel
          virtualSensor={result.virtualSensor}
          estimatedPollutants={result.currentPollutants}
          onSelectCity={(c) => {
            setCityInput(c);
            handleScanAqi(c);
          }}
        />
      )}

      {/* Main Results Grid (Official Paired CPCB + Sentinel-5P Stations & Rasters) */}
      {result && !result.isVirtualSensor && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Current Pollutants & Ground Station Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Current Pollutants Card */}
            <div className="p-5 rounded-xl glass-panel-green border border-[#39ff14]/30 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#39ff14]" />
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Current Pollutants
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  CPCB Indian AQI Standard
                </span>
              </div>

              {/* AQI Master Display */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    AIR QUALITY INDEX (AQI)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span 
                      className="text-4xl font-extrabold font-mono"
                      style={{ color: result.currentPollutants.categoryColor }}
                    >
                      {result.currentPollutants.aqi}
                    </span>
                    <span 
                      className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${result.currentPollutants.categoryColor}20`,
                        color: result.currentPollutants.categoryColor,
                        border: `1px solid ${result.currentPollutants.categoryColor}50`
                      }}
                    >
                      {result.currentPollutants.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                    Prominent Sub-Index: <strong className="text-white">{result.currentPollutants.prominentPollutant}</strong>
                  </span>
                </div>

                <div className="text-right font-mono text-xs text-slate-400 space-y-1">
                  <div>Lat: <span className="text-white">{result.coordinates.lat}&deg;</span></div>
                  <div>Lng: <span className="text-white">{result.coordinates.lng}&deg;</span></div>
                </div>
              </div>

              {/* 4 Core Measured Pollutant Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {/* PM2.5 */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    PM2.5
                  </span>
                  <div className="text-lg font-bold font-mono text-white">
                    {result.currentPollutants.pm25} <span className="text-xs text-slate-400 font-normal">&micro;g/m&sup3;</span>
                  </div>
                </div>

                {/* NO2 */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    NO&sub2;
                  </span>
                  <div className="text-lg font-bold font-mono text-white">
                    {result.currentPollutants.no2} <span className="text-xs text-slate-400 font-normal">ppb</span>
                  </div>
                </div>

                {/* CO */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    CO
                  </span>
                  <div className="text-lg font-bold font-mono text-white">
                    {result.currentPollutants.co} <span className="text-xs text-slate-400 font-normal">ppm</span>
                  </div>
                </div>

                {/* Ozone */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Ozone (O&sub3;)
                  </span>
                  <div className="text-lg font-bold font-mono text-white">
                    {result.currentPollutants.ozone} <span className="text-xs text-slate-400 font-normal">ppb</span>
                  </div>
                </div>
              </div>

              {/* Data Fusion Sources */}
              <div className="p-3.5 rounded-lg bg-black/50 border border-[#39ff14]/20 text-xs font-mono space-y-2">
                <div className="text-[11px] font-bold text-[#39ff14] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Satellite &amp; Ground Station Dual Feed
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>SATELLITE SENSOR:</span>
                  <span className="text-slate-200">{result.satelliteData.sensor}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>TROPO NO2 COLUMN:</span>
                  <span className="text-[#00f0ff] font-bold">{result.satelliteData.tropoNo2Column} &times; 10¹⁵ molec/cm²</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>GROUND CAAQMS:</span>
                  <span className="text-slate-200 truncate max-w-[180px]">{result.groundStation.source}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Street-Level Heatmap & CNN-LSTM Forecast (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Street-level PM2.5 Heatmap Card */}
            <div className="p-5 rounded-xl glass-panel-green border border-[#39ff14]/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#39ff14]" />
                    Street-level PM2.5 Heatmap
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Downscaled from 10km satellite data to 1km street-level resolution using deep super-resolution networks.
                  </p>
                </div>
              </div>

              {/* Risk Alert Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-400 block">High Risk Zone Detected</span>
                    <span className="text-[10px] text-slate-300">{result.downscaling.highRiskZoneSummary}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-green-950/40 border border-[#39ff14]/40 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#39ff14] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#39ff14] block">Safe Zone: 4km North</span>
                    <span className="text-[10px] text-slate-300">{result.downscaling.safeZoneSummary}</span>
                  </div>
                </div>
              </div>

              {/* 7x7 Interactive Downscaled Grid Map */}
              <div className="relative rounded-xl overflow-hidden border border-[#39ff14]/30 bg-black/80 p-4">
                {/* Background Map Grid Graphic */}
                <div className="grid grid-cols-7 gap-1.5 aspect-square max-w-[420px] mx-auto">
                  {result.downscaling.grid.map((cell, idx) => {
                    const isSelected = selectedCell?.x === cell.x && selectedCell?.y === cell.y;
                    
                    let bg = 'rgba(34, 197, 94, 0.4)'; // Low/Good
                    if (cell.riskLevel === 'CRITICAL') bg = 'rgba(239, 68, 68, 0.85)';
                    else if (cell.riskLevel === 'HIGH') bg = 'rgba(249, 115, 22, 0.75)';
                    else if (cell.riskLevel === 'MODERATE') bg = 'rgba(234, 179, 8, 0.65)';

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCell(cell)}
                        className={`rounded-md transition-all relative flex flex-col items-center justify-center p-1 text-[9px] font-mono font-bold ${
                          isSelected
                            ? 'ring-2 ring-white scale-105 z-10 shadow-[0_0_15px_#39ff14]'
                            : 'hover:opacity-100 opacity-85 hover:scale-102'
                        }`}
                        style={{ backgroundColor: bg }}
                        title={`PM2.5: ${cell.pm25} µg/m³ (AQI ${cell.aqi})`}
                      >
                        <span className="text-white drop-shadow">{cell.pm25}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Cell HUD */}
                {selectedCell && (
                  <div className="mt-4 p-3 rounded-lg bg-[#050510]/90 border border-[#39ff14]/40 flex flex-wrap items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#39ff14] animate-pulse" />
                      <span className="text-slate-300">
                        Cell ({selectedCell.x}, {selectedCell.y}) &bull; Lat: {selectedCell.lat}, Lng: {selectedCell.lng}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#39ff14] font-bold">PM2.5: {selectedCell.pm25} &micro;g/m&sup3;</span>
                      <span className="text-[#00f0ff] font-bold">Sub-AQI: {selectedCell.aqi}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Forecast (Next 6 Hours) Card */}
            <div className="p-5 rounded-xl glass-panel-green border border-[#39ff14]/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#39ff14]" />
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Forecast (Next 6 Hours)
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 text-[10px] font-mono text-[#39ff14]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-ping" />
                  <span>CNN+LSTM Active</span>
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.forecast.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39ff14" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#39ff14" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.15)" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#050510',
                        borderColor: 'rgba(57, 255, 20, 0.4)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke="#39ff14"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#forecastGrad)"
                      name="Predicted AQI"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="text-[11px] text-slate-400 font-mono text-center">
                Temporal sequence model incorporating planetary boundary layer height &amp; diurnal traffic dispersion.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
