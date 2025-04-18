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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Building } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
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
            <div className='flex items-center justify-center max-w-7xl mx-auto text-white relative z-10 py-16'>
                <div className="w-full max-w-md">
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
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Welcome Back</h1>
                                <p className="text-white/60 mt-2">Sign in to access your account</p>
                            </motion.div>
                            
                            <form onSubmit={submitHandler}>
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="space-y-5"
                                >
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
                                    
                                    <div className="pt-2">
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
                                            Sign in
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
                            <span className='text-sm text-white/60'>Don't have an account? </span>
                            <Link to="/signup" className='text-blue-400 hover:text-blue-300 font-medium transition-colors'>
                                Create Account
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

export default Login