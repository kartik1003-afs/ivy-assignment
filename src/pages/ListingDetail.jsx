import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchListingById, fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import {
  ArrowLeft, Bookmark, ShieldCheck, MapPin, BedDouble, Bath, Maximize2,
  Building, Compass, Car, PhoneCall, Calendar, AlertTriangle, Loader2
} from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const { accessToken, isFavorite, toggleFavorite } = useAuth();

  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadListing() {
      if (!accessToken || !id) return;
      setLoading(true);
      setError('');

      try {
        const data = await fetchListingById(accessToken, id);
        setListing(data);

        // Compute similar listings client-side (since /v1/listings/{id}/similar returns 404)
        if (data?.locality && data?.bedroom) {
          const simRes = await fetchListings(accessToken, {
            locality: data.locality,
            bhk: data.bedroom,
            limit: 6
          }).catch(() => null);

          if (simRes?.results) {
            setSimilarListings(simRes.results.filter((item) => item.listing_id !== id).slice(0, 3));
          }
        }
      } catch (err) {
        setError(err.message || 'Listing not found or failed to load.');
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [accessToken, id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-6">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <h2 className="text-lg font-bold">Property Not Found</h2>
          <p className="text-xs mt-1 text-red-600">{error || 'The requested listing ID does not exist.'}</p>
        </div>
        <Link
          to="/listings"
          className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(listing.listing_id);
  const price = listing.price || 0;
  const carpet = listing.carpet_area || 0;
  const pricePerSqft = carpet > 0 && price > 0 ? Math.round(price / carpet) : 0;

  const formatPrice = (amount) => {
    if (amount <= 0) return `₹ ${amount.toLocaleString('en-IN')}`;
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakh`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const isCorrupt = (listing.floor > listing.total_floors) || (price <= 0) || (carpet > (listing.super_built_up_area || Infinity));
  const isFake = price > 0 && price < 30000;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Link */}
      <Link
        to="/listings"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Listings
      </Link>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs mb-10">
        
        {/* Banner Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-700/80 text-emerald-100 uppercase tracking-wider">
                  {listing.property_type || 'Apartment'}
                </span>
                {listing.is_verified && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-400 text-emerald-950 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                  </span>
                )}
                {isCorrupt && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-amber-950 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Corrupt Data
                  </span>
                )}
                {isFake && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-400 text-rose-950 flex items-center">
                    Suspicious Price
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {listing.apartment_name || 'Independent Residence'}
              </h1>

              <p className="text-sm text-emerald-200 flex items-center mt-2 capitalize">
                <MapPin className="w-4 h-4 mr-1 text-emerald-300" />
                {listing.locality}, Gurgaon • ID: <code className="bg-emerald-800/60 px-1.5 py-0.5 rounded text-xs ml-1 font-mono text-emerald-100">{listing.listing_id}</code>
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(listing)}
              className={`p-3 rounded-full transition-all shadow-md ${
                favorite ? 'bg-white text-emerald-600' : 'bg-emerald-800/60 text-white hover:bg-emerald-700'
              }`}
              title={favorite ? 'Remove from saved' : 'Save property'}
            >
              <Bookmark className={`w-6 h-6 ${favorite ? 'fill-emerald-600' : ''}`} />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-700/60 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-300 font-medium block uppercase tracking-wider">Asking Price</span>
              <span className="text-3xl md:text-4xl font-extrabold">{formatPrice(price)}</span>
              <span className="text-xs text-emerald-200 ml-2 font-mono">({price.toLocaleString('en-IN')} INR)</span>
            </div>

            {pricePerSqft > 0 && (
              <div className="text-right">
                <span className="text-xs text-emerald-300 font-medium block uppercase tracking-wider">Rate per Sqft</span>
                <span className="text-xl font-bold text-white">₹{pricePerSqft.toLocaleString('en-IN')}/sqft</span>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="p-6 md:p-8 space-y-8">
          
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Property Overview & Specifications
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <BedDouble className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Bedrooms</div>
                  <div className="text-base font-bold text-gray-900">{listing.bedroom || 0} BHK</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Bath className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Bathrooms</div>
                  <div className="text-base font-bold text-gray-900">{listing.bathroom || 0} Baths</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Maximize2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Carpet Area</div>
                  <div className="text-base font-bold text-gray-900">{carpet} sqft</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Building className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Floor Position</div>
                  <div className="text-base font-bold text-gray-900">Floor {listing.floor || 0} of {listing.total_floors || 0}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Compass className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Facing Direction</div>
                  <div className="text-base font-bold text-gray-900 capitalize">{listing.facing_direction || 'N/A'}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Car className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Covered Parking</div>
                  <div className="text-base font-bold text-gray-900">{listing.covered_parking || 0} Slot(s)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Maximize2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Super Built-up</div>
                  <div className="text-base font-bold text-gray-900">{listing.super_built_up_area || 'N/A'} sqft</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Posted Date</div>
                  <div className="text-base font-bold text-gray-900">
                    {listing.posted_at ? new Date(listing.posted_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Seller Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                Seller Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                {listing.description || 'No detailed description available.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                Seller Contact Information
              </h3>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Posted By: <span className="font-bold text-emerald-950 capitalize">{listing.posted_by || 'Agent'}</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {listing.posted_by_name || 'Rahul Sharma'}
                </div>
                <div className="flex items-center text-emerald-700 font-mono text-sm font-extrabold">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  {listing.posted_by_contact || '+91 200 XXX XXXX'}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Similar Listings Strip */}
      {similarListings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">
            Similar Properties in {listing.locality}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <ListingCard key={sim.listing_id} listing={sim} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
