import mongoose from "mongoose";

const academicCalendarSchema = new mongoose.Schema(
  {
    academicSession: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: String,
      required: true,
      enum: ["Odd", "Even"],
      trim: true,
    },

    calendarName: {
      type: String,
      required: true,
      trim: true,
      default: "Academics Calendar",
    },

    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
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

/* =====================================================
   INDEXES
   ===================================================== */

academicCalendarSchema.index({
  academicSession: 1,
  semester: 1,
});

academicCalendarSchema.index({
  isPublished: 1,
  order: 1,
});

/* =====================================================
   MODEL
   ===================================================== */

const AcademicCalendar = mongoose.model(
  "AcademicCalendar",
  academicCalendarSchema,
);

export default AcademicCalendar;
