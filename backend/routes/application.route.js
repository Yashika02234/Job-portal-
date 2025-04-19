import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  sendInterviewEmail,
  getUserApplications
} from "../controllers/application.controller.js";

const router = express.Router();

//apply route
router.route("/:id/apply").post(isAuthenticated, applyJob);
router.route("/applied").get(isAuthenticated, getAppliedJobs);

// Add a new route to get all applications for a user
router.route("/user/applications").get(isAuthenticated, getUserApplications);

// Handling applicants and status
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/email/:id/send").post(isAuthenticated, sendInterviewEmail);

export default router;
