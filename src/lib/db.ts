import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// RESIDENT FUNCTIONS
// ==========================================
export async function getResidents() {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('is_active', true)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }
}

export async function addResident(resident: any) {
  try {
    // Convert the resident data to match the database schema
    const dbResident = {
      first_name: resident.first_name,
      middle_name: resident.middle_name || '',
      last_name: resident.last_name,
      suffix: resident.suffix || '',
      gender: resident.gender,
      birth_date: resident.birth_date,
      age: resident.age || 0,
      civil_status: resident.civil_status,
      relationship_to_head: resident.relationship_to_head || '',
      occupation: resident.occupation || '',
      educational_attainment: resident.educational_attainment || '',
      citizenship: resident.citizenship || 'Filipino',
      religion: resident.religion || '',
      voter_status: resident.voter_status || false,
      philhealth_member: resident.philhealth_member || false,
      senior_citizen: resident.senior_citizen || false,
      pwd: resident.pwd || false,
      solo_parent: resident.solo_parent || false,
      contact_number: resident.contact_number || '',
      email: resident.email || '',
      purok_name: resident.purok_name || '',
      household_id: resident.household_id || '',
      status: resident.status || 'Active',
      is_active: true
    };

    const { data, error } = await supabase
      .from('residents')
      .insert([dbResident])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding resident:', error);
    throw error;
  }
}

export async function updateResident(id: number, updates: any) {
  try {
    const { data, error } = await supabase
      .from('residents')
      .update(updates)
      .eq('resident_id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating resident:', error);
    throw error;
  }
}

export async function deleteResident(id: number) {
  try {
    const { error } = await supabase
      .from('residents')
      .update({ is_active: false })
      .eq('resident_id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting resident:', error);
    throw error;
  }
}

// ==========================================
// OFFICIALS FUNCTIONS
// ==========================================
export async function getOfficials() {
  try {
    const { data, error } = await supabase
      .from('barangay_officials')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching officials:', error);
    throw error;
  }
}

// ==========================================
// HOUSEHOLD FUNCTIONS
// ==========================================
export async function getHouseholds() {
  try {
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .eq('is_active', true)
      .order('family_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching households:', error);
    throw error;
  }
}

export async function addHousehold(household: any) {
  try {
    const { data, error } = await supabase
      .from('households')
      .insert([household])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding household:', error);
    throw error;
  }
}