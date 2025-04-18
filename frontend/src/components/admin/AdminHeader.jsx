import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  UserRound, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const AdminHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { admin } = useSelector(state => state.auth);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-3 px-6 flex justify-between items-center">
      {/* Mobile menu toggle */}
      <button
        className="text-white lg:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      {/* Search bar */}
      <div className="hidden md:flex relative flex-1 max-w-md mx-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder="Search..."
          className="bg-slate-800/50 text-white border-slate-700 rounded-lg pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-xs flex items-center justify-center text-white">
              3
            </span>
          </button>
        </div>
        
        <Link to="/admin/settings" className="text-gray-400 hover:text-white hidden md:block">
          <Settings className="h-5 w-5" />
        </Link>
        
        <Link to="/admin/help" className="text-gray-400 hover:text-white hidden md:block">
          <HelpCircle className="h-5 w-5" />
        </Link>
        
        <div className="border-l border-slate-700 h-6 mx-2 hidden md:block"></div>
        
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3 hidden md:block">
            <p className="text-white font-medium text-sm">{admin?.name || 'Admin User'}</p>
            <p className="text-gray-500 text-xs">{admin?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/90 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/admin/analytics" className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold">
                  J
                </div>
                <h1 className="text-white text-xl font-bold ml-2">JobPortal</h1>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-1 mt-6">
              <Link
                to="/admin/analytics"
                className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/companies"
                className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
              >
                Companies
              </Link>
              <Link
                to="/admin/jobs"
                className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
              >
                Jobs
              </Link>
              <Link
                to="/admin/all-applicants"
                className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
              >
                Applicants
              </Link>
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader; 