import mongoose from "mongoose";

/* =========================================================
   IMAGE / UPLOADED FILE SCHEMA
   Used for actual uploaded images.
========================================================= */

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* =========================================================
   PDF LINK SCHEMA
   PDFs are NOT uploaded.
   Only their external/public URL is stored.
========================================================= */

const pdfLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    youtube: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   EVENT ITEM
========================================================= */

const eventItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    eventType: {
      type: String,
      default: "College Event",
      trim: true,
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "",
      trim: true,
    },

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    organizer: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    program: {
      type: String,
      default: "",
      trim: true,
    },

    academicYear: {
      type: String,
      default: "",
      trim: true,
    },

    participants: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    /* -----------------------------------------------
         ACTUAL IMAGE UPLOAD
      ----------------------------------------------- */

    image: {
      type: fileSchema,
      default: () => ({}),
    },

    /* -----------------------------------------------
         PDF LINK ONLY
         
         IMPORTANT:
         No publicId.
         No fileName.
         No fileType.
         No PDF upload.
      ----------------------------------------------- */

    photoPdf: {
      type: pdfLinkSchema,
      default: () => ({}),
    },

    reportPdf: {
      type: pdfLinkSchema,
      default: () => ({}),
    },

    registrationLink: {
      type: String,
      default: "",
      trim: true,
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

/* =========================================================
   HERO
========================================================= */

const heroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Events",
      trim: true,
    },

    subtitle: {
      type: String,
      default: "Discover events, activities and memorable moments at IMSEC",
      trim: true,
    },

    breadcrumb: {
      type: String,
      default: "Home / Life @ IMSEC / Events",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   ABOUT
========================================================= */

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Events at IMSEC",
      trim: true,
    },

    description1: {
      type: String,
      default: "",
      trim: true,
    },

    description2: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: fileSchema,
      default: () => ({}),
    },
  },
  { _id: false },
);

/* =========================================================
   EVENT SECTION
========================================================= */

const eventSectionSchema = new mongoose.Schema(
  {
    displayCount: {
      type: Number,
      default: 6,
      min: 0,
    },

    events: {
      type: [eventItemSchema],
      default: [],
    },
  },
  { _id: false },
);

/* =========================================================
   STATISTICS
========================================================= */

const statisticsSchema = new mongoose.Schema(
  {
    eventsEveryYear: {
      type: String,
      default: "200+",
      trim: true,
    },

    participants: {
      type: String,
      default: "15,000+",
      trim: true,
    },

    industrySpeakers: {
      type: String,
      default: "500+",
      trim: true,
    },

    studentClubs: {
      type: String,
      default: "50+",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   CTA
========================================================= */

const ctaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Be a Part of IMSEC Events",
      trim: true,
    },

    description: {
      type: String,
      default:
        "Participate in events, activities and experiences that make campus life memorable.",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "Explore Events",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "/events",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   MAIN EVENTS PAGE
========================================================= */

const eventSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "events-page",
    },

    hero: {
      type: heroSchema,
      default: () => ({}),
    },

    about: {
      type: aboutSchema,
      default: () => ({}),
    },

    featuredEvent: {
      type: eventItemSchema,
      default: null,
    },

    latestEvents: {
      type: eventSectionSchema,
      default: () => ({
        displayCount: 6,
        events: [],
      }),
    },

    memorableEvents: {
      type: eventSectionSchema,
      default: () => ({
        displayCount: 6,
        events: [],
      }),
    },

    signatureEvents: {
      type: eventSectionSchema,
      default: () => ({
        displayCount: 8,
        events: [],
      }),
    },

    statistics: {
      type: statisticsSchema,
      default: () => ({}),
    },

    cta: {
      type: ctaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
