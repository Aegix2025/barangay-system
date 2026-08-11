// src/lib/db.ts - MOCK DATA VERSION

// ==========================================
// MOCK OFFICIALS DATA
// ==========================================
const mockOfficials = [
  {
    official_id: 1,
    full_name: 'Nestor Nabuang Jr.',
    position: 'Barangay Captain',
    contact_number: '09171234567',
    email: 'nestor@barangay.com',
    committee: 'Executive Committee',
    image_url: null,
    is_active: true
  },
  {
    official_id: 2,
    full_name: 'Sally Espinosa',
    position: 'Barangay Secretary',
    contact_number: '09171234568',
    email: 'sally@barangay.com',
    committee: null,
    image_url: null,
    is_active: true
  },
  {
    official_id: 3,
    full_name: 'Catherine D. Cinco',
    position: 'Barangay Treasurer',
    contact_number: '09171234569',
    email: 'catherine@barangay.com',
    committee: null,
    image_url: null,
    is_active: true
  },
  {
    official_id: 4,
    full_name: 'JohnPaul Nabaunag',
    position: 'SK Chairman',
    contact_number: '09171234570',
    email: 'johnpaul@barangay.com',
    committee: null,
    image_url: null,
    is_active: true
  },
  {
    official_id: 5,
    full_name: 'Jose Garcia',
    position: 'Barangay Kagawad',
    contact_number: '09171234571',
    email: 'jose@barangay.com',
    committee: 'Committee on Peace and Order',
    image_url: null,
    is_active: true
  },
  {
    official_id: 6,
    full_name: 'Rosa Cruz',
    position: 'Barangay Kagawad',
    contact_number: '09171234572',
    email: 'rosa@barangay.com',
    committee: 'Committee on Health',
    image_url: null,
    is_active: true
  },
  {
    official_id: 7,
    full_name: 'Lito Reyes',
    position: 'Barangay Kagawad',
    contact_number: '09171234573',
    email: 'lito@barangay.com',
    committee: 'Committee on Education',
    image_url: null,
    is_active: true
  }
];

// ==========================================
// OFFICIALS FUNCTIONS (MOCK)
// ==========================================
export async function getOfficials() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOfficials);
    }, 500);
  });
}

export async function addOfficial(official: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOfficial = {
        ...official,
        official_id: mockOfficials.length + 1,
        is_active: true
      };
      mockOfficials.push(newOfficial);
      resolve(newOfficial);
    }, 500);
  });
}

export async function updateOfficial(id: number, updates: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOfficials.findIndex(o => o.official_id === id);
      if (index === -1) {
        reject(new Error('Official not found'));
        return;
      }
      mockOfficials[index] = { ...mockOfficials[index], ...updates };
      resolve(mockOfficials[index]);
    }, 500);
  });
}

export async function deleteOfficial(id: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOfficials.findIndex(o => o.official_id === id);
      if (index === -1) {
        reject(new Error('Official not found'));
        return;
      }
      mockOfficials[index].is_active = false;
      resolve(true);
    }, 500);
  });
}

// ==========================================
// RESIDENTS FUNCTIONS (MOCK)
// ==========================================
const mockResidents = [
  {
    resident_id: 'RES-00001',
    first_name: 'Juan',
    middle_name: 'Dela',
    last_name: 'Cruz',
    suffix: 'Jr.',
    gender: 'Male',
    birth_date: '01/15/1990',
    age: 35,
    civil_status: 'Married',
    relationship_to_head: 'Head of Household',
    occupation: 'Teacher',
    educational_attainment: 'College Graduate',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    voter_status: true,
    philhealth_member: true,
    senior_citizen: false,
    pwd: false,
    solo_parent: false,
    contact_number: '09171234567',
    email: 'juan@email.com',
    status: 'Active',
    purok_name: 'Purok 1',
    household_id: 'HH-0001'
  },
  {
    resident_id: 'RES-00002',
    first_name: 'Maria',
    middle_name: 'Santos',
    last_name: 'Reyes',
    suffix: '',
    gender: 'Female',
    birth_date: '05/20/1985',
    age: 40,
    civil_status: 'Married',
    relationship_to_head: 'Spouse',
    occupation: 'Nurse',
    educational_attainment: 'College Graduate',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    voter_status: true,
    philhealth_member: true,
    senior_citizen: false,
    pwd: false,
    solo_parent: false,
    contact_number: '09171234568',
    email: 'maria@email.com',
    status: 'Active',
    purok_name: 'Purok 2',
    household_id: 'HH-0002'
  },
  {
    resident_id: 'RES-00003',
    first_name: 'Pedro',
    middle_name: 'Garcia',
    last_name: 'Martinez',
    suffix: '',
    gender: 'Male',
    birth_date: '08/10/1992',
    age: 33,
    civil_status: 'Single',
    relationship_to_head: 'Son',
    occupation: 'Engineer',
    educational_attainment: 'College Graduate',
    citizenship: 'Filipino',
    religion: 'Roman Catholic',
    voter_status: true,
    philhealth_member: true,
    senior_citizen: false,
    pwd: false,
    solo_parent: false,
    contact_number: '09171234569',
    email: 'pedro@email.com',
    status: 'Active',
    purok_name: 'Purok 1',
    household_id: 'HH-0001'
  }
];

export async function getResidents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResidents);
    }, 500);
  });
}

export async function addResident(resident: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newResident = {
        ...resident,
        resident_id: `RES-${String(mockResidents.length + 1).padStart(5, '0')}`,
        status: 'Active'
      };
      mockResidents.push(newResident);
      resolve(newResident);
    }, 500);
  });
}

export async function updateResident(id: string, updates: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockResidents.findIndex(r => r.resident_id === id);
      if (index === -1) {
        reject(new Error('Resident not found'));
        return;
      }
      mockResidents[index] = { ...mockResidents[index], ...updates };
      resolve(mockResidents[index]);
    }, 500);
  });
}

export async function deleteResident(id: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockResidents.findIndex(r => r.resident_id === id);
      if (index === -1) {
        reject(new Error('Resident not found'));
        return;
      }
      mockResidents[index].status = 'Inactive';
      resolve(true);
    }, 500);
  });
}

// ==========================================
// HOUSEHOLD FUNCTIONS (MOCK)
// ==========================================
export async function getHouseholds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
}

export async function addHousehold(household: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(household);
    }, 500);
  });
}

// ==========================================
// ZONES FUNCTIONS (MOCK)
// ==========================================
export async function getZones() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { zone_id: '1', zone_name: 'Purok 1', description: 'Zone 1' },
        { zone_id: '2', zone_name: 'Purok 2', description: 'Zone 2' },
        { zone_id: '3', zone_name: 'Purok 3', description: 'Zone 3' },
        { zone_id: '4', zone_name: 'Purok 4', description: 'Zone 4' },
        { zone_id: '5', zone_name: 'Purok 5', description: 'Zone 5' },
        { zone_id: '6', zone_name: 'Purok 6', description: 'Zone 6' },
        { zone_id: '7', zone_name: 'Purok 7', description: 'Zone 7' },
        { zone_id: '8', zone_name: 'Purok 8', description: 'Zone 8' },
      ]);
    }, 500);
  });
}