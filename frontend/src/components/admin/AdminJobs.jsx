import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, Briefcase, Users, CheckCircle, XCircle,
  BarChart3, Calendar, Clock, Sparkles, Lightbulb, LineChart
} from 'lucide-react'
import { Badge } from '../ui/badge'

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

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { allAdminJobs } = useSelector(store => store.job);
  
  // Stats for job dashboard
  const jobStats = [
    { 
      title: "Total Jobs", 
      value: allAdminJobs?.length || 0, 
      icon: <Briefcase className="h-5 w-5 text-blue-400" />,
      color: "from-blue-500/20 to-purple-500/20 border-blue-500/30"
    },
    { 
      title: "Active Jobs", 
      value: allAdminJobs?.filter(job => job.status === 'active' || !job.status).length || 0, 
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
    },
    { 
      title: "Closed Jobs", 
      value: allAdminJobs?.filter(job => job.status === 'closed').length || 0, 
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      color: "from-red-500/20 to-rose-500/20 border-red-500/30"
    },
    { 
      title: "Total Applicants", 
      value: allAdminJobs?.reduce((sum, job) => sum + (job.applicants?.length || 0), 0), 
      icon: <Users className="h-5 w-5 text-purple-400" />,
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30"
    }
  ];

  useEffect(() => {
    dispatch(setSearchJobByText(input));
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
        className="w-full h-64 bg-gradient-to-r from-blue-900/80 to-purple-900/80 relative overflow-hidden"
        style={{ 
          backgroundImage: "url('/images/jobs-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>
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
            <p className="text-xl text-gray-300 mt-2">Manage your job listings and applicants</p>
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
          {jobStats.map((stat, index) => (
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
        
        {/* Job Management Section */}
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
                <Briefcase className="mr-2 h-5 w-5 text-blue-400" />
                Job Management
              </h2>
              <p className="text-gray-400 mt-1">Create and manage your job listings</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search jobs..."
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => navigate("/admin/jobs/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Post New Job
              </Button>
            </div>
          </div>
          
          {/* Jobs Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/50">
              <AdminJobsTable />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Quick Tips */}
        <motion.div 
          variants={fadeInUpVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-white flex items-center mb-4">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
              Recruiter Tips
            </h2>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-slate-800/50 p-1 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Write Clear Job Descriptions</p>
                  <p className="text-gray-400 text-sm">Be specific about responsibilities, requirements, and benefits.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="bg-slate-800/50 p-1 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Use Relevant Keywords</p>
                  <p className="text-gray-400 text-sm">Include industry-specific terms to attract qualified candidates.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="bg-slate-800/50 p-1 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Respond to Applicants Quickly</p>
                  <p className="text-gray-400 text-sm">Regular communication improves candidate experience.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-white flex items-center mb-4">
              <LineChart className="mr-2 h-5 w-5 text-blue-400" />
              Hiring Activity
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white">Applications this month</p>
                <Badge className="bg-blue-500/20 border-blue-500/30 text-white">+32%</Badge>
              </div>
              
              <div className="h-3 bg-slate-800/70 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
              
              <div className="pt-3 border-t border-slate-700/50 mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-white text-sm">Recent Activity</span>
                  </div>
                  <span className="text-gray-400 text-xs">Last 7 days</span>
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">New applications</span>
                    <span className="text-white font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Interviews scheduled</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Jobs posted</span>
                    <span className="text-white font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminJobs