import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className="max-w-7xl mx-auto my-20 px-4 relative">
            <div
                className="
                    absolute 
                    w-[20.5rem] 
                    h-[30.92rem] 
                    top-[5rem] 
                    left-[-4.52rem] 
                    rotate-[30deg] 
                    border-[0.5rem] 
                    border-[#9D88CD] 
                    blur-[0.75rem]
                    rounded-full 
                    z-0
                "
            ></div>

            <h1 className="text-4xl font-bold text-white relative z-10">
                <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 relative z-10">
                {
                    allJobs.length <= 0
                        ? <span className="text-white">No Job Available</span>
                        : allJobs?.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                }
            </div>
        </div>
    )
}

export default LatestJobs;
