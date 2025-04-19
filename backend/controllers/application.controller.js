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

    // Check if the company is active
    if (job.company.isActive === false) {
      return res.status(403).json({
        message: "Cannot apply to a job from an inactive company",
        success: false,
      });
    }

    // Check if the job is active
    if (job.status === 'rejected' || job.status === 'closed') {
      return res.status(403).json({
        message: "This job is no longer accepting applications",
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
    return res.status(500).json({
      message: "An error occurred while applying for the job",
      success: false,
    });
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
    const application = await Application.findById(applicationId)
      .populate({
        path: "applicant",
        select: "email fullname"
      })
      .populate({
        path: "job",
        select: "title company",
        populate: {
          path: "company",
          select: "name"
        }
      });
      
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    // Send notification email to the applicant about status change
    const applicant = application.applicant;
    const job = application.job;
    
    if (applicant && applicant.email) {
      let emailSubject = '';
      let emailBody = '';
      
      if (status.toLowerCase() === 'shortlisted') {
        emailSubject = `You've been shortlisted for ${job.title} at ${job.company.name}`;
        emailBody = `Dear ${applicant.fullname},\n\nCongratulations! You have been shortlisted for the position of ${job.title} at ${job.company.name}.\n\nPlease check your account dashboard for more information.\n\nBest regards,\n${job.company.name} Recruitment Team`;
      } else if (status.toLowerCase() === 'rejected') {
        emailSubject = `Update on your application for ${job.title} at ${job.company.name}`;
        emailBody = `Dear ${applicant.fullname},\n\nThank you for your interest in the ${job.title} position at ${job.company.name}.\n\nAfter careful consideration, we have decided to pursue other candidates whose qualifications more closely match our current needs.\n\nWe appreciate your interest in ${job.company.name} and wish you the best in your job search.\n\nBest regards,\n${job.company.name} Recruitment Team`;
      }
      
      if (emailSubject && emailBody) {
        try {
          await sendStatusUpdateEmail(applicant.email, emailSubject, emailBody);
        } catch (emailError) {
          console.error("Error sending status update email:", emailError);
          // Continue processing even if email fails
        }
      }
    }

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while updating status.",
      success: false,
    });
  }
};

// Send interview invitation email to applicant
export const sendInterviewEmail = async (req, res) => {
  try {
    const { message } = req.body;
    const applicationId = req.params.id;
    
    if (!message) {
      return res.status(400).json({
        message: "Email message is required",
        success: false,
      });
    }

    // Find the application with applicant and job details
    const application = await Application.findById(applicationId)
      .populate({
        path: "applicant",
        select: "email fullname"
      })
      .populate({
        path: "job",
        select: "title company",
        populate: {
          path: "company",
          select: "name"
        }
      });
      
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    const applicant = application.applicant;
    const job = application.job;
    
    if (!applicant || !applicant.email) {
      return res.status(404).json({
        message: "Applicant email not found.",
        success: false,
      });
    }

    // Send interview email
    const emailSubject = `Interview Invitation: ${job.title} at ${job.company.name}`;
    
    try {
      await sendStatusUpdateEmail(applicant.email, emailSubject, message);
      
      // Update application status to shortlisted
      application.status = 'shortlisted';
      await application.save();
      
      return res.status(200).json({
        message: "Interview invitation sent successfully.",
        success: true,
      });
    } catch (emailError) {
      console.error("Error sending interview email:", emailError);
      return res.status(500).json({
        message: "Failed to send interview invitation.",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while sending interview invitation.",
      success: false,
    });
  }
};

// Helper function to send status update emails
const sendStatusUpdateEmail = async (email, subject, message) => {
  // Use your existing email service or implement a new one
  // This is a simplified version - replace with your actual email sending implementation
  console.log(`Sending email to ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // For example, if you're using nodemailer:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({
  //   from: 'company@example.com',
  //   to: email,
  //   subject: subject,
  //   text: message
  // });
  
  // For now, just return success
  return true;
};
