// src/components/SearchBarEnhanced.tsx
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarEnhancedProps {
  onSearch: (filters: any) => void;
  placeholder?: string;
  filters?: {
    dateRange?: boolean;
    status?: boolean;
    category?: boolean;
    purok?: boolean;
  };
  statusOptions?: string[];
  categoryOptions?: string[];
  purokOptions?: string[];
}

export const SearchBarEnhanced: React.FC<SearchBarEnhancedProps> = ({
  onSearch,
  placeholder = 'Search...',
  filters = { dateRange: true, status: true, category: true, purok: true },
  statusOptions = ['All', 'Active', 'Inactive', 'Pending', 'Completed'],
  categoryOptions = ['All', 'Urgent', 'Advisory', 'Health', 'Safety', 'Event'],
  purokOptions = ['All', 'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Purok 8'],
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPurok, setSelectedPurok] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    const filterObj: any = { searchTerm };
    if (selectedStatus !== 'All') filterObj.status = selectedStatus;
    if (selectedCategory !== 'All') filterObj.category = selectedCategory;
    if (selectedPurok !== 'All') filterObj.purok = selectedPurok;
    if (dateFrom) filterObj.dateFrom = dateFrom;
    if (dateTo) filterObj.dateTo = dateTo;
    
    onSearch(filterObj);
    
    // Update active filters display
    const active: string[] = [];
    if (searchTerm) active.push(`"${searchTerm}"`);
    if (selectedStatus !== 'All') active.push(selectedStatus);
    if (selectedCategory !== 'All') active.push(selectedCategory);
    if (selectedPurok !== 'All') active.push(selectedPurok);
    if (dateFrom || dateTo) active.push('Date Range');
    setActiveFilters(active);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedCategory('All');
    setSelectedPurok('All');
    setDateFrom('');
    setDateTo('');
    setActiveFilters([]);
    onSearch({ searchTerm: '' });
  };

  const removeFilter = (filter: string) => {
    if (filter === selectedStatus) setSelectedStatus('All');
    else if (filter === selectedCategory) setSelectedCategory('All');
    else if (filter === selectedPurok) setSelectedPurok('All');
    else if (filter === 'Date Range') { setDateFrom(''); setDateTo(''); }
    else if (filter.startsWith('"')) {
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              showFilters 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>
          
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="hover:text-purple-900 dark:hover:text-purple-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-red-500 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filters.status && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {filters.category && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              >
                {categoryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {filters.purok && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Purok
              </label>
              <select
                value={selectedPurok}
                onChange={(e) => setSelectedPurok(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              >
                {purokOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {filters.dateRange && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Date Range
              </label>
              <div className="flex gap-1">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
                <span className="text-gray-400 self-center">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 px-2 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};