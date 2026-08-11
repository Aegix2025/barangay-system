import React, { useState } from 'react';
import { MapPin, Users, Home, UserCheck, Search, ChevronRight, Building2, Calendar, Award } from 'lucide-react';
import { Zone, Household, Resident } from '../types';

interface Props {
  zones: Zone[];
  households: Household[];
  residents: Resident[];
  onSelectZoneFilter?: (zoneId: string) => void;
}

export const PurokZones: React.FC<Props> = ({
  zones,
  households,
  residents,
  onSelectZoneFilter
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.zone_id || 'ZONE-01');
  const [searchTerm, setSearchTerm] = useState('');

  const currentZone = zones.find(z => z.zone_id === selectedZoneId) || zones[0];

  const filteredZones = zones.filter(z => 
    z.zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.zone_leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const zoneHouseholds = households.filter(h => h.zone_id === currentZone?.zone_id);
  const zoneResidents = residents.filter(r => 
    zoneHouseholds.some(h => h.household_id === r.household_id)
  );

  const seniorCount = zoneResidents.filter(r => r.senior_citizen || r.age >= 60).length;
  const voterCount = zoneResidents.filter(r => r.voter_status).length;
  const maleCount = zoneResidents.filter(r => r.gender?.toLowerCase() === 'male').length;
  const femaleCount = zoneResidents.filter(r => r.gender?.toLowerCase() === 'female').length;

  // Handle zone selection - calls the parent callback if provided
  const handleZoneSelect = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    if (onSelectZoneFilter) {
      onSelectZoneFilter(zoneId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-500" />
            <span>Purok 1–8 at mga Sektor ng Barangay SF II</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
            <span>Nestor Nabaunag, Limay, Bataan</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Sub-barrios and Purok Leadership Directory</span>
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Select Purok.."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Zone Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            Purok in Barangay SF II
          </h3>
          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredZones.map((z) => {
              const hCount = households.filter(h => h.zone_id === z.zone_id).length;
              const isSelected = z.zone_id === selectedZoneId;
              return (
                <div
                  key={z.zone_id}
                  onClick={() => handleZoneSelect(z.zone_id)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-gray-200'
                      : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-md hover:shadow-gray-200 border border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {z.zone_name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {z.zone_leader}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {hCount} HH
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Details */}
        <div className="lg:col-span-8 space-y-6">
          {currentZone && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
              {/* Zone Header Banner */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-2 relative overflow-hidden border border-gray-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                      BARANGAY SF II • ZONE DIRECTORY
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">{currentZone.zone_name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{currentZone.description}</p>
                  </div>
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm shadow-gray-200">
                    {currentZone.zone_id}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-700 relative z-10">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <strong>Purok Leader:</strong> {currentZone.zone_leader}
                  </span>
                  <span className="w-px h-4 bg-gray-200"></span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <strong>Lokasyon:</strong> Nestor Nabaunag, Limay, Bataan
                  </span>
                </div>
              </div>

              {/* Zone Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-600 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    Kabuuan Household
                  </span>
                  <span className="text-xl font-bold text-gray-900">{zoneHouseholds.length}</span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    Populasyon
                  </span>
                  <span className="text-xl font-bold text-gray-900">{zoneResidents.length}</span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-600 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                    Senior Citizens
                  </span>
                  <span className="text-xl font-bold text-gray-900">{seniorCount}</span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Voters
                  </span>
                  <span className="text-xl font-bold text-gray-900">{voterCount}</span>
                </div>
              </div>

              {/* Demographics Quick View */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-500" />
                    Lalaki
                  </span>
                  <span className="text-sm font-bold text-gray-900">{maleCount}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-500" />
                    Babae
                  </span>
                  <span className="text-sm font-bold text-gray-900">{femaleCount}</span>
                </div>
              </div>

              {/* Household List in this Zone */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-500" />
                    Mga Household sa {currentZone.zone_name}
                  </span>
                  <span className="text-xs text-gray-500 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
                    {zoneHouseholds.length} families
                  </span>
                </h4>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {zoneHouseholds.slice(0, 10).map((h) => (
                    <div key={h.household_id} className="p-3.5 bg-white hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-800">{h.household_head}</span>
                          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {h.household_id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          House #{h.house_number}, {h.street_name}, SF II, Limay
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs shrink-0">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-500" />
                          {h.number_of_members} Miyembro
                        </span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ₱{h.monthly_income.toLocaleString()} / mo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {zoneHouseholds.length > 10 && (
                  <button className="w-full text-center text-xs text-emerald-600 font-semibold hover:text-emerald-800 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                    View all {zoneHouseholds.length} households →
                  </button>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};