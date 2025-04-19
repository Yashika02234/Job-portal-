import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteCompany, getCompany, getCompanyById, registerCompany, toggleCompanyStatus, updateCompany } from "../controllers/company.controller.js";
import {singleUpload} from '../middlewares/multer.js'
const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
router.route("/toggle-status/:id").put(isAuthenticated, toggleCompanyStatus);
router.route("/delete/:id").delete(isAuthenticated, deleteCompany);

export default router;
