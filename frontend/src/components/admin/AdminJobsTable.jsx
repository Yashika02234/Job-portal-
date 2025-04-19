import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2, CheckCircle, XCircle, Clock, AlertCircle, BadgeCheck, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/dialog"
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [jobToUpdate, setJobToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    // Handle job deletion
    const handleDeleteJob = async () => {
        if (!jobToDelete || !jobToDelete._id) {
            toast.error("No job selected for deletion");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobToDelete._id}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success(`Job "${jobToDelete?.title}" deleted successfully`);
                
                // Remove the job from local state
                const updatedJobs = allAdminJobs.filter(job => job._id !== jobToDelete._id);
                dispatch(setAllAdminJobs(updatedJobs));
                
                // Close dialog
                setDeleteConfirmOpen(false);
                setJobToDelete(null);
            } else {
                toast.error(response.data.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error(error.response?.data?.message || "An error occurred while deleting the job");
        } finally {
            setLoading(false);
        }
    };

    // Handle job status update
    const handleUpdateStatus = async (jobData = null, newStatusValue = null) => {
        // If called from the status update dialog
        if (!jobData && jobToUpdate) {
            jobData = jobToUpdate;
        }
        
        // If no job is provided, return
        if (!jobData) return;
        
        // Use the provided status or the state value
        const statusToSet = newStatusValue !== null ? newStatusValue : newStatus;
        
        // Check if company is active
        if (jobData.company?.isActive === false && statusToSet === 'active') {
            toast.error("Cannot set job to active when company is inactive");
            return;
        }
        
        try {
            const response = await axios.put(`${JOB_API_END_POINT}/update/${jobData._id}`, 
                {
                    title: jobData.title,
                    description: jobData.description,
                    requirements: jobData.requirements,
                    salary: jobData.salary,
                    location: jobData.location,
                    jobType: jobData.jobType,
                    experience: jobData.experienceLevel,
                    position: jobData.position,
                    companyId: jobData.company._id,
                    status: statusToSet // The backend expects 'active' or 'rejected'
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (response.data.success) {
                toast.success(`Job status updated to ${statusToSet === 'active' ? 'Active' : 'Rejected'}`);
                
                // Fetch fresh admin jobs data
                try {
                    const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true});
                    if (jobsRes.data.success) {
                        dispatch(setAllAdminJobs(jobsRes.data.jobs));
                    }
                } catch (err) {
                    console.error("Error refreshing job list:", err);
                }
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating job status');
            console.error('Error updating job status:', error);
        } finally {
            // Reset state if using the dialog
            if (statusUpdateOpen) {
                setStatusUpdateOpen(false);
                setJobToUpdate(null);
            }
        }
    };

    // Open delete confirmation dialog
    const confirmDelete = (job) => {
        setJobToDelete(job);
        setDeleteConfirmOpen(true);
    };

    // Open status update dialog
    const updateStatus = (job) => {
        setJobToUpdate(job);
        
        // Convert any non-active status to 'rejected'
        const currentStatus = job.status || 'active';
        const normalizedStatus = currentStatus === 'active' ? 'active' : 'rejected';
        
        setNewStatus(normalizedStatus);
        setStatusUpdateOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <Badge className="bg-green-500/20 border border-green-500/30 text-white px-2 py-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Active
                </Badge>
            );
        } else {
            // For 'rejected', 'closed', 'draft', 'pending', or any other status
            return (
                <Badge className="bg-red-500/20 border border-red-500/30 text-white px-2 py-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Rejected
                </Badge>
            );
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {filterJobs?.map((job, index) => (
                            <motion.tr 
                                key={job._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 rounded-md border border-slate-700">
                                            {job?.company?.logo ? (
                                                <AvatarImage src={job.company.logo} alt={job.company.name} />
                                            ) : (
                                                <AvatarFallback className="rounded-md bg-slate-800 text-white">
                                                    {job?.company?.name?.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="font-medium text-white">{job?.company?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-white">{job?.title}</TableCell>
                                <TableCell className="text-gray-400">{job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                    <div>
                                        {job.status === 'active' || !job.status ? (
                                            <Badge className="bg-green-500/20 border border-green-500/30 text-white px-2 py-1 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-500/20 border border-red-500/30 text-white px-2 py-1 flex items-center gap-1">
                                                <XCircle className="h-3 w-3" /> Rejected
                                            </Badge>
                                        )}
                                        {job?.company?.isActive === false && (
                                            <span className="text-xs text-amber-400 block mt-1">Company inactive</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-white">
                                        {job.applicants?.length || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-slate-700/70 text-white"
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                            title="View Applicants"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-blue-700/70 text-white"
                                            onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                            title="Edit Job"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-red-700/70 text-white"
                                            onClick={() => confirmDelete(job)}
                                            title="Delete Job"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </motion.button>
                                    </div>
                                    
                                    <div className="inline-block md:hidden">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-52 bg-slate-800 border-slate-700 text-white p-2">
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <span>View Applicants</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1">
                                                    <Edit2 className="w-4 h-4 text-gray-400" />
                                                    <span>Edit Job</span>
                                                </div>
                                                <div onClick={() => confirmDelete(job)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1 text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete Job</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                    
                    {filterJobs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                                <div className="flex flex-col items-center justify-center">
                                    <ShieldAlert className="h-12 w-12 text-gray-500 mb-2" />
                                    <p>No jobs found</p>
                                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new job</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Job</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete this job? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50 my-4">
                        <p className="font-medium text-white">{jobToDelete?.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{jobToDelete?.company?.name}</p>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            className="border-slate-700 text-white hover:bg-slate-800"
                            onClick={() => setDeleteConfirmOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDeleteJob}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </div>
                            ) : 'Delete Job'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Status Update Dialog */}
            {statusUpdateOpen && (
                <AlertDialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                    <AlertDialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Status</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Change status for job: <span className="font-medium text-white">{jobToUpdate?.title || ''}</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        
                        {jobToUpdate?.company?.isActive === false && (
                            <div className="bg-amber-500/20 border border-amber-500/30 rounded p-3 mb-3">
                                <div className="flex items-start text-amber-300">
                                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Company is inactive</p>
                                        <p className="text-xs">Job can only be set to 'Rejected' status</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="relative mt-2 mb-4">
                            <Select 
                                defaultValue={newStatus}
                                onValueChange={(value) => setNewStatus(value)}
                                disabled={jobToUpdate?.company?.isActive === false && newStatus !== 'rejected'}
                            >
                                <SelectTrigger className="w-full h-10 bg-slate-800/50 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                    <SelectItem 
                                        value="active" 
                                        disabled={jobToUpdate?.company?.isActive === false}
                                        className="py-2"
                                    >
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                            Active
                                        </div>
                                    </SelectItem>
                                    <SelectItem 
                                        value="rejected" 
                                        className="py-2"
                                    >
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                            Rejected
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <AlertDialogFooter className="flex gap-2 sm:gap-0">
                            <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleUpdateStatus(jobToUpdate, newStatus)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Update
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}

export default AdminJobsTable