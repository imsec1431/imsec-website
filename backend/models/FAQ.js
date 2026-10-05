import mongoose from "mongoose";

/* =========================================================
   FAQ ITEM
========================================================= */

const faqItemSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   FAQ
========================================================= */

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Frequently Asked Questions",
      trim: true,
    },

    subtitle: {
      type: String,
      default:
        "Find answers to the most frequently asked questions about IMS Engineering College.",
      trim: true,
    },

    heroLabel: {
      type: String,
      default: "ADMISSIONS",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Frequently Asked Questions",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "Find answers about admissions, academics, campus facilities, hostel and student life.",
      trim: true,
    },

    categories: {
      type: [String],

      default: ["General", "Academics", "Admissions", "Campus", "Hostel"],
    },

    faqs: {
      type: [faqItemSchema],

      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   ES6 MODEL
========================================================= */

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);

export default FAQ;
