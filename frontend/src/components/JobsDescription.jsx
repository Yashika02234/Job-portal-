import React, { useEffect, useState, useRef } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, CalendarClock, DollarSign, Users, Clock, Award,
  Building, Share2, Bookmark, ChevronLeft, Send, CheckCircle, AlertTriangle,
  XCircle, Info
} from 'lucide-react';
import Navbar from './shared/Navbar';

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const applyRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;
  const dispatch = useDispatch();

  const isCompanyActive = singleJob?.company?.isActive !== false;
  const isJobActive = singleJob?.status === 'active' || !singleJob?.status;
  const canApply = isCompanyActive && isJobActive;

  const scrollToApply = () => {
    if (applyRef.current) {
      applyRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const applyJobHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleSaveJob = () => {
    setSaved(!saved);
    toast.success(saved ? 'Job removed from saved items' : 'Job saved to your profile');
  }

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: singleJob?.title,
        text: `Check out this job: ${singleJob?.title} at ${singleJob?.company?.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  }

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job details");
      } finally {
        // Add slight delay to show loading animation
        setTimeout(() => setLoading(false), 800);
      }
    }
    fetchSingleJob();

    // Check if URL has #apply hash
    if (window.location.hash === '#apply') {
      setTimeout(() => scrollToApply(), 1000);
    }

  }, [jobId, dispatch, user?._id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days ago
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference/(1000*24*60*60));
  };

  const getRequirementsList = () => {
    if (!singleJob?.requirements) return [];
    return Array.isArray(singleJob.requirements) 
      ? singleJob.requirements 
      : [singleJob.requirements];
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Navbar />
        <div className="h-[80vh] flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 mb-8 text-purple-400"
          >
            <Briefcase className="w-full h-full" />
          </motion.div>
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-medium text-white"
          >
            Loading job details...
          </motion.h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <div className='max-w-5xl mx-auto px-4 py-10 pt-28'>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Jobs
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-xl"
        >
          {/* Company header */}
          {singleJob?.company && (
            <div className="relative bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10 -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-10 -ml-20 -mb-20"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="h-16 w-16 bg-white rounded-lg shadow-lg overflow-hidden">
                    <img 
                      src={singleJob.company.logo} 
                      alt={singleJob.company.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
                
                <div className="flex-1">
                  <h2 className="text-lg text-white font-medium">{singleJob.company.name}</h2>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {singleJob.location || 'India'}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSaveJob}
                    className={`p-2 rounded-full ${saved ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-purple-300' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareJob}
                    className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
          
          {/* Job title & details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{singleJob?.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm">
                  <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                    {singleJob?.company?.name}
                  </span>
                  {!isCompanyActive && (
                    <Badge className="bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Company Inactive
                    </Badge>
                  )}
                  {!isJobActive && (
                    <Badge className="bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Closed
                    </Badge>
                  )}
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {singleJob?.location || 'India'}
                  </span>
                  <span className="flex items-center">
                    <CalendarClock className="w-4 h-4 mr-1.5 text-gray-400" />
                    {daysAgoFunction(singleJob?.createdAt) === 0
                      ? 'Posted today'
                      : `Posted ${daysAgoFunction(singleJob?.createdAt)} days ago`
                    }
                  </span>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="md:self-start"
              >
                {canApply ? (
                  <Button
                    ref={applyRef}
                    onClick={applyJobHandler}
                    className={`rounded-full px-6 py-5 text-base ${
                      isApplied
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
                    }`}
                    disabled={isApplied || loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="w-5 h-5" />
                      </motion.div>
                    ) : isApplied ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> Already Applied
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-5 h-5 mr-2" /> Apply Now
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-white mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Applications Closed</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {!isCompanyActive ? 
                            "This company is currently inactive and not accepting applications. We apologize for any inconvenience." : 
                            "This job position is no longer accepting applications. The position may have been filled or the listing has expired."}
                        </p>
                        {!isCompanyActive && (
                          <p className="text-xs text-amber-300 mt-2 flex items-start">
                            <Info className="h-4 w-4 mr-1 shrink-0" />
                            <span>When a company is inactive, none of its job listings can accept applications.</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-gray-300 font-medium">Experience</h3>
                </div>
                <p className="text-white text-lg font-semibold">{singleJob?.experience || 'Not specified'} years</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-gray-300 font-medium">Salary</h3>
                </div>
                <p className="text-white text-lg font-semibold">{singleJob?.salary || 'Not disclosed'} LPA</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-gray-300 font-medium">Positions</h3>
                </div>
                <p className="text-white text-lg font-semibold">{singleJob?.position || '1'} {singleJob?.position > 1 ? 'openings' : 'opening'}</p>
              </motion.div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {singleJob?.jobType && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className="bg-gradient-to-r from-orange-400/20 to-red-400/20 text-orange-300 border-orange-400/30 rounded-full py-1.5 px-3 text-sm font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />{singleJob?.jobType}
                    </Badge>
                  </motion.div>
                )}
                
                {singleJob?.position && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className="bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-300 border-blue-400/30 rounded-full py-1.5 px-3 text-sm font-medium">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5" />{singleJob?.position} Position{singleJob?.position > 1 ? 's' : ''}
                    </Badge>
                  </motion.div>
                )}
                
                {singleJob?.applications?.length > 0 && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className="bg-gradient-to-r from-purple-400/20 to-indigo-400/20 text-purple-300 border-purple-400/30 rounded-full py-1.5 px-3 text-sm font-medium">
                      <Users className="w-3.5 h-3.5 mr-1.5" />{singleJob?.applications?.length} Applicant{singleJob?.applications?.length > 1 ? 's' : ''}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">Job Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {singleJob?.description}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  {getRequirementsList().map((req, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                      className="leading-relaxed"
                    >
                      {req}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-white/10"
              >
                <h2 className="text-xl font-bold text-white mb-4">Ready to Apply?</h2>
                <p className="text-gray-300 mb-4">
                  Join {singleJob?.company?.name} and take the next step in your career journey.
                  {!isApplied && " Submit your application now!"}
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {canApply ? (
                    <Button
                      onClick={applyJobHandler}
                      className={`w-full py-6 rounded-lg text-lg font-medium ${
                        isApplied
                          ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
                      }`}
                      disabled={isApplied || loading}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mx-auto"
                        >
                          <Clock className="w-6 h-6" />
                        </motion.div>
                      ) : isApplied ? (
                        <span className="flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 mr-2" /> Application Submitted
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="w-6 h-6 mr-2" /> Submit Application
                        </span>
                      )}
                    </Button>
                  ) : (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-white mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Applications Closed</h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {!isCompanyActive ? 
                              "This company is currently inactive and not accepting applications. We apologize for any inconvenience." : 
                              "This job position is no longer accepting applications. The position may have been filled or the listing has expired."}
                          </p>
                          {!isCompanyActive && (
                            <p className="text-xs text-amber-300 mt-2 flex items-start">
                              <Info className="h-4 w-4 mr-1 shrink-0" />
                              <span>When a company is inactive, none of its job listings can accept applications.</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {!user && (
                  <p className="text-amber-300 flex items-center mt-4 justify-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    You need to be logged in to apply
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-green-500/20 p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-300 mb-6">
                  Your application for {singleJob?.title} at {singleJob?.company?.name} has been successfully submitted.
                </p>
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full px-6 py-2"
                >
                  Great!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobDescription