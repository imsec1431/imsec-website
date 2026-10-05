import mongoose from "mongoose";

/* =========================================================
   NEWS TICKER SCHEMA
========================================================= */

const newsTickerSchema = new mongoose.Schema(
  {
    /* =====================================================
       TITLE
    ===================================================== */

    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
      maxlength: 250,
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      required: [true, "News description is required"],
      trim: true,
      maxlength: 1000,
    },

    /* =====================================================
       PDF / DOCUMENT LINK
    ===================================================== */

    pdfLink: {
      type: String,
      required: [true, "PDF link is required"],
      trim: true,
    },

    /* =====================================================
       BUTTON TEXT
    ===================================================== */

    buttonText: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
      default: "View",
      maxlength: 50,
    },

    /* =====================================================
       BUTTON LINK
    ===================================================== */

    buttonLink: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       PUBLISH STATUS
    ===================================================== */

    isPublished: {
      type: Boolean,
      default: false,
    },

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   INDEX
========================================================= */

newsTickerSchema.index({
  isPublished: 1,
  displayOrder: 1,
});

/* =========================================================
   MODEL
========================================================= */

const NewsTicker = mongoose.model("NewsTicker", newsTickerSchema);

export default NewsTicker;
