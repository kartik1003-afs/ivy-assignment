import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchListingById, fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { Bookmark, Loader2 } from 'lucide-react';

export default function SavedListings() {
  const { user, accessToken, favorites, savedObjects } = useAuth();

  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!favorites || favorites.length === 0) {
        setSavedItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const items = [];
        const missingIds = [];

        // Check locally cached saved objects first
        favorites.forEach((id) => {
          if (savedObjects && savedObjects[id]) {
            items.push(savedObjects[id]);
          } else {
            missingIds.push(id);
          }
        });

        // Fetch any missing IDs from the API individually or via search
        if (missingIds.length > 0 && accessToken) {
          const fetchedPromises = missingIds.map((id) =>
            fetchListingById(accessToken, id).catch(() => null)
          );
          const fetchedResults = await Promise.all(fetchedPromises);
          fetchedResults.forEach((res) => {
            if (res && res.listing_id) {
              items.push(res);
            }
          });

          // Fallback check on general listings if single fetch fails
          if (items.length < favorites.length) {
            const listRes = await fetchListings(accessToken, { limit: 50, offset: 0 }).catch(() => null);
            const allFetched = listRes?.results || [];
            allFetched.forEach((l) => {
              if (favorites.includes(l.listing_id) && !items.some((it) => it.listing_id === l.listing_id)) {
                items.push(l);
              }
            });
          }
        }

        setSavedItems(items);
      } catch (err) {
        console.error('Error loading saved items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [accessToken, favorites, savedObjects]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-6 h-6 text-emerald-600 fill-emerald-600" />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Saved Listings
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Saved properties for <span className="font-semibold text-gray-900">{user?.email}</span> ({favorites.length} saved)
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading your saved properties...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-8">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Saved Properties Yet</h3>
          <p className="text-xs text-gray-500">
            Click the bookmark icon on any property card to save it to your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <ListingCard key={item.listing_id || item.id} listing={item} />
          ))}
        </div>
      )}

    </div>
  );
}
