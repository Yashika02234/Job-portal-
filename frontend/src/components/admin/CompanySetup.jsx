import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Edit, Save } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    const [initialLoading, setInitialLoading] = useState(true);
    // Fetch company data using custom hook
    useGetCompanyById(params.id);
    
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    
    const {singleCompany} = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            // Show a loading toast
            const loadingToast = toast.loading("Updating company information...");
            
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            // Dismiss the loading toast
            toast.dismiss(loadingToast);
            
            if (res.data.success) {
                toast.success(res.data.message);
                // Wait briefly before navigating to give toast time to display
                setTimeout(() => {
                    navigate("/admin/companies");
                }, 1000);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    }

    // Update form when company data loads or changes
    useEffect(() => {
        if (singleCompany && Object.keys(singleCompany).length > 0) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null
            });
            setInitialLoading(false);
        }
    }, [singleCompany]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
            <Navbar />
            <div className="w-full bg-gradient-to-r from-purple-900/80 to-indigo-900/80 py-10 mb-8">
                <div className="max-w-xl mx-auto px-4">
                    <Button 
                        variant="ghost" 
                        className="mb-4 text-gray-300 hover:text-white hover:bg-white/10"
                        onClick={() => navigate("/admin/companies")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </Button>
                    
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Edit className="mr-3 h-6 w-6 text-purple-400" />
                        Edit Company
                    </h1>
                    <p className="text-gray-300 mt-2">Update your company information</p>
                </div>
            </div>
            
            <div className='max-w-xl mx-auto px-4'>
                {initialLoading ? (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-lg p-10 flex justify-center">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-gray-300">Loading company data...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-lg p-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            <div>
                                <Label className="text-gray-200">Company Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    className="bg-slate-900/50 border-slate-700 text-white mt-1"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-gray-200">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="bg-slate-900/50 border-slate-700 text-white mt-1"
                                    placeholder="Company description"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-200">Website</Label>
                                <Input
                                    type="text"
                                    name="website"
                                    value={input.website}
                                    onChange={changeEventHandler}
                                    className="bg-slate-900/50 border-slate-700 text-white mt-1"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-200">Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    className="bg-slate-900/50 border-slate-700 text-white mt-1"
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-gray-200">Company Logo</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="bg-slate-900/50 border-slate-700 text-white mt-1"
                                />
                                {singleCompany?.logo && (
                                    <div className="mt-2 flex items-center">
                                        <div className="h-10 w-10 rounded-md overflow-hidden mr-2">
                                            <img src={singleCompany.logo} alt="Current logo" className="h-full w-full object-cover" />
                                        </div>
                                        <p className="text-xs text-gray-400">Current logo will be kept if no new file is uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {
                            loading ? 
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button> : 
                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        }
                    </form>
                )}
            </div>
        </div>
    )
}

export default CompanySetup