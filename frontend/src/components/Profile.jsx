import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { 
  Mail, Pen, Briefcase, Download, ExternalLink, 
  Calendar, MapPin, GraduationCap, Building, Award,
  User, Phone, Sparkles, ChevronRight, Clock, X, Plus
} from 'lucide-react';
import { Badge } from './ui/badge';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useSelector(store => store.auth);
    const [scrollY, setScrollY] = useState(0);
    const dispatch = useDispatch();
    
    // Loading states
    const [loadingExp, setLoadingExp] = useState(false);
    const [loadingEdu, setLoadingEdu] = useState(false);
    const [loadingCert, setLoadingCert] = useState(false);
    
    // States for experience editing
    const [isEditingExp, setIsEditingExp] = useState(false);
    const [isEditingEdu, setIsEditingEdu] = useState(false);
    const [isEditingCert, setIsEditingCert] = useState(false);
    
    // Editable experience data
    const [workExperience, setWorkExperience] = useState(user?.profile?.experience || [
        {
            company: "TechCorp Inc.",
            position: "Frontend Developer",
            duration: "2019 - 2021",
            description: "Led development of user interfaces for client projects using React and TypeScript."
        },
        {
            company: "Digital Innovators",
            position: "Junior Developer",
            duration: "2017 - 2019",
            description: "Worked on responsive web applications and collaborated with design team."
        }
    ]);

    const [education, setEducation] = useState(user?.profile?.education || [
        {
            institution: "Tech University",
            degree: "Bachelor of Science in Computer Science",
            duration: "2013 - 2017",
            description: "Focus on web technologies and software engineering principles."
        }
    ]);

    const [certifications, setCertifications] = useState(user?.profile?.certifications || [
        "Advanced React Development",
        "UI/UX Design Fundamentals",
        "Cloud Architecture Basics"
    ]);
    
    // New experience states
    const [newExp, setNewExp] = useState({
        company: "",
        position: "",
        duration: "",
        description: ""
    });
    
    // New education state
    const [newEdu, setNewEdu] = useState({
        institution: "",
        degree: "",
        duration: "",
        description: ""
    });
    
    // New certification state
    const [newCert, setNewCert] = useState("");

    // Save to backend functions
    const saveExperienceToBackend = async () => {
        try {
            setLoadingExp(true);
            const response = await axios.post(
                `${USER_API_END_POINT}/profile/experience/update`,
                { experience: workExperience },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                toast.success('Work experience updated successfully');
            }
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error(error.response?.data?.message || 'Failed to update experience');
        } finally {
            setLoadingExp(false);
        }
    };
    
    const saveEducationToBackend = async () => {
        try {
            setLoadingEdu(true);
            const response = await axios.post(
                `${USER_API_END_POINT}/profile/education/update`,
                { education },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                toast.success('Education updated successfully');
            }
        } catch (error) {
            console.error('Error updating education:', error);
            toast.error(error.response?.data?.message || 'Failed to update education');
        } finally {
            setLoadingEdu(false);
        }
    };
    
    const saveCertificationsToBackend = async () => {
        try {
            setLoadingCert(true);
            const response = await axios.post(
                `${USER_API_END_POINT}/profile/certifications/update`,
                { certifications },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                toast.success('Certifications updated successfully');
            }
        } catch (error) {
            console.error('Error updating certifications:', error);
            toast.error(error.response?.data?.message || 'Failed to update certifications');
        } finally {
            setLoadingCert(false);
        }
    };

    // Scroll effect for parallax
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle changes for new experience
    const handleExpChange = (e) => {
        setNewExp({
            ...newExp,
            [e.target.name]: e.target.value
        });
    };
    
    // Handle changes for new education
    const handleEduChange = (e) => {
        setNewEdu({
            ...newEdu,
            [e.target.name]: e.target.value
        });
    };
    
    // Add new experience
    const addExperience = () => {
        if (newExp.company && newExp.position) {
            const updatedExperience = [...workExperience, newExp];
            setWorkExperience(updatedExperience);
            setNewExp({
                company: "",
                position: "",
                duration: "",
                description: ""
            });
            
            // Save to backend
            saveExperienceToBackend();
        }
    };
    
    // Add new education
    const addEducation = () => {
        if (newEdu.institution && newEdu.degree) {
            const updatedEducation = [...education, newEdu];
            setEducation(updatedEducation);
            setNewEdu({
                institution: "",
                degree: "",
                duration: "",
                description: ""
            });
            
            // Save to backend
            saveEducationToBackend();
        }
    };
    
    // Add new certification
    const addCertification = () => {
        if (newCert.trim()) {
            const updatedCertifications = [...certifications, newCert];
            setCertifications(updatedCertifications);
            setNewCert("");
            
            // Save to backend
            saveCertificationsToBackend();
        }
    };
    
    // Remove experience
    const removeExperience = (index) => {
        const updatedExp = [...workExperience];
        updatedExp.splice(index, 1);
        setWorkExperience(updatedExp);
        
        // Save to backend
        saveExperienceToBackend();
    };
    
    // Remove education
    const removeEducation = (index) => {
        const updatedEdu = [...education];
        updatedEdu.splice(index, 1);
        setEducation(updatedEdu);
        
        // Save to backend
        saveEducationToBackend();
    };
    
    // Remove certification
    const removeCertification = (index) => {
        const updatedCert = [...certifications];
        updatedCert.splice(index, 1);
        setCertifications(updatedCert);
        
        // Save to backend
        saveCertificationsToBackend();
    };

    // Handle editing mode toggling
    const toggleEditingExp = () => {
        if (isEditingExp) {
            // If turning off editing mode, save the changes
            saveExperienceToBackend();
        }
        setIsEditingExp(!isEditingExp);
    };
    
    const toggleEditingEdu = () => {
        if (isEditingEdu) {
            // If turning off editing mode, save the changes
            saveEducationToBackend();
        }
        setIsEditingEdu(!isEditingEdu);
    };
    
    const toggleEditingCert = () => {
        if (isEditingCert) {
            // If turning off editing mode, save the changes
            saveCertificationsToBackend();
        }
        setIsEditingCert(!isEditingCert);
    };

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

    const tabVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: 10, transition: { duration: 0.3 } }
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'profile':
                return (
                    <motion.div 
                        key="profile"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-8"
                    >
                        {/* About Me Section */}
                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={0}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                                <User className="mr-2 h-5 w-5 text-purple-400" />
                                About Me
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {user?.profile?.bio || 'No bio available. Update your profile to add a bio.'}
                            </p>
                        </motion.div>
                        
                        {/* Skills Section */}
                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={1}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                                <Award className="mr-2 h-5 w-5 text-purple-400" />
                                Skills & Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.skills?.length ? user?.profile?.skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        whileHover={{ scale: 1.05, y: -3 }}
                                    >
                                        <Badge className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-white hover:from-purple-500/30 hover:to-indigo-500/30 px-3 py-1.5 text-sm rounded-full">
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                )) : (
                                    <p className="text-gray-400">No skills added yet. Update your profile to add skills.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={2}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                                <Phone className="mr-2 h-5 w-5 text-purple-400" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="bg-slate-800/50 p-2 rounded-full">
                                        <Mail className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <span>{user?.email || 'No email available'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="bg-slate-800/50 p-2 rounded-full">
                                        <Phone className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <span>{user?.phoneNumber || 'No contact number'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="bg-slate-800/50 p-2 rounded-full">
                                        <MapPin className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <span>{user?.profile?.location || 'Location not specified'}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Resume Section */}
                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={3}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                                <Briefcase className="mr-2 h-5 w-5 text-purple-400" />
                                Resume
                            </h3>
                            {user?.profile?.resume ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-slate-800/50 p-4 rounded-lg text-white">
                                        <span className="block truncate">{user?.profile?.resumeOriginalName || 'Your Resume'}</span>
                                    </div>
                                    <a
                                        href={user?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                    <a
                                        href={user?.profile?.resume}
                                        download
                                        className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg transition-all duration-300"
                                    >
                                        <Download className="h-5 w-5" />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center p-6 border border-dashed border-gray-500 rounded-lg text-gray-400">
                                    <p>No resume uploaded yet</p>
                                    <Button 
                                        onClick={() => setOpen(true)} 
                                        variant="outline"
                                        className="mt-4 border-purple-500/30 text-white hover:bg-purple-500/20"
                                    >
                                        Upload Resume
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                );
            case 'experience':
                return (
                    <motion.div 
                        key="experience"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={0}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold flex items-center text-white">
                                    <Building className="mr-2 h-5 w-5 text-purple-400" />
                                    Work Experience
                                </h3>
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleEditingExp}
                                    className="border-purple-500/30 text-white hover:bg-purple-500/20"
                                    disabled={loadingExp}
                                >
                                    {loadingExp ? (
                                        <>
                                            <span className="animate-spin mr-2">⟳</span>
                                            Saving...
                                        </>
                                    ) : isEditingExp ? "Done" : "Edit"}
                                </Button>
                            </div>
                            
                            {workExperience.length > 0 ? (
                                <div className="space-y-6 mb-8">
                                    {workExperience.map((exp, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                            className="relative pl-8 pb-6 border-l border-purple-500/30 last:border-0 last:pb-0 group"
                                        >
                                            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                            <h4 className="text-lg font-medium text-white">{exp.position}</h4>
                                            <div className="flex items-center text-sm text-gray-300 mb-2">
                                                <Building className="mr-2 h-4 w-4 text-purple-400" />
                                                {exp.company}
                                                <span className="mx-2">•</span>
                                                <Clock className="mr-1 h-4 w-4 text-purple-400" />
                                                {exp.duration}
                                            </div>
                                            <p className="text-gray-400">{exp.description}</p>
                                            
                                            {isEditingExp && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-0 top-0 text-red-400 hover:text-red-300 transition-colors"
                                                    onClick={() => removeExperience(index)}
                                                >
                                                    <X className="h-5 w-5" />
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 border border-dashed border-gray-500 rounded-lg text-gray-400 mb-6">
                                    <p>No work experience added yet</p>
                                </div>
                            )}
                            
                            {isEditingExp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20 space-y-4"
                                >
                                    <h4 className="text-white font-medium">Add New Experience</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="position" className="text-white mb-2 block text-sm">Position</Label>
                                            <Input
                                                id="position"
                                                name="position"
                                                value={newExp.position}
                                                onChange={handleExpChange}
                                                placeholder="e.g. Frontend Developer"
                                                className="bg-slate-900/50 border-slate-700 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="company" className="text-white mb-2 block text-sm">Company</Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={newExp.company}
                                                onChange={handleExpChange}
                                                placeholder="e.g. Tech Company Inc."
                                                className="bg-slate-900/50 border-slate-700 text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="duration" className="text-white mb-2 block text-sm">Duration</Label>
                                        <Input
                                            id="duration"
                                            name="duration"
                                            value={newExp.duration}
                                            onChange={handleExpChange}
                                            placeholder="e.g. 2019 - 2021"
                                            className="bg-slate-900/50 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description" className="text-white mb-2 block text-sm">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={newExp.description}
                                            onChange={handleExpChange}
                                            placeholder="Describe your responsibilities and achievements"
                                            className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
                                        />
                                    </div>
                                    <Button 
                                        type="button"
                                        onClick={addExperience}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                        disabled={loadingExp}
                                    >
                                        {loadingExp ? (
                                            <>
                                                <span className="animate-spin mr-2">⟳</span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Experience
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div 
                            variants={fadeInUpVariants}
                            custom={1}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mt-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold flex items-center text-white">
                                    <GraduationCap className="mr-2 h-5 w-5 text-purple-400" />
                                    Education
                                </h3>
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleEditingEdu}
                                    className="border-purple-500/30 text-white hover:bg-purple-500/20"
                                    disabled={loadingEdu}
                                >
                                    {loadingEdu ? (
                                        <>
                                            <span className="animate-spin mr-2">⟳</span>
                                            Saving...
                                        </>
                                    ) : isEditingEdu ? "Done" : "Edit"}
                                </Button>
                            </div>
                            
                            {education.length > 0 ? (
                                <div className="space-y-6 mb-8">
                                    {education.map((edu, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.2 }}
                                            className="relative pl-8 pb-6 border-l border-purple-500/30 last:border-0 last:pb-0"
                                        >
                                            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                            <h4 className="text-lg font-medium text-white">{edu.degree}</h4>
                                            <div className="flex items-center text-sm text-gray-300 mb-2">
                                                <GraduationCap className="mr-2 h-4 w-4 text-purple-400" />
                                                {edu.institution}
                                                <span className="mx-2">•</span>
                                                <Calendar className="mr-1 h-4 w-4 text-purple-400" />
                                                {edu.duration}
                                            </div>
                                            <p className="text-gray-400">{edu.description}</p>
                                            
                                            {isEditingEdu && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-0 top-0 text-red-400 hover:text-red-300 transition-colors"
                                                    onClick={() => removeEducation(index)}
                                                >
                                                    <X className="h-5 w-5" />
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 border border-dashed border-gray-500 rounded-lg text-gray-400 mb-6">
                                    <p>No education history added yet</p>
                                </div>
                            )}
                            
                            {isEditingEdu && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20 space-y-4"
                                >
                                    <h4 className="text-white font-medium">Add New Education</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="degree" className="text-white mb-2 block text-sm">Degree</Label>
                                            <Input
                                                id="degree"
                                                name="degree"
                                                value={newEdu.degree}
                                                onChange={handleEduChange}
                                                placeholder="e.g. Bachelor of Science"
                                                className="bg-slate-900/50 border-slate-700 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="institution" className="text-white mb-2 block text-sm">Institution</Label>
                                            <Input
                                                id="institution"
                                                name="institution"
                                                value={newEdu.institution}
                                                onChange={handleEduChange}
                                                placeholder="e.g. University Name"
                                                className="bg-slate-900/50 border-slate-700 text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="eduDuration" className="text-white mb-2 block text-sm">Duration</Label>
                                        <Input
                                            id="eduDuration"
                                            name="duration"
                                            value={newEdu.duration}
                                            onChange={handleEduChange}
                                            placeholder="e.g. 2015 - 2019"
                                            className="bg-slate-900/50 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="eduDescription" className="text-white mb-2 block text-sm">Description</Label>
                                        <Textarea
                                            id="eduDescription"
                                            name="description"
                                            value={newEdu.description}
                                            onChange={handleEduChange}
                                            placeholder="Describe your studies and achievements"
                                            className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
                                        />
                                    </div>
                                    <Button 
                                        type="button"
                                        onClick={addEducation}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                        disabled={loadingEdu}
                                    >
                                        {loadingEdu ? (
                                            <>
                                                <span className="animate-spin mr-2">⟳</span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Education
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            
            {/* Header - Profile Banner */}
            <div 
                className="w-full h-64 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 relative overflow-hidden"
                style={{ 
                    backgroundImage: "url('/images/profile-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay'
                }}
            >
                {/* Parallax effect on background */}
                <motion.div 
                    className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"
                    style={{ y: scrollY * 0.2 }}
                />
                
                {/* Glowing orbs */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>
            
            {/* Profile Header Information */}
            <div className="max-w-6xl mx-auto px-4 relative -mt-24 z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8"
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="relative"
                    >
                        <Avatar className="h-36 w-36 border-4 border-slate-900 shadow-xl rounded-full overflow-hidden">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-3xl text-white">
                                {user?.fullname?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <motion.div
                            className="absolute -bottom-2 -right-2 h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setOpen(true)}
                        >
                            <Pen className="h-5 w-5 text-white" />
                        </motion.div>
                    </motion.div>
                    
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                                {user?.fullname}
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
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </motion.div>
                            </h1>
                            
                            <p className="text-xl text-gray-300 mt-1">{user?.profile?.title || 'Job Seeker'}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user?.role && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Badge className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-white px-3 py-1">
                                            {user.role}
                                        </Badge>
                                    </motion.div>
                                )}
                                {user?.profile?.available && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Badge className="bg-green-500/20 border border-green-500/30 text-white px-3 py-1">
                                            Available for hire
                                        </Badge>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-4 md:mt-0"
                    >
                        <Button 
                            onClick={() => setOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full"
                        >
                            Edit Profile
                            <Pen className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </motion.div>
                
                {/* Tab Navigation */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-8 border-b border-slate-700/50 pb-2"
                >
                    <div className="flex space-x-8">
                        <TabButton 
                            active={activeTab === 'profile'} 
                            onClick={() => setActiveTab('profile')}
                            icon={<User className="h-4 w-4 mr-2" />}
                        >
                            Profile
                        </TabButton>
                        <TabButton 
                            active={activeTab === 'experience'} 
                            onClick={() => setActiveTab('experience')}
                            icon={<Building className="h-4 w-4 mr-2" />}
                        >
                            Experience
                        </TabButton>
                    </div>
                </motion.div>
                
                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {renderTabContent()}
                </AnimatePresence>
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
};

// Tab Button Component
const TabButton = ({ children, active, onClick, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:text-white relative ${
                active ? 'text-white' : 'text-gray-400'
            }`}
        >
            {icon}
            {children}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </button>
    );
};

export default Profile;
