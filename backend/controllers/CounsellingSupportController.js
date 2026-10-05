import CounsellingSupport, {
  getDefaultCounsellingSupport,
} from "../models/CounsellingSupport.js";

/* =========================================================
   GET OR CREATE SINGLETON
========================================================= */

const getOrCreateCounsellingSupport = async () => {
  let counselling = await CounsellingSupport.findOne({
    singletonKey: "counselling-support",
  });

  if (!counselling) {
    counselling = await CounsellingSupport.create(
      getDefaultCounsellingSupport(),
    );
  }

  return counselling;
};

/* =========================================================
   GET COUNSELLING SUPPORT - PUBLIC
========================================================= */

export const getCounsellingSupport = async (req, res) => {
  try {
    const counselling = await getOrCreateCounsellingSupport();

    if (!counselling.published) {
      return res.json({
        success: true,
        data: {
          title: counselling.title,
          heading: counselling.heading,
          description: counselling.description,
          counsellorName: "",
          designation: "",
          email: "",
          phone: "",
          published: false,
        },
      });
    }

    res.json({
      success: true,
      data: counselling,
    });
  } catch (error) {
    console.error("Get Counselling Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load counselling support information.",
    });
  }
};

/* =========================================================
   GET COUNSELLING SUPPORT - ADMIN
========================================================= */

export const getCounsellingSupportAdmin = async (req, res) => {
  try {
    const counselling = await getOrCreateCounsellingSupport();

    res.json({
      success: true,
      data: counselling,
    });
  } catch (error) {
    console.error("Get Counselling Support Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load counselling support information.",
    });
  }
};

/* =========================================================
   UPDATE COUNSELLING SUPPORT
========================================================= */

export const updateCounsellingSupport = async (req, res) => {
  try {
    const counselling = await getOrCreateCounsellingSupport();

    let incomingData = req.body;

    if (typeof req.body?.data === "string") {
      try {
        incomingData = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid counselling data.",
        });
      }
    }

    const title =
      typeof incomingData?.title === "string"
        ? incomingData.title.trim()
        : counselling.title;

    const heading =
      typeof incomingData?.heading === "string"
        ? incomingData.heading.trim()
        : counselling.heading;

    const description =
      typeof incomingData?.description === "string"
        ? incomingData.description.trim()
        : counselling.description;

    const counsellorName =
      typeof incomingData?.counsellorName === "string"
        ? incomingData.counsellorName.trim()
        : counselling.counsellorName;

    const designation =
      typeof incomingData?.designation === "string"
        ? incomingData.designation.trim()
        : counselling.designation;

    const email =
      typeof incomingData?.email === "string"
        ? incomingData.email.trim()
        : counselling.email;

    const phone =
      typeof incomingData?.phone === "string"
        ? incomingData.phone.trim()
        : counselling.phone;

    const published =
      typeof incomingData?.published === "boolean"
        ? incomingData.published
        : counselling.published;

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

    counselling.title = title;
    counselling.heading = heading;
    counselling.description = description;
    counselling.counsellorName = counsellorName;
    counselling.designation = designation;
    counselling.email = email;
    counselling.phone = phone;
    counselling.published = published;

    await counselling.save();

    res.json({
      success: true,
      message: "Counselling Support updated successfully.",
      data: counselling,
    });
  } catch (error) {
    console.error("Update Counselling Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update counselling support information.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetCounsellingSupport = async (req, res) => {
  try {
    const defaults = getDefaultCounsellingSupport();

    const counselling = await getOrCreateCounsellingSupport();

    counselling.title = defaults.title;
    counselling.heading = defaults.heading;
    counselling.description = defaults.description;
    counselling.counsellorName = defaults.counsellorName;
    counselling.designation = defaults.designation;
    counselling.email = defaults.email;
    counselling.phone = defaults.phone;
    counselling.published = defaults.published;

    await counselling.save();

    res.json({
      success: true,
      message: "Counselling Support reset successfully.",
      data: counselling,
    });
  } catch (error) {
    console.error("Reset Counselling Support Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reset counselling support information.",
    });
  }
};
