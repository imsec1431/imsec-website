import mongoose from "mongoose";

const departmentResearchPatentSchema = new mongoose.Schema(
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

    inventors: {
      type: String,
      trim: true,
      default: "",
    },

    applicant: {
      type: String,
      trim: true,
      default: "",
    },

    patentNumber: {
      type: String,
      trim: true,
      default: "",
    },

    applicationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    filingDate: {
      type: String,
      trim: true,
      default: "",
    },

    publicationDate: {
      type: String,
      trim: true,
      default: "",
    },

    grantDate: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      trim: true,
      default: "",
    },

    patentOffice: {
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

departmentResearchPatentSchema.index({
  department: 1,
  order: 1,
});

const DepartmentResearchPatent = mongoose.model(
  "DepartmentResearchPatent",
  departmentResearchPatentSchema,
);

export default DepartmentResearchPatent;
