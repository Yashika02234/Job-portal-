import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Filter, Search, XCircle, List, Grid, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortOption, setSortOption] = useState('newest'); // 'newest', 'salary-high', 'salary-low'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let filteredResults = [...allJobs];
        
        // Apply search filters (both global and local)
        const searchTerms = [searchedQuery, localSearch].filter(Boolean).map(term => term.toLowerCase());
        
        if (searchTerms.length > 0) {
            filteredResults = filteredResults.filter((job) => {
                return searchTerms.every(term => 
                    job.title.toLowerCase().includes(term) ||
                    job.description.toLowerCase().includes(term) ||
                    (job.location && job.location.toLowerCase().includes(term)) ||
                    (job.company?.name && job.company.name.toLowerCase().includes(term))
                );
            });
        }
        
        // Apply sorting
        switch (sortOption) {
            case 'newest':
                filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'salary-high':
                filteredResults.sort((a, b) => b.salary - a.salary);
                break;
            case 'salary-low':
                filteredResults.sort((a, b) => a.salary - b.salary);
                break;
            default:
                break;
        }
        
        setFilterJobs(filteredResults);
    }, [allJobs, searchedQuery, localSearch, sortOption]);

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const clearSearch = () => {
        setLocalSearch('');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800"
        >
            <Navbar />
            
            {/* Loading state */}
            {isLoading ? (
                <motion.div 
                    className="flex flex-col items-center justify-center h-[70vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 mb-8"
                    >
                        <Briefcase className="w-full h-full text-purple-400" />
                    </motion.div>
                    <motion.p 
                        className="text-white text-xl font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Finding the best opportunities for you...
                    </motion.p>
                </motion.div>
            ) : (
                <div className='max-w-7xl mx-auto px-4 mt-5 pb-10 z-20 relative pt-24'>
                    {/* Page title with animation */}
                                            <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        <h1 className="text-3xl font-bold text-white">
                            <Briefcase className="inline-block mr-2 mb-1" /> Explore Job Opportunities
                        </h1>
                        <p className="text-gray-300 mt-1">
                            Find your next career move from our {filterJobs.length} available positions
                        </p>
                                            </motion.div>

                    {/* Search and filter bar */}
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg mb-6 border border-white/20"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search jobs, companies, or keywords..."
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500"
                                    value={localSearch}
                                    onChange={handleSearchChange}
                                />
                                {localSearch && (
                                    <button 
                                        onClick={clearSearch} 
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline"
                                    onClick={toggleFilters}
                                    className={`border-white/20 ${showFilters ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white'}`}
                                >
                                    <Filter className="mr-1 h-4 w-4" /> Filters
                                </Button>
                                
                                <div className="flex rounded-md overflow-hidden border border-white/20">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-none ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white'}`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-none ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white'}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="bg-white/5 border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="salary-high">Highest Salary</option>
                                    <option value="salary-low">Lowest Salary</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    <div className='flex gap-6'>
                        {/* Filter sidebar with animation */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                                    exit={{ opacity: 0, x: -20, width: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-1/4 min-w-[250px]"
                                >
                                    <div className="sticky top-5">
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
                                            <h2 className="text-xl font-bold text-white mb-4">Filter Options</h2>
                                            <FilterCard />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Job listings with animations */}
                        <motion.div 
                            className="flex-1 h-full"
                            layout
                            transition={{ duration: 0.3 }}
                        >
                            <ScrollArea className="h-[calc(100vh-220px)]">
                                {filterJobs.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-12 text-center"
                                    >
                                        <Search className="h-16 w-16 text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                                        <p className="text-gray-400 mb-6">
                                            We couldn't find any jobs matching your search criteria.
                                        </p>
                                        <Button 
                                            onClick={clearSearch}
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            Clear Search
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-6'}
                                    >
                                        <AnimatePresence>
                                            {filterJobs.map((job) => (
                                                <motion.div
                                                    layout
                                                    key={job?._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={viewMode === 'list' ? 'w-full' : ''}
                                                >
                                                    <Job job={job} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </ScrollArea>
                        </motion.div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default Jobs