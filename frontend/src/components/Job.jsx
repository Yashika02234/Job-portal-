
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from './ui/badge'

const Job = () => {
    return (
        <div className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 max-w-lg mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Posted 2 days ago</span>
                <Button variant="outline" className="rounded-full w-10 h-10 flex items-center justify-center border-gray-300 hover:bg-gray-100">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                </Button>
            </div>
            
            {/* Company Info */}
            <div className="flex items-center gap-4 my-4">
                <div className="w-14 h-14 border rounded-full flex items-center justify-center bg-gray-100">
                    <Avatar className="w-12 h-12">
                        <AvatarImage
                            src="https://img.freepik.com/premium-vector/minimalist-type-creative-business-logo-template_1283348-23026.jpg"
                            className="w-full h-full rounded-full"
                        />
                    </Avatar>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">Company Name</h1>
                    <p className="text-sm text-gray-600">India</p>
                </div>
            </div>

            {/* Job Details */}
            <div>
                <h1 className="font-bold text-xl text-gray-900 my-2">Job Title</h1>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci expedita dolore natus quibusdam soluta reprehenderit, fugit culpa dignissimos repellendus minima?
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge className="px-3 py-1 rounded-full border text-blue-700 font-bold text-sm bg-blue-100">12 Positions</Badge>
                <Badge className="px-3 py-1 rounded-full border text-[#F83002] font-bold text-sm bg-red-100">Part Time</Badge>
                <Badge className="px-3 py-1 rounded-full border text-[#7209b7] font-bold text-sm bg-purple-100">24 LPA</Badge>
            </div>

            {/* Apply Button */}
            <div className="mt-5 flex item-center gap-4 mt-4">
                <Button variant='outline'>Details</Button>
                <Button className="px-6 py-2 bg-[#7209b7] text-white font-medium rounded-md hover:bg-blue-700 transition">
                    Saved for Later
                </Button>
            </div>
        </div>
    )
}

