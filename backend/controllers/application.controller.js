import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendJobApplicationEmail } from "../utils/emailService.js"; // Import the email service

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    //check if the user has already applied for this job.
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Check if the job exists and populate the company details
    const job = await Job.findById(jobId).populate({
      path: "company",
      populate: { path: "userId" }, // Fetch recruiter from company
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (!job.company || !job.company.userId) {
      return res.status(404).json({
        message: "Company or recruiter not found",
        success: false,
      });
    }

    const recruiter = job.company.userId; // Recruiter is the user who owns the company

    //create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    // Fetch the applicant's details
    const applicant = await User.findById(userId);
    if (!applicant) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

     // Send Email Notification to the Recruiter
     await sendJobApplicationEmail(recruiter._id, job, applicant);

    return res.status(201).json({
      message: "Job applied Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job", // feild which has the reference of the data of another Collection.
        options: { sort: { createdAt: -1 } }, //When you populate a field, options allows sorting, limiting, and pagination inside the populated documents.
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// admin gets the detail of how many user has applied for their job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion_id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
