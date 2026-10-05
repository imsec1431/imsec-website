import Photo from "../models/Photo.js";
import cloudinary from "../config/cloudinaryConfig.js";

// export const uploadPhoto = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload an image.",
//       });
//     }

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "mern-gallery",
//     });

//     const photo = await Photo.create({
//       title: req.body.title,
//       description: req.body.description,
//       imageUrl: result.secure_url,
//       publicId: result.public_id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Image uploaded successfully.",
//       data: photo,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// =============================
// GET ALL PHOTOS
// =============================
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image.",
      });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mern-gallery",
      });

      const photo = await Photo.create({
        title: req.body.title || file.originalname,
        description: req.body.description || "",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });

      uploadedPhotos.push(photo);
    }

    res.status(201).json({
      success: true,
      count: uploadedPhotos.length,
      data: uploadedPhotos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// GET SINGLE PHOTO
// =============================

export const getSinglePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// DELETE PHOTO
// =============================

export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Delete document from MongoDB
    // await Photo.findByIdAndDelete(req.params.id);
    await photo.deleteOne();

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// UPDATE PHOTO
// =============================

export const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Update title & description
    photo.title = req.body.title || photo.title;
    photo.description = req.body.description || photo.description;

    // If new image uploaded
    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(photo.publicId);

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern-gallery",
      });

      photo.imageUrl = result.secure_url;
      photo.publicId = result.public_id;
    }

    await photo.save();

    res.status(200).json({
      success: true,
      message: "Photo updated successfully",
      data: photo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
