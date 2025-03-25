import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader } from 'lucide-react'
import { useState } from 'react'    

export const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading } = useSelector(store => store.auth)

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
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
            console.log(input);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }

    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center max-w-5xl mx-auto">
                <form onSubmit={submitHandler} className="w-3/5 border border-gray-300 shadow-lg bg-white rounded-lg p-8 my-12">
                    <h1 className="font-semibold text-2xl mb-6 text-center text-gray-700">
                        Login
                    </h1>
                    <div className="mb-4">
                        <Label className="text-gray-700">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="border-gray-300 focus:border-purple-600 transition duration-400"
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
                            className="border-gray-300 focus:border-purple-600 transition duration-400"
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
                    {
                        loading ?
                            <Button>
                                <Loader className='mr-2 h-4 w-4 animate-spin' />
                                please wait
                            </Button> : <Button type="submit" className="w-full my-6 bg-black text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:shadow-lg">
                                Login
                            </Button>
                    }

                    <span className='text-sm block text-center'>Do not have an account? <Link to="/signup" className='text-purple-600 hover:text-purple-900'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}
