import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const missionItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const whyChooseSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "🎓",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const facilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const aboutImsecSchema = new mongoose.Schema(
  {
    /* =====================================================
       HERO
    ===================================================== */

    heroTitle: {
      type: String,
      default: "About IMSEC",
      trim: true,
    },

    heroBreadcrumb: {
      type: String,
      default: "Home / About / Overview",
      trim: true,
    },

    /* =====================================================
       ABOUT IMSEC
    ===================================================== */

    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      trim: true,
    },

    aboutTag: {
      type: String,
      default: "ABOUT IMSEC",
      trim: true,
    },

    aboutTitle: {
      type: String,
      default: "IMS Engineering College, Ghaziabad",
      trim: true,
    },

    aboutTitleHighlight: {
      type: String,
      default: "Ghaziabad",
      trim: true,
    },

    aboutDescription1: {
      type: String,
      default:
        "IMS Engineering College (IMSEC), Ghaziabad, established in 2002, is one of the leading engineering institutions in North India. IMSEC is approved by AICTE, affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow, and offers world-class infrastructure, experienced faculty, modern laboratories, research facilities, and excellent placement opportunities.",
      trim: true,
    },

    aboutDescription2: {
      type: String,
      default:
        "The institute is dedicated to creating technically competent professionals through innovation, research, entrepreneurship, and industry collaboration.",
      trim: true,
    },

    /* =====================================================
       OVERVIEW HIGHLIGHTS
    ===================================================== */

    highlights: {
      type: [highlightSchema],

      default: [
        {
          title: "Established in 2002",
          description:
            "Over two decades of excellence in engineering and management education.",
          displayOrder: 1,
        },
        {
          title: "NAAC & NBA Accredited",
          description:
            "Committed to maintaining the highest standards of quality education.",
          displayOrder: 2,
        },
        {
          title: "Industry Collaboration",
          description:
            "Strong partnerships with leading industries for better learning and placements.",
          displayOrder: 3,
        },
      ],
    },

    /* =====================================================
       VISION
    ===================================================== */

    visionTag: {
      type: String,
      default: "OUR VISION",
      trim: true,
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
      trim: true,
    },

    visionDescription: {
      type: String,
      default:
        "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",
      trim: true,
    },

    /* =====================================================
       MISSION
    ===================================================== */

    missionTag: {
      type: String,
      default: "OUR MISSION",
      trim: true,
    },

    missionTitle: {
      type: String,
      default: "Our Mission",
      trim: true,
    },

    missionItems: {
      type: [missionItemSchema],

      default: [
        {
          text: "Provide quality technical education.",
          displayOrder: 1,
        },
        {
          text: "Develop leadership and innovation.",
          displayOrder: 2,
        },
        {
          text: "Promote industry collaboration.",
          displayOrder: 3,
        },
        {
          text: "Encourage research and entrepreneurship.",
          displayOrder: 4,
        },
        {
          text: "Build ethical and responsible professionals.",
          displayOrder: 5,
        },
      ],
    },

    /* =====================================================
       WHY CHOOSE IMSEC
    ===================================================== */

    whyChooseTag: {
      type: String,
      default: "WHY IMSEC",
      trim: true,
    },

    whyChooseTitle: {
      type: String,
      default: "Why Choose IMSEC?",
      trim: true,
    },

    whyChooseDescription: {
      type: String,
      default:
        "At IMSEC, students experience quality education, industry exposure, research opportunities and excellent placements that prepare them for successful careers.",
      trim: true,
    },

    whyChooseItems: {
      type: [whyChooseSchema],

      default: [
        {
          icon: "🎓",
          title: "Quality Education",
          text: "Outcome-based education with experienced faculty.",
          displayOrder: 1,
        },
        {
          icon: "💼",
          title: "Excellent Placements",
          text: "250+ recruiters and outstanding placement records.",
          displayOrder: 2,
        },
        {
          icon: "🔬",
          title: "Research & Innovation",
          text: "Modern research labs and innovation ecosystem.",
          displayOrder: 3,
        },
        {
          icon: "🏢",
          title: "Industry Collaboration",
          text: "MoUs with industries for internships and training.",
          displayOrder: 4,
        },
        {
          icon: "🏆",
          title: "Student Achievements",
          text: "National level awards, hackathons and competitions.",
          displayOrder: 5,
        },
        {
          icon: "🌳",
          title: "Modern Campus",
          text: "Green campus with world-class infrastructure.",
          displayOrder: 6,
        },
      ],
    },

    /* =====================================================
       CAMPUS FACILITIES
    ===================================================== */

    facilityTag: {
      type: String,
      default: "CAMPUS LIFE",
      trim: true,
    },

    facilityTitle: {
      type: String,
      default: "World-Class Facilities",
      trim: true,
    },

    facilityDescription: {
      type: String,
      default:
        "IMSEC provides students with modern infrastructure, smart classrooms, laboratories, library, sports facilities and a vibrant campus environment.",
      trim: true,
    },

    facilities: {
      type: [facilitySchema],

      default: [
        {
          title: "Central Library",
          image:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
          displayOrder: 1,
        },
        {
          title: "Modern Laboratories",
          image:
            "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80",
          displayOrder: 2,
        },
        {
          title: "Smart Classrooms",
          image:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
          displayOrder: 3,
        },
        {
          title: "Sports Complex",
          image:
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
          displayOrder: 4,
        },
        {
          title: "Hostel Facility",
          image:
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
          displayOrder: 5,
        },
        {
          title: "Innovation Center",
          image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
          displayOrder: 6,
        },
      ],
    },

    /* =====================================================
       CTA
    ===================================================== */

    ctaTitle: {
      type: String,
      default: "Ready to Begin Your Journey at IMSEC?",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default:
        "Join one of the leading engineering institutions and shape your future with quality education, innovation, and excellent placements.",
      trim: true,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    isPublished: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

aboutImsecSchema.index({
  isPublished: 1,
  displayOrder: 1,
});

const AboutImsec = mongoose.model("AboutImsec", aboutImsecSchema);

export default AboutImsec;
