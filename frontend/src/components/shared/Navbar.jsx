import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    return (
        <div className="text-white shadow-md">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Carevo
                    </h1>
                </div>

                <ul className="flex font-medium items-center gap-24">
                    {
                        user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies" className="hover-underline hover:text-violet-500">Companies</Link></li>
                                <li><Link to="/admin/jobs" className="hover-underline hover:text-violet-500">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className="hover-underline hover:text-violet-500">Home</Link></li>
                                <li><Link to="/jobs" className="hover-underline hover:text-violet-500">Jobs</Link></li>
                                <li><Link to="/browse" className="hover-underline hover:text-violet-500">Browse</Link></li>
                            </>
                        )
                    }
                </ul>

                {!user ? (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded-full inset-0 bg-[#12253a] bg-opacity-60 text-white border border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors duration-300 px-6 py-3"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className="rounded-full inset-0 bg-[#12253a] bg-opacity-60 text-white  border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors duration-300 px-6 py-3"
                            onClick={() => navigate('/signup')}
                        >
                            Signup
                        </button>

                    </div>
                ) : (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div>
                                <div className="flex gap-2">
                                    <Avatar>
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{user?.fullname}</h4>
                                        <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col my-4 gap-2 text-gray-600">
                                    {
                                        user?.role === 'student' && (
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <User2 size={18} />
                                                <Button variant="link" className="p-0 text-sm">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )
                                    }
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <LogOut size={18} />
                                        <Button onClick={logoutHandler} variant="link" className="p-0 text-sm">Logout</Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            <style>{`
                .hover-underline {
                    position: relative;
                    transition: color 0.3s;
                }
                .hover-underline::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -3px;
                    height: 2px;
                    width: 0;
                    background-color: #8b5cf6;
                    transition: width 0.3s ease;
                }
                .hover-underline:hover::after {
                    width: 100%;
                }
            `}</style>
        </div>
    )
}

export default Navbar
