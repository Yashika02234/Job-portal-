import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { motion } from 'framer-motion';
import { 
    Users, Filter, Download, Search, ArrowLeft,
    CheckCircle, XCircle, Clock, Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Footer } from './AnalyticsDashboard';

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

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { applicants } = useSelector(store => store.application);
    const { allAdminJobs } = useSelector(store => store.job);
    
    const currentJob = allAdminJobs?.find(job => job._id === params.id);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllApplicants();
    }, [params.id, dispatch]);

    // Filter applicants based on search term and status
    const filteredApplicants = applicants?.applications?.filter(app => {
        const nameMatch = app.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || app.status === statusFilter;
        
        return (nameMatch || emailMatch) && statusMatch;
    });

    // Stats for applicants
    const stats = {
        total: applicants?.applications?.length || 0,
        pending: applicants?.applications?.filter(app => app.status === 'pending').length || 0,
        shortlisted: applicants?.applications?.filter(app => app.status === 'shortlisted').length || 0,
        rejected: applicants?.applications?.filter(app => app.status === 'rejected').length || 0,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            
            {/* Header Banner */}
            <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-8 border-b border-slate-700/50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Link to="/admin/jobs" className="inline-flex items-center text-gray-400 hover:text-white mb-2">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Jobs
                            </Link>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                View Applicants
                                <Users className="h-6 w-6 text-purple-400" />
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Reviewing applications for 
                                <span className="text-white font-medium ml-1">
                                    {currentJob?.title || "Job"}
                                </span>
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline"
                                className="border-slate-700 text-white hover:bg-slate-800"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Stats */}
                <motion.div 
                    variants={fadeInUpVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard 
                        title="Total Applicants" 
                        value={stats.total} 
                        icon={<Users className="h-4 w-4 text-blue-400" />}
                        color="from-blue-500/20 to-indigo-500/20 border-blue-500/30"
                    />
                    
                    <StatCard 
                        title="Pending Review" 
                        value={stats.pending} 
                        icon={<Clock className="h-4 w-4 text-amber-400" />}
                        color="from-amber-500/20 to-orange-500/20 border-amber-500/30"
                    />
                    
                    <StatCard 
                        title="Shortlisted" 
                        value={stats.shortlisted} 
                        icon={<CheckCircle className="h-4 w-4 text-green-400" />}
                        color="from-green-500/20 to-emerald-500/20 border-green-500/30"
                    />
                    
                    <StatCard 
                        title="Rejected" 
                        value={stats.rejected} 
                        icon={<XCircle className="h-4 w-4 text-red-400" />}
                        color="from-red-500/20 to-rose-500/20 border-red-500/30"
                    />
                </motion.div>
                
                {/* Filters and Search */}
                <motion.div
                    variants={fadeInUpVariants}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Filter className="mr-2 h-5 w-5 text-purple-400" />
                            Filter Applicants
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-10 bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Search applicants..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Job Summary */}
                    {currentJob && (
                        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 mb-6">
                            <h3 className="text-white font-medium mb-2">Job Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Position</p>
                                    <p className="text-white">{currentJob.title}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Location</p>
                                    <p className="text-white">{currentJob.location || "Remote"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Posted On</p>
                                    <p className="text-white">{new Date(currentJob.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Email Templates (Quick Actions) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800/70">
                            <Mail className="mr-2 h-4 w-4 text-blue-400" />
                            Send Interview Invites
                        </Button>
                        <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800/70">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                            Bulk Shortlist
                        </Button>
                        <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800/70">
                            <XCircle className="mr-2 h-4 w-4 text-red-400" />
                            Bulk Reject
                        </Button>
                    </div>
                    
                    {/* Table */}
                    <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="inline-block animate-spin rounded-full border-4 border-solid border-white border-r-transparent h-8 w-8 mb-3"></div>
                                <p className="text-gray-400 mt-2">Loading applicants...</p>
                            </div>
                        ) : filteredApplicants && filteredApplicants.length > 0 ? (
                            <ApplicantsTable applicants={filteredApplicants} />
                        ) : (
                            <div className="py-20 text-center">
                                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-white text-lg font-medium">No Applicants Found</h3>
                                <p className="text-gray-400 mt-2">
                                    {searchTerm || statusFilter !== "all" 
                                        ? "No applicants match your filters. Try different search terms."
                                        : "There are no applicants for this job yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-gradient-to-r ${color} backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-400 text-xs">{title}</p>
                    <p className="text-white text-xl font-bold mt-1">{value}</p>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-lg">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default Applicants;