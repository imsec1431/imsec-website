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
  { _id: false },
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
  { _id: false },
);

const researchPublicationContentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Research Publications",
      trim: true,
    },

    sectionTag: {
      type: String,
      default: "RESEARCH EXCELLENCE",
      trim: true,
    },

    sectionTitle: {
      type: String,
      default: "Research Publications",
      trim: true,
    },

    aboutImage: {
      type: String,
      default: "",
    },

    aboutDescriptionOne: {
      type: String,
      default:
        "IMS Engineering College actively promotes quality research and encourages faculty members, research scholars and students to publish innovative research in reputed national and international journals.",
      trim: true,
    },

    aboutDescriptionTwo: {
      type: String,
      default:
        "Our publications are indexed in Scopus, Web of Science, UGC CARE, Google Scholar and other recognized indexing databases, reflecting our commitment towards academic excellence and global research impact.",
      trim: true,
    },

    statistics: {
      type: [statisticSchema],
      default: [
        {
          number: "1200+",
          title: "Research Publications",
        },
        {
          number: "450+",
          title: "Scopus Indexed",
        },
        {
          number: "220+",
          title: "Web of Science",
        },
        {
          number: "95+",
          title: "UGC CARE",
        },
      ],
    },

    timeline: {
      type: [timelineSchema],
      default: [
        {
          year: 2021,
          count: "165 Publications",
        },
        {
          year: 2022,
          count: "210 Publications",
        },
        {
          year: 2023,
          count: "280 Publications",
        },
        {
          year: 2024,
          count: "350 Publications",
        },
      ],
    },

    indexingDatabases: {
      type: [String],
      default: [
        "Scopus",
        "Web of Science",
        "UGC CARE",
        "Google Scholar",
        "Indian Citation Index",
        "CrossRef",
      ],
    },

    ctaTitle: {
      type: String,
      default: "Publish with Impact. Inspire Through Research.",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default:
        "IMS Engineering College encourages faculty members, research scholars and students to publish quality research in internationally recognized journals and indexing databases.",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "ResearchPublicationContent",
  researchPublicationContentSchema,
);
