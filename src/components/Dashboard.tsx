import React, { useState } from 'react';
import { Bar, Pie, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  PieController,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { 
  Users, 
  Home, 
  HeartHandshake, 
  UserCheck, 
  ShieldAlert, 
  FileText, 
  MapPin,
  Calendar,
  Megaphone,
  Users2,
  Search,
  Award,
  Heart,
  Dog,
  Car,
  Stethoscope,
  ChevronLeft
} from 'lucide-react';

import { 
  BarangayInfo, 
  Zone, 
  Household, 
  Resident, 
  BlotterRecord, 
  Announcement, 
  BarangayEvent 
} from '../types';

interface Props {
  info: BarangayInfo;
  zones: Zone[];
  households: Household[];
  residents: Resident[];
  blotters: BlotterRecord[];
  announcements: Announcement[];
  events: BarangayEvent[];
  onNavigate: (tab: string) => void;
}

type ViewType = 'dashboard' | 'residents' | 'households' | 'seniors' | 'pwd' | 'soloParents' | 'voters' | 'philhealth' | 'pets' | 'vehicles' | 'medical' | 'blotters' | 'avgHousehold';

export const Dashboard: React.FC<Props> = ({
  info,
  zones,
  households,
  residents,
  blotters,
  announcements,
  events,
  onNavigate,
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const totalResidents = residents.length;
  const totalHouseholds = households.length;

  // Gender Stats
  const maleCount = residents.filter(r => r.gender === 'Male').length;
  const femaleCount = residents.filter(r => r.gender === 'Female').length;

  // Age Group Stats
  const kidsCount = residents.filter(r => r.age >= 0 && r.age <= 11).length;
  const teensCount = residents.filter(r => r.age >= 12 && r.age <= 17).length;
  const youthCount = residents.filter(r => r.age >= 18 && r.age <= 30).length;
  const adultsCount = residents.filter(r => r.age >= 31 && r.age <= 59).length;
  const seniorCount = residents.filter(r => r.age >= 60).length;

  const pwdCount = residents.filter(r => r.pwd).length;
  const soloParentCount = residents.filter(r => r.solo_parent).length;
  const activeBlotters = blotters.filter(b => b.status === 'Active' || b.status === 'Pending').length;

  // Get registered voters (18+)
  const voterCount = residents.filter(r => r.voter_status && r.age >= 18).length;

  // Get PhilHealth members
  const philHealthCount = residents.filter(r => r.philhealth_member).length;

  // Get residents with pets
  const residentsWithPets = residents.filter((r: any) => r.pets && r.pets.length > 0).length;

  // Get residents with vehicles
  const residentsWithVehicles = residents.filter((r: any) => r.vehicles && r.vehicles.length > 0).length;

  // Get residents with medical conditions
  const residentsWithMedicalConditions = residents.filter((r: any) => r.medical_conditions && r.medical_conditions !== 'None').length;

  // Average household size
  const avgHouseholdSize = totalHouseholds > 0 ? (totalResidents / totalHouseholds).toFixed(1) : 0;

  const purokStats = zones.slice(0, 8).map(zone => {
    const zoneHouseholds = households.filter(h => h.zone_id === zone.zone_id);
    const zoneResidents = residents.filter(r => 
      zoneHouseholds.some(h => h.household_id === r.household_id)
    );
    return {
      ...zone,
      householdCount: zoneHouseholds.length,
      residentCount: zoneResidents.length
    };
  });

  // Sex Pie Chart
  const sexChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#60A5FA', '#F472B6'],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8
      }
    ]
  };

  const sexChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const total = maleCount + femaleCount;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const ageChartData = {
    labels: [
      ['0-11', 'Kids'],
      ['12-17', 'Teens'],
      ['18-30', 'Youth'],
      ['31-59', 'Adult'],
      ['60+', 'Senior']
    ],
    datasets: [
      {
        label: 'Population',
        data: [
          kidsCount,
          teensCount,
          youthCount,
          adultsCount,
          seniorCount
        ],
        backgroundColor: [
          '#60A5FA', // Kids - Blue
          '#34D399', // Teens - Green
          '#FBBF24', // Youth - Yellow
          '#F97316', // Adult - Orange
          '#A78BFA'  // Senior - Violet
        ],
        borderColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EA580C',
          '#8B5CF6'
        ],
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.8
      }
    ]
  };

  const ageChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `Population: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 13,
            weight: 'bold' as const
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.08)'
        },
        ticks: {
          color: '#666',
          stepSize: 20
        },
        title: {
          display: true,
          text: 'Population'
        }
      }
    }
  };

  // ========================================
  // DASHBOARD MINI CHART VALUES
  // ========================================

  const totalPopulation = residents.length;

  const seniorPercentage =
    totalPopulation > 0
      ? (seniorCount / totalPopulation) * 100
      : 0;

  const pwdPercentage =
    totalPopulation > 0
      ? (pwdCount / totalPopulation) * 100
      : 0;

  const soloParentPercentage =
    totalPopulation > 0
      ? (soloParentCount / totalPopulation) * 100
      : 0;

  const voterPercentage =
    totalPopulation > 0
      ? (voterCount / totalPopulation) * 100
      : 0;

  const philHealthPercentage =
    totalPopulation > 0
      ? (philHealthCount / totalPopulation) * 100
      : 0;

  const householdPercentage =
    totalPopulation > 0
      ? (households.length / totalPopulation) * 100
      : 0;

  
  // ================================
  // POPULATION PER PUROK - BAR CHART (PINK)
  // ================================
  const populationChartData = {
    labels: purokStats.map(p => p.zone_name),
    datasets: [
      {
        label: 'Population',
        data: purokStats.map(p => p.residentCount),
        backgroundColor: '#F472B6',
        borderColor: '#EC4899',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ]
  };

  const populationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `Population: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#FCE7F3'
        },
        ticks: {
          color: '#666',
          callback: function(value: any) {
            return Number(value).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Population Count'
        }
      }
    }
  };

  // ================================
  // HOUSEHOLDS PER PUROK - LINE CHART (BLUE)
  // ================================
  const householdChartData = {
    labels: purokStats.map(p => p.zone_name),
    datasets: [
      {
        label: 'Households',
        data: purokStats.map(p => p.householdCount),
        borderColor: '#60A5FA',
        backgroundColor: '#EFF6FF',
        borderWidth: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#60A5FA',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const householdChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `Households: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#DBEAFE'
        },
        ticks: {
          color: '#666',
          callback: function(value: any) {
            return Number(value).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Household Count'
        }
      }
    }
  };

  // Card click handler
  const handleCardClick = (view: ViewType) => {
  if (view === 'residents' || view === 'households') {
    onNavigate(view);
    return;
  }
  setCurrentView(view);
};

  // Back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Get data for each view
  const getViewData = () => {
    switch (currentView) {
      case 'seniors':
        return { title: 'Senior Citizens (60+ y/o)', data: residents.filter(r => r.age >= 60), fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'age', 'gender'] };
      case 'pwd':
        return { title: 'PWD (Persons with Disability)', data: residents.filter(r => r.pwd), fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'age', 'gender'] };
      case 'soloParents':
        return { title: 'Solo Parents', data: residents.filter(r => r.solo_parent), fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'age', 'gender'] };
      case 'voters':
        return { title: 'Registered Voters (18+)', data: residents.filter(r => r.voter_status && r.age >= 18), fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'age', 'gender'] };
      case 'philhealth':
        return { title: 'PhilHealth Members', data: residents.filter(r => r.philhealth_member), fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'age', 'gender'] };
      case 'pets':
        return { 
          title: 'Residents with Pets', 
          data: residents.filter((r: any) => r.pets && r.pets.length > 0), 
          fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'pets'] 
        };
      case 'vehicles':
        return { 
          title: 'Residents with Vehicles', 
          data: residents.filter((r: any) => r.vehicles && r.vehicles.length > 0), 
          fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'vehicles'] 
        };
      case 'medical':
        return { 
          title: 'Residents with Medical Conditions', 
          data: residents.filter((r: any) => r.medical_conditions && r.medical_conditions !== 'None' && r.medical_conditions !== ''), 
          fields: ['resident_id', 'first_name', 'last_name', 'purok_name', 'medical_conditions'] 
        };
      case 'blotters':
        return { title: 'Active Blotters', data: blotters.filter(b => b.status === 'Active' || b.status === 'Pending'), fields: ['blotter_id', 'complainant_name', 'respondent_name', 'incident_type', 'status'] };
      case 'avgHousehold':
        return { 
          title: 'Average Household Size Details', 
          data: households.map(h => {
            const members = residents.filter(r => r.household_id === h.household_id);
            return {
              household_id: h.household_id,
              family_name: h.family_name,
              household_head: h.household_head,
              purok: zones.find(z => z.zone_id === h.zone_id)?.zone_name || 'Unknown',
              member_count: members.length,
              members: members.map(m => `${m.first_name} ${m.last_name}`).join(', ')
            };
          }),
          fields: ['household_id', 'family_name', 'household_head', 'purok', 'member_count', 'members']
        };
      default:
        return { title: '', data: [], fields: [] };
    }
  };

  const viewData = getViewData();

  // Render detail view
  const renderDetailView = () => {
    if (currentView === 'residents' || currentView === 'households') {
      return null;
    }

    if (currentView === 'dashboard') {
      return renderDashboard();
    }

    const { title, data, fields } = viewData;

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackToDashboard}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-bold text-gray-700">{title}</h3>
              <p className="text-xs text-gray-400">{data.length} records found</p>
            </div>
          </div>
          <button 
            onClick={handleBackToDashboard}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {data.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <p>No records found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0">
                <tr>
                  {fields.map((field) => (
                    <th key={field} className="p-3 text-left text-xs uppercase tracking-wider">
                      {field.replace('_', ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                    {fields.map((field) => {
                      if (field === 'pets' && item.pets) {
                        return (
                          <td key={field} className="p-3 text-xs text-gray-600">
                            {item.pets.map((p: any) => `${p.count} ${p.type}`).join(', ')}
                          </td>
                        );
                      }
                      if (field === 'vehicles' && item.vehicles) {
                        return (
                          <td key={field} className="p-3 text-xs text-gray-600">
                            {item.vehicles.map((v: any) => `${v.count} ${v.type}`).join(', ')}
                          </td>
                        );
                      }
                      if (field === 'medical_conditions' && item.medical_conditions) {
                        return (
                          <td key={field} className="p-3 text-xs text-gray-600">
                            {item.medical_conditions}
                          </td>
                        );
                      }
                      if (field === 'member_count') {
                        return (
                          <td key={field} className="p-3 text-xs font-bold text-center">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {item.member_count}
                            </span>
                          </td>
                        );
                      }
                      if (field === 'members') {
                        return (
                          <td key={field} className="p-3 text-xs text-gray-600 max-w-xs truncate">
                            {item.members || '—'}
                          </td>
                        );
                      }
                      return (
                        <td key={field} className="p-3 text-xs text-gray-600">
                          {item[field] || '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // Render dashboard
  const renderDashboard = () => {
    return (
      <>
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-[1px] border-gray-200 shadow-gray-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-3 py-0.5 rounded-full font-bold">
                  MUNICIPALITY OF LIMAY, BATAAN
                </span>
                <span className="text-xs text-gray-500">ZIP: {info.zip_code}</span>
              </div>
              <h2 className="text-2xl md:text-2xl font-black tracking-tight text-gray-700 mt-2">
                Maligayang Pagdating sa {info.barangay_name}
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl mt-2">
                Barangay Information Management System serving <strong className="text-gray-800">Purok 1–8</strong> (Nestor Nabaunag, Limay). Real-time population records, certificate issuance, and blotter logging.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => onNavigate('certificates')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => onNavigate('residents')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Users className="w-4 h-4" />
                <span>View Residents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main KPI Stats Row - 6 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Whole Population */}
          <div 
            onClick={() => handleCardClick('residents')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Whole Population</span>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{totalResidents.toLocaleString()}</div>
            <span className="text-[11px] text-gray-500 font-medium">Registered Resident</span>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Households */}
          <div 
            onClick={() => handleCardClick('households')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Households</span>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{totalHouseholds.toLocaleString()}</div>
            <span className="text-[11px] text-gray-500 font-medium">Families in Brgy. SF II</span>
            <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(householdPercentage, 100)}%`
                }}
              />
            </div>
          </div>

          {/* Senior Citizens */}
          <div 
            onClick={() => handleCardClick('seniors')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Senior Citizens</span>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{seniorCount}</div>
            <span className="text-[11px] text-gray-500 font-medium">60+ y/o Sector</span>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg
                  className="w-10 h-10 -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${seniorPercentage} 100`}
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {seniorPercentage.toFixed(1)}% of population
              </span>
            </div>
          </div>

          {/* PWD Sector */}
          <div 
            onClick={() => handleCardClick('pwd')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">PWD Sector</span>
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{pwdCount}</div>
            <span className="text-[11px] text-gray-500 font-medium">Differently Abled</span>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(pwdPercentage, 100)}%`
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500">
                {pwdPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Solo Parents */}
          <div 
            onClick={() => handleCardClick('soloParents')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Solo Parents</span>
              <div className="p-2 bg-pink-100 text-pink-600 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{soloParentCount}</div>
            <span className="text-[11px] text-gray-500 font-medium">Registered Parents</span>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(soloParentPercentage, 100)}%`
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500">
                {soloParentPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Active Blotters */}
          <div 
            onClick={() => handleCardClick('blotters')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Active Blotters</span>
              <div className="p-2 bg-red-100 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-800">{activeBlotters}</div>
            <span className="text-[11px] text-gray-500 font-medium">Peace & Order Cases</span>
            <div className="mt-3 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    activeBlotters >= item
                      ? 'bg-red-500'
                      : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Extra Stats Row - New Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Registered Voters */}
          <div 
            onClick={() => handleCardClick('voters')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Registered Voters</span>
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{voterCount}</div>
            <span className="text-[10px] text-gray-500 font-medium">18+ Registered</span>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.min(voterPercentage, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500">
                {voterPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* PhilHealth Members */}
          <div 
            onClick={() => handleCardClick('philhealth')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">PhilHealth Members</span>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{philHealthCount}</div>
            <span className="text-[10px] text-gray-500 font-medium">Health Insurance</span>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(philHealthPercentage, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500">
                {philHealthPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Residents with Pets */}
          <div 
            onClick={() => handleCardClick('pets')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">With Pets</span>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Dog className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{residentsWithPets}</div>
            <span className="text-[10px] text-gray-500 font-medium">Households with pets</span>
          </div>

          {/* Residents with Vehicles */}
          <div 
            onClick={() => handleCardClick('vehicles')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">With Vehicles</span>
              <div className="p-2 bg-cyan-100 text-cyan-600 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{residentsWithVehicles}</div>
            <span className="text-[10px] text-gray-500 font-medium">Households with vehicles</span>
          </div>

          {/* With Medical Conditions */}
          <div 
            onClick={() => handleCardClick('medical')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Health Conditions</span>
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{residentsWithMedicalConditions}</div>
            <span className="text-[10px] text-gray-500 font-medium">With medical conditions</span>
          </div>

          {/* Average Household Size - CLICKABLE */}
          <div 
            onClick={() => handleCardClick('avgHousehold')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-semibold">Avg. HH Size</span>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">{avgHouseholdSize}</div>
            <span className="text-[10px] text-gray-500 font-medium">Members per household</span>
          </div>
        </div>

        {/* Sex and Age Group - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sex Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users2 className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="text-base font-bold text-gray-800">Sex</h3>
                <p className="text-xs text-gray-500">Male and female population</p>
              </div>
            </div>
            <div className="relative w-full" style={{ height: '300px' }}>
              <Pie data={sexChartData} options={sexChartOptions} />
            </div>
          </div>

          {/* Age Group Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="text-base font-bold text-gray-800">Age Group</h3>
                <p className="text-xs text-gray-500">Population distribution by age</p>
              </div>
            </div>
            <div className="relative w-full h-300px">
              <Bar data={ageChartData} options={ageChartOptions} />
            </div>
          </div>
        </div>

        {/* Population and Households - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Population per Purok - Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-400" />
              <div>
                <h3 className="text-base font-bold text-gray-800">Population per Purok</h3>
                <p className="text-xs text-gray-500">Population distribution across puroks</p>
              </div>
            </div>
            <div className="relative w-full" style={{ height: '300px' }}>
              <Bar data={populationChartData} options={populationChartOptions} />
            </div>
          </div>

          {/* Households per Purok - Line Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-base font-bold text-gray-800">Households per Purok</h3>
                <p className="text-xs text-gray-500">Household distribution across puroks</p>
              </div>
            </div>
            <div className="relative w-full" style={{ height: '300px' }}>
              <Chart
                type="line"
                data={householdChartData}
                options={householdChartOptions}
              />
            </div>
          </div>
        </div>

        {/* Purok Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>Demographics of Purok 1 to Purok 8</span>
              </h3>
              <p className="text-xs text-gray-500">Barangay SF II distribution per Purok zone</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Purok"
                  className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {purokStats.map((p) => (
              <div
                key={p.zone_id}
                onClick={() => onNavigate('residents')}
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-gray-800 group-hover:text-gray-700">
                    {p.zone_name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    p.householdCount === 0 
                      ? 'bg-gray-100 text-gray-500' 
                      : p.householdCount <= 5 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : p.householdCount <= 10 
                          ? 'bg-blue-100 text-blue-700' 
                          : p.householdCount <= 20 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-purple-100 text-purple-700'
                  }`}>
                    {p.householdCount} HH
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-1">{p.description}</p>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Populasyon:</span>
                  <span className="font-extrabold text-gray-800">{p.residentCount} residente</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements & Blotters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-500" />
                <span>Announcements and Events</span>
              </h3>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs text-gray-600 hover:text-gray-800 font-semibold"
              >
                See All →
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((a) => (
                <div key={a.announcement_id} className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 space-y-1 hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      a.category === 'Urgent' ? 'bg-red-100 text-red-700' :
                      a.category === 'Health' ? 'bg-emerald-100 text-emerald-700' :
                      a.category === 'Event' ? 'bg-purple-100 text-purple-700' :
                      a.category === 'Advisory' ? 'bg-blue-100 text-blue-700' :
                      a.category === 'Safety' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {a.category} • {a.target_purok}
                    </span>
                    <span className="text-gray-400 text-[11px]">{a.date_posted}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800">{a.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{a.content}</p>
                </div>
              ))}

              {events.slice(0, 1).map((e) => (
                <div key={e.event_id} className="p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl space-y-1 hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Event • {e.event_date}
                    </span>
                    <span className="text-gray-600 text-[11px] font-semibold">{e.event_time}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800">{e.title}</h4>
                  <p className="text-xs text-gray-600">{e.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>List of Blotters</span>
              </h3>
              <button
                onClick={() => onNavigate('blotter')}
                className="text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                See All →
              </button>
            </div>

            <div className="space-y-3">
              {blotters.slice(0, 4).map((b) => (
                <div key={b.blotter_id} className="p-3.5 bg-red-50/50 rounded-xl border border-red-100 space-y-1.5 hover:bg-red-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-red-500 font-semibold">{b.blotter_id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      b.status === 'Active' ? 'bg-red-100 text-red-700' :
                      b.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' :
                      b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-800">{b.incident_type}</h4>
                  <p className="text-[11px] text-gray-600">
                    Complainant: <strong className="text-gray-800">{b.complainant_name}</strong> vs Respondent: <strong className="text-gray-800">{b.respondent_name}</strong>
                  </p>
                  <div className="text-[10px] text-gray-500 flex justify-between pt-1">
                    <span>📍 {b.incident_location}</span>
                    <span>👮 {b.assigned_officer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-2 py-[-15rem] space-y-5">
        {renderDetailView()}
      </div>
    </div>
  );
};