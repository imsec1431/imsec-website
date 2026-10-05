import mongoose from "mongoose";

/* =========================================================
   NOTICE SCHEMA
========================================================= */

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    driveLink: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   TIME TABLE SCHEMA
========================================================= */

const timeTableSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "Class Time Table",
      trim: true,
    },

    driveLink: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   SYLLABUS SCHEMA
========================================================= */

const syllabusSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    driveLink: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   STUDENT CORNER MAIN SCHEMA
========================================================= */

const studentCornerSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      unique: true,
    },

    notices: {
      type: [noticeSchema],
      default: [],
    },

    timeTables: {
      type: [timeTableSchema],
      default: [],
    },

    syllabus: {
      type: [syllabusSchema],
      default: [],
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

/* =========================================================
   MODEL
========================================================= */

const StudentCorner = mongoose.model("StudentCorner", studentCornerSchema);

export default StudentCorner;
