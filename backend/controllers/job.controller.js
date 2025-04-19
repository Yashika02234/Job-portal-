import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js"; // Import Company model
import { sendJobNotificationEmails } from "../utils/emailService.js"; // Import the email service

// admin posts the job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    // Check if company exists and is active
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Check if company is active
    if (company.isActive === false) {
      return res.status(403).json({
        message: "Cannot post job for inactive company.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

     // Send email notifications
     await sendJobNotificationEmails(title, description);

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while creating the job.",
      success: false,
    });
  }
};
//for students
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        //is used to fetch all the related data from another collection.
        path: "company", //path- refers to the field name in the schema which conatins the Company model reference
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Jobs found",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// for students
export const getJobById = async (req, res) => {
  try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
          path:"applications"
      });
      if (!job) {
          return res.status(404).json({
              message: "Jobs not found.",
              success: false
          })
      };
      return res.status(200).json({ job, success: true });
  } catch (error) {
      console.log(error);
  }
}
// all the jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
      const adminId = req.id;
      const jobs = await Job.find({ created_by: adminId }).populate({
          path:'company',
          createdAt:-1
      });
      if (!jobs) {
          return res.status(404).json({
              message: "Jobs not found.",
              success: false
          })
      };
      return res.status(200).json({
          jobs,
          success: true
      })
  } catch (error) {
      console.log(error);
  }
}

// update job by admin
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      status
    } = req.body;
    
    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Required fields are missing.",
        success: false,
      });
    }
    
    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Check if company is active - optionally disable this check if needed
    /*
    if (company.isActive === false) {
      return res.status(403).json({
        message: "Cannot update job for inactive company.",
        success: false,
      });
    }
    */
    
    // Find the job by ID
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    
    // Process requirements field
    let processedRequirements;
    if (typeof requirements === 'string') {
      // If it's a comma-separated string
      processedRequirements = requirements.split(",").map(item => item.trim());
    } else if (Array.isArray(requirements)) {
      // If it's already an array
      processedRequirements = requirements;
    } else {
      // Default to empty array if neither
      processedRequirements = [];
    }
    
    // Update job fields
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        requirements: processedRequirements,
        salary,
        location,
        jobType,
        experienceLevel: experience,
        position: position || 1,
        company: companyId,
        status: status || job.status, // Keep existing status if not provided
      },
      { new: true }
    );
    
    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      message: "An error occurred while updating the job.",
      error: error.message,
      success: false,
    });
  }
};

// Delete job by admin
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    // Find the job by ID
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Check if the user is authorized to delete this job
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this job.",
        success: false,
      });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);
    
    return res.status(200).json({
      message: "Job deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the job.",
      error: error.message,
      success: false,
    });
  }
};