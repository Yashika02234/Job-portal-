import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique : true
    },
    description: {
      type: String
    },
    website: {
      type: String,
    },
    loacation: {
      type: String,
    },
    logo: {
      type: String, // URL of company logo
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // to build a connection between two Collections
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // This enables createdAt & updatedAt
);

export const Company = mongoose.model("Company", companySchema);
