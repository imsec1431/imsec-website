import AcademicCoordinator from "../models/AcademicCoordinator.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/* ==============================
   Create Academic Coordinator
============================== */
export const createAcademicCoordinator = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const result = await cloudinary5.uploader.upload(req.file.path, {
      folder: "academic-coordinators",
    });

    const coordinator = await AcademicCoordinator.create({
      name: req.body.name,
      responsibilities: req.body.responsibilities,

      photo: result.secure_url,
      photoPublicId: result.public_id,

      order: req.body.order || 0,
      isPublished:
        req.body.isPublished === undefined
          ? true
          : req.body.isPublished === "true" || req.body.isPublished === true,
    });

    res.status(201).json({
      success: true,
      message: "Academic Coordinator added successfully.",
      data: coordinator,
    });
  } catch (error) {
    console.error("Create Academic Coordinator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Get All Academic Coordinators
============================== */
export const getAcademicCoordinators = async (req, res) => {
  try {
    const coordinators = await AcademicCoordinator.find().sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: coordinators.length,
      data: coordinators,
    });
  } catch (error) {
    console.error("Get Academic Coordinators Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Get Published Academic Coordinators
============================== */
export const getPublishedAcademicCoordinators = async (req, res) => {
  try {
    const coordinators = await AcademicCoordinator.find({
      isPublished: true,
    }).sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: coordinators.length,
      data: coordinators,
    });
  } catch (error) {
    console.error("Get Published Academic Coordinators Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Get Single Academic Coordinator
============================== */
export const getAcademicCoordinator = async (req, res) => {
  try {
    const coordinator = await AcademicCoordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: "Academic Coordinator not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: coordinator,
    });
  } catch (error) {
    console.error("Get Academic Coordinator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Update Academic Coordinator
============================== */
export const updateAcademicCoordinator = async (req, res) => {
  try {
    let coordinator = await AcademicCoordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: "Academic Coordinator not found.",
      });
    }

    let photo = coordinator.photo;
    let photoPublicId = coordinator.photoPublicId;

    /* ---------- NEW IMAGE ---------- */
    if (req.file) {
      /* Upload new image first */
      const result = await cloudinary5.uploader.upload(req.file.path, {
        folder: "academic-coordinators",
      });

      photo = result.secure_url;
      photoPublicId = result.public_id;

      /* Delete old image */
      if (coordinator.photoPublicId) {
        try {
          await cloudinary5.uploader.destroy(coordinator.photoPublicId);
        } catch (deleteError) {
          console.error(
            "Old Academic Coordinator image delete error:",
            deleteError.message,
          );
        }
      }
    }

    coordinator = await AcademicCoordinator.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        responsibilities: req.body.responsibilities,

        photo,
        photoPublicId,

        order: req.body.order || 0,

        isPublished:
          req.body.isPublished === "true" || req.body.isPublished === true,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Academic Coordinator updated successfully.",
      data: coordinator,
    });
  } catch (error) {
    console.error("Update Academic Coordinator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   Delete Academic Coordinator
============================== */
export const deleteAcademicCoordinator = async (req, res) => {
  try {
    const coordinator = await AcademicCoordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: "Academic Coordinator not found.",
      });
    }

    /* Delete image from Cloudinary */
    if (coordinator.photoPublicId) {
      try {
        await cloudinary5.uploader.destroy(coordinator.photoPublicId);
      } catch (deleteError) {
        console.error("Cloudinary image delete error:", deleteError.message);
      }
    }

    await AcademicCoordinator.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Academic Coordinator deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Academic Coordinator Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
