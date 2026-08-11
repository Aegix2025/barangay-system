import React from 'react';
import { Award, Mail, Phone, Calendar, UserCheck, Crown, Users } from 'lucide-react';
import { BarangayOfficial } from '../types';

interface Props {
  officials: BarangayOfficial[];
}

export const Officials: React.FC<Props> = ({ officials }) => {
  const captain = officials.find(
    o => o.position === 'Barangay Captain'
  );

  const secretary = officials.find(
    o => o.position === 'Barangay Secretary'
  );

  const treasurer = officials.find(
    o => o.position === 'Barangay Treasurer'
  );

  const skChair = officials.find(
    o => o.position === 'SK Chairman'
  );

  const kagawads = officials.filter(
    o => o.position === 'Barangay Kagawad'
  );

  
  const OfficialAvatar = ({
    name,
    size = 'md',
    isCaptain = false,
  }: {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    isCaptain?: boolean;
  }) => {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
    };

    const bgColor = isCaptain ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200';

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
          border-2
          ${bgColor}
          shadow-md
        `}
      >
        {isCaptain ? (
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

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm -mt-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />
          <span>Barangay SF II Officials (2026)</span>
        </h2>
        <p className="text-xs text-gray-700 mt-0.5">
          Barangay SF II, Nestor Nabaunag, Limay, Bataan • Barangay Council Directory
        </p>
      </div>

      {/* Barangay Captain Hero Card */}
      {captain && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-800 flex flex-col md:flex-row items-center gap-6 shadow-sm -mt-[5%]">
          <div className="space-y-2 text-center md:text-left flex-grow">
            <div className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3" />
              {captain.position}
            </div>
            <h3 className="text-2xl font-bold text-gray-700">
              {captain.full_name}
            </h3>
            <p className="text-xs text-gray-600 max-w-xl">
              Punong Barangay ng SF II, Nestor Nabaunag, Limay, Bataan • Head of Executive & Peace and Order Committee
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-700 pt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                {captain.contact_number}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {captain.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Term: 2023 – 2026
              </span>
            </div>
          </div>
          <OfficialAvatar name={captain.full_name} size="lg" isCaptain={true} />
        </div>
      )}

      {/* Appointed Officials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[secretary, treasurer, skChair].map((off) => {
          if (!off) return null;
          return (
            <div
              key={off.official_id}
              className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                  {off.position}
                </span>
                <h4 className="font-bold text-base text-gray-700 mt-1">
                  {off.full_name}
                </h4>
                <p className="text-xs text-gray-600">
                  {off.committee || '—'}
                </p>
                <div className="text-xs text-gray-700 pt-2 border-t border-gray-200 mt-2 space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    {off.contact_number}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    {off.email}
                  </p>
                </div>
              </div>
              <OfficialAvatar name={off.full_name} size="sm" isCaptain={false} />
            </div>
          );
        })}
      </div>

      {/* Barangay Kagawads */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-700 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Barangay Kagawad (7 Members)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kagawads.map((k) => (
            <div
              key={k.official_id}
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all space-y-3 flex items-start gap-4"
            >
              <div className="flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block -mt-4">
                    {k.committee || 'Member'}
                  </span>
                  <h4 className="font-bold text-base text-gray-700 mt-1">
                    {k.full_name}
                  </h4>
                  <p className="relative -mt-4 text-xs text-gray-600 font-semibold">
                    {k.position}
                  </p>
                </div>
                <div className="text-xs text-gray-700 pt-2 border-t border-gray-200 mt-2 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    {k.contact_number}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    {k.email}
                  </p>
                </div>
              </div>
              <OfficialAvatar name={k.full_name} size="sm" isCaptain={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};