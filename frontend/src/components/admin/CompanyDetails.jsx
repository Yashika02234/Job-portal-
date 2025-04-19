import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { 
  Building2, 
  Globe, 
  Mail, 
  MapPin, 
  Phone, 
  Users, 
  Briefcase, 
  Clock, 
  ChevronLeft, 
  Edit, 
  Loader2
} from 'lucide-react';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [companyJobs, setCompanyJobs] = useState([]);
  
  // Use the admin jobs hook
  useGetAllAdminJobs();
  const { allAdminJobs } = useSelector(store => store.job);
  
  // Get the count of active jobs for this company
  const getActiveJobsCount = () => {
    if (!allAdminJobs || !id) return 0;
    return allAdminJobs.filter(job => 
      job.company?._id === id && 
      (job.status === 'active' || !job.status)
    ).length;
  };
  
  // Get the count of total applicants for this company
  const getTotalApplicantsCount = () => {
    if (!allAdminJobs || !id) return 0;
    return allAdminJobs
      .filter(job => job.company?._id === id)
      .reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  };
  
  // Get the count of rejected jobs for this company
  const getRejectedJobsCount = () => {
    if (!allAdminJobs || !id) return 0;
    return allAdminJobs.filter(job => 
      job.company?._id === id && 
      job.status === 'rejected'
    ).length;
  };
  
  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        // Fetch company data
        const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          console.log("Company data:", response.data.company);
          setCompany(response.data.company);
          
          // Get company-specific jobs
          if (allAdminJobs) {
            const companySpecificJobs = allAdminJobs.filter(job => job.company?._id === id);
            setCompanyJobs(companySpecificJobs);
          }
        } else {
          toast.error("Failed to load company data");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error(error.response?.data?.message || "An error occurred while loading company data");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCompanyData();
    }
  }, [id, allAdminJobs]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Helper function to extract domain from URL
  const getDomainFromUrl = (url) => {
    if (!url) return '';
    try {
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    } catch (error) {
      return url;
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white">Loading company details...</h3>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="flex h-screen bg-slate-900 text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-4">Company not found</h3>
              <button 
                onClick={() => navigate('/admin/companies')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
              >
                Return to Companies
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-5">
          <div className="mb-6">
            <Link to="/admin/companies" className="inline-flex items-center text-blue-400 hover:text-blue-300">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Companies
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="bg-white h-16 w-16 rounded-lg flex items-center justify-center text-2xl font-bold text-indigo-600 overflow-hidden">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                  ) : (
                    company.name?.charAt(0).toUpperCase() || 'C'
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                  <p className="text-indigo-100">{company.industry || 'Industry not specified'}</p>
                </div>
                <div className="md:ml-auto flex flex-wrap gap-2">
                  <button 
                    onClick={() => navigate(`/admin/companies/edit/${company._id}`)}
                    className="inline-flex items-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 font-medium transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Company
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/jobs?company=${company._id}`)}
                    className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Jobs
                  </button>
                  <button 
                    onClick={() => navigate('/admin/jobs/create')}
                    className="inline-flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-300 font-medium transition-colors"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post Job
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="border-b border-slate-700">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-6 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'jobs'
                      ? 'border-b-2 border-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Jobs
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column - Company Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {company.description && (
                      <div className="bg-slate-700/50 rounded-lg p-5">
                        <h2 className="text-xl font-medium mb-4">About Company</h2>
                        <p className="text-gray-300 leading-relaxed">{company.description}</p>
                      </div>
                    )}
                    
                    {/* Company Stats Section */}
                    <div className="bg-slate-700/50 rounded-lg p-5">
                      <h2 className="text-xl font-medium mb-4">Company Stats</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mr-3">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Active Jobs</p>
                              <p className="text-white text-xl font-bold">{getActiveJobsCount()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mr-3">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Total Applicants</p>
                              <p className="text-white text-xl font-bold">{getTotalApplicantsCount()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-800 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Rejected Jobs</p>
                              <p className="text-white text-xl font-bold">{getRejectedJobsCount()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Jobs Section */}
                    <div className="bg-slate-700/50 rounded-lg p-5">
                      <h2 className="text-xl font-medium mb-4">Recent Jobs</h2>
                      {companyJobs && companyJobs.length > 0 ? (
                        <div className="space-y-4">
                          {companyJobs.slice(0, 3).map(job => (
                            <div key={job._id} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-750 transition-colors cursor-pointer" onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{job.title}</h3>
                                  <div className="flex items-center text-sm text-gray-400 mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{job.location || 'Remote'}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{job.jobType || 'Full-time'}</span>
                                  </div>
                                </div>
                                <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                  {job.applications?.length || 0} Applicants
                                </div>
                              </div>
                            </div>
                          ))}
                          {companyJobs.length > 3 && (
                            <button
                              onClick={() => setActiveTab('jobs')}
                              className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                            >
                              View All Jobs
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-800 p-4 rounded-lg text-center">
                          <p className="text-gray-400">No active jobs</p>
                          <button
                            onClick={() => navigate('/admin/jobs/create')}
                            className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                          >
                            Post a New Job
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right column - Contact Info */}
                  <div className="space-y-6">
                    <div className="bg-slate-700/50 rounded-lg p-5">
                      <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                      <div className="space-y-4">
                        {company.email && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Mail className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Email</p>
                              <a href={`mailto:${company.email}`} className="text-white hover:text-purple-400">{company.email}</a>
                            </div>
                          </div>
                        )}
                        
                        {company.phone && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Phone className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Phone</p>
                              <a href={`tel:${company.phone}`} className="text-white hover:text-purple-400">{company.phone}</a>
                            </div>
                          </div>
                        )}
                        
                        {company.website && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Website</p>
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 flex items-center">
                                {getDomainFromUrl(company.website)}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {company.location && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Location</p>
                              <p className="text-white">{company.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {!company.email && !company.phone && !company.website && !company.location && (
                          <p className="text-gray-400 text-center py-3">No contact information available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-5">
                      <h2 className="text-xl font-medium mb-4">Company Details</h2>
                      <div className="space-y-4">
                        {company.createdAt && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Registered On</p>
                              <p className="text-white">{formatDate(company.createdAt)}</p>
                            </div>
                          </div>
                        )}
                        
                        {company.employees && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Company Size</p>
                              <p className="text-white">{company.employees} employees</p>
                            </div>
                          </div>
                        )}
                        
                        {company.industry && (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Industry</p>
                              <p className="text-white">{company.industry}</p>
                            </div>
                          </div>
                        )}
                        
                        {!company.createdAt && !company.employees && !company.industry && (
                          <p className="text-gray-400 text-center py-3">No additional details available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-5">
                      <h2 className="text-xl font-medium mb-4">Status</h2>
                      <div className="flex items-center bg-slate-800 p-4 rounded-lg">
                        <div className={`h-3 w-3 rounded-full ${company.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <span className={company.isActive ? 'text-green-400' : 'text-red-400'}>
                          {company.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        {company.isActive 
                          ? 'This company is active and can post jobs.' 
                          : 'This company is inactive. Job postings will not be visible to applicants.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'jobs' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Jobs at {company.name}</h2>
                    <button
                      onClick={() => navigate('/admin/jobs/create')}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Post New Job
                    </button>
                  </div>
                  
                  {companyJobs && companyJobs.length > 0 ? (
                    <div className="space-y-4">
                      {companyJobs.map(job => (
                        <div key={job._id} className="bg-slate-700/50 p-5 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-lg font-medium">{job.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className="bg-slate-600/50 px-3 py-1 rounded-full text-sm flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {job.location || 'Remote'}
                                </div>
                                <div className="bg-slate-600/50 px-3 py-1 rounded-full text-sm flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {job.jobType || 'Full-time'}
                                </div>
                                <div className="bg-slate-600/50 px-3 py-1 rounded-full text-sm flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {job.applications?.length || 0} Applicants
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end">
                              <div className="text-purple-400 font-medium">
                                {job.salary ? `$${job.salary?.toLocaleString()}` : 'Salary not specified'}
                              </div>
                              <div className="text-sm text-gray-400">
                                Posted on {formatDate(job.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                              className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                              className="inline-flex items-center px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-lg text-sm text-indigo-400 transition-colors"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              View Applicants
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-700/50 p-8 rounded-lg text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Jobs Posted</h3>
                      <p className="text-gray-400 mb-6">This company hasn't posted any jobs yet.</p>
                      <button
                        onClick={() => navigate('/admin/jobs/create')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium transition-colors"
                      >
                        Post First Job
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetails; 