import Sports, { getDefaultSports } from "../models/Sports.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

/* =========================================================
   GET OR CREATE SPORTS
========================================================= */

const getOrCreateSports = async () => {
  let sports = await Sports.findOne({
    singletonKey: "sports",
  });

  if (!sports) {
    sports = await Sports.create(getDefaultSports());
  }

  return sports;
};

/* =========================================================
   PUBLIC GET
========================================================= */

export const getSports = async (req, res) => {
  try {
    const sports = await getOrCreateSports();

    if (!sports.published) {
      return res.status(200).json({
        success: true,
        data: {
          title: sports.title,
          heroSubtitle: sports.heroSubtitle,
          breadcrumb: sports.breadcrumb,
          heading: sports.heading,
          description: sports.description,

          coordinatorName: "",
          coordinatorDesignation: "",
          coordinatorEmail: "",
          coordinatorPhone: "",

          outdoorHeading: sports.outdoorHeading,
          outdoorDescription: sports.outdoorDescription,

          indoorHeading: sports.indoorHeading,
          indoorDescription: sports.indoorDescription,

          fitnessHeading: sports.fitnessHeading,
          fitnessDescription: sports.fitnessDescription,

          trainingHeading: sports.trainingHeading,
          trainingDescription: sports.trainingDescription,

          activitiesHeading: sports.activitiesHeading,
          activitiesDescription: sports.activitiesDescription,

          timingsHeading: sports.timingsHeading,
          timings: sports.timings,

          facilities: [],
          achievements: [],

          /*
           * Gallery remains available so that
           * previously uploaded images are not lost.
           */
          images: sports.images,

          published: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: sports,
    });
  } catch (error) {
    console.error("Get Sports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load sports information.",
    });
  }
};

/* =========================================================
   ADMIN GET
========================================================= */

export const getSportsAdmin = async (req, res) => {
  try {
    const sports = await getOrCreateSports();

    return res.status(200).json({
      success: true,
      data: sports,
    });
  } catch (error) {
    console.error("Get Sports Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load sports information.",
    });
  }
};

/* =========================================================
   UPDATE SPORTS
========================================================= */

export const updateSports = async (req, res) => {
  try {
    const sports = await getOrCreateSports();

    let incomingData = req.body;

    /* =====================================================
       SUPPORT JSON + MULTIPART
    ===================================================== */

    if (req.body?.data) {
      try {
        incomingData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format.",
        });
      }
    }

    /* =====================================================
       TEXT FIELDS
    ===================================================== */

    const textFields = [
      "title",
      "heroSubtitle",
      "breadcrumb",
      "heading",
      "description",

      "coordinatorName",
      "coordinatorDesignation",
      "coordinatorEmail",
      "coordinatorPhone",

      "outdoorHeading",
      "outdoorDescription",

      "indoorHeading",
      "indoorDescription",

      "fitnessHeading",
      "fitnessDescription",

      "trainingHeading",
      "trainingDescription",

      "activitiesHeading",
      "activitiesDescription",

      "timingsHeading",
      "timings",
    ];

    textFields.forEach((field) => {
      if (incomingData[field] !== undefined) {
        sports[field] =
          typeof incomingData[field] === "string"
            ? incomingData[field].trim()
            : incomingData[field];
      }
    });

    /* =====================================================
       PUBLISHED
    ===================================================== */

    if (incomingData.published !== undefined) {
      sports.published =
        incomingData.published === true || incomingData.published === "true";
    }

    /* =====================================================
       FACILITIES
    ===================================================== */

    if (incomingData.facilities !== undefined) {
      let facilities = incomingData.facilities;

      if (typeof facilities === "string") {
        try {
          facilities = JSON.parse(facilities);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid facilities data.",
          });
        }
      }

      if (!Array.isArray(facilities)) {
        return res.status(400).json({
          success: false,
          message: "Facilities must be an array.",
        });
      }

      sports.facilities = facilities;
    }

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    if (incomingData.achievements !== undefined) {
      let achievements = incomingData.achievements;

      if (typeof achievements === "string") {
        try {
          achievements = JSON.parse(achievements);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid achievements data.",
          });
        }
      }

      if (!Array.isArray(achievements)) {
        return res.status(400).json({
          success: false,
          message: "Achievements must be an array.",
        });
      }

      sports.achievements = achievements;
    }

    /* =====================================================
       EXISTING GALLERY DATA
    ===================================================== */

    if (incomingData.images !== undefined) {
      let images = incomingData.images;

      if (typeof images === "string") {
        try {
          images = JSON.parse(images);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid gallery data.",
          });
        }
      }

      if (!Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: "Gallery images must be an array.",
        });
      }

      sports.images = images;
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    const requiredFields = [
      "title",
      "heroSubtitle",
      "breadcrumb",
      "heading",
      "description",

      "coordinatorName",
      "coordinatorDesignation",

      "outdoorHeading",
      "outdoorDescription",

      "indoorHeading",
      "indoorDescription",

      "fitnessHeading",
      "fitnessDescription",

      "trainingHeading",
      "trainingDescription",

      "activitiesHeading",
      "activitiesDescription",

      "timingsHeading",
      "timings",
    ];

    for (const field of requiredFields) {
      if (!sports[field] || String(sports[field]).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /* =====================================================
       UPLOAD NEW GALLERY IMAGES
       
       Existing Multer stores files temporarily.
       We upload those files to Cloudinary.
    ===================================================== */

    if (req.files?.galleryImages?.length) {
      const uploadedImages = req.files.galleryImages;

      const startOrder = sports.images.length + 1;

      for (let index = 0; index < uploadedImages.length; index += 1) {
        const file = uploadedImages[index];

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "imsec/sports",
          resource_type: "image",
        });

        /* -----------------------------------------------
           REMOVE TEMPORARY LOCAL FILE
        ------------------------------------------------ */

        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (fileError) {
          console.warn(
            "Unable to remove temporary Sports image:",
            fileError.message,
          );
        }

        /* -----------------------------------------------
           SAVE CLOUDINARY URL
        ------------------------------------------------ */

        sports.images.push({
          title:
            file.originalname?.replace(/\.[^/.]+$/, "")?.trim() ||
            `Sports Image ${startOrder + index}`,

          imageUrl: result.secure_url,

          publicId: result.public_id,

          altText: file.originalname || "IMSEC Sports Facility",

          order: startOrder + index,
        });
      }
    }

    /* =====================================================
       SAVE
    ===================================================== */

    await sports.save();

    return res.status(200).json({
      success: true,
      message: "Sports information updated successfully.",
      data: sports,
    });
  } catch (error) {
    console.error("Update Sports Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to update sports information.",
    });
  }
};

/* =========================================================
   DELETE GALLERY IMAGE
========================================================= */

export const deleteSportsImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required.",
      });
    }

    const sports = await getOrCreateSports();

    const image = sports.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Sports image not found.",
      });
    }

    /* =====================================================
       DELETE FROM CLOUDINARY
    ===================================================== */

    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.warn(
          "Unable to delete Sports image from Cloudinary:",
          cloudinaryError.message,
        );
      }
    }

    /* =====================================================
       DELETE FROM DATABASE
    ===================================================== */

    image.deleteOne();

    await sports.save();

    return res.status(200).json({
      success: true,
      message: "Sports image deleted successfully.",
      data: sports,
    });
  } catch (error) {
    console.error("Delete Sports Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete sports image.",
    });
  }
};

/* =========================================================
   UPDATE GALLERY IMAGE DETAILS
========================================================= */

export const updateSportsImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required.",
      });
    }

    const sports = await getOrCreateSports();

    const image = sports.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Sports image not found.",
      });
    }

    const { title, altText, order } = req.body;

    if (title !== undefined) {
      image.title = String(title).trim();
    }

    if (altText !== undefined) {
      image.altText = String(altText).trim();
    }

    if (order !== undefined) {
      image.order = Number(order) || 1;
    }

    await sports.save();

    return res.status(200).json({
      success: true,
      message: "Sports image updated successfully.",
      data: sports,
    });
  } catch (error) {
    console.error("Update Sports Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update sports image.",
    });
  }
};

/* =========================================================
   REPLACE SPORTS IMAGE
========================================================= */

export const replaceSportsImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const sports = await getOrCreateSports();

    const image = sports.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Sports image not found.",
      });
    }

    /* =====================================================
       DELETE OLD CLOUDINARY IMAGE
    ===================================================== */

    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.warn(
          "Unable to delete old Sports image from Cloudinary:",
          cloudinaryError.message,
        );
      }
    }

    /* =====================================================
       UPLOAD NEW IMAGE
    ===================================================== */

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/sports",
      resource_type: "image",
    });

    /* =====================================================
       REMOVE TEMPORARY FILE
    ===================================================== */

    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (fileError) {
      console.warn(
        "Unable to remove temporary Sports image:",
        fileError.message,
      );
    }

    /* =====================================================
       UPDATE DATABASE
    ===================================================== */

    image.imageUrl = result.secure_url;

    image.publicId = result.public_id;

    await sports.save();

    return res.status(200).json({
      success: true,
      message: "Sports image replaced successfully.",
      data: sports,
    });
  } catch (error) {
    console.error("Replace Sports Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to replace sports image.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetSports = async (req, res) => {
  try {
    /* =====================================================
       GET CURRENT DATA
    ===================================================== */

    const currentSports = await Sports.findOne({
      singletonKey: "sports",
    });

    /* =====================================================
       DELETE UPLOADED CLOUDINARY IMAGES
       
       Default Unsplash images have publicId=""
       so they are automatically ignored.
    ===================================================== */

    if (currentSports?.images?.length) {
      for (const image of currentSports.images) {
        if (image.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId, {
              resource_type: "image",
            });
          } catch (cloudinaryError) {
            console.warn(
              "Unable to delete Sports reset image from Cloudinary:",
              cloudinaryError.message,
            );
          }
        }
      }
    }

    /* =====================================================
       DEFAULT DATA
    ===================================================== */

    const defaultData = getDefaultSports();

    /* =====================================================
       RESET DATABASE
    ===================================================== */

    const sports = await Sports.findOneAndUpdate(
      {
        singletonKey: "sports",
      },
      defaultData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Sports information reset to defaults.",
      data: sports,
    });
  } catch (error) {
    console.error("Reset Sports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset sports information.",
    });
  }
};
