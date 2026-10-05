import fs from "fs";

import AwardsRankingRatings, {
  getDefaultAwardsRankingRatings,
} from "../models/AwardsRankingRatings.js";

import cloudinary from "../config/cloudinaryConfig.js";

/* =========================================================
   GET OR CREATE SINGLETON
   ========================================================= */

const getOrCreateAwardsRankingRatings = async () => {
  let data = await AwardsRankingRatings.findOne({
    singletonKey: "awards-ranking-ratings",
  });

  if (!data) {
    data = await AwardsRankingRatings.create(getDefaultAwardsRankingRatings());
  }

  return data;
};

/* =========================================================
   PUBLIC GET
   ========================================================= */

export const getAwardsRankingRatings = async (req, res) => {
  try {
    const data = await getOrCreateAwardsRankingRatings();

    if (!data.published) {
      return res.status(200).json({
        success: true,
        data: {
          ...data.toObject(),
          records: [],
        },
      });
    }

    const publicData = data.toObject();

    publicData.records = (publicData.records || [])
      .filter((record) => record.isActive !== false)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    return res.status(200).json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    console.error("Get Awards Ranking Ratings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load awards, rankings and ratings.",
    });
  }
};

/* =========================================================
   ADMIN GET
   ========================================================= */

export const getAwardsRankingRatingsAdmin = async (req, res) => {
  try {
    const data = await getOrCreateAwardsRankingRatings();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Awards Ranking Ratings Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load awards, rankings and ratings.",
    });
  }
};

/* =========================================================
   UPDATE PAGE
   ========================================================= */

export const updateAwardsRankingRatings = async (req, res) => {
  try {
    const data = await getOrCreateAwardsRankingRatings();

    let body = req.body;

    /*
     * Supports:
     * normal JSON body
     * { data: {...} }
     */

    if (body?.data && typeof body.data === "object") {
      body = body.data;
    }

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      data.title = title;
    }

    if (body.description !== undefined) {
      data.description = String(body.description || "").trim();
    }

    if (body.published !== undefined) {
      data.published = Boolean(body.published);
    }

    /* =====================================================
         RECORDS
         ===================================================== */

    if (body.records !== undefined) {
      if (!Array.isArray(body.records)) {
        return res.status(400).json({
          success: false,
          message: "Records must be an array.",
        });
      }

      const validTypes = ["award", "ranking", "rating"];

      const records = body.records.map((record, index) => {
        if (!record?.title || !String(record.title).trim()) {
          throw new Error(`Title is required for record ${index + 1}.`);
        }

        const type = record.type || "award";

        if (!validTypes.includes(type)) {
          throw new Error(`Invalid type for record ${index + 1}.`);
        }

        return {
          _id: record._id,

          type,

          title: String(record.title).trim(),

          photoUrl: String(record.photoUrl || "").trim(),

          photoPublicId: String(record.photoPublicId || "").trim(),

          pdfUrl: String(record.pdfUrl || "").trim(),

          isActive: record.isActive !== false,

          order: Number(record.order) || index + 1,
        };
      });

      data.records = records;
    }

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Awards, rankings and ratings updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update Awards Ranking Ratings Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update information.",
    });
  }
};

/* =========================================================
   UPLOAD PHOTO
   ========================================================= */

export const uploadRecognitionPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a photo.",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/awards-ranking-ratings",
      resource_type: "image",
    });

    /*
     * Remove temporary local file
     */

    try {
      fs.unlinkSync(req.file.path);
    } catch (fileError) {
      console.warn("Temporary file deletion warning:", fileError);
    }

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully.",
      data: {
        photoUrl: result.secure_url,

        photoPublicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload Recognition Photo Error:", error);

    /*
     * Cleanup temporary file
     */

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.warn("Temporary file cleanup warning:", fileError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to upload photo.",
    });
  }
};

/* =========================================================
   DELETE PHOTO
   ========================================================= */

export const deleteRecognitionPhoto = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Recognition Photo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete photo.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   ========================================================= */

export const resetAwardsRankingRatings = async (req, res) => {
  try {
    const data = await getOrCreateAwardsRankingRatings();

    /*
     * Delete existing Cloudinary photos
     */

    if (Array.isArray(data.records)) {
      for (const record of data.records) {
        if (record.photoPublicId) {
          try {
            await cloudinary.uploader.destroy(record.photoPublicId, {
              resource_type: "image",
            });
          } catch (cloudinaryError) {
            console.warn("Cloudinary reset warning:", cloudinaryError);
          }
        }
      }
    }

    const defaults = getDefaultAwardsRankingRatings();

    data.title = defaults.title;

    data.description = defaults.description;

    data.published = defaults.published;

    data.records = defaults.records;

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Awards, rankings and ratings reset to defaults.",
      data,
    });
  } catch (error) {
    console.error("Reset Awards Ranking Ratings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset defaults.",
    });
  }
};
