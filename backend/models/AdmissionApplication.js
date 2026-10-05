import mongoose from "mongoose";

/* =========================================================
   ADMISSION APPLICATION SCHEMA
========================================================= */

const admissionApplicationSchema = new mongoose.Schema(
  {
    /* =====================================================
       APPLICATION
    ===================================================== */

    applicationNo: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Approved",
        "Rejected",
      ],
      default: "Submitted",
      index: true,
    },

    /* =====================================================
       PERSONAL DETAILS
    ===================================================== */

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },

    mobile: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },

    alternateMobile: {
      type: String,
      trim: true,
      default: "",
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      trim: true,
      default: "",
    },

    bloodGroup: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    nationality: {
      type: String,
      trim: true,
      default: "Indian",
    },

    aadhaar: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       PARENT / FAMILY DETAILS
    ===================================================== */

    fatherName: {
      type: String,
      trim: true,
      default: "",
    },

    fatherOccupation: {
      type: String,
      trim: true,
      default: "",
    },

    motherName: {
      type: String,
      trim: true,
      default: "",
    },

    motherOccupation: {
      type: String,
      trim: true,
      default: "",
    },

    annualIncome: {
      type: String,
      trim: true,
      default: "",
    },

    religion: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       ADDRESS
    ===================================================== */

    address: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    district: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    pinCode: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       10TH
    ===================================================== */

    board10: {
      type: String,
      trim: true,
      default: "",
    },

    school10: {
      type: String,
      trim: true,
      default: "",
    },

    roll10: {
      type: String,
      trim: true,
      default: "",
    },

    year10: {
      type: String,
      trim: true,
      default: "",
    },

    marks10: {
      type: String,
      trim: true,
      default: "",
    },

    medium10: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       12TH
    ===================================================== */

    board12: {
      type: String,
      trim: true,
      default: "",
    },

    school12: {
      type: String,
      trim: true,
      default: "",
    },

    roll12: {
      type: String,
      trim: true,
      default: "",
    },

    year12: {
      type: String,
      trim: true,
      default: "",
    },

    marks12: {
      type: String,
      trim: true,
      default: "",
    },

    stream12: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       GRADUATION
    ===================================================== */

    graduationUniversity: {
      type: String,
      trim: true,
      default: "",
    },

    graduationCollege: {
      type: String,
      trim: true,
      default: "",
    },

    graduationProgramme: {
      type: String,
      trim: true,
      default: "",
    },

    graduationBranch: {
      type: String,
      trim: true,
      default: "",
    },

    graduationYear: {
      type: String,
      trim: true,
      default: "",
    },

    graduationMarks: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       ENTRANCE EXAM
    ===================================================== */

    entranceExam: {
      type: String,
      trim: true,
      default: "",
    },

    entranceAppNo: {
      type: String,
      trim: true,
      default: "",
    },

    entranceRollNo: {
      type: String,
      trim: true,
      default: "",
    },

    entranceRank: {
      type: String,
      trim: true,
      default: "",
    },

    entranceScore: {
      type: String,
      trim: true,
      default: "",
    },

    entranceYear: {
      type: String,
      trim: true,
      default: "",
    },

    achievements: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       COURSE / ADMISSION PREFERENCE
    ===================================================== */

    programme: {
      type: String,
      trim: true,
      required: true,
    },

    branch: {
      type: String,
      trim: true,
      default: "",
    },

    admissionType: {
      type: String,
      trim: true,
      default: "",
    },

    session: {
      type: String,
      trim: true,
      default: "2026-27",
      index: true,
    },

    hostel: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    transport: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    scholarship: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    /* =====================================================
       DOCUMENTS
       
       Keep URLs rather than storing files in MongoDB.
       These can later be connected to your existing
       Multer / Cloudinary upload system.
    ===================================================== */

    photographUrl: {
      type: String,
      trim: true,
      default: "",
    },

    photographPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    aadhaarDocumentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    aadhaarDocumentPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    marksheet10Url: {
      type: String,
      trim: true,
      default: "",
    },

    marksheet10PublicId: {
      type: String,
      trim: true,
      default: "",
    },

    marksheet12Url: {
      type: String,
      trim: true,
      default: "",
    },

    marksheet12PublicId: {
      type: String,
      trim: true,
      default: "",
    },

    otherDocumentUrl: {
      type: String,
      trim: true,
      default: "",
    },

    otherDocumentPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       DECLARATION
    ===================================================== */

    declarationAccepted: {
      type: Boolean,
      default: false,
    },

    /* =====================================================
       ADMIN NOTES
    ===================================================== */

    adminRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       SUBMISSION
    ===================================================== */

    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   APPLICATION NUMBER
========================================================= */

admissionApplicationSchema.pre("save", async function (next) {
  if (!this.applicationNo && this.isNew) {
    const year = new Date().getFullYear();

    const randomPart = Math.floor(100000 + Math.random() * 900000);

    this.applicationNo = `IMSEC-${year}-${randomPart}`;
  }

  this.updatedAt = new Date();

  next();
});

/* =========================================================
   INDEXES
========================================================= */

admissionApplicationSchema.index({
  session: 1,
  programme: 1,
  branch: 1,
});

admissionApplicationSchema.index({
  status: 1,
  submittedAt: -1,
});

admissionApplicationSchema.index({
  email: 1,
  mobile: 1,
});

/* =========================================================
   MODEL
========================================================= */

const AdmissionApplication =
  mongoose.models.AdmissionApplication ||
  mongoose.model("AdmissionApplication", admissionApplicationSchema);

export default AdmissionApplication;
