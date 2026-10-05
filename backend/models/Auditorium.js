import mongoose from "mongoose";

/* =========================================================
   IMAGE SCHEMA
========================================================= */

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   FACILITY SCHEMA
========================================================= */

const facilitySchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   HIGHLIGHT / FEATURE SCHEMA
========================================================= */

const featureSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   STATISTICS SCHEMA
========================================================= */

const statisticSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   FAQ SCHEMA
========================================================= */

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },

    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   AUDITORIUM SCHEMA
========================================================= */

const auditoriumSchema = new mongoose.Schema(
  {
    /*
      Singleton record.

      Only one Auditorium CMS document will be maintained.
    */

    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "auditorium",
    },

    /* =====================================================
       HERO
    ===================================================== */

    hero: {
      title: {
        type: String,
        default: "Auditorium",
      },

      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Auditorium",
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       INTRODUCTION
    ===================================================== */

    introduction: {
      tag: {
        type: String,
        default: "LIFE @ IMSEC",
      },

      title: {
        type: String,
        default: "A Space for",
      },

      highlight: {
        type: String,
        default: "Ideas & Events",
      },

      description1: {
        type: String,
        default:
          "The auditorium at IMS Engineering College provides a modern and well-equipped venue for academic, cultural and institutional events.",
      },

      description2: {
        type: String,
        default:
          "It serves as a central gathering space for students, faculty and guests for seminars, conferences, workshops, cultural programmes and other important events.",
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       AUDITORIUM FEATURES
    ===================================================== */

    features: {
      type: [featureSchema],
      default: [],
    },

    /* =====================================================
       FACILITIES
    ===================================================== */

    facilities: {
      type: [facilitySchema],
      default: [],
    },

    /* =====================================================
       GALLERY
    ===================================================== */

    gallery: {
      type: [imageSchema],
      default: [],
    },

    /* =====================================================
       STATISTICS
    ===================================================== */

    statistics: {
      type: [statisticSchema],
      default: [],
    },

    /* =====================================================
       EVENTS / USES
    ===================================================== */

    uses: {
      type: [String],
      default: [],
    },

    /* =====================================================
       RULES / GUIDELINES
    ===================================================== */

    rules: {
      type: [String],
      default: [],
    },

    /* =====================================================
       FAQ
    ===================================================== */

    faqs: {
      type: [faqSchema],
      default: [],
    },

    /* =====================================================
       CTA
    ===================================================== */

    cta: {
      title: {
        type: String,
        default: "A Venue for Every Occasion",
      },

      description: {
        type: String,
        default:
          "The IMSEC auditorium provides the perfect environment for learning, collaboration, celebration and memorable institutional events.",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Auditorium = mongoose.model("Auditorium", auditoriumSchema);

export default Auditorium;
