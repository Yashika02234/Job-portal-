import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        // Initialize updateData with the text fields
        const updateData = { name, description, website, location };

        // Only process file upload if a file was actually provided
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }
    
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating company information",
            success: false,
            error: error.message
        });
    }
}

// Toggle company active status
export const toggleCompanyStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        
        if (isActive === undefined) {
            return res.status(400).json({
                message: "isActive field is required",
                success: false
            });
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { isActive: isActive },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        // If company is set to inactive, update all its jobs to rejected status
        if (isActive === false) {
            // Import Job model if not already imported at the top of the file
            const { Job } = await import("../models/job.model.js");
            
            // Find all active jobs for this company and update their status to 'rejected'
            const jobsUpdated = await Job.updateMany(
                { company: company._id, status: "active" },
                { status: "rejected" }
            );
            
            console.log(`Updated ${jobsUpdated.modifiedCount} jobs to rejected status`);
        }

        return res.status(200).json({
            message: `Company status updated to ${isActive ? 'active' : 'inactive'}${isActive === false ? ' and all active jobs were rejected' : ''}`,
            company,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating company status",
            success: false
        });
    }
}

// Delete company and all associated jobs and applications
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        // Import models
        const { Job } = await import("../models/job.model.js");
        const { Application } = await import("../models/application.model.js");

        // Find all jobs associated with this company
        const jobs = await Job.find({ company: companyId });
        const jobIds = jobs.map(job => job._id);

        // Delete all applications for these jobs
        if (jobIds.length > 0) {
            await Application.deleteMany({ job: { $in: jobIds } });
        }

        // Delete all jobs associated with this company
        await Job.deleteMany({ company: companyId });

        // Finally, delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company and all associated jobs and applications have been deleted",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while deleting the company",
            success: false,
            error: error.message
        });
    }
}