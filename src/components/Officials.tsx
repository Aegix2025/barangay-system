import React from 'react';
import { Award, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { BarangayOfficial } from '../types';

interface Props {
  officials: BarangayOfficial[];
}

export const Officials: React.FC<Props> = ({ officials }) => {
  const captain = officials.find(o => o.position === 'Barangay Captain');
  const secretary = officials.find(o => o.position === 'Barangay Secretary');
  const treasurer = officials.find(o => o.position === 'Barangay Treasurer');
  const skChair = officials.find(o => o.position === 'SK Chairman');
  const kagawads = officials.filter(o => o.position === 'Barangay Kagawad');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />
          <span>Sangguniang Barangay at mga Opisyal (2023–2026)</span>
        </h2>
        <p className="text-xs text-gray-700 mt-0.5">
          Barangay SF II, Nestor Nabaunag, Limay, Bataan • Barangay Council Directory
        </p>
      </div>

      {/* Barangay Captain Hero Card */}
      {captain && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-700 shadow-lg flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white p-1 shrink-0 shadow-md">
            <img
              src={captain.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt={captain.full_name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-grow">
            <div className="inline-block bg-none text-gray-700 border border-gray-200 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {captain.position}
            </div>
            <h3 className="text-2xl font-bold text-gray-700">{captain.full_name}</h3>
            <p className="text-xs text-gray-700 max-w-xl">
              Punong Barangay ng SF II, Nestor Nabaunag, Limay, Bataan • Head of Executive & Peace and Order Committee
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-700 pt-2">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {captain.contact_number}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {captain.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Term: 2023 – 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Appointed Officials: Secretary, Treasurer, SK Chairman */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[secretary, treasurer, skChair].map((off) => {
          if (!off) return null;
          return (
            <div key={off.official_id} className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                {off.position}
              </span>
              <h4 className="font-bold text-base text-gray-700">{off.full_name}</h4>
              <p className="text-xs text-gray-700">{off.committee}</p>
              <div className="text-xs text-gray-700 pt-2 border-t border-gray-200 space-y-1">
                <p>📞 {off.contact_number}</p>
                <p>✉️ {off.email}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7 Barangay Kagawads Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-700 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Barangay Kagawad (7 Members)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kagawads.map((k) => (
            <div key={k.official_id} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  {k.committee}
                </span>
                <h4 className="font-bold text-base text-gray-700">{k.full_name}</h4>
                <p className="text-xs text-gray-700 font-semibold">{k.position}</p>
              </div>

              <div className="text-xs text-gray-700 space-y-1 pt-2 border-t border-gray-200">
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {k.contact_number}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {k.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};