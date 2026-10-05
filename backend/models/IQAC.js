import mongoose from "mongoose";

const iqacMemberSchema = new mongoose.Schema(
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

    role: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const iqacDocumentSchema = new mongoose.Schema(
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
  { _id: true },
);

const iqacInitiativeSchema = new mongoose.Schema(
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

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const iqacSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "iqac",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "IQAC",
    },

    heroSubtitle: {
      type: String,
      required: true,
      trim: true,
      default: "Internal Quality Assurance Cell",
    },

    breadcrumb: {
      type: String,
      required: true,
      trim: true,
      default: "Home / IQAC",
    },

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Internal Quality Assurance Cell",
    },

    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "The Internal Quality Assurance Cell (IQAC) is established to promote continuous improvement in the academic and administrative quality of the institution. IQAC facilitates quality enhancement initiatives, documentation, feedback and systematic monitoring of institutional processes.",
    },

    aboutHeading: {
      type: String,
      default: "About IQAC",
      trim: true,
    },

    aboutDescription: {
      type: String,
      default:
        "IQAC works as a quality enhancement mechanism within the institution. It encourages a consistent approach towards improving teaching-learning processes, academic practices, institutional activities and overall student development.",
      trim: true,
    },

    functionsHeading: {
      type: String,
      default: "IQAC Functions",
      trim: true,
    },

    functionsDescription: {
      type: String,
      default:
        "IQAC facilitates quality-related initiatives, documentation, feedback analysis, academic and administrative improvements and continuous quality monitoring across the institution.",
      trim: true,
    },

    membersHeading: {
      type: String,
      default: "IQAC Composition",
      trim: true,
    },

    membersDescription: {
      type: String,
      default:
        "The IQAC consists of representatives from different areas of the institution who contribute towards planning, monitoring and continuous quality improvement.",
      trim: true,
    },

    meetingsHeading: {
      type: String,
      default: "IQAC Meetings",
      trim: true,
    },

    meetingsDescription: {
      type: String,
      default:
        "IQAC meetings are conducted periodically to review quality initiatives, discuss institutional requirements and plan activities for continuous improvement.",
      trim: true,
    },

    initiativesHeading: {
      type: String,
      default: "Quality Initiatives",
      trim: true,
    },

    initiativesDescription: {
      type: String,
      default:
        "The institution undertakes various quality enhancement initiatives through systematic planning, implementation, review and continuous improvement.",
      trim: true,
    },

    documentsHeading: {
      type: String,
      default: "IQAC Reports & Documents",
      trim: true,
    },

    coordinatorName: {
      type: String,
      default: "IQAC Coordinator",
      trim: true,
    },

    coordinatorDesignation: {
      type: String,
      default: "Coordinator, Internal Quality Assurance Cell",
      trim: true,
    },

    coordinatorEmail: {
      type: String,
      default: "iqac@imsec.ac.in",
      trim: true,
    },

    coordinatorPhone: {
      type: String,
      default: "+91-120-4081999",
      trim: true,
    },

    members: {
      type: [iqacMemberSchema],
      default: [],
    },

    documents: {
      type: [iqacDocumentSchema],
      default: [],
    },

    initiatives: {
      type: [iqacInitiativeSchema],
      default: [],
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =====================================================
   DEFAULT IQAC DATA
===================================================== */

export const getDefaultIQAC = () => ({
  singletonKey: "iqac",

  title: "IQAC",

  heroSubtitle: "Internal Quality Assurance Cell",

  breadcrumb: "Home / IQAC",

  heading: "Internal Quality Assurance Cell",

  description:
    "The Internal Quality Assurance Cell (IQAC) is established to promote continuous improvement in the academic and administrative quality of the institution. IQAC facilitates quality enhancement initiatives, documentation, feedback and systematic monitoring of institutional processes.",

  aboutHeading: "About IQAC",

  aboutDescription:
    "IQAC works as a quality enhancement mechanism within the institution. It encourages a consistent approach towards improving teaching-learning processes, academic practices, institutional activities and overall student development.",

  functionsHeading: "IQAC Functions",

  functionsDescription:
    "IQAC facilitates quality-related initiatives, documentation, feedback analysis, academic and administrative improvements and continuous quality monitoring across the institution.",

  membersHeading: "IQAC Composition",

  membersDescription:
    "The IQAC consists of representatives from different areas of the institution who contribute towards planning, monitoring and continuous quality improvement.",

  meetingsHeading: "IQAC Meetings",

  meetingsDescription:
    "IQAC meetings are conducted periodically to review quality initiatives, discuss institutional requirements and plan activities for continuous improvement.",

  initiativesHeading: "Quality Initiatives",

  initiativesDescription:
    "The institution undertakes various quality enhancement initiatives through systematic planning, implementation, review and continuous improvement.",

  documentsHeading: "IQAC Reports & Documents",

  coordinatorName: "IQAC Coordinator",

  coordinatorDesignation: "Coordinator, Internal Quality Assurance Cell",

  coordinatorEmail: "iqac@imsec.ac.in",

  coordinatorPhone: "+91-120-4081999",

  members: [
    {
      name: "IQAC Coordinator",
      designation: "Coordinator",
      role: "IQAC Coordinator",
      department: "",
      order: 1,
      isActive: true,
    },

    {
      name: "Head of Institution",
      designation: "Head of Institution",
      role: "Chairperson",
      department: "",
      order: 2,
      isActive: true,
    },

    {
      name: "Faculty Representative",
      designation: "Faculty Member",
      role: "Member",
      department: "",
      order: 3,
      isActive: true,
    },

    {
      name: "Administrative Representative",
      designation: "Administrative Representative",
      role: "Member",
      department: "",
      order: 4,
      isActive: true,
    },

    {
      name: "Student Representative",
      designation: "Student Representative",
      role: "Member",
      department: "",
      order: 5,
      isActive: true,
    },
  ],

  documents: [],

  initiatives: [
    {
      title: "Academic Quality Enhancement",
      description:
        "Promoting continuous improvement in teaching-learning and academic practices.",
      order: 1,
      isActive: true,
    },

    {
      title: "Feedback & Improvement",
      description:
        "Encouraging systematic feedback and using appropriate inputs for institutional improvement.",
      order: 2,
      isActive: true,
    },

    {
      title: "Quality Documentation",
      description:
        "Supporting systematic documentation and maintenance of quality-related institutional records.",
      order: 3,
      isActive: true,
    },

    {
      title: "Continuous Quality Monitoring",
      description:
        "Facilitating regular review and monitoring of institutional quality enhancement activities.",
      order: 4,
      isActive: true,
    },
  ],

  published: true,
});

/* =====================================================
   MODEL
===================================================== */

const IQAC = mongoose.models.IQAC || mongoose.model("IQAC", iqacSchema);

export default IQAC;
