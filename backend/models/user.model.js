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
    },
  },
  { timestamps: true } // This enables createdAt & updatedAt
);

export const User = mongoose.model("User", userSchema);
