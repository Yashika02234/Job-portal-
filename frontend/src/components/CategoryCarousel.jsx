import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

// Define categories - duplicated to create a seamless loop effect
const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
    "Cloud Architect"
];

// Double the categories to create a seamless loop
const allCategories = [...categories, ...categories];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef(null);
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    };

    return (
        <div className="py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
                    Explore Popular Categories
                </h2>
                
                <div 
                    className="relative max-w-full mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    ref={containerRef}
                >
                    {/* Left and right gradient fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
                    
                    {/* First scrolling row */}
                    <div className="overflow-hidden py-3">
                        <motion.div 
                            className="flex gap-4 whitespace-nowrap"
                            animate={{ 
                                x: isPaused ? null : [0, -2000]
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 40,
                                    ease: "linear"
                                }
                            }}
                        >
                            {allCategories.map((cat, index) => (
                                <motion.div 
                                    key={index} 
                                    className="inline-block"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => searchJobHandler(cat)}
                                        variant="outline"
                                        className="rounded-full bg-slate-800/60 text-white border-purple-500/50 hover:bg-purple-600 hover:text-white hover:border-transparent transition-all duration-300 px-6 py-5 min-w-[180px] shadow-[0_0_15px_rgba(123,58,245,0.2)] hover:shadow-[0_0_20px_rgba(123,58,245,0.4)]"
                                    >
                                        {cat}
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    
                    {/* Second scrolling row (reverse direction) */}
                    <div className="overflow-hidden py-3 mt-4">
                        <motion.div 
                            className="flex gap-4 whitespace-nowrap"
                            animate={{ 
                                x: isPaused ? null : [-2000, 0]
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 45, // Slightly different speed for visual interest
                                    ease: "linear"
                                }
                            }}
                        >
                            {allCategories.reverse().map((cat, index) => (
                                <motion.div 
                                    key={index} 
                                    className="inline-block"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => searchJobHandler(cat)}
                                        variant="outline"
                                        className="rounded-full bg-slate-800/60 text-white border-indigo-500/50 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 px-6 py-5 min-w-[180px] shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    >
                                        {cat}
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCarousel;