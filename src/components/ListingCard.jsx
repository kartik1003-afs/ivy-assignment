import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BedDouble, Bath, Maximize2, MapPin, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';

export default function ListingCard({ listing }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const favorite = isFavorite(listing.listing_id);

  const price = listing.price || 0;
  const carpet = listing.carpet_area || 0;
  const pricePerSqft = carpet > 0 && price > 0 ? Math.round(price / carpet) : 0;

  const formatPrice = (amount) => {
    if (amount <= 0) return `₹ ${amount.toLocaleString('en-IN')}`;
    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  // Detect if corrupt or fake listing
  const isCorrupt = (listing.floor > listing.total_floors) || (price <= 0) || (carpet > (listing.super_built_up_area || Infinity));
  const isFake = price > 0 && price < 30000;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      
      {/* Header Banner & Save Toggle */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
        <div className="flex-1 pr-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
              {listing.property_type || 'Apartment'}
            </span>
            {listing.is_live === false && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-200 text-gray-700">
                Inactive
              </span>
            )}
            {isCorrupt && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" /> Corrupt Record
              </span>
            )}
            {isFake && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 flex items-center">
                <Tag className="w-3 h-3 mr-1" /> Suspicious Price
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {listing.apartment_name || 'Independent Residence'}
          </h3>
          <p className="text-xs text-gray-500 flex items-center mt-0.5 capitalize">
            <MapPin className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
            {listing.locality || 'Gurgaon'}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing);
          }}
          className={`p-2 rounded-full transition-colors ${
            favorite ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title={favorite ? 'Remove from saved' : 'Save listing'}
        >
          <Bookmark className={`w-5 h-5 ${favorite ? 'fill-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Main Specs */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-extrabold text-gray-900">{formatPrice(price)}</span>
              {pricePerSqft > 0 && (
                <span className="text-xs text-gray-500 ml-2 font-medium">
                  ₹{pricePerSqft.toLocaleString('en-IN')}/sqft
                </span>
              )}
            </div>
            {listing.is_verified && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <div className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{listing.bedroom || 0} BHK</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{listing.bathroom || 0} Baths</span>
            </div>
            <div className="flex items-center">
              <Maximize2 className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{carpet} sqft</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 italic">
            "{listing.description || 'No description available.'}"
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 capitalize">
            {listing.furnishing || 'Unfurnished'} • Floor {listing.floor || 0}/{listing.total_floors || 0}
          </span>
          <Link
            to={`/listings/${listing.listing_id}`}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>

    </div>
  );
}
