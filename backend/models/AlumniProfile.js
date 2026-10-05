import mongoose from "mongoose";

/* =========================================================
   IMAGE SCHEMA
========================================================= */

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    fileName: {
      type: String,
      default: "",
      trim: true,
    },

    fileType: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

/* =========================================================
   FEATURED ALUMNI
========================================================= */

const featuredAlumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    achievement: {
      type: String,
      default: "",
      trim: true,
    },

    /* Alumni Photo */
    image: {
      type: imageSchema,
      default: () => ({}),
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   ALUMNI ACHIEVEMENT
========================================================= */

const achievementSchema = new mongoose.Schema(
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

    year: {
      type: String,
      default: "",
      trim: true,
    },

    alumniName: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    /* Alumni / Achievement Photo */
    image: {
      type: imageSchema,
      default: () => ({}),
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   SUCCESS STORY
========================================================= */

const successStorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    story: {
      type: String,
      default: "",
      trim: true,
    },

    /* Alumni Photo */
    image: {
      type: imageSchema,
      default: () => ({}),
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   TESTIMONIAL
========================================================= */

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /* Alumni Photo */
    image: {
      type: imageSchema,
      default: () => ({}),
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   ALUMNI EVENT
========================================================= */

const alumniEventSchema = new mongoose.Schema(
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

    date: {
      type: String,
      default: "",
      trim: true,
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

    chapter: {
      type: String,
      default: "",
      trim: true,
    },

    registrationLink: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: imageSchema,
      default: () => ({}),
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   ALUMNI CHAPTER
========================================================= */

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    coordinator: {
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

    /* Chapter Image */
    image: {
      type: imageSchema,
      default: () => ({}),
    },

    /*
     * Chapter PDF URL
     *
     * Admin will paste the PDF URL.
     * PDF itself will NOT be uploaded through Multer.
     */
    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

/* =========================================================
   MAIN ALUMNI PROFILE PAGE
========================================================= */

const alumniProfilePageSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "imsec-alumni",
    },

    /* =====================================================
       HERO
    ===================================================== */

    hero: {
      title: {
        type: String,
        default: "IMSEC Alumni",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "Connecting the IMSEC family beyond the campus",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / Alumni",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Join Alumni Network",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "#alumni-network",
        trim: true,
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       ABOUT
    ===================================================== */

    about: {
      title: {
        type: String,
        default: "IMSEC Alumni Network",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "A lifelong connection between IMSEC and its alumni",
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
        type: imageSchema,
        default: () => ({}),
      },

      buttonText: {
        type: String,
        default: "Know More",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "",
        trim: true,
      },
    },

    /* =====================================================
       STATISTICS
    ===================================================== */

    statistics: {
      totalAlumni: {
        type: String,
        default: "10,000+",
        trim: true,
      },

      successfulAlumni: {
        type: String,
        default: "8,000+",
        trim: true,
      },

      countries: {
        type: String,
        default: "20+",
        trim: true,
      },

      industryLeaders: {
        type: String,
        default: "500+",
        trim: true,
      },

      alumniEvents: {
        type: String,
        default: "100+",
        trim: true,
      },

      alumniChapters: {
        type: String,
        default: "15+",
        trim: true,
      },
    },

    /* =====================================================
       FEATURED ALUMNI
    ===================================================== */

    featuredAlumni: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      profiles: {
        type: [featuredAlumniSchema],
        default: [],
      },
    },

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    achievements: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      items: {
        type: [achievementSchema],
        default: [],
      },
    },

    /* =====================================================
       SUCCESS STORIES
    ===================================================== */

    successStories: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      items: {
        type: [successStorySchema],
        default: [],
      },
    },

    /* =====================================================
       TESTIMONIALS
    ===================================================== */

    testimonials: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      items: {
        type: [testimonialSchema],
        default: [],
      },
    },

    /* =====================================================
       ALUMNI EVENTS
    ===================================================== */

    events: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      events: {
        type: [alumniEventSchema],
        default: [],
      },
    },

    /* =====================================================
       ALUMNI CHAPTERS
    ===================================================== */

    chapters: {
      displayCount: {
        type: Number,
        default: 6,
        min: 0,
      },

      items: {
        type: [chapterSchema],
        default: [],
      },
    },

    /* =====================================================
       ALUMNI NETWORK
    ===================================================== */

    network: {
      title: {
        type: String,
        default: "Stay Connected With IMSEC",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "Your connection with IMSEC continues for life.",
        trim: true,
      },

      description: {
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

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },

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

      whatsapp: {
        type: String,
        default: "",
        trim: true,
      },

      registrationText: {
        type: String,
        default: "Join Alumni Network",
        trim: true,
      },

      registrationLink: {
        type: String,
        default: "/alumni/registration",
        trim: true,
      },

      loginText: {
        type: String,
        default: "Alumni Login",
        trim: true,
      },

      loginLink: {
        type: String,
        default: "/alumni/login",
        trim: true,
      },
    },

    /* =====================================================
       MENTORSHIP
    ===================================================== */

    mentorship: {
      title: {
        type: String,
        default: "Alumni Mentorship",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Become a Mentor",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "/contact-us",
        trim: true,
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       CONTRIBUTION
    ===================================================== */

    contribution: {
      title: {
        type: String,
        default: "Give Back to Your Alma Mater",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Connect With IMSEC",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "/contact-us",
        trim: true,
      },
    },

    /* =====================================================
       CTA
    ===================================================== */

    cta: {
      title: {
        type: String,
        default: "Be Part of the IMSEC Alumni Family",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Join Alumni Network",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "/alumni/registration",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const AlumniProfile =
  mongoose.models.AlumniProfile ||
  mongoose.model("AlumniProfile", alumniProfilePageSchema);

export default AlumniProfile;
