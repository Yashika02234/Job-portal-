import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { motion } from 'framer-motion'
import { Check, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai","Chennai","Kolkata","Jaipur","Ahmedabad","Surat","Indore","Lucknow",
            "Kanpur","Bhopal","Gurgaon","Noida","Faridhabad","Ghaziabad","Nashik","Pimpri-Chinchwad","Indore","Lucknow","Kanpur","Bhopal","Gurgaon","Noida","Faridhabad","Ghaziabad","Nashik","Pimpri-Chinchwad","Ahemdabad"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer","DevOps Engineer","Cloud Engineer","Cyber Security Engineer","Data Engineer","Data Analyst","Data Scientist","AI/ML Engineer","Blockchain Developer","UI/UX Designer","Product Manager","Project Manager","Sales Manager","Marketing Manager","HR Manager","Finance Manager","Operations Manager","Customer Support","Content Writer","Graphic Designer","Video Editor","SEO Specialist","Social Media Manager","Event Planner","Content Writer","Graphic Designer","Video Editor","SEO Specialist","Social Media Manager","Event Planner"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh","5lakh to 10lakh","10lakh to 20lakh","20lakh to 50lakh","50lakh to 1cr"]
    },
]

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    const [expandedFilters, setExpandedFilters] = useState({});
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        // If the value is already selected, remove it
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter(item => item !== value));
        } else {
            // Add the value to the selected values
            setSelectedValues([...selectedValues, value]);
        }
    }
    
    useEffect(() => {
        // Join multiple selected values with OR operator
        const queryString = selectedValues.join(' OR ');
        dispatch(setSearchedQuery(queryString));
    }, [selectedValues, dispatch]);
    
    const removeFilter = (value) => {
        setSelectedValues(selectedValues.filter(item => item !== value));
    }
    
    const clearAllFilters = () => {
        setSelectedValues([]);
    }
    
    const toggleFilterExpand = (filterType) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    }
    
    // Function to determine which array items to show
    const getVisibleItems = (filterType, array) => {
        if (expandedFilters[filterType]) {
            return array;
        }
        return array.slice(0, 3);
    }
    
    return (
        <div className='w-full text-white p-3 rounded-md'>
            <div className="flex items-center justify-between mb-3">
                <h1 className='font-bold text-lg flex items-center'>
                    <Filter className="w-4 h-4 mr-2" /> Filter Jobs
                </h1>
                {selectedValues.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs text-gray-300 hover:text-white flex items-center"
                        onClick={clearAllFilters}
                    >
                        Clear All <X className="w-3 h-3 ml-1" />
                    </motion.button>
                )}
            </div>
            <hr className='mb-4 border-white/20' />
            
            {selectedValues.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-300 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedValues.map((value, index) => (
                            <motion.div 
                                key={`selected-${index}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-md flex items-center"
                            >
                                <span>{value}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFilter(value)}
                                    className="ml-2 text-purple-300 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            
            {filterData.map((data, index) => (
                <div key={`filter-${index}`} className="mb-5">
                    <h2 className='font-bold text-gray-200 mb-2'>{data.filterType}</h2>
                    <div className="space-y-1.5">
                        {getVisibleItems(data.filterType, data.array).map((item, idx) => (
                            <motion.div
                                key={`filter-item-${index}-${idx}`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`
                                    flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors
                                    ${selectedValues.includes(item) 
                                        ? 'bg-purple-500/20 text-purple-300' 
                                        : 'hover:bg-white/5'}
                                `}
                                onClick={() => changeHandler(item)}
                            >
                                <div className={`
                                    w-4 h-4 rounded-sm mr-2 flex items-center justify-center
                                    ${selectedValues.includes(item) 
                                        ? 'bg-purple-500 text-white' 
                                        : 'border border-gray-400'}
                                `}>
                                    {selectedValues.includes(item) && <Check className="w-3 h-3" />}
                                </div>
                                <Label className="cursor-pointer">{item}</Label>
                            </motion.div>
                        ))}
                        
                        {data.array.length > 3 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleFilterExpand(data.filterType)}
                                className="w-full mt-2 py-2 px-3 text-sm font-medium flex items-center justify-center rounded-md bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                            >
                                {expandedFilters[data.filterType] ? (
                                    <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></>
                                ) : (
                                    <>Show More ({data.array.length - 3}) <ChevronDown className="ml-1 w-4 h-4" /></>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FilterCard