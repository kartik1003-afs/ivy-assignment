import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchRentals } from '../services/api';
import { Key, MapPin, BedDouble, Bath, Maximize2, Shield, PhoneCall, Loader2, Search } from 'lucide-react';

export default function Rentals() {
  const { accessToken } = useAuth();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');

  const [offset, setOffset] = useState(0);
  const limit = 50;
  const [meta, setMeta] = useState({ total: 0, has_more: false });

  const localities = [
    'mg road', 'golf course road', 'dlf phase 3', 'sohna road',
    'dwarka expressway', 'sector 49', 'sector 56', 'sector 65',
    'sector 82', 'new gurgaon', 'koramangala'
  ];

  useEffect(() => {
    async function loadRentals() {
      if (!accessToken) return;
      setLoading(true);
      setError('');

      try {
        const res = await fetchRentals(accessToken, {
          offset,
          limit,
          locality: locality || undefined,
          bhk: bhk || undefined
        });

        let results = res?.results || [];
        if (search) {
          const s = search.toLowerCase();
          results = results.filter((r) =>
            (r.apartment_name && r.apartment_name.toLowerCase().includes(s)) ||
            (r.title && r.title.toLowerCase().includes(s)) ||
            (r.locality && r.locality.toLowerCase().includes(s))
          );
        }

        setRentals(results);
        setMeta({ total: res?.total || 0, has_more: res?.has_more || false });
      } catch (err) {
        setError(err.message || 'Failed to load rentals.');
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, [accessToken, offset, locality, bhk, search]);

  const formatPrice = (amount) => {
    if (!amount) return '₹ 0';
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Key className="w-6 h-6 mr-2 text-emerald-600" />
          Rental Listings in Gurgaon
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore homes for rent with verified monthly rents and security deposits
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apartment, title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <select
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value);
              setOffset(0);
            }}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none capitalize bg-white"
          >
            <option value="">All Localities</option>
            {localities.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={bhk}
            onChange={(e) => {
              setBhk(e.target.value);
              setOffset(0);
            }}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="">Any BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading rentals from Ivy Homes API...</p>
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-8">
          <p className="text-gray-500 font-medium">No rental listings matched your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((r) => (
            <div key={r.listing_id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 capitalize">
                    {r.furnishing || 'Furnished'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{r.listing_id}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                  {r.apartment_name || r.title || 'Rental Residence'}
                </h3>
                
                <p className="text-xs text-gray-500 flex items-center mb-3 capitalize">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {r.locality}, Gurgaon
                </p>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-emerald-700 font-semibold block uppercase">Monthly Rent</span>
                    <span className="text-lg font-extrabold text-emerald-950">{formatPrice(r.price)} / mo</span>
                  </div>
                  {r.deposit && (
                    <div className="text-right">
                      <span className="text-xs text-emerald-700 font-semibold block uppercase">Deposit</span>
                      <span className="text-xs font-bold text-emerald-900">{formatPrice(r.deposit)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-xs text-gray-600 border-t border-b border-gray-100 mb-3">
                  <div className="flex items-center">
                    <BedDouble className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <span>{r.bedroom || 0} BHK</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <span>{r.bathroom || 0} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Maximize2 className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <span>{r.carpet_area || 0} sqft</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">Posted by {r.posted_by || 'owner'}</span>
                <span className="font-mono text-emerald-700 font-semibold flex items-center">
                  <PhoneCall className="w-3 h-3 mr-1" />
                  {r.posted_by_contact || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
