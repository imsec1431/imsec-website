import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    shortName: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      required: true,
      enum: ["Engineering", "Postgraduate", "Applied Science", "Other"],
      default: "Engineering",
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    publicPath: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    priority: {
      type: Number,
      required: true,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Department", departmentSchema);
