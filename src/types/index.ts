export type Gender = 'Male' | 'Female';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Divorced';
export type HouseholdType = 'Nuclear' | 'Extended' | 'Single Parent' | 'Single Person' | 'Joint';
export type ResidentStatus = 'Active' | 'Deceased' | 'Relocated' | 'Transient';
export type BlotterStatus = 'Active' | 'Settled' | 'Pending' | 'Referred to PNP';
export type CertificateType = 
  | 'Barangay Clearance'
  | 'Certificate of Residency'
  | 'Certificate of Indigency'
  | 'Business Clearance'
  | 'Certificate of Good Moral';

export interface BarangayInfo {
  barangay_id: string;
  barangay_name: string;
  municipality: string;
  province: string;
  region?: string;
  address: string;
  zip_code: string;
  contact_number: string;
  email: string;
  barangay_captain: string;
  population?: number;
  total_households?: number;
  logo_url?: string;
}

export interface Zone {
  zone_id: string;
  barangay_id: string;
  zone_name: string;
  zone_leader: string;
  description: string;
  household_count?: number;
  population_count?: number;
}

export interface Household {
  household_id: string;
  zone_id: string;
  house_number: string;
  street_name: string;
  household_head: string;
  family_name: string;
  contact_number: string;
  household_type: HouseholdType;
  monthly_income: number;
  number_of_members: number;
  registration_date: string;
  status: 'Active' | 'Inactive';
}

// src/types/index.ts
export interface Resident {
  resident_id: string;
  household_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  gender: Gender;
  birth_date: string;
  age: number;
  civil_status: CivilStatus;
  relationship_to_head: string;
  occupation: string;
  educational_attainment: string;
  citizenship: string;
  religion: string;
  voter_status: boolean;
  philhealth_member: boolean;
  senior_citizen: boolean;
  pwd: boolean;
  solo_parent: boolean;
  contact_number: string;
  email: string;
  status: ResidentStatus;
  purok_name?: string;
  
  // Extended fields
  blood_type?: string;
  height?: number;
  weight?: number;
  medical_conditions?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  place_of_birth?: string;
  years_in_barangay?: number;
  house_ownership?: string;
  house_material?: string;
  water_source?: string;
  electricity_source?: string;
  toilet_type?: string;
  internet_provider?: string;
  government_assistance?: string[];
  health_insurance?: string;
  vaccination_status?: string[];
  school_attended?: string;
  course_degree?: string;
  scholarship?: string;
  business_type?: string;
  business_location?: string;
  years_in_business?: number;
  employees_count?: number;
  pets?: { type: string; count: number; }[];
  vehicles?: { type: string; count: number; }[];
  skills?: string[];
  organization_memberships?: string[];
  volunteer_work?: string[];
  hobbies?: string[];
  languages_spoken?: string[];
  monthly_expenses?: number;
  has_bank_account?: boolean;
  has_credit_card?: boolean;
  social_media?: string;
  preferred_contact_method?: string;
}

export interface BarangayOfficial {
  official_id: string;
  position: 'Barangay Captain' | 'Barangay Kagawad' | 'SK Chairman' | 'Barangay Secretary' | 'Barangay Treasurer';
  committee?: string;
  full_name: string;
  contact_number: string;
  email: string;
  term_start: string;
  term_end: string;
  status: 'Active' | 'Inactive';
  avatar_url?: string;
}

export interface CertificateRecord {
  certificate_id: string;
  certificate_type: CertificateType;
  resident_id: string;
  resident_name: string;
  address: string;
  purpose: string;
  issue_date: string;
  or_number: string;
  amount_paid: number;
  issued_by: string;
  status: 'Issued' | 'Cancelled';
  business_name?: string;
}

export interface BlotterRecord {
  blotter_id: string;
  incident_type: string;
  complainant_name: string;
  respondent_name: string;
  incident_date: string;
  incident_location: string;
  status: BlotterStatus;
  narrative: string;
  assigned_officer: string;
}

export interface Announcement {
  announcement_id: string;
  title: string;
  content: string;
  category: 'Urgent' | 'Advisory' | 'Event' | 'Health' | 'Safety';
  target_purok: string;
  date_posted: string;
  posted_by: string;
}

export interface BarangayEvent {
  event_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  organizer: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Postponed';
}