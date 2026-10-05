import mongoose from "mongoose";

const activityCalendarSchema = new mongoose.Schema(
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
      default: "Dean IQAC",
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

activityCalendarSchema.index({
  academicSession: 1,
  semester: 1,
});

activityCalendarSchema.index({
  isPublished: 1,
  order: 1,
});

const ActivityCalendar = mongoose.model(
  "ActivityCalendar",
  activityCalendarSchema,
);

export default ActivityCalendar;
