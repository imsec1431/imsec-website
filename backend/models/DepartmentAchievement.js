import mongoose from "mongoose";

const collegeBranchTopperSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    sgpa: {
      type: String,
      required: true,
      trim: true,
    },

    studentBatch: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const globalAchievementSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    programName: {
      type: String,
      required: true,
      trim: true,
    },

    cashPrize: {
      type: String,
      required: true,
      trim: true,
    },

    studentBatch: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const internshipSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    stipend: {
      type: String,
      trim: true,
      default: "-",
    },

    studentBatch: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const departmentAchievementSchema = new mongoose.Schema(
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
         COLLEGE BRANCH TOPPERS
      ===================================================== */

    collegeBranchToppers: {
      type: [collegeBranchTopperSchema],
      default: [],
    },

    /* =====================================================
         STUDENT GLOBAL ACHIEVEMENTS
      ===================================================== */

    globalAchievements: {
      type: [globalAchievementSchema],
      default: [],
    },

    /* =====================================================
         INTERNSHIPS
      ===================================================== */

    internships: {
      type: [internshipSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "DepartmentAchievement",
  departmentAchievementSchema,
);
