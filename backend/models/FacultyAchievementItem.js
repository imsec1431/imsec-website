import mongoose from "mongoose";

/* =========================================================
   FACULTY ACHIEVEMENT ITEM
========================================================= */

const facultyAchievementItemSchema = new mongoose.Schema(
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
       FACULTY
       FACULTY MEMBER FROM THIS DEPARTMENT
    ===================================================== */

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentFaculty",
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
   DEPARTMENT + FACULTY + ORDER INDEX
========================================================= */

facultyAchievementItemSchema.index({
  departmentId: 1,
  facultyId: 1,
  order: 1,
});

/* =========================================================
   MODEL
========================================================= */

const FacultyAchievementItem =
  mongoose.models.FacultyAchievementItem ||
  mongoose.model("FacultyAchievementItem", facultyAchievementItemSchema);

export default FacultyAchievementItem;
