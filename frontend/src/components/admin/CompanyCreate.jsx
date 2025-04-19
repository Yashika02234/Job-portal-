import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { ArrowLeft, Building, Loader2, Upload, Globe, MapPin, FileText, Edit, CheckCircle } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [createdCompanyId, setCreatedCompanyId] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [previewLogo, setPreviewLogo] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const registerNewCompany = async (e) => {
        e.preventDefault();
        if (!input.name) {
            toast.error("Company name is required");
            return;
        }

        try {
            setLoading(true);
            
            // First register with just the name to get the ID
            const registerRes = await axios.post(`${COMPANY_API_END_POINT}/register`, 
                { companyName: input.name }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            if (!registerRes?.data?.success) {
                throw new Error(registerRes?.data?.message || "Failed to register company");
            }
            
            const companyId = registerRes?.data?.company?._id;
            setCreatedCompanyId(companyId);
            
            // Then update with the rest of the details if provided
            if (input.description || input.website || input.location || input.file) {
                const formData = new FormData();
                if (input.description) formData.append("description", input.description);
                if (input.website) formData.append("website", input.website);
                if (input.location) formData.append("location", input.location);
                if (input.file) formData.append("file", input.file);
                
                const updateRes = await axios.put(`${COMPANY_API_END_POINT}/update/${companyId}`, 
                    formData, 
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        withCredentials: true
                    }
                );
                
                if (!updateRes?.data?.success) {
                    throw new Error(updateRes?.data?.message || "Failed to update company details");
                }
            }
            
            toast.success("Company created successfully");
            dispatch(setSingleCompany(registerRes.data.company));
            setShowSuccessMessage(true);
            
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error.message || "Failed to create company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <Button 
                            onClick={() => navigate("/admin/companies")} 
                            variant="outline" 
                            className="bg-transparent border-slate-700 text-white hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold">Create New Company</h1>
                    </div>

                    <AnimatePresence>
                        {showSuccessMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4"
                            >
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-white">Company Created Successfully</h3>
                                        <p className="text-sm text-gray-300 mt-1">
                                            Your company has been created. You can now:
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <Button 
                                                onClick={() => navigate(`/admin/companies/${createdCompanyId}`)}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Company Details
                                            </Button>
                                            <Button 
                                                onClick={() => navigate("/admin/companies")}
                                                size="sm"
                                                variant="outline"
                                                className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                                            >
                                                View All Companies
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={registerNewCompany}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <Label className="text-gray-300">Company Name <span className="text-red-400">*</span></Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. Acme Corporation"
                                        className="bg-slate-800/50 border-slate-700 text-white pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-400">This will be the official name of your company in the system.</p>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <Label className="text-gray-300">Company Description</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Textarea
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Describe your company, its mission, and what it does..."
                                        className="bg-slate-800/50 border-slate-700 text-white pl-10 min-h-[100px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-gray-300">Company Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="url"
                                        name="website"
                                        value={input.website}
                                        onChange={changeEventHandler}
                                        placeholder="https://example.com"
                                        className="bg-slate-800/50 border-slate-700 text-white pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-gray-300">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. New York, USA"
                                        className="bg-slate-800/50 border-slate-700 text-white pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <Label className="text-gray-300">Company Logo</Label>
                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={changeFileHandler}
                                                className="bg-slate-800/50 border-slate-700 text-white pl-10"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Recommended size: 400x400px. Max size: 2MB.</p>
                                    </div>
                                    
                                    {previewLogo && (
                                        <div className="h-20 w-20 rounded-md border border-slate-700 flex items-center justify-center overflow-hidden">
                                            <img src={previewLogo} alt="Logo preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/companies")}
                                className="bg-transparent border-slate-700 text-white hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || showSuccessMessage}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Company"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default CompanyCreate