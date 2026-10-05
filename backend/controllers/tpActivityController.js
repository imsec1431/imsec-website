import TPActivity from "../models/tpActivityModel.js";
import { uploadPlacementImage, deletePlacementImage } from "../config/placementCloudinary2.js";

/* =========================================================
   CLOUDINARY FOLDER
========================================================= */

const CLOUDINARY_FOLDER = "imsec/tp-activities";

/* =========================================================
   GET PUBLIC T&P ACTIVITIES
========================================================= */

export const getPublicTPActivities = async (req, res) => {
  try {
    const activities = await TPActivity.find({
      isPublished: true,
    })
      .sort({
        order: 1,
        activityDate: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Get public T&P activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load T&P activities.",
    });
  }
};

/* =========================================================
   GET ALL T&P ACTIVITIES - ADMIN
========================================================= */

export const getAdminTPActivities = async (req, res) => {
  try {
    const activities = await TPActivity.find()
      .sort({
        order: 1,
        activityDate: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Get admin T&P activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load T&P activities.",
    });
  }
};

/* =========================================================
   CREATE T&P ACTIVITY
========================================================= */

export const createTPActivity = async (req, res) => {
  try {
    const {
      title,
      description,
      activityDate,
      category,
      venue,
      organization,
      imageAlt,
      order,
      isPublished,
      socialMedia,
    } = req.body;

    /* =========================================
         VALIDATE TITLE
      ========================================= */

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Activity title is required.",
      });
    }

    /* =========================================
         VALIDATE DATE
      ========================================= */

    if (!activityDate) {
      return res.status(400).json({
        success: false,
        message: "Activity date is required.",
      });
    }

    /* =========================================
         FILES
      ========================================= */

    const mainImage = req.files?.image?.[0] || null;

    const galleryFiles = req.files?.gallery || [];

    /* =========================================
         MAIN IMAGE
      ========================================= */

    let image = "";

    let imagePublicId = "";

    if (mainImage) {
      if (!mainImage.path) {
        return res.status(400).json({
          success: false,
          message: "Main image path is missing.",
        });
      }

      if (mainImage.size === 0) {
        return res.status(400).json({
          success: false,
          message: "Main image file is empty.",
        });
      }

      const uploadResult = await uploadPlacementImage(mainImage.path, CLOUDINARY_FOLDER);

      image = uploadResult.secure_url;

      imagePublicId = uploadResult.public_id;
    }

    /* =========================================
         GALLERY
      ========================================= */

    const gallery = [];

    for (const file of galleryFiles) {
      if (!file?.path) {
        continue;
      }

      if (file.size === 0) {
        continue;
      }

      const uploadResult = await uploadPlacementImage(file.path, `${CLOUDINARY_FOLDER}/gallery`);

      gallery.push({
        url: uploadResult.secure_url,

        publicId: uploadResult.public_id,

        alt: imageAlt?.trim() || "",
      });
    }

    /* =========================================
         SOCIAL MEDIA
      ========================================= */

    let parsedSocialMedia = {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      twitter: "",
    };

    if (typeof socialMedia === "string") {
      try {
        parsedSocialMedia = JSON.parse(socialMedia);
      } catch (error) {
        console.error("Social media JSON parse error:", error);
      }
    }

    /* =========================================
         CREATE DOCUMENT
      ========================================= */

    const activity = await TPActivity.create({
      title: title.trim(),

      description: description?.trim() || "",

      activityDate: new Date(activityDate),

      category: category || "placement-drive",

      venue: venue?.trim() || "",

      organization: organization?.trim() || "",

      image,

      imagePublicId,

      imageAlt: imageAlt?.trim() || "",

      gallery,

      order: Number(order) || 0,

      isPublished:
        isPublished === undefined
          ? true
          : isPublished === "true" || isPublished === true,

      socialMedia: {
        facebook: parsedSocialMedia.facebook || "",

        instagram: parsedSocialMedia.instagram || "",

        linkedin: parsedSocialMedia.linkedin || "",

        youtube: parsedSocialMedia.youtube || "",

        twitter: parsedSocialMedia.twitter || "",
      },

      createdBy: req.admin?._id || req.user?._id || null,
    });

    return res.status(201).json({
      success: true,

      message: "T&P activity created successfully.",

      data: activity,
    });
  } catch (error) {
    console.error("Create T&P activity error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create T&P activity.",

      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   UPDATE T&P ACTIVITY
========================================================= */

export const updateTPActivity = async (req, res) => {
  try {
    const {
      title,
      description,
      activityDate,
      category,
      venue,
      organization,
      imageAlt,
      order,
      isPublished,
      socialMedia,
    } = req.body;

    /* =========================================
         FIND ACTIVITY
      ========================================= */

    const activity = await TPActivity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "T&P activity not found.",
      });
    }

    /* =========================================
         TITLE
      ========================================= */

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Activity title is required.",
        });
      }

      activity.title = title.trim();
    }

    /* =========================================
         DESCRIPTION
      ========================================= */

    if (description !== undefined) {
      activity.description = description.trim();
    }

    /* =========================================
         DATE
      ========================================= */

    if (activityDate !== undefined) {
      if (!activityDate) {
        return res.status(400).json({
          success: false,
          message: "Activity date is required.",
        });
      }

      activity.activityDate = new Date(activityDate);
    }

    /* =========================================
         CATEGORY
      ========================================= */

    if (category !== undefined) {
      activity.category = category;
    }

    /* =========================================
         VENUE
      ========================================= */

    if (venue !== undefined) {
      activity.venue = venue.trim();
    }

    /* =========================================
         ORGANIZATION
      ========================================= */

    if (organization !== undefined) {
      activity.organization = organization.trim();
    }

    /* =========================================
         IMAGE ALT
      ========================================= */

    if (imageAlt !== undefined) {
      activity.imageAlt = imageAlt.trim();
    }

    /* =========================================
         DISPLAY ORDER
      ========================================= */

    if (order !== undefined) {
      activity.order = Number(order) || 0;
    }

    /* =========================================
         PUBLISHED
      ========================================= */

    if (isPublished !== undefined) {
      activity.isPublished = isPublished === "true" || isPublished === true;
    }

    /* =========================================
         SOCIAL MEDIA
      ========================================= */

    if (socialMedia !== undefined) {
      let parsedSocialMedia = {};

      if (typeof socialMedia === "string") {
        try {
          parsedSocialMedia = JSON.parse(socialMedia);
        } catch (error) {
          console.error("Social media JSON parse error:", error);
        }
      } else {
        parsedSocialMedia = socialMedia;
      }

      activity.socialMedia = {
        facebook: parsedSocialMedia.facebook || "",

        instagram: parsedSocialMedia.instagram || "",

        linkedin: parsedSocialMedia.linkedin || "",

        youtube: parsedSocialMedia.youtube || "",

        twitter: parsedSocialMedia.twitter || "",
      };
    }

    /* =========================================
         NEW MAIN IMAGE
      ========================================= */

    const newMainImage = req.files?.image?.[0] || null;

    if (newMainImage) {
      if (!newMainImage.path) {
        return res.status(400).json({
          success: false,
          message: "Main image path is missing.",
        });
      }

      if (newMainImage.size === 0) {
        return res.status(400).json({
          success: false,
          message: "Main image file is empty.",
        });
      }

      /* =======================================
           UPLOAD NEW IMAGE
        ======================================= */

      const uploadResult = await uploadPlacementImage(newMainImage.path, CLOUDINARY_FOLDER);

      /* =======================================
           DELETE OLD IMAGE
        ======================================= */

      if (activity.imagePublicId) {
        try {
          await deletePlacementImage(activity.imagePublicId);
        } catch (cloudinaryError) {
          console.error("Old T&P image deletion error:", cloudinaryError);
        }
      }

      /* =======================================
           SAVE NEW IMAGE
        ======================================= */

      activity.image = uploadResult.secure_url;

      activity.imagePublicId = uploadResult.public_id;
    }

    /* =========================================
         NEW GALLERY IMAGES
      ========================================= */

    const newGalleryFiles = req.files?.gallery || [];

    if (newGalleryFiles.length > 0) {
      for (const file of newGalleryFiles) {
        if (!file?.path || file.size === 0) {
          continue;
        }

        const uploadResult = await uploadPlacementImage(file.path, `${CLOUDINARY_FOLDER}/gallery`);

        activity.gallery.push({
          url: uploadResult.secure_url,

          publicId: uploadResult.public_id,

          alt: activity.imageAlt || "",
        });
      }
    }

    /* =========================================
         UPDATED BY
      ========================================= */

    activity.updatedBy = req.admin?._id || req.user?._id || null;

    /* =========================================
         SAVE
      ========================================= */

    await activity.save();

    return res.status(200).json({
      success: true,

      message: "T&P activity updated successfully.",

      data: activity,
    });
  } catch (error) {
    console.error("Update T&P activity error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update T&P activity.",

      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   DELETE T&P ACTIVITY
========================================================= */

export const deleteTPActivity = async (req, res) => {
  try {
    const activity = await TPActivity.findById(req.params.id);

    /* =========================================
         CHECK EXISTENCE
      ========================================= */

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "T&P activity not found.",
      });
    }

    /* =========================================
         DELETE MAIN IMAGE
      ========================================= */

    if (activity.imagePublicId) {
      try {
        await deletePlacementImage(activity.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Main T&P image deletion error:", cloudinaryError);
      }
    }

    /* =========================================
         DELETE GALLERY IMAGES
      ========================================= */

    if (Array.isArray(activity.gallery)) {
      for (const galleryItem of activity.gallery) {
        if (!galleryItem?.publicId) {
          continue;
        }

        try {
          await deletePlacementImage(galleryItem.publicId);
        } catch (cloudinaryError) {
          console.error("Gallery image deletion error:", cloudinaryError);
        }
      }
    }

    /* =========================================
         DELETE DATABASE RECORD
      ========================================= */

    await TPActivity.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,

      message: "T&P activity deleted successfully.",
    });
  } catch (error) {
    console.error("Delete T&P activity error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete T&P activity.",
    });
  }
};
