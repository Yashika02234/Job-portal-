import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Button } from '../ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Building, Briefcase, ChevronRight, Edit, ArrowLeft, Users, Check } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Badge } from '../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const EditCompany = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { companies } = useSelector(state => state.company)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    // If we have an ID, find the company in the Redux store
    if (id && companies?.length > 0) {
      const selectedCompany = companies.find(c => c._id === id)
      if (selectedCompany) {
        setCompany(selectedCompany)
        setFormData({
          name: selectedCompany.name || '',
          industry: selectedCompany.industry || '',
          website: selectedCompany.website || '',
          location: selectedCompany.location || '',
          description: selectedCompany.description || ''
        })
      } else {
        // If not found in store, fetch from API
        fetchCompany()
      }
    } else if (id) {
      // If we have an ID but no companies loaded yet, fetch directly
      fetchCompany()
    } else {
      // If no ID provided, redirect back to companies list
      toast.error("No company ID provided")
      navigate("/admin/companies")
    }
  }, [id, companies])

  const fetchCompany = async () => {
    if (!id) return
    
    setLoading(true)
    try {
      const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
        withCredentials: true
      })
      
      if (response.data.success) {
        const fetchedCompany = response.data.company
        setCompany(fetchedCompany)
        setFormData({
          name: fetchedCompany.name || '',
          industry: fetchedCompany.industry || '',
          website: fetchedCompany.website || '',
          location: fetchedCompany.location || '',
          description: fetchedCompany.description || ''
        })
      }
    } catch (error) {
      console.error("Error fetching company:", error)
      toast.error("Failed to load company details")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Company name is required")
      return
    }
    
    setLoading(true)
    // Show a loading toast
    const loadingToast = toast.loading("Updating company information...")
    
    try {
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        { withCredentials: true }
      )
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast)
      
      if (response.data.success) {
        toast.success(response.data.message || "Company updated successfully")
        // Wait briefly before navigating to give toast time to display
        setTimeout(() => {
          navigate("/admin/companies")
        }, 1000)
      } else {
        toast.error(response.data.message || "Failed to update company")
      }
    } catch (error) {
      // Dismiss the loading toast
      toast.dismiss(loadingToast)
      console.error("Error updating company:", error)
      toast.error(error.response?.data?.message || "Failed to update company")
    } finally {
      setLoading(false)
    }
  }

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
            Back to Companies
          </Button>
          
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Edit className="mr-3 h-6 w-6 text-purple-400" />
            Edit Company
          </h1>
          <p className="text-gray-300 mt-2">Update your company information</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : company ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Info Card */}
            <div className="md:col-span-1">
              <Card className="bg-slate-800/50 border-slate-700/50 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6">
                  <div className="h-24 w-24 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="h-16 w-16 object-contain" />
                    ) : (
                      <Building className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white text-center mb-4">{company.name}</h2>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-400">Active Jobs</p>
                        <p className="text-white font-medium">{company.jobCount || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Users className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Applicants</p>
                        <p className="text-white font-medium">{company.applicantCount || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <Check className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <Badge 
                          className={`mt-1 ${
                            company.isActive !== false 
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          {company.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Edit Form */}
            <div className="md:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Update Company Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Make changes to your company information here
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Company Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-slate-900/50 border-slate-700 text-white mt-1"
                          placeholder="Enter company name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="industry" className="text-white">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="bg-slate-900/50 border-slate-700 text-white mt-1"
                          placeholder="e.g. Technology, Healthcare"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="website" className="text-white">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="bg-slate-900/50 border-slate-700 text-white mt-1"
                          placeholder="e.g. https://example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="bg-slate-900/50 border-slate-700 text-white mt-1"
                          placeholder="e.g. New York, USA"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-slate-900/50 border-slate-700 text-white rounded-md p-2 mt-1"
                          placeholder="Brief description of your company"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-700 text-white hover:bg-slate-700"
                        onClick={() => navigate("/admin/companies")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                            Updating...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 text-center">
            <Building className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Company Not Found</h2>
            <p className="text-gray-400 mb-6">The company you're looking for doesn't exist or you don't have access to it.</p>
            <Button 
              onClick={() => navigate("/admin/companies")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Back to Companies
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default EditCompany 