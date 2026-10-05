import mongoose from "mongoose";

const placementStatisticsSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    offers: {
      type: Number,
      default: 0,
    },

    studentsPlaced: {
      type: Number,
      default: 0,
    },

    companiesVisited: {
      type: Number,
      default: 0,
    },

    highestCtc: {
      type: Number,
      default: 0,
    },

    highestCtcUnit: {
      type: String,
      enum: ["LPA", "Cr"],
      default: "LPA",
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PlacementStatistics =
  mongoose.models.PlacementStatistics ||
  mongoose.model("PlacementStatistics", placementStatisticsSchema);

export default PlacementStatistics;
