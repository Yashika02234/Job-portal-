import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"], //is used to specify a set of allowed values for a field.
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }], // Array of String (coding lang).
      resume: { type: String }, // URL of the Resume file.
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, //building a relation between (user and company) Table.
      profilePhoto: {
        type: String, // URL of photo.
        default: "",
      },
      title: { type: String },
      location: { type: String },
      available: { type: Boolean, default: false },
      experience: [{
        company: { type: String },
        position: { type: String },
        duration: { type: String },
        description: { type: String }
      }],
      education: [{
        institution: { type: String },
        degree: { type: String },
        duration: { type: String },
        description: { type: String }
      }],
      certifications: [{ type: String }]
    },
  },
  { timestamps: true } // This enables createdAt & updatedAt
);

export const User = mongoose.model("User", userSchema);
