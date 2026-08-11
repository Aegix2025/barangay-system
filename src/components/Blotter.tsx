import React, { useState } from 'react';
import { ShieldAlert, Plus, Search, Filter, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { BlotterRecord, BlotterStatus } from '../types';

interface Props {
  blotters: BlotterRecord[];
  onAddBlotter: (record: BlotterRecord) => void;
  onUpdateStatus: (id: string, newStatus: BlotterStatus) => void;
}

export const Blotter: React.FC<Props> = ({
  blotters,
  onAddBlotter,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newBlotter, setNewBlotter] = useState({
    incident_type: 'Noise Disturbance',
    complainant_name: '',
    respondent_name: '',
    incident_location: 'Purok 1 Centro, Brgy. SF II',
    narrative: '',
    assigned_officer: 'Kgwd. Francis Ramos'
  });

  const filteredBlotters = blotters.filter((b) => {
    const matchesSearch =
      b.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.respondent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.blotter_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BlotterRecord = {
      ...newBlotter,
      blotter_id: `BLT-2026-${String(blotters.length + 1).padStart(3, '0')}`,
      incident_date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Active'
    };
    onAddBlotter(created);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-500" />
            <span>List of Blotters & Incidents (Peace & Order)</span>
          </h2>
          <p className="text-sm text-black mt-0.5">
            Barangay SF II Peace & Order Committee • Logged complaints and mediation records
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-white hover:text-red-500 hover:border-[2px] hover:border-red-500 text-white rounded-xl font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Blotters</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Select Complainant, Respondent, o Types of Incidents..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Settled">Settled</option>
            <option value="Pending">Pending</option>
            <option value="Referred to PNP">Referred to PNP Limay</option>
          </select>
        </div>
      </div>

      {/* Blotter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBlotters.map((b) => (
          <div key={b.blotter_id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">{b.blotter_id}</span>
                <h3 className="font-bold text-base text-slate-900">{b.incident_type}</h3>
              </div>
              <select
                value={b.status}
                onChange={(e) => onUpdateStatus(b.blotter_id, e.target.value as BlotterStatus)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  b.status === 'Active' ? 'bg-red-50 text-red-800 border-red-200' :
                  b.status === 'Settled' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  b.status === 'Referred to PNP' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                  'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <option value="Active">Active</option>
                <option value="Settled">Settled</option>
                <option value="Pending">Pending</option>
                <option value="Referred to PNP">Referred to PNP</option>
              </select>
            </div>

            <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p><strong>Complainant:</strong> {b.complainant_name}</p>
              <p><strong>Respondent:</strong> {b.respondent_name}</p>
              <p className="text-slate-500">📍 {b.incident_location} • 📅 {b.incident_date}</p>
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-100/60 p-3 rounded-xl border border-slate-200/50">
              "{b.narrative}"
            </p>

            <div className="text-[11px] text-slate-500 font-semibold flex justify-between pt-1 border-t border-slate-100">
              <span>Assigned Officer: {b.assigned_officer}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Blotter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-red-800 text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Report New Incident / Blotter</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-red-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type of Incidents</label>
                <input
                  type="text"
                  required
                  value={newBlotter.incident_type}
                  onChange={(e) => setNewBlotter({ ...newBlotter, incident_type: e.target.value })}
                  placeholder="e.g. Boundary Dispute, Noise Disturbance, Damage to Property"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Complainant</label>
                  <input
                    type="text"
                    required
                    value={newBlotter.complainant_name}
                    onChange={(e) => setNewBlotter({ ...newBlotter, complainant_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Respondent</label>
                  <input
                    type="text"
                    required
                    value={newBlotter.respondent_name}
                    onChange={(e) => setNewBlotter({ ...newBlotter, respondent_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location in SF II</label>
                <input
                  type="text"
                  required
                  value={newBlotter.incident_location}
                  onChange={(e) => setNewBlotter({ ...newBlotter, incident_location: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Narrative</label>
                <textarea
                  required
                  rows={3}
                  value={newBlotter.narrative}
                  onChange={(e) => setNewBlotter({ ...newBlotter, narrative: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
                >
                  Save Blotter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};