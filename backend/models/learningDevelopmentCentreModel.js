import mongoose from "mongoose";

const learningDevelopmentCentreSchema = new mongoose.Schema(
  {
    /* =====================================================
         TITLE
      ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
         PDF LINK
      ===================================================== */

    pdfLink: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
         DISPLAY ORDER
      ===================================================== */

    displayOrder: {
      type: Number,
      default: 0,
    },

    /* =====================================================
         STATUS
      ===================================================== */

    status: {
      type: String,

      enum: ["published", "draft"],

      default: "published",
    },
  },

  {
    timestamps: true,
  },
);

const LearningDevelopmentCentre = mongoose.model(
  "LearningDevelopmentCentre",
  learningDevelopmentCentreSchema,
);

export default LearningDevelopmentCentre;
