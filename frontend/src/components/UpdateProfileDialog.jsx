import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Upload, X, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';

const SkillBadge = ({ skill, onRemove }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
        >
            {skill}
            <button
                type="button"
                onClick={onRemove}
                className="text-white/70 hover:text-white transition-colors flex items-center justify-center"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </motion.div>
    );
};

const UpdateProfileDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Form states
    const [fullname, setFullname] = useState(user?.fullname || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [bio, setBio] = useState(user?.profile?.bio || '');
    const [skills, setSkills] = useState(user?.profile?.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [title, setTitle] = useState(user?.profile?.title || '');
    const [location, setLocation] = useState(user?.profile?.location || '');
    const [available, setAvailable] = useState(user?.profile?.available || false);
    
    // Preview states
    const [resumePreview, setResumePreview] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    
    // Upload progress
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (open) {
            // Reset states when dialog opens
            setFullname(user?.fullname || '');
            setEmail(user?.email || '');
            setPhoneNumber(user?.phoneNumber || '');
            setBio(user?.profile?.bio || '');
            setSkills(user?.profile?.skills || []);
            setTitle(user?.profile?.title || '');
            setLocation(user?.profile?.location || '');
            setAvailable(user?.profile?.available || false);
            setNewSkill('');
            setResumeFile(null);
            setProfilePhoto(null);
            setResumePreview(null);
            setPhotoPreview(null);
            setSuccess(false);
        }
    }, [open, user]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Resume file is too large', {
                    description: 'Maximum file size is 5MB. Please select a smaller file.',
                });
                return;
            }
            setResumeFile(file);
            setResumePreview(file.name);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Profile photo is too large', {
                    description: 'Maximum file size is 2MB. Please select a smaller image.',
                });
                return;
            }
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearResume = () => {
        setResumeFile(null);
        setResumePreview(null);
    };

    const handleClearPhoto = () => {
        setProfilePhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsUploading(true);
        setUploadProgress(0);
        
        const simulateProgress = () => {
            setUploadProgress(prev => {
                if (prev < 90) {
                    return prev + Math.random() * 10;
                }
                return prev;
            });
        };
        
        // Start progress simulation
        const progressInterval = setInterval(simulateProgress, 400);
        
        try {
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('phoneNumber', phoneNumber);
            formData.append('bio', bio);
            formData.append('title', title);
            formData.append('location', location);
            formData.append('available', available);
            
            // Append skills as JSON string
            formData.append('skills', JSON.stringify(skills));
            
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }
            
            if (profilePhoto) {
                formData.append('profilePhoto', profilePhoto);
            }

            const response = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                timeout: 60000, // 60 second timeout
                maxContentLength: 10 * 1024 * 1024, // 10MB max content length
                maxBodyLength: 10 * 1024 * 1024, // 10MB max body length
            });

            clearInterval(progressInterval);
            setUploadProgress(100);
            console.log("response after update", response.data.user);
            setTimeout(() => {
                dispatch(setUser(response.data.user));
                setSuccess(true);
                setIsUploading(false);
                
                toast.success('Profile updated successfully', {
                    description: 'Your profile information has been updated',
                    action: {
                        label: 'Dismiss',
                        onClick: () => console.log('Dismissed')
                    },
                });
                
                setTimeout(() => {
                    setLoading(false);
                    setOpen(false);
                    setSuccess(false);
                }, 1000);
            }, 500);
            
        } catch (error) {
            clearInterval(progressInterval);
            setIsUploading(false);
            setLoading(false);
            console.error('Error updating profile:', error);
            console.error('Error details:', error.response?.data);
            
            // Handle timeout errors more specifically
            let errorMessage = 'Something went wrong';
            if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
                errorMessage = 'Request timed out. The server took too long to respond.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error('Failed to update profile', {
                description: errorMessage,
                action: {
                    label: 'Try Again',
                    onClick: () => handleSubmit(e)
                },
            });
        }
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.05,
                duration: 0.3
            }
        })
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[650px] bg-slate-950 border border-slate-800 text-white shadow-xl shadow-purple-900/20 p-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px]"></div>
                </div>
                
                <DialogHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 px-6 py-4 border-b border-slate-800/50">
                    <DialogTitle className="text-xl font-semibold text-white">Update Your Profile</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Customize your profile to stand out to employers
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="relative z-10">
                    <div className="grid gap-6 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                                        className="bg-green-500/20 p-3 rounded-full mb-4"
                                    >
                                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-2">Profile Updated!</h3>
                                    <p className="text-slate-400 text-center max-w-md">
                                        Your profile information has been successfully updated.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="form"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={fadeIn}
                                    className="space-y-6"
                                >
                                    {/* Profile Photo */}
                                    <motion.div 
                                        variants={inputVariants}
                                        custom={0}
                                        className="mx-auto text-center mb-4"
                                    >
                                        <div className="relative inline-block">
                                            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 mx-auto mb-2">
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                                ) : user?.profile?.profilePhoto ? (
                                                    <img src={user.profile.profilePhoto} alt="Current Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-700 to-slate-800 text-3xl text-white">
                                                        {fullname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <label htmlFor="profile-photo" className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                                                <Plus className="h-4 w-4" />
                                                <input
                                                    id="profile-photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        
                                        {photoPreview && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                type="button"
                                                onClick={handleClearPhoto}
                                                className="text-sm text-slate-400 hover:text-white mt-1"
                                            >
                                                Remove photo
                                            </motion.button>
                                        )}
                                        <p className="text-xs text-slate-500 mt-1">Recommended: Square image, 500x500px</p>
                                    </motion.div>
                                    
                                    {/* Name and Job Title */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <motion.div variants={inputVariants} custom={1}>
                                            <Label htmlFor="fullname" className="text-white mb-2 block">Full Name</Label>
                                            <Input
                                                id="fullname"
                                                className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                                placeholder="Your full name"
                                                required
                                            />
                                        </motion.div>
                                        
                                        <motion.div variants={inputVariants} custom={2}>
                                            <Label htmlFor="title" className="text-white mb-2 block">Professional Title</Label>
                                            <Input
                                                id="title"
                                                className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. Frontend Developer"
                                            />
                                        </motion.div>
                                    </div>
                                    
                                    {/* Contact Information */}
                                    <motion.div variants={inputVariants} custom={3}>
                                        <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email address"
                                            required
                                        />
                                    </motion.div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <motion.div variants={inputVariants} custom={4}>
                                            <Label htmlFor="phoneNumber" className="text-white mb-2 block">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="Your phone number"
                                            />
                                        </motion.div>
                                        
                                        <motion.div variants={inputVariants} custom={5}>
                                            <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                                            <Input
                                                id="location"
                                                className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g. San Francisco, CA"
                                            />
                                        </motion.div>
                                    </div>
                                    
                                    {/* Bio */}
                                    <motion.div variants={inputVariants} custom={6}>
                                        <Label htmlFor="bio" className="text-white mb-2 block">
                                            Bio
                                            <span className="text-slate-500 text-xs ml-2">
                                                (Describe yourself in a few sentences)
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500 min-h-24"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell employers a bit about yourself..."
                                        />
                                    </motion.div>
                                    
                                    {/* Skills */}
                                    <motion.div variants={inputVariants} custom={7}>
                                        <Label htmlFor="skills" className="text-white mb-2 block">
                                            Skills
                                            <span className="text-slate-500 text-xs ml-2">
                                                (Press Enter to add)
                                            </span>
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="skills"
                                                className="bg-slate-900/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Add a skill (e.g. React, JavaScript)"
                                            />
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={handleAddSkill}
                                                className="border-purple-500/30 text-white hover:bg-purple-500/20"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <AnimatePresence>
                                                {skills.map((skill, index) => (
                                                    <SkillBadge 
                                                        key={skill + index}
                                                        skill={skill}
                                                        onRemove={() => handleRemoveSkill(index)}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Availability */}
                                    <motion.div variants={inputVariants} custom={8}>
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                id="available" 
                                                checked={available}
                                                onChange={(e) => setAvailable(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                                            />
                                            <Label htmlFor="available" className="text-white cursor-pointer">
                                                Available for hire
                                            </Label>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Resume Upload */}
                                    <motion.div variants={inputVariants} custom={9}>
                                        <Label htmlFor="resume" className="text-white mb-2 block">Resume</Label>
                                        
                                        {resumePreview ? (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/80 border border-slate-700">
                                                <div className="flex-1 truncate">{resumePreview}</div>
                                                <button
                                                    type="button"
                                                    onClick={handleClearResume}
                                                    className="text-slate-400 hover:text-white p-1"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : user?.profile?.resume ? (
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700 mb-2">
                                                <div className="truncate">{user.profile.resumeOriginalName || 'Current resume'}</div>
                                                <div className="text-xs text-slate-500">(Current)</div>
                                            </div>
                                        ) : null}
                                        
                                        <div className={`mt-2 ${resumePreview ? 'hidden' : ''}`}>
                                            <label 
                                                htmlFor="resume-upload" 
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="h-8 w-8 text-slate-500 mb-2" />
                                                    <p className="text-sm text-slate-400">
                                                        <span className="font-medium">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                                                </div>
                                                <input
                                                    id="resume-upload"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleResumeChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </motion.div>
                                    
                                    {isUploading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden"
                                        >
                                            <motion.div 
                                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5"
                                                style={{ width: `${uploadProgress}%` }}
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <DialogFooter className="bg-slate-950 p-6 border-t border-slate-800/50">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            className="border-slate-700 text-white hover:bg-slate-800"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;