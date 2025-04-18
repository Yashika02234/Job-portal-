import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { setAllApplicants } from '@/redux/applicationSlice';

const ApplicantsTable = ({ applicants }) => {
    const dispatch = useDispatch();
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailContent, setEmailContent] = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [loading, setLoading] = useState(false);

    const statusIcons = {
        pending: <Clock className="h-4 w-4 text-amber-400" />,
        shortlisted: <CheckCircle className="h-4 w-4 text-green-400" />,
        rejected: <XCircle className="h-4 w-4 text-red-400" />
    };

    const getStatusClass = (status) => {
        const statusClasses = {
            pending: "bg-amber-500/20 border-amber-500/30 text-amber-300",
            shortlisted: "bg-green-500/20 border-green-500/30 text-green-300",
            rejected: "bg-red-500/20 border-red-500/30 text-red-300"
        };
        return statusClasses[status] || "bg-slate-500/20 border-slate-500/30 text-slate-300";
    };

    const statusHandler = async (status, id) => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            
            if (res.data.success) {
                toast.success(res.data.message);
                
                // Refresh applicants list
                const jobId = applicants[0]?.job;
                if (jobId) {
                    const updatedApplicants = await axios.get(
                        `${APPLICATION_API_END_POINT}/${jobId}/applicants`, 
                        { withCredentials: true }
                    );
                    dispatch(setAllApplicants(updatedApplicants.data.job));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating status");
        } finally {
            setLoading(false);
        }
    };

    const openEmailDialog = (applicant) => {
        setSelectedApplicant(applicant);
        setEmailContent(
            `Dear ${applicant?.user?.fullname},\n\nWe are pleased to invite you for an interview for the position you applied for.\n\nInterview details:\nDate: [Please specify date]\nTime: [Please specify time]\nLocation: [Please specify location/platform]\n\nPlease confirm your availability.\n\nBest regards,\n[Your Company Name]`
        );
        setEmailOpen(true);
    };

    const sendEmail = async () => {
        if (!selectedApplicant || !emailContent) return;
        
        try {
            setLoading(true);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/email/${selectedApplicant._id}/send`,
                { message: emailContent },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success("Interview invitation sent successfully");
                setEmailOpen(false);
                
                // Also update status to shortlisted
                await statusHandler("shortlisted", selectedApplicant._id);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>Applicants for this job position</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants.map((item) => (
                            <TableRow key={item._id} className="hover:bg-slate-800/30">
                                <TableCell className="font-medium">{item?.user?.fullname}</TableCell>
                                <TableCell>{item?.user?.email}</TableCell>
                                <TableCell>{item?.user?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.user?.profile?.resume ? 
                                            <a 
                                                className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center" 
                                                href={item?.user?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {item?.user?.profile?.resumeOriginalName || "Resume"}
                                            </a> : 
                                            <span className="text-gray-500">Not available</span>
                                    }
                                </TableCell>
                                <TableCell>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(item.status)}`}>
                                        {statusIcons[item.status]}
                                        <span className="ml-1 capitalize">{item.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(item?.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 border-blue-600/30 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400"
                                            onClick={() => openEmailDialog(item)}
                                        >
                                            <Mail className="h-3.5 w-3.5 mr-1" />
                                            Invite
                                        </Button>
                                        
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button 
                                                    size="sm"
                                                    variant="outline" 
                                                    className="h-8 border-slate-700 hover:bg-slate-800"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 bg-slate-900 border-slate-700">
                                                <div className="space-y-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="w-full justify-start text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                                        onClick={() => statusHandler("shortlisted", item?._id)}
                                                        disabled={item.status === "shortlisted" || loading}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Shortlist
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                        onClick={() => statusHandler("rejected", item?._id)}
                                                        disabled={item.status === "rejected" || loading}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {/* Email Dialog */}
            <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send Interview Invitation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">
                                Sending to: {selectedApplicant?.user?.email}
                            </p>
                            <Textarea 
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                className="h-60 bg-slate-800 border-slate-700 text-white"
                                placeholder="Write your message here..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="ghost" 
                            onClick={() => setEmailOpen(false)}
                            className="border-slate-700 hover:bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={sendEmail}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable