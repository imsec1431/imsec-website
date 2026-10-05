import mongoose from "mongoose";

/* =========================================================
   PAYMENT PROCEDURE SCHEMA
========================================================= */

const paymentProcedureSchema = new mongoose.Schema(
  {
    /* =====================================================
       ACCOUNT DETAILS
    ===================================================== */

    accountHolderName: {
      type: String,
      trim: true,
      required: true,
      default: "IMS ENGINEERING COLLEGE",
    },

    bankName: {
      type: String,
      trim: true,
      required: true,
      default: "PUNJAB NATIONAL BANK",
    },

    branchAddress: {
      type: String,
      trim: true,
      required: true,
      default: "IMS, LAL KUAN, GHAZIABAD-201009",
    },

    bankAccountNumber: {
      type: String,
      trim: true,
      required: true,
      default: "51461010000140",
    },

    accountType: {
      type: String,
      trim: true,
      required: true,
      default: "CURRENT A/C",
    },

    ifscCode: {
      type: String,
      trim: true,
      required: true,
      default: "PUNB0514610",
    },

    micrCode: {
      type: String,
      trim: true,
      required: true,
      default: "110024640",
    },

    branchCode: {
      type: String,
      trim: true,
      required: true,
      default: "514610",
    },

    /* =====================================================
       PAYMENT REMARKS
    ===================================================== */

    remarks: {
      type: String,
      trim: true,

      default:
        "Kindly mention the Name/ ID/ Fees- Academic or Hostel under Remarks Column while making payment.\n\nExample: Prashant Sharma, A2017ME4012, Academic",
    },

    /* =====================================================
       ERP ONLINE TRANSACTION
    ===================================================== */

    erpOnlineTransactionUrl: {
      type: String,
      trim: true,

      default: "http://52.66.16.110/academic#/online_txn",
    },

    /* =====================================================
       QR CODE IMAGE
    ===================================================== */
    qrCodePublicId: {
      type: String,
      trim: true,
      default: "",
    },

    qrCodeUrl: {
      type: String,
      trim: true,

      default: "",
    },

    qrCodeOriginalName: {
      type: String,
      trim: true,

      default: "",
    },

    /* =====================================================
       PUBLISH
    ===================================================== */

    isPublished: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const PaymentProcedure =
  mongoose.models.PaymentProcedure ||
  mongoose.model("PaymentProcedure", paymentProcedureSchema);

export default PaymentProcedure;
