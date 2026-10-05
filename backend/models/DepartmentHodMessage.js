import mongoose from "mongoose";

const departmentHodMessageSchema = new mongoose.Schema(
  {
    /* =====================================================
       DEPARTMENT
    ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      unique: true,
      index: true,
    },

    /* =====================================================
       HOD FACULTY
       Uses existing DepartmentFaculty record
    ===================================================== */

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentFaculty",
      required: true,
    },

    /* =====================================================
       MESSAGE TITLE
    ===================================================== */

    title: {
      type: String,
      trim: true,
      default: "Message from the Head of Department",
    },

    /* =====================================================
       MESSAGE
    ===================================================== */

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       STATUS
    ===================================================== */

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

export default mongoose.model(
  "DepartmentHodMessage",
  departmentHodMessageSchema,
);
