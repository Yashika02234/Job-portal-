import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Building, Mail, Lock, UserCircle, Phone, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [fileName, setFileName] = useState("");
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        if (e.target.files?.[0]) {
            setInput({ ...input, file: e.target.files[0] });
            setFileName(e.target.files[0].name);
        }
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto text-white relative z-10 py-10'>
                <div className="w-full max-w-xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="backdrop-blur-md bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20"
                    >
                        <div className="px-8 pt-8 pb-6">
                            <motion.div 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center mb-8"
                            >
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Create Account</h1>
                                <p className="text-white/60 mt-2">Join our platform and discover new opportunities</p>
                            </motion.div>
                            
                            <form onSubmit={submitHandler}>
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <Label className="text-white/80 block mb-2 text-sm font-medium">Full Name</Label>
                                        <div className="relative">
                                            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                type="text"
                                                value={input.fullname}
                                                name="fullname"
                                                onChange={changeEventHandler}
                                                placeholder="John Smith"
                                                className="pl-10 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Label className="text-white/80 block mb-2 text-sm font-medium">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                type="email"
                                                value={input.email}
                                                name="email"
                                                onChange={changeEventHandler}
                                                placeholder="your@email.com"
                                                className="pl-10 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Label className="text-white/80 block mb-2 text-sm font-medium">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                type="text"
                                                value={input.phoneNumber}
                                                name="phoneNumber"
                                                onChange={changeEventHandler}
                                                placeholder="8080808080"
                                                className="pl-10 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Label className="text-white/80 block mb-2 text-sm font-medium">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                type="password"
                                                value={input.password}
                                                name="password"
                                                onChange={changeEventHandler}
                                                placeholder="••••••••"
                                                className="pl-10 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-white/80 block mb-3 text-sm font-medium">Account Type</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative rounded-lg ${input.role === 'student' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'} border p-3 flex flex-col items-center cursor-pointer transition-all duration-300 hover:bg-white/10`}
                                                onClick={() => setInput({ ...input, role: 'student' })}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="student"
                                                    checked={input.role === 'student'}
                                                    onChange={changeEventHandler}
                                                    className="sr-only"
                                                />
                                                <User className="h-6 w-6 mb-1" />
                                                <span className="text-sm font-medium">Student</span>
                                            </motion.div>
                                            
                                            <motion.div
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative rounded-lg ${input.role === 'recruiter' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'} border p-3 flex flex-col items-center cursor-pointer transition-all duration-300 hover:bg-white/10`}
                                                onClick={() => setInput({ ...input, role: 'recruiter' })}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="recruiter"
                                                    checked={input.role === 'recruiter'}
                                                    onChange={changeEventHandler}
                                                    className="sr-only"
                                                />
                                                <Building className="h-6 w-6 mb-1" />
                                                <span className="text-sm font-medium">Recruiter</span>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <Label className="text-white/80 block mb-2 text-sm font-medium">Profile Photo</Label>
                                        <div className="relative">
                                            <motion.label 
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                className="flex items-center justify-center w-full h-20 px-4 transition bg-white/5 border-2 border-white/10 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-500/70 focus:outline-none"
                                            >
                                                <span className="flex flex-col items-center space-y-2">
                                                    <Upload className="w-6 h-6 text-white/60" />
                                                    <span className="text-sm text-white/60">
                                                        {fileName ? fileName : "Click to upload profile photo"}
                                                    </span>
                                                </span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    name="file"
                                                    onChange={changeFileHandler}
                                                    className="hidden" 
                                                />
                                            </motion.label>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="mt-8"
                                >
                                    {loading ? (
                                        <Button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center">
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            Create Account
                                        </Button>
                                    )}
                                </motion.div>
                            </form>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="py-4 text-center bg-white/5"
                        >
                            <span className='text-sm text-white/60'>Already have an account? </span>
                            <Link to="/login" className='text-blue-400 hover:text-blue-300 font-medium transition-colors'>
                                Sign in
                            </Link>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-10 text-center text-white/40 text-xs"
                    >
                        © {new Date().getFullYear()} Carevo Job Portal. All rights reserved.
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Signup