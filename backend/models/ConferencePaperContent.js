import mongoose from "mongoose";

const statisticSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const timelineSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },

    count: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const conferencePaperContentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Conference Publications",
      trim: true,
    },

    sectionTag: {
      type: String,
      default: "RESEARCH DISSEMINATION",
      trim: true,
    },

    sectionTitle: {
      type: String,
      default: "Conference Publications",
      trim: true,
    },

    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
      trim: true,
    },

    aboutDescriptionOne: {
      type: String,
      default:
        "IMS Engineering College encourages faculty members, research scholars and students to present their research findings at prestigious national and international conferences.",
      trim: true,
    },

    aboutDescriptionTwo: {
      type: String,
      default:
        "Conference publications provide opportunities for knowledge sharing, networking with researchers, industry collaboration and showcasing innovative research at globally recognized platforms.",
      trim: true,
    },

    statistics: {
      type: [statisticSchema],
      default: [
        {
          number: "450+",
          title: "Conference Publications",
        },
        {
          number: "180+",
          title: "Scopus Indexed",
        },
        {
          number: "270+",
          title: "Non-Scopus",
        },
        {
          number: "95+",
          title: "International Conferences",
        },
      ],
    },

    timeline: {
      type: [timelineSchema],
      default: [
        {
          year: 2021,
          count: "60 Papers",
        },
        {
          year: 2022,
          count: "95 Papers",
        },
        {
          year: 2023,
          count: "120 Papers",
        },
        {
          year: 2024,
          count: "175 Papers",
        },
      ],
    },

    conferenceCategories: {
      type: [String],
      default: [
        "IEEE Conferences",
        "Springer Conferences",
        "ACM Conferences",
        "Elsevier Conferences",
        "International Conferences",
        "National Conferences",
      ],
    },

    ctaTitle: {
      type: String,
      default: "Present Research. Build Global Connections.",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default:
        "IMS Engineering College encourages researchers to present innovative ideas in prestigious national and international conferences, promoting collaboration, academic excellence, and global visibility.",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "ConferencePaperContent",
  conferencePaperContentSchema,
);
