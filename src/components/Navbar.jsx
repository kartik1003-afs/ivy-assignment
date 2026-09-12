import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Key, Building2, Bookmark, BarChart3, LogOut, MapPin, UserCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout, favorites } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { label: 'Sale Listings', path: '/listings', icon: Home },
    { label: 'Rentals', path: '/rentals', icon: Key },
    { label: 'Projects', path: '/projects', icon: Building2 },
    { label: 'Saved', path: '/saved', icon: Bookmark, badge: favorites.length },
    { label: 'Insights', path: '/insights', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & City Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/listings" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                🌿
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                Ivy<span className="text-emerald-600">Homes</span>
              </span>
            </Link>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <MapPin className="w-3 h-3 mr-1" />
              Gurgaon
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Account & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              <UserCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              {user.email}
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 transition-colors shadow-xs"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden border-t border-gray-100 bg-gray-50 px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-md text-xs font-medium ${
                isActive ? 'text-emerald-700 font-bold' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
