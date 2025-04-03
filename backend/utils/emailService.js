import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // true for 465, false for other ports
    port: 465, 
    auth: {
      user: process.env.ADMIN_EMAIL || "ayushranjan132005@gmail.com",
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  /**
 * Send an email notification
 * @param {string} to - Recipient's email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} html - HTML email body
 */

  export const sendEmail = async (to, subject, text, html) => {
    try {
      const info = await transporter.sendMail({
        from: `Carevo(Job Portal) Notifications <ayushranjan132005@gmail.com>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent successfully to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  };

  /**
 * Send a welcome email to the authenticated user
 * @param {mongoose.Types.ObjectId} userId - User ID to send the email to
 */
export const sendWelcomeEmail = async (userId) => {
  try {
    // Fetch user details from MongoDB using Mongoose
    const user = await User.findById(userId).select("email");

    if (!user) {
      throw new Error("User not found.");
    }

    const to = user.email;
    const subject = "Welcome to Carevo!";
    const text = `Hello ${user.fullname}, Welcome to Carevo! We're excited to have you on board.`;
    const html = `<p>Hello ${user.fullname}, <strong>Welcome to Carevo!</strong> We're excited to have you on board.</p>`;

    const emailStatus = await sendEmail(to, subject, text, html);

    if (!emailStatus.success) {
      console.error(`Failed to send welcome email to ${to}`);
    }

    return emailStatus;
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send job notification emails to all users
 * @param {string} title - Job title
 * @param {string} description - Job description
 */
export const sendJobNotificationEmails = async (title, description) => {
    try {
      // Fetch all user emails
      const users = await User.find().select("email");
  
      // Email content
      const subject = "New Job Posting on Carevo!";
      const text = `A new job has been posted: ${title} - ${description}`;
      const html = `<p>A new job opportunity has been posted on <strong>Carevo</strong>!</p>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Description:</strong> ${description}</p>
                    <p>Visit Carevo to apply now!</p>`;
  
      // Send emails to all users in parallel
      const emailPromises = users.map(user => sendEmail(user.email, subject, text, html));
      await Promise.all(emailPromises);
  
      console.log("Job notification emails sent successfully.");
    } catch (error) {
      console.error("Error sending job notification emails:", error);
    }
  };

  /**
 * Send job application email to recruiter
* @param {mongoose.Types.ObjectId} recruiterId - Recruiter's user ID
 * @param {Object} job - Job details
 * @param {Object} applicant - Applicant details
 */
export const sendJobApplicationEmail = async (recruiterId, job, applicant) => {
    try {
      const recruiter = await User.findById(recruiterId).select("email");
      if (!recruiter) {
        throw new Error("Recruiter not found.");
      }
  
      const to = recruiter.email;
      const subject = `New Job Application for ${job.title}`;
      const text = `A new application has been submitted for your job posting: ${job.title}.
                    Applicant Name: ${applicant.name}
                    Applicant Email: ${applicant.email}`;
      const html = `<p>A new application has been submitted for your job posting: <strong>${job.title}</strong>.</p>
                    <p><strong>Applicant Name:</strong> ${applicant.name}</p>
                    <p><strong>Applicant Email:</strong> ${applicant.email}</p>`;
  
      return await sendEmail(to, subject, text, html);
    } catch (error) {
      console.error("Error sending job application email:", error.message);
      return { success: false, error: error.message };
    }
  };
  