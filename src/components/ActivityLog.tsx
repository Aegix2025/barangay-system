// src/components/ActivityLog.tsx - NO DARKMODE
import React, { useState } from 'react';
import { Activity, X, Clock, User, Trash2, HelpCircle } from 'lucide-react';
import { useActivityLog } from '../hooks/useActivityLog';

interface ActivityLogProps {
  onClose?: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ onClose }) => {
  const { logs, clearLogs } = useActivityLog();
  const [filterModule, setFilterModule] = useState<string>('All');
  const [filterAction, setFilterAction] = useState<string>('All');
  const [showHelp, setShowHelp] = useState(false);

  const modules = ['All', ...new Set(logs.map(l => l.module))];
  const actions = ['All', ...new Set(logs.map(l => l.action))];

  const filteredLogs = logs.filter(log => {
    const matchModule = filterModule === 'All' || log.module === filterModule;
    const matchAction = filterAction === 'All' || log.action === filterAction;
    return matchModule && matchAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'add': return 'text-emerald-500';
      case 'edit': return 'text-blue-500';
      case 'delete': return 'text-red-500';
      case 'view': return 'text-purple-500';
      case 'export': return 'text-orange-500';
      case 'print': return 'text-teal-500';
      default: return 'text-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add': return '➕';
      case 'edit': return '✏️';
      case 'delete': return '🗑️';
      case 'view': return '👁️';
      case 'export': return '📤';
      case 'print': return '🖨️';
      default: return '📌';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-gray-800">Activity Log</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {logs.length} entries
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={clearLogs}
            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>📋 Activity Log:</strong>
          </p>
          <ul className="text-xs text-blue-600 list-disc list-inside mt-1 space-y-0.5">
            <li>Add Resident, Household, Blotter, Certificate</li>
            <li>Edit of blotter status</li>
            <li>Exporting Reports</li>
            <li>All actions has timestamp and user role</li>
          </ul>
        </div>
      )}

      <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {modules.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {actions.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No activity logs found</p>
            <p className="text-xs text-gray-400 mt-1">Activities will appear here when actions are performed</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">{getActionIcon(log.action)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-medium text-sm ${getActionColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {log.module}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.userRole}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};