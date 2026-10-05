import mongoose from "mongoose";

/* =========================================================
   FEE ROW SCHEMA
========================================================= */

const feeRowSchema = new mongoose.Schema(
  {
    particulars: {
      type: String,
      required: true,
      trim: true,
    },

    amounts: {
      type: [String],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   COURSE FEE SCHEMA
========================================================= */

const courseFeeSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    years: {
      type: Number,
      default: 1,
    },

    feeRows: {
      type: [feeRowSchema],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   HOSTEL ROW SCHEMA
========================================================= */

const hostelRowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   HOSTEL SCHEMA
========================================================= */

const hostelSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: true,
      trim: true,
    },

    locationLabel: {
      type: String,
      default: "On Campus",
      trim: true,
    },

    rows: {
      type: [hostelRowSchema],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   PAYMENT OPTION SCHEMA
========================================================= */

const paymentOptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   SCHOLARSHIP SCHEMA
========================================================= */

const scholarshipSchema = new mongoose.Schema(
  {
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

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   EDUCATION LOAN SCHEMA
========================================================= */

const educationLoanSchema = new mongoose.Schema(
  {
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

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   MAIN FEE STRUCTURE SCHEMA
========================================================= */

const feeStructureSchema = new mongoose.Schema(
  {
    /* -----------------------------------------------------
       BASIC INFORMATION
    ----------------------------------------------------- */

    title: {
      type: String,

      default: "Fee Structure",

      trim: true,
    },

    subtitle: {
      type: String,

      default:
        "Transparent and comprehensive fee details for students and parents.",

      trim: true,
    },

    academicYear: {
      type: String,

      default: "2025-26",

      trim: true,
    },

    heroLabel: {
      type: String,

      default: "ADMISSIONS",

      trim: true,
    },

    heroTitle: {
      type: String,

      default: "Fee Structure",

      trim: true,
    },

    heroDescription: {
      type: String,

      default:
        "Explore the fee structure for various programmes offered by IMS Engineering College.",

      trim: true,
    },

    note: {
      type: String,

      default:
        "The fee structure mentioned below is indicative and may be revised as per university and regulatory guidelines.",

      trim: true,
    },

    /* -----------------------------------------------------
       COURSE FEES
    ----------------------------------------------------- */

    courses: {
      type: [courseFeeSchema],

      default: [],
    },

    /* -----------------------------------------------------
       HOSTEL
    ----------------------------------------------------- */

    hostels: {
      type: [hostelSchema],

      default: [],
    },

    /* -----------------------------------------------------
       PAYMENT OPTIONS
    ----------------------------------------------------- */

    paymentOptions: {
      type: [paymentOptionSchema],

      default: [],
    },

    /* -----------------------------------------------------
       SCHOLARSHIPS
    ----------------------------------------------------- */

    scholarships: {
      type: [scholarshipSchema],

      default: [],
    },

    /* -----------------------------------------------------
       EDUCATION LOANS
    ----------------------------------------------------- */

    educationLoans: {
      type: [educationLoanSchema],

      default: [],
    },

    /* -----------------------------------------------------
       IMPORTANT NOTES
    ----------------------------------------------------- */

    importantNotes: {
      type: [String],

      default: [],
    },

    /* -----------------------------------------------------
       PUBLISH STATUS
    ----------------------------------------------------- */

    isPublished: {
      type: Boolean,

      default: true,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const FeeStructure =
  mongoose.models.FeeStructure ||
  mongoose.model("FeeStructure", feeStructureSchema);

/* =========================================================
   ES6 DEFAULT EXPORT
========================================================= */

export default FeeStructure;
