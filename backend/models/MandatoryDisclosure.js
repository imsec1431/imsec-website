import mongoose from "mongoose";

const mandatoryDisclosureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 250,
    },

    pdfLink: {
      type: String,
      required: [true, "PDF link is required"],
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

mandatoryDisclosureSchema.index({
  isPublished: 1,
  displayOrder: 1,
  createdAt: -1,
});

const MandatoryDisclosure = mongoose.model(
  "MandatoryDisclosure",
  mandatoryDisclosureSchema,
);

export default MandatoryDisclosure;
