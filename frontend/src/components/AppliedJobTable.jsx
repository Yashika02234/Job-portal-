import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Bell, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    
    // Get recently updated applications (within last 7 days)
    const recentlyUpdated = allAppliedJobs.filter(job => {
        const updatedDate = new Date(job.updatedAt || job.createdAt);
        const daysAgo = (new Date() - updatedDate) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7 && job.status !== 'pending';
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'shortlisted':
                return <CheckCircle className="h-4 w-4 text-green-400" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-400" />;
            case 'pending':
            default:
                return <Clock className="h-4 w-4 text-amber-400" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'shortlisted':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'rejected':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            case 'pending':
            default:
                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        }
    };

    const getStatusMessage = (job) => {
        const companyName = job.job?.company?.name || 'The company';
        
        switch (job.status) {
            case 'shortlisted':
                return `${companyName} has shortlisted your application for the ${job.job?.title} position.`;
            case 'rejected':
                return `${companyName} has decided not to proceed with your application for the ${job.job?.title} position.`;
            default:
                return `Your application for ${job.job?.title} at ${companyName} is under review.`;
        }
    };

    return (
        <div className="space-y-8">
            {/* Notifications Section */}
            {recentlyUpdated.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-6"
                >
                    <div className="flex items-center mb-3">
                        <Bell className="h-5 w-5 text-purple-400 mr-2" />
                        <h3 className="text-white text-lg font-medium">Recent Updates</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {recentlyUpdated.map(job => (
                            <motion.div 
                                key={job._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg flex items-start ${
                                    job.status === 'shortlisted' 
                                        ? 'bg-green-900/20 border border-green-500/30' 
                                        : 'bg-red-900/20 border border-red-500/30'
                                }`}
                            >
                                <div className="mr-3 mt-0.5">
                                    {getStatusIcon(job.status)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm">{getStatusMessage(job)}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {new Date(job.updatedAt || job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {job.status === 'shortlisted' && (
                                    <Button 
                                        size="sm"
                                        variant="ghost"
                                        className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    >
                                        View Details
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
            
            {/* Applications Table */}
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                                You haven't applied to any jobs yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className="hover:bg-slate-800/20">
                                <TableCell>{new Date(appliedJob?.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium text-white">{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell>{appliedJob.job?.location || 'Remote'}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`inline-flex items-center gap-1 ${getStatusClass(appliedJob.status)}`}>
                                        {getStatusIcon(appliedJob.status)}
                                        <span className="capitalize">{appliedJob.status}</span>
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable