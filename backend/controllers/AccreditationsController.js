import fs from "fs";

import cloudinary from "../config/cloudinaryConfig.js";

import Accreditations, {
  getDefaultAccreditations,
} from "../models/Accreditations.js";

/* =========================================================
   GET OR CREATE ACCREDITATIONS
   ========================================================= */

const getOrCreateAccreditations = async () => {
  let accreditations = await Accreditations.findOne({
    singletonKey: "accreditations",
  });

  if (!accreditations) {
    accreditations = await Accreditations.create(getDefaultAccreditations());
  }

  return accreditations;
};

/* =========================================================
   PUBLIC - GET ACCREDITATIONS
   ========================================================= */

export const getAccreditations = async (req, res) => {
  try {
    const accreditations = await getOrCreateAccreditations();

    const data = accreditations.toObject();

    /* Only active records are required publicly */

    data.records = Array.isArray(data.records)
      ? data.records
          .filter((record) => record.isActive !== false)
          .sort((a, b) => (a.order || 1) - (b.order || 1))
      : [];

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Accreditations Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load accreditations.",
    });
  }
};

/* =========================================================
   ADMIN - GET ACCREDITATIONS
   ========================================================= */

export const getAccreditationsAdmin = async (req, res) => {
  try {
    const accreditations = await getOrCreateAccreditations();

    res.status(200).json({
      success: true,
      data: accreditations,
    });
  } catch (error) {
    console.error("Get Accreditations Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load accreditations.",
    });
  }
};

/* =========================================================
   ADMIN - UPDATE ACCREDITATIONS
   ========================================================= */

export const updateAccreditations = async (req, res) => {
  try {
    const accreditations = await getOrCreateAccreditations();

    /*
      Supports both:

      req.body = {
        title,
        description,
        published,
        records
      }

      and

      req.body.data = {
        title,
        description,
        published,
        records
      }
    */

    let payload = req.body;

    if (req.body?.data) {
      payload =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    }

    /* =====================================================
       PAGE INFORMATION
       ===================================================== */

    if (payload.title !== undefined) {
      if (!String(payload.title).trim()) {
        return res.status(400).json({
          success: false,
          message: "Accreditations title is required.",
        });
      }

      accreditations.title = String(payload.title).trim();
    }

    if (payload.description !== undefined) {
      accreditations.description = String(payload.description || "").trim();
    }

    if (payload.published !== undefined) {
      accreditations.published =
        payload.published === true || payload.published === "true";
    }

    /* =====================================================
       RECORDS
       ===================================================== */

    if (payload.records !== undefined) {
      if (!Array.isArray(payload.records)) {
        return res.status(400).json({
          success: false,
          message: "Records must be an array.",
        });
      }

      accreditations.records = payload.records.map((record, index) => ({
        _id: record._id || undefined,

        title: String(record.title || "").trim(),

        description: String(record.description || "").trim(),

        accreditationBody: String(record.accreditationBody || "").trim(),

        validity: String(record.validity || "").trim(),

        photoUrl: String(record.photoUrl || "").trim(),

        photoPublicId: String(record.photoPublicId || "").trim(),

        linkUrl: String(record.linkUrl || "").trim(),

        certificateUrl: String(record.certificateUrl || "").trim(),

        isActive: record.isActive !== false,

        order: Number(record.order) || index + 1,
      }));
    }

    /* =====================================================
       VALIDATE RECORD TITLES
       ===================================================== */

    for (const record of accreditations.records) {
      if (!String(record.title).trim()) {
        return res.status(400).json({
          success: false,
          message: "Every accreditation record must have a title.",
        });
      }
    }

    const updated = await accreditations.save();

    res.status(200).json({
      success: true,
      message: "Accreditations updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update Accreditations Error:", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Unable to update accreditations.",
    });
  }
};

/* =========================================================
   ADMIN - UPLOAD PHOTO
   ========================================================= */

export const uploadAccreditationPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a photo.",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/accreditations",
      resource_type: "image",
    });

    /* Delete temporary file */

    try {
      fs.unlinkSync(req.file.path);
    } catch (fileError) {
      console.warn("Unable to delete temporary file:", fileError.message);
    }

    res.status(200).json({
      success: true,
      message: "Accreditation photo uploaded successfully.",
      data: {
        photoUrl: result.secure_url,
        photoPublicId: result.public_id,
      },
    });
  } catch (error) {
    /* Cleanup temporary file */

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.warn("Unable to delete temporary file:", fileError.message);
      }
    }

    console.error("Upload Accreditation Photo Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to upload accreditation photo.",
    });
  }
};

/* =========================================================
   ADMIN - DELETE PHOTO
   ========================================================= */

export const deleteAccreditationPhoto = async (req, res) => {
  try {
    const publicId = req.body?.publicId || req.query?.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary public ID is required.",
      });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    res.status(200).json({
      success: true,
      message: "Accreditation photo deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Accreditation Photo Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete accreditation photo.",
    });
  }
};

/* =========================================================
   ADMIN - RESET DEFAULTS
   ========================================================= */

export const resetAccreditations = async (req, res) => {
  try {
    const defaults = getDefaultAccreditations();

    const accreditations = await getOrCreateAccreditations();

    /*
        Delete existing Cloudinary images
        before resetting the records.
      */

    if (Array.isArray(accreditations.records)) {
      for (const record of accreditations.records) {
        if (record.photoPublicId) {
          try {
            await cloudinary.uploader.destroy(record.photoPublicId, {
              resource_type: "image",
            });
          } catch (cloudinaryError) {
            console.warn(
              "Unable to delete old accreditation image:",
              cloudinaryError.message,
            );
          }
        }
      }
    }

    accreditations.title = defaults.title;

    accreditations.description = defaults.description;

    accreditations.published = defaults.published;

    accreditations.records = defaults.records;

    const updated = await accreditations.save();

    res.status(200).json({
      success: true,
      message: "Accreditations reset to default successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Reset Accreditations Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reset accreditations.",
    });
  }
};
