// src/hooks/useActivityLog.ts
import { useState, useEffect } from 'react';

export interface ActivityLog {
  id: string;
  userId: string;
  userRole: string;
  action: 'add' | 'edit' | 'delete' | 'view' | 'export' | 'print';
  module: string;
  details: string;
  timestamp: string;
}

export function useActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('activityLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('activityLogs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogsByModule = (module: string) => {
    return logs.filter(log => log.module === module);
  };

  const getLogsByUser = (userId: string) => {
    return logs.filter(log => log.userId === userId);
  };

  return {
    logs,
    addLog,
    clearLogs,
    getLogsByModule,
    getLogsByUser,
  };
}