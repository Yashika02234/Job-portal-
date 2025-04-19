import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Loader2, Briefcase, Building, Users, MapPin, 
    DollarSign, Clock, GraduationCap, BookOpen, 
    Check, UserRound, ChevronRight, ChevronLeft, 
    Save, Sparkles
} from 'lucide-react';
import { Badge } from '../ui/badge';

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

const PostJob = () => {
    const [searchParams] = useSearchParams();
    const preSelectedCompanyId = searchParams.get('company');
    
    const [currentStep, setCurrentStep] = useState(1);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 1,
        companyId: preSelectedCompanyId || ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    
    useEffect(() => {
        // If a company ID was provided in the URL, pre-select it
        if (preSelectedCompanyId) {
            setInput(prev => ({...prev, companyId: preSelectedCompanyId}));
        }
    }, [preSelectedCompanyId]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value.toLowerCase());
        if (selectedCompany) {
            setInput({...input, companyId: selectedCompany._id});
        }
    };
    
    const jobTypeChangeHandler = (value) => {
        setInput({...input, jobType: value});
    };
    
    const experienceChangeHandler = (value) => {
        setInput({...input, experience: value});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Input validation
        if (!input.title || !input.companyId) {
            toast.error("Please fill all required fields");
            return;
        }
        
        // Check if selected company is active
        const selectedCompany = companies.find(company => company._id === input.companyId);
        if (selectedCompany && selectedCompany.isActive === false) {
            toast.error("Cannot post job for inactive company. Please activate the company first.");
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    
    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };
    
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };
    
    const isFormValid = () => {
        if (currentStep === 1) {
            return input.title && input.companyId;
        } else if (currentStep === 2) {
            return input.description && input.requirements;
        } else if (currentStep === 3) {
            return input.salary && input.location && input.jobType && input.experience;
        }
        return true;
    };
    
    const selectedCompany = companies.find(company => company._id === input.companyId);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        Post a New Job
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
                            className="ml-2"
                        >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                    </h1>
                    <p className="text-gray-400 mt-2">Create a new job posting to attract the best talent</p>
                </motion.div>
                
                {/* Progress Steps */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between max-w-3xl mx-auto mb-8">
                        <StepIndicator 
                            number={1} 
                            title="Basic Info" 
                            isActive={currentStep === 1} 
                            isCompleted={currentStep > 1}
                            icon={<Briefcase className="h-5 w-5" />}
                        />
                        
                        <div className="flex-1 h-1 bg-slate-700 mx-4">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: currentStep > 1 ? "100%" : "0%" }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            />
                        </div>
                        
                        <StepIndicator 
                            number={2} 
                            title="Description" 
                            isActive={currentStep === 2} 
                            isCompleted={currentStep > 2}
                            icon={<BookOpen className="h-5 w-5" />}
                        />
                        
                        <div className="flex-1 h-1 bg-slate-700 mx-4">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: currentStep > 2 ? "100%" : "0%" }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            />
                        </div>
                        
                        <StepIndicator 
                            number={3} 
                            title="Job Details" 
                            isActive={currentStep === 3} 
                            isCompleted={currentStep > 3}
                            icon={<GraduationCap className="h-5 w-5" />}
                        />
                    </div>
                </motion.div>
                
                <motion.div 
                    variants={fadeInUpVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg"
                >
                    <form onSubmit={submitHandler}>
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <Briefcase className="mr-2 h-5 w-5 text-purple-400" />
                                    Basic Information
                                </h2>
                                
                                <div className="space-y-6">
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
                                        
                                        {companies.length > 0 ? (
                                            <Select 
                                                onValueChange={selectChangeHandler} 
                                                defaultValue={selectedCompany?.name?.toLowerCase()}
                                            >
                                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500">
                                                    <SelectValue placeholder="Select a Company" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                    {companies.map((company) => (
                                                        <SelectItem 
                                                            key={company._id} 
                                                            value={company.name.toLowerCase()}
                                                            disabled={company.isActive === false}
                                                            className={company.isActive === false ? "opacity-50 cursor-not-allowed" : ""}
                                                        >
                                                            {company.name} {company.isActive === false && "(Inactive)"}
                                                        </SelectItem>
                                                    ))}
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
                                    </div>
                                    
                                    {selectedCompany && (
                                        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                                            <h3 className="text-white font-medium mb-2">Selected Company</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold">
                                                    {selectedCompany.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white">{selectedCompany.name}</p>
                                                    <p className="text-gray-400 text-xs">{selectedCompany?.industry || "Technology"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Step 2: Description */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                                    Job Description
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
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
                                    
                                    <div>
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
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Step 3: Job Details */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <GraduationCap className="mr-2 h-5 w-5 text-purple-400" />
                                    Job Details
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <Select onValueChange={jobTypeChangeHandler}>
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
                                        <Select onValueChange={experienceChangeHandler}>
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
                                </div>
                                
                                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <h3 className="text-white font-medium mb-3">Job Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Title:</span>
                                            <span className="text-white">{input.title || 'Not specified'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Company:</span>
                                            <span className="text-white">{selectedCompany?.name || 'Not specified'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Location:</span>
                                            <span className="text-white">{input.location || 'Not specified'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Salary:</span>
                                            <span className="text-white">{input.salary || 'Not specified'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Type:</span>
                                            <span className="text-white">
                                                {jobTypeOptions.find(t => t.value === input.jobType)?.label || 'Not specified'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4 text-purple-400" />
                                            <span className="text-gray-400">Experience:</span>
                                            <span className="text-white">
                                                {experienceOptions.find(e => e.value === input.experience)?.label || 'Not specified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <div className="mt-8 flex justify-between">
                            {currentStep > 1 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="border-slate-700 text-white hover:bg-slate-800"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="border-slate-700 text-white hover:bg-slate-800"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            )}
                            
                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isFormValid()}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading || !isFormValid() || companies.length === 0}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Posting Job...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Post Job
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

// Step indicator component
const StepIndicator = ({ number, title, isActive, isCompleted, icon }) => {
    return (
        <div className="flex flex-col items-center">
            <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                        : isCompleted 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-slate-800/50 text-gray-400 border border-slate-700'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatType: 'reverse' }}
            >
                {isCompleted ? <Check className="h-5 w-5" /> : icon || <span>{number}</span>}
            </motion.div>
            <span className={`text-sm ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
                {title}
            </span>
        </div>
    );
};

export default PostJob;