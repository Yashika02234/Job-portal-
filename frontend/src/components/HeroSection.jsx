
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const HeroSection = () => {
    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>
                    India&apos;s Leading Job Search Platform
                </span>
                <h1 className='text-5xl font-bold'>
                    Discover Opportunities &<br />
                    Advance Your <span className='text-[#6A38C2]'>Career</span>
                </h1>
                <p>Find job opportunities across various industries and connect with top employers to take the next step in your professional journey.</p>

                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 item-center gap-4 mx-auto rounded-full'>
                    <input type="text" 
                        placeholder='Search by job title, skills, or company'
                        className='outline-none border-none w-full'
                    />
                    <Button className='rounded-r-full bg-[#6838C2]'>
                        <Search className='h-5 w-5'/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
