import { setSearchedQuery } from '@/redux/jobSlice';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    }

    const exploreJobsHandler = () => {
        navigate("/jobs");
    };

    return (
        <div className='text-center relative text-white'>
            <div className='flex lg:flex-row items-center justify-around mt-12 px-6 lg:px-16'>
                <div className='flex flex-col gap-6 max-w-2xl text-center lg:text-left'>
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-2"
                        >
                            <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Hey {user.fullname}, welcome back!
                            </h2>
                        </motion.div>
                    )}

                    <h1 className='text-4xl lg:text-5xl font-bold leading-tight text-gray-300'>
                        Discover Opportunities &<br />
                        Advance Your <span className='text-[#6A38C2]'>Career</span>
                    </h1>

                    <p className='text-lg text-gray-400'>
                        Welcome to <span className='font-semibold text-[#6A38C2]'>Carevo</span>, the platform where top talent connects with leading employers.
                        Whether you're looking to advance your career or hire skilled professionals, Carevo makes the process simple and efficient.
                    </p>

                    <p className='text-lg text-gray-400'>
                        Start exploring new opportunities today.
                    </p>

                    <div className='mt-2'>
                        <button className='px-6 py-3 bg-[#6A38C2] text-white font-semibold rounded-full hover:bg-[#572fa1] transition'
                            onClick={() => navigate('/jobs')}>
                            Get Started
                        </button>
                    </div>
                </div>


                <img
                    src="/image/HeroSection.png"
                    alt="Hero Section Illustration"
                    className='h-80 lg:h-96 w-auto mt-10 lg:mt-0'
                />
            </div>

            <div className='mt-9'>
                <div className='flex flex-col lg:flex-row items-center justify-around mt-12 px-6 lg:px-16'>

                    <div className='relative w-fit'>
                        <svg
                            className='w-[28rem] absolute top-3 left-8 z-0'
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="#8A3FFC"
                                d="M41.4,-54.6C48,-43.8,43.9,-25.4,46.9,-8.3C49.9,8.8,59.9,24.6,56.8,35.4C53.6,46.1,37.3,51.8,22.5,53.6C7.7,55.5,-5.5,53.5,-18.4,49.3C-31.2,45.1,-43.7,38.8,-55.6,27.5C-67.4,16.3,-78.7,0.2,-78.3,-15.8C-77.8,-31.7,-65.5,-47.6,-50.5,-57C-35.5,-66.3,-17.7,-69.2,-0.2,-69C17.4,-68.8,34.8,-65.5,41.4,-54.6Z"
                                transform="translate(100 100)"
                            />
                        </svg>
                        <img
                            src="/image/SearchSection.png"
                            alt="Hero Section Illustration"
                            className='h-80 lg:h-96 w-auto mt-10 lg:mt-0 relative z-10'
                        />
                    </div>

                    <div className='flex flex-col gap-6 max-w-2xl text-center lg:text-left mt-10 lg:mt-0'>
                        <h1 className='text-4xl lg:text-5xl font-bold leading-tight text-gray-300'>
                            If <span className='text-[#6A38C2]'>opportunity</span> doesn't knock, build a door.
                        </h1>
                        <p className='text-lg text-gray-400'>
                            Connecting talented job seekers with top employers through a fast, smart, and hassle-free
                            hiring experience. Find your dream job or your perfect candidate—quickly and effortlessly
                        </p>
                    </div>
                </div>

                <div className='relative mt-12'>
                    <div className='border border-gray-300 w-full absolute top-1/2 -translate-y-1/2'></div>
                    <div className='flex w-full max-w-xl shadow-lg border border-gray-200 px-4 py-2 items-center gap-2 mx-auto rounded-full bg-white relative z-10'>
                        <input
                            type='text'
                            placeholder='Find jobs'
                            onChange={(e) => setQuery(e.target.value)}
                            className='flex-1 outline-none border-none text-base text-gray-700 bg-transparent placeholder-gray-400'
                        />
                        <Button
                            onClick={searchJobHandler}
                            className='rounded-full bg-[#6A38C2] text-white hover:bg-[#572fa1]'
                        >
                            <Search className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative my-20 w-3/4 mx-auto">
                <div className="absolute inset-0 bg-[#12253a] bg-opacity-60 rounded-xl mx-10" />
                <div className="relative flex flex-wrap justify-around shadow-md border border-gray-100 mx-10 p-10 rounded-xl z-10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <img src="/image/Internship.png" alt="Internship" className="h-64 object-contain transition-transform hover:scale-105 duration-300" />
                        <p className="text-lg font-semibold text-white">Internship</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <img src="/image/Jobs.png" alt="Jobs" className="h-64 object-contain transition-transform hover:scale-105 duration-300" />
                        <p className="text-lg font-semibold text-white">Jobs</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <img src="/image/FreeLancer.png" alt="Freelancer" className="h-64 object-contain transition-transform hover:scale-105 duration-300" />
                        <p className="text-lg font-semibold text-white">Freelancer</p>
                    </div>
                </div>
                    <div className="w-[40rem] h-[30rem] top-[-2rem] right-[-20rem] absolute border-[0.5rem] rounded-full rotate-[140deg] border-[#A23CE7] blur-lg pointer-events-none"></div>
                    <div className="absolute w-[50rem] h-[40rem] top-[-15rem] left-[-20rem] -rotate-[11.26deg]  bg-[#102A6C] rounded-full blur-[250px] pointer-events-none">
                    </div>
            </div>



        </div>
    )
}

export default HeroSection
