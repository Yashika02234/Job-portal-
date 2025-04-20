import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X, Home, Briefcase, Search, Bell, ChevronDown, Sparkles, BarChart3 } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New job matching your profile" },
        { id: 2, text: "Your application was viewed" }
    ]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

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

    const navLinksVariants = {
        hidden: { opacity: 0, y: -5 },
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

    const mobileMenuVariants = {
        closed: { 
            opacity: 0,
            x: "100%",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: { 
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 }
    };

    const isActive = (path) => location.pathname === path;

    return (
     <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-white fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-b border-white/5' 
                    : 'bg-transparent'
            }`}
        >
            {/* Glowing accent bar at top */}
            <motion.div 
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"
                animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                    duration: 15, 
                    ease: "linear", 
                    repeat: Infinity,
                }}
                style={{ backgroundSize: '200% 200%' }}
            />
            
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    <Link to="/">
                        <motion.h1 
                            className="text-2xl font-bold text-white relative z-10 flex items-center"
                            animate={{ textShadow: ['0 0 8px rgba(139, 92, 246, 0)', '0 0 15px rgba(139, 92, 246, 0.5)', '0 0 8px rgba(139, 92, 246, 0)'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                                Carevo
                            </span>
                            <motion.div
                                className="absolute -left-2 -top-2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-md"
                                animate={{ 
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            />
                            <Sparkles className="w-4 h-4 text-purple-400 ml-1 animate-pulse" />
                        </motion.h1>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex font-medium items-center gap-10">
                    {user && user.role === 'recruiter' ? (
                        <>
                            <motion.li custom={1} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/admin/companies" isActive={isActive('/admin/companies')}>
                                    <Briefcase className="w-4 h-4 mr-1.5" />
                                    Companies
                                </NavLink>
                            </motion.li>
                            <motion.li custom={2} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/admin/jobs" isActive={isActive('/admin/jobs')}>
                                    <Search className="w-4 h-4 mr-1.5" />
                                    Jobs
                                </NavLink>
                            </motion.li>
                            <motion.li custom={3} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/admin/analytics" isActive={isActive('/admin/analytics')}>
                                    <BarChart3 className="w-4 h-4 mr-1.5" />
                                    Analytics
                                </NavLink>
                            </motion.li>
                            <motion.li custom={4} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/about" isActive={isActive('/about')}>
                                    <Search className="w-4 h-4 mr-1.5" />
                                    About Us
                                </NavLink>
                            </motion.li>
                        </>
                    ) : (
                        <>
                            <motion.li custom={1} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/" isActive={isActive('/')}>
                                    <Home className="w-4 h-4 mr-1.5" />
                                    Home
                                </NavLink>
                            </motion.li>
                            <motion.li custom={2} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/jobs" isActive={isActive('/jobs')}>
                                    <Briefcase className="w-4 h-4 mr-1.5" />
                                    Jobs
                                </NavLink>
                            </motion.li>
                            <motion.li custom={3} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/my-applications" isActive={isActive('/my-applications')}>
                                    <Bell className="w-4 h-4 mr-1.5" />
                                    My Applications
                                </NavLink>
                            </motion.li>
                            <motion.li custom={4} variants={navLinksVariants} initial="hidden" animate="visible">
                                <NavLink to="/about" isActive={isActive('/about')}>
                                    <Search className="w-4 h-4 mr-1.5" />
                                    About Us
                                </NavLink>
                            </motion.li>
                        </>
                    )}
                </ul>

                {/* Authentication Section */}
                <div className="hidden md:flex items-center gap-5">
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full bg-white/5 border-purple-500/30 text-white hover:bg-purple-500/20 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    onClick={() => navigate('/login')}
                                >
                                    <motion.span
                                        animate={{ 
                                            backgroundPosition: ["0% center", "100% center", "0% center"] 
                                        }}
                                        transition={{ 
                                            duration: 5, 
                                            repeat: Infinity,
                                            repeatType: "loop" 
                                        }}
                                        style={{ backgroundSize: '200% auto' }}
                                        className="bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-indigo-400"
                                    >
                                        Login
                                    </motion.span>
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 border-none shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="relative cursor-pointer"
                                    >
                                        <Bell className="text-gray-300 hover:text-white transition-colors" />
                                        {notifications.length > 0 && (
                                            <motion.span 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs flex items-center justify-center"
                                            >
                                                {notifications.length}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0 bg-slate-900/90 backdrop-blur-lg border border-slate-700 shadow-[0_0_25px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                                        <h3 className="font-semibold text-white flex items-center">
                                            <Bell className="w-4 h-4 mr-2 text-purple-400" />
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <motion.div 
                                                    key={notification.id} 
                                                    className="p-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer"
                                                    whileHover={{ x: 3 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <p className="text-sm text-white">{notification.text}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-400">
                                                <p>No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* User Avatar */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Avatar className="border-2 border-purple-500/50 overflow-hidden shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                                            </Avatar>
                                        </motion.div>
                                        <ChevronDown className="h-4 w-4 text-gray-300" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0 bg-slate-900/90 backdrop-blur-lg border border-slate-700 shadow-[0_0_25px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-12 w-12 border-2 border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                                <AvatarImage src={user?.profile?.profilePhoto} />
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium text-white">{user?.fullname}</h4>
                                                <p className="text-sm text-gray-300 mt-1">{user?.email}</p>
                                                <motion.span 
                                                    className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-white"
                                                    animate={{ 
                                                        boxShadow: ['0 0 0px rgba(139,92,246,0.2)', '0 0 8px rgba(139,92,246,0.5)', '0 0 0px rgba(139,92,246,0.2)']
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {user?.role}
                                                </motion.span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        {user?.role === 'student' && (
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors">
                                                <User2 size={18} className="text-purple-400" />
                                                <span className="text-sm text-white">View Profile</span>
                                            </Link>
                                        )}
                                        <button 
                                            onClick={logoutHandler} 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors"
                                        >
                                            <LogOut size={18} className="text-red-400" />
                                            <span className="text-sm text-white">Logout</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-md text-gray-200 hover:text-white bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="md:hidden fixed inset-0 top-16 bg-slate-900/95 backdrop-blur-xl z-40 flex flex-col"
                    >
                        <div className="flex flex-col p-4">
                            {/* Pattern overlay for visual interest */}
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
                            
                            <ul className="flex flex-col gap-4 mb-8 mt-8">
                                {user && user.role === 'recruiter' ? (
                                    <>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/admin/companies" onClick={toggleMobileMenu}>
                                                <Briefcase className="w-5 h-5 mr-3 text-purple-400" />
                                                Companies
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/admin/jobs" onClick={toggleMobileMenu}>
                                                <Search className="w-5 h-5 mr-3 text-purple-400" />
                                                Jobs
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/admin/analytics" onClick={toggleMobileMenu}>
                                                <BarChart3 className="w-5 h-5 mr-3 text-purple-400" />
                                                Analytics
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/about" onClick={toggleMobileMenu}>
                                                <Search className="w-5 h-5 mr-3 text-purple-400" />
                                                About Us
                                            </MobileNavLink>
                                        </motion.li>
                                    </>
                                ) : (
                                    <>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/" onClick={toggleMobileMenu}>
                                                <Home className="w-5 h-5 mr-3 text-purple-400" />
                                                Home
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/jobs" onClick={toggleMobileMenu}>
                                                <Briefcase className="w-5 h-5 mr-3 text-purple-400" />
                                                Jobs
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/my-applications" onClick={toggleMobileMenu}>
                                                <Bell className="w-5 h-5 mr-3 text-purple-400" />
                                                My Applications
                                            </MobileNavLink>
                                        </motion.li>
                                        <motion.li variants={itemVariants}>
                                            <MobileNavLink to="/about" onClick={toggleMobileMenu}>
                                                <Search className="w-5 h-5 mr-3 text-purple-400" />
                                                About Us
                                            </MobileNavLink>
                                        </motion.li>
                                    </>
                                )}
                            </ul>

                            {!user ? (
                                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                                    <Button 
                                        variant="outline"
                                        className="w-full py-6 justify-center rounded-xl bg-white/5 border-purple-500/30 text-white hover:bg-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                        onClick={() => {
                                            navigate('/login');
                                            toggleMobileMenu();
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        className="w-full py-6 justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 border-none shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                        onClick={() => {
                                            navigate('/signup');
                                            toggleMobileMenu();
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div variants={itemVariants} className="flex flex-col gap-4 mt-auto">
                                    <div className="flex items-center gap-4 p-4 border-t border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
                                        <Avatar className="h-12 w-12 border-2 border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium text-white">{user?.fullname}</h4>
                                            <p className="text-sm text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    
                                    {user?.role === 'student' && (
                                        <Button 
                                            variant="outline" 
                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-purple-500/20 border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                            onClick={() => {
                                                navigate('/profile');
                                                toggleMobileMenu();
                                            }}
                                        >
                                            <User2 size={18} />
                                            View Profile
                                        </Button>
                                    )}
                                    <Button 
                                        variant="destructive" 
                                        className="flex items-center justify-center gap-2 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                        onClick={() => {
                                            logoutHandler();
                                            toggleMobileMenu();
                                        }}
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Animated desktop nav link
const NavLink = ({ to, isActive, children }) => (
    <Link to={to} className="relative group flex items-center overflow-hidden">
        <motion.div 
            className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            initial={{ width: isActive ? "100%" : "0%", left: isActive ? "0%" : "50%" }}
            animate={{ width: isActive ? "100%" : "0%", left: isActive ? "0%" : "50%" }}
            whileHover={{ width: "100%", left: "0%" }}
            transition={{ duration: 0.3 }}
        />
        <motion.div
            className="absolute inset-0 bg-white/5 rounded-md opacity-0 -z-10"
            initial={false}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        />
        <motion.span 
            className={`flex items-center px-3 py-1.5 ${isActive ? 'text-white' : 'text-gray-300'} transition-colors`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.span>
    </Link>
);

// Mobile nav link
const MobileNavLink = ({ to, onClick, children }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className="relative flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors w-full text-lg overflow-hidden group"
    >
        <motion.div 
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100"
            initial={{ height: 0 }}
            whileHover={{ height: "100%" }}
            transition={{ duration: 0.2 }}
        />
        <motion.span 
            className="flex items-center w-full"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.span>
    </Link>
);

export default Navbar
