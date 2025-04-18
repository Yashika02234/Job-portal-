import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Eye, Briefcase, Building, Users, Share2, Trash2, ExternalLink, PlusCircle, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/dialog"

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    
    const navigate = useNavigate();
    
    useEffect(()=>{
        const filteredCompany = companies?.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])
    
    // Handle company deletion
    const handleDeleteCompany = () => {
        // TODO: Implement actual API call to delete company
        toast.success(`Company "${companyToDelete?.name}" deleted successfully`);
        setDeleteConfirmOpen(false);
        setCompanyToDelete(null);
    };
    
    // Open delete confirmation dialog
    const confirmDelete = (company) => {
        setCompanyToDelete(company);
        setDeleteConfirmOpen(true);
    };
    
    // View company details by navigating to dedicated page
    const viewCompanyDetails = (company) => {
        navigate(`/admin/companies/details/${company._id}`);
    };
    
    return (
        <div>
            <Table>
                <TableCaption>A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Company</TableHead>
                        <TableHead>Jobs Posted</TableHead>
                        <TableHead>Registered On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {filterCompany?.map((company, index) => (
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
                                        {company.jobCount || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-400">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-500/20 border border-green-500/30 text-white px-2 py-1">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-slate-700/70 text-white"
                                            onClick={() => viewCompanyDetails(company)}
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-blue-700/70 text-white"
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            title="Edit Company"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-purple-700/70 text-white"
                                            onClick={() => navigate(`/admin/jobs/create?company=${company._id}`)}
                                            title="Post Job"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 rounded-full bg-slate-800/70 hover:bg-red-700/70 text-white"
                                            onClick={() => confirmDelete(company)}
                                            title="Delete Company"
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
                                                <div onClick={() => viewCompanyDetails(company)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <span>View Details</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/companies/${company._id}`)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1">
                                                    <Edit2 className="w-4 h-4 text-gray-400" />
                                                    <span>Edit Company</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/create?company=${company._id}`)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1">
                                                    <PlusCircle className="w-4 h-4 text-purple-400" />
                                                    <span>Post Job</span>
                                                </div>
                                                <div onClick={() => confirmDelete(company)} className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-md cursor-pointer mt-1 text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete Company</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))}
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
                            Are you sure you want to delete this company? All associated jobs will also be removed. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50 my-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-md border border-slate-700">
                                {companyToDelete?.logo ? (
                                    <AvatarImage src={companyToDelete.logo} alt={companyToDelete?.name} />
                                ) : (
                                    <AvatarFallback className="rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                                        {companyToDelete?.name?.charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <p className="font-medium text-white">{companyToDelete?.name}</p>
                                <p className="text-sm text-gray-400">{companyToDelete?.jobCount || 0} active jobs</p>
                            </div>
                        </div>
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
        </div>
    );
};

export default CompaniesTable;