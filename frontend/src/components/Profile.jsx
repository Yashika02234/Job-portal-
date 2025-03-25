import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';

const isResume = true;

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 border border-gray-300 rounded-2xl my-5 p-8 shadow-lg'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24 border-2 border-gray-300 rounded-full shadow-sm">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-semibold text-2xl text-gray-800'>{user?.fullname}</h1>
                            <p className='text-gray-600'>{user?.profile?.bio || 'No bio available'}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="p-2 border border-gray-400 rounded-lg hover:bg-gray-200 transition duration-200">Edit Profile<Pen /></Button>
                </div>
                <div className='my-6 space-y-3'>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <Mail />
                        <span>{user?.email || 'No email available'}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <Contact />
                        <span>{user?.phoneNumber || 'No contact number'}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h2 className='text-lg font-semibold mb-2'>Skills</h2>
                    <div className='flex flex-wrap gap-2'>
                        {user?.profile?.skills?.length ? user?.profile?.skills.map((skill, index) => (
                            <Badge key={index} className='bg-indigo-200 text-indigo-800 px-2 py-1 rounded-md'>{skill}</Badge>
                        )) : <span>NA</span>}
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-2'>
                    <Label className="text-md font-semibold">Resume</Label>
                    {isResume ? (
                        <a target='_blank' href={user?.profile?.resume} className='text-blue-500 hover:underline'>
                            {user?.profile?.resumeOriginalName || 'View Resume'}
                        </a>
                    ) : (
                        <span>NA</span>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 my-6'>
                <h1 className='font-bold text-xl mb-4'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
