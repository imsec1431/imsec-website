import mongoose from "mongoose";

/* =========================================================
   ADMISSION PROCESS MODEL
========================================================= */

const admissionStepSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "file",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   ELIGIBILITY
========================================================= */

const eligibilitySchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    marks: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   ADMISSION MODE
========================================================= */

const admissionModeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   REQUIRED DOCUMENT
========================================================= */

const requiredDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   MAIN SCHEMA
========================================================= */

const admissionProcessSchema = new mongoose.Schema(
  {
    /* =====================================================
       HERO
    ===================================================== */

    heroTag: {
      type: String,
      default: "Admissions Open for this Session",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Admission",
      trim: true,
    },

    heroTitleHighlight: {
      type: String,
      default: "Process",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "Begin your journey toward academic excellence with IMS Engineering College. Our admission process is transparent, student-friendly and designed to make your enrollment simple and hassle-free.",
      trim: true,
    },

    /* =====================================================
       HERO BUTTONS
    ===================================================== */

    applyButtonText: {
      type: String,
      default: "Apply Now",
      trim: true,
    },

    brochureButtonText: {
      type: String,
      default: "Download Brochure",
      trim: true,
    },

    /* =====================================================
       ADMISSION JOURNEY
    ===================================================== */

    journeyLabel: {
      type: String,
      default: "Admission Journey",
      trim: true,
    },

    journeyTitle: {
      type: String,
      default: "Your Admission in 6 Simple Steps",
      trim: true,
    },

    journeyDescription: {
      type: String,
      default:
        "Follow these simple steps to complete your admission and become a part of the IMSEC family.",
      trim: true,
    },

    admissionSteps: {
      type: [admissionStepSchema],
      default: [],
    },

    /* =====================================================
       ELIGIBILITY
    ===================================================== */

    eligibilityLabel: {
      type: String,
      default: "Eligibility",
      trim: true,
    },

    eligibilityTitle: {
      type: String,
      default: "Programme Eligibility Criteria",
      trim: true,
    },

    eligibilityDescription: {
      type: String,
      default:
        "Before applying, ensure that you meet the minimum eligibility requirements for your desired programme.",
      trim: true,
    },

    eligibility: {
      type: [eligibilitySchema],
      default: [],
    },

    /* =====================================================
       ADMISSION MODES
    ===================================================== */

    admissionModeLabel: {
      type: String,
      default: "Admission Modes",
      trim: true,
    },

    admissionModeTitle: {
      type: String,
      default: "Choose Your Admission Path",
      trim: true,
    },

    admissionModeDescription: {
      type: String,
      default:
        "Students can secure admission through different admission channels as per university and institute guidelines.",
      trim: true,
    },

    admissionModes: {
      type: [admissionModeSchema],
      default: [],
    },

    /* =====================================================
       DOCUMENTS
    ===================================================== */

    documentLabel: {
      type: String,
      default: "Documents Required",
      trim: true,
    },

    documentTitle: {
      type: String,
      default: "Admission Checklist",
      trim: true,
    },

    documentDescription: {
      type: String,
      default:
        "Keep the following documents ready before reporting for admission.",
      trim: true,
    },

    requiredDocuments: {
      type: [requiredDocumentSchema],
      default: [],
    },

    /* =====================================================
       IMPORTANT DATES
    ===================================================== */

    importantDatesEnabled: {
      type: Boolean,
      default: false,
    },

    importantDateLabel: {
      type: String,
      default: "Admission Schedule",
      trim: true,
    },

    importantDateTitle: {
      type: String,
      default: "Important Dates",
      trim: true,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    isPublished: {
      type: Boolean,
      default: true,
    },

    /* =====================================================
       SINGLE DOCUMENT
    ===================================================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const AdmissionProcess = mongoose.model(
  "AdmissionProcess",
  admissionProcessSchema,
);

export default AdmissionProcess;
