import mongoose from "mongoose";

// ======================================================
// ENUMS
// ======================================================

const divisionEnum = ["First", "Second", "Third"];

// ======================================================
// CAREER APPLICATION SCHEMA
// ======================================================

const careerApplicationSchema = new mongoose.Schema(
  {
    // ====================================================
    // CAREER OPENING
    // ====================================================

    careerOpeningId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "CareerOpening",

      required: true,

      index: true,
    },

    postApplied: {
      type: String,

      required: [true, "Post applied is required"],

      trim: true,
    },

    department: {
      type: String,

      required: [true, "Department is required"],

      trim: true,
    },

    // ====================================================
    // PERSONAL DETAILS
    // ====================================================

    candidateName: {
      type: String,

      required: [true, "Candidate name is required"],

      trim: true,
    },

    dateOfBirth: {
      type: Date,

      required: [true, "Date of birth is required"],
    },

    mobileNo: {
      type: String,

      required: [true, "Mobile number is required"],

      trim: true,

      match: [/^[6-9]\d{9}$/, "Please enter a valid 10 digit mobile number"],
    },

    emailId: {
      type: String,

      required: [true, "Email is required"],

      trim: true,

      lowercase: true,

      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // ====================================================
    // 10TH
    // ====================================================

    tenthDivision: {
      type: String,

      enum: {
        values: divisionEnum,

        message: "Please select a valid 10th division.",
      },

      required: [true, "10th division is required"],
    },

    // ====================================================
    // 12TH
    // ====================================================

    twelfthPercentage: {
      type: Number,

      required: [true, "12th percentage is required"],

      min: 0,

      max: 100,
    },

    twelfthDivision: {
      type: String,

      enum: {
        values: divisionEnum,

        message: "Please select a valid 12th division.",
      },

      required: [true, "12th division is required"],
    },

    // ====================================================
    // GRADUATION
    // ====================================================

    graduationStream: {
      type: String,

      enum: {
        values: ["B.Tech", "BBA", "BCA", "BA", "B.Com", "Others"],

        message: "Please select a valid graduation stream.",
      },

      required: [true, "Graduation stream is required"],
    },

    graduationStreamOther: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.graduationStream === "Others";
      },
    },

    graduationUniversity: {
      type: String,

      required: [true, "Graduation university is required"],

      trim: true,
    },

    ugPercentage: {
      type: Number,

      required: [true, "Graduation percentage is required"],

      min: 0,

      max: 100,
    },

    ugDivision: {
      type: String,

      enum: {
        values: divisionEnum,

        message: "Please select a valid graduation division.",
      },

      required: [true, "Graduation division is required"],
    },

    // ====================================================
    // POST GRADUATION
    // ====================================================

    postGraduationStream: {
      type: String,

      enum: {
        values: ["M.Tech", "MCA", "MBA", "Others"],

        message: "Please select a valid post-graduation stream.",
      },

      required: [true, "Post-graduation stream is required"],
    },

    postGraduationStreamOther: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.postGraduationStream === "Others";
      },
    },

    postGraduationUniversity: {
      type: String,

      required: [true, "Post-graduation university is required"],

      trim: true,
    },

    postGraduationSpecialisation: {
      type: String,

      required: [true, "Post-graduation specialisation is required"],

      trim: true,
    },

    pgPercentage: {
      type: Number,

      required: [true, "Post-graduation percentage is required"],

      min: 0,

      max: 100,
    },

    pgDivision: {
      type: String,

      enum: {
        values: divisionEnum,

        message: "Please select a valid post-graduation division.",
      },

      required: [true, "Post-graduation division is required"],
    },

    // ====================================================
    // NET
    // ====================================================

    netQualified: {
      type: String,

      enum: {
        values: ["Yes", "No"],

        message: "Please select Yes or No for NET.",
      },

      required: [true, "NET qualification is required"],
    },

    // ====================================================
    // Ph.D.
    // ====================================================

    phdStatus: {
      type: String,

      enum: {
        values: ["No", "Pursuing", "Awarded"],

        message: "Please select a valid Ph.D. status.",
      },

      required: [true, "Ph.D. status is required"],
    },

    // ----------------------------------------------------
    // Ph.D. UNIVERSITY
    //
    // Pursuing → required
    // Awarded  → required
    // No       → optional
    // ----------------------------------------------------

    phdUniversity: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.phdStatus === "Pursuing" || this.phdStatus === "Awarded";
      },
    },

    // ----------------------------------------------------
    // Ph.D. DETAILS
    //
    // Pursuing → required
    // Awarded  → required
    // No       → optional
    // ----------------------------------------------------

    phdDetail: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.phdStatus === "Pursuing" || this.phdStatus === "Awarded";
      },
    },

    // ----------------------------------------------------
    // Ph.D. SPECIALISATION
    //
    // Pursuing → required
    // Awarded  → required
    // No       → optional
    // ----------------------------------------------------

    phdSpecialisation: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.phdStatus === "Pursuing" || this.phdStatus === "Awarded";
      },
    },

    // ----------------------------------------------------
    // REGISTRATION DATE
    //
    // No       → NOT required
    // Pursuing → REQUIRED
    // Awarded  → NOT required
    // ----------------------------------------------------

    phdRegistrationDate: {
      type: Date,

      default: null,

      required: function () {
        return this.phdStatus === "Pursuing";
      },
    },

    // ----------------------------------------------------
    // AWARDED ON
    //
    // No       → NOT required
    // Pursuing → NOT required
    // Awarded  → REQUIRED
    // ----------------------------------------------------

    phdAwardedOn: {
      type: Date,

      default: null,

      required: function () {
        return this.phdStatus === "Awarded";
      },
    },

    // ====================================================
    // OTHER QUALIFICATION
    // ====================================================

    otherQualification: {
      type: String,

      default: "",

      trim: true,
    },

    // ====================================================
    // EXPERIENCE
    // ====================================================

    teachingExperience: {
      type: String,

      default: "",

      trim: true,
    },

    industryExperience: {
      type: String,

      default: "",

      trim: true,
    },

    otherExperience: {
      type: String,

      default: "",

      trim: true,
    },

    // ====================================================
    // PUBLICATIONS
    // ====================================================

    totalPublication: {
      type: Number,

      min: 0,

      default: 0,
    },

    nationalJournals: {
      type: Number,

      min: 0,

      default: 0,
    },

    internationalJournals: {
      type: Number,

      min: 0,

      default: 0,
    },

    nationalConference: {
      type: Number,

      min: 0,

      default: 0,
    },

    internationalConference: {
      type: Number,

      min: 0,

      default: 0,
    },

    sciIndexed: {
      type: Number,

      min: 0,

      default: 0,
    },

    scopusIndexed: {
      type: Number,

      min: 0,

      default: 0,
    },

    ugcCareIndexed: {
      type: Number,

      min: 0,

      default: 0,
    },

    otherIndexed: {
      type: Number,

      min: 0,

      default: 0,
    },

    // ====================================================
    // GRANT
    // ====================================================

    grantReceived: {
      type: String,

      enum: {
        values: ["Yes", "No"],

        message: "Please select Yes or No for grant received.",
      },

      required: [true, "Grant received is required"],
    },

    grantHead: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.grantReceived === "Yes";
      },
    },

    fundingAgency: {
      type: String,

      default: "",

      trim: true,

      required: function () {
        return this.grantReceived === "Yes";
      },
    },

    grantAmount: {
      type: Number,

      default: null,

      min: 0,

      required: function () {
        return this.grantReceived === "Yes";
      },
    },

    // ====================================================
    // CV / RESUME
    // ====================================================

    resumeFile: {
      type: String,

      required: [true, "CV / Resume is required"],

      trim: true,
    },

    resumeOriginalName: {
      type: String,

      required: [true, "Original CV / Resume name is required"],

      trim: true,
    },

    resumePublicId: {
      type: String,

      default: "",

      trim: true,
    },

    // ====================================================
    // SUBMISSION
    // ====================================================

    submittedAt: {
      type: Date,

      default: Date.now,

      index: true,
    },
  },

  {
    timestamps: true,
  },
);

// ======================================================
// MODEL
// ======================================================

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema,
);

export default CareerApplication;
