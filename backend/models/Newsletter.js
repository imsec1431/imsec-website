import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Month is required"],
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    cover: {
      type: String,
      trim: true,
    },

    drive: {
      type: String,
      required: [true, "Drive / PDF link is required"],
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
