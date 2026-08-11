import React, { useState, useMemo } from 'react';
import { Database, Copy, Download, Check, Server } from 'lucide-react';
import { 
  BarangayInfo, 
  Zone, 
  Household, 
  Resident, 
  BarangayOfficial, 
  CertificateRecord, 
  BlotterRecord, 
  Announcement, 
  BarangayEvent 
} from '../types';
import { generateSqlStatements, generateJsonExport } from '../utils/sqlExporter';

interface Props {
  info: BarangayInfo;
  zones: Zone[];
  households: Household[];
  residents: Resident[];
  officials: BarangayOfficial[];
  certificates: CertificateRecord[];
  blotters: BlotterRecord[];
  announcements: Announcement[];
  events: BarangayEvent[];
}

export const DatabaseExporter: React.FC<Props> = ({
  info,
  zones,
  households,
  residents,
  officials,
  certificates,
  blotters,
  announcements,
  events
}) => {
  const [exportFormat, setExportFormat] = useState<'SQL' | 'JSON'>('SQL');
  const [copied, setCopied] = useState(false);

  const fullData = useMemo(() => ({
    barangay: info,
    zones,
    households,
    residents,
    officials,
    certificates,
    blotters,
    announcements,
    events
  }), [info, zones, households, residents, officials, certificates, blotters, announcements, events]);

  const exportedContent = useMemo(() => {
    if (exportFormat === 'SQL') {
      return generateSqlStatements(fullData);
    } else {
      return generateJsonExport(fullData);
    }
  }, [exportFormat, fullData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = exportFormat === 'SQL' ? 'barangay_sf2_limay_bataan.sql' : 'barangay_sf2_limay_bataan.json';
    const blob = new Blob([exportedContent], { type: exportFormat === 'SQL' ? 'text/plain' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600" />
            <span>Database Generator & SQL / JSON Exporter</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full relational database seed script for Barangay SF II, Nestor Nabaunag, Limay, Bataan ({households.length} Households, {residents.length} Residents)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyado Na!' : 'Kopyahin ang Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>I-download ang .{exportFormat.toLowerCase()} File</span>
          </button>
        </div>
      </div>

      {/* Format Toggle & Table Counters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Toggle */}
        <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Format ng Output:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setExportFormat('SQL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                exportFormat === 'SQL' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              SQL INSERTs
            </button>
            <button
              onClick={() => setExportFormat('JSON')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                exportFormat === 'JSON' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              JSON Data
            </button>
          </div>
        </div>

        {/* Database Table Quick Stats */}
        <div className="md:col-span-8 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-around gap-2 text-xs">
          <div><span className="text-slate-400">BARANGAY:</span> <strong>1</strong></div>
          <div><span className="text-slate-400">ZONES:</span> <strong>{zones.length}</strong></div>
          <div><span className="text-slate-400">HOUSEHOLDS:</span> <strong className="text-emerald-400">{households.length}</strong></div>
          <div><span className="text-slate-400">RESIDENTS:</span> <strong className="text-emerald-400">{residents.length}</strong></div>
          <div><span className="text-slate-400">OFFICIALS:</span> <strong>{officials.length}</strong></div>
          <div><span className="text-slate-400">CERTIFICATES:</span> <strong>{certificates.length}</strong></div>
          <div><span className="text-slate-400">BLOTTERS:</span> <strong>{blotters.length}</strong></div>
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 p-4 shadow-xl font-mono text-xs overflow-hidden relative">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-slate-400 text-[11px] mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>barangay_sf2_limay_bataan.{exportFormat.toLowerCase()}</span>
          </div>
          <span>Length: {exportedContent.length.toLocaleString()} chars</span>
        </div>

        <pre className="max-h-[500px] overflow-auto leading-relaxed p-2 text-emerald-300 font-mono text-[11px] selection:bg-emerald-800 selection:text-white">
          {exportedContent}
        </pre>
      </div>
    </div>
  );
};