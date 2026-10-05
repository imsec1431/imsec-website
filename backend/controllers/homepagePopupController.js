import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import HomepagePopup, {
  HomepagePopupSettings,
  getDefaultHomepagePopupSettings,
} from "../models/homepagePopupModel.js";

import cloudinary from "../config/cloudinaryConfig.js";

/* =========================================================
   PATH HELPERS
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   SETTINGS HELPER
========================================================= */

const getOrCreateSettings = async () => {
  let settings = await HomepagePopupSettings.findOne({
    singletonKey: "homepage-popup-settings",
  });

  if (!settings) {
    settings = await HomepagePopupSettings.create(
      getDefaultHomepagePopupSettings(),
    );
  }

  return settings;
};

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

const uploadToCloudinary = async (file) => {
  if (!file?.path) {
    throw new Error("Uploaded file is missing.");
  }

  const isPdf =
    file.mimetype === "application/pdf" ||
    file.originalname?.toLowerCase().endsWith(".pdf");

  const resourceType = isPdf ? "raw" : "image";

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "imsec/homepage-popups",
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};

/* =========================================================
   DELETE TEMPORARY MULTER FILE
========================================================= */

const deleteTempFile = (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("TEMP FILE DELETE ERROR:", error);
  }
};

/* =========================================================
   DELETE CLOUDINARY FILE
========================================================= */

const deleteCloudinaryFile = async (publicId, type = "image") => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: type === "pdf" ? "raw" : "image",
    });
  } catch (error) {
    console.error("CLOUDINARY FILE DELETE ERROR:", error);
  }
};

/* =========================================================
   GET ALL POPUPS - ADMIN
   GET /api/homepage-popup
========================================================= */

export const getAllHomepagePopups = async (req, res) => {
  try {
    const popups = await HomepagePopup.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,

      data: popups,

      settings: {
        rotationEnabled: settings.rotationEnabled,
        rotationInterval: settings.rotationInterval,
        published: settings.published,
      },
    });
  } catch (error) {
    console.error("GET ALL HOMEPAGE POPUPS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load homepage popups.",
    });
  }
};

/* =========================================================
   GET ACTIVE POPUPS - PUBLIC
   GET /api/homepage-popup/public
========================================================= */

export const getActiveHomepagePopups = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (!settings.published) {
      return res.status(200).json({
        success: true,

        data: [],

        settings: {
          rotationEnabled: settings.rotationEnabled,
          rotationInterval: settings.rotationInterval,
          published: false,
        },
      });
    }

    const popups = await HomepagePopup.find({
      isActive: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      data: popups,

      settings: {
        rotationEnabled: settings.rotationEnabled,
        rotationInterval: settings.rotationInterval,
        published: settings.published,
      },
    });
  } catch (error) {
    console.error("GET ACTIVE HOMEPAGE POPUPS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load homepage popups.",
    });
  }
};

/* =========================================================
   GET SINGLE POPUP
   GET /api/homepage-popup/admin/:id
========================================================= */

export const getHomepagePopupById = async (req, res) => {
  try {
    const popup = await HomepagePopup.findById(req.params.id);

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: popup,
    });
  } catch (error) {
    console.error("GET HOMEPAGE POPUP BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load popup.",
    });
  }
};

/* =========================================================
   CREATE POPUP
   POST /api/homepage-popup/admin

   multipart/form-data

   Fields:
   - title
   - type
   - isActive
   - displayOrder
   - file
========================================================= */

export const createHomepagePopup = async (req, res) => {
  let uploadedCloudinary = null;

  try {
    const { title, type, isActive, displayOrder } = req.body;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!title?.trim()) {
      deleteTempFile(req.file?.path);

      return res.status(400).json({
        success: false,
        message: "Popup title is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image or PDF file.",
      });
    }

    if (!["image", "pdf"].includes(type)) {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Popup type must be image or pdf.",
      });
    }

    /* -----------------------------------------------------
       VALIDATE FILE TYPE AGAIN
    ----------------------------------------------------- */

    const isPdf =
      req.file.mimetype === "application/pdf" ||
      req.file.originalname?.toLowerCase().endsWith(".pdf");

    const actualType = isPdf ? "pdf" : "image";

    if (actualType !== type) {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: `Selected file does not match the selected type (${type}).`,
      });
    }

    /* -----------------------------------------------------
       UPLOAD TO CLOUDINARY
    ----------------------------------------------------- */

    uploadedCloudinary = await uploadToCloudinary(req.file);

    /* -----------------------------------------------------
       CREATE DATABASE RECORD
    ----------------------------------------------------- */

    const popup = await HomepagePopup.create({
      title: title.trim(),

      type,

      filePath: uploadedCloudinary.url,

      fileName: req.file.originalname || "",

      publicId: uploadedCloudinary.publicId || "",

      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",

      displayOrder: displayOrder === undefined ? 1 : Number(displayOrder) || 1,
    });

    /* -----------------------------------------------------
       DELETE TEMP FILE
    ----------------------------------------------------- */

    deleteTempFile(req.file.path);

    return res.status(201).json({
      success: true,

      message: "Homepage popup uploaded and created successfully.",

      data: popup,
    });
  } catch (error) {
    console.error("CREATE HOMEPAGE POPUP ERROR:", error);

    /* -----------------------------------------------------
       CLEANUP CLOUDINARY IF DB SAVE FAILED
    ----------------------------------------------------- */

    if (uploadedCloudinary?.publicId) {
      await deleteCloudinaryFile(
        uploadedCloudinary.publicId,
        req.body?.type || "image",
      );
    }

    /* -----------------------------------------------------
       CLEANUP TEMP FILE
    ----------------------------------------------------- */

    deleteTempFile(req.file?.path);

    return res.status(500).json({
      success: false,

      message: error?.message || "Unable to upload and create homepage popup.",
    });
  }
};

/* =========================================================
   UPDATE POPUP
   PUT /api/homepage-popup/admin/:id

   multipart/form-data

   File is OPTIONAL.

   If no new file:
   existing file remains.

   If new file:
   old Cloudinary file is deleted after
   successful new upload.
========================================================= */

export const updateHomepagePopup = async (req, res) => {
  let newCloudinary = null;

  try {
    const popup = await HomepagePopup.findById(req.params.id);

    if (!popup) {
      deleteTempFile(req.file?.path);

      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    const { title, type, isActive, displayOrder } = req.body;

    /* -----------------------------------------------------
       TITLE
    ----------------------------------------------------- */

    if (title !== undefined) {
      if (!title.trim()) {
        deleteTempFile(req.file?.path);

        return res.status(400).json({
          success: false,
          message: "Popup title is required.",
        });
      }

      popup.title = title.trim();
    }

    /* -----------------------------------------------------
       TYPE
    ----------------------------------------------------- */

    if (type !== undefined) {
      if (!["image", "pdf"].includes(type)) {
        deleteTempFile(req.file?.path);

        return res.status(400).json({
          success: false,
          message: "Popup type must be image or pdf.",
        });
      }

      popup.type = type;
    }

    /* -----------------------------------------------------
       NEW FILE
    ----------------------------------------------------- */

    if (req.file) {
      const isPdf =
        req.file.mimetype === "application/pdf" ||
        req.file.originalname?.toLowerCase().endsWith(".pdf");

      const actualType = isPdf ? "pdf" : "image";

      const selectedType = type || popup.type;

      if (actualType !== selectedType) {
        deleteTempFile(req.file.path);

        return res.status(400).json({
          success: false,
          message: `Selected file does not match the selected type (${selectedType}).`,
        });
      }

      /* -----------------------------------------------
         UPLOAD NEW FILE
      ------------------------------------------------ */

      newCloudinary = await uploadToCloudinary(req.file);

      const oldPublicId = popup.publicId;
      const oldType = popup.type;

      popup.filePath = newCloudinary.url;

      popup.fileName = req.file.originalname || "";

      popup.publicId = newCloudinary.publicId || "";

      popup.type = selectedType;

      await popup.save();

      /* -----------------------------------------------
         DELETE OLD CLOUDINARY FILE
      ------------------------------------------------ */

      if (oldPublicId && oldPublicId !== newCloudinary.publicId) {
        await deleteCloudinaryFile(oldPublicId, oldType);
      }

      deleteTempFile(req.file.path);

      return res.status(200).json({
        success: true,

        message: "Homepage popup updated successfully.",

        data: popup,
      });
    }

    /* -----------------------------------------------------
       NO NEW FILE
    ----------------------------------------------------- */

    if (isActive !== undefined) {
      popup.isActive = isActive === true || isActive === "true";
    }

    if (displayOrder !== undefined) {
      popup.displayOrder = Number(displayOrder) || 1;
    }

    await popup.save();

    return res.status(200).json({
      success: true,

      message: "Homepage popup updated successfully.",

      data: popup,
    });
  } catch (error) {
    console.error("UPDATE HOMEPAGE POPUP ERROR:", error);

    deleteTempFile(req.file?.path);

    if (newCloudinary?.publicId) {
      await deleteCloudinaryFile(
        newCloudinary.publicId,
        req.body?.type || "image",
      );
    }

    return res.status(500).json({
      success: false,

      message: error?.message || "Unable to update homepage popup.",
    });
  }
};

/* =========================================================
   DELETE POPUP
   DELETE /api/homepage-popup/admin/:id
========================================================= */

export const deleteHomepagePopup = async (req, res) => {
  try {
    const popup = await HomepagePopup.findById(req.params.id);

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "Popup not found.",
      });
    }

    /* -----------------------------------------------------
       DELETE CLOUDINARY FILE
    ----------------------------------------------------- */

    if (popup.publicId) {
      await deleteCloudinaryFile(popup.publicId, popup.type);
    }

    await popup.deleteOne();

    return res.status(200).json({
      success: true,

      message: "Homepage popup deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE HOMEPAGE POPUP ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete homepage popup.",
    });
  }
};

/* =========================================================
   UPDATE ROTATION SETTINGS
========================================================= */

export const updateHomepagePopupSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { rotationEnabled, rotationInterval, published } = req.body;

    if (rotationEnabled !== undefined) {
      settings.rotationEnabled =
        rotationEnabled === true || rotationEnabled === "true";
    }

    if (rotationInterval !== undefined) {
      const interval = Number(rotationInterval);

      if (Number.isNaN(interval) || interval < 2 || interval > 300) {
        return res.status(400).json({
          success: false,
          message: "Rotation interval must be between 2 and 300 seconds.",
        });
      }

      settings.rotationInterval = interval;
    }

    if (published !== undefined) {
      settings.published = published === true || published === "true";
    }

    await settings.save();

    return res.status(200).json({
      success: true,

      message: "Popup settings updated successfully.",

      data: settings,
    });
  } catch (error) {
    console.error("UPDATE HOMEPAGE POPUP SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update popup settings.",
    });
  }
};

/* =========================================================
   RESET ROTATION SETTINGS
========================================================= */

export const resetHomepagePopupSettings = async (req, res) => {
  try {
    const settings = await HomepagePopupSettings.findOneAndUpdate(
      {
        singletonKey: "homepage-popup-settings",
      },

      getDefaultHomepagePopupSettings(),

      {
        new: true,
        upsert: true,
      },
    );

    return res.status(200).json({
      success: true,

      message: "Popup settings reset successfully.",

      data: settings,
    });
  } catch (error) {
    console.error("RESET HOMEPAGE POPUP SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to reset popup settings.",
    });
  }
};
