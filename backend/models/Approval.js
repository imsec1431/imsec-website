import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
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

// Lower displayOrder = higher priority
approvalSchema.index({
  isPublished: 1,
  displayOrder: 1,
  createdAt: -1,
});

const Approval = mongoose.model("Approval", approvalSchema);

export default Approval;
