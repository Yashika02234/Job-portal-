import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { motion } from 'framer-motion';
import { 
  Briefcase, CalendarCheck, Clock, CheckCircle, XCircle, 
  Search, Filter, RefreshCw, Building, MapPin, Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    } 
  })
};

const ApplicationStatus = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchUserApplications = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${APPLICATION_API_END_POINT}/user/applications`, { 
          withCredentials: true 
        });
        
        if (response.data.success) {
          setApplications(response.data.applications);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load your applications");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserApplications();
  }, [user]);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const jobTitleMatch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || app.status === statusFilter;
    
    return (jobTitleMatch || companyMatch) && statusMatch;
  });

  // Get stats for applications
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  // Status indicator components
  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-amber-400" />,
    accepted: <CheckCircle className="h-4 w-4 text-green-400" />,
    rejected: <XCircle className="h-4 w-4 text-red-400" />
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: "bg-amber-500/20 border-amber-500/30 text-amber-300",
      accepted: "bg-green-500/20 border-green-500/30 text-green-300",
      rejected: "bg-red-500/20 border-red-500/30 text-red-300"
    };
    return statusClasses[status] || "bg-slate-500/20 border-slate-500/30 text-slate-300";
  };

  const refreshApplications = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${APPLICATION_API_END_POINT}/user/applications`, { 
        withCredentials: true 
      });
      
      if (response.data.success) {
        setApplications(response.data.applications);
        toast.success("Applications refreshed");
      }
    } catch (error) {
      console.error("Error refreshing applications:", error);
      toast.error("Failed to refresh applications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
      <Navbar />
      
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-purple-900/80 to-indigo-900/80 py-10 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <CalendarCheck className="mr-3 h-6 w-6 text-purple-400" />
            My Applications
          </h1>
          <p className="text-gray-300 mt-2">Track and manage all your job applications</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats */}
        <motion.div 
          variants={fadeInUpVariants}
          custom={0}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatusCard 
            title="Total Applications" 
            value={stats.total} 
            icon={<Briefcase className="h-5 w-5 text-blue-400" />}
            color="from-blue-500/20 to-indigo-500/20 border-blue-500/30"
          />
          
          <StatusCard 
            title="Pending" 
            value={stats.pending} 
            icon={<Clock className="h-5 w-5 text-amber-400" />}
            color="from-amber-500/20 to-orange-500/20 border-amber-500/30"
          />
          
          <StatusCard 
            title="Accepted" 
            value={stats.accepted} 
            icon={<CheckCircle className="h-5 w-5 text-green-400" />}
            color="from-green-500/20 to-emerald-500/20 border-green-500/30"
          />
          
          <StatusCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={<XCircle className="h-5 w-5 text-red-400" />}
            color="from-red-500/20 to-rose-500/20 border-red-500/30"
          />
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          variants={fadeInUpVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-700"
                onClick={refreshApplications}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Quick filter buttons */}
          {applications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                size="sm"
                variant={statusFilter === "all" ? "default" : "outline"}
                className={statusFilter === "all" 
                  ? "bg-slate-700 hover:bg-slate-600 text-white" 
                  : "border-slate-700 text-gray-300 hover:text-white hover:bg-slate-700"}
                onClick={() => setStatusFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button 
                size="sm"
                variant={statusFilter === "pending" ? "default" : "outline"}
                className={statusFilter === "pending" 
                  ? "bg-amber-700/70 hover:bg-amber-700 text-white border-amber-500/50" 
                  : "border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"}
                onClick={() => setStatusFilter("pending")}
              >
                <Clock className="h-3 w-3 mr-1" />
                Pending ({stats.pending})
              </Button>
              <Button 
                size="sm"
                variant={statusFilter === "accepted" ? "default" : "outline"}
                className={statusFilter === "accepted" 
                  ? "bg-green-700/70 hover:bg-green-700 text-white border-green-500/50" 
                  : "border-green-500/30 text-green-300 hover:text-green-200 hover:bg-green-500/20"}
                onClick={() => setStatusFilter("accepted")}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Accepted ({stats.accepted})
              </Button>
              <Button 
                size="sm"
                variant={statusFilter === "rejected" ? "default" : "outline"}
                className={statusFilter === "rejected" 
                  ? "bg-red-700/70 hover:bg-red-700 text-white border-red-500/50" 
                  : "border-red-500/30 text-red-300 hover:text-red-200 hover:bg-red-500/20"}
                onClick={() => setStatusFilter("rejected")}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Rejected ({stats.rejected})
              </Button>
              
              {searchTerm && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="ml-auto border-slate-700 text-white hover:bg-slate-700"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Applications List */}
        <motion.div 
          variants={fadeInUpVariants}
          custom={2}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading your applications...</p>
              </div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <Table>
              <TableCaption>List of all your job applications</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id} className="hover:bg-slate-800/30">
                    <TableCell className="font-medium">{application.job?.title || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 h-6 w-6 rounded-md flex items-center justify-center text-white font-bold text-xs">
                          {application.job?.company?.logo ? (
                            <img src={application.job.company.logo} alt="" className="h-4 w-4 object-contain" />
                          ) : (
                            application.job?.company?.name?.charAt(0) || "C"
                          )}
                        </div>
                        <span>{application.job?.company?.name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(application.status)}`}>
                        {statusIcons[application.status]}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-blue-600/30 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400"
                        onClick={() => navigate(`/description/${application.job?._id}`)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View Job
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-10 max-w-lg w-full text-center">
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-5 rounded-full inline-flex items-center justify-center mb-6">
                  <Briefcase className="h-16 w-16 text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "No matching applications" 
                    : "Your application journey starts here"}
                </h3>
                
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "We couldn't find any applications matching your current filters. Try adjusting your search criteria or view all applications." 
                    : "You haven't applied to any jobs yet. Browse our latest opportunities and take the first step towards your dream career."}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {applications.length > 0 && (statusFilter !== "all" || searchTerm) && (
                    <Button 
                      onClick={() => {
                        setStatusFilter("all");
                        setSearchTerm("");
                      }}
                      className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => navigate("/jobs")}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </div>
                
                {!searchTerm && statusFilter === "all" && (
                  <div className="mt-10 pt-8 border-t border-slate-700/50">
                    <h4 className="text-white font-medium mb-3">How applications work:</h4>
                    <ul className="text-left text-gray-400 space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-500/20 text-purple-400 p-1 rounded-full mt-0.5">
                          <Clock className="h-4 w-4" />
                        </span>
                        <span>Applied jobs show as <span className="text-amber-300 font-medium">Pending</span> until reviewed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-500/20 text-green-400 p-1 rounded-full mt-0.5">
                          <CheckCircle className="h-4 w-4" />
                        </span>
                        <span>Selected candidates are marked as <span className="text-green-300 font-medium">Accepted</span></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-500/20 text-red-400 p-1 rounded-full mt-0.5">
                          <XCircle className="h-4 w-4" />
                        </span>
                        <span>Non-selected applications are marked as <span className="text-red-300 font-medium">Rejected</span></span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

// Status Card Component
const StatusCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-r ${color} backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationStatus; 