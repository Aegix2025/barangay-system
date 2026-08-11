// src/components/UserRoles.tsx - FIXED (no Guest)
import React, { useState, createContext, useContext } from 'react';
import { Shield, Users, Wallet, BadgeCheck } from 'lucide-react';

export type UserRole = 'admin' | 'secretary' | 'treasurer' | 'tanod';

interface UserRolesContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const UserRolesContext = createContext<UserRolesContextType | undefined>(undefined);

export const useUserRoles = () => {
  const context = useContext(UserRolesContext);
  if (!context) {
    throw new Error('useUserRoles must be used within UserRolesProvider');
  }
  return context;
};

interface UserRolesProviderProps {
  children: React.ReactNode;
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all', 'view_all', 'edit_all', 'delete_all', 'export', 'print', 'manage_users'],
  secretary: ['view_residents', 'view_households', 'view_officials', 'view_certificates', 'add_certificates', 'edit_certificates', 'view_blotter', 'add_blotter', 'edit_blotter', 'view_announcements', 'add_announcements', 'edit_announcements'],
  treasurer: ['view_residents', 'view_households', 'view_certificates', 'view_financial', 'add_financial', 'edit_financial', 'export'],
  tanod: ['view_residents', 'view_blotter', 'add_blotter', 'edit_blotter', 'view_announcements'],
};

export const UserRolesProvider: React.FC<UserRolesProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'secretary';
  });

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  const hasPermission = (permission: string): boolean => {
    const permissions = rolePermissions[role] || [];
    if (permissions.includes('all')) return true;
    return permissions.includes(permission);
  };

  return (
    <UserRolesContext.Provider value={{ role, setRole: handleSetRole, hasPermission }}>
      {children}
    </UserRolesContext.Provider>
  );
};

interface RoleSwitcherProps {
  onClose?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onClose }) => {
  const { role, setRole } = useUserRoles();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    { id: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4" />, color: 'text-purple-500', description: 'Full access to all features' },
    { id: 'secretary', label: 'Secretary', icon: <Users className="w-4 h-4" />, color: 'text-blue-500', description: 'Manage residents, certificates, announcements' },
    { id: 'treasurer', label: 'Treasurer', icon: <Wallet className="w-4 h-4" />, color: 'text-emerald-500', description: 'Manage financial records' },
    { id: 'tanod', label: 'Tanod', icon: <BadgeCheck className="w-4 h-4" />, color: 'text-orange-500', description: 'Manage blotter and peace & order' },
  ];

  const currentRole = roles.find(r => r.id === role);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <Shield className="w-4 h-4" />
        <span>{currentRole?.label || 'Secretary'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Switch Role</p>
              <p className="text-[10px] text-gray-400">Current: <span className="font-bold text-gray-600 dark:text-gray-300">{currentRole?.label}</span></p>
            </div>
            <div className="p-2 space-y-1">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                    role === r.id ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className={r.color}>{r.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{r.label}</div>
                    <div className="text-[10px] text-gray-400">{r.description}</div>
                  </div>
                  {role === r.id && (
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};