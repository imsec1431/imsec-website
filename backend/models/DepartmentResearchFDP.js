import mongoose from "mongoose";

const departmentResearchFDPSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    coordinator: {
      type: String,
      trim: true,
      default: "",
    },

    organizer: {
      type: String,
      trim: true,
      default: "",
    },

    venue: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: String,
      trim: true,
      default: "",
    },

    endDate: {
      type: String,
      trim: true,
      default: "",
    },

    duration: {
      type: String,
      trim: true,
      default: "",
    },

    mode: {
      type: String,
      trim: true,
      default: "",
    },

    participants: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    url: {
      type: String,
      trim: true,
      default: "",
    },

    documentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    publicId: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

departmentResearchFDPSchema.index({
  department: 1,
  order: 1,
});

const DepartmentResearchFDP = mongoose.model(
  "DepartmentResearchFDP",
  departmentResearchFDPSchema,
);

export default DepartmentResearchFDP;
