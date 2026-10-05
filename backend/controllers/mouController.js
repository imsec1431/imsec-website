import MOU from "../models/MOU.js";
import cloudinary from "../config/cloudinaryConfig.js";

// =====================================
// Add MOU
// =====================================

export const addMOU = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Signing Photo is required",
      });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/mou",
    });

    const mou = await MOU.create({
      organization: req.body.organization,

      signingPhoto: upload.secure_url,

      publicId: upload.public_id,

      director: req.body.director,

      representative: req.body.representative,

      signedDate: req.body.signedDate,

      venue: req.body.venue,

      website: req.body.website,

      pdfLink: req.body.pdfLink,

      displayOrder: req.body.displayOrder,

      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "MOU Added Successfully",
      data: mou,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// Get All MOUs
// =====================================

export const getMOUs = async (req, res) => {
  try {
    const mou = await MOU.find().sort({
      displayOrder: 1,
      signedDate: -1,
    });

    res.status(200).json({
      success: true,
      count: mou.length,
      data: mou,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// Get Single MOU
// =====================================

export const getMOU = async (req, res) => {
  try {
    const mou = await MOU.findById(req.params.id);

    if (!mou) {
      return res.status(404).json({
        success: false,
        message: "MOU not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mou,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// Update MOU
// =====================================

export const updateMOU = async (req, res) => {
  try {
    const mou = await MOU.findById(req.params.id);

    if (!mou) {
      return res.status(404).json({
        success: false,
        message: "MOU not found",
      });
    }

    let imageUrl = mou.signingPhoto;

    let publicId = mou.publicId;

    if (req.file) {
      await cloudinary.uploader.destroy(mou.publicId);

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/mou",
      });

      imageUrl = upload.secure_url;

      publicId = upload.public_id;
    }

    mou.organization = req.body.organization;

    mou.signingPhoto = imageUrl;

    mou.publicId = publicId;

    mou.director = req.body.director;

    mou.representative = req.body.representative;

    mou.signedDate = req.body.signedDate;

    mou.venue = req.body.venue;

    mou.website = req.body.website;

    mou.pdfLink = req.body.pdfLink;

    mou.displayOrder = req.body.displayOrder;

    mou.active = req.body.active;

    await mou.save();

    res.status(200).json({
      success: true,
      message: "MOU Updated Successfully",
      data: mou,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// Delete MOU
// =====================================

export const deleteMOU = async (req, res) => {
  try {
    const mou = await MOU.findById(req.params.id);

    if (!mou) {
      return res.status(404).json({
        success: false,
        message: "MOU not found",
      });
    }

    await cloudinary.uploader.destroy(mou.publicId);

    await mou.deleteOne();

    res.status(200).json({
      success: true,
      message: "MOU Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
