import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Building, Edit, ArrowLeft, Search, Plus } from 'lucide-react'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

const ManageCompanies = () => {
  useGetAllCompanies()
  const navigate = useNavigate()
  const { companies } = useSelector(state => state.company)
  const { user } = useSelector(state => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter companies by user and search term
  const filteredCompanies = companies.filter(company => {
    const isUserCompany = company.userId === user?._id
    const matchesSearch = !searchTerm || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return isUserCompany && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pb-20">
      <Navbar />
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-900/80 to-indigo-900/80 py-10 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-4 text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/admin/companies")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Building className="mr-3 h-6 w-6 text-purple-400" />
            Manage Companies
          </h1>
          <p className="text-gray-300 mt-2">View and edit your registered companies</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 bg-slate-800/50 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={() => navigate("/admin/companies/create")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> New Company
          </Button>
        </div>
        
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 shadow-lg h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 h-12 w-12 rounded-md flex items-center justify-center text-white font-bold text-xl">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain" />
                        ) : (
                          company.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-white">{company.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {company.industry || "Technology"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      {company.location && (
                        <div className="text-sm text-gray-400">
                          <span className="font-medium text-gray-300">Location:</span> {company.location}
                        </div>
                      )}
                      
                      {company.website && (
                        <div className="text-sm text-gray-400">
                          <span className="font-medium text-gray-300">Website:</span>{' '}
                          <a 
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="font-medium text-gray-300">Status:</span>
                        <Badge 
                          className={
                            company.isActive !== false 
                              ? "bg-green-500/20 border-green-500/30 text-white" 
                              : "bg-gray-500/20 border-gray-500/30 text-white"
                          }
                        >
                          {company.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      {company.description && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-400">
                            {company.description.length > 120 
                              ? `${company.description.substring(0, 120)}...` 
                              : company.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-slate-700/50 pt-4">
                    <Button 
                      onClick={() => navigate(`/admin/companies/edit/${company._id}`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Company
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 text-center">
            <Building className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {companies.length > 0 
                ? "No companies match your search" 
                : "No companies found"}
            </h2>
            <p className="text-gray-400 mb-6">
              {companies.length > 0 
                ? "Try adjusting your search query" 
                : "Create your first company to get started"}
            </p>
            <Button 
              onClick={() => navigate("/admin/companies/create")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Company
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default ManageCompanies 