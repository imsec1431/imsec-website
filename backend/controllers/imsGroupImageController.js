import IMSGroupImage from "../models/IMSGroupImage.js";
import cloudinary from "../config/cloudinaryConfig.js";

/*=========================================
GET PUBLIC
=========================================*/

export const getIMSGroupImage = async (req, res) => {
  try {
    const page = await IMSGroupImage.findOne({
      isPublished: true,
    }).sort({
      createdAt: -1,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Organizational Chart not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Get Organizational Chart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Organizational Chart",
      error: error.message,
    });
  }
};

/*=========================================
GET ADMIN
=========================================*/

export const getIMSGroupImageAdmin = async (req, res) => {
  try {
    const page = await IMSGroupImage.findOne().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Get Organizational Chart Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Organizational Chart",
      error: error.message,
    });
  }
};

/*=========================================
CREATE
=========================================*/

export const createIMSGroupImage = async (req, res) => {
  try {
    const existing = await IMSGroupImage.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Organizational Chart already exists. Please update it.",
      });
    }

    let imageUrl = "";
    let publicId = "";

    /*---------------------------------------
    UPLOAD IMAGE
    ---------------------------------------*/

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/organizational-chart",
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    /*---------------------------------------
    CREATE DATABASE RECORD
    ---------------------------------------*/

    const page = await IMSGroupImage.create({
      title: req.body.title || "Organizational Chart",

      description: req.body.description || "",

      image: imageUrl,

      imageAlt:
        req.body.imageAlt || "IMS Engineering College Organizational Chart",

      publicId,

      isPublished: req.body.isPublished !== "false",
    });

    return res.status(201).json({
      success: true,
      message: "Organizational Chart created successfully",
      data: page,
    });
  } catch (error) {
    console.error("Create Organizational Chart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Organizational Chart",
      error: error.message,
    });
  }
};

/*=========================================
UPDATE
=========================================*/

export const updateIMSGroupImage = async (req, res) => {
  try {
    let page = await IMSGroupImage.findOne();

    /*---------------------------------------
    CREATE IF NOT EXISTS
    ---------------------------------------*/

    if (!page) {
      let imageUrl = "";
      let publicId = "";

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "imsec/organizational-chart",
        });

        imageUrl = result.secure_url;
        publicId = result.public_id;
      }

      page = await IMSGroupImage.create({
        title: req.body.title || "Organizational Chart",

        description: req.body.description || "",

        image: imageUrl,

        imageAlt:
          req.body.imageAlt || "IMS Engineering College Organizational Chart",

        publicId,

        isPublished: req.body.isPublished !== "false",
      });

      return res.status(201).json({
        success: true,
        message: "Organizational Chart created successfully",
        data: page,
      });
    }

    /*---------------------------------------
    UPDATE TEXT
    ---------------------------------------*/

    page.title = req.body.title || page.title;

    page.description = req.body.description ?? page.description;

    page.imageAlt = req.body.imageAlt || page.imageAlt;

    page.isPublished =
      req.body.isPublished !== undefined
        ? req.body.isPublished !== "false"
        : page.isPublished;

    /*---------------------------------------
    NEW IMAGE
    ---------------------------------------*/

    if (req.file) {
      /*-------------------------------------
      DELETE OLD CLOUDINARY IMAGE
      -------------------------------------*/

      if (page.publicId) {
        try {
          await cloudinary.uploader.destroy(page.publicId);
        } catch (deleteError) {
          console.error("Old image delete failed:", deleteError);
        }
      }

      /*-------------------------------------
      UPLOAD NEW IMAGE
      -------------------------------------*/

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/organizational-chart",
      });

      page.image = result.secure_url;

      page.publicId = result.public_id;
    }

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Organizational Chart updated successfully",
      data: page,
    });
  } catch (error) {
    console.error("Update Organizational Chart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Organizational Chart",
      error: error.message,
    });
  }
};

/*=========================================
DELETE
=========================================*/

export const deleteIMSGroupImage = async (req, res) => {
  try {
    const page = await IMSGroupImage.findOne();

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Organizational Chart not found",
      });
    }

    /*---------------------------------------
    DELETE CLOUDINARY IMAGE
    ---------------------------------------*/

    if (page.publicId) {
      try {
        await cloudinary.uploader.destroy(page.publicId);
      } catch (error) {
        console.error("Cloudinary delete error:", error);
      }
    }

    await page.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Organizational Chart deleted successfully",
    });
  } catch (error) {
    console.error("Delete Organizational Chart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Organizational Chart",
      error: error.message,
    });
  }
};
