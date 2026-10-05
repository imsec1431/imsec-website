import mongoose from "mongoose";

/* =========================================================
   SEMESTER RESULT
========================================================= */

const semesterResultSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
      trim: true,
    },

    result: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   DEPARTMENT ACADEMIC RESULT
========================================================= */

const departmentAcademicResultSchema = new mongoose.Schema(
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
         ACADEMIC RESULTS
         Multiple sessions can belong to one department
      ===================================================== */

    results: [
      {
        /* ================================================
             ACADEMIC YEAR
             Example: 2025-26
          ================================================= */

        academicYear: {
          type: String,
          required: true,
          trim: true,
        },

        /* ================================================
             SESSION
          ================================================= */

        session: {
          type: String,
          enum: ["Odd", "Even"],
          required: true,
        },

        /* ================================================
             CURRENT SESSION
          ================================================= */

        currentSession: {
          type: Boolean,
          default: false,
        },

        /* ================================================
             SEMESTERS
             Dynamic: I, II, III, IV...
          ================================================= */

        semesters: {
          type: [semesterResultSchema],
          default: [],
        },

        /* ================================================
             OVERALL RESULT
             Example: 98%
          ================================================= */

        overallResult: {
          type: String,
          trim: true,
          default: "",
        },

        /* ================================================
             STUDENTS APPEARED
          ================================================= */

        studentsAppeared: {
          type: Number,
          min: 0,
          default: 0,
        },

        /* ================================================
             STUDENTS PASSED
          ================================================= */

        studentsPassed: {
          type: Number,
          min: 0,
          default: 0,
        },

        /* ================================================
             DISPLAY ORDER
          ================================================= */

        displayOrder: {
          type: Number,
          min: 1,
          default: 1,
        },
      },
    ],

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

/* =========================================================
   MODEL
========================================================= */

export default mongoose.model(
  "DepartmentAcademicResult",
  departmentAcademicResultSchema,
);
