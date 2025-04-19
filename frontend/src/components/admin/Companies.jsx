import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Building, Search, Plus, Briefcase, Users, 
    BarChart3, Filter, Calendar, Check, X as XIcon, 
    Gift, Sparkles, Clock, PieChart, BriefcaseBusiness,
    ChevronRight, Globe, LineChart, BookOpen, Rocket,
    Layers, ShieldCheck, TrendingUp, Trophy, Edit,
    Trash, CalendarRange
} from 'lucide-react'
import { Badge } from '../ui/badge'
import Footer from '../shared/Footer'
import { toast } from 'sonner'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

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

const Companies = () => {
    useGetAllCompanies();
    useGetAllAdminJobs();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { companies } = useSelector(state => state.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const [scrollY, setScrollY] = useState(0);
    
    // Scroll effect for parallax
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Stats for company dashboard
    const stats = [
        { 
            title: "Total Companies", 
            value: companies?.length || 0, 
            icon: <Building className="h-5 w-5 text-blue-400" />,
            color: "from-blue-500/20 to-purple-500/20 border-blue-500/30"
        },
        { 
            title: "Active Jobs", 
            value: allAdminJobs?.filter(job => job.status === 'active' || !job.status).length || 0, 
            icon: <Briefcase className="h-5 w-5 text-emerald-400" />,
            color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
        },
        { 
            title: "Total Applications", 
            value: allAdminJobs?.reduce((sum, job) => sum + (job.applicants?.length || 0), 0) || 0, 
            icon: <Users className="h-5 w-5 text-amber-400" />,
            color: "from-amber-500/20 to-orange-500/20 border-amber-500/30"
        },
        { 
            title: "Closed Jobs", 
            value: allAdminJobs?.filter(job => job.status === 'closed').length || 0, 
            icon: <Check className="h-5 w-5 text-purple-400" />,
            color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30"
        }
    ];

    // Featured Company cards
    const featuredCompanies = companies?.slice(0, 3) || [];

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    // Calculate time of day for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            
            {/* Header Banner */}
            <div 
                className="w-full h-64 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 relative overflow-hidden"
                style={{ 
                    backgroundImage: "url('/images/dashboard-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay'
                }}
            >
                {/* Parallax effect on background */}
                <motion.div 
                    className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"
                    style={{ y: scrollY * 0.1 }}
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                
                {/* Welcome Message */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                            {getGreeting()}, {user?.fullname || 'Administrator'}!
                            <motion.div 
                                animate={{ 
                                    rotate: [0, 10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                            </motion.div>
                        </h1>
                        <p className="text-xl text-gray-300 mt-2">Welcome to your company dashboard</p>
                    </motion.div>
                </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="max-w-6xl mx-auto px-4 relative -mt-20 z-10">
                {/* Stats Row */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`bg-gradient-to-r ${stat.color} backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded-lg">
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Company Management Section */}
                <motion.div 
                    variants={fadeInUpVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <Building className="mr-2 h-5 w-5 text-purple-400" />
                                Company Management
                            </h2>
                            <p className="text-gray-400 mt-1">Create and manage your companies</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-10 bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Search companies..."
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                            <Button 
                                onClick={() => navigate("/admin/companies/create")}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" /> New Company
                            </Button>
                        </div>
                    </div>
                    
                    {/* Recent Companies */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50">
                            <CompaniesTable />
                        </div>
                    </motion.div>
                </motion.div>
                
                {/* Featured Companies */}
                {featuredCompanies.length > 0 && (
                    <motion.div 
                        variants={fadeInUpVariants}
                        custom={0.5}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
                            <Trophy className="mr-2 h-5 w-5 text-amber-400" />
                            Featured Companies
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featuredCompanies.map((company, index) => (
                                <motion.div
                                    key={company._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-lg"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-12 w-12 rounded-md flex items-center justify-center text-white font-bold text-xl">
                                            {company.name?.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-white font-semibold">{company.name}</h3>
                                            <p className="text-gray-400 text-sm">{company.industry || "Technology"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <div className="text-gray-400">{company.jobCount || 0} jobs</div>
                                        <Badge className="bg-green-500/20 border-green-500/30 text-white">
                                            Active
                                        </Badge>
                                    </div>
                                    
                                    <Button
                                        onClick={() => navigate(`/admin/companies/details/${company._id}`)}
                                        variant="ghost"
                                        className="w-full mt-4 border border-white/10 text-white hover:bg-white/10 flex justify-between items-center"
                                    >
                                        View Details
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
                
                {/* Recruitment Insights & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Recruitment Insights */}
                    <motion.div 
                        variants={fadeInUpVariants}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-white flex items-center mb-6">
                            <LineChart className="mr-2 h-5 w-5 text-blue-400" />
                            Recruitment Insights
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                <h3 className="text-white font-medium mb-2 flex items-center">
                                    <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                                    Application Trends
                                </h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">This Month</span>
                                    <Badge className="bg-emerald-500/20 border-emerald-500/30 text-white">+24%</Badge>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full mb-4">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Previous: 162</span>
                                    <span className="text-white">Current: 201</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                <h3 className="text-white font-medium mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-purple-400" />
                                    Hiring Progress
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400">Applications</span>
                                            <span className="text-white">487</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                                className="h-full bg-purple-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400">Interviews</span>
                                            <span className="text-white">124</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '55%' }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400">Offers</span>
                                            <span className="text-white">42</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '25%' }}
                                                transition={{ duration: 1, delay: 0.7 }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-white font-medium mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg">
                                <div className="bg-indigo-500/20 p-1.5 rounded-full">
                                    <Briefcase className="h-4 w-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm">New job posted: <span className="font-medium">Frontend Developer</span></p>
                                    <p className="text-gray-400 text-xs">2 hours ago</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg">
                                <div className="bg-emerald-500/20 p-1.5 rounded-full">
                                    <Users className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm"><span className="font-medium">12 new applications</span> received</p>
                                    <p className="text-gray-400 text-xs">Yesterday</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg">
                                <div className="bg-amber-500/20 p-1.5 rounded-full">
                                    <Building className="h-4 w-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm">New company added: <span className="font-medium">TechCorp Inc.</span></p>
                                    <p className="text-gray-400 text-xs">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Quick Actions */}
                    <motion.div 
                        variants={fadeInUpVariants}
                        custom={1.2}
                        initial="hidden"
                        animate="visible"
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
                            <Gift className="mr-2 h-5 w-5 text-purple-400" />
                            Quick Actions
                        </h2>
                        
                        <div className="space-y-3 mt-4">
                            <QuickActionCard 
                                title="Post a New Job"
                                description="Create a new job listing for your company"
                                icon={<Briefcase className="h-5 w-5 text-purple-400" />}
                                onClick={() => navigate("/admin/jobs/create")}
                            />
                            
                            <QuickActionCard 
                                title="Manage Jobs"
                                description="View and manage your posted job listings"
                                icon={<Filter className="h-5 w-5 text-blue-400" />}
                                onClick={() => navigate("/admin/jobs")}
                            />
                            
                            <QuickActionCard 
                                title="Edit Company"
                                description="Update details of your existing companies"
                                icon={<Edit className="h-5 w-5 text-emerald-400" />}
                                onClick={() => navigate("/admin/companies/manage")}
                            />
                            
                            <QuickActionCard 
                                title="Analytics Dashboard"
                                description="View detailed recruitment analytics"
                                icon={<BarChart3 className="h-5 w-5 text-amber-400" />}
                                onClick={() => navigate("/admin/analytics")}
                            />
                        </div>
                    </motion.div>
                </div>
                
                {/* Company Tips & Best Practices */}
                <motion.div 
                    variants={fadeInUpVariants}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                >
                    <h2 className="text-xl font-semibold text-white flex items-center mb-6">
                        <BookOpen className="mr-2 h-5 w-5 text-emerald-400" />
                        Company Branding Tips
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                            <div className="bg-purple-600/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                                <Globe className="h-5 w-5 text-purple-400" />
                            </div>
                            <h3 className="font-medium text-white mb-2">Showcase Your Culture</h3>
                            <p className="text-gray-400 text-sm">
                                Highlight your company culture in job descriptions. Job seekers want to know what it's like to work with you beyond just the job duties.
                            </p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                            <div className="bg-blue-600/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                                <Layers className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="font-medium text-white mb-2">Detailed Job Descriptions</h3>
                            <p className="text-gray-400 text-sm">
                                Create comprehensive job listings with clear responsibilities, requirements, and benefits to attract qualified candidates.
                            </p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                            <div className="bg-emerald-600/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                                <Rocket className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="font-medium text-white mb-2">Respond Quickly</h3>
                            <p className="text-gray-400 text-sm">
                                Prompt responses to applicants improve candidate experience and increase your chances of securing top talent.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Add Footer here */}
            <Footer />
        </div>
    )
}

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-800/50 hover:bg-slate-800/70 rounded-xl p-5 border border-slate-700/50 cursor-pointer transition-colors duration-200"
            onClick={onClick}
        >
            <div className="flex items-start">
                <div className="bg-slate-700/50 p-2 rounded-lg mr-4">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Companies