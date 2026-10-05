import mongoose from "mongoose";

const departmentOverviewSchema = new mongoose.Schema(
  {
    /* =====================================================
       DEPARTMENT
       One overview for each department
    ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      unique: true,
      index: true,
    },

    /* =====================================================
       BANNER
    ===================================================== */

    bannerTitle: {
      type: String,
      trim: true,
      default: "",
    },
    overviewImage: {
      type: String,
      default: "",
    },

    overviewImagePublicId: {
      type: String,
      default: "",
    },

    /* =====================================================
       ABOUT DEPARTMENT
    ===================================================== */

    aboutDepartment: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       VISION
    ===================================================== */

    vision: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       MISSION
    ===================================================== */

    mission: {
      type: [String],
      default: [],
    },

    /* =====================================================
       HEAD OF DEPARTMENT
    ===================================================== */

    headOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentFaculty",
      default: null,
    },

    /* =====================================================
       DEPARTMENT HIGHLIGHTS
    ===================================================== */

    departmentHighlights: {
      type: [String],
      default: [],
    },

    /* =====================================================
       WHY CHOOSE DEPARTMENT
    ===================================================== */

    whyChooseDepartment: {
      type: [String],
      default: [],
    },

    /* =====================================================
       PLACEMENT STATISTICS
    ===================================================== */

    placementStatistics: [
      {
        label: {
          type: String,
          trim: true,
          default: "",
        },

        value: {
          type: String,
          trim: true,
          default: "",
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        priority: {
          type: Number,
          default: 1,
        },
      },
    ],

    /* =====================================================
       DEPARTMENT GALLERY
    ===================================================== */
    /* =====================================================
   DEPARTMENT GALLERY
===================================================== */

    departmentGallery: [
      {
        imageUrl: {
          type: String,
          trim: true,
          required: true,
        },

        publicId: {
          type: String,
          trim: true,
          required: true,
        },

        title: {
          type: String,
          trim: true,
          default: "",
        },

        priority: {
          type: Number,
          default: 1,
        },
      },
    ],

    /* =====================================================
       JOIN DEPARTMENT / PROGRAMME
    ===================================================== */

    joinDepartmentTitle: {
      type: String,
      trim: true,
      default: "",
    },

    joinDepartmentDescription: {
      type: String,
      trim: true,
      default: "",
    },

    joinDepartmentUrl: {
      type: String,
      trim: true,
      default: "",
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

export default mongoose.model("DepartmentOverview", departmentOverviewSchema);
