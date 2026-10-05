import Director from "../models/Director.js";
import cloudinary from "../config/cloudinaryConfig.js";

// ==============================
// Save / Update Director
// ==============================

export const saveDirector = async (req, res) => {
  try {
    const { directorName, message, linkedin } = req.body;

    let director = await Director.findOne();

    let imageUrl = director?.imageUrl || "";
    let publicId = director?.publicId || "";

    // Upload new image if provided
    if (req.file) {
      // Delete old image
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "director-message",
      });

      imageUrl = uploadedImage.secure_url;
      publicId = uploadedImage.public_id;
    }

    if (director) {
      director.directorName = directorName;
      director.message = message;
      director.linkedin = linkedin;
      director.imageUrl = imageUrl;
      director.publicId = publicId;

      await director.save();
    } else {
      director = await Director.create({
        directorName,
        message,
        linkedin,
        imageUrl,
        publicId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Director Message Saved Successfully",
      data: director,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Director
// ==============================

export const getDirector = async (req, res) => {
  try {
    const director = await Director.findOne();

    res.status(200).json({
      success: true,
      data: director,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
