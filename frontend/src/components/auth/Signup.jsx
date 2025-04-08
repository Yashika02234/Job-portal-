import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading } = useSelector(store => store.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname",input.fullname);
        formData.append("email",input.email);
        formData.append("phoneNumber",input.phoneNumber);
        formData.append("password",input.password);
        formData.append("role",input.role);
        if(input.file) {
            formData.append("file", input.file);
        }
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`,formData, {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                    withCredentials:true
            });
            if(res.data.success){
                navigate("/login");
                toast.success(res.data.message);
            }
            console.log(input);
        } catch (error) {
            console.log('Could not post data: ', error);
            if (error.response) {
                // Handle specific error messages
                if (error.response.data.message === 'User has already an Account') {
                    toast.error('This email/phone number is already registered. Please login or use a different one.');
                } else {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error('Network error, please try again');
            }
        }
        
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center max-w-5xl mx-auto">
                <form onSubmit={submitHandler} className="w-3/5 border border-gray-300 shadow-lg bg-white rounded-lg p-8 my-12">
                    <h1 className="font-semibold text-2xl mb-6 text-center text-gray-700">
                        Create an Account
                    </h1>
                    
                    <div className="mb-4">
                        <Label className="text-gray-700">Full Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter your full name"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-purple-600 placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="text-gray-700">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-purple-600 placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="text-gray-700">Phone Number</Label>
                        <Input
                            type="text"
                            placeholder="Enter your phone number"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-purple-600 placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="text-gray-700">Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-purple-600 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-6 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer transition duration-400"
                                />
                                <Label className="text-gray-700">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer transition duration-400"
                                />
                                <Label className="text-gray-700">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex items-center gap-3 my-5">
                        <Label className="text-gray-700 whitespace-nowrap">Profile Photo:</Label>
                        <Input
                            accept="image/*"
                            type="file"
                            onChange={changeFileHandler}
                            className="cursor-pointer border-gray-300 transition duration-400"
                        />
                    </div>

                    {
                        loading ?
                            <Button>
                                <Loader className='mr-2 h-4 w-4 animate-spin' />
                                please wait
                            </Button> : <Button type="submit" className="w-full my-6 bg-black text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:shadow-lg">
                                Signup
                            </Button>
                    }
                    
                    <span className="text-sm block text-center">
                        Already have an account? <Link to="/login" className="text-purple-600 hover:text-purple-900">Login</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};


export default Signup