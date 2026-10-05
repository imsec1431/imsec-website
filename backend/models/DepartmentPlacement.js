import mongoose from "mongoose";

/* =========================================================
   PLACEMENT STATISTICS
========================================================= */

const placementStatisticsSchema = new mongoose.Schema(
  {
    placementRate: {
      type: String,
      trim: true,
      default: "",
    },

    highestPackage: {
      type: String,
      trim: true,
      default: "",
    },

    averagePackage: {
      type: String,
      trim: true,
      default: "",
    },

    offersReceived: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   TOP RECRUITERS
========================================================= */

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   YEAR-WISE PLACEMENT
========================================================= */

const placementHistorySchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
    },

    percentage: {
      type: String,

      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   HIGHEST PACKAGE ACHIEVERS
========================================================= */

const topPlacementSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   PLACEMENT TRAINING ACTIVITIES
========================================================= */

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   PLACEMENT PROCESS
========================================================= */

const processSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   STUDENT EXPERIENCES
========================================================= */

const testimonialSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   DEPARTMENT PLACEMENT
========================================================= */

const departmentPlacementSchema = new mongoose.Schema(
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
         PLACEMENT STATISTICS
      ===================================================== */

    placementStatistics: {
      type: placementStatisticsSchema,
      default: () => ({}),
    },

    /* =====================================================
         TOP RECRUITERS
      ===================================================== */

    recruiters: {
      type: [recruiterSchema],
      default: [],
    },

    /* =====================================================
         YEAR-WISE PLACEMENT STATISTICS
      ===================================================== */

    placementHistory: {
      type: [placementHistorySchema],
      default: [],
    },

    /* =====================================================
         HIGHEST PACKAGE ACHIEVERS
      ===================================================== */

    topPlacements: {
      type: [topPlacementSchema],
      default: [],
    },

    /* =====================================================
         PLACEMENT TRAINING ACTIVITIES
      ===================================================== */

    trainings: {
      type: [trainingSchema],
      default: [],
    },

    /* =====================================================
         PLACEMENT PROCESS
      ===================================================== */

    process: {
      type: [processSchema],
      default: [],
    },

    /* =====================================================
         STUDENT EXPERIENCES
      ===================================================== */

    testimonials: {
      type: [testimonialSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DepartmentPlacement", departmentPlacementSchema);
