import cloudinary from "../config/cloudinaryConfig.js";
import LibrarianProfile from "../models/LibrarianProfile.js";

// ======================================
// Get Librarian Profile
// ======================================

export const getLibrarianProfile = async (req, res) => {
  try {
    const profile = await LibrarianProfile.findOne();

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Save / Update Librarian Profile
// ======================================

export const saveLibrarianProfile = async (req, res) => {
  try {
    let profile = await LibrarianProfile.findOne();

    // ==========================
    // Upload New Image
    // ==========================

    let imageUrl = profile?.image || "";
    let publicId = profile?.publicId || "";

    if (req.file) {
      // Delete old image if exists
      if (profile?.publicId) {
        await cloudinary.uploader.destroy(profile.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "library-librarian",
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    // ==========================
    // Update Existing Profile
    // ==========================

    if (profile) {
      profile.name = req.body.name;
      profile.designation = req.body.designation;
      profile.qualification = req.body.qualification;
      profile.experience = req.body.experience;
      profile.phone = req.body.phone;
      profile.email = req.body.email;
      profile.about = req.body.about;
      profile.image = imageUrl;
      profile.publicId = publicId;
      profile.active = req.body.active;

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Librarian Profile Updated Successfully",
        data: profile,
      });
    }

    // ==========================
    // Create New Profile
    // ==========================

    profile = await LibrarianProfile.create({
      name: req.body.name,
      designation: req.body.designation,
      qualification: req.body.qualification,
      experience: req.body.experience,
      phone: req.body.phone,
      email: req.body.email,
      about: req.body.about,
      image: imageUrl,
      publicId: publicId,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Librarian Profile Created Successfully",
      data: profile,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
