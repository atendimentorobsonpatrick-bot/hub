
import React, { useState, useEffect } from 'react';

interface ModelFiltersProps {
  onFilterChange: (filters: { ageRange: string }) => void;
  onSortChange: (sortBy: string) => void;
}

const ageRanges = [
    { label: 'All Ages', value: '' },
    { label: '18-24', value: '18-24' },
    { label: '25-29', value: '25-29' },
    { label: '30+', value: '30-99' },
];

const sortOptions = [
    { label: 'Best Match', value: 'status' },
    { label: 'Rating (High to Low)', value: 'rating' },
    { label: 'Highest Price', value: 'price_desc' },
    { label: 'Lowest Price', value: 'price_asc' },
];

const ModelFilters: React.FC<ModelFiltersProps> = ({ onFilterChange, onSortChange }) => {
  const [ageRange, setAgeRange] = useState('');
  const [sortBy, setSortBy] = useState('status');

  useEffect(() => {
    onFilterChange({ ageRange });
  }, [ageRange, onFilterChange]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeRange(e.target.value);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy);
  }

  const selectClasses = "w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-brand-pink focus:border-brand-pink shadow-sm text-gray-700 transition";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-4">
            {/* Sorting Control */}
            <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by
                </label>
                <select id="sort-by" value={sortBy} onChange={handleSortChange} className={selectClasses}>
                    {sortOptions.map(option => (
                       <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            {/* Age Filter */}
            <div>
                <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Age
                </label>
                <select id="age-filter" value={ageRange} onChange={handleAgeChange} className={selectClasses}>
                    {ageRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                </select>
            </div>
        </div>
    </div>
  );
};

export default ModelFilters;