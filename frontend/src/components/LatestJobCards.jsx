import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    console.log(job)
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className="p-5 rounded-xl shadow-md bg-[#12253a]/60 border border-[#1c1b29] cursor-pointer hover:shadow-lg transition-all duration-300"
        >
            <div className='flex gap-5'>
                <img src={job?.company?.logo} alt=""  className='w-12 h-12 rounded-md`  '/>
                <div>
                <h1 className="font-semibold text-lg text-[#EAEAEA]">{job?.company?.name}</h1>
                <p className="text-sm text-gray-400">India</p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-xl text-[#EAEAEA] my-3">{job?.title}</h1>
                <p className="text-sm text-gray-300 line-clamp-3">{job?.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-gray-300">
                <Badge className="font-bold bg-[#1a1033] border-2 border-[#7E3AF2] rounded-full py-1 px-3 text-sm shadow-md hover:bg-[#7E3AF2]/10 transition-all duration-200">
                    {job?.position} Positions
                </Badge>
                <Badge className="ont-bold bg-[#1e0f0d] border-2 border-[#F83002] rounded-full py-1 px-3 text-sm shadow-md hover:bg-[#F83002]/10 transition-all duration-200">
                    {job?.jobType}
                </Badge>
                <Badge className="font-bold bg-[#1a0c26] border-2 border-[#7209b7] rounded-full py-1 px-3 text-sm shadow-md hover:bg-[#7209b7]/10 transition-all duration-200">
                    {job?.salary} LPA
                </Badge>
            </div>
        </div>


    )
}

export default LatestJobCards