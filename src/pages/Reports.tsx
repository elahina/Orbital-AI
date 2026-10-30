import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Database, 
  Trash2, 
  Download, 
  Radar, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Search,
  Eye,
  X,
  Check
} from 'lucide-react';
import { UploadHistoryItem, AqiLogItem } from '../types';
import jsPDF from 'jspdf';

export const Reports: React.FC = () => {
  const [sarHistory, setSarHistory] = useState<UploadHistoryItem[]>([]);
  const [aqiHistory, setAqiHistory] = useState<AqiLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSarItem, setSelectedSarItem] = useState<UploadHistoryItem | null>(null);
  const [selectedAqiItem, setSelectedAqiItem] = useState<AqiLogItem | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setSarHistory(data.sar || []);
          setAqiHistory(data.aqi || []);
        } else {
          console.warn('History endpoint returned non-JSON content type:', contentType);
        }
      }
    } catch (e) {
      console.error('Error fetching history', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = async () => {
    setShowClearModal(false);
    setSarHistory([]);
    setAqiHistory([]);
    try {
      await fetch('/api/history', { method: 'DELETE' });
      await fetch('/api/report/clear', { method: 'DELETE' });
      setNotification('All SQLite telemetry logs have been cleared.');
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleExportReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 18;

      // Header Banner
      doc.setFillColor(5, 5, 16);
      doc.rect(0, 0, pageWidth, 30, 'F');

      doc.setTextColor(0, 240, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('ORBITAL AI - MISSION TELEMETRY & ANALYTICS REPORT', 14, 13);

      doc.setTextColor(180, 200, 220);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toUTCString()} | Database: SQLite3 / orbital.db | Verified System Report`, 14, 21);

      // Section 1: Executive Summary
      y = 38;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('1. EXECUTIVE SUMMARY & TELEMETRY COUNTERS', 14, y);
      y += 5;

      doc.setFillColor(240, 249, 255);
      doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Total Synthetic Aperture Radar (SAR) Ingests: ${sarHistory.length}`, 18, y + 6);
      doc.text(`Total Atmospheric AQI In-Situ / Sentinel-5P Records: ${aqiHistory.length}`, 18, y + 11);
      doc.text(`Coordinate Reference Systems: EPSG:4326 (WGS84) & EPSG:32643 (UTM 43N) | Downscaling: 1km Street Grid`, 18, y + 16);
      y += 27;

      // Section 2: SAR Analysis Telemetry Records
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('2. SAR RADAR ANALYSIS TELEMETRY LOGS', 14, y);
      y += 5;

      if (sarHistory.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('No SAR history records found in database.', 14, y);
        y += 10;
      } else {
        // Table Header
        doc.setFillColor(224, 242, 254);
        doc.rect(14, y, pageWidth - 28, 6.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text('Filename', 16, y + 4.5);
        doc.text('Timestamp', 75, y + 4.5);
        doc.text('Land Cover Breakdown', 120, y + 4.5);
        doc.text('Inundation Status', 168, y + 4.5);
        y += 7.5;

        sarHistory.forEach((item) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(30, 41, 59);
          const fname = item.filename.length > 34 ? item.filename.substring(0, 31) + '...' : item.filename;
          doc.text(fname, 16, y + 4);
          doc.text(new Date(item.timestamp).toLocaleString(), 75, y + 4);

          const lc = item.analysisResult?.landCover 
            ? `V:${item.analysisResult.landCover.vegetation.toFixed(0)}% W:${item.analysisResult.landCover.water.toFixed(0)}% U:${item.analysisResult.landCover.buildings.toFixed(0)}%`
            : 'N/A';
          doc.text(lc, 120, y + 4);

          const flood = item.analysisResult?.disaster?.flood?.detected
            ? `FLOOD (${item.analysisResult.disaster.flood.confidence}%)`
            : 'NOMINAL';
          doc.text(flood, 168, y + 4);

          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.1);
          doc.line(14, y + 5.5, pageWidth - 14, y + 5.5);
          y += 6.5;
        });
        y += 6;
      }

      // Section 3: AQI Telemetry Records
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('3. ATMOSPHERIC AQI & SATELLITE DOWNSCALING LOGS', 14, y);
      y += 5;

      if (aqiHistory.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('No AQI scan records found in database.', 14, y);
        y += 10;
      } else {
        doc.setFillColor(236, 253, 245);
        doc.rect(14, y, pageWidth - 28, 6.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(6, 78, 59);
        doc.text('City / Station', 16, y + 4.5);
        doc.text('Timestamp', 65, y + 4.5);
        doc.text('AQI & Category', 110, y + 4.5);
        doc.text('PM2.5 (µg/m³)', 148, y + 4.5);
        doc.text('NO2 (ppb)', 175, y + 4.5);
        y += 7.5;

        aqiHistory.forEach((item) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(30, 41, 59);
          const cname = item.city.length > 25 ? item.city.substring(0, 22) + '...' : item.city;
          doc.text(cname, 16, y + 4);
          doc.text(new Date(item.timestamp).toLocaleString(), 65, y + 4);
          doc.text(`${item.aqi} - ${item.category}`, 110, y + 4);
          doc.text(`${item.pm25}`, 148, y + 4);
          doc.text(`${item.no2}`, 175, y + 4);

          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.1);
          doc.line(14, y + 5.5, pageWidth - 14, y + 5.5);
          y += 6.5;
        });
      }

      // Page numbers on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Orbital AI Mission Analytics Report | Page ${i} of ${totalPages}`, 14, 290);
        doc.text('Confidential - Autonomous Earth Observation & Atmospheric Intelligence', pageWidth - 14, 290, { align: 'right' });
      }

      doc.save(`Orbital_AI_Telemetry_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      setNotification('PDF Report exported and downloaded successfully.');
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    }
  };

  const filteredSar = sarHistory.filter(
    (item) => item.filename.toLowerCase().includes(filterQuery.toLowerCase()) ||
              item.status.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredAqi = aqiHistory.filter(
    (item) => item.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Notification Toast */}
      {notification && (
        <div className="p-3 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/40 text-[#39ff14] text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#39ff14]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#00f0ff]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] mb-1">
            <Database className="w-3.5 h-3.5 text-[#39ff14]" />
            <span>SQLITE PERSISTENCE ENGINE &bull; database/orbital.db</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Analytics &amp; Reports
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="p-2.5 rounded-lg glass-panel border border-[#00f0ff]/30 text-slate-300 hover:text-[#00f0ff] transition-all cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <button
            id="export-pdf-report-btn"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f0ff] text-slate-950 font-bold text-xs font-mono tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-xl glass-panel border border-red-500/40 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
              <Trash2 className="w-4 h-4" />
              <span>Clear All History?</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              This will permanently purge all SAR radar analysis logs and atmospheric AQI telemetry records from the local SQLite database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-white/20 text-slate-300 text-xs font-mono hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearHistory}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-mono font-bold hover:bg-red-500 transition-all cursor-pointer"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-[#00f0ff]/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Total SAR Ingests</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{sarHistory.length}</div>
          </div>
          <Radar className="w-8 h-8 text-[#00f0ff]/40" />
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#39ff14]/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Total AQI Telemetry Records</span>
            <div className="text-2xl font-bold font-mono text-[#39ff14] mt-1">{aqiHistory.length}</div>
          </div>
          <Wind className="w-8 h-8 text-[#39ff14]/40" />
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Database Engine</span>
            <div className="text-sm font-bold font-mono text-slate-200 mt-1">SQLite 3 / WAL Mode</div>
          </div>
          <Database className="w-8 h-8 text-slate-500" />
        </div>
      </div>

      {/* Search Filter Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter history by filename, city, or classification..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 outline-none focus:border-[#00f0ff]"
        />
      </div>

      {/* Section 1: SAR Upload History */}
      <div className="p-5 rounded-xl glass-panel border border-[#00f0ff]/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              SAR Upload History
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredSar.length} records
          </span>
        </div>

        {filteredSar.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 text-center py-6">
            No SAR history recorded yet. Run a SAR analysis to populate logs.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Land Cover Mix</th>
                  <th className="py-2.5 px-3">Flood Inundation</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSar.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white truncate max-w-[220px]">
                      {item.filename}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      {item.analysisResult?.landCover ? (
                        <span className="text-slate-300 text-[11px]">
                          Veg: {item.analysisResult.landCover.vegetation.toFixed(0)}% | Wat: {item.analysisResult.landCover.water.toFixed(0)}% | Urb: {item.analysisResult.landCover.buildings.toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {item.analysisResult?.disaster?.flood?.detected ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold">
                          FLOOD ({item.analysisResult.disaster.flood.confidence}%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          CLEAR
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedSarItem(item)}
                        className="px-2.5 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: AQI Scan History */}
      <div className="p-5 rounded-xl glass-panel-green border border-[#39ff14]/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#39ff14]" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              AQI Scan History
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredAqi.length} records
          </span>
        </div>

        {filteredAqi.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 text-center py-6">
            No AQI scan logs recorded yet. Perform an atmospheric downscaling scan to populate logs.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">City / Station</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">AQI &amp; Category</th>
                  <th className="py-2.5 px-3">PM2.5 &bull; NO2 &bull; CO</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAqi.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white truncate max-w-[200px]">
                      {item.city}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white mr-2">{item.aqi}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      {item.pm25} &micro;g/m&sup3; &bull; {item.no2} ppb &bull; {item.co} ppm
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedAqiItem(item)}
                        className="px-2.5 py-1 rounded bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Detailed SAR Record Inspection */}
      {selectedSarItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-xl glass-panel border border-[#00f0ff]/40 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-[#00f0ff]" />
                <h3 className="text-base font-bold text-white font-mono">
                  SAR Analysis Telemetry Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedSarItem(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1.5">
                <div className="text-slate-400">File: <strong className="text-[#00f0ff]">{selectedSarItem.filename}</strong></div>
                <div className="text-slate-400">Recorded: <strong className="text-white">{new Date(selectedSarItem.timestamp).toLocaleString()}</strong></div>
                <div className="text-slate-400">Status: <strong className="text-[#39ff14]">{selectedSarItem.status}</strong></div>
              </div>

              {selectedSarItem.analysisResult && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-[#00f0ff] font-bold block mb-1">XAI Radar Physics:</span>
                    <p className="text-slate-300 text-[11px]">{selectedSarItem.analysisResult.xaiInterpretation.vegetation}</p>
                    <p className="text-slate-300 text-[11px] mt-1">{selectedSarItem.analysisResult.xaiInterpretation.water}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-[#39ff14] font-bold block mb-1">Land Cover Breakdown:</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div>Vegetation: {selectedSarItem.analysisResult.landCover.vegetation.toFixed(1)}%</div>
                      <div>Water: {selectedSarItem.analysisResult.landCover.water.toFixed(1)}%</div>
                      <div>Buildings: {selectedSarItem.analysisResult.landCover.buildings.toFixed(1)}%</div>
                      <div>Bare Land: {selectedSarItem.analysisResult.landCover.bareLand.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedSarItem(null)}
                className="px-4 py-2 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 text-xs font-mono font-bold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Detailed AQI Record Inspection */}
      {selectedAqiItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-xl glass-panel-green border border-[#39ff14]/40 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-[#39ff14]" />
                <h3 className="text-base font-bold text-white font-mono">
                  Atmospheric AQI Telemetry Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedAqiItem(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1.5">
                <div className="text-slate-400">Station / City: <strong className="text-[#39ff14]">{selectedAqiItem.city}</strong></div>
                <div className="text-slate-400">Timestamp: <strong className="text-white">{new Date(selectedAqiItem.timestamp).toLocaleString()}</strong></div>
                <div className="text-slate-400">AQI Index: <strong className="text-white text-lg">{selectedAqiItem.aqi}</strong> ({selectedAqiItem.category})</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">PM2.5 DENSITY</span>
                  <span className="text-base font-bold text-white">{selectedAqiItem.pm25} &micro;g/m&sup3;</span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">NO2 CONCENTRATION</span>
                  <span className="text-base font-bold text-white">{selectedAqiItem.no2} ppb</span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">CARBON MONOXIDE</span>
                  <span className="text-base font-bold text-white">{selectedAqiItem.co} ppm</span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">OZONE (O3)</span>
                  <span className="text-base font-bold text-white">{selectedAqiItem.ozone} ppb</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedAqiItem(null)}
                className="px-4 py-2 rounded-lg bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50 text-xs font-mono font-bold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

