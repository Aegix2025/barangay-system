// src/components/Residents.tsx - COMPLETE WITH ALL EDITABLE FIELDS
import { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Users,
  Search,
  Plus,
  Eye,
  X,
  Building2,
  Car,
  PawPrint,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Heart,
  Phone,
  Home as HomeIcon,
  Shield,
  Award,
  HeartPulse,
  Sparkles,
  CreditCard,
  UserCircle,
  UserCheck,
  Edit,
  Save,
  Check
} from 'lucide-react';

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

import { Resident, Zone, Household, Gender, CivilStatus } from '../types';

interface Props {
  residents: Resident[];
  zones: Zone[];
  households: Household[];
  onAddResident: (newRes: Resident) => void;
  onAddHousehold: (newHousehold: Household) => void;
  onUpdateResident?: (resident: Resident) => void;
}

// Extended Resident type with additional fields - COMPLETE VERSION
interface ExtendedResident extends Resident {
  // ========== MEDICAL FIELDS ==========
  blood_type?: string;
  height?: number;
  weight?: number;
  medical_conditions?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  
  // ========== BIRTH & PLACE ==========
  place_of_birth?: string;
  years_in_barangay?: number;
  
  // ========== LIVING CONDITIONS ==========
  house_ownership?: string;
  house_material?: string;
  water_source?: string;
  electricity_source?: string;
  toilet_type?: string;
  internet_provider?: string;
  
  // ========== GOVERNMENT & FINANCIAL ==========
  government_assistance?: string[];
  health_insurance?: string;
  vaccination_status?: string[];
  has_bank_account?: boolean;
  has_credit_card?: boolean;
  
  // ========== EDUCATION ==========
  school_attended?: string;
  course_degree?: string;
  scholarship?: string;
  
  // ========== LIVELIHOOD ==========
  business_type?: string;
  business_location?: string;
  years_in_business?: number;
  employees_count?: number;
  monthly_expenses?: number;
  
  // ========== PETS & VEHICLES ==========
  pets?: { type: string; count: number; }[];
  vehicles?: { type: string; count: number; }[];
  
  // ========== SKILLS & COMMUNITY ==========
  skills?: string[];
  organization_memberships?: string[];
  volunteer_work?: string[];
  hobbies?: string[];
  languages_spoken?: string[];
  
  // ========== CONTACT ==========
  social_media?: string;
  preferred_contact_method?: string;
  
  // ========== FORM-ONLY FIELDS (not in Resident type) ==========
  birth_month?: string;
  birth_day?: string;
  birth_year?: string;
  
  // ========== HOUSEHOLD FIELDS ==========
  family_name?: string;
  household_head?: string;
  household_first_name?: string;
  household_middle_name?: string;
  household_last_name?: string;
  address?: string;
  household_type?: string;
  number_of_members?: number;
  monthly_income?: number;
}

// ============================================================
// NAME FORMATTING FUNCTIONS
// ============================================================

const parseName = (fullName: string) => {
  if (!fullName) return { firstName: '', middleName: '', lastName: '' };
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', middleName: '', lastName: '' };
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: '', lastName: '' };
  }
  if (parts.length === 2) {
    return { firstName: parts[0], middleName: '', lastName: parts[1] };
  }
  
  const firstName = parts[0];
  
  const lastTwo = parts.slice(-2).join(' ');
  const commonCompoundLastNames = [
    'Dela Cruz', 'De Leon', 'San Jose', 'De La Cruz',
    'Delos Santos', 'De Guzman', 'De Jesus', 'San Juan',
    'De Vera', 'De Castro', 'De Los Reyes', 'De Luna',
    'Del Rosario', 'De Ocampo', 'De Villa', 'De la Cruz'
  ];
  
  let lastName = '';
  let middleName = '';
  
  const isCompound = commonCompoundLastNames.some(name =>
    lastTwo.toLowerCase() === name.toLowerCase()
  );
  
  if (isCompound) {
    lastName = lastTwo;
    middleName = parts.slice(1, -2).join(' ');
  } else if (parts.length === 3) {
    lastName = parts[2];
    middleName = parts[1];
  } else {
    lastName = parts[parts.length - 1];
    middleName = parts.slice(1, -1).join(' ');
  }
  
  middleName = middleName.trim();
  
  return { firstName, middleName, lastName };
};

// FORMAT: "Last, First M." (for table display)
const formatDisplayName = (fullName: string) => {
  if (!fullName) return '';
  const { firstName, middleName, lastName } = parseName(fullName);
  
  let middleInitial = '';
  if (middleName) {
    const middleParts = middleName.split(' ');
    middleInitial = middleParts.map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  }
  
  if (middleInitial) {
    return `${lastName}, ${firstName} ${middleInitial}`.trim();
  }
  return `${lastName}, ${firstName}`.trim();
};

// FORMAT: "First M. Last" (for modal display)
const formatFullName = (fullName: string) => {
  if (!fullName) return '';
  const { firstName, middleName, lastName } = parseName(fullName);
  
  let middleInitial = '';
  if (middleName) {
    const middleParts = middleName.split(' ');
    middleInitial = middleParts.map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  }
  
  if (middleInitial) {
    return `${firstName} ${middleInitial} ${lastName}`.trim();
  }
  return `${firstName} ${lastName}`.trim();
};

const displayValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string' && value.toLowerCase() === 'none') return '—';
  if (Array.isArray(value) && value.length === 0) return '—';
  return value;
};

const displayArray = (arr: string[] | undefined) => {
  if (!arr || arr.length === 0) return '—';
  const filtered = arr.filter(item => item && item.toLowerCase() !== 'none');
  return filtered.length > 0 ? filtered.join(', ') : '—';
};

// ============================================================
// EDIT FIELD CONTEXT
// ============================================================
interface EditFieldContextValue {
  isEditMode: boolean;
  resident: ExtendedResident;
  editingResident: ExtendedResident | null;
  updateField: (field: keyof ExtendedResident, value: any) => void;
  firstInputRef: React.RefObject<HTMLInputElement>;
}

const EditFieldContext = createContext<EditFieldContextValue | null>(null);

const useEditField = (field: keyof ExtendedResident) => {
  const ctx = useContext(EditFieldContext);
  if (!ctx) {
    throw new Error('Edit fields must be rendered inside EditFieldContext.Provider');
  }
  const source = ctx.isEditMode && ctx.editingResident ? ctx.editingResident : ctx.resident;
  return {
    isEditMode: ctx.isEditMode,
    value: source[field] ?? '',
    updateField: ctx.updateField,
    firstInputRef: ctx.firstInputRef,
  };
};

const inputClassName =
  'w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent';

const EditInput = ({
  field,
  label,
  type = 'text',
  placeholder = ''
}: {
  field: keyof ExtendedResident;
  label: string;
  type?: string;
  placeholder?: string;
}) => {
  const { isEditMode, value, updateField, firstInputRef } = useEditField(field);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-0.5">
        {label}
      </label>
      {isEditMode ? (
        <input
          ref={field === 'first_name' ? firstInputRef : undefined}
          type={type}
          value={value as string}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputClassName}
          placeholder={placeholder}
        />
      ) : (
        <span className="font-medium text-gray-800 text-sm block break-words">
          {displayValue(value)}
        </span>
      )}
    </div>
  );
};

const EditSelect = ({
  field,
  label,
  options
}: {
  field: keyof ExtendedResident;
  label: string;
  options: string[];
}) => {
  const { isEditMode, value, updateField } = useEditField(field);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-0.5">
        {label}
      </label>
      {isEditMode ? (
        <select
          value={value as string}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputClassName}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <span className="font-medium text-gray-800 text-sm block">
          {displayValue(value)}
        </span>
      )}
    </div>
  );
};

const EditCheckbox = ({
  field,
  label
}: {
  field: keyof ExtendedResident;
  label: string;
}) => {
  const { isEditMode, value, updateField } = useEditField(field);

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => updateField(field, e.target.checked)}
        disabled={!isEditMode}
        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
      />
      <label className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export const Residents: React.FC<Props> = ({
  residents,
  zones,
  households,
  onAddResident,
  onAddHousehold,
  onUpdateResident
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurok, setSelectedPurok] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [viewingResident, setViewingResident] = useState<ExtendedResident | null>(null);
  const [editingResident, setEditingResident] = useState<ExtendedResident | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileStep, setProfileStep] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'resident' | 'household'>('resident');
  const [formStep, setFormStep] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);


  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    birth_month: '',
    birth_day: '',
    birth_year: '',
    civil_status: '',
  });

  // Form steps for the stepper - INDEX 0 = Personal Info, INDEX 8 = Sectors
  const formSteps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'medical', label: 'Medical' },
    { id: 'household', label: 'Household' },
    { id: 'education', label: 'Education' },
    { id: 'livelihood', label: 'Livelihood' },
    { id: 'pets', label: 'Pets & Assets' },
    { id: 'skills', label: 'Skills' },
    { id: 'sectors', label: 'Sectors' }
  ];

  // Profile sections - INDEX 0 = Basic Info, INDEX 8 = Sectors
  const profileSections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contact', label: 'Contact & Emergency' },
    { id: 'medical', label: 'Medical' },
    { id: 'education', label: 'Education' },
    { id: 'livelihood', label: 'Livelihood' },
    { id: 'household', label: 'Household' },
    { id: 'pets', label: 'Pets & Vehicles' },
    { id: 'skills', label: 'Skills & Community' },
    { id: 'sectors', label: 'Sectors' }
  ];

  // Age Group Helper Function
  const getAgeGroup = (age: number) => {
    if (age <= 11) return { label: 'Kids', color: 'bg-blue-100 text-blue-800' };
    if (age <= 17) return { label: 'Teens', color: 'bg-green-100 text-green-800' };
    if (age <= 30) return { label: 'Youth', color: 'bg-yellow-100 text-yellow-800' };
    if (age <= 59) return { label: 'Adult', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Senior', color: 'bg-purple-100 text-purple-800' };
  };

  const isAdult = (age: number) => age >= 18;
  const isTeenOrAbove = (age: number) => age >= 12;

  // Purok options
  const purokOptions = [
    { value: 'Purok 1', label: 'Purok 1' },
    { value: 'Purok 2', label: 'Purok 2' },
    { value: 'Purok 3', label: 'Purok 3' },
    { value: 'Purok 4', label: 'Purok 4' },
    { value: 'Purok 5', label: 'Purok 5' },
    { value: 'Purok 6', label: 'Purok 6' },
    { value: 'Purok 7', label: 'Purok 7' },
    { value: 'Purok 8', label: 'Purok 8' },
  ];

  const sectorOptions = [
    { value: 'Senior', label: 'Senior Citizens' },
    { value: 'PWD', label: 'PWD' },
    { value: 'SoloParent', label: 'Solo Parents' },
    { value: 'Voter', label: 'Registered Voter' },
    { value: 'PhilHealth', label: 'PhilHealth Members' },
  ];

  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const bloodTypes = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const houseOwnershipTypes = ['', 'Owned', 'Rented', 'Living with Relatives', 'Informal Settler', 'Other'];
  const houseMaterials = ['', 'Concrete', 'Wood', 'Mixed (Concrete & Wood)', 'Light Materials', 'Other'];
  const waterSources = ['', 'Liwad', 'Deep Well', 'Spring', 'Rainwater', 'Delivered', 'Other'];
  const electricitySources = ['', 'Penelco', 'Solar', 'Generator', 'Other'];
  const toiletTypes = ['', 'Flush (Water Sealed)', 'Pit Latrine', 'Shared', 'Other'];
  const internetProviders = ['', 'PLDT', 'Globe', 'Converge', 'Sky', 'Starlink', 'DITO', 'Other'];
  const healthInsurances = ['', 'PhilHealth', 'Private HMO', 'Both', 'Other'];
  const contactMethods = ['', 'Mobile', 'Landline', 'Email', 'Facebook Messenger', 'Viber', 'Other'];
  const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];

  // New Resident Form State
  const [newRes, setNewRes] = useState<Partial<ExtendedResident>>({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    gender: undefined as Gender | undefined,
    birth_month: '',
    birth_day: '',
    birth_year: '',
    age: 0,
    civil_status: undefined as CivilStatus | undefined,
    relationship_to_head: '',
    household_id: '',
    purok_name: '',
    occupation: '',
    educational_attainment: '',
    citizenship: 'Filipino',
    religion: '',
    voter_status: false,
    philhealth_member: false,
    senior_citizen: false,
    pwd: false,
    solo_parent: false,
    contact_number: '',
    email: '',
    blood_type: '',
    height: 0,
    weight: 0,
    medical_conditions: '',
    allergies: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    place_of_birth: '',
    years_in_barangay: 0,
    house_ownership: '',
    house_material: '',
    water_source: '',
    electricity_source: '',
    toilet_type: '',
    internet_provider: '',
    government_assistance: [],
    health_insurance: '',
    vaccination_status: [],
    school_attended: '',
    course_degree: '',
    scholarship: '',
    business_type: '',
    business_location: '',
    years_in_business: 0,
    employees_count: 0,
    pets: [],
    vehicles: [],
    skills: [],
    organization_memberships: [],
    volunteer_work: [],
    hobbies: [],
    languages_spoken: [],
    monthly_expenses: 0,
    has_bank_account: false,
    has_credit_card: false,
    social_media: '',
    preferred_contact_method: '',
  });

  const [newHouseholdForm, setNewHouseholdForm] = useState({
    purok_name: '',
    family_name: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    head_type: '',
    house_number: '',
    street_name: '',
    contact_number: '',
    monthly_income: '',
    household_type: 'Nuclear' as Household['household_type'],
  });

  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const getDayOptions = () => {
    const days = getDaysInMonth(newRes.birth_month || '', newRes.birth_year || '');
    return Array.from({ length: days }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: String(i + 1)
    }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1900; y--) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  };

  const handleBirthdayChange = (field: 'month' | 'day' | 'year', value: string) => {
    setNewRes(prev => {
      const updated = { ...prev, [`birth_${field}`]: value };

      if (updated.birth_month && updated.birth_day && updated.birth_year) {
        const birthDate = new Date(
          parseInt(updated.birth_year),
          parseInt(updated.birth_month) - 1,
          parseInt(updated.birth_day)
        );
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          const computedAge = Math.max(0, age);
          updated.age = computedAge;
          updated.senior_citizen = computedAge >= 60;
        }
      } else {
        updated.age = 0;
      }
      return updated;
    });
  };

  const householdsInPurok = useMemo(() => {
    return households.filter(h => {
      const zone = zones.find(z => z.zone_id === h.zone_id);
      return zone?.zone_name?.toLowerCase() === newRes.purok_name?.toLowerCase();
    });
  }, [households, zones, newRes.purok_name]);

  const filteredResidents = residents.filter((r) => {
    const fullName = `${r.first_name} ${r.middle_name} ${r.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      r.resident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.occupation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurok = !selectedPurok || r.purok_name?.includes(selectedPurok);

    let matchesSector = true;
    if (selectedSector === 'Senior') matchesSector = r.senior_citizen || r.age >= 60;
    else if (selectedSector === 'PWD') matchesSector = r.pwd;
    else if (selectedSector === 'SoloParent') matchesSector = r.solo_parent;
    else if (selectedSector === 'Voter') matchesSector = r.voter_status;
    else if (selectedSector === 'PhilHealth') matchesSector = r.philhealth_member;

    return matchesSearch && matchesPurok && matchesSector;
  });

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    return a.last_name.localeCompare(b.last_name);
  });

  const totalPages = Math.ceil(sortedResidents.length / itemsPerPage);
  const currentPageNum = Math.min(currentPage, totalPages || 1);
  const displayedResidents = sortedResidents.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  // ============================================================
  // HANDLE EDIT RESIDENT
  // ============================================================
  const handleEditResident = () => {
    if (viewingResident) {
      setEditingResident({ ...viewingResident });
      setIsEditing(true);
      setSaveSuccess(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingResident(null);
    setSaveSuccess(false);
  };

  const handleSaveEdit = () => {
    if (editingResident && onUpdateResident) {
      // Compute age from birth_date
      let computedAge = editingResident.age || 0;
      if (editingResident.birth_date) {
        const parts = editingResident.birth_date.split('/');
        if (parts.length === 3) {
          const birthDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          if (!isNaN(birthDate.getTime())) {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            computedAge = Math.max(0, age);
          }
        }
      }

      const isSenior = computedAge >= 60;

      const cleanResident: Resident = {
        resident_id: editingResident.resident_id || '',
        household_id: editingResident.household_id || '',
        first_name: editingResident.first_name || '',
        middle_name: editingResident.middle_name || '',
        last_name: editingResident.last_name || '',
        suffix: editingResident.suffix || '',
        gender: editingResident.gender as Gender || 'Male',
        birth_date: editingResident.birth_date || '',
        age: computedAge,
        civil_status: editingResident.civil_status as CivilStatus || 'Single',
        relationship_to_head: editingResident.relationship_to_head || '',
        occupation: editingResident.occupation || '',
        educational_attainment: editingResident.educational_attainment || '',
        citizenship: editingResident.citizenship || 'Filipino',
        religion: editingResident.religion || '',
        voter_status: editingResident.voter_status || false,
        philhealth_member: editingResident.philhealth_member || false,
        senior_citizen: isSenior,
        pwd: editingResident.pwd || false,
        solo_parent: editingResident.solo_parent || false,
        contact_number: editingResident.contact_number || '',
        email: editingResident.email || '',
        status: editingResident.status || 'Active',
        purok_name: editingResident.purok_name || '',
        blood_type: editingResident.blood_type || '',
        height: editingResident.height || 0,
        weight: editingResident.weight || 0,
        medical_conditions: editingResident.medical_conditions || '',
        allergies: editingResident.allergies || '',
        emergency_contact_name: editingResident.emergency_contact_name || '',
        emergency_contact_number: editingResident.emergency_contact_number || '',
        place_of_birth: editingResident.place_of_birth || '',
        years_in_barangay: editingResident.years_in_barangay || 0,
        house_ownership: editingResident.house_ownership || '',
        house_material: editingResident.house_material || '',
        water_source: editingResident.water_source || '',
        electricity_source: editingResident.electricity_source || '',
        toilet_type: editingResident.toilet_type || '',
        internet_provider: editingResident.internet_provider || '',
        government_assistance: editingResident.government_assistance || [],
        health_insurance: editingResident.health_insurance || '',
        vaccination_status: editingResident.vaccination_status || [],
        school_attended: editingResident.school_attended || '',
        course_degree: editingResident.course_degree || '',
        scholarship: editingResident.scholarship || '',
        business_type: editingResident.business_type || '',
        business_location: editingResident.business_location || '',
        years_in_business: editingResident.years_in_business || 0,
        employees_count: editingResident.employees_count || 0,
        pets: editingResident.pets || [],
        vehicles: editingResident.vehicles || [],
        skills: editingResident.skills || [],
        organization_memberships: editingResident.organization_memberships || [],
        volunteer_work: editingResident.volunteer_work || [],
        hobbies: editingResident.hobbies || [],
        languages_spoken: editingResident.languages_spoken || [],
        monthly_expenses: editingResident.monthly_expenses || 0,
        has_bank_account: editingResident.has_bank_account || false,
        has_credit_card: editingResident.has_credit_card || false,
        social_media: editingResident.social_media || '',
        preferred_contact_method: editingResident.preferred_contact_method || '',
      };
      
      onUpdateResident(cleanResident);
      setViewingResident({ ...editingResident, age: computedAge, senior_citizen: isSenior });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else if (!onUpdateResident) {
      if (editingResident) {
        setViewingResident({ ...editingResident });
      }
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      console.warn('onUpdateResident prop is not provided. Changes saved locally only.');
    }
  };

  // ============================================================
  // HANDLE ADD NEW HOUSEHOLD
  // ============================================================
  const handleAddNewHousehold = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newHouseholdForm.head_type) {
      alert('Please select Household Head Type (Father or Mother)');
      return;
    }

    const zone = zones.find(z => 
      z.zone_name?.toLowerCase().trim() === newHouseholdForm.purok_name?.toLowerCase().trim()
    );

    if (!zone) {
      const availableZones = zones.map(z => `- ${z.zone_name}`).join('\n');
      alert(`Hindi mahanap ang purok: "${newHouseholdForm.purok_name}".

Available Purok:
${availableZones}

Please select a valid purok.`);
      return;
    }

    const firstName = newHouseholdForm.first_name?.trim() || '';
    const middleName = newHouseholdForm.middle_name?.trim() || '';
    const lastName = newHouseholdForm.last_name?.trim() || '';
    const familyName = newHouseholdForm.family_name?.trim() || '';

    if (!firstName || !lastName || !familyName) {
      alert('Please enter First Name, Last Name, and Family Name');
      return;
    }

    let middleInitial = '';
    if (middleName) {
      middleInitial = middleName.charAt(0).toUpperCase() + '.';
    }
    
    const fullName = `${firstName} ${middleInitial} ${lastName}`.trim();

    const newId = `HH-2026-${String(Math.floor(3000 + Math.random() * 7000)).padStart(4, '0')}`;

    const newHousehold: Household = {
      household_id: newId,
      zone_id: zone.zone_id,
      house_number: newHouseholdForm.house_number || '1',
      street_name: newHouseholdForm.street_name || 'Main St.',
      household_head: fullName,
      family_name: familyName,
      contact_number: newHouseholdForm.contact_number,
      household_type: newHouseholdForm.household_type || 'Nuclear',
      monthly_income: Number(newHouseholdForm.monthly_income) || 0,
      number_of_members: 0,
      registration_date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onAddHousehold(newHousehold);
    setFormMode('resident');
    setFormStep(3);
    
    setNewRes(prev => ({
      ...prev,
      household_id: newId,
      purok_name: newHouseholdForm.purok_name
    }));

    setNewHouseholdForm({
      purok_name: '',
      family_name: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      head_type: '',
      house_number: '',
      street_name: '',
      contact_number: '',
      monthly_income: '',
      household_type: 'Nuclear',
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const birth_date = newRes.birth_month && newRes.birth_day && newRes.birth_year
      ? `${newRes.birth_month}/${newRes.birth_day}/${newRes.birth_year}`
      : '';

    const ageValue = newRes.age || 0;

    const created: ExtendedResident = {
      resident_id: `RES-${String(residents.length + 1).padStart(5, '0')}`,
      household_id: newRes.household_id || '',
      first_name: newRes.first_name || '',
      middle_name: newRes.middle_name || '',
      last_name: newRes.last_name || '',
      suffix: newRes.suffix || '',
      gender: (newRes.gender || 'Male') as Gender,
      birth_date: birth_date,
      age: ageValue,
      civil_status: (newRes.civil_status || 'Single') as CivilStatus,
      relationship_to_head: newRes.relationship_to_head || '',
      occupation: newRes.occupation || '',
      educational_attainment: newRes.educational_attainment || '',
      citizenship: newRes.citizenship || 'Filipino',
      religion: newRes.religion || '',
      voter_status: newRes.voter_status || false,
      philhealth_member: newRes.philhealth_member || false,
      senior_citizen: newRes.senior_citizen || false,
      pwd: newRes.pwd || false,
      solo_parent: newRes.solo_parent || false,
      contact_number: newRes.contact_number || '',
      email: newRes.email || '',
      status: 'Active',
      purok_name: newRes.purok_name || '',
      blood_type: newRes.blood_type || '',
      height: newRes.height || 0,
      weight: newRes.weight || 0,
      medical_conditions: newRes.medical_conditions || '',
      allergies: newRes.allergies || '',
      emergency_contact_name: newRes.emergency_contact_name || '',
      emergency_contact_number: newRes.emergency_contact_number || '',
      place_of_birth: newRes.place_of_birth || '',
      years_in_barangay: newRes.years_in_barangay || 0,
      house_ownership: newRes.house_ownership || '',
      house_material: newRes.house_material || '',
      water_source: newRes.water_source || '',
      electricity_source: newRes.electricity_source || '',
      toilet_type: newRes.toilet_type || '',
      internet_provider: newRes.internet_provider || '',
      government_assistance: newRes.government_assistance || [],
      health_insurance: newRes.health_insurance || '',
      vaccination_status: newRes.vaccination_status || [],
      school_attended: newRes.school_attended || '',
      course_degree: newRes.course_degree || '',
      scholarship: newRes.scholarship || '',
      business_type: newRes.business_type || '',
      business_location: newRes.business_location || '',
      years_in_business: newRes.years_in_business || 0,
      employees_count: newRes.employees_count || 0,
      pets: newRes.pets || [],
      vehicles: newRes.vehicles || [],
      skills: newRes.skills || [],
      organization_memberships: newRes.organization_memberships || [],
      volunteer_work: newRes.volunteer_work || [],
      hobbies: newRes.hobbies || [],
      languages_spoken: newRes.languages_spoken || [],
      monthly_expenses: newRes.monthly_expenses || 0,
      has_bank_account: newRes.has_bank_account || false,
      has_credit_card: newRes.has_credit_card || false,
      social_media: newRes.social_media || '',
      preferred_contact_method: newRes.preferred_contact_method || '',
    };

    onAddResident(created as Resident);
    setIsAddModalOpen(false);
    setFormStep(0);
    
    setNewRes({
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      gender: undefined as Gender | undefined,
      birth_month: '',
      birth_day: '',
      birth_year: '',
      age: 0,
      civil_status: undefined as CivilStatus | undefined,
      relationship_to_head: '',
      household_id: '',
      purok_name: '',
      occupation: '',
      educational_attainment: '',
      citizenship: 'Filipino',
      religion: '',
      voter_status: false,
      philhealth_member: false,
      senior_citizen: false,
      pwd: false,
      solo_parent: false,
      contact_number: '',
      email: '',
      blood_type: '',
      height: 0,
      weight: 0,
      medical_conditions: '',
      allergies: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      place_of_birth: '',
      years_in_barangay: 0,
      house_ownership: '',
      house_material: '',
      water_source: '',
      electricity_source: '',
      toilet_type: '',
      internet_provider: '',
      government_assistance: [],
      health_insurance: '',
      vaccination_status: [],
      school_attended: '',
      course_degree: '',
      scholarship: '',
      business_type: '',
      business_location: '',
      years_in_business: 0,
      employees_count: 0,
      pets: [],
      vehicles: [],
      skills: [],
      organization_memberships: [],
      volunteer_work: [],
      hobbies: [],
      languages_spoken: [],
      monthly_expenses: 0,
      has_bank_account: false,
      has_credit_card: false,
      social_media: '',
      preferred_contact_method: '',
    });
  };

  useEffect(() => {
    if (!isEditing) return;
    const timeout = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isEditing]);

  // ============================================================
  // RENDER PROFILE SECTION
  // ============================================================
  const renderProfileSection = (
    resident: ExtendedResident,
    step: number,
    isEditMode: boolean = false
  ) => {

    const displayResident =
      isEditMode && editingResident
        ? editingResident
        : resident;

    const ageGroup = getAgeGroup(displayResident.age);

    // ============================================================
    // CALCULATE AGE FROM BIRTH DATE
    // ============================================================
    const calculateAge = (birthDate: string): number => {
      if (!birthDate) return 0;

      let birth: Date;

      if (birthDate.includes("/")) {
        const parts = birthDate.split("/");
        if (parts.length !== 3) return 0;
        const month = Number(parts[0]);
        const day = Number(parts[1]);
        const year = Number(parts[2]);
        if (!month || !day || !year) return 0;
        birth = new Date(year, month - 1, day);
      } else if (birthDate.includes("-")) {
        birth = new Date(birthDate);
      } else {
        return 0;
      }

      if (isNaN(birth.getTime())) return 0;

      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDifference = today.getMonth() - birth.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age >= 0 ? age : 0;
    };

    // ============================================================
    // HOUSEHOLD INFO
    // ============================================================
    const residentHousehold = households.find(
      h => h.household_id === resident.household_id
    );

    const residentZone = residentHousehold
      ? zones.find(
          z => z.zone_id === residentHousehold.zone_id
        )
      : null;

    // ============================================================
    // GET FIELD VALUE
    // ============================================================
    const getFieldValue = (
      field: keyof ExtendedResident
    ) => {
      if (isEditMode && editingResident) {
        return editingResident[field] ?? "";
      }
      return resident[field] ?? "";
    };

    // ============================================================
    // UPDATE FIELD
    // ============================================================
    const updateField = (
      field: keyof ExtendedResident,
      value: any
    ) => {
      setEditingResident(prev => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          [field]: value,
        };

        // AUTO CALCULATE AGE
        if (field === "birth_date") {
          const age = calculateAge(String(value));
          updated.age = age;
        }

        return updated;
      });
    };

    const content = (() => {
    switch(step) {
      case 0: // BASIC INFO
        return (
          <div className="space-y-4">
            {/* Household Information Card - COMPLETELY EDITABLE */}
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-700 mb-2 flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-amber-500" />
                <span>Household Information</span>
                {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-amber-600 block text-xs">Household ID</span>
                  <span className="font-bold text-gray-800">{residentHousehold?.household_id || '—'}</span>
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Family Name</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editingResident?.family_name || residentHousehold?.family_name || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          family_name: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Family Name"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">{residentHousehold?.family_name || '—'}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="text-amber-600 block text-xs">Household Head (Full Name)</span>
                  {isEditMode ? (
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        value={editingResident?.household_first_name || ''}
                        onChange={(e) => {
                          setEditingResident(prev => prev ? {
                            ...prev,
                            household_first_name: e.target.value
                          } : null);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editingResident?.household_middle_name || ''}
                        onChange={(e) => {
                          setEditingResident(prev => prev ? {
                            ...prev,
                            household_middle_name: e.target.value
                          } : null);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Middle Name"
                      />
                      <input
                        type="text"
                        value={editingResident?.household_last_name || ''}
                        onChange={(e) => {
                          setEditingResident(prev => prev ? {
                            ...prev,
                            household_last_name: e.target.value
                          } : null);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-gray-800 text-base">
                      {residentHousehold?.household_head || '—'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Purok</span>
                  {isEditMode ? (
                    <select
                      value={editingResident?.purok_name || resident.purok_name || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          purok_name: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Purok</option>
                      <option value="Purok 1">Purok 1</option>
                      <option value="Purok 2">Purok 2</option>
                      <option value="Purok 3">Purok 3</option>
                      <option value="Purok 4">Purok 4</option>
                      <option value="Purok 5">Purok 5</option>
                      <option value="Purok 6">Purok 6</option>
                      <option value="Purok 7">Purok 7</option>
                      <option value="Purok 8">Purok 8</option>
                    </select>
                  ) : (
                    <span className="font-bold text-gray-800">{residentZone?.zone_name || resident.purok_name || '—'}</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Address</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editingResident?.address || (residentHousehold ? `#${residentHousehold.house_number}, ${residentHousehold.street_name}` : '')}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          address: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="House #, Street"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">
                      {residentHousehold ? `#${residentHousehold.house_number}, ${residentHousehold.street_name}` : '—'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Relationship to Head</span>
                  {isEditMode ? (
                    <select
                      value={editingResident?.relationship_to_head || resident.relationship_to_head || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          relationship_to_head: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Head of Household">Head of Household</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Nephew">Nephew</option>
                      <option value="Relative">Relative</option>
                      <option value="Boarder">Boarder</option>
                    </select>
                  ) : (
                    <span className="font-bold text-gray-800">{resident.relationship_to_head || '—'}</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Household Type</span>
                  {isEditMode ? (
                    <select
                      value={editingResident?.household_type || residentHousehold?.household_type || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          household_type: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Nuclear">Nuclear</option>
                      <option value="Extended">Extended</option>
                      <option value="Single Parent">Single Parent</option>
                      <option value="Single Person">Single Person</option>
                      <option value="Joint">Joint</option>
                    </select>
                  ) : (
                    <span className="font-bold text-gray-800">{residentHousehold?.household_type || '—'}</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Members</span>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editingResident?.number_of_members || residentHousehold?.number_of_members || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          number_of_members: Number(e.target.value)
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Number of Members"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">{residentHousehold?.number_of_members || '—'}</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Contact Number</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editingResident?.contact_number || residentHousehold?.contact_number || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          contact_number: e.target.value
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Contact Number"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">{residentHousehold?.contact_number || '—'}</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-600 block text-xs">Monthly Income</span>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editingResident?.monthly_income || residentHousehold?.monthly_income || ''}
                      onChange={(e) => {
                        setEditingResident(prev => prev ? {
                          ...prev,
                          monthly_income: Number(e.target.value)
                        } : null);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Monthly Income"
                    />
                  ) : (
                    <span className="font-bold text-emerald-600">
                      {residentHousehold?.monthly_income ? `₱${residentHousehold.monthly_income.toLocaleString()}` : '—'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information - COMPLETELY EDITABLE */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-purple-500" />
                <span>Personal Information {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <EditInput field="first_name" label="First Name" placeholder="Enter first name" />
                <EditInput field="middle_name" label="Middle Name" placeholder="Enter middle name" />
                <EditInput field="last_name" label="Last Name" placeholder="Enter last name" />
                <EditInput field="suffix" label="Suffix" placeholder="Jr., Sr., etc." />
                <EditSelect field="gender" label="Sex" options={['Male', 'Female']} />
                <EditSelect field="civil_status" label="Civil Status" options={['Single', 'Married', 'Widowed', 'Separated', 'Divorced']} />
                <EditInput field="birth_date" label="Birth Date (MM/DD/YYYY)" placeholder="MM/DD/YYYY" />
                <EditInput field="blood_type" label="Blood Type" placeholder="A+, B-, etc." />
                <EditInput field="height" label="Height (cm)" type="number" placeholder="e.g., 170" />
                <EditInput field="weight" label="Weight (kg)" type="number" placeholder="e.g., 65" />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="font-bold text-purple-900">Age Group:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${ageGroup.color}`}>
                {ageGroup.label}
              </span>
              <span className="text-purple-600">({displayResident.age} years old)</span>
            </div>
          </div>
        );
        
      case 1: // CONTACT & EMERGENCY
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
                <Phone className="w-4 h-4 text-purple-500" />
                <span>Contact Information {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              <div className="space-y-2">
                <EditInput field="contact_number" label="Contact Number" placeholder="+63 917 123 4567" />
                <EditInput field="email" label="Email Address" type="email" placeholder="resident@gmail.com" />
                <EditInput field="social_media" label="Social Media" placeholder="Facebook, Instagram, etc." />
                <EditSelect field="preferred_contact_method" label="Preferred Contact Method" options={['', 'Mobile', 'Landline', 'Email', 'Facebook Messenger', 'Viber', 'Other']} />
              </div>
            </div>
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                <HeartPulse className="w-4 h-4 text-red-500" />
                <span>Emergency Contact {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              <div className="space-y-2">
                <EditInput field="emergency_contact_name" label="Emergency Contact Name" placeholder="Full name" />
                <EditInput field="emergency_contact_number" label="Emergency Contact Number" placeholder="Contact number" />
              </div>
            </div>
          </div>
        );
        
      case 2: // MEDICAL
        return (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <span>Medical Information {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditInput field="medical_conditions" label="Medical Conditions" placeholder="e.g., Hypertension, Diabetes" />
              <EditInput field="allergies" label="Allergies" placeholder="e.g., Shellfish, Penicillin" />
              <EditSelect field="health_insurance" label="Health Insurance" options={['', 'PhilHealth', 'Private HMO', 'Both', 'Other']} />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Vaccination Status</label>
                {isEditMode ? (
                  <select
                    multiple
                    value={getFieldValue('vaccination_status') as string[] || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      updateField('vaccination_status', values);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[60px]"
                  >
                    <option value="COVID-19 (Complete)">COVID-19 (Complete)</option>
                    <option value="COVID-19 (Booster)">COVID-19 (Booster)</option>
                    <option value="Flu Vaccine">Flu Vaccine</option>
                    <option value="Hepatitis B">Hepatitis B</option>
                    <option value="BCG">BCG</option>
                    <option value="DPT">DPT</option>
                    <option value="Polio">Polio</option>
                    <option value="Measles">Measles</option>
                  </select>
                ) : (
                  <span className="font-medium text-gray-800 text-sm block">{displayArray(displayResident.vaccination_status)}</span>
                )}
                {isEditMode && <p className="text-[10px] text-blue-500 mt-0.5">Hold Ctrl to select multiple</p>}
              </div>
            </div>
          </div>
        );
        
      case 3: // EDUCATION
        if (!isTeenOrAbove(displayResident.age)) {
          return (
            <div className="text-center py-8 text-gray-400">
              <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Education information is only available for ages 12 and above</p>
            </div>
          );
        }
        return (
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span>Education {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditSelect field="educational_attainment" label="Educational Attainment" options={[
                '', 'No Formal Education', 'Kinder', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
                'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
                '1st Year College', '2nd Year College', '3rd Year College', '4th Year College',
                'College Graduate', 'Master\'s Degree', 'Doctorate Degree', 'Vocational Course', 'TESDA Graduate'
              ]} />
              <EditInput field="school_attended" label="School/University Attended" placeholder="School name" />
              <EditSelect field="course_degree" label="Course/Degree" options={[
                '', 'Bachelor of Early Childhood Education', 'Bachelor of Elementary Education', 'Bachelor of Secondary Education',
                'BS Accountancy', 'BS Business Administration', 'BS Entrepreneurship', 'BS Marketing Management',
                'BS Computer Science', 'BS Information Technology', 'BS Computer Engineering',
                'BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering',
                'BS Nursing', 'BS Medical Technology', 'BS Pharmacy', 'BS Psychology',
                'BA Communication', 'BA English Language', 'BA Filipino', 'BA History',
                'BS Architecture', 'BS Hospitality Management', 'BS Tourism Management',
                'BS Agriculture', 'BS Fisheries', 'BS Forestry', 'BS Criminology',
                'Master of Arts', 'Master of Science', 'Master of Business Administration',
                'Doctor of Philosophy', 'Other'
              ]} />
              <EditInput field="scholarship" label="Scholarship" placeholder="CHED, DOST, etc." />
            </div>
          </div>
        );
        
      case 4: // LIVELIHOOD
        if (!isAdult(displayResident.age)) {
          return (
            <div className="text-center py-8 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Livelihood information is only available for ages 18 and above</p>
            </div>
          );
        }
        return (
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 font-semibold mb-3">
              <Briefcase className="w-4 h-4 text-orange-500" />
              <span>Livelihood & Business {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditSelect field="occupation" label="Occupation" options={[
                '', 'Teacher', 'Nurse', 'Engineer', 'Business Owner', 'Government Employee',
                'Farmer', 'Fisherman', 'Driver', 'Housewife', 'Student', 'Retired',
                'Unemployed', 'OFW', 'Freelancer', 'Other'
              ]} />
              <EditInput field="business_type" label="Business Type" placeholder="Sari-sari store, etc." />
              <EditInput field="business_location" label="Business Location" placeholder="Business address" />
              <EditInput field="years_in_business" label="Years in Business" type="number" placeholder="Number of years" />
              <EditInput field="employees_count" label="Number of Employees" type="number" placeholder="0" />
              <EditInput field="monthly_expenses" label="Monthly Expenses (₱)" type="number" placeholder="Estimated monthly expenses" />
            </div>
          </div>
        );
        
      case 5: // HOUSEHOLD (Living Conditions)
        return (
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700 font-semibold mb-3">
              <HomeIcon className="w-4 h-4 text-amber-500" />
              <span>Living Conditions {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditSelect field="house_ownership" label="House Ownership" options={['', 'Owned', 'Rented', 'Living with Relatives', 'Informal Settler', 'Other']} />
              <EditSelect field="house_material" label="House Material" options={['', 'Concrete', 'Wood', 'Mixed (Concrete & Wood)', 'Light Materials', 'Other']} />
              <EditInput field="years_in_barangay" label="Years in Barangay" type="number" placeholder="Number of years" />
              <EditInput field="place_of_birth" label="Place of Birth" placeholder="City/Municipality" />
              <EditSelect field="water_source" label="Water Source" options={['', 'Maynilad', 'Deep Well', 'Spring', 'Rainwater', 'Delivered', 'Other']} />
              <EditSelect field="electricity_source" label="Electricity Source" options={['', 'Penelco', 'Solar', 'Generator', 'Other']} />
              <EditSelect field="toilet_type" label="Toilet Type" options={['', 'Flush (Water Sealed)', 'Pit Latrine', 'Shared', 'Other']} />
              <EditSelect field="internet_provider" label="Internet Provider" options={['', 'PLDT', 'Globe', 'Converge', 'Sky', 'Starlink', 'DITO', 'Other']} />
            </div>
          </div>
        );
        
      case 6: // PETS & VEHICLES
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                <PawPrint className="w-4 h-4 text-green-500" />
                <span>Pets / Animals {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              {isEditMode ? (
                <EditInput field="pets" label="Pets (format: 2 Dogs, 1 Cat)" placeholder="e.g., 2 Dogs, 1 Cat" />
              ) : (
                <div className="space-y-1 text-green-800">
                  {displayResident.pets && displayResident.pets.length > 0 ? (
                    displayResident.pets.map((pet, idx) => (
                      <p key={idx}><span className="text-green-500">🐾</span> {pet.count} {pet.type}(s)</p>
                    ))
                  ) : (
                    <p className="text-green-500">—</p>
                  )}
                </div>
              )}
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-3">
                <Car className="w-4 h-4 text-indigo-500" />
                <span>Vehicles {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              {isEditMode ? (
                <EditInput field="vehicles" label="Vehicles (format: 1 Car, 2 Motorcycle)" placeholder="e.g., 1 Car, 2 Motorcycle" />
              ) : (
                <div className="space-y-1 text-indigo-800">
                  {displayResident.vehicles && displayResident.vehicles.length > 0 ? (
                    displayResident.vehicles.map((vehicle, idx) => (
                      <p key={idx}><span className="text-indigo-500">🚗</span> {vehicle.count} {vehicle.type}(s)</p>
                    ))
                  ) : (
                    <p className="text-indigo-500">—</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        
      case 7: // SKILLS & COMMUNITY
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-200">
              <div className="flex items-center gap-2 text-pink-700 font-semibold mb-3">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Skills & Hobbies {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              <div className="space-y-2">
                <EditInput field="skills" label="Skills (comma separated)" placeholder="Cooking, Programming, etc." />
                <EditInput field="hobbies" label="Hobbies (comma separated)" placeholder="Basketball, Singing, etc." />
                <EditInput field="languages_spoken" label="Languages Spoken (comma separated)" placeholder="Tagalog, English, etc." />
                <EditInput field="citizenship" label="Citizenship" placeholder="Filipino" />
                <EditSelect field="religion" label="Religion" options={['', 'Roman Catholic', 'Iglesia ni Cristo', 'Born Again Christian', 'Protestant', 'Muslim', 'Buddhist', 'Other', 'None']} />
              </div>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200">
              <div className="flex items-center gap-2 text-teal-700 font-semibold mb-3">
                <Award className="w-4 h-4 text-teal-500" />
                <span>Community Involvement {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              <div className="space-y-2">
                <EditInput field="organization_memberships" label="Organization Memberships" placeholder="Church, Coop, etc." />
                <EditInput field="volunteer_work" label="Volunteer Work" placeholder="Clean-up drive, Medical mission, etc." />
              </div>
            </div>
          </div>
        );
        
      case 8: // SECTORS
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span>Financial & Government Assistance {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Bank Account</label>
                  {isEditMode ? (
                    <select
                      value={getFieldValue('has_bank_account') ? 'true' : 'false'}
                      onChange={(e) => updateField('has_bank_account', e.target.value === 'true')}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <span className="font-medium text-gray-800 text-sm block">{displayResident.has_bank_account ? '✅ Yes' : '❌ No'}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Credit Card</label>
                  {isEditMode ? (
                    <select
                      value={getFieldValue('has_credit_card') ? 'true' : 'false'}
                      onChange={(e) => updateField('has_credit_card', e.target.value === 'true')}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <span className="font-medium text-gray-800 text-sm block">{displayResident.has_credit_card ? '✅ Yes' : '❌ No'}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Government Assistance</label>
                  {isEditMode ? (
                    <select
                      multiple
                      value={getFieldValue('government_assistance') as string[] || []}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        updateField('government_assistance', values);
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[60px]"
                    >
                      <option value="4Ps">4Ps</option>
                      <option value="Senior Citizen Pension">Senior Citizen Pension</option>
                      <option value="PWD Allowance">PWD Allowance</option>
                      <option value="Solo Parent Allowance">Solo Parent Allowance</option>
                      <option value="DSWD Aid">DSWD Aid</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Medical Assistance">Medical Assistance</option>
                      <option value="Livelihood Assistance">Livelihood Assistance</option>
                      <option value="None">None</option>
                    </select>
                  ) : (
                    <span className="font-medium text-gray-800 text-sm block">{displayArray(displayResident.government_assistance)}</span>
                  )}
                  {isEditMode && <p className="text-[10px] text-gray-500 mt-0.5">Hold Ctrl to select multiple</p>}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-500" />
                <span>Registered Sectors & Rights {isEditMode && <span className="text-xs text-blue-500 font-normal">(Editing)</span>}</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {isAdult(displayResident.age) && (
                  <EditCheckbox field="voter_status" label="Registered Voter" />
                )}
                <EditCheckbox field="philhealth_member" label="PhilHealth Member" />
                <EditCheckbox field="senior_citizen" label="Senior Citizen" />
                <EditCheckbox field="pwd" label="PWD" />
                <EditCheckbox field="solo_parent" label="Solo Parent" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
    })();

    return (
      <EditFieldContext.Provider
        value={{
          isEditMode,
          resident,
          editingResident,
          updateField,
          firstInputRef,
        }}
      >
        {content}
      </EditFieldContext.Provider>
    );
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          ADD RESIDENT FORM
          ============================================================ */}
      {isAddModalOpen && formMode === 'resident' ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-6 pl-12">
            <div>
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span>New Resident</span>
              </h2>
              <p className="text-xs text-gray-500">Fill in the complete details of the resident</p>
            </div>
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setFormMode('resident');
                setFormStep(0);
              }} 
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar - Shows 1-9 */}
          <div className="px-6 pt-auto pb-2 bg-white border-b border-gray-200">
            <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2">
              {formSteps.map((step, idx) => {
                const isAccessible = idx <= formStep;
                const isCompleted = idx < formStep;
                const isCurrent = idx === formStep;
                
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isAccessible) {
                        setFormStep(idx);
                      }
                    }}
                    disabled={!isAccessible}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isCurrent 
                        ? 'bg-purple-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {idx + 1} {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleAddSubmit} className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto scrollbar-hide">
            {/* STEP 1: Personal Information - formStep === 0 */}
            {formStep === 0 && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-purple-500" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={newRes.first_name}
                        onChange={(e) => {
                          setNewRes({ ...newRes, first_name: e.target.value });
                          if (errors.first_name) setErrors({ ...errors, first_name: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.first_name && <p className="text-red-500 text-[10px] mt-1">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={newRes.middle_name}
                        onChange={(e) => setNewRes({ ...newRes, middle_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={newRes.last_name}
                        onChange={(e) => {
                          setNewRes({ ...newRes, last_name: e.target.value });
                          if (errors.last_name) setErrors({ ...errors, last_name: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.last_name && <p className="text-red-500 text-[10px] mt-1">{errors.last_name}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Suffix</label>
                      <select
                        value={newRes.suffix}
                        onChange={(e) => setNewRes({ ...newRes, suffix: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">None</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Sex</label>
                      <select
                        value={newRes.gender || ''}
                        onChange={(e) => {
                          setNewRes({ ...newRes, gender: e.target.value as Gender });
                          if (errors.gender) setErrors({ ...errors, gender: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={newRes.blood_type}
                        onChange={(e) => setNewRes({ ...newRes, blood_type: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {bloodTypes.map(bt => (
                          <option key={bt} value={bt}>{bt || 'Select Blood Type'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block font-semibold text-gray-700 mb-1">Birthday & Age</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={newRes.birth_month}
                        onChange={(e) => {
                          handleBirthdayChange('month', e.target.value);
                          if (errors.birth_month) setErrors({ ...errors, birth_month: '' });
                        }}
                        className={`flex-1 px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.birth_month ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Month</option>
                        {monthOptions.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <select
                        value={newRes.birth_day}
                        onChange={(e) => {
                          handleBirthdayChange('day', e.target.value);
                          if (errors.birth_day) setErrors({ ...errors, birth_day: '' });
                        }}
                        className={`w-20 px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.birth_day ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Day</option>
                        {getDayOptions().map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                      <select
                        value={newRes.birth_year}
                        onChange={(e) => {
                          handleBirthdayChange('year', e.target.value);
                          if (errors.birth_year) setErrors({ ...errors, birth_year: '' });
                        }}
                        className={`w-28 px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.birth_year ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Year</option>
                        {getYearOptions().map((y) => (
                          <option key={y.value} value={y.value}>{y.label}</option>
                        ))}
                      </select>
                      
                      {newRes.birth_month && newRes.birth_day && newRes.birth_year && (newRes.age || 0) > 0 ? (
                        <div className="flex items-center gap-1 px-3 py-2 bg-purple-100 rounded-xl border border-purple-300 whitespace-nowrap">
                          <span className="text-xs font-bold text-purple-700">Age:</span>
                          <span className="text-sm font-bold text-purple-900">{newRes.age}</span>
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-gray-100 rounded-xl border border-gray-200 whitespace-nowrap">
                          <span className="text-xs text-gray-400">Age: —</span>
                        </div>
                      )}
                    </div>
                    {errors.birth_month && <p className="text-red-500 text-[10px] mt-1">{errors.birth_month}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Civil Status *</label>
                      <select
                        value={newRes.civil_status || ''}
                        onChange={(e) => {
                          setNewRes({ ...newRes, civil_status: e.target.value as CivilStatus });
                          if (errors.civil_status) setErrors({ ...errors, civil_status: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.civil_status ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select Civil Status</option>
                        {civilStatusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {errors.civil_status && <p className="text-red-500 text-[10px] mt-1">{errors.civil_status}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={newRes.height || ''}
                        onChange={(e) => setNewRes({ ...newRes, height: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={newRes.weight || ''}
                        onChange={(e) => setNewRes({ ...newRes, weight: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Contact & Emergency - formStep === 1 */}
            {formStep === 1 && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  Contact & Emergency Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={newRes.contact_number}
                      onChange={(e) => setNewRes({ ...newRes, contact_number: e.target.value })}
                      placeholder="+63 917 123 4567"
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newRes.email}
                      onChange={(e) => setNewRes({ ...newRes, email: e.target.value })}
                      placeholder="resident@gmail.com"
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={newRes.emergency_contact_name || ''}
                      onChange={(e) => setNewRes({ ...newRes, emergency_contact_name: e.target.value })}
                      placeholder="Full name of emergency contact"
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Emergency Contact Number</label>
                    <input
                      type="text"
                      value={newRes.emergency_contact_number || ''}
                      onChange={(e) => setNewRes({ ...newRes, emergency_contact_number: e.target.value })}
                      placeholder="Contact number for emergency"
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={newRes.preferred_contact_method || ''}
                      onChange={(e) => setNewRes({ ...newRes, preferred_contact_method: e.target.value })}
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {contactMethods.map(cm => (
                        <option key={cm} value={cm}>{cm || 'Select Contact Method'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-red-700 mb-1">Social Media (Optional)</label>
                    <input
                      type="text"
                      value={newRes.social_media || ''}
                      onChange={(e) => setNewRes({ ...newRes, social_media: e.target.value })}
                      placeholder="Facebook, Instagram, etc."
                      className="w-full px-4 py-2.5 border border-red-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Health & Medical - formStep === 2 */}
            {formStep === 2 && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-500" />
                  Health & Medical Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-blue-700 mb-1">Medical Conditions</label>
                    <input
                      type="text"
                      value={newRes.medical_conditions || ''}
                      onChange={(e) => setNewRes({ ...newRes, medical_conditions: e.target.value })}
                      placeholder="e.g., Hypertension, Diabetes"
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-blue-700 mb-1">Allergies</label>
                    <input
                      type="text"
                      value={newRes.allergies || ''}
                      onChange={(e) => setNewRes({ ...newRes, allergies: e.target.value })}
                      placeholder="e.g., Shellfish, Penicillin"
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-blue-700 mb-1">Health Insurance</label>
                    <select
                      value={newRes.health_insurance || ''}
                      onChange={(e) => setNewRes({ ...newRes, health_insurance: e.target.value })}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {healthInsurances.map(hi => (
                        <option key={hi} value={hi}>{hi || 'Select Health Insurance'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-blue-700 mb-1">Vaccination Status</label>
                    <select
                      multiple
                      value={newRes.vaccination_status || []}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setNewRes({ ...newRes, vaccination_status: values });
                      }}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px]"
                    >
                      <option value="COVID-19 (Complete)">COVID-19 (Complete)</option>
                      <option value="COVID-19 (Booster)">COVID-19 (Booster)</option>
                      <option value="Flu Vaccine">Flu Vaccine</option>
                      <option value="Hepatitis B">Hepatitis B</option>
                      <option value="BCG">BCG</option>
                      <option value="DPT">DPT</option>
                      <option value="Polio">Polio</option>
                      <option value="Measles">Measles</option>
                    </select>
                    <p className="text-[10px] text-blue-500 mt-1">Hold Ctrl to select multiple</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Household & Living - formStep === 3 */}
            {formStep === 3 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <HomeIcon className="w-4 h-4 text-amber-500" />
                  Household & Living Conditions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Purok</label>
                    <select
                      value={newRes.purok_name}
                      onChange={(e) => {
                        setNewRes({ ...newRes, purok_name: e.target.value, household_id: '' });
                      }}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Purok</option>
                      <option value="Purok 1">Purok 1</option>
                      <option value="Purok 2">Purok 2</option>
                      <option value="Purok 3">Purok 3</option>
                      <option value="Purok 4">Purok 4</option>
                      <option value="Purok 5">Purok 5</option>
                      <option value="Purok 6">Purok 6</option>
                      <option value="Purok 7">Purok 7</option>
                      <option value="Purok 8">Purok 8</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Years in Barangay</label>
                    <input
                      type="number"
                      value={newRes.years_in_barangay || ''}
                      onChange={(e) => setNewRes({ ...newRes, years_in_barangay: Number(e.target.value) })}
                      placeholder="Number of years"
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">House Ownership</label>
                    <select
                      value={newRes.house_ownership || ''}
                      onChange={(e) => setNewRes({ ...newRes, house_ownership: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {houseOwnershipTypes.map(ho => (
                        <option key={ho} value={ho}>{ho || 'Select House Ownership'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">House Construction Material</label>
                    <select
                      value={newRes.house_material || ''}
                      onChange={(e) => setNewRes({ ...newRes, house_material: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {houseMaterials.map(hm => (
                        <option key={hm} value={hm}>{hm || 'Select House Material'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Water Source</label>
                    <select
                      value={newRes.water_source || ''}
                      onChange={(e) => setNewRes({ ...newRes, water_source: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {waterSources.map(ws => (
                        <option key={ws} value={ws}>{ws || 'Select Water Source'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Electricity Source</label>
                    <select
                      value={newRes.electricity_source || ''}
                      onChange={(e) => setNewRes({ ...newRes, electricity_source: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {electricitySources.map(es => (
                        <option key={es} value={es}>{es || 'Select Electricity Source'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Toilet Type</label>
                    <select
                      value={newRes.toilet_type || ''}
                      onChange={(e) => setNewRes({ ...newRes, toilet_type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {toiletTypes.map(tt => (
                        <option key={tt} value={tt}>{tt || 'Select Toilet Type'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Internet Provider</label>
                    <select
                      value={newRes.internet_provider || ''}
                      onChange={(e) => setNewRes({ ...newRes, internet_provider: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {internetProviders.map(ip => (
                        <option key={ip} value={ip}>{ip || 'Select Internet Provider'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Create New Household Button */}
                <div className="mt-3 flex items-center justify-between p-3 bg-white/80 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-amber-800 text-xs">Create New Household</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('household');
                      if (newRes.purok_name) {
                        setNewHouseholdForm(prev => ({
                          ...prev,
                          purok_name: newRes.purok_name || ''
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition"
                  >
                    New Household
                  </button>
                </div>

                {/* Household & Relationship */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Household</label>
                    <select
                      value={newRes.household_id}
                      onChange={(e) => setNewRes({ ...newRes, household_id: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">-- Select Household --</option>
                      {householdsInPurok.map((h) => {
                        const displayName = formatDisplayName(h.household_head);
                        return (
                          <option key={h.household_id} value={h.household_id}>
                            {displayName} - {h.family_name} ({h.number_of_members} members)
                          </option>
                        );
                      })}
                    </select>
                    {householdsInPurok.length === 0 && (
                      <p className="text-[10px] text-amber-600 mt-1">
                        ⚠️ No Household in this Purok. Click "New Household"
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Relationship to Head</label>
                    <select
                      value={newRes.relationship_to_head}
                      onChange={(e) => setNewRes({ ...newRes, relationship_to_head: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Head of Household">Head of Household</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Nephew">Nephew</option>
                      <option value="Relative">Relative</option>
                      <option value="Boarder">Boarder</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Education - formStep === 4 */}
            {formStep === 4 && (
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  Education
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-purple-700 mb-1">Educational Attainment</label>
                    <select
                      value={newRes.educational_attainment || ''}
                      onChange={(e) => setNewRes({ ...newRes, educational_attainment: e.target.value })}
                      className="w-full px-4 py-2.5 border border-purple-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Attainment</option>
                      <option value="Kinder">Kinder</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="1st Year College">1st Year College</option>
                      <option value="2nd Year College">2nd Year College</option>
                      <option value="3rd Year College">3rd Year College</option>
                      <option value="4th Year College">4th Year College</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Doctorate Degree">Doctorate Degree</option>
                      <option value="Vocational Course">Vocational Course</option>
                      <option value="TESDA Graduate">TESDA Graduate</option>
                      <option value="No Formal Education">No Formal Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-700 mb-1">School/University Attended</label>
                    <input
                      type="text"
                      value={newRes.school_attended || ''}
                      onChange={(e) => setNewRes({ ...newRes, school_attended: e.target.value })}
                      placeholder="Enter school/university name"
                      className="w-full px-4 py-2.5 border border-purple-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-700 mb-1">Course/Degree</label>
                    <select
                      value={newRes.course_degree || ''}
                      onChange={(e) => setNewRes({ ...newRes, course_degree: e.target.value })}
                      className="w-full px-4 py-2.5 border border-purple-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Course/Degree</option>
                      <option value="Bachelor of Early Childhood Education">Bachelor of Early Childhood Education</option>
                      <option value="Bachelor of Elementary Education">Bachelor of Elementary Education</option>
                      <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                      <option value="BS Accountancy">BS Accountancy</option>
                      <option value="BS Business Administration">BS Business Administration</option>
                      <option value="BS Entrepreneurship">BS Entrepreneurship</option>
                      <option value="BS Marketing Management">BS Marketing Management</option>
                      <option value="BS Computer Science">BS Computer Science</option>
                      <option value="BS Information Technology">BS Information Technology</option>
                      <option value="BS Computer Engineering">BS Computer Engineering</option>
                      <option value="BS Civil Engineering">BS Civil Engineering</option>
                      <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
                      <option value="BS Electrical Engineering">BS Electrical Engineering</option>
                      <option value="BS Nursing">BS Nursing</option>
                      <option value="BS Medical Technology">BS Medical Technology</option>
                      <option value="BS Pharmacy">BS Pharmacy</option>
                      <option value="BS Psychology">BS Psychology</option>
                      <option value="BA Communication">BA Communication</option>
                      <option value="BA English Language">BA English Language</option>
                      <option value="BA Filipino">BA Filipino</option>
                      <option value="BA History">BA History</option>
                      <option value="BS Architecture">BS Architecture</option>
                      <option value="BS Hospitality Management">BS Hospitality Management</option>
                      <option value="BS Tourism Management">BS Tourism Management</option>
                      <option value="BS Agriculture">BS Agriculture</option>
                      <option value="BS Fisheries">BS Fisheries</option>
                      <option value="BS Criminology">BS Criminology</option>
                      <option value="Master of Arts">Master of Arts</option>
                      <option value="Master of Science">Master of Science</option>
                      <option value="Master of Business Administration">Master of Business Administration</option>
                      <option value="Doctor of Philosophy">Doctor of Philosophy</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-700 mb-1">Scholarship</label>
                    <input
                      type="text"
                      value={newRes.scholarship || ''}
                      onChange={(e) => setNewRes({ ...newRes, scholarship: e.target.value })}
                      placeholder="CHED, DOST, etc."
                      className="w-full px-4 py-2.5 border border-purple-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Livelihood - formStep === 5 */}
            {formStep === 5 && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  Livelihood & Business
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Occupation</label>
                    <select
                      value={newRes.occupation || ''}
                      onChange={(e) => setNewRes({ ...newRes, occupation: e.target.value })}
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Occupation</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Engineer">Engineer</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Government Employee">Government Employee</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Fisherman">Fisherman</option>
                      <option value="Driver">Driver</option>
                      <option value="Housewife">Housewife</option>
                      <option value="Student">Student</option>
                      <option value="Retired">Retired</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="OFW">OFW</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Business Type</label>
                    <input
                      type="text"
                      value={newRes.business_type || ''}
                      onChange={(e) => setNewRes({ ...newRes, business_type: e.target.value })}
                      placeholder="Sari-sari store, etc."
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Business Location</label>
                    <input
                      type="text"
                      value={newRes.business_location || ''}
                      onChange={(e) => setNewRes({ ...newRes, business_location: e.target.value })}
                      placeholder="Business address"
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Years in Business</label>
                    <input
                      type="number"
                      value={newRes.years_in_business || ''}
                      onChange={(e) => setNewRes({ ...newRes, years_in_business: Number(e.target.value) })}
                      placeholder="Number of years"
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Number of Employees</label>
                    <input
                      type="number"
                      value={newRes.employees_count || ''}
                      onChange={(e) => setNewRes({ ...newRes, employees_count: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-orange-700 mb-1">Monthly Expenses (₱)</label>
                    <input
                      type="number"
                      value={newRes.monthly_expenses || ''}
                      onChange={(e) => setNewRes({ ...newRes, monthly_expenses: Number(e.target.value) })}
                      placeholder="Estimated monthly expenses"
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Pets, Vehicles & Assets - formStep === 6 */}
            {formStep === 6 && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-green-500" />
                  Pets, Vehicles & Assets
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-green-700 mb-1">Pets/Animals (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., 2 Dogs, 1 Cat, 5 Chickens"
                      onChange={(e) => {
                        const pets = e.target.value.split(',').map(p => {
                          const parts = p.trim().split(' ');
                          const count = parseInt(parts[0]) || 0;
                          const type = parts.slice(1).join(' ') || 'Unknown';
                          return { type, count };
                        });
                        setNewRes({ ...newRes, pets });
                      }}
                      className="w-full px-4 py-2.5 border border-green-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-[10px] text-green-500 mt-1">Format: "2 Dogs, 1 Cat, 5 Chickens"</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-green-700 mb-1">Vehicles (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., 1 Car, 2 Motorcycle"
                      onChange={(e) => {
                        const vehicles = e.target.value.split(',').map(v => {
                          const parts = v.trim().split(' ');
                          const count = parseInt(parts[0]) || 0;
                          const type = parts.slice(1).join(' ') || 'Unknown';
                          return { type, count };
                        });
                        setNewRes({ ...newRes, vehicles });
                      }}
                      className="w-full px-4 py-2.5 border border-green-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-[10px] text-green-500 mt-1">Format: "1 Car, 2 Motorcycle"</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-green-700 mb-1">Has Bank Account</label>
                    <select
                      value={newRes.has_bank_account ? 'true' : 'false'}
                      onChange={(e) => setNewRes({ ...newRes, has_bank_account: e.target.value === 'true' })}
                      className="w-full px-4 py-2.5 border border-green-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-green-700 mb-1">Has Credit Card</label>
                    <select
                      value={newRes.has_credit_card ? 'true' : 'false'}
                      onChange={(e) => setNewRes({ ...newRes, has_credit_card: e.target.value === 'true' })}
                      className="w-full px-4 py-2.5 border border-green-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Skills & Community - formStep === 7 */}
            {formStep === 7 && (
              <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                <h4 className="font-bold text-pink-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Skills & Community Involvement
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Skills</label>
                    <input
                      type="text"
                      value={newRes.skills?.join(', ') || ''}
                      onChange={(e) => setNewRes({ ...newRes, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                      placeholder="Cooking, Programming, etc."
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Hobbies</label>
                    <input
                      type="text"
                      value={newRes.hobbies?.join(', ') || ''}
                      onChange={(e) => setNewRes({ ...newRes, hobbies: e.target.value.split(',').map(h => h.trim()).filter(h => h) })}
                      placeholder="Basketball, Singing, etc."
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Languages Spoken</label>
                    <input
                      type="text"
                      value={newRes.languages_spoken?.join(', ') || ''}
                      onChange={(e) => setNewRes({ ...newRes, languages_spoken: e.target.value.split(',').map(l => l.trim()).filter(l => l) })}
                      placeholder="Tagalog, English, etc."
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Citizenship</label>
                    <input
                      type="text"
                      value={newRes.citizenship || 'Filipino'}
                      onChange={(e) => setNewRes({ ...newRes, citizenship: e.target.value })}
                      placeholder="Filipino"
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Religion</label>
                    <select
                      value={newRes.religion || ''}
                      onChange={(e) => setNewRes({ ...newRes, religion: e.target.value })}
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select Religion</option>
                      <option value="Roman Catholic">Roman Catholic</option>
                      <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                      <option value="Born Again Christian">Born Again Christian</option>
                      <option value="Protestant">Protestant</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Buddhist">Buddhist</option>
                      <option value="Other">Other</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-pink-700 mb-1">Organization Memberships</label>
                    <input
                      type="text"
                      value={newRes.organization_memberships?.join(', ') || ''}
                      onChange={(e) => setNewRes({ ...newRes, organization_memberships: e.target.value.split(',').map(o => o.trim()).filter(o => o) })}
                      placeholder="Church, Coop, etc."
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-pink-700 mb-1">Volunteer Work</label>
                    <input
                      type="text"
                      value={newRes.volunteer_work?.join(', ') || ''}
                      onChange={(e) => setNewRes({ ...newRes, volunteer_work: e.target.value.split(',').map(v => v.trim()).filter(v => v) })}
                      placeholder="Clean-up drive, Medical mission, etc."
                      className="w-full px-4 py-2.5 border border-pink-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Sectors - formStep === 8 */}
            {formStep === 8 && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                <h4 className="font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Sector Status & Government Assistance
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRes.voter_status || false}
                      onChange={(e) => setNewRes({ ...newRes, voter_status: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-indigo-800 font-medium">Registered Voter</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRes.philhealth_member || false}
                      onChange={(e) => setNewRes({ ...newRes, philhealth_member: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-indigo-800 font-medium">PhilHealth Member</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRes.senior_citizen || false}
                      onChange={(e) => setNewRes({ ...newRes, senior_citizen: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-indigo-800 font-medium">Senior Citizen</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRes.pwd || false}
                      onChange={(e) => setNewRes({ ...newRes, pwd: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-indigo-800 font-medium">Person with Disability (PWD)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRes.solo_parent || false}
                      onChange={(e) => setNewRes({ ...newRes, solo_parent: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-indigo-800 font-medium">Solo Parent</label>
                  </div>
                  <div>
                    <label className="block font-semibold text-indigo-700 mb-1">Government Assistance</label>
                    <select
                      multiple
                      value={newRes.government_assistance || []}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setNewRes({ ...newRes, government_assistance: values });
                      }}
                      className="w-full px-4 py-2.5 border border-indigo-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[60px]"
                    >
                      <option value="4Ps">4Ps</option>
                      <option value="Senior Citizen Pension">Senior Citizen Pension</option>
                      <option value="PWD Allowance">PWD Allowance</option>
                      <option value="Solo Parent Allowance">Solo Parent Allowance</option>
                      <option value="DSWD Aid">DSWD Aid</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Medical Assistance">Medical Assistance</option>
                      <option value="Livelihood Assistance">Livelihood Assistance</option>
                      <option value="None">None</option>
                    </select>
                    <p className="text-[10px] text-indigo-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="pt-4 flex justify-between gap-3 border-t border-gray-200">
              <div className="flex gap-2">
                {formStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    ← Previous
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormMode('resident');
                    setFormStep(0);
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                {formStep < formSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep + 1)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRes.household_id) {
                        alert('⚠️ Please select a Household first!');
                        return;
                      }
                      handleAddSubmit(new Event('submit') as any);
                    }}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                  >
                    ✅ Save Resident
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ============================================================
           NORMAL CONTENT - Table, Search, Filters
           ============================================================ */
        <>
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-500" />
                  <span>Direct Residents in Barangay SF II</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Registered Resident in Purok 1 to 8
                </p>
              </div>

              <button
                onClick={() => {
                  setFormMode('resident');
                  setFormStep(0);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resident</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-gray-200">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Name"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="sm:col-span-3">
                <Combobox 
                  items={purokOptions}
                  value={selectedPurok}
                  onValueChange={(value) => {
                    setSelectedPurok(value);
                    setCurrentPage(1);
                  }}
                >
                  <ComboboxInput 
                    placeholder="Select Purok" 
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-black placeholder:text-gray-400"
                  />
                  <ComboboxContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50">
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem 
                          key={item.value} 
                          value={item.value}
                          className="px-3 py-2 text-xs hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div className="sm:col-span-4">
                <Combobox 
                  items={sectorOptions}
                  value={selectedSector}
                  onValueChange={(value) => {
                    setSelectedSector(value);
                    setCurrentPage(1);
                  }}
                >
                  <ComboboxInput 
                    placeholder="Select Sectors" 
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-black placeholder:text-gray-400"
                  />
                  <ComboboxContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50">
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem 
                          key={item.value} 
                          value={item.value}
                          className="px-3 py-2 text-xs hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                    <th className="p-4 text-center">Resident ID</th>
                    <th className="p-4 text-center">Full Name</th>
                    <th className="p-4 text-center">Sex</th>
                    <th className="p-4 text-center">Age & Civil Status</th>
                    <th className="p-4 text-center">Purok Zone</th>
                    <th className="p-4 text-center">Occupation</th>
                    <th className="p-4 text-center">Sector & Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedResidents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-16">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="w-7 h-7 text-purple-500" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-700">No Residents Found</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {residents.length === 0
                                ? 'No registered residents in Barangay SF II yet.'
                                : 'Try adjusting your search or filters.'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {displayedResidents.map((r) => {
                    const ageGroup = getAgeGroup(r.age);
                    return (
                      <tr key={r.resident_id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="p-4 text-center font-mono font-bold text-purple-600">{r.resident_id}</td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-gray-800 block text-sm">
                            {r.first_name} 
                            {r.middle_name ? ` ${r.middle_name.charAt(0)}. ` : ' '} 
                            {r.suffix ? `${r.suffix} ` : ''} 
                            {r.last_name}
                          </span>
                          <span className="text-[10px] text-gray-500">{r.relationship_to_head}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-semibold text-gray-800 block">{r.gender}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[12px] ${ageGroup.color}`}>
                            {r.age} yrs old
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-0.5 font-medium">{r.civil_status}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            {r.purok_name || 'Purok 1'}
                          </span>
                        </td>
                        <td className="p-4 text-center text-gray-700">{r.occupation || '—'}</td>
                        <td className="p-4 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {r.senior_citizen && (
                              <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Senior</span>
                            )}
                            {r.pwd && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">PWD</span>
                            )}
                            {r.solo_parent && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Solo Parent</span>
                            )}
                            {r.voter_status && (
                              <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Voter</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setViewingResident(r as ExtendedResident);
                              setProfileStep(0);
                              setIsEditing(false);
                              setEditingResident(null);
                              setSaveSuccess(false);
                            }}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-[11px] transition-colors flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Resident Modal - WITH EDIT MODE */}
          {viewingResident && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
                {/* Header with Edit/Save buttons */}
                <div className="bg-white text-gray-700 p-5 border-b border-gray-200 flex justify-between items-start shrink-0">
                  <div>
                    <span className="text-gray-500 font-mono text-xs font-bold">{viewingResident.resident_id}</span>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-700">
                        {formatFullName(`${viewingResident.first_name} ${viewingResident.middle_name} ${viewingResident.last_name}`)}
                      </h3>
                      {saveSuccess && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {viewingResident.purok_name}, Barangay SF II, Limay, Bataan
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <button 
                        onClick={handleEditResident}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-semibold">Edit</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          <span className="text-xs font-semibold">Save</span>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setViewingResident(null);
                        setIsEditing(false);
                        setEditingResident(null);
                      }} 
                      className="text-gray-400 hover:text-purple-500 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Body: Sidebar + Content */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-48 bg-gray-50/80 border-r border-gray-200 p-3 overflow-y-auto shrink-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Sections {isEditing && <span className="text-blue-500">(Edit Mode)</span>}
                    </p>
                    <div className="flex flex-col gap-1">
                      {profileSections.map((section, idx) => (
                        <button
                          key={idx}
                          onClick={() => setProfileStep(idx)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                            idx === profileStep 
                              ? 'bg-purple-500 text-white shadow-sm' 
                              : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          <span>{section.label}</span>
                          {idx === profileStep && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 overflow-y-auto bg-white">
                    {renderProfileSection(viewingResident, profileStep, isEditing)}
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50/80 shrink-0">
                  <button
                    onClick={() => setProfileStep(Math.max(0, profileStep - 1))}
                    disabled={profileStep === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                      profileStep === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <span className="text-xs text-gray-400 font-medium">
                    {profileStep + 1} of {profileSections.length}
                    {isEditing && <span className="ml-2 text-blue-500 text-[10px]">✏️ Editing</span>}
                  </span>

                  <button
                    onClick={() => setProfileStep(Math.min(profileSections.length - 1, profileStep + 1))}
                    disabled={profileStep === profileSections.length - 1}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                      profileStep === profileSections.length - 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Household Form */}
      {isAddModalOpen && formMode === 'household' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-200 my-8">
            <div className="bg-white text-black p-6 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold">New Household</h3>
                <p className="text-xs text-black">Register a new family in the barangay</p>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormMode('resident');
                  setFormStep(3);
                }} 
                className="text-black hover:text-purple-400 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewHousehold} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Purok</label>
                  <select
                    value={newHouseholdForm.purok_name}
                    onChange={(e) =>
                      setNewHouseholdForm({
                        ...newHouseholdForm,
                        purok_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" disabled>Select Purok</option>
                    <option value="Purok 1">Purok 1</option>
                    <option value="Purok 2">Purok 2</option>
                    <option value="Purok 3">Purok 3</option>
                    <option value="Purok 4">Purok 4</option>
                    <option value="Purok 5">Purok 5</option>
                    <option value="Purok 6">Purok 6</option>
                    <option value="Purok 7">Purok 7</option>
                    <option value="Purok 8">Purok 8</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Family Last Name</label>
                  <input
                    type="text"
                    required
                    value={newHouseholdForm.family_name}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, family_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter family last name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newHouseholdForm.first_name || ''}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    value={newHouseholdForm.middle_name || ''}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, middle_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter middle name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newHouseholdForm.last_name || ''}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Household Head Type</label>
                  <select
                    value={newHouseholdForm.head_type}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, head_type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">House Number</label>
                  <input
                    type="text"
                    required
                    value={newHouseholdForm.house_number}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, house_number: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter house number"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <input
                    type="text"
                    required
                    value={newHouseholdForm.street_name}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, street_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter street name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    value={newHouseholdForm.contact_number}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, contact_number: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+63 917 123 4567"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Household Type</label>
                  <select
                    value={newHouseholdForm.household_type}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, household_type: e.target.value as Household['household_type'] })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Nuclear">Nuclear</option>
                    <option value="Extended">Extended</option>
                    <option value="Single Parent">Single Parent</option>
                    <option value="Single Person">Single Person</option>
                    <option value="Joint">Joint</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Monthly Income (₱)</label>
                  <input
                    type="number"
                    value={newHouseholdForm.monthly_income}
                    onChange={(e) => setNewHouseholdForm({ ...newHouseholdForm, monthly_income: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter monthly income"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('resident');
                    setFormStep(3);
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                >
                  Save Household
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};