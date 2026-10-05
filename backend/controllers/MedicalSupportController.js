import MedicalSupport, {
  getDefaultMedicalSupport,
} from "../models/MedicalSupport.js";

/* =========================================================
   GET OR CREATE SINGLETON
========================================================= */

const getOrCreateMedicalSupport = async () => {
  let medicalSupport = await MedicalSupport.findOne({
    singletonKey: "medical-support",
  });

  if (!medicalSupport) {
    medicalSupport = await MedicalSupport.create(getDefaultMedicalSupport());
  }

  return medicalSupport;
};

/* =========================================================
   GET MEDICAL SUPPORT - PUBLIC
========================================================= */

export const getMedicalSupport = async (req, res) => {
  try {
    const medicalSupport = await getOrCreateMedicalSupport();

    if (!medicalSupport.published) {
      return res.json({
        success: true,
        data: {
          title: medicalSupport.title,
          heading: medicalSupport.heading,
          description: medicalSupport.description,
          supportPersonName: "",
          designation: "",
          email: "",
          phone: "",
          medicalFacility: "",
          published: false,
        },
      });
    }

    res.json({
      success: true,
      data: medicalSupport,
    });
  } catch (error) {
    console.error("Get Medical Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load medical support information.",
    });
  }
};

/* =========================================================
   GET MEDICAL SUPPORT - ADMIN
========================================================= */

export const getMedicalSupportAdmin = async (req, res) => {
  try {
    const medicalSupport = await getOrCreateMedicalSupport();

    res.json({
      success: true,
      data: medicalSupport,
    });
  } catch (error) {
    console.error("Get Medical Support Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load medical support information.",
    });
  }
};

/* =========================================================
   UPDATE MEDICAL SUPPORT
========================================================= */

export const updateMedicalSupport = async (req, res) => {
  try {
    const medicalSupport = await getOrCreateMedicalSupport();

    let incomingData = req.body;

    /*
      Supports both:
      1. Normal JSON
      2. { data: "JSON_STRING" }
    */

    if (typeof req.body?.data === "string") {
      try {
        incomingData = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid medical support data.",
        });
      }
    }

    const title =
      typeof incomingData?.title === "string"
        ? incomingData.title.trim()
        : medicalSupport.title;

    const heading =
      typeof incomingData?.heading === "string"
        ? incomingData.heading.trim()
        : medicalSupport.heading;

    const description =
      typeof incomingData?.description === "string"
        ? incomingData.description.trim()
        : medicalSupport.description;

    const supportPersonName =
      typeof incomingData?.supportPersonName === "string"
        ? incomingData.supportPersonName.trim()
        : medicalSupport.supportPersonName;

    const designation =
      typeof incomingData?.designation === "string"
        ? incomingData.designation.trim()
        : medicalSupport.designation;

    const email =
      typeof incomingData?.email === "string"
        ? incomingData.email.trim()
        : medicalSupport.email;

    const phone =
      typeof incomingData?.phone === "string"
        ? incomingData.phone.trim()
        : medicalSupport.phone;

    const medicalFacility =
      typeof incomingData?.medicalFacility === "string"
        ? incomingData.medicalFacility.trim()
        : medicalSupport.medicalFacility;

    const published =
      typeof incomingData?.published === "boolean"
        ? incomingData.published
        : medicalSupport.published;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!heading) {
      return res.status(400).json({
        success: false,
        message: "Heading is required.",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    if (!supportPersonName) {
      return res.status(400).json({
        success: false,
        message: "Support Person Name is required.",
      });
    }

    if (!designation) {
      return res.status(400).json({
        success: false,
        message: "Designation is required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required.",
      });
    }

    if (!medicalFacility) {
      return res.status(400).json({
        success: false,
        message: "Medical Facility information is required.",
      });
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    medicalSupport.title = title;
    medicalSupport.heading = heading;
    medicalSupport.description = description;

    medicalSupport.supportPersonName = supportPersonName;

    medicalSupport.designation = designation;

    medicalSupport.email = email;

    medicalSupport.phone = phone;

    medicalSupport.medicalFacility = medicalFacility;

    medicalSupport.published = published;

    await medicalSupport.save();

    res.json({
      success: true,
      message: "Medical Support updated successfully.",
      data: medicalSupport,
    });
  } catch (error) {
    console.error("Update Medical Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update medical support information.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetMedicalSupport = async (req, res) => {
  try {
    const defaults = getDefaultMedicalSupport();

    const medicalSupport = await getOrCreateMedicalSupport();

    medicalSupport.title = defaults.title;

    medicalSupport.heading = defaults.heading;

    medicalSupport.description = defaults.description;

    medicalSupport.supportPersonName = defaults.supportPersonName;

    medicalSupport.designation = defaults.designation;

    medicalSupport.email = defaults.email;

    medicalSupport.phone = defaults.phone;

    medicalSupport.medicalFacility = defaults.medicalFacility;

    medicalSupport.published = defaults.published;

    await medicalSupport.save();

    res.json({
      success: true,
      message: "Medical Support reset successfully.",
      data: medicalSupport,
    });
  } catch (error) {
    console.error("Reset Medical Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reset medical support information.",
    });
  }
};
