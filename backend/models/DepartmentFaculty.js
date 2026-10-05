import mongoose from "mongoose";

const departmentFacultySchema = new mongoose.Schema(
  {
    /* =====================================================
       DEPARTMENT
    ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    /* =====================================================
       FACULTY NAME
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       DESIGNATION
    ===================================================== */

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       QUALIFICATION
    ===================================================== */

    qualification: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       EXPERIENCE
    ===================================================== */

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       SPECIALIZATION
    ===================================================== */

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       PHOTO
    ===================================================== */

    photo: {
      url: {
        type: String,
        trim: true,
        default: "",
      },

      publicId: {
        type: String,
        trim: true,
        default: "",
      },
    },
    /* =====================================================
       EMAIL
    ===================================================== */

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    /* =====================================================
       PHONE
    ===================================================== */

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       LINKEDIN
       OPTIONAL
    ===================================================== */

    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       HOD
    ===================================================== */

    isHOD: {
      type: Boolean,
      default: false,
    },

    /* =====================================================
       PRIORITY
    ===================================================== */

    priority: {
      type: Number,
      default: 1,
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

export default mongoose.model("DepartmentFaculty", departmentFacultySchema);
