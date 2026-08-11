// src/App.tsx - NO DARKMODE
import { useState, useMemo } from 'react';
import { 
  INITIAL_BARANGAY_INFO, 
  INITIAL_ZONES, 
  INITIAL_OFFICIALS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_EVENTS, 
  INITIAL_BLOTTERS, 
  INITIAL_CERTIFICATES, 
  generateFullDataset 
} from './data/seedData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PurokZones } from './components/PurokZones';
import { Households } from './components/Households';
import { Residents } from './components/Residents';
import { Officials } from './components/Officials';
import { Certificates } from './components/Certificates';
import { Blotter } from './components/Blotter';
import { AnnouncementsEvents } from './components/AnnouncementsEvents';
import { ActivityLog } from './components/ActivityLog';
import { UserRolesProvider, useUserRoles } from './components/UserRoles';
import { useNotifications } from './hooks/useNotifications';
import { useActivityLog } from './hooks/useActivityLog';
import { 
  BarangayInfo, 
  Zone, 
  Household, 
  Resident, 
  BarangayOfficial, 
  CertificateRecord, 
  BlotterRecord, 
  Announcement, 
  BarangayEvent,
  BlotterStatus
} from './types';

// Inner component that uses hooks
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showActivityLog, setShowActivityLog] = useState(false);
  const { role, hasPermission } = useUserRoles();
  const { addNotification } = useNotifications();
  const { addLog } = useActivityLog();

  // Generate initial dataset from seed
  const initialDataset = useMemo(() => generateFullDataset(), []);

  // State for data - using seed data
  const [barangayInfo] = useState<BarangayInfo>(INITIAL_BARANGAY_INFO);
  const [zones] = useState<Zone[]>(INITIAL_ZONES);
  const [officials] = useState<BarangayOfficial[]>(INITIAL_OFFICIALS);

  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [blotters, setBlotters] = useState<BlotterRecord[]>(INITIAL_BLOTTERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState<BarangayEvent[]>(INITIAL_EVENTS);

  const [households, setHouseholds] = useState<Household[]>(initialDataset.households);
  const [residents, setResidents] = useState<Resident[]>(initialDataset.residents);

  // ======================== HANDLERS ========================

  const handleAddResident = (newRes: Resident) => {
    setResidents(prev => [newRes, ...prev]);
    setHouseholds(prev => prev.map(h => {
      if (h.household_id === newRes.household_id) {
        return { ...h, number_of_members: h.number_of_members + 1 };
      }
      return h;
    }));
    addNotification({
      title: 'New Resident Added',
      message: `${newRes.first_name} ${newRes.last_name} has been registered.`,
      type: 'success',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Residents',
      details: `Added resident: ${newRes.first_name} ${newRes.last_name}`,
    });
  };

  const handleAddHousehold = (newHousehold: Household) => {
    setHouseholds(prev => [newHousehold, ...prev]);
    addNotification({
      title: 'New Household Registered',
      message: `Household ${newHousehold.family_name} has been registered.`,
      type: 'success',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Households',
      details: `Added household: ${newHousehold.family_name}`,
    });
  };

  const handleIssueCertificate = (cert: CertificateRecord) => {
    setCertificates(prev => [cert, ...prev]);
    addNotification({
      title: 'Certificate Issued',
      message: `${cert.certificate_type} issued to ${cert.resident_name}.`,
      type: 'success',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Certificates',
      details: `Issued ${cert.certificate_type} to ${cert.resident_name}`,
    });
  };

  const handleAddBlotter = (blotter: BlotterRecord) => {
    setBlotters(prev => [blotter, ...prev]);
    addNotification({
      title: 'New Blotter Recorded',
      message: `Incident: ${blotter.incident_type} - ${blotter.complainant_name} vs ${blotter.respondent_name}`,
      type: 'warning',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Blotter',
      details: `Added blotter: ${blotter.incident_type}`,
    });
  };

  const handleUpdateBlotterStatus = (id: string, newStatus: BlotterStatus) => {
    setBlotters(prev => prev.map(b => b.blotter_id === id ? { ...b, status: newStatus } : b));
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'edit',
      module: 'Blotter',
      details: `Updated blotter ${id} status to ${newStatus}`,
    });
  };

  const handleAddAnnouncement = (ann: Announcement) => {
    setAnnouncements(prev => [ann, ...prev]);
    addNotification({
      title: 'New Announcement',
      message: ann.title,
      type: 'info',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Announcements',
      details: `Added announcement: ${ann.title}`,
    });
  };

  const handleAddEvent = (evt: BarangayEvent) => {
    setEvents(prev => [evt, ...prev]);
    addNotification({
      title: 'New Event Added',
      message: `${evt.title} scheduled for ${evt.event_date}`,
      type: 'info',
    });
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'add',
      module: 'Events',
      details: `Added event: ${evt.title}`,
    });
  };

  const handleUpdateResident = (updatedRes: Resident) => {
    setResidents(prev => prev.map(r => 
      r.resident_id === updatedRes.resident_id ? updatedRes : r
    ));
    
    const oldResident = residents.find(r => r.resident_id === updatedRes.resident_id);
    if (oldResident && oldResident.household_id !== updatedRes.household_id) {
      setHouseholds(prev => prev.map(h => {
        if (h.household_id === oldResident.household_id) {
          return { ...h, number_of_members: Math.max(0, h.number_of_members - 1) };
        }
        if (h.household_id === updatedRes.household_id) {
          return { ...h, number_of_members: h.number_of_members + 1 };
        }
        return h;
      }));
    }
    
    addNotification({
      title: 'Resident Updated',
      message: `${updatedRes.first_name} ${updatedRes.last_name}'s information has been updated.`,
      type: 'success',
    });
    
    addLog({
      userId: 'current-user',
      userRole: role,
      action: 'edit',
      module: 'Residents',
      details: `Updated resident: ${updatedRes.first_name} ${updatedRes.last_name}`,
    });
  };

  return (
    <div className="min-h-screen w-full text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 bg-white">
      {/* Top Header & Navigation */}
      <Header
        info={barangayInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenActivityLog={() => setShowActivityLog(true)}
        residentCount={residents.length}
        householdCount={households.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              info={barangayInfo}
              zones={zones}
              households={households}
              residents={residents}
              blotters={blotters}
              announcements={announcements}
              events={events}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'puroks' && (
            <PurokZones
              zones={zones}
              households={households}
              residents={residents}
            />
          )}

          {activeTab === 'residents' && hasPermission('view_residents') && (
            <Residents
              residents={residents}
              zones={zones}
              households={households}
              onAddResident={handleAddResident}
              onAddHousehold={handleAddHousehold}
              onUpdateResident={handleUpdateResident} 
            />
          )}

          {activeTab === 'households' && hasPermission('view_households') && (
            <Households
              households={households}
              zones={zones}
              residents={residents}
              onAddHousehold={handleAddHousehold}
            />
          )}

          {activeTab === 'officials' && hasPermission('view_officials') && (
            <Officials />
          )}

          {activeTab === 'certificates' && hasPermission('view_certificates') && (
            <Certificates
              certificates={certificates}
              residents={residents}
              info={barangayInfo}
              onIssueCertificate={handleIssueCertificate}
            />
          )}

          {activeTab === 'blotter' && hasPermission('view_blotter') && (
            <Blotter
              blotters={blotters}
              onAddBlotter={handleAddBlotter}
              onUpdateStatus={handleUpdateBlotterStatus}
            />
          )}

          {activeTab === 'announcements' && hasPermission('view_announcements') && (
            <AnnouncementsEvents
              announcements={announcements}
              events={events}
              onAddAnnouncement={handleAddAnnouncement}
              onAddEvent={handleAddEvent}
            />
          )}
        </div>
      </main>

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <ActivityLog onClose={() => setShowActivityLog(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm text-slate-500 text-xs py-6 border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <p className="font-bold text-slate-700">
              Barangay SF II Information Management System (BIMS)
            </p>
            <p className="text-[11px] text-slate-500">
              Nestor Nabaunag, Limay, Bataan 2104 • Republic of the Philippines
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-400">
            <span>👤 {role.toUpperCase()}</span>
            <span>•</span>
            <span>v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component with Providers
export default function App() {
  return (
    <UserRolesProvider>
      <AppContent />
    </UserRolesProvider>
  );
}