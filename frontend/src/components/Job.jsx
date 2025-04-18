import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Building, Calendar, Clock, Award, Star, BriefcaseBusiness, Zap } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const Job = ({job}) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    const handleSave = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Job removed from saved items" : "Job saved for later");
    }

    const handleCardClick = () => {
        navigate(`/description/${job?._id}`);
    }

    const badgeVariants = {
        position: {
            bg: "bg-gradient-to-r from-blue-50 to-blue-100",
            border: "border-blue-300",
            text: "text-blue-700",
            icon: <BriefcaseBusiness className="w-3 h-3 mr-1" />,
        },
        jobType: {
            bg: "bg-gradient-to-r from-orange-50 to-orange-100",
            border: "border-orange-300",
            text: "text-orange-700",
            icon: <Clock className="w-3 h-3 mr-1" />,
        },
        salary: {
            bg: "bg-gradient-to-r from-purple-50 to-purple-100",
            border: "border-purple-300",
            text: "text-purple-700",
            icon: <Award className="w-3 h-3 mr-1" />,
        }
    };

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
            whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            className='p-6 rounded-xl bg-white border border-gray-200 cursor-pointer transition-all duration-300 overflow-hidden relative'
        >
            {/* Animated background gradient on hover */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 opacity-0 z-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Featured tag if applicable */}
            {job?.featured && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-0 left-0"
                >
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                        <Star className="w-3 h-3 inline mr-1" /> Featured
                    </div>
                </motion.div>
            )}

            <div className='flex items-center justify-between relative z-10'>
                <div className="flex items-center gap-2">
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Calendar className="w-4 h-4 text-gray-400" />
                    </motion.div>
                    <p className='text-sm text-gray-500'>
                        {daysAgoFunction(job?.createdAt) === 0 ? 
                            <span className="font-medium text-green-600">Today</span> : 
                            `${daysAgoFunction(job?.createdAt)} days ago`}
                    </p>
                </div>
                <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-full p-2 transition-colors ${isSaved ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}
                >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-700' : ''}`} />
                </motion.button>
            </div>

            <div className='flex items-start gap-4 my-4 relative z-10'>
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-sm transform scale-110"></div>
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </motion.div>
                <div>
                    <h1 className='font-bold text-xl text-gray-800'>{job?.title}</h1>
                    <div className="flex items-center mt-1">
                        <Building className="w-4 h-4 text-gray-500 mr-1.5" />
                        <h2 className='font-medium text-gray-600'>{job?.company?.name}</h2>
                    </div>
                    <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-gray-500 mr-1.5" />
                        <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <p className='text-sm text-gray-600 line-clamp-2 mb-4'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-4 relative z-10'>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className={`font-medium ${badgeVariants.position.bg} ${badgeVariants.position.border} ${badgeVariants.position.text} rounded-full py-1 px-3 text-xs shadow-sm`}>
                        {badgeVariants.position.icon} {job?.position} Positions
                    </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className={`font-medium ${badgeVariants.jobType.bg} ${badgeVariants.jobType.border} ${badgeVariants.jobType.text} rounded-full py-1 px-3 text-xs shadow-sm`}>
                        {badgeVariants.jobType.icon} {job?.jobType}
                    </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Badge className={`font-medium ${badgeVariants.salary.bg} ${badgeVariants.salary.border} ${badgeVariants.salary.text} rounded-full py-1 px-3 text-xs shadow-sm`}>
                        {badgeVariants.salary.icon} {job?.salary} LPA
                    </Badge>
                </motion.div>
            </div>

            <motion.div 
                className='flex items-center gap-4 mt-5 relative z-10 justify-end'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        variant="outline" 
                        className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/description/${job?._id}`);
                        }}
                    >
                        View Details
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/description/${job?._id}#apply`);
                        }}
                    >
                        <Zap className="w-4 h-4 mr-1.5" /> Apply Now
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default Job