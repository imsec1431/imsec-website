import mongoose from "mongoose";

const placementStudentSchema = new mongoose.Schema(
  {
    /* =========================
       STUDENT NAME
    ========================= */

    name: {
      type: String,
      required: [true, "Student name is required."],
      trim: true,
    },

    /* =========================
       ROLL NUMBER
    ========================= */

    rollNo: {
      type: String,
      required: [true, "Roll number is required."],
      trim: true,
    },

    /* =========================
       BRANCH
    ========================= */

    branch: {
      type: String,
      required: [true, "Branch is required."],
      trim: true,
    },

    /* =========================
       PLACED IN / COMPANY
    ========================= */

    placedIn: {
      type: String,
      required: [true, "Placed In is required."],
      trim: true,
    },

    /* =========================
       BATCH
    ========================= */

    batch: {
      type: String,
      required: [true, "Batch is required."],
      trim: true,
    },

    /* =========================
       DISPLAY ORDER
    ========================= */

    displayOrder: {
      type: Number,
      default: 0,
      min: [0, "Display order cannot be negative."],
    },

    /* =========================
       PUBLISH STATUS
    ========================= */

    isPublished: {
      type: Boolean,
      default: true,
    },

    /* =========================
       CREATED BY
    ========================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    /* =========================
       UPDATED BY
    ========================= */

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

/* =========================================================
   INDEXES
========================================================= */

/*
  Helps when placement records are filtered/sorted
  by batch and roll number.
*/

placementStudentSchema.index({
  batch: -1,
  rollNo: 1,
});

/*
  Helps the public placement page sorting.
*/

placementStudentSchema.index({
  isPublished: 1,
  batch: -1,
  displayOrder: 1,
});

/*
  Helps admin sorting.
*/

placementStudentSchema.index({
  batch: -1,
  displayOrder: 1,
  name: 1,
});

/* =========================================================
   MODEL
========================================================= */

const PlacementStudent =
  mongoose.models.PlacementStudent ||
  mongoose.model("PlacementStudent", placementStudentSchema);

export default PlacementStudent;
