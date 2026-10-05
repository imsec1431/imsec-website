import mongoose from "mongoose";

const approvalAffiliationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    documentType: {
      type: String,
      required: [true, "Document type is required"],
      enum: ["Approval", "Affiliation", "Certificate", "Other"],
      default: "Approval",
    },

    // Required only when documentType = Other
    otherDocumentType: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    pdfLink: {
      type: String,
      required: [true, "PDF link is required"],
      trim: true,
    },

    issuingAuthority: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    session: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
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

// =========================================================
// VALIDATION FOR "OTHER"
// =========================================================

approvalAffiliationSchema.pre("validate", function (next) {
  if (this.documentType === "Other" && !this.otherDocumentType?.trim()) {
    this.invalidate(
      "otherDocumentType",
      "Please enter the document type name.",
    );
  }

  if (this.documentType !== "Other") {
    this.otherDocumentType = "";
  }

  next();
});

// =========================================================
// INDEX
// =========================================================

approvalAffiliationSchema.index({
  documentType: 1,
  isPublished: 1,
  displayOrder: 1,
});

// =========================================================
// MODEL
// =========================================================

const ApprovalAffiliation = mongoose.model(
  "ApprovalAffiliation",
  approvalAffiliationSchema,
);

export default ApprovalAffiliation;
