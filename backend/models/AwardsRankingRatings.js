import mongoose from "mongoose";

const recognitionRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["award", "ranking", "rating"],
      required: true,
      default: "award",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    photoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    photoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

const awardsRankingRatingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "awards-ranking-ratings",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Awards, Rankings & Ratings",
    },

    description: {
      type: String,
      default: "Awards, rankings and ratings received by the institution.",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    records: {
      type: [recognitionRecordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const getDefaultAwardsRankingRatings = () => ({
  singletonKey: "awards-ranking-ratings",

  title: "Awards, Rankings & Ratings",

  description: "Awards, rankings and ratings received by the institution.",

  published: true,

  records: [
    {
      type: "award",
      title: "Institutional Award",
      photoUrl: "",
      photoPublicId: "",
      pdfUrl: "",
      isActive: true,
      order: 1,
    },

    {
      type: "ranking",
      title: "Institutional Ranking",
      photoUrl: "",
      photoPublicId: "",
      pdfUrl: "",
      isActive: true,
      order: 2,
    },

    {
      type: "rating",
      title: "Institutional Rating",
      photoUrl: "",
      photoPublicId: "",
      pdfUrl: "",
      isActive: true,
      order: 3,
    },
  ],
});

const AwardsRankingRatings =
  mongoose.models.AwardsRankingRatings ||
  mongoose.model("AwardsRankingRatings", awardsRankingRatingsSchema);

export default AwardsRankingRatings;
