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
        message: "Cannot update job for inactive company.",
        success: false,
      });
    }
    
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    
    // Update job fields
    job.title = title;
    job.description = description;
    job.requirements = typeof requirements === 'string' ? requirements.split(",") : requirements;
    job.salary = salary;
    job.location = location;
    job.jobType = jobType;
    job.experienceLevel = experience;
    job.position = position || 1;
    job.company = companyId;
    
    // Only update status if provided
    if (status) {
      job.status = status;
    }
    
    await job.save();
    
    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while updating the job.",
      success: false,
    });
  }
};