import UniversityRankHolder from "../models/UniversityRankHolder.js";
import cloudinary4 from "../config/cloudinaryConfig4.js";

/* ==============================
   Create Rank Holder
============================== */
export const createUniversityRankHolder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const result = await cloudinary4.uploader.upload(req.file.path, {
      folder: "university-rank-holders",
    });

    const rankHolder = await UniversityRankHolder.create({
      studentName: req.body.studentName,
      rank: req.body.rank,
      course: req.body.course,
      batch: req.body.batch,
      cgpa: req.body.cgpa,

      image: result.secure_url,
      publicId: result.public_id,

      order: req.body.order,
      isActive: req.body.isActive,
    });

    res.status(201).json({
      success: true,
      data: rankHolder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Get All Rank Holders
============================== */
export const getUniversityRankHolders = async (req, res) => {
  try {
    const rankHolders = await UniversityRankHolder.find().sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: rankHolders.length,
      data: rankHolders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Get Single Rank Holder
============================== */
export const getUniversityRankHolder = async (req, res) => {
  try {
    const rankHolder = await UniversityRankHolder.findById(req.params.id);

    if (!rankHolder) {
      return res.status(404).json({
        success: false,
        message: "Rank Holder not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: rankHolder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Update Rank Holder
============================== */
export const updateUniversityRankHolder = async (req, res) => {
  try {
    let rankHolder = await UniversityRankHolder.findById(req.params.id);

    if (!rankHolder) {
      return res.status(404).json({
        success: false,
        message: "Rank Holder not found.",
      });
    }

    let image = rankHolder.image;
    let publicId = rankHolder.publicId;

    if (req.file) {
      if (publicId) {
        await cloudinary4.uploader.destroy(publicId);
      }

      const result = await cloudinary4.uploader.upload(req.file.path, {
        folder: "university-rank-holders",
      });

      image = result.secure_url;
      publicId = result.public_id;
    }

    rankHolder = await UniversityRankHolder.findByIdAndUpdate(
      req.params.id,
      {
        studentName: req.body.studentName,
        rank: req.body.rank,
        course: req.body.course,
        batch: req.body.batch,
        cgpa: req.body.cgpa,

        image,
        publicId,

        order: req.body.order,
        isActive: req.body.isActive,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      data: rankHolder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Delete Rank Holder
============================== */
export const deleteUniversityRankHolder = async (req, res) => {
  try {
    const rankHolder = await UniversityRankHolder.findById(req.params.id);

    if (!rankHolder) {
      return res.status(404).json({
        success: false,
        message: "Rank Holder not found.",
      });
    }

    if (rankHolder.publicId) {
      await cloudinary4.uploader.destroy(rankHolder.publicId);
    }

    await UniversityRankHolder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Rank Holder deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
