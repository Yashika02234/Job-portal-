import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
                <Link to="/" className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold tracking-tight">Job<span className="text-purple-600">Portal</span></h1>
                </Link>

                <div className="flex items-center gap-8">
                    <ul className="hidden md:flex items-center gap-6">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies" className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600">Companies</Link></li>
                                <li><Link to="/admin/jobs" className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600">Home</Link></li>
                                <li><Link to="/jobs" className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600">Jobs</Link></li>
                                <li><Link to="/browse" className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600">Browse</Link></li>
                            </>
                        )}
                    </ul>

                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login"><Button variant="outline" className="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-purple-600 text-white hover:bg-purple-900">Sign up</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-purple-100 hover:ring-4 hover:ring-purple-200">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 shadow-lg border rounded-lg">
                                <div className="flex flex-col divide-y divide-gray-800">
                                    <div className="p-4 bg-gray-900 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 ring-2 ring-gray-700">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        </Avatar>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{user?.fullname}</h4>
                                            <p className="text-xs text-gray-400">{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-gray-900">
                                        {user?.role === 'student' && (
                                            <Link to="/profile">
                                                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white">
                                                    <User2 /> View Profile
                                                </Button>
                                            </Link>
                                        )}
                                        <Button onClick={logoutHandler} variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white">
                                            <LogOut /> Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
