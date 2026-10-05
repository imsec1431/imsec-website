import mongoose from "mongoose";

/* =========================================================
   DEPARTMENT ACHIEVEMENT ITEM
========================================================= */

const departmentAchievementItemSchema = new mongoose.Schema(
  {
    /* =====================================================
       DEPARTMENT
    ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    /* =====================================================
       TITLE
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       PHOTO
       OPTIONAL
    ===================================================== */

    image: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       CLOUDINARY PUBLIC ID
       OPTIONAL
    ===================================================== */

    publicId: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    order: {
      type: Number,
      default: 1,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEPARTMENT + ORDER INDEX
========================================================= */

departmentAchievementItemSchema.index({
  departmentId: 1,
  order: 1,
});

/* =========================================================
   MODEL
========================================================= */

const DepartmentAchievementItem =
  mongoose.models.DepartmentAchievementItem ||
  mongoose.model("DepartmentAchievementItem", departmentAchievementItemSchema);

export default DepartmentAchievementItem;
