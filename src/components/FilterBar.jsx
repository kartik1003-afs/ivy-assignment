import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset, localities = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-xs space-y-4">
      
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search by apartment name, listing ID, keyword..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={onReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter Selects Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-gray-100">
        
        {/* Locality */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Locality</label>
          <select
            name="locality"
            value={filters.locality || ''}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none capitalize bg-white"
          >
            <option value="">All Localities</option>
            {localities.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Bedroom BHK */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Bedrooms (BHK)</label>
          <select
            name="bhk"
            value={filters.bhk || ''}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="">Any BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        </div>

        {/* Furnishing */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Furnishing</label>
          <select
            name="furnishing"
            value={filters.furnishing || ''}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="">Any Furnishing</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully-Furnished</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Property Type</label>
          <select
            name="property_type"
            value={filters.property_type || ''}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="builder floor">Builder Floor</option>
            <option value="independent house">Independent House</option>
            <option value="plot">Plot</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Sort By</label>
          <select
            name="sort_by"
            value={filters.sort_by || 'posted_at'}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="posted_at">Posted Date</option>
            <option value="price">Price</option>
            <option value="carpet_area">Carpet Area</option>
            <option value="bedroom">Bedrooms</option>
          </select>
        </div>

        {/* Order */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Order</label>
          <select
            name="order"
            value={filters.order || 'desc'}
            onChange={handleChange}
            className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

      </div>

    </div>
  );
}
