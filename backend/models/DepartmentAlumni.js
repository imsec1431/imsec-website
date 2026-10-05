import mongoose from "mongoose";

const departmentAlumniSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
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

// Department-wise ordering
departmentAlumniSchema.index({
  department: 1,
  order: 1,
});

const DepartmentAlumni = mongoose.model(
  "DepartmentAlumni",
  departmentAlumniSchema,
);

export default DepartmentAlumni;
