import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Rentals from './pages/Rentals';
import Projects from './pages/Projects';
import SavedListings from './pages/SavedListings';
import Insights from './pages/Insights';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/listings" replace /> : <Login />} />
          
          <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
          <Route path="/listings/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
          <Route path="/rentals" element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedListings /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to={user ? "/listings" : "/login"} replace />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          Ivy Homes Software Engineering Assignment • Gurgaon City • Candidate: Kartik Kumar
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
