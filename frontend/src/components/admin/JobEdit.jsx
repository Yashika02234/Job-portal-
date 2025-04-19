import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, Building, MapPin, DollarSign, Clock, 
  GraduationCap, BookOpen, Check, Save, ChevronLeft,
  AlertCircle, Loader2, Users, ArrowLeft, Sparkles,
  UserRound
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { JOB_API_END_POINT } from '@/utils/constant';
import Footer from '../shared/Footer';
import { setAllAdminJobs } from '@/redux/jobSlice';

const jobTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
];

const experienceOptions = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5+ years)' }
];

const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-green-400' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-400' }
];

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

const JobEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { allAdminJobs } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [job, setJob] = useState(null);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 1,
        companyId: "",
        status: "active"
    });
    
    // Find the job from the store or fetch it if not available
    useEffect(() => {
        const fetchJob = async () => {
            setInitialLoading(true);
            try {
                // First try to get the job from the store
                const foundJob = allAdminJobs?.find(job => job?._id === id);
                
                if (foundJob) {
                    setJob(foundJob);
                    
                    // Convert any non-active status to 'rejected' for compatibility
                    let jobStatus = foundJob.status || "active";
                    if (jobStatus !== 'active') {
                        jobStatus = 'rejected';
                    }
                    
                    setInput({
                        title: foundJob.title || "",
                        description: foundJob.description || "",
                        requirements: foundJob.requirements || "",
                        salary: foundJob.salary || "",
                        location: foundJob.location || "",
                        jobType: foundJob.jobType || "",
                        experience: foundJob.experience || "",
                        position: foundJob.position || 1,
                        companyId: foundJob.company?._id || "",
                        status: jobStatus
                    });
                } else {
                    // If not in store, fetch from API
                    const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
                    if (res.data.success) {
                        setJob(res.data.job);
                        
                        // Convert any non-active status to 'rejected' for compatibility
                        let jobStatus = res.data.job.status || "active";
                        if (jobStatus !== 'active') {
                            jobStatus = 'rejected';
                        }
                        
                        setInput({
                            title: res.data.job.title || "",
                            description: res.data.job.description || "",
                            requirements: res.data.job.requirements || "",
                            salary: res.data.job.salary || "",
                            location: res.data.job.location || "",
                            jobType: res.data.job.jobType || "",
                            experience: res.data.job.experience || "",
                            position: res.data.job.position || 1,
                            companyId: res.data.job.company?._id || "",
                            status: jobStatus
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                toast.error("Failed to load job details");
            } finally {
                setInitialLoading(false);
            }
        };
        
        fetchJob();
    }, [id, allAdminJobs]);
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (name, value) => {
        setInput({ ...input, [name]: value });
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'requirements', 'salary', 'location', 'jobType', 'experience', 'companyId'];
        const emptyFields = requiredFields.filter(field => !input[field]);
        
        if (emptyFields.length > 0) {
            toast.error(`Please fill all required fields: ${emptyFields.join(', ')}`);
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(res.data.success) {
                toast.success(res.data.message || "Job updated successfully");
                
                // Fetch fresh admin jobs data to update the frontend
                try {
                    const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true});
                    if (jobsRes.data.success) {
                        // Use the setAllAdminJobs action from Redux to update the store
                        dispatch(setAllAdminJobs(jobsRes.data.jobs));
                    }
                } catch (error) {
                    console.error("Error refreshing job list:", error);
                }
                
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
            console.error("Error updating job:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectedCompany = companies?.find(company => company?._id === input.companyId);
    
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                        <h2 className="text-xl font-medium text-white">Loading job details...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 py-6 border-b border-slate-700/50">
                <div className="max-w-6xl mx-auto px-4">
                    <Link to="/admin/jobs" className="inline-flex items-center text-gray-400 hover:text-white mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Jobs
                    </Link>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Edit Job
                        <Briefcase className="h-6 w-6 text-purple-400" />
                    </h1>
                    <p className="text-gray-400 mt-1">Update your job posting details</p>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div 
                    variants={fadeInUpVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg"
                >
                    {!job && !initialLoading ? (
                        <div className="py-10 text-center">
                            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">Job Not Found</h2>
                            <p className="text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                            <Button 
                                onClick={() => navigate('/admin/jobs')}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            >
                                Return to Jobs
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={submitHandler}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <Label htmlFor="title" className="text-white mb-2 block">
                                        Job Title <span className="text-red-400">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="e.g. Senior Frontend Developer"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="company" className="text-white mb-2 block">
                                        Company <span className="text-red-400">*</span>
                                    </Label>
                                    
                                    {companies && companies.length > 0 ? (
                                        <Select 
                                            value={input.companyId}
                                            onValueChange={(value) => selectChangeHandler('companyId', value)}
                                        >
                                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500">
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem 
                                                            key={company._id} 
                                                            value={company._id}
                                                            className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
                                                        >
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 text-white text-sm">
                                            <p className="flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                Please register a company first, before posting a job
                                            </p>
                                            <Button 
                                                variant="link" 
                                                className="text-purple-400 p-0 h-auto mt-2"
                                                onClick={() => navigate('/admin/companies/create')}
                                            >
                                                Create a company now
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {selectedCompany && (
                                        <div className="mt-2 bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
                                                    {selectedCompany.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{selectedCompany.name}</p>
                                                    <p className="text-xs text-gray-400">{selectedCompany.industry || "Technology"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="md:col-span-2">
                                    <Label htmlFor="description" className="text-white mb-2 block">
                                        Description <span className="text-red-400">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 min-h-32"
                                        placeholder="Describe the job role, responsibilities, and what the candidate will be doing..."
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <Label htmlFor="requirements" className="text-white mb-2 block">
                                        Requirements <span className="text-red-400">*</span>
                                    </Label>
                                    <Textarea
                                        id="requirements"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 min-h-32"
                                        placeholder="List the required skills, qualifications, and experience for this role..."
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="salary" className="text-white mb-2 block">
                                        Salary <span className="text-red-400">*</span>
                                    </Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="salary"
                                            type="text"
                                            name="salary"
                                            value={input.salary}
                                            onChange={changeEventHandler}
                                            className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 pl-10"
                                            placeholder="e.g. $80,000 - $100,000"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="location" className="text-white mb-2 block">
                                        Location <span className="text-red-400">*</span>
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="location"
                                            type="text"
                                            name="location"
                                            value={input.location}
                                            onChange={changeEventHandler}
                                            className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 pl-10"
                                            placeholder="e.g. San Francisco, CA or Remote"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="jobType" className="text-white mb-2 block">
                                        Job Type <span className="text-red-400">*</span>
                                    </Label>
                                    <Select 
                                        value={input.jobType} 
                                        onValueChange={(value) => selectChangeHandler('jobType', value)}
                                    >
                                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500">
                                            <SelectValue placeholder="Select Job Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectGroup>
                                                {jobTypeOptions.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                        className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="experience" className="text-white mb-2 block">
                                        Experience Level <span className="text-red-400">*</span>
                                    </Label>
                                    <Select 
                                        value={input.experience}
                                        onValueChange={(value) => selectChangeHandler('experience', value)}
                                    >
                                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500">
                                            <SelectValue placeholder="Select Experience Level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectGroup>
                                                {experienceOptions.map((exp) => (
                                                    <SelectItem
                                                        key={exp.value}
                                                        value={exp.value}
                                                        className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
                                                    >
                                                        {exp.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="position" className="text-white mb-2 block">
                                        Number of Positions
                                    </Label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="position"
                                            type="number"
                                            name="position"
                                            min="1"
                                            value={input.position}
                                            onChange={changeEventHandler}
                                            className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 pl-10"
                                            placeholder="e.g. 1"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="status" className="text-white mb-2 block">
                                        Job Status
                                    </Label>
                                    <Select 
                                        value={input.status}
                                        onValueChange={(value) => selectChangeHandler('status', value)}
                                    >
                                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            <SelectGroup>
                                                {statusOptions.map((status) => (
                                                    <SelectItem
                                                        key={status.value}
                                                        value={status.value}
                                                        className={`focus:bg-purple-500/20 focus:text-white cursor-pointer ${status.color}`}
                                                    >
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            {/* Job Summary */}
                            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50 mb-6">
                                <h3 className="text-white font-semibold mb-3 flex items-center">
                                    <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                                    Job Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <SummaryItem 
                                        icon={<Briefcase className="h-4 w-4 text-purple-400" />}
                                        label="Title"
                                        value={input.title || "Not specified"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<Building className="h-4 w-4 text-indigo-400" />}
                                        label="Company"
                                        value={selectedCompany?.name || "Not selected"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<MapPin className="h-4 w-4 text-blue-400" />}
                                        label="Location"
                                        value={input.location || "Not specified"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<DollarSign className="h-4 w-4 text-green-400" />}
                                        label="Salary"
                                        value={input.salary || "Not specified"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<Clock className="h-4 w-4 text-amber-400" />}
                                        label="Type"
                                        value={jobTypeOptions.find(t => t.value === input.jobType)?.label || "Not specified"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<GraduationCap className="h-4 w-4 text-red-400" />}
                                        label="Experience"
                                        value={experienceOptions.find(e => e.value === input.experience)?.label || "Not specified"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<Users className="h-4 w-4 text-orange-400" />}
                                        label="Positions"
                                        value={input.position || "1"}
                                    />
                                    
                                    <SummaryItem 
                                        icon={<Check className="h-4 w-4 text-emerald-400" />}
                                        label="Status"
                                        value={statusOptions.find(s => s.value === input.status)?.label || "Active"}
                                        valueClass={statusOptions.find(s => s.value === input.status)?.color || "text-green-400"}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/jobs')}
                                    className="border-slate-700 text-white hover:bg-slate-800"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
            
            <Footer />
        </div>
    );
};

// Summary Item Component
const SummaryItem = ({ icon, label, value, valueClass = "text-white" }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-gray-400 text-xs">{label}:</span>
            </div>
            <p className={`font-medium ${valueClass}`}>{value}</p>
        </div>
    );
};

export default JobEdit; 