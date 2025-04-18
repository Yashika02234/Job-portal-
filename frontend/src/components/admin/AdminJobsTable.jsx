import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2, CheckCircle, XCircle, Clock, AlertCircle, BadgeCheck, ShieldAlert } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
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

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [jobToUpdate, setJobToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('active');
    
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
    const handleDeleteJob = () => {
        // TODO: Implement actual API call to delete job
        toast.success(`Job "${jobToDelete?.title}" deleted successfully`);
        setDeleteConfirmOpen(false);
        setJobToDelete(null);
    };

    // Handle job status update
    const handleUpdateStatus = () => {
        // TODO: Implement actual API call to update job status
        toast.success(`Job status updated to ${newStatus}`);
        setStatusUpdateOpen(false);
        setJobToUpdate(null);
    };

    // Open delete confirmation dialog
    const confirmDelete = (job) => {
        setJobToDelete(job);
        setDeleteConfirmOpen(true);
    };

    // Open status update dialog
    const updateStatus = (job) => {
        setJobToUpdate(job);
        setNewStatus(job.status || 'active');
        setStatusUpdateOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch(status) {
            case 'active':
                return (
                    <Badge className="bg-green-500/20 border border-green-500/30 text-white px-2 py-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Active
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge className="bg-red-500/20 border border-red-500/30 text-white px-2 py-1 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Closed
                    </Badge>
                );
            case 'draft':
                return (
                    <Badge className="bg-gray-500/20 border border-gray-500/30 text-white px-2 py-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Draft
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-500/20 border border-yellow-500/30 text-white px-2 py-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Pending
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-blue-500/20 border border-blue-500/30 text-white px-2 py-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Active
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
                                    <div 
                                        className="cursor-pointer" 
                                        onClick={() => updateStatus(job)}
                                    >
                                        {getStatusBadge(job.status || 'active')}
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
                                                <div onClick={() => updateStatus(job)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1">
                                                    <BadgeCheck className="w-4 h-4 text-gray-400" />
                                                    <span>Update Status</span>
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
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDeleteJob}
                        >
                            Delete Job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Status Update Dialog */}
            <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Update Job Status</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Change the status of your job listing
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50 my-4">
                        <p className="font-medium text-white">{jobToUpdate?.title}</p>
                        <p className="text-sm text-gray-400 mt-1">{jobToUpdate?.company?.name}</p>
                    </div>
                    
                    <div className="space-y-4 my-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-white">Active</span>
                            </div>
                            <Switch 
                                checked={newStatus === 'active'} 
                                onCheckedChange={() => setNewStatus('active')}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-400" />
                                <span className="text-white">Closed</span>
                            </div>
                            <Switch 
                                checked={newStatus === 'closed'} 
                                onCheckedChange={() => setNewStatus('closed')}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-white">Draft</span>
                            </div>
                            <Switch 
                                checked={newStatus === 'draft'} 
                                onCheckedChange={() => setNewStatus('draft')}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-400" />
                                <span className="text-white">Pending</span>
                            </div>
                            <Switch 
                                checked={newStatus === 'pending'} 
                                onCheckedChange={() => setNewStatus('pending')}
                            />
                        </div>
                    </div>
                    
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            className="border-slate-700 text-white hover:bg-slate-800"
                            onClick={() => setStatusUpdateOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            onClick={handleUpdateStatus}
                        >
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminJobsTable