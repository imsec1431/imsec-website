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

const bookContentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Books & Book Chapters",
      trim: true,
    },
    sectionTag: {
      type: String,
      default: "KNOWLEDGE CREATION",
      trim: true,
    },
    sectionTitle: {
      type: String,
      default: "Books & Book Chapters",
      trim: true,
    },
    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
      trim: true,
    },
    aboutDescriptionOne: {
      type: String,
      default:
        "IMS Engineering College encourages faculty members and researchers to publish books, edited volumes, and book chapters through reputed national and international publishers.",
      trim: true,
    },
    aboutDescriptionTwo: {
      type: String,
      default:
        "Books and book chapters reflect the academic expertise of our faculty and contribute to knowledge dissemination, innovation, and global research impact.",
      trim: true,
    },
    statistics: {
      type: [statisticSchema],
      default: [
        { number: "120+", title: "Books Published" },
        { number: "280+", title: "Book Chapters" },
        { number: "45+", title: "International Publishers" },
        { number: "18+", title: "National Publishers" },
      ],
    },
    timeline: {
      type: [timelineSchema],
      default: [
        { year: 2021, count: "22 Publications" },
        { year: 2022, count: "35 Publications" },
        { year: 2023, count: "48 Publications" },
        { year: 2024, count: "61 Publications" },
      ],
    },
    categories: {
      type: [String],
      default: [
        "Books",
        "Book Chapters",
        "Edited Books",
        "E-Books",
        "International Publications",
        "National Publications",
      ],
    },
    ctaTitle: {
      type: String,
      default: "Inspire Through Knowledge. Publish Your Research.",
      trim: true,
    },
    ctaDescription: {
      type: String,
      default:
        "IMS Engineering College encourages researchers and academicians to publish books and book chapters with recognized global and national publishing houses.",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("BookContent", bookContentSchema);
