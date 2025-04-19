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
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    if(cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

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
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
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
