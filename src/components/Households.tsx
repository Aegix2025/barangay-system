import React, { useState } from 'react';
import { Home, Search } from 'lucide-react';
import { Household, Zone, Resident } from '../types';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

interface Props {
  households: Household[];
  zones: Zone[];
  residents: Resident[];
  onAddHousehold: (newHousehold: Household) => void;
}

export const Households: React.FC<Props> = ({ 
  households, 
  zones, 
  residents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurok, setSelectedPurok] = useState('');
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);

  // ============================================================
  // NAME FORMATTING FUNCTIONS - CORRECTED FOR COMPOUND LAST NAMES
  // ============================================================

  /**
   * Parses a full name into first name, middle name, and last name
   * Handles compound last names like "Dela Cruz", "De Leon", "San Jose", etc.
   */
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
    
    // Common compound last names
    const commonCompoundLastNames = [
      'Dela Cruz', 'De Leon', 'San Jose', 'De La Cruz', 
      'Delos Santos', 'De Guzman', 'De Jesus', 'San Juan',
      'De Vera', 'De Castro', 'De Los Reyes', 'De Luna',
      'Del Rosario', 'De Ocampo', 'De Villa', 'De la Cruz'
    ];
    
    const lastTwo = parts.slice(-2).join(' ');
    const isCompound = commonCompoundLastNames.some(name => 
      lastTwo.toLowerCase() === name.toLowerCase()
    );
    
    let lastName = '';
    let middleName = '';
    
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
  // Example: "Dela Cruz, Edgar P."
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
  // Example: "Edgar P. Dela Cruz"
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

  // FORMAT: "Last, First M." (for residents in modal)
  const formatResidentDisplay = (resident: Resident) => {
    const firstName = resident.first_name || '';
    const middleName = resident.middle_name || '';
    const lastName = resident.last_name || '';
    const suffix = resident.suffix || '';
    
    let middleInitial = '';
    if (middleName) {
      middleInitial = middleName.charAt(0) + '.';
    }
    
    let result = lastName;
    if (firstName) {
      result += `, ${firstName}`;
    }
    if (middleInitial) {
      result += ` ${middleInitial}`;
    }
    if (suffix) {
      result += ` ${suffix}`;
    }
    return result.trim();
  };

  // Zone options para sa Combobox
  const zoneOptions = [
    ...zones.map((z) => ({
      value: z.zone_id,
      label: z.zone_name
    }))
  ];

  const getZoneName = (zoneId: string) => {
    return zones.find((z) => z.zone_id === zoneId)?.zone_name || zoneId;
  };

  const getHouseholdMembers = (householdId: string) => {
    return residents.filter((r) => r.household_id === householdId);
  };

  // SORTED MEMBERS: Spouse first, then children by age (highest to lowest)
  const getSortedMembers = (householdId: string) => {
    const members = getHouseholdMembers(householdId);
    
    const spouse = members.filter(r => r.relationship_to_head === 'Spouse');
    const children = members.filter(r => 
      r.relationship_to_head === 'Son' || 
      r.relationship_to_head === 'Daughter' ||
      r.relationship_to_head === 'Son / Daughter'
    );
    const others = members.filter(r => 
      r.relationship_to_head !== 'Spouse' && 
      r.relationship_to_head !== 'Son' && 
      r.relationship_to_head !== 'Daughter' &&
      r.relationship_to_head !== 'Son / Daughter'
    );

    const sortedChildren = [...children].sort((a, b) => b.age - a.age);
    return [...spouse, ...sortedChildren, ...others];
  };

  const filteredHouseholds = households.filter((h) => {
    const zoneName = getZoneName(h.zone_id);
    
    const matchesSearch =
      h.household_head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.street_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.household_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zoneName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurok = !selectedPurok || h.zone_id === selectedPurok;

    return matchesSearch && matchesPurok;
  });

  // SORTING - Alphabetical by household head's last name
  const sortedHouseholds = [...filteredHouseholds].sort((a, b) => {
    const { lastName: lastNameA } = parseName(a.household_head);
    const { lastName: lastNameB } = parseName(b.household_head);
    return lastNameA.localeCompare(lastNameB);
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-700 flex items-center gap-2">
              <Home className="w-6 h-6 text-orange-400" />
              <span>Household Registry</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Registered Families in Barangay SF II, Limay, Bataan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold bg-orange-400 text-white hover:bg-white hover:text-orange-400 hover:border-[1px] hover:border-orange-400 px-3 py-1.5 rounded-xl transition-colors">
              Total: {sortedHouseholds.length} Households
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-gray-200">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Head Name or Family Name"
              className="w-full pl-10 pr-4 py-2.5 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div className="sm:col-span-5">
            <Combobox 
              items={zoneOptions}
              value={selectedPurok}
              onValueChange={(value) => setSelectedPurok(value)}
            >
              <ComboboxInput 
                placeholder="Select Purok" 
                className="w-full px-3 py-2.5 text-xs bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <ComboboxContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-50">
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem 
                      key={item.value} 
                      value={item.value}
                      className="px-3 py-2 text-xs hover:bg-orange-50 cursor-pointer transition-colors text-gray-700"
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

      {/* Household Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {sortedHouseholds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center mb-4">
              <Home className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No Households</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1">
              No registered families in Barangay SF II yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-md text-center">
              <thead className="bg-white text-gray-700 font-semibold">
                <tr>
                  <th className="p-4 text-center text-gray-700">Household ID</th>
                  <th className="p-4 text-center text-gray-700">Head of Household</th>
                  <th className="p-4 text-center text-gray-700">Purok</th>
                  <th className="p-4 text-center text-gray-700">Address</th>
                  <th className="p-4 text-center text-gray-700">Members</th>
                  <th className="p-4 text-center text-gray-700">Monthly Income</th>
                  <th className="p-4 text-center text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedHouseholds.slice(0, 50).map((h) => (
                  <tr key={h.household_id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="p-4 text-center font-mono font-bold text-gray-700">{h.household_id}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-gray-700 block">
                        {formatDisplayName(h.household_head)}
                      </span>
                      <span className="text-[10px] text-gray-400">{h.family_name}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-orange-100 text-orange-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        {getZoneName(h.zone_id)}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">
                      #{h.house_number}, {h.street_name}, SF II
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-700">{h.number_of_members}</td>
                    <td className="p-4 text-center font-bold text-orange-500">₱{h.monthly_income.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedHousehold(h)}
                        className="px-3 py-1.5 bg-orange-400 text-white hover:bg-white hover:text-orange-400 hover:border-[1px] hover:border-orange-400 rounded-lg font-medium text-[11px] transition-colors"
                      >
                        View Members
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Household Detail Modal */}
      {selectedHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200">
            <div className="bg-white text-gray-700 p-6 flex justify-between items-center border-b border-gray-200">
              <div>
                <span className="text-orange-400 text-xs font-mono">{selectedHousehold.household_id}</span>
                <h3 className="text-xl font-bold text-gray-700">{selectedHousehold.family_name}</h3>
                <p className="text-xs text-gray-500">
                  House #{selectedHousehold.house_number}, {selectedHousehold.street_name}, {getZoneName(selectedHousehold.zone_id)}
                </p>
              </div>
              <button
                onClick={() => setSelectedHousehold(null)}
                className="text-gray-700 hover:text-white text-sm font-bold bg-gray-200 hover:bg-orange-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Head of Household:</span>
                  <span className="font-bold text-gray-700">{formatFullName(selectedHousehold.household_head)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Contact Number:</span>
                  <span className="font-bold text-gray-700">{selectedHousehold.contact_number}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Household Type:</span>
                  <span className="font-bold text-gray-700">{selectedHousehold.household_type}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Estimated Income:</span>
                  <span className="font-bold text-orange-500">₱{selectedHousehold.monthly_income.toLocaleString()} / month</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-700 mb-2">
                  List of Residents ({getHouseholdMembers(selectedHousehold.household_id).length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  {getHouseholdMembers(selectedHousehold.household_id).length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-xs">
                      No residents in this household.
                    </div>
                  ) : (
                    getSortedMembers(selectedHousehold.household_id).map((res) => (
                      <div key={res.resident_id} className="p-3 bg-white hover:bg-orange-50 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-gray-700">
                            {formatResidentDisplay(res)}
                          </span>
                          <p className="text-[10px] text-gray-500">
                            {res.relationship_to_head} • {res.gender}, {res.age} y/o
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {res.senior_citizen && (
                            <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Senior</span>
                          )}
                          {res.pwd && (
                            <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">PWD</span>
                          )}
                          {res.voter_status && (
                            <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Voter</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};