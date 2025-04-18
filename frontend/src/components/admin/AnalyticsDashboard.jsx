import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { motion } from 'framer-motion';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, Users, 
  Clock, Calendar, BarChart, Award, Briefcase, MapPin,
  Filter, Download, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSelector } from 'react-redux';

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

const AnalyticsDashboard = () => {
  const { allAdminJobs } = useSelector(store => store.job);
  const { applicants } = useSelector(store => store.application);
  const [timeRange, setTimeRange] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [timeRange]);

  // Demo data for analytics
  const applicationStats = {
    totalApplications: allAdminJobs?.reduce((sum, job) => sum + (job.applicants?.length || 0), 0) || 85,
    averageApplicationsPerJob: Math.round((allAdminJobs?.reduce((sum, job) => sum + (job.applicants?.length || 0), 0) || 85) / (allAdminJobs?.length || 1)) || 12,
    conversionRate: '18%',
    topJobViews: 1240,
  };

  const sourcingStats = {
    linkedin: 45,
    company: 25,
    jobPortals: 15,
    referrals: 10,
    other: 5,
  };

  const timeToHire = {
    current: 18,
    previous: 22,
    change: '-18%',
  };

  const applicationTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [20, 35, 28, 42, 39, 54],
  };

  const heatmapData = {
    applications: {
      monday: [4, 8, 12, 6, 2],
      tuesday: [6, 10, 14, 8, 3],
      wednesday: [8, 12, 16, 10, 4],
      thursday: [7, 11, 15, 9, 3],
      friday: [5, 9, 13, 7, 2],
    }
  };

  // TOP PERFORMING JOBS
  const topJobs = allAdminJobs?.slice(0, 3).map(job => ({
    id: job._id,
    title: job.title,
    applications: job.applicants?.length || Math.floor(Math.random() * 30) + 5,
    conversionRate: `${Math.floor(Math.random() * 25) + 10}%`
  })) || [
    { id: 1, title: 'Senior Frontend Developer', applications: 28, conversionRate: '24%' },
    { id: 2, title: 'UI/UX Designer', applications: 22, conversionRate: '19%' },
    { id: 3, title: 'Product Manager', applications: 18, conversionRate: '15%' },
  ];

  // DEMOGRAPHICS
  const candidateDemographics = {
    experience: {
      entry: 35,
      mid: 45,
      senior: 20,
    },
    locations: {
      remote: 40,
      onsite: 35,
      hybrid: 25,
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
      <Navbar />
      
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-8 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                Analytics Dashboard
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </h1>
              <p className="text-gray-400 mt-1">Detailed insights and metrics for your recruitment process</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-[140px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
                onClick={refreshData}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <motion.div 
          variants={fadeInUpVariants}
          custom={0}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard 
            title="Total Applications" 
            value={applicationStats.totalApplications} 
            icon={<Users className="h-5 w-5 text-blue-400" />}
            color="from-blue-500/20 to-indigo-500/20 border-blue-500/30"
          />
          
          <MetricCard 
            title="Avg. Applications per Job" 
            value={applicationStats.averageApplicationsPerJob} 
            icon={<Briefcase className="h-5 w-5 text-green-400" />}
            color="from-green-500/20 to-emerald-500/20 border-green-500/30"
          />
          
          <MetricCard 
            title="Conversion Rate" 
            value={applicationStats.conversionRate} 
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            color="from-purple-500/20 to-fuchsia-500/20 border-purple-500/30"
          />
          
          <MetricCard 
            title="Time to Hire" 
            value={`${timeToHire.current} days`} 
            change={timeToHire.change}
            icon={<Clock className="h-5 w-5 text-orange-400" />}
            color="from-orange-500/20 to-amber-500/20 border-orange-500/30"
            isImprovement={true}
          />
        </motion.div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <motion.div 
            variants={fadeInUpVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-400" />
                Application Trends
              </h2>
              <Select defaultValue="applications">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-[140px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="applications">Applications</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="interviews">Interviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-[280px] w-full flex items-end gap-1">
              {applicationTrends.data.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-md" 
                       style={{ height: `${value * 3}px`, maxHeight: '200px' }}></div>
                  <p className="text-gray-400 text-xs mt-2">{applicationTrends.labels[i]}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUpVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                Application Sources
              </h2>
            </div>
            
            <div className="h-[280px] flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-white font-semibold">{applicationStats.totalApplications}</span>
                </div>
                {/* Donut chart segments */}
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle 
                    r="70" cx="80" cy="80" fill="transparent" 
                    stroke="#818cf8" strokeWidth="20" 
                    strokeDasharray="440" strokeDashoffset={440 * (1 - (sourcingStats.linkedin / 100))} 
                    transform="rotate(-90, 80, 80)" 
                  />
                  <circle 
                    r="70" cx="80" cy="80" fill="transparent" 
                    stroke="#a78bfa" strokeWidth="20" 
                    strokeDasharray="440" strokeDashoffset={440 * (1 - (sourcingStats.company / 100))} 
                    transform="rotate(-90, 80, 80)" 
                    style={{ transform: `rotate(${sourcingStats.linkedin * 3.6}deg)`, transformOrigin: 'center' }} 
                  />
                  <circle 
                    r="70" cx="80" cy="80" fill="transparent" 
                    stroke="#c084fc" strokeWidth="20" 
                    strokeDasharray="440" strokeDashoffset={440 * (1 - (sourcingStats.jobPortals / 100))} 
                    transform="rotate(-90, 80, 80)" 
                    style={{ transform: `rotate(${(sourcingStats.linkedin + sourcingStats.company) * 3.6}deg)`, transformOrigin: 'center' }} 
                  />
                  <circle 
                    r="70" cx="80" cy="80" fill="transparent" 
                    stroke="#e879f9" strokeWidth="20" 
                    strokeDasharray="440" strokeDashoffset={440 * (1 - (sourcingStats.referrals / 100))} 
                    transform="rotate(-90, 80, 80)" 
                    style={{ transform: `rotate(${(sourcingStats.linkedin + sourcingStats.company + sourcingStats.jobPortals) * 3.6}deg)`, transformOrigin: 'center' }} 
                  />
                  <circle 
                    r="70" cx="80" cy="80" fill="transparent" 
                    stroke="#f472b6" strokeWidth="20" 
                    strokeDasharray="440" strokeDashoffset={440 * (1 - (sourcingStats.other / 100))} 
                    transform="rotate(-90, 80, 80)" 
                    style={{ transform: `rotate(${(sourcingStats.linkedin + sourcingStats.company + sourcingStats.jobPortals + sourcingStats.referrals) * 3.6}deg)`, transformOrigin: 'center' }} 
                  />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-gray-400 text-xs">LinkedIn ({sourcingStats.linkedin}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-gray-400 text-xs">Company Site ({sourcingStats.company}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                <span className="text-gray-400 text-xs">Job Portals ({sourcingStats.jobPortals}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-gray-400 text-xs">Referrals ({sourcingStats.referrals}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-gray-400 text-xs">Other ({sourcingStats.other}%)</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Jobs */}
          <motion.div 
            variants={fadeInUpVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <Award className="h-5 w-5 text-green-400" />
              Top Performing Jobs
            </h2>
            
            <div className="space-y-4">
              {topJobs.map((job, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-400 text-sm">{job.applications} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-gray-400 text-sm">{job.conversionRate} conversion</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded-lg">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Candidate Demographics */}
          <motion.div 
            variants={fadeInUpVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-blue-400" />
              Candidate Demographics
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-purple-400" />
                  Experience Level
                </h3>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="h-6 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-blue-500 h-full" style={{ width: `${candidateDemographics.experience.entry}%` }}></div>
                      <div className="bg-purple-500 h-full" style={{ width: `${candidateDemographics.experience.mid}%` }}></div>
                      <div className="bg-indigo-500 h-full" style={{ width: `${candidateDemographics.experience.senior}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-400 text-xs">Entry ({candidateDemographics.experience.entry}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-gray-400 text-xs">Mid-Level ({candidateDemographics.experience.mid}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-gray-400 text-xs">Senior ({candidateDemographics.experience.senior}%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  Location Preferences
                </h3>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="h-6 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-teal-500 h-full" style={{ width: `${candidateDemographics.locations.remote}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${candidateDemographics.locations.onsite}%` }}></div>
                      <div className="bg-rose-500 h-full" style={{ width: `${candidateDemographics.locations.hybrid}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      <span className="text-gray-400 text-xs">Remote ({candidateDemographics.locations.remote}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-gray-400 text-xs">On-site ({candidateDemographics.locations.onsite}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-gray-400 text-xs">Hybrid ({candidateDemographics.locations.hybrid}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change, icon, color, isImprovement = false }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-r ${color} backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${isImprovement ? 'text-green-400' : 'text-red-400'}`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Footer Component
export const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-800 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2023 Job Portal. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnalyticsDashboard; 