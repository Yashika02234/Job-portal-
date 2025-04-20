import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    console.log(fullname, email, phoneNumber, password, role);
    
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "All the fields aren't filled", success: false });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User has already an Account", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto:cloudResponse.secure_url,
      }
    });

    // Send welcome email after successful registration
    await sendWelcomeEmail(newUser._id);

    return res
      .status(201)
      .json({ message: "Account created Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All the fields aren't filled", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect Email or Password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect Email or Password", success: false });
    }

    if (role !== user.role) {
      return res
        .status(400)
        .json({
          message: "Account doesn't exist with this role",
          success: false,
        });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome Back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, title, location, available, skills } = req.body;
    const files = req.files;

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // Handle resume file if provided
    if (files && files.resume && files.resume[0]) {
      try {
        const resumeFile = files.resume[0];
        
        // Check file size - limit to 5MB
        if (resumeFile.size > 5 * 1024 * 1024) {
          return res.status(400).json({ 
            message: "Resume file is too large. Maximum size is 5MB", 
            success: false 
          });
        }
        
        const resumeUri = getDataUri(resumeFile);
        
        // Set timeout and optimization options for Cloudinary
        const resumeResponse = await cloudinary.uploader.upload(resumeUri.content, {
          resource_type: 'auto',
          folder: 'resumes',
          timeout: 60000, // 60 second timeout
        });
        
        if (resumeResponse) {
          user.profile.resume = resumeResponse.secure_url;
          user.profile.resumeOriginalName = resumeFile.originalname;
        }
      } catch (uploadError) {
        console.log("Resume upload error:", uploadError);
        // Continue with profile update even if resume upload fails
      }
    }

    // Handle profile photo if provided
    if (files && files.profilePhoto && files.profilePhoto[0]) {
      try {
        const photoFile = files.profilePhoto[0];
        
        // Check file size - limit to 2MB
        if (photoFile.size > 2 * 1024 * 1024) {
          return res.status(400).json({ 
            message: "Profile photo is too large. Maximum size is 2MB", 
            success: false 
          });
        }
        
        const photoUri = getDataUri(photoFile);
        
        // Set timeout and optimization options for Cloudinary
        const photoResponse = await cloudinary.uploader.upload(photoUri.content, {
          resource_type: 'image',
          folder: 'profile_photos',
          transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' }
          ],
          timeout: 30000, // 30 second timeout
        });
        
        if (photoResponse) {
          user.profile.profilePhoto = photoResponse.secure_url;
        }
      } catch (uploadError) {
        console.log("Profile photo upload error:", uploadError);
        // Continue with profile update even if photo upload fails
      }
    }

    // Parse skills from JSON string
    let skillsArray;
    if (skills) {
      try {
        skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (error) {
        console.log("Error parsing skills:", error);
      }
    }

    // Update user fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    // Update profile fields
    if (bio) user.profile.bio = bio;
    if (title) user.profile.title = title;
    if (location) user.profile.location = location;
    if (available !== undefined) user.profile.available = available === 'true';
    if (skillsArray) user.profile.skills = skillsArray;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .json({ message: "Profile updated Successfully", user, success: true });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ 
      message: error.message || "Internal Server Error", 
      success: false 
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { experience } = req.body;
    
    if (!experience) {
      return res
        .status(400)
        .json({ message: "No experience data provided", success: false });
    }
    
    let experienceArray;
    try {
      // Try to parse the experience data if it's a JSON string
      experienceArray = typeof experience === 'string' ? JSON.parse(experience) : experience;
    } catch (e) {
      return res
        .status(400)
        .json({ message: "Invalid experience data format", success: false });
    }
    
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    
    // Update the experience array
    user.profile.experience = experienceArray;
    await user.save();
    
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    
    return res
      .status(200)
      .json({ message: "Experience updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { education } = req.body;
    
    if (!education) {
      return res
        .status(400)
        .json({ message: "No education data provided", success: false });
    }
    
    let educationArray;
    try {
      // Try to parse the education data if it's a JSON string
      educationArray = typeof education === 'string' ? JSON.parse(education) : education;
    } catch (e) {
      return res
        .status(400)
        .json({ message: "Invalid education data format", success: false });
    }
    
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    
    // Update the education array
    user.profile.education = educationArray;
    await user.save();
    
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    
    return res
      .status(200)
      .json({ message: "Education updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateCertifications = async (req, res) => {
  try {
    const { certifications } = req.body;
    
    if (!certifications) {
      return res
        .status(400)
        .json({ message: "No certifications data provided", success: false });
    }
    
    let certificationsArray;
    try {
      // Try to parse the certifications data if it's a JSON string
      certificationsArray = typeof certifications === 'string' ? JSON.parse(certifications) : certifications;
    } catch (e) {
      return res
        .status(400)
        .json({ message: "Invalid certifications data format", success: false });
    }
    
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    
    // Update the certifications array
    user.profile.certifications = certificationsArray;
    await user.save();
    
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    
    return res
      .status(200)
      .json({ message: "Certifications updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
