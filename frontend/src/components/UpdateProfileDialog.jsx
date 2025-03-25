import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.map(skill => skill) || '',
        file: user?.profile?.resume || ''
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append('skills', input.skills);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    };

    return (
        <Dialog open={open}>
            <DialogContent
                className="sm:max-w-[500px] bg-gradient-to-br from-indigo-100 to-white rounded-xl shadow-2xl p-6"
                onInteractOutside={() => setOpen(false)}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-indigo-800">Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-4">
                    {['fullname', 'email', 'phoneNumber', 'bio', 'skills'].map((field, idx) => (
                        <div key={idx} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={field} className="text-right font-semibold text-indigo-700">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                            <Input
                                id={field}
                                name={field}
                                value={input[field]}
                                onChange={changeEventHandler}
                                className="col-span-3 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:ring focus:ring-indigo-200"
                                placeholder={`Enter ${field}`}
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right font-semibold text-indigo-700">Resume</Label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            accept="application/pdf"
                            onChange={fileChangeHandler}
                            className="col-span-3 text-indigo-800 border-2 border-indigo-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className={`w-full py-2 mt-4 font-bold rounded-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
