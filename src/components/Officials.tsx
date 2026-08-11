import React, { useEffect, useState } from 'react';
import {
  Award,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Crown,
  Users,
  Loader2,
} from 'lucide-react';

interface BarangayOfficial {
  official_id: number;
  full_name: string;
  position: string;
  contact_number: string;
  email: string;
  committee: string | null;
  image_url: string | null;
  is_active: boolean;
}

// ==========================================
// MOCK DATA - Directly in the component
// ==========================================
const MOCK_OFFICIALS: BarangayOfficial[] = [
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
    committee: 'Records & Documentation',
    image_url: null,
    is_active: true
  },
  {
    official_id: 3,
    full_name: 'Catherine D. Cinco',
    position: 'Barangay Treasurer',
    contact_number: '09171234569',
    email: 'catherine@barangay.com',
    committee: 'Finance & Budget',
    image_url: null,
    is_active: true
  },
  {
    official_id: 4,
    full_name: 'JohnPaul Nabaunag',
    position: 'SK Chairman',
    contact_number: '09171234570',
    email: 'johnpaul@barangay.com',
    committee: 'Youth & Sports Development',
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

export const Officials: React.FC = () => {
  const [officials, setOfficials] = useState<BarangayOfficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading mock officials data...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOfficials(MOCK_OFFICIALS);
      console.log('✅ Loaded', MOCK_OFFICIALS.length, 'officials');
    } catch (err: any) {
      console.error('❌ Error loading officials:', err);
      setError(err.message || 'Failed to load officials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const captain = officials.find(
    (o) => o.position === 'Barangay Captain'
  );

  const secretary = officials.find(
    (o) => o.position === 'Barangay Secretary'
  );

  const treasurer = officials.find(
    (o) => o.position === 'Barangay Treasurer'
  );

  const skChair = officials.find(
    (o) => o.position === 'SK Chairman'
  );

  const kagawads = officials.filter(
    (o) => o.position === 'Barangay Kagawad'
  );

  // ==========================================
  // OFFICIAL AVATAR
  // ==========================================
  const OfficialAvatar = ({
    name,
    size = 'md',
    isCaptain = false,
    image,
  }: {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    isCaptain?: boolean;
    image?: string | null;
  }) => {
    const sizeClasses = {
      sm: 'w-[95px] h-[95px]',
      md: 'w-[100px] h-[100px]',
      lg: 'w-[130px] h-[130px]',
    };

    return (
      <div
        className={`
          ${sizeClasses[size]}
          shrink-0
          rounded-full
          overflow-hidden
          flex
          items-center
          justify-center
          border-[0.5px]
          border-gray-50
          relative
          -left-10
        `}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-full scale-110"
          />
        ) : isCaptain ? (
          <img
            src="/barangay-logo.png"
            alt={`${name} - Barangay Captain`}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Users className="w-1/2 h-1/2 text-indigo-500" />
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-2 text-gray-600">Loading officials...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-semibold">Error loading officials</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchOfficials}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm -mt-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />
          <span>Barangay SF II Officials (2026)</span>
        </h2>
        <p className="text-xs text-gray-700 mt-1">
          Barangay SF II, Nestor Nabaunag, Limay, Bataan • Barangay Council Directory
        </p>
      </div>

      {/* BARANGAY CAPTAIN */}
      {captain && (
        <div className="bg-white border border-gray-200 rounded-2xl p-3 text-gray-800 flex flex-col md:flex-row items-center gap-5 shadow-sm relative -top-2">
          <div className="flex-grow space-y-2 text-center md:text-left relative left-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider relative top-1">
              <Crown className="w-3 h-3" />
              <span>{captain.position}</span>
            </div>
            <h3 className="relative -top-0.5 text-2xl font-bold text-gray-700">
              {captain.full_name}
            </h3>
            <p className="relative -top-1 text-xs text-gray-600 max-w-xl">
              Punong Barangay ng SF II, Nestor Nabaunag, Limay, Bataan • Head of Executive & Peace and Order Committee
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-700 pt-2 relative -top-1">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                {captain.contact_number}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {captain.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Term: 2023 – 2026
              </span>
            </div>
          </div>
          <OfficialAvatar
            name={captain.full_name}
            size="lg"
            isCaptain={true}
          />
        </div>
      )}

      {/* APPOINTED OFFICIALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[secretary, treasurer, skChair].map((off) => {
          if (!off) return null;
          
          let imageUrl = null;
          if (off.position === 'Barangay Treasurer') {
            imageUrl = '/treasurer.jpg';
          } else if (off.position === 'Barangay Secretary') {
            imageUrl = '/secretary.png';
          } else if (off.position === 'SK Chairman') {
            imageUrl = '/sk-chairman.png';
          }
          
          return (
            <div
              key={off.official_id}
              className="bg-white p-5 rounded-2xl border border-gray-200 flex items-start gap-4 hover:shadow-md transition-shadow relative -mt-4"
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-indigo-200 px-2 py-0.5 rounded-xl relative -top-2">
                  {off.position}
                </span>
                <h4 className="font-bold text-base text-gray-700 relative -top-1">
                  {off.full_name}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {off.committee || '—'}
                </p>
                <div className="text-xs text-gray-700 pt-2 border-gray-200 mt-2 space-y-1">
                  <p className="relative -top-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{off.contact_number}</span>
                  </p>
                  <p className="relative top-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{off.email}</span>
                  </p>
                </div>
              </div>
              <OfficialAvatar
                name={off.full_name}
                size="sm"
                isCaptain={false}
                image={imageUrl}
              />
            </div>
          );
        })}
      </div>

      {/* BARANGAY KAGAWAD */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 -mt-3">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Barangay Kagawad (7 Members)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kagawads.map((k, index) => (
            <div
              key={k.official_id}
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-indigo-200 px-2 py-0.5 rounded-xl relative -top-2">
                  {k.committee || 'Member'}
                </span>
                <h4 className="font-bold text-base text-gray-700 relative -top-1">
                  {k.full_name}
                </h4>
                <p className="text-xs text-gray-600 font-semibold mt-0.5">
                  {k.position}
                </p>
                <div className="text-xs text-gray-700 pt-2 border-gray-200 mt-2 space-y-1">
                  <p className="relative -top-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{k.contact_number}</span>
                  </p>
                  <p className="relative top-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{k.email}</span>
                  </p>
                </div>
              </div>
              <OfficialAvatar
                name={k.full_name}
                size="sm"
                isCaptain={false}
                image={`/kagawad-${index + 1}.png`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};