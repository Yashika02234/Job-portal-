import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  Home,
  LogOut,
  PlusCircle,
  User,
  Users
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { admin } = useSelector(state => state.auth);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/analytics',
    },
    {
      title: 'Companies',
      icon: <Building2 className="h-5 w-5" />,
      path: '/admin/companies',
    },
    {
      title: 'Add Company',
      icon: <PlusCircle className="h-5 w-5" />,
      path: '/admin/companies/create',
    },
    {
      title: 'Jobs',
      icon: <Briefcase className="h-5 w-5" />,
      path: '/admin/jobs',
    },
    {
      title: 'Post Job',
      icon: <FileText className="h-5 w-5" />,
      path: '/admin/jobs/create',
    },
    {
      title: 'All Applicants',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/all-applicants',
    },
    {
      title: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/',
    },
  ];

  const logoutHandler = () => {
    // Implement logout functionality or dispatch action here
    console.log('Logout clicked');
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen overflow-y-auto flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <Link to="/admin/analytics" className="flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold">
            J
          </div>
          <h1 className="text-white text-xl font-bold ml-2">JobPortal</h1>
          <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded ml-2">
            Admin
          </span>
        </Link>
      </div>
      
      <div className="p-5 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-5 border-t border-slate-800">
        <div className="flex items-center mb-5">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{admin?.name || 'Admin User'}</p>
            <p className="text-gray-500 text-sm">{admin?.email || 'admin@example.com'}</p>
          </div>
        </div>
        
        <button
          onClick={logoutHandler}
          className="w-full flex items-center px-3 py-2 rounded-md text-red-400 hover:bg-red-600/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 