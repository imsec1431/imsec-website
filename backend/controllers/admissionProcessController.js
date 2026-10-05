import AdmissionProcess from "../models/AdmissionProcess.js";

/* =========================================================
   DEFAULT ADMISSION PROCESS DATA

   This is used automatically when there is no record
   in MongoDB yet.

   Admin can change this later.
========================================================= */

const DEFAULT_ADMISSION_PROCESS = {
  heroTag: "Admissions Open for this Session",

  heroTitle: "Admission",

  heroTitleHighlight: "Process",

  heroDescription:
    "Begin your journey toward academic excellence with IMS Engineering College. Our admission process is transparent, student-friendly and designed to make your enrollment simple and hassle-free.",

  applyButtonText: "Apply Now",

  brochureButtonText: "Download Brochure",

  /* =====================================================
     ADMISSION JOURNEY
  ===================================================== */

  journeyLabel: "Admission Journey",

  journeyTitle: "Your Admission in 6 Simple Steps",

  journeyDescription:
    "Follow these simple steps to complete your admission and become a part of the IMSEC family.",

  admissionSteps: [
    {
      id: 1,
      title: "Explore Programmes",

      description:
        "Choose the programme that matches your academic interests, career goals and eligibility.",

      icon: "search",

      displayOrder: 1,
    },

    {
      id: 2,
      title: "Check Eligibility",

      description:
        "Review the eligibility criteria and make sure you meet the required academic qualifications.",

      icon: "check",

      displayOrder: 2,
    },

    {
      id: 3,
      title: "Apply for Admission",

      description:
        "Complete the admission application through the applicable admission channel.",

      icon: "edit",

      displayOrder: 3,
    },

    {
      id: 4,
      title: "Document Verification",

      description:
        "Submit the required documents for verification by the admission team.",

      icon: "file",

      displayOrder: 4,
    },

    {
      id: 5,
      title: "Fee Submission",

      description:
        "After confirmation of admission, complete the required fee payment within the prescribed time.",

      icon: "payment",

      displayOrder: 5,
    },

    {
      id: 6,
      title: "Admission Confirmation",

      description:
        "Complete the final formalities and become an official member of the IMSEC academic community.",

      icon: "university",

      displayOrder: 6,
    },
  ],

  /* =====================================================
     ELIGIBILITY
  ===================================================== */

  eligibilityLabel: "Eligibility",

  eligibilityTitle: "Programme Eligibility Criteria",

  eligibilityDescription:
    "Before applying, ensure that you meet the minimum eligibility requirements for your desired programme.",

  eligibility: [
    {
      course: "B.Tech",

      qualification: "10+2 / Intermediate or equivalent examination",

      marks: "As per current UPTAC / university eligibility norms",

      displayOrder: 1,
    },

    {
      course: "MCA",

      qualification:
        "Bachelor's degree with Mathematics / relevant eligibility",

      marks: "As per current university / admission authority norms",

      displayOrder: 2,
    },

    {
      course: "MBA",

      qualification: "Bachelor's degree from a recognized university",

      marks: "As per current university / admission authority norms",

      displayOrder: 3,
    },

    {
      course: "M.Tech",

      qualification: "Relevant Bachelor's degree in Engineering / Technology",

      marks: "As per current university / admission authority norms",

      displayOrder: 4,
    },
  ],

  /* =====================================================
     ADMISSION MODES
  ===================================================== */

  admissionModeLabel: "Admission Modes",

  admissionModeTitle: "Choose Your Admission Path",

  admissionModeDescription:
    "Students can secure admission through different admission channels as per university and institute guidelines.",

  admissionModes: [
    {
      title: "UPTAC Counselling",

      description:
        "Admission through the Uttar Pradesh Technical Admission Counselling process as applicable to the programme.",

      displayOrder: 1,
    },

    {
      title: "Direct Admission",

      description:
        "Eligible candidates may apply directly to the institute as per applicable rules and seat availability.",

      displayOrder: 2,
    },

    {
      title: "Management / Institute Level",

      description:
        "Admission may be available through institute-level seats according to applicable regulations.",

      displayOrder: 3,
    },

    {
      title: "Lateral Entry",

      description:
        "Eligible candidates may apply for lateral entry programmes wherever applicable.",

      displayOrder: 4,
    },
  ],

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  documentLabel: "Documents Required",

  documentTitle: "Admission Checklist",

  documentDescription:
    "Keep the following documents ready before reporting for admission.",

  requiredDocuments: [
    {
      title: "10th Marksheet / Certificate",

      displayOrder: 1,
    },

    {
      title: "12th Marksheet / Certificate",

      displayOrder: 2,
    },

    {
      title: "Graduation Marksheet / Degree",

      displayOrder: 3,
    },

    {
      title: "Transfer Certificate",

      displayOrder: 4,
    },

    {
      title: "Migration Certificate",

      displayOrder: 5,
    },

    {
      title: "Character Certificate",

      displayOrder: 6,
    },

    {
      title: "Category Certificate, if applicable",

      displayOrder: 7,
    },

    {
      title: "Recent Passport Size Photographs",

      displayOrder: 8,
    },

    {
      title: "Valid Government ID Proof",

      displayOrder: 9,
    },
  ],

  /* =====================================================
     IMPORTANT DATES
  ===================================================== */

  importantDatesEnabled: false,

  importantDateLabel: "Admission Schedule",

  importantDateTitle: "Important Dates",

  /* =====================================================
     PUBLICATION
  ===================================================== */

  isPublished: true,
};

/* =========================================================
   HELPER — SORT ARRAYS
========================================================= */

const sortAdmissionData = (data) => {
  if (!data) {
    return data;
  }

  if (Array.isArray(data.admissionSteps)) {
    data.admissionSteps = [...data.admissionSteps].sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
    );
  }

  if (Array.isArray(data.eligibility)) {
    data.eligibility = [...data.eligibility].sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
    );
  }

  if (Array.isArray(data.admissionModes)) {
    data.admissionModes = [...data.admissionModes].sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
    );
  }

  if (Array.isArray(data.requiredDocuments)) {
    data.requiredDocuments = [...data.requiredDocuments].sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
    );
  }

  return data;
};

/* =========================================================
   PUBLIC — GET ADMISSION PROCESS
========================================================= */

export const getPublicAdmissionProcess = async (req, res) => {
  try {
    let admissionProcess = await AdmissionProcess.findOne({
      isPublished: true,
    }).lean();

    /* ===================================================
         CREATE DEFAULT RECORD IF NONE EXISTS
      =================================================== */

    if (!admissionProcess) {
      admissionProcess = await AdmissionProcess.create(
        DEFAULT_ADMISSION_PROCESS,
      );

      admissionProcess = admissionProcess.toObject();
    }

    admissionProcess = sortAdmissionData(admissionProcess);

    return res.status(200).json({
      success: true,

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Get public admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load admission process.",
    });
  }
};

/* =========================================================
   ADMIN — GET ADMISSION PROCESS
========================================================= */

export const getAdminAdmissionProcess = async (req, res) => {
  try {
    let admissionProcess = await AdmissionProcess.findOne().lean();

    /* ===================================================
         CREATE DEFAULT RECORD
      =================================================== */

    if (!admissionProcess) {
      admissionProcess = await AdmissionProcess.create({
        ...DEFAULT_ADMISSION_PROCESS,

        createdBy: req.admin?._id || null,

        updatedBy: req.admin?._id || null,
      });

      admissionProcess = admissionProcess.toObject();
    }

    admissionProcess = sortAdmissionData(admissionProcess);

    return res.status(200).json({
      success: true,

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Get admin admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load admission process.",
    });
  }
};

/* =========================================================
   ADMIN — CREATE / INITIALIZE
========================================================= */

export const createAdmissionProcess = async (req, res) => {
  try {
    const existing = await AdmissionProcess.findOne();

    if (existing) {
      return res.status(200).json({
        success: true,

        message: "Admission process already exists.",

        data: existing,
      });
    }

    const admissionProcess = await AdmissionProcess.create({
      ...DEFAULT_ADMISSION_PROCESS,

      createdBy: req.admin?._id || null,

      updatedBy: req.admin?._id || null,
    });

    return res.status(201).json({
      success: true,

      message: "Admission process created successfully.",

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Create admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create admission process.",
    });
  }
};

/* =========================================================
   ADMIN — UPDATE
========================================================= */

export const updateAdmissionProcess = async (req, res) => {
  try {
    let admissionProcess = await AdmissionProcess.findOne();

    /* ===================================================
         CREATE IF MISSING
      =================================================== */

    if (!admissionProcess) {
      admissionProcess = await AdmissionProcess.create({
        ...DEFAULT_ADMISSION_PROCESS,

        ...req.body,

        createdBy: req.admin?._id || null,

        updatedBy: req.admin?._id || null,
      });
    } else {
      /* ================================================
           UPDATE ONLY SENT FIELDS
        ================================================ */

      const allowedFields = [
        "heroTag",

        "heroTitle",

        "heroTitleHighlight",

        "heroDescription",

        "applyButtonText",

        "brochureButtonText",

        "journeyLabel",

        "journeyTitle",

        "journeyDescription",

        "admissionSteps",

        "eligibilityLabel",

        "eligibilityTitle",

        "eligibilityDescription",

        "eligibility",

        "admissionModeLabel",

        "admissionModeTitle",

        "admissionModeDescription",

        "admissionModes",

        "documentLabel",

        "documentTitle",

        "documentDescription",

        "requiredDocuments",

        "importantDatesEnabled",

        "importantDateLabel",

        "importantDateTitle",

        "isPublished",
      ];

      allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          admissionProcess[field] = req.body[field];
        }
      });

      admissionProcess.updatedBy = req.admin?._id || null;

      await admissionProcess.save();
    }

    return res.status(200).json({
      success: true,

      message: "Admission process updated successfully.",

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Update admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update admission process.",
    });
  }
};

/* =========================================================
   ADMIN — PUBLISH
========================================================= */

export const publishAdmissionProcess = async (req, res) => {
  try {
    let admissionProcess = await AdmissionProcess.findOne();

    if (!admissionProcess) {
      admissionProcess = await AdmissionProcess.create({
        ...DEFAULT_ADMISSION_PROCESS,

        createdBy: req.admin?._id || null,

        updatedBy: req.admin?._id || null,
      });
    }

    admissionProcess.isPublished = true;

    admissionProcess.updatedBy = req.admin?._id || null;

    await admissionProcess.save();

    return res.status(200).json({
      success: true,

      message: "Admission process published successfully.",

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Publish admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish admission process.",
    });
  }
};

/* =========================================================
   ADMIN — UNPUBLISH
========================================================= */

export const unpublishAdmissionProcess = async (req, res) => {
  try {
    const admissionProcess = await AdmissionProcess.findOne();

    if (!admissionProcess) {
      return res.status(404).json({
        success: false,

        message: "Admission process not found.",
      });
    }

    admissionProcess.isPublished = false;

    admissionProcess.updatedBy = req.admin?._id || null;

    await admissionProcess.save();

    return res.status(200).json({
      success: true,

      message: "Admission process unpublished successfully.",

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Unpublish admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish admission process.",
    });
  }
};

/* =========================================================
   ADMIN — RESET TO DEFAULT
========================================================= */

export const resetAdmissionProcess = async (req, res) => {
  try {
    let admissionProcess = await AdmissionProcess.findOne();

    if (!admissionProcess) {
      admissionProcess = await AdmissionProcess.create({
        ...DEFAULT_ADMISSION_PROCESS,

        createdBy: req.admin?._id || null,

        updatedBy: req.admin?._id || null,
      });
    } else {
      Object.keys(DEFAULT_ADMISSION_PROCESS).forEach((field) => {
        admissionProcess[field] = DEFAULT_ADMISSION_PROCESS[field];
      });

      admissionProcess.updatedBy = req.admin?._id || null;

      await admissionProcess.save();
    }

    return res.status(200).json({
      success: true,

      message: "Admission process reset to default successfully.",

      data: admissionProcess,
    });
  } catch (error) {
    console.error("Reset admission process error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to reset admission process.",
    });
  }
};

/* =========================================================
   EXPORT DEFAULT DATA
   ---------------------------------------------------------
   Useful if another backend file needs the defaults.
========================================================= */

export { DEFAULT_ADMISSION_PROCESS };
