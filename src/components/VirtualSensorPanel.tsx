import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
  Globe,
  Info,
  MapPin,
  Radio,
  ShieldAlert,
  Wind,
  XCircle,
} from 'lucide-react';
import { PollutantMeasurement, VirtualSensorDetails, VirtualSensorDonorStation } from '../types';

interface VirtualSensorPanelProps {
  virtualSensor: VirtualSensorDetails;
  estimatedPollutants: PollutantMeasurement | null;
  onSelectCity: (cityQuery: string) => void;
}

export const VirtualSensorPanel: React.FC<VirtualSensorPanelProps> = ({
  virtualSensor,
  estimatedPollutants,
  onSelectCity,
}) => {
  const [activeStationKey, setActiveStationKey] = useState<string | null>(
    virtualSensor.nearbyStations[0]?.stationKey ?? null
  );

  const isEstimated = virtualSensor.status === 'ESTIMATED' && estimatedPollutants !== null;
  const {
    nearbyStations,
    satelliteObservations,
    weatherReadings,
    estimationMethod,
    uncertainty,
    validationSummary,
    coordinates,
  } = virtualSensor;

  const fullCityTitle =
    virtualSensor.city === virtualSensor.state
      ? `${virtualSensor.city}, India`
      : `${virtualSensor.city}, ${virtualSensor.state}`;

  // Aspect-corrected geospatial coordinate projection for the target city + 3 donor stations
  const mapGeometry = React.useMemo(() => {
    const allPts = [
      { lat: coordinates.lat, lng: coordinates.lng, isTarget: true },
      ...nearbyStations.map((s) => ({ lat: s.lat, lng: s.lng, isTarget: false })),
    ];

    const meanLatRad =
      (allPts.reduce((acc, p) => acc + p.lat, 0) / Math.max(allPts.length, 1)) *
      (Math.PI / 180);
    const cosLat = Math.max(0.4, Math.cos(meanLatRad));

    const xs = allPts.map((p) => p.lng * cosLat);
    const ys = allPts.map((p) => p.lat);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = Math.max(maxX - minX, 0.35);
    const spanY = Math.max(maxY - minY, 0.35);
    const maxSpan = Math.max(spanX, spanY) * 1.38;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const width = 460;
    const height = 320;
    const padX = 52;
    const padY = 38;
    const drawSize = Math.min(width - padX * 2, height - padY * 2);

    const project = (lat: number, lng: number) => {
      const px = width / 2 + (((lng * cosLat - centerX) / maxSpan) * drawSize);
      const py = height / 2 - (((lat - centerY) / maxSpan) * drawSize);
      return { x: Number(px.toFixed(1)), y: Number(py.toFixed(1)) };
    };

    // Approximate scale bar in km (1 degree lat ≈ 111.32 km)
    const rawScaleKm = (maxSpan * 111.32) / 4;
    const niceSteps = [10, 20, 25, 50, 100, 150, 200, 300, 500];
    const scaleKm =
      niceSteps.reduce((prev, curr) =>
        Math.abs(curr - rawScaleKm) < Math.abs(prev - rawScaleKm) ? curr : prev
      ) || 50;
    const scalePx = Math.max(36, Math.min(130, ((scaleKm / 111.32) / maxSpan) * drawSize));

    const minLatLabel = (centerY - maxSpan / 2).toFixed(2);
    const maxLatLabel = (centerY + maxSpan / 2).toFixed(2);
    const minLngLabel = (centerX / cosLat - maxSpan / (2 * cosLat)).toFixed(2);
    const maxLngLabel = (centerX / cosLat + maxSpan / (2 * cosLat)).toFixed(2);

    return {
      width,
      height,
      targetPt: project(coordinates.lat, coordinates.lng),
      stationPts: nearbyStations.map((s) => ({
        station: s,
        pt: project(s.lat, s.lng),
      })),
      scaleKm,
      scalePx: Number(scalePx.toFixed(1)),
      boundsLabels: { minLatLabel, maxLatLabel, minLngLabel, maxLngLabel },
    };
  }, [coordinates.lat, coordinates.lng, nearbyStations]);

  const highlightedStation: VirtualSensorDonorStation | undefined =
    nearbyStations.find((s) => s.stationKey === activeStationKey) || nearbyStations[0];

  return (
    <section
      id="virtual-sensor-section"
      aria-labelledby="virtual-sensor-heading"
      className="space-y-6"
    >
      {/* Prominent Disclaimer & Mode Banner */}
      <div className="p-5 rounded-xl bg-[#07111a]/95 border border-amber-400/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold tracking-wide">
                {virtualSensor.disclaimerLabel}
              </span>
            </div>
            <h2
              id="virtual-sensor-heading"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              Estimated AQI — Virtual Sensor
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-300 tabular-nums space-y-0.5 md:text-right">
            <div className="text-white font-semibold">{fullCityTitle}</div>
            <div className="text-slate-400">
              {coordinates.lat}&deg;N &middot; {coordinates.lng}&deg;E &middot; {virtualSensor.evaluatedAt}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {fullCityTitle} does not have an active CPCB Continuous Ambient Air Quality Monitoring Station (CAAQMS) in the local directory. This output is a{' '}
          <strong className="text-amber-300">spatial virtual-sensor estimate</strong> computed from nearby CPCB monitoring stations and must not be cited as an official CPCB measurement.
        </p>
      </div>

      {/* Case B: Valid Indian Location Where Reliable Estimate Cannot Currently Be Produced */}
      {!isEstimated && (
        <div
          id="virtual-sensor-unavailable-card"
          role="status"
          className="p-6 rounded-xl bg-amber-950/25 border border-amber-500/45 space-y-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-mono text-amber-300 font-semibold">
                Estimate Halted &middot; Valid Indian Municipality Outside Validated Station Density
              </div>
              <h3 className="text-base font-bold text-white">
                Virtual Sensor Estimate Cannot Currently Be Produced
              </h3>
              <p className="text-sm text-amber-100/95 leading-relaxed">
                {virtualSensor.unavailabilityReason}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/55 border border-white/10 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <span>
              Validated Domain Requirement: 3 CPCB stations with d₁ &le; {validationSummary.maxNearestDistanceKm} km and d₃ &le; {validationSummary.maxThirdStationDistanceKm} km
            </span>
            {nearbyStations[0] && (
              <button
                type="button"
                onClick={() => onSelectCity(nearbyStations[0].cityName)}
                className="px-3 py-1.5 rounded-lg bg-[#39ff14]/15 hover:bg-[#39ff14]/25 border border-[#39ff14]/40 text-[#39ff14] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Open Nearest CPCB Station ({nearbyStations[0].cityName.split(',')[0]})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Case A: Validated Estimated AQI + Uncertainty + Triangulation Map */}
      {isEstimated && estimatedPollutants && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 5 Cols: Estimated AQI, Estimated Concentrations & Validated Uncertainty */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Estimated AQI & Pollutant Concentrations Card */}
            <div className="p-5 rounded-xl glass-panel border border-amber-400/30 space-y-5 flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-bold text-white">
                  Estimated Surface Air Quality
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Estimated &middot; Not Official CPCB
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">
                    ESTIMATED AQI (VIRTUAL SENSOR)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span
                      id="virtual-estimated-aqi-value"
                      className="text-4xl font-extrabold font-mono tabular-nums"
                      style={{ color: estimatedPollutants.categoryColor }}
                    >
                      {estimatedPollutants.aqi}
                    </span>
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: estimatedPollutants.categoryColor }}
                    >
                      {estimatedPollutants.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                    Prominent Sub-Index:{' '}
                    <strong className="text-white">{estimatedPollutants.prominentPollutant}</strong>
                  </div>
                </div>

                {uncertainty && uncertainty.available && (
                  <div className="text-right font-mono tabular-nums bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] text-slate-400">
                      {uncertainty.nominalCoveragePct}% PREDICTION RANGE
                    </div>
                    <div className="text-base font-bold text-[#00f0ff] mt-0.5">
                      {uncertainty.lowerAqi} &ndash; {uncertainty.upperAqi} AQI
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      &plusmn;{uncertainty.halfWidthAqi} AQI (Validated)
                    </div>
                  </div>
                )}
              </div>

              {/* Concentration-First Pollutant Estimates + CPCB Sub-Indices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Interpolated Pollutant Concentrations (Step 1)</span>
                  <span>CPCB Sub-Index (Step 2)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono tabular-nums">
                  <div className="p-2.5 rounded-lg bg-black/45 border border-white/10">
                    <div className="text-[10px] text-slate-400">PM2.5</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {estimatedPollutants.pm25}{' '}
                      <span className="text-[10px] font-normal text-slate-400">&micro;g/m&sup3;</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub-Index: <span className="text-slate-200">{virtualSensor.estimatedSubIndices?.pm25}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/45 border border-white/10">
                    <div className="text-[10px] text-slate-400">PM10</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {estimatedPollutants.pm10}{' '}
                      <span className="text-[10px] font-normal text-slate-400">&micro;g/m&sup3;</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub-Index: <span className="text-slate-200">{virtualSensor.estimatedSubIndices?.pm10}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/45 border border-white/10">
                    <div className="text-[10px] text-slate-400">NO&sub2;</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {estimatedPollutants.no2}{' '}
                      <span className="text-[10px] font-normal text-slate-400">ppb</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub-Index: <span className="text-slate-200">{virtualSensor.estimatedSubIndices?.no2}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/45 border border-white/10">
                    <div className="text-[10px] text-slate-400">CO</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {estimatedPollutants.co}{' '}
                      <span className="text-[10px] font-normal text-slate-400">ppm</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub-Index: <span className="text-slate-200">{virtualSensor.estimatedSubIndices?.co}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/45 border border-white/10 col-span-2 sm:col-span-2">
                    <div className="text-[10px] text-slate-400">Ozone (O&sub3;)</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {estimatedPollutants.ozone}{' '}
                      <span className="text-[10px] font-normal text-slate-400">ppb</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sub-Index: <span className="text-slate-200">{virtualSensor.estimatedSubIndices?.ozone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence & Held-Out Cross-Validation Card */}
            {uncertainty && (
              <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <span className="text-sm font-bold text-white">
                    Confidence &amp; Empirical Validation
                  </span>
                  <span className="text-[11px] font-mono text-[#00f0ff] tabular-nums">
                    Held-Out R&sup2; = {validationSummary.aqiR2}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Uncertainty range{' '}
                  <strong className="text-white font-mono tabular-nums">
                    {uncertainty.lowerAqi}&ndash;{uncertainty.upperAqi} AQI (&plusmn;{uncertainty.halfWidthAqi})
                  </strong>{' '}
                  is computed via split-conformal calibration scaled by reference station spread ({uncertainty.donorAqiSpread} AQI) and nearest-station distance ({uncertainty.nearestStationDistanceKm} km).
                </p>

                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono tabular-nums">
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                    <div className="text-[10px] text-slate-400">HELD-OUT AQI MAE / MEDIAN</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {validationSummary.aqiMae} / {validationSummary.aqiMedianAe} AQI
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      RMSE: {validationSummary.aqiRmse} AQI
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                    <div className="text-[10px] text-slate-400">EMPIRICAL INTERVAL COVERAGE</div>
                    <div className="text-sm font-bold text-[#39ff14] mt-0.5">
                      {validationSummary.conformalEmpiricalCoveragePct}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Target: {validationSummary.conformalTargetCoveragePct}% ({validationSummary.heldOutEvaluationsCount} test cases)
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 leading-relaxed pt-1 border-t border-white/10">
                  Evaluated on <strong className="text-slate-200">{validationSummary.heldOutStationsCount} unseen CPCB stations</strong> across <strong className="text-slate-200">{validationSummary.heldOutDatesCount} dates</strong> (PM2.5 MAE: {validationSummary.pm25Mae} &micro;g/m&sup3;, category match: {validationSummary.categoryExactMatchPct}%), kept strictly separate from the {validationSummary.trainingStationsCount}-station parameter calibration split.
                </div>
              </div>
            )}
          </div>

          {/* Right 7 Cols: Geospatial Reference Station Triangulation Map */}
          <div className="lg:col-span-7 p-5 rounded-xl glass-panel border border-[#00f0ff]/25 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Reference CPCB Station Triangulation Map
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  WGS84 aspect-corrected airshed projection showing {fullCityTitle} and the 3 donor CPCB stations.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                IDW Power p = {validationSummary.idwPower}
              </span>
            </div>

            <div className="relative rounded-xl bg-[#040812] border border-white/10 overflow-hidden p-2">
              <svg
                viewBox={`0 0 ${mapGeometry.width} ${mapGeometry.height}`}
                className="w-full h-auto max-h-[340px] block select-none"
                role="img"
                aria-label={`Triangulation map for ${fullCityTitle} and 3 nearest CPCB stations`}
              >
                {/* Coordinate Graticule */}
                {[0.2, 0.4, 0.6, 0.8].map((frac, idx) => (
                  <React.Fragment key={idx}>
                    <line
                      x1={mapGeometry.width * frac}
                      y1={20}
                      x2={mapGeometry.width * frac}
                      y2={mapGeometry.height - 24}
                      stroke="rgba(148, 163, 184, 0.12)"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={32}
                      y1={mapGeometry.height * frac}
                      x2={mapGeometry.width - 20}
                      y2={mapGeometry.height * frac}
                      stroke="rgba(148, 163, 184, 0.12)"
                      strokeDasharray="3 3"
                    />
                  </React.Fragment>
                ))}

                {/* Bounding Lat/Lng Axis Labels */}
                <text x={36} y={16} fill="#64748b" fontSize="9" fontFamily="monospace">
                  {mapGeometry.boundsLabels.maxLatLabel}&deg;N
                </text>
                <text x={36} y={mapGeometry.height - 8} fill="#64748b" fontSize="9" fontFamily="monospace">
                  {mapGeometry.boundsLabels.minLatLabel}&deg;N
                </text>
                <text x={42} y={mapGeometry.height - 26} fill="#64748b" fontSize="9" fontFamily="monospace">
                  {mapGeometry.boundsLabels.minLngLabel}&deg;E
                </text>
                <text
                  x={mapGeometry.width - 24}
                  y={mapGeometry.height - 26}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {mapGeometry.boundsLabels.maxLngLabel}&deg;E
                </text>

                {/* North Indicator */}
                <g transform={`translate(${mapGeometry.width - 32}, 32)`}>
                  <circle r="13" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(148,163,184,0.3)" />
                  <path d="M0 -8 L3.5 3 L0 1 L-3.5 3 Z" fill="#00f0ff" />
                  <text y="10" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontFamily="monospace">
                    N
                  </text>
                </g>

                {/* Scale Bar */}
                <g transform={`translate(42, ${mapGeometry.height - 14})`}>
                  <line
                    x1={0}
                    y1={0}
                    x2={mapGeometry.scalePx}
                    y2={0}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  <line x1={0} y1={-3} x2={0} y2={3} stroke="#94a3b8" strokeWidth="1.5" />
                  <line
                    x1={mapGeometry.scalePx}
                    y1={-3}
                    x2={mapGeometry.scalePx}
                    y2={3}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <text
                    x={mapGeometry.scalePx + 6}
                    y={3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    ~{mapGeometry.scaleKm} km
                  </text>
                </g>

                {/* Geodesic Triangulation Links from 3 Donor CPCB Stations to Target City */}
                {mapGeometry.stationPts.map(({ station, pt }) => {
                  const midX = (pt.x + mapGeometry.targetPt.x) / 2;
                  const midY = (pt.y + mapGeometry.targetPt.y) / 2;
                  const isActive = highlightedStation?.stationKey === station.stationKey;
                  return (
                    <g key={`link-${station.stationKey}`}>
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={mapGeometry.targetPt.x}
                        y2={mapGeometry.targetPt.y}
                        stroke={isActive ? '#00f0ff' : 'rgba(57, 255, 20, 0.55)'}
                        strokeWidth={Math.max(1.5, station.idwWeight * 5)}
                        strokeDasharray="5 3"
                      />
                      <rect
                        x={midX - 38}
                        y={midY - 9}
                        width={76}
                        height={17}
                        rx={4}
                        fill="rgba(5, 8, 20, 0.9)"
                        stroke="rgba(148, 163, 184, 0.25)"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {station.distanceKm}km &middot; {station.idwWeightPercent}%
                      </text>
                    </g>
                  );
                })}

                {/* Wind Direction Flow Vector at Target (only if real weather wind direction is available) */}
                {weatherReadings.windDirectionDeg !== null &&
                  weatherReadings.windSpeedMs !== null && (
                    <g
                      transform={`translate(${mapGeometry.targetPt.x}, ${mapGeometry.targetPt.y}) rotate(${
                        (weatherReadings.windDirectionDeg + 180) % 360
                      })`}
                    >
                      <line
                        x1={0}
                        y1={18}
                        x2={0}
                        y2={-30}
                        stroke="#38bdf8"
                        strokeWidth="1.6"
                        strokeOpacity="0.8"
                      />
                      <polygon points="0,-34 -4,-26 4,-26" fill="#38bdf8" opacity="0.9" />
                    </g>
                  )}

                {/* 3 Reference CPCB Station Nodes */}
                {mapGeometry.stationPts.map(({ station, pt }, idx) => {
                  const isActive = highlightedStation?.stationKey === station.stationKey;
                  const shortCity = station.cityName.split(',')[0];
                  return (
                    <g
                      key={station.stationKey}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      onClick={() => setActiveStationKey(station.stationKey)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={isActive ? 13 : 10}
                        fill="rgba(5, 10, 22, 0.95)"
                        stroke={station.readings.categoryColor}
                        strokeWidth={isActive ? 2.6 : 2}
                      />
                      <text
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        #{idx + 1}
                      </text>
                      <text
                        y={pt.y < mapGeometry.targetPt.y ? -16 : 22}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {shortCity} (AQI {station.readings.aqi})
                      </text>
                    </g>
                  );
                })}

                {/* Central Target City (Virtual Sensor Node) */}
                <g transform={`translate(${mapGeometry.targetPt.x}, ${mapGeometry.targetPt.y})`}>
                  <circle
                    r="15"
                    fill="rgba(245, 158, 11, 0.16)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  <circle
                    r="5.5"
                    fill={estimatedPollutants?.categoryColor || '#fbbf24'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    y="-20"
                    textAnchor="middle"
                    fill="#fde68a"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {virtualSensor.city} (Est. {estimatedPollutants.aqi})
                  </text>
                </g>
              </svg>
            </div>

            {/* Selected Reference Station Quick Inspector */}
            {highlightedStation && (
              <div className="p-3.5 rounded-lg bg-black/55 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono tabular-nums">
                <div className="space-y-0.5">
                  <div className="text-white font-semibold">
                    Reference Station: {highlightedStation.stationName} ({highlightedStation.stationId})
                  </div>
                  <div className="text-slate-400">
                    Distance: {highlightedStation.distanceKm} km ({highlightedStation.compassDirection}) &middot; Weight: {highlightedStation.idwWeightPercent}% &middot; Measured AQI: {highlightedStation.readings.aqi} &middot; PM2.5: {highlightedStation.readings.pm25} &micro;g/m&sup3;
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCity(highlightedStation.cityName)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[#39ff14] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Load Official Station</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nearby CPCB Reference Stations Table */}
      <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#39ff14]" />
              <span>Nearby CPCB Monitoring Stations (3 Reference Donors)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Measured CPCB station observations used to spatially interpolate pollutant concentrations at {fullCityTitle}.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Official CPCB CAAQMS Reference Readings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="py-2.5 pr-4 font-medium">Station &amp; ID</th>
                <th className="py-2.5 px-3 font-medium">Distance</th>
                <th className="py-2.5 px-3 font-medium">IDW Weight</th>
                <th className="py-2.5 px-3 font-medium">Measured AQI</th>
                <th className="py-2.5 px-3 font-medium">PM2.5 / PM10</th>
                <th className="py-2.5 px-3 font-medium">NO&sub2; / CO / O&sub3;</th>
                <th className="py-2.5 px-3 font-medium">Observation Time</th>
                <th className="py-2.5 pl-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {nearbyStations.map((st, idx) => (
                <tr
                  key={st.stationKey}
                  onClick={() => setActiveStationKey(st.stationKey)}
                  className={`transition-colors cursor-pointer ${
                    highlightedStation?.stationKey === st.stationKey
                      ? 'bg-white/[0.05]'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-white">
                      #{idx + 1} {st.stationName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {st.cityName} &middot; {st.stationId}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-white font-semibold">{st.distanceKm} km</span>{' '}
                    <span className="text-slate-400">({st.compassDirection})</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#00f0ff] font-semibold">
                    {isEstimated ? `${st.idwWeightPercent}%` : 'Out of Domain'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className="font-bold"
                      style={{ color: st.readings.categoryColor }}
                    >
                      {st.readings.aqi}
                    </span>{' '}
                    <span className="text-[10px] text-slate-400">({st.readings.category})</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-300">
                    {st.readings.pm25} / {st.readings.pm10}{' '}
                    <span className="text-[10px] text-slate-500">&micro;g/m&sup3;</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-300">
                    {st.readings.no2} ppb &middot; {st.readings.co} ppm &middot; {st.readings.ozone} ppb
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-400">
                    {st.observationTime}
                  </td>
                  <td className="py-3 pl-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCity(st.cityName);
                      }}
                      className="px-2.5 py-1 rounded bg-black/60 hover:bg-black/90 border border-white/15 text-[11px] text-[#39ff14] transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Separate Display of Satellite Observations & Weather Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Observations Card */}
        <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00f0ff]" />
                <span>Satellite Atmospheric Observations</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {satelliteObservations.sourceSummary}
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Displayed Separately (Contextual)
            </span>
          </div>

          {satelliteObservations.missingInputs.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/35 text-xs text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Missing Satellite Inputs: </span>
                <span>{satelliteObservations.missingInputs.join(', ')}. No values were fabricated.</span>
              </div>
            </div>
          )}

          <div className="space-y-2.5 font-mono text-xs tabular-nums">
            {satelliteObservations.items.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-400">
                    Source: {item.source}
                    {item.timestamp ? ` · ${item.timestamp}` : ''}
                  </div>
                </div>
                <div className="sm:text-right">
                  {item.available ? (
                    <span className="text-sm font-bold text-[#00f0ff] whitespace-nowrap">
                      {item.displayValue}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-400 flex items-center sm:justify-end gap-1 whitespace-nowrap">
                      <XCircle className="w-3.5 h-3.5" /> Unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Readings Card */}
        <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#39ff14]" />
                <span>Meteorological Weather Readings</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {weatherReadings.sourceSummary}
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Displayed Separately (Contextual)
            </span>
          </div>

          {weatherReadings.missingInputs.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/35 text-xs text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Missing Weather Inputs: </span>
                <span>{weatherReadings.missingInputs.join(', ')}. No values were fabricated.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs tabular-nums">
            {weatherReadings.items.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg bg-black/50 border border-white/10 flex flex-col justify-between gap-1.5"
              >
                <div className="text-[11px] text-slate-400">{item.label}</div>
                {item.available ? (
                  <div className="text-sm font-bold text-white">{item.displayValue}</div>
                ) : (
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Unavailable
                  </div>
                )}
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.timestamp || 'Timestamp unavailable'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estimation Method & Transparency Disclosure */}
      <div className="p-5 rounded-xl glass-panel border border-white/15 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00f0ff]" />
            <span>Estimation Method &amp; Input Attribution</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            {estimationMethod.name}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-black/55 border border-white/10 font-mono text-xs text-slate-200 overflow-x-auto">
          {estimationMethod.formulaSummary}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1.5">
            <div className="font-semibold text-white">Concentration-First CPCB Calculation</div>
            <p className="text-slate-400">{estimationMethod.concentrationFirstNote}</p>
          </div>
          <div className="space-y-1.5">
            <div className="font-semibold text-white">Role of Satellite &amp; Weather Inputs</div>
            <p className="text-slate-400">{estimationMethod.externalInputsRoleNote}</p>
          </div>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300 list-decimal list-inside">
          {estimationMethod.steps.map((step, i) => (
            <li key={i} className="leading-relaxed text-slate-400">
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
