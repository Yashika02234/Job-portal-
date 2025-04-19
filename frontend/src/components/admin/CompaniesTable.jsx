import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { PlusCircle, Building, Loader2, Trash2, MoreHorizontal, AlertCircle, Power } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import axios from 'axios'
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { setCompanies } from '@/redux/companySlice'
import { Switch } from '../ui/switch'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [companyToUpdate, setCompanyToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Effect to fetch the latest job data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true});
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Failed to load job data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [dispatch]);
    
    // Get the count of active jobs for a company
    const getActiveJobsCount = (companyId) => {
        if (!allAdminJobs) return 0;
        return allAdminJobs.filter(job => 
            job.company?._id === companyId && 
            (job.status === 'active' || !job.status)
        ).length;
    };
    
    // Get the count of total applicants for a company
    const getTotalApplicantsCount = (companyId) => {
        if (!allAdminJobs) return 0;
        return allAdminJobs
            .filter(job => job.company?._id === companyId)
            .reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
    };
    
    // Get the count of closed jobs for a company
    const getClosedJobsCount = (companyId) => {
        if (!allAdminJobs) return 0;
        return allAdminJobs.filter(job => 
            job.company?._id === companyId && 
            job.status === 'closed'
        ).length;
    };
    
    // Check if company is active (this will eventually come from the database)
    const isCompanyActive = (company) => {
        return company.isActive !== false; // Default to true if isActive is not defined
    };
    
    // Handle company deletion
    const handleDeleteCompany = async () => {
        if (!companyToDelete) return;

        try {
            const response = await axios.delete(
                `${COMPANY_API_END_POINT}/delete/${companyToDelete._id}`, 
                { withCredentials: true }
            );
            
            if (response.data.success) {
                // Remove the company from the state
                const updatedCompanies = companies.filter(company => company._id !== companyToDelete._id);
                dispatch(setCompanies(updatedCompanies));
                
                // Also refetch jobs to ensure the UI is in sync
                try {
                    const jobsRes = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true});
                    if (jobsRes.data.success) {
                        dispatch(setAllAdminJobs(jobsRes.data.jobs));
                    }
                } catch (error) {
                    console.error("Error refreshing jobs data:", error);
                }
                
                toast.success(response.data.message || `Company "${companyToDelete.name}" deleted successfully`);
            } else {
                toast.error(response.data.message || "Failed to delete company");
            }
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error(error.response?.data?.message || "Failed to delete company");
        } finally {
            setDeleteConfirmOpen(false);
            setCompanyToDelete(null);
        }
    };
    
    // Open delete confirmation dialog
    const confirmDelete = (company) => {
        setCompanyToDelete(company);
        setDeleteConfirmOpen(true);
    };

    // Open status update dialog
    const updateStatus = (company) => {
        setCompanyToUpdate(company);
        setNewStatus(isCompanyActive(company));
        setStatusUpdateOpen(true);
    };

    // Handle status toggle
    const handleToggleStatus = async (company = null, newStatusValue = null) => {
        // If called from the status update dialog
        if (!company && companyToUpdate) {
            company = companyToUpdate;
        }
        
        // If no company is provided, return
        if (!company) return;
        
        // Use the provided status or the state value
        const statusToSet = newStatusValue !== null ? newStatusValue : newStatus;
        
        try {
            const response = await axios.put(
                `${COMPANY_API_END_POINT}/toggle-status/${company._id}`, 
                { isActive: statusToSet },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                // Update companies in Redux store
                const updatedCompanies = companies.map(c => 
                    c._id === company._id 
                        ? { ...c, isActive: statusToSet } 
                        : c
                );
                
                dispatch(setCompanies(updatedCompanies));
                
                toast.success(response.data.message || `Company status updated to ${statusToSet ? 'Active' : 'Inactive'}`);
            } else {
                toast.error(response.data.message || "Failed to update company status");
            }
            
            // Reset state if using the dialog
            if (companyToUpdate) {
                setStatusUpdateOpen(false);
                setCompanyToUpdate(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update company status");
            console.error("Error updating company status:", error);
        }
    };
    
    useEffect(() => {
        const filteredCompany = companies?.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                    <p className="text-gray-400">Loading company data...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <Table>
                <TableCaption>A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Company</TableHead>
                        <TableHead>Active Jobs</TableHead>
                        <TableHead>Total Applicants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {filterCompany?.map((company, index) => {
                            const activeJobs = getActiveJobsCount(company._id);
                            const totalApplicants = getTotalApplicantsCount(company._id);
                            const isActive = isCompanyActive(company);
                            
                            return (
                                <motion.tr 
                                    key={company._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-white/5"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 rounded-md border border-slate-700">
                                                {company.logo ? (
                                                    <AvatarImage src={company.logo} alt={company.name} />
                                                ) : (
                                                    <AvatarFallback className="rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                                                        {company.name?.charAt(0)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-white">{company.name}</p>
                                                <p className="text-xs text-gray-400">{company.industry || "Technology"}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-white">
                                            {activeJobs}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-white">
                                            {totalApplicants}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            defaultValue={isActive ? "active" : "inactive"}
                                            onValueChange={(value) => {
                                                setCompanyToUpdate(company);
                                                setNewStatus(value === "active");
                                                handleToggleStatus(company, value === "active");
                                            }}
                                        >
                                            <SelectTrigger className="w-32 h-9 bg-slate-800/50 border-slate-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                <SelectItem value="active" className="text-green-400 focus:bg-slate-700">
                                                    <div className="flex items-center">
                                                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                                        Active
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="inactive" className="text-gray-400 focus:bg-slate-700">
                                                    <div className="flex items-center">
                                                        <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                                                        Inactive
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="hidden md:flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`py-1 px-3 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}
                                                onClick={() => navigate(`/admin/jobs/create?company=${company._id}`)}
                                                title={isActive ? "Post Job" : "Cannot post job - Company is inactive"}
                                                disabled={!isActive}
                                            >
                                                <PlusCircle className="h-4 w-4" />
                                                <span>Post Job</span>
                                            </motion.button>
                                            
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="py-1 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                                onClick={() => confirmDelete(company)}
                                                title="Delete Company"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete</span>
                                            </motion.button>
                                        </div>
                                        
                                        <div className="md:hidden">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-52 bg-slate-800 border-slate-700 text-white p-2">
                                                    {isActive && (
                                                        <div 
                                                            onClick={() => navigate(`/admin/jobs/create?company=${company._id}`)} 
                                                            className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer"
                                                        >
                                                            <PlusCircle className="w-4 h-4 text-purple-400" />
                                                            <span>Post Job</span>
                                                        </div>
                                                    )}
                                                    <div 
                                                        onClick={() => updateStatus(company)} 
                                                        className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1"
                                                    >
                                                        <Power className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
                                                        <span>Toggle Status</span>
                                                    </div>
                                                    <div 
                                                        onClick={() => confirmDelete(company)} 
                                                        className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1 text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span>Delete Company</span>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                    
                    {(!filterCompany || filterCompany.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                                <div className="flex flex-col items-center justify-center">
                                    <Building className="h-12 w-12 text-gray-500 mb-2" />
                                    <p>No companies found</p>
                                    <p className="text-sm text-gray-500 mt-1">Create a new company to get started</p>
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
                        <DialogTitle>Delete Company</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete the company "{companyToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50 my-4">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="text-white font-medium">Warning</p>
                        </div>
                        <p className="text-sm text-gray-400">Deleting this company will also remove all associated jobs and applications.</p>
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
                            onClick={handleDeleteCompany}
                        >
                            Delete Company
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Update Company Status</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Change status for company: <span className="font-medium text-white">{companyToUpdate?.name || ''}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-4 my-2 border border-slate-700 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-white">{newStatus ? 'Active' : 'Inactive'}</p>
                                <p className="text-sm text-gray-400">
                                    {newStatus 
                                        ? 'Jobs can be posted from this company' 
                                        : 'Jobs cannot be posted from this company'}
                                </p>
                            </div>
                            <Switch 
                                checked={newStatus}
                                onCheckedChange={setNewStatus}
                                className="data-[state=checked]:bg-green-600"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="bg-transparent border-slate-700 text-white hover:bg-slate-800"
                            onClick={() => setStatusUpdateOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => handleToggleStatus(companyToUpdate, newStatus)} className="bg-purple-600 hover:bg-purple-700">
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompaniesTable