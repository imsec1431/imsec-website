import CDCStructure from "../models/CDCStructure.js";
import { uploadPlacementImage, deletePlacementImage } from "../config/placementCloudinary2.js";

/* =========================================
   GET PUBLIC CDC STRUCTURE
========================================= */

export const getCDCStructure = async (req, res) => {
  try {
    const structure = await CDCStructure.findOne({
      isPublished: true,
    }).sort({
      createdAt: -1,
    });

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "CDC Structure not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: structure,
    });
  } catch (error) {
    console.error("Get CDC Structure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load CDC Structure",
      error: error.message,
    });
  }
};

/* =========================================
   GET ADMIN CDC STRUCTURE
========================================= */

export const getCDCStructureAdmin = async (req, res) => {
  try {
    const structure = await CDCStructure.findOne().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: structure,
    });
  } catch (error) {
    console.error("Get CDC Structure Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load CDC Structure",
      error: error.message,
    });
  }
};

/* =========================================
   CREATE CDC STRUCTURE
========================================= */

export const createCDCStructure = async (req, res) => {
  try {
    const existing = await CDCStructure.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "CDC Structure already exists. Please update it.",
      });
    }

    /* ---------------------------------------
       IMAGE REQUIRED
    --------------------------------------- */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload the CDC Structure image.",
      });
    }

    /* ---------------------------------------
       UPLOAD TO CLOUDINARY
    --------------------------------------- */

    const uploadResult = await uploadPlacementImage(req.file.path, "imsec/cdc-structure");

    /* ---------------------------------------
       CREATE DATABASE RECORD
    --------------------------------------- */

    const structure = await CDCStructure.create({
      title: req.body.title || "CDC Structure",

      image: uploadResult.secure_url,

      publicId: uploadResult.public_id,

      imageAlt: req.body.imageAlt || "CDC Structure",

      isPublished: req.body.isPublished !== "false",
    });

    return res.status(201).json({
      success: true,
      message: "CDC Structure created successfully",
      data: structure,
    });
  } catch (error) {
    console.error("Create CDC Structure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create CDC Structure",
      error: error.message,
    });
  }
};

/* =========================================
   UPDATE CDC STRUCTURE
========================================= */

export const updateCDCStructure = async (req, res) => {
  try {
    let structure = await CDCStructure.findOne();

    /* ---------------------------------------
       IF RECORD DOES NOT EXIST
    --------------------------------------- */

    if (!structure) {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload the CDC Structure image.",
        });
      }

      const uploadResult = await uploadPlacementImage(req.file.path, "imsec/cdc-structure");

      structure = await CDCStructure.create({
        title: req.body.title || "CDC Structure",

        image: uploadResult.secure_url,

        publicId: uploadResult.public_id,

        imageAlt: req.body.imageAlt || "CDC Structure",

        isPublished: req.body.isPublished !== "false",
      });

      return res.status(201).json({
        success: true,
        message: "CDC Structure created successfully",
        data: structure,
      });
    }

    /* ---------------------------------------
       UPDATE TITLE
    --------------------------------------- */

    if (req.body.title) {
      structure.title = req.body.title;
    }

    /* ---------------------------------------
       UPDATE ALT TEXT
    --------------------------------------- */

    if (req.body.imageAlt) {
      structure.imageAlt = req.body.imageAlt;
    }

    /* ---------------------------------------
       UPDATE PUBLISH STATUS
    --------------------------------------- */

    if (req.body.isPublished !== undefined) {
      structure.isPublished = req.body.isPublished !== "false";
    }

    /* ---------------------------------------
       REPLACE IMAGE
    --------------------------------------- */

    if (req.file) {
      /* Delete old image */

      if (structure.publicId) {
        try {
          await deletePlacementImage(structure.publicId);
        } catch (deleteError) {
          console.error("Old CDC image delete failed:", deleteError);
        }
      }

      /* Upload new image */

      const uploadResult = await uploadPlacementImage(req.file.path, "imsec/cdc-structure");

      structure.image = uploadResult.secure_url;

      structure.publicId = uploadResult.public_id;
    }

    await structure.save();

    return res.status(200).json({
      success: true,
      message: "CDC Structure updated successfully",
      data: structure,
    });
  } catch (error) {
    console.error("Update CDC Structure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update CDC Structure",
      error: error.message,
    });
  }
};

/* =========================================
   DELETE CDC STRUCTURE
========================================= */

export const deleteCDCStructure = async (req, res) => {
  try {
    const structure = await CDCStructure.findOne();

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "CDC Structure not found",
      });
    }

    /* ---------------------------------------
       DELETE CLOUDINARY IMAGE
    --------------------------------------- */

    if (structure.publicId) {
      try {
        await deletePlacementImage(structure.publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    /* ---------------------------------------
       DELETE DATABASE RECORD
    --------------------------------------- */

    await structure.deleteOne();

    return res.status(200).json({
      success: true,
      message: "CDC Structure deleted successfully",
    });
  } catch (error) {
    console.error("Delete CDC Structure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete CDC Structure",
      error: error.message,
    });
  }
};
