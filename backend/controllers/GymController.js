import Gym, { getDefaultGym } from "../models/Gym.js";

/* =========================================================
   GET OR CREATE GYM
   ========================================================= */

const getOrCreateGym = async () => {
  let gym = await Gym.findOne({
    singletonKey: "gym",
  });

  if (!gym) {
    gym = await Gym.create(getDefaultGym());
  }

  return gym;
};

/* =========================================================
   PUBLIC GET
   ========================================================= */

export const getGym = async (req, res) => {
  try {
    const gym = await getOrCreateGym();

    if (!gym.published) {
      return res.status(200).json({
        success: true,
        data: {
          title: gym.title,
          heading: gym.heading,
          description: gym.description,
          facilityDescription: "",
          timings: "",
          location: "",
          contactPerson: "",
          contactEmail: "",
          contactPhone: "",
          photo1: gym.photo1,
          photo2: gym.photo2,
          published: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: gym,
    });
  } catch (error) {
    console.error("Get Gym Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load gym information.",
    });
  }
};

/* =========================================================
   ADMIN GET
   ========================================================= */

export const getGymAdmin = async (req, res) => {
  try {
    const gym = await getOrCreateGym();

    res.status(200).json({
      success: true,
      data: gym,
    });
  } catch (error) {
    console.error("Get Gym Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load gym information.",
    });
  }
};

/* =========================================================
   UPDATE GYM
   ========================================================= */

export const updateGym = async (req, res) => {
  try {
    const gym = await getOrCreateGym();

    /*
      Supports:
      1. Normal JSON request
      2. multipart/form-data with JSON inside req.body.data
    */

    let incomingData = req.body;

    if (req.body?.data) {
      try {
        incomingData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format.",
        });
      }
    }

    const fields = [
      "title",
      "heading",
      "description",
      "facilityDescription",
      "timings",
      "location",
      "contactPerson",
      "contactEmail",
      "contactPhone",
      "photo1",
      "photo2",
    ];

    fields.forEach((field) => {
      if (incomingData[field] !== undefined) {
        if (typeof incomingData[field] === "string") {
          gym[field] = incomingData[field].trim();
        } else {
          gym[field] = incomingData[field];
        }
      }
    });

    if (incomingData.published !== undefined) {
      gym.published =
        incomingData.published === true || incomingData.published === "true";
    }

    /* -------------------------
       Validation
       ------------------------- */

    const requiredFields = [
      "title",
      "heading",
      "description",
      "facilityDescription",
      "timings",
      "location",
      "contactPerson",
      "contactEmail",
      "contactPhone",
    ];

    for (const field of requiredFields) {
      if (!gym[field] || String(gym[field]).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /* -------------------------
       Uploaded Images
       ------------------------- */

    if (req.files) {
      if (req.files.photo1?.[0]?.path) {
        gym.photo1 = req.files.photo1[0].path;
      }

      if (req.files.photo2?.[0]?.path) {
        gym.photo2 = req.files.photo2[0].path;
      }
    }

    /*
      Also support single uploaded files if frontend
      sends photo1/photo2 individually.
    */

    if (req.file?.path) {
      if (req.file.fieldname === "photo1") {
        gym.photo1 = req.file.path;
      }

      if (req.file.fieldname === "photo2") {
        gym.photo2 = req.file.path;
      }
    }

    await gym.save();

    res.status(200).json({
      success: true,
      message: "Gym information updated successfully.",
      data: gym,
    });
  } catch (error) {
    console.error("Update Gym Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update gym information.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   ========================================================= */

export const resetGym = async (req, res) => {
  try {
    const defaultData = getDefaultGym();

    const gym = await Gym.findOneAndUpdate(
      {
        singletonKey: "gym",
      },
      defaultData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Gym information reset to defaults.",
      data: gym,
    });
  } catch (error) {
    console.error("Reset Gym Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reset gym information.",
    });
  }
};
