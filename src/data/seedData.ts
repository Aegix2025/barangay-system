// src/data/seedData.ts
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

// ==================== BARANGAY INFO ====================
export const INITIAL_BARANGAY_INFO: BarangayInfo = {
  barangay_id: 'BRGY-SF2',
  barangay_name: 'Barangay SF II',
  municipality: 'Limay',
  province: 'Bataan',
  region: 'Central Luzon',
  address: 'Nestor Nabaunag, Limay, Bataan',
  zip_code: '2104',
  contact_number: '0917-123-4567',
  email: 'barangaysf2@limaybataan.gov.ph',
  barangay_captain: 'Hon. Nestor Nabaunag Jr.',
  population: 0,
  total_households: 0
};

// ==================== ZONES ====================
export const INITIAL_ZONES: Zone[] = [
  { zone_id: 'ZN-001', barangay_id: 'BRGY-SF2', zone_name: 'Purok 1', zone_leader: 'Purok Leader 1', description: 'Zone 1 - Brgy. SF II' },
  { zone_id: 'ZN-002', barangay_id: 'BRGY-SF2', zone_name: 'Purok 2', zone_leader: 'Purok Leader 2', description: 'Zone 2 - Brgy. SF II' },
  { zone_id: 'ZN-003', barangay_id: 'BRGY-SF2', zone_name: 'Purok 3', zone_leader: 'Purok Leader 3', description: 'Zone 3 - Brgy. SF II' },
  { zone_id: 'ZN-004', barangay_id: 'BRGY-SF2', zone_name: 'Purok 4', zone_leader: 'Purok Leader 4', description: 'Zone 4 - Brgy. SF II' },
  { zone_id: 'ZN-005', barangay_id: 'BRGY-SF2', zone_name: 'Purok 5', zone_leader: 'Purok Leader 5', description: 'Zone 5 - Brgy. SF II' },
  { zone_id: 'ZN-006', barangay_id: 'BRGY-SF2', zone_name: 'Purok 6', zone_leader: 'Purok Leader 6', description: 'Zone 6 - Brgy. SF II' },
  { zone_id: 'ZN-007', barangay_id: 'BRGY-SF2', zone_name: 'Purok 7', zone_leader: 'Purok Leader 7', description: 'Zone 7 - Brgy. SF II' },
  { zone_id: 'ZN-008', barangay_id: 'BRGY-SF2', zone_name: 'Purok 8', zone_leader: 'Purok Leader 8', description: 'Zone 8 - Brgy. SF II' }
];

// ==================== OFFICIALS ====================
export const INITIAL_OFFICIALS: BarangayOfficial[] = [
  { 
    official_id: 'OFF-001', 
    full_name: 'Nestor Nabaunag Jr.', 
    position: 'Barangay Captain', 
    contact_number: '0917-123-0001',
    email: 'captain@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-002', 
    full_name: 'Maria Santos', 
    position: 'Barangay Secretary', 
    contact_number: '0917-123-0002',
    email: 'secretary@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-003', 
    full_name: 'Juan Dela Cruz', 
    position: 'Barangay Treasurer', 
    contact_number: '0917-123-0003',
    email: 'treasurer@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-004', 
    full_name: 'Jose Rizal', 
    position: 'Barangay Kagawad', 
    committee: 'Peace and Order',
    contact_number: '0917-123-0004',
    email: 'jose.rizal@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-005', 
    full_name: 'Andres Bonifacio', 
    position: 'Barangay Kagawad', 
    committee: 'Infrastructure',
    contact_number: '0917-123-0005',
    email: 'andres.bonifacio@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-006', 
    full_name: 'Emilio Aguinaldo', 
    position: 'Barangay Kagawad', 
    committee: 'Health and Sanitation',
    contact_number: '0917-123-0006',
    email: 'emilio.aguinaldo@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-007', 
    full_name: 'Apolinario Mabini', 
    position: 'Barangay Kagawad', 
    committee: 'Education',
    contact_number: '0917-123-0007',
    email: 'apolinario.mabini@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-008', 
    full_name: 'Gabriela Silang', 
    position: 'Barangay Kagawad', 
    committee: 'Women and Family',
    contact_number: '0917-123-0008',
    email: 'gabriela.silang@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-009', 
    full_name: 'Melchora Aquino', 
    position: 'Barangay Kagawad', 
    committee: 'Senior Citizens',
    contact_number: '0917-123-0009',
    email: 'melchora.aquino@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  },
  { 
    official_id: 'OFF-010', 
    full_name: 'Jose Abad Santos', 
    position: 'Barangay Kagawad', 
    committee: 'Youth and Sports',
    contact_number: '0917-123-0010',
    email: 'jose.abad@barangaysf2.gov.ph',
    term_start: '2023-01-01',
    term_end: '2026-12-31',
    status: 'Active'
  }
];

// ==================== ANNOUNCEMENTS ====================
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    announcement_id: 'ANN-001',
    title: 'Free Medical Mission',
    content: 'Free medical mission every 1st Saturday of the month at the Barangay Health Center.',
    category: 'Health',
    target_purok: 'All Purok',
    date_posted: '2025-01-01',
    posted_by: 'Barangay Health Office'
  },
  {
    announcement_id: 'ANN-002',
    title: 'Barangay Assembly',
    content: 'Barangay Assembly every 2nd Friday of the month at the Barangay Hall.',
    category: 'Event',
    target_purok: 'All Purok',
    date_posted: '2025-01-02',
    posted_by: 'Barangay Secretary'
  },
  {
    announcement_id: 'ANN-003',
    title: 'Emergency Hotline',
    content: 'For emergencies: Call 911 or Barangay Hotline 0917-123-4567.',
    category: 'Advisory',
    target_purok: 'All Purok',
    date_posted: '2025-01-03',
    posted_by: 'Barangay Captain'
  },
  {
    announcement_id: 'ANN-004',
    title: "Voter's Registration",
    content: "Voter's registration is now open at the Barangay Hall. Bring valid ID.",
    category: 'Advisory',
    target_purok: 'All Purok',
    date_posted: '2025-01-04',
    posted_by: 'COMELEC'
  },
  {
    announcement_id: 'ANN-005',
    title: 'Clean-up Drive',
    content: 'Community clean-up drive every last Sunday of the month. Meet at 6AM.',
    category: 'Event',
    target_purok: 'All Purok',
    date_posted: '2025-01-05',
    posted_by: 'Barangay Environment Office'
  },
  {
    announcement_id: 'ANN-006',
    title: 'COVID-19 Vaccine',
    content: 'Free COVID-19 vaccine available at the Barangay Health Center. Walk-in welcome.',
    category: 'Health',
    target_purok: 'All Purok',
    date_posted: '2025-01-06',
    posted_by: 'Barangay Health Office'
  },
  {
    announcement_id: 'ANN-007',
    title: 'Typhoon Preparedness',
    content: 'Please prepare for the upcoming typhoon. Evacuation center is open at the Barangay Hall.',
    category: 'Safety',
    target_purok: 'All Purok',
    date_posted: '2025-01-07',
    posted_by: 'Barangay Disaster Office'
  }
];

// ==================== EVENTS ====================
export const INITIAL_EVENTS: BarangayEvent[] = [
  {
    event_id: 'EVT-001',
    title: 'Barangay Fiesta 2025',
    description: 'Annual celebration of Barangay SF II Fiesta with parade and activities.',
    event_date: '2025-05-15',
    event_time: '8:00 AM - 10:00 PM',
    location: 'Barangay Plaza',
    organizer: 'Barangay Council',
    status: 'Upcoming'
  },
  {
    event_id: 'EVT-002',
    title: 'Sports Festival',
    description: 'Inter-purok sports competition. Registration is now open.',
    event_date: '2025-06-20',
    event_time: '7:00 AM - 6:00 PM',
    location: 'Barangay Sports Complex',
    organizer: 'Barangay Youth Committee',
    status: 'Upcoming'
  },
  {
    event_id: 'EVT-003',
    title: 'Christmas Party',
    description: 'Annual Christmas party for all residents. Gift giving for kids.',
    event_date: '2025-12-15',
    event_time: '4:00 PM - 10:00 PM',
    location: 'Barangay Hall',
    organizer: 'Barangay Council',
    status: 'Upcoming'
  },
  {
    event_id: 'EVT-004',
    title: 'Zumba sa Barangay',
    description: 'Free Zumba dance session every Saturday morning at the Barangay Plaza.',
    event_date: '2025-02-01',
    event_time: '6:00 AM - 7:30 AM',
    location: 'Barangay Plaza',
    organizer: 'Barangay Health Office',
    status: 'Upcoming'
  }
];

// ==================== EMPTY INITIALS ====================
export const INITIAL_CERTIFICATES: CertificateRecord[] = [];
export const INITIAL_BLOTTERS: BlotterRecord[] = [];

export const INITIAL_HOUSEHOLDS: Household[] = [];

export const INITIAL_RESIDENTS: Resident[] = [];

// ==================== GENERATE FULL DATASET ====================
export function generateFullDataset() {
  return {
    households: INITIAL_HOUSEHOLDS,
    residents: INITIAL_RESIDENTS
  };
}