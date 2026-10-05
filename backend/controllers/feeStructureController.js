import FeeStructure from "../models/FeeStructure.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultFeeStructure = {
  title: "Fee Structure",

  subtitle:
    "Transparent and comprehensive fee details for students and parents.",

  academicYear: "2025-26",

  heroLabel: "ADMISSIONS",

  heroTitle: "Fee Structure",

  heroDescription:
    "Explore the fee structure for various programmes offered by IMS Engineering College.",

  note: "The fee structure mentioned below is indicative and may be revised as per university and regulatory guidelines.",

  /* =======================================================
     COURSE FEES
  ======================================================= */

  courses: [
    {
      courseName: "B.Tech",

      years: 4,

      feeRows: [
        {
          particulars: "Tuition Fee",

          amounts: ["₹1,20,000", "₹1,20,000", "₹1,20,000", "₹1,20,000"],

          displayOrder: 1,
        },

        {
          particulars: "University / Examination Fee",

          amounts: ["₹8,000", "₹8,000", "₹8,000", "₹8,000"],

          displayOrder: 2,
        },

        {
          particulars: "Development / Other Charges",

          amounts: ["₹12,000", "₹12,000", "₹12,000", "₹12,000"],

          displayOrder: 3,
        },
      ],

      displayOrder: 1,
    },

    {
      courseName: "M.Tech",

      years: 2,

      feeRows: [
        {
          particulars: "Tuition Fee",

          amounts: ["₹1,00,000", "₹1,00,000"],

          displayOrder: 1,
        },

        {
          particulars: "University / Examination Fee",

          amounts: ["₹8,000", "₹8,000"],

          displayOrder: 2,
        },

        {
          particulars: "Development / Other Charges",

          amounts: ["₹10,000", "₹10,000"],

          displayOrder: 3,
        },
      ],

      displayOrder: 2,
    },

    {
      courseName: "MBA",

      years: 2,

      feeRows: [
        {
          particulars: "Tuition Fee",

          amounts: ["₹1,10,000", "₹1,10,000"],

          displayOrder: 1,
        },

        {
          particulars: "University / Examination Fee",

          amounts: ["₹8,000", "₹8,000"],

          displayOrder: 2,
        },

        {
          particulars: "Development / Other Charges",

          amounts: ["₹10,000", "₹10,000"],

          displayOrder: 3,
        },
      ],

      displayOrder: 3,
    },

    {
      courseName: "MCA",

      years: 2,

      feeRows: [
        {
          particulars: "Tuition Fee",

          amounts: ["₹1,00,000", "₹1,00,000"],

          displayOrder: 1,
        },

        {
          particulars: "University / Examination Fee",

          amounts: ["₹8,000", "₹8,000"],

          displayOrder: 2,
        },

        {
          particulars: "Development / Other Charges",

          amounts: ["₹10,000", "₹10,000"],

          displayOrder: 3,
        },
      ],

      displayOrder: 4,
    },
  ],

  /* =======================================================
     HOSTELS
  ======================================================= */

  hostels: [
    {
      hostelName: "Boys Hostel",

      locationLabel: "On Campus",

      rows: [
        {
          title: "Hostel Fee",

          amount: "₹85,000 / Year",

          displayOrder: 1,
        },

        {
          title: "Mess Charges",

          amount: "As applicable",

          displayOrder: 2,
        },
      ],

      displayOrder: 1,
    },

    {
      hostelName: "Girls Hostel",

      locationLabel: "On Campus",

      rows: [
        {
          title: "Hostel Fee",

          amount: "₹85,000 / Year",

          displayOrder: 1,
        },

        {
          title: "Mess Charges",

          amount: "As applicable",

          displayOrder: 2,
        },
      ],

      displayOrder: 2,
    },
  ],

  /* =======================================================
     PAYMENT OPTIONS
  ======================================================= */

  paymentOptions: [
    {
      title: "Online Payment",

      displayOrder: 1,
    },

    {
      title: "Demand Draft",

      displayOrder: 2,
    },

    {
      title: "Bank Transfer",

      displayOrder: 3,
    },
  ],

  /* =======================================================
     SCHOLARSHIPS
  ======================================================= */

  scholarships: [
    {
      title: "Government Scholarships",

      description:
        "Eligible students may avail scholarships as per applicable government rules and schemes.",

      displayOrder: 1,
    },

    {
      title: "Merit Based Benefits",

      description:
        "Meritorious students may be considered for applicable institutional benefits.",

      displayOrder: 2,
    },
  ],

  /* =======================================================
     EDUCATION LOANS
  ======================================================= */

  educationLoans: [
    {
      title: "Education Loan",

      description:
        "Students may approach eligible banks and financial institutions for education loan facilities.",

      displayOrder: 1,
    },
  ],

  /* =======================================================
     IMPORTANT NOTES
  ======================================================= */

  importantNotes: [
    "Fee structure may be revised according to university and regulatory guidelines.",

    "Students should verify the applicable fee before making payment.",

    "Hostel and mess charges are subject to applicable rules and availability.",

    "All payments should be made through authorized college payment channels.",
  ],

  /* =======================================================
     PUBLISH
  ======================================================= */

  isPublished: true,
};

/* =========================================================
   SORT DATA
========================================================= */

const sortData = (data) => {
  if (!data) {
    return data;
  }

  if (Array.isArray(data.courses)) {
    data.courses.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    data.courses.forEach((course) => {
      if (Array.isArray(course.feeRows)) {
        course.feeRows.sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
        );
      }
    });
  }

  if (Array.isArray(data.hostels)) {
    data.hostels.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    data.hostels.forEach((hostel) => {
      if (Array.isArray(hostel.rows)) {
        hostel.rows.sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
        );
      }
    });
  }

  if (Array.isArray(data.paymentOptions)) {
    data.paymentOptions.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
    );
  }

  if (Array.isArray(data.scholarships)) {
    data.scholarships.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
    );
  }

  if (Array.isArray(data.educationLoans)) {
    data.educationLoans.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
    );
  }

  return data;
};

/* =========================================================
   ADMIN — GET
========================================================= */

export const getAdminFeeStructure = async (req, res) => {
  try {
    let data = await FeeStructure.findOne();

    /*
     * First time:
     * create default data.
     */

    if (!data) {
      data = await FeeStructure.create(defaultFeeStructure);
    }

    return res.status(200).json({
      success: true,

      data: sortData(data.toObject()),
    });
  } catch (error) {
    console.error("GET ADMIN FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load fee structure.",
    });
  }
};

/* =========================================================
   PUBLIC — GET
========================================================= */

export const getPublicFeeStructure = async (req, res) => {
  try {
    const data = await FeeStructure.findOne({
      isPublished: true,
    });

    if (!data) {
      return res.status(200).json({
        success: true,

        data: null,
      });
    }

    return res.status(200).json({
      success: true,

      data: sortData(data.toObject()),
    });
  } catch (error) {
    console.error("GET PUBLIC FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load fee structure.",
    });
  }
};

/* =========================================================
   ADMIN — CREATE
========================================================= */

export const createFeeStructure = async (req, res) => {
  try {
    const existing = await FeeStructure.findOne();

    if (existing) {
      return res.status(200).json({
        success: true,

        message: "Fee structure already exists.",

        data: sortData(existing.toObject()),
      });
    }

    const data = await FeeStructure.create(defaultFeeStructure);

    return res.status(201).json({
      success: true,

      message: "Fee structure created successfully.",

      data: sortData(data.toObject()),
    });
  } catch (error) {
    console.error("CREATE FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create fee structure.",
    });
  }
};

/* =========================================================
   ADMIN — UPDATE
========================================================= */

export const updateFeeStructure = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,

        message: "Fee structure data is required.",
      });
    }

    /*
     * Do not allow MongoDB
     * internal fields from request.
     */

    delete data._id;

    delete data.__v;

    delete data.createdAt;

    delete data.updatedAt;

    let feeStructure = await FeeStructure.findOne();

    /*
     * Create document if it
     * does not exist.
     */

    if (!feeStructure) {
      feeStructure = await FeeStructure.create(defaultFeeStructure);
    }

    Object.assign(feeStructure, data);

    await feeStructure.save();

    return res.status(200).json({
      success: true,

      message: "Fee structure updated successfully.",

      data: sortData(feeStructure.toObject()),
    });
  } catch (error) {
    console.error("UPDATE FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update fee structure.",
    });
  }
};

/* =========================================================
   ADMIN — PUBLISH
========================================================= */

export const publishFeeStructure = async (req, res) => {
  try {
    let data = await FeeStructure.findOne();

    if (!data) {
      data = await FeeStructure.create(defaultFeeStructure);
    }

    data.isPublished = true;

    await data.save();

    return res.status(200).json({
      success: true,

      message: "Fee structure published successfully.",

      data: data.toObject(),
    });
  } catch (error) {
    console.error("PUBLISH FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish fee structure.",
    });
  }
};

/* =========================================================
   ADMIN — UNPUBLISH
========================================================= */

export const unpublishFeeStructure = async (req, res) => {
  try {
    const data = await FeeStructure.findOne();

    if (!data) {
      return res.status(404).json({
        success: false,

        message: "Fee structure not found.",
      });
    }

    data.isPublished = false;

    await data.save();

    return res.status(200).json({
      success: true,

      message: "Fee structure unpublished successfully.",

      data: data.toObject(),
    });
  } catch (error) {
    console.error("UNPUBLISH FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish fee structure.",
    });
  }
};

/* =========================================================
   ADMIN — RESET
========================================================= */

export const resetFeeStructure = async (req, res) => {
  try {
    let data = await FeeStructure.findOne();

    if (!data) {
      data = await FeeStructure.create(defaultFeeStructure);
    } else {
      Object.assign(data, defaultFeeStructure);

      await data.save();
    }

    return res.status(200).json({
      success: true,

      message: "Fee structure reset successfully.",

      data: sortData(data.toObject()),
    });
  } catch (error) {
    console.error("RESET FEE STRUCTURE:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to reset fee structure.",
    });
  }
};
