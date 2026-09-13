import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, refreshToken as apiRefreshToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ivy_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('ivy_access_token') || null;
  });

  const [refreshTokenVal, setRefreshTokenVal] = useState(() => {
    return localStorage.getItem('ivy_refresh_token') || null;
  });

  const [favorites, setFavorites] = useState(() => {
    if (!user?.email) return [];
    const saved = localStorage.getItem(`ivy_favorites_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [savedObjects, setSavedObjects] = useState(() => {
    if (!user?.email) return {};
    const saved = localStorage.getItem(`ivy_saved_objects_${user.email}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Update favorites & saved objects when user changes
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`ivy_favorites_${user.email}`);
      const savedObjs = localStorage.getItem(`ivy_saved_objects_${user.email}`);
      setFavorites(saved ? JSON.parse(saved) : []);
      setSavedObjects(savedObjs ? JSON.parse(savedObjs) : {});
    } else {
      setFavorites([]);
      setSavedObjects({});
    }
  }, [user?.email]);

  const toggleFavorite = useCallback((item) => {
    const id = typeof item === 'object' && item !== null ? (item.listing_id || item.id) : item;
    if (!id) return;

    setFavorites((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((i) => i !== id);
      } else {
        updated = [...prev, id];
      }
      if (user?.email) {
        localStorage.setItem(`ivy_favorites_${user.email}`, JSON.stringify(updated));
      }
      return updated;
    });

    setSavedObjects((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else if (typeof item === 'object' && item !== null) {
        updated[id] = item;
      }
      if (user?.email) {
        localStorage.setItem(`ivy_saved_objects_${user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [user?.email]);

  const isFavorite = useCallback((id) => {
    return favorites.includes(id);
  }, [favorites]);

  const handleRefresh = useCallback(async () => {
    if (!refreshTokenVal) return null;
    try {
      const data = await apiRefreshToken(refreshTokenVal);
      if (data?.access_token) {
        setAccessToken(data.access_token);
        localStorage.setItem('ivy_access_token', data.access_token);
        return data.access_token;
      }
    } catch (err) {
      console.warn('Session refresh failed:', err);
    }
    return null;
  }, [refreshTokenVal]);

  // Set up auto-refresh timer (refresh every 12 minutes since token expires in 15 mins)
  useEffect(() => {
    if (!accessToken || !refreshTokenVal) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 12 * 60 * 1000); // 12 minutes

    return () => clearInterval(interval);
  }, [accessToken, refreshTokenVal, handleRefresh]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const u = data.user || { email };
    const token = data.access_token;
    const refToken = data.refresh_token;

    setUser(u);
    setAccessToken(token);
    setRefreshTokenVal(refToken);

    localStorage.setItem('ivy_user', JSON.stringify(u));
    localStorage.setItem('ivy_access_token', token);
    if (refToken) localStorage.setItem('ivy_refresh_token', refToken);

    const savedFavs = localStorage.getItem(`ivy_favorites_${u.email}`);
    setFavorites(savedFavs ? JSON.parse(savedFavs) : []);

    return data;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshTokenVal(null);
    setFavorites([]);

    localStorage.removeItem('ivy_user');
    localStorage.removeItem('ivy_access_token');
    localStorage.removeItem('ivy_refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        favorites,
        savedObjects,
        login,
        logout,
        toggleFavorite,
        isFavorite,
        handleRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
