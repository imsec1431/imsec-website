import PaymentProcedure from "../models/PaymentProcedure.js";

import cloudinary from "../config/cloudinaryConfig.js";

/* =========================================================
   DEFAULT PAYMENT PROCEDURE
========================================================= */

const DEFAULT_PAYMENT_PROCEDURE = {
  accountHolderName: "IMS ENGINEERING COLLEGE",

  bankName: "PUNJAB NATIONAL BANK",

  branchAddress: "IMS, LAL KUAN, GHAZIABAD-201009",

  bankAccountNumber: "51461010000140",

  accountType: "CURRENT A/C",

  ifscCode: "PUNB0514610",

  micrCode: "110024640",

  branchCode: "514610",

  remarks:
    "Kindly mention the Name/ ID/ Fees- Academic or Hostel under Remarks Column while making payment.\n\nExample: Prashant Sharma, A2017ME4012, Academic",

  erpOnlineTransactionUrl: "http://52.66.16.110/academic#/online_txn",

  qrCodeUrl: "",

  qrCodeOriginalName: "",

  isPublished: false,
};

/* =========================================================
   GET ADMIN PAYMENT PROCEDURE
========================================================= */

export const getAdminPaymentProcedure = async (req, res) => {
  try {
    let paymentProcedure = await PaymentProcedure.findOne();

    /* -----------------------------------------------------
       CREATE DEFAULT RECORD
    ----------------------------------------------------- */

    if (!paymentProcedure) {
      paymentProcedure = await PaymentProcedure.create(
        DEFAULT_PAYMENT_PROCEDURE,
      );
    }

    return res.status(200).json({
      success: true,

      data: paymentProcedure,
    });
  } catch (error) {
    console.error("GET ADMIN PAYMENT PROCEDURE ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load payment procedure.",
    });
  }
};

/* =========================================================
   GET PUBLIC PAYMENT PROCEDURE
========================================================= */

export const getPublicPaymentProcedure = async (req, res) => {
  try {
    const paymentProcedure = await PaymentProcedure.findOne({
      isPublished: true,
    });

    return res.status(200).json({
      success: true,

      data: paymentProcedure || null,
    });
  } catch (error) {
    console.error("GET PUBLIC PAYMENT PROCEDURE ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load payment procedure.",
    });
  }
};

/* =========================================================
   CREATE PAYMENT PROCEDURE
========================================================= */

export const createPaymentProcedure = async (req, res) => {
  try {
    let paymentProcedure = await PaymentProcedure.findOne();

    if (paymentProcedure) {
      return res.status(400).json({
        success: false,
        message: "Payment Procedure already exists. Please update it.",
      });
    }

    let qrCodeUrl = "";
    let qrCodePublicId = "";
    let qrCodeOriginalName = "";

    /* =====================================================
       QR CODE UPLOAD
    ===================================================== */

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/payment-procedure",
      });

      qrCodeUrl = result.secure_url;

      qrCodePublicId = result.public_id;

      qrCodeOriginalName = req.file.originalname;
    }

    /* =====================================================
       CREATE
    ===================================================== */

    paymentProcedure = await PaymentProcedure.create({
      accountHolderName:
        req.body.accountHolderName || "IMS ENGINEERING COLLEGE",

      bankName: req.body.bankName || "PUNJAB NATIONAL BANK",

      branchAddress:
        req.body.branchAddress || "IMS, LAL KUAN, GHAZIABAD-201009",

      bankAccountNumber: req.body.bankAccountNumber || "51461010000140",

      accountType: req.body.accountType || "CURRENT A/C",

      ifscCode: req.body.ifscCode || "PUNB0514610",

      micrCode: req.body.micrCode || "110024640",

      branchCode: req.body.branchCode || "514610",

      remarks:
        req.body.remarks ||
        "Kindly mention the Name/ ID/ Fees- Academic or Hostel under Remarks Column while making payment.\n\nExample: Prashant Sharma, A2017ME4012, Academic",

      erpOnlineTransactionUrl:
        req.body.erpOnlineTransactionUrl ||
        "http://52.66.16.110/academic#/online_txn",

      qrCodeUrl,

      qrCodePublicId,

      qrCodeOriginalName,

      isPublished: req.body.isPublished === "true",
    });

    return res.status(201).json({
      success: true,

      message: "Payment Procedure created successfully.",

      data: paymentProcedure,
    });
  } catch (error) {
    console.error("Create Payment Procedure Error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create Payment Procedure.",

      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PAYMENT PROCEDURE
========================================================= */

export const updatePaymentProcedure = async (req, res) => {
  try {
    let paymentProcedure = await PaymentProcedure.findOne();

    /* =====================================================
       CREATE IF NOT EXISTS
    ===================================================== */

    if (!paymentProcedure) {
      return res.status(404).json({
        success: false,

        message: "Payment Procedure not found. Please create it first.",
      });
    }

    /* =====================================================
       TEXT FIELDS
    ===================================================== */

    if (req.body.accountHolderName !== undefined) {
      paymentProcedure.accountHolderName = req.body.accountHolderName;
    }

    if (req.body.bankName !== undefined) {
      paymentProcedure.bankName = req.body.bankName;
    }

    if (req.body.branchAddress !== undefined) {
      paymentProcedure.branchAddress = req.body.branchAddress;
    }

    if (req.body.bankAccountNumber !== undefined) {
      paymentProcedure.bankAccountNumber = req.body.bankAccountNumber;
    }

    if (req.body.accountType !== undefined) {
      paymentProcedure.accountType = req.body.accountType;
    }

    if (req.body.ifscCode !== undefined) {
      paymentProcedure.ifscCode = req.body.ifscCode;
    }

    if (req.body.micrCode !== undefined) {
      paymentProcedure.micrCode = req.body.micrCode;
    }

    if (req.body.branchCode !== undefined) {
      paymentProcedure.branchCode = req.body.branchCode;
    }

    if (req.body.remarks !== undefined) {
      paymentProcedure.remarks = req.body.remarks;
    }

    if (req.body.erpOnlineTransactionUrl !== undefined) {
      paymentProcedure.erpOnlineTransactionUrl =
        req.body.erpOnlineTransactionUrl;
    }

    /* =====================================================
       PUBLISH STATUS
    ===================================================== */

    if (req.body.isPublished !== undefined) {
      paymentProcedure.isPublished =
        req.body.isPublished === true || req.body.isPublished === "true";
    }

    /* =====================================================
       NEW QR CODE
    ===================================================== */

    if (req.file) {
      /* ---------------------------------------------------
         DELETE OLD QR FROM CLOUDINARY
      --------------------------------------------------- */

      if (paymentProcedure.qrCodePublicId) {
        try {
          await cloudinary.uploader.destroy(paymentProcedure.qrCodePublicId);
        } catch (deleteError) {
          console.error("Old QR Code delete failed:", deleteError);
        }
      }

      /* ---------------------------------------------------
         UPLOAD NEW QR
      --------------------------------------------------- */

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/payment-procedure",
      });

      paymentProcedure.qrCodeUrl = result.secure_url;

      paymentProcedure.qrCodePublicId = result.public_id;

      paymentProcedure.qrCodeOriginalName = req.file.originalname;
    }

    await paymentProcedure.save();

    return res.status(200).json({
      success: true,

      message: "Payment Procedure updated successfully.",

      data: paymentProcedure,
    });
  } catch (error) {
    console.error("Update Payment Procedure Error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update Payment Procedure.",

      error: error.message,
    });
  }
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishPaymentProcedure = async (req, res) => {
  try {
    const paymentProcedure = await PaymentProcedure.findOne();

    if (!paymentProcedure) {
      return res.status(404).json({
        success: false,

        message: "Payment procedure not found.",
      });
    }

    paymentProcedure.isPublished = true;

    await paymentProcedure.save();

    return res.status(200).json({
      success: true,

      message: "Payment procedure published successfully.",

      data: paymentProcedure,
    });
  } catch (error) {
    console.error("PUBLISH PAYMENT PROCEDURE ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish payment procedure.",
    });
  }
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishPaymentProcedure = async (req, res) => {
  try {
    const paymentProcedure = await PaymentProcedure.findOne();

    if (!paymentProcedure) {
      return res.status(404).json({
        success: false,

        message: "Payment procedure not found.",
      });
    }

    paymentProcedure.isPublished = false;

    await paymentProcedure.save();

    return res.status(200).json({
      success: true,

      message: "Payment procedure unpublished successfully.",

      data: paymentProcedure,
    });
  } catch (error) {
    console.error("UNPUBLISH PAYMENT PROCEDURE ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish payment procedure.",
    });
  }
};
