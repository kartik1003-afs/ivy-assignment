import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import { ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';

export default function Listings() {
  const { accessToken } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [offset, setOffset] = useState(0);
  const limit = 50;
  
  const [meta, setMeta] = useState({ total: 0, has_more: false });

  const [filters, setFilters] = useState({
    search: '',
    locality: '',
    bhk: '',
    furnishing: '',
    property_type: '',
    sort_by: 'posted_at',
    order: 'desc',
    show_inactive: false
  });

  const localities = [
    'mg road', 'golf course road', 'dlf phase 3', 'sohna road', 
    'dwarka expressway', 'sector 49', 'sector 56', 'sector 65', 
    'sector 82', 'new gurgaon'
  ];

  const loadData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');

    try {
      // Build API query parameters using offset
      const qp = {
        offset,
        limit,
        locality: filters.locality || undefined,
        bhk: filters.bhk || undefined,
        furnishing: filters.furnishing || undefined,
        property_type: filters.property_type || undefined,
        sort_by: filters.sort_by || undefined,
        order: filters.order || undefined,
      };

      const res = await fetchListings(accessToken, qp);
      
      let results = res?.results || [];
      setMeta({
        total: res?.total || 0,
        has_more: res?.has_more || false
      });

      // Client-side search and filtering refinements if needed
      if (filters.search) {
        const s = filters.search.toLowerCase();
        results = results.filter((l) =>
          (l.apartment_name && l.apartment_name.toLowerCase().includes(s)) ||
          (l.listing_id && l.listing_id.toLowerCase().includes(s)) ||
          (l.description && l.description.toLowerCase().includes(s))
        );
      }

      if (!filters.show_inactive) {
        results = results.filter((l) => l.is_live !== false);
      }

      setListings(results);
    } catch (err) {
      setError(err.message || 'Failed to fetch listings.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, offset, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReset = () => {
    setFilters({
      search: '',
      locality: '',
      bhk: '',
      furnishing: '',
      property_type: '',
      sort_by: 'posted_at',
      order: 'desc',
      show_inactive: false
    });
    setOffset(0);
  };

  const totalPages = Math.ceil(meta.total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Properties for Sale
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse verified listings in Gurgaon • Showing offset {offset} to {offset + listings.length}
          </p>
        </div>

        {/* Inactive toggle switch */}
        <label className="inline-flex items-center cursor-pointer text-xs font-semibold text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            checked={filters.show_inactive}
            onChange={(e) => setFilters((prev) => ({ ...prev, show_inactive: e.target.checked }))}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
          />
          Include Inactive Listings (is_live: false)
        </label>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={(newF) => {
          setFilters(newF);
          setOffset(0);
        }}
        onReset={handleReset}
        localities={localities}
      />

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
          <Info className="w-5 h-5 mr-2 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading listings from Ivy Homes API...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-8">
          <p className="text-gray-500 text-base font-medium">No property listings matched your filters.</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg text-xs hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {listings.map((item) => (
              <ListingCard key={item.listing_id} listing={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-xl">
            <div className="text-xs text-gray-500 font-medium">
              Page <span className="font-bold text-gray-900">{currentPage}</span> of{' '}
              <span className="font-bold text-gray-900">{totalPages}</span> ({meta.total} total reported)
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>

              <button
                disabled={!meta.has_more && offset + limit >= meta.total}
                onClick={() => setOffset((prev) => prev + limit)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
