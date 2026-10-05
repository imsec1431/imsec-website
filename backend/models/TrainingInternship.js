import mongoose from "mongoose";

/* =========================================================
   TEAM MEMBER SCHEMA
========================================================= */

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    photo: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    details: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   DETAIL SCHEMA
========================================================= */

const detailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   DOCUMENT SCHEMA
========================================================= */

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   TRAINING & INTERNSHIP PAGE SCHEMA
========================================================= */

const trainingInternshipSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "training-internship",
    },

    /* =====================================================
       HERO
    ===================================================== */

    hero: {
      title: {
        type: String,
        default: "Training & Internship",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "Training and Internship Cell",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / Training & Internship",
        trim: true,
      },
    },

    /* =====================================================
       INTRODUCTION
    ===================================================== */

    introduction: {
      heading: {
        type: String,
        default: "Training & Internship",
        trim: true,
      },

      description: {
        type: String,
        default:
          "The Training and Internship Cell facilitates training opportunities, internships and industry exposure for students.",
        trim: true,
      },
    },

    /* =====================================================
       TEAM
    ===================================================== */

    team: {
      type: [teamMemberSchema],
      default: [],
    },

    /* =====================================================
       DETAILS
    ===================================================== */

    details: {
      type: [detailSchema],
      default: [],
    },

    /* =====================================================
       DOCUMENTS
    ===================================================== */

    documents: {
      type: [documentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEFAULT DATA
========================================================= */

const getDefaultTrainingInternship = () => ({
  singletonKey: "training-internship",

  hero: {
    title: "Training & Internship",
    subtitle: "Training and Internship Cell",
    breadcrumb: "Home / Training & Internship",
  },

  introduction: {
    heading: "Training & Internship",
    description:
      "The Training and Internship Cell facilitates training opportunities, internships and industry exposure for students.",
  },

  team: [
    {
      name: "Training & Internship Coordinator",
      designation: "Coordinator, Training & Internship Cell",
      qualification: "Faculty Coordinator",
      email: "",
      phone: "",
      photo: "",
      publicId: "",
      details:
        "Responsible for coordinating training and internship activities for students.",
      published: true,
      order: 1,
    },
  ],

  details: [
    {
      title: "Training",
      heading: "Student Training Programs",
      description:
        "Training programs are organized to enhance students' technical, professional and industry-oriented skills.",
      published: true,
      order: 1,
    },

    {
      title: "Internship",
      heading: "Internship Opportunities",
      description:
        "Students are encouraged to undertake internships to gain practical exposure and understand real-world industry practices.",
      published: true,
      order: 2,
    },
  ],

  documents: [],
});

/* =========================================================
   MODEL
========================================================= */

const TrainingInternship =
  mongoose.models.TrainingInternship ||
  mongoose.model("TrainingInternship", trainingInternshipSchema);

export default TrainingInternship;

export { getDefaultTrainingInternship };
