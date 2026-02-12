import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">MediVerse System</h1>
          <p className="text-slate-600">Management Dashboard</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/"
            className={`px-6 py-2 rounded-lg font-medium transition ${
              location.pathname === '/' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/doctors"
            className={`px-6 py-2 rounded-lg font-medium transition ${
              location.pathname === '/doctors' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Doctors Management
          </Link>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default Layout;