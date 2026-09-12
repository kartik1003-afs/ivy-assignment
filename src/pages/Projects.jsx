import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProjects } from '../services/api';
import { Building2, MapPin, Layers, Calendar, AlertCircle, ShieldCheck, Loader2, Search } from 'lucide-react';

export default function Projects() {
  const { accessToken } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    async function loadProjects() {
      if (!accessToken) return;
      setLoading(true);
      setError('');

      try {
        const res = await fetchProjects(accessToken, {
          offset,
          limit,
          project_status: statusFilter || undefined
        });

        let results = res?.results || [];
        if (search) {
          const s = search.toLowerCase();
          results = results.filter((p) =>
            (p.apartment_name && p.apartment_name.toLowerCase().includes(s)) ||
            (p.developer_name && p.developer_name.toLowerCase().includes(s)) ||
            (p.locality && p.locality.toLowerCase().includes(s))
          );
        }

        setProjects(results);
      } catch (err) {
        setError(err.message || 'Failed to load projects.');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [accessToken, offset, statusFilter, search]);

  // Format project price (handling Lakhs vs Crores floats)
  const formatProjectPrice = (val) => {
    if (val === undefined || val === null) return 'N/A';
    if (val < 50) {
      return `₹ ${val} Cr`;
    } else {
      return `₹ ${val} Lakh`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-emerald-600" />
          Builder Projects in Gurgaon
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore premier developer projects, RERA registrations, unit inventory, and price ranges
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project name, developer..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none capitalize bg-white"
          >
            <option value="">All Project Statuses</option>
            <option value="under construction">Under Construction</option>
            <option value="ready to move">Ready to Move</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading projects from Ivy Homes API...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-8">
          <p className="text-gray-500 font-medium">No projects matched your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.project_id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 capitalize">
                    {p.project_status || 'Under Construction'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{p.project_id}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-0.5">
                  {p.apartment_name || 'Premier Project'}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  By {p.developer_name || 'Builder'}
                </p>

                <p className="text-xs text-gray-500 flex items-center mb-3 capitalize">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {p.locality}, Gurgaon
                </p>

                {/* Price Range Banner */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                  <span className="text-xs text-gray-500 font-semibold block uppercase">Price Range</span>
                  <span className="text-base font-extrabold text-gray-900">
                    {formatProjectPrice(p.price_min)} - {formatProjectPrice(p.price_max)}
                  </span>
                  <span className="text-xs text-gray-500 block mt-0.5">
                    {p.min_area_sqft || 800} - {p.max_area_sqft || 2400} sqft
                  </span>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span>{p.total_units || 0} Units • {p.total_towers || 0} Towers</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span>{p.total_floors || 0} Floors</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span>Possession: {p.possession_date || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span className="truncate" title={p.rera_number}>RERA Verified</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Reported Listings</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded">
                  {p.total_listings || 0} Available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
