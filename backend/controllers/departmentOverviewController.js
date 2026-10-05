import DepartmentOverview from "../models/DepartmentOverview.js";
import Department from "../models/Department.js";
import cloudinary3 from "../config/cloudinaryConfig3.js";
import fs from "fs";

/* =========================================================
   CREATE DEPARTMENT OVERVIEW
   POST /api/department-overview
========================================================= */

export const createDepartmentOverview = async (req, res) => {
  try {
    const {
      departmentId,
      bannerTitle,
      overviewImage,
      overviewImagePublicId,
      aboutDepartment,
      vision,
      mission,
      headOfDepartment,
      departmentHighlights,
      whyChooseDepartment,
      placementStatistics,
      departmentGallery,
      joinDepartmentTitle,
      joinDepartmentDescription,
      joinDepartmentUrl,
      status,
    } = req.body;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const existingOverview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (existingOverview) {
      return res.status(400).json({
        success: false,
        message: "Department overview already exists",
      });
    }

    const overview = await DepartmentOverview.create({
      departmentId,

      bannerTitle: bannerTitle?.trim() || "",

      overviewImage: overviewImage?.trim() || "",

      overviewImagePublicId: overviewImagePublicId?.trim() || "",

      aboutDepartment: aboutDepartment?.trim() || "",

      vision: vision?.trim() || "",

      mission: Array.isArray(mission) ? mission : [],

      headOfDepartment: headOfDepartment || null,

      departmentHighlights: Array.isArray(departmentHighlights)
        ? departmentHighlights
        : [],

      whyChooseDepartment: Array.isArray(whyChooseDepartment)
        ? whyChooseDepartment
        : [],

      placementStatistics: Array.isArray(placementStatistics)
        ? placementStatistics
        : [],

      departmentGallery: Array.isArray(departmentGallery)
        ? departmentGallery
        : [],

      joinDepartmentTitle: joinDepartmentTitle?.trim() || "",

      joinDepartmentDescription: joinDepartmentDescription?.trim() || "",

      joinDepartmentUrl: joinDepartmentUrl?.trim() || "",

      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Department overview created successfully",
      data: overview,
    });
  } catch (error) {
    console.error("Create Department Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create department overview",
    });
  }
};

/* =========================================================
   GET DEPARTMENT OVERVIEW BY DEPARTMENT ID
   GET /api/department-overview/:departmentId
========================================================= */

export const getDepartmentOverview = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const overview = await DepartmentOverview.findOne({
      departmentId,
    })
      .populate("departmentId", "name code slug")
      .populate(
        "headOfDepartment",
        "name designation qualification experience specialization description photo email phone linkedinUrl isHOD",
      );

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Get Department Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch department overview",
    });
  }
};

/* =========================================================
   GET DEPARTMENT OVERVIEW BY SLUG
   GET /api/department-overview/slug/:slug
========================================================= */

export const getDepartmentOverviewBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const department = await Department.findOne({ slug });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const overview = await DepartmentOverview.findOne({
      departmentId: department._id,
    })
      .populate("departmentId", "name code slug")
      .populate(
        "headOfDepartment",
        "name designation qualification experience specialization description photo email phone linkedinUrl isHOD",
      );

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Get Department Overview By Slug Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch department overview",
    });
  }
};

/* =========================================================
   UPDATE DEPARTMENT OVERVIEW
   PUT /api/department-overview/:departmentId
========================================================= */

export const updateDepartmentOverview = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const {
      bannerTitle,
      overviewImage,
      overviewImagePublicId,
      aboutDepartment,
      vision,
      mission,
      headOfDepartment,
      departmentHighlights,
      whyChooseDepartment,
      placementStatistics,
      departmentGallery,
      joinDepartmentTitle,
      joinDepartmentDescription,
      joinDepartmentUrl,
      status,
    } = req.body;

    const overview = await DepartmentOverview.findOneAndUpdate(
      {
        departmentId,
      },
      {
        bannerTitle: bannerTitle?.trim() || "",

        overviewImage: overviewImage?.trim() || "",

        overviewImagePublicId: overviewImagePublicId?.trim() || "",

        aboutDepartment: aboutDepartment?.trim() || "",

        vision: vision?.trim() || "",

        mission: Array.isArray(mission) ? mission : [],

        headOfDepartment: headOfDepartment || null,

        departmentHighlights: Array.isArray(departmentHighlights)
          ? departmentHighlights
          : [],

        whyChooseDepartment: Array.isArray(whyChooseDepartment)
          ? whyChooseDepartment
          : [],

        placementStatistics: Array.isArray(placementStatistics)
          ? placementStatistics
          : [],

        departmentGallery: Array.isArray(departmentGallery)
          ? departmentGallery
          : [],

        joinDepartmentTitle: joinDepartmentTitle?.trim() || "",

        joinDepartmentDescription: joinDepartmentDescription?.trim() || "",

        joinDepartmentUrl: joinDepartmentUrl?.trim() || "",

        status: status || "Active",
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("departmentId", "name code slug")
      .populate(
        "headOfDepartment",
        "name designation qualification experience specialization description photo email phone linkedinUrl isHOD",
      );

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department overview updated successfully",
      data: overview,
    });
  } catch (error) {
    console.error("Update Department Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update department overview",
    });
  }
};

/* =========================================================
   UPLOAD MAIN DEPARTMENT OVERVIEW IMAGE

   POST
   /api/department-overview/:departmentId/overview-image
========================================================= */

export const uploadOverviewImage = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Overview image is required",
      });
    }

    const overview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    /* DELETE OLD IMAGE */

    if (overview.overviewImagePublicId) {
      try {
        await cloudinary3.uploader.destroy(overview.overviewImagePublicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error("Old Overview Image Delete Error:", cloudinaryError);
      }
    }

    /* UPLOAD NEW IMAGE */

    const result = await cloudinary3.uploader.upload(req.file.path, {
      folder: "department-overview",
      resource_type: "image",
    });

    /* DELETE LOCAL FILE */

    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    /* SAVE */

    overview.overviewImage = result.secure_url;

    overview.overviewImagePublicId = result.public_id;

    await overview.save();

    return res.status(200).json({
      success: true,

      message: "Overview image uploaded successfully",

      data: {
        overviewImage: overview.overviewImage,

        overviewImagePublicId: overview.overviewImagePublicId,
      },
    });
  } catch (error) {
    console.error("Upload Overview Image Error:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Temporary File Delete Error:", fileError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload overview image",
    });
  }
};

/* =========================================================
   DELETE MAIN DEPARTMENT OVERVIEW IMAGE

   DELETE
   /api/department-overview/:departmentId/overview-image
========================================================= */

export const deleteOverviewImage = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const overview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    if (overview.overviewImagePublicId) {
      const result = await cloudinary3.uploader.destroy(
        overview.overviewImagePublicId,
        {
          resource_type: "image",
        },
      );

      if (result.result !== "ok" && result.result !== "not found") {
        return res.status(400).json({
          success: false,
          message: "Failed to delete overview image from Cloudinary",
          data: result,
        });
      }
    }

    overview.overviewImage = "";

    overview.overviewImagePublicId = "";

    await overview.save();

    return res.status(200).json({
      success: true,
      message: "Overview image deleted successfully",
      data: overview,
    });
  } catch (error) {
    console.error("Delete Overview Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete overview image",
    });
  }
};

/* =========================================================
   UPLOAD DEPARTMENT GALLERY IMAGE

   POST
   /api/department-overview/:departmentId/gallery
========================================================= */

export const uploadDepartmentGalleryImage = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const overview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    const result = await cloudinary3.uploader.upload(req.file.path, {
      folder: "department-gallery",
      resource_type: "image",
    });

    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const galleryItem = {
      imageUrl: result.secure_url,

      publicId: result.public_id,

      title: req.body.title?.trim() || "",

      priority: Number(req.body.priority) || 1,
    };

    overview.departmentGallery.push(galleryItem);

    await overview.save();

    return res.status(201).json({
      success: true,
      message: "Gallery image uploaded successfully",
      data: galleryItem,
    });
  } catch (error) {
    console.error("Upload Department Gallery Image Error:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Temporary File Delete Error:", fileError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload gallery image",
    });
  }
};

/* =========================================================
   DELETE DEPARTMENT GALLERY IMAGE

   DELETE
   /api/department-overview/:departmentId/gallery
========================================================= */

export const deleteDepartmentGalleryImage = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /*
      Support both:
      req.params.publicId
      AND
      req.body.publicId
    */

    const publicId = req.params.publicId || req.body?.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary public ID is required",
      });
    }

    const overview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    const decodedPublicId = decodeURIComponent(publicId);

    const image = overview.departmentGallery.find(
      (item) => item.publicId === decodedPublicId,
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    await cloudinary3.uploader.destroy(image.publicId, {
      resource_type: "image",
    });

    overview.departmentGallery = overview.departmentGallery.filter(
      (item) => item.publicId !== decodedPublicId,
    );

    await overview.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
      data: overview.departmentGallery,
    });
  } catch (error) {
    console.error("Delete Department Gallery Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete gallery image",
    });
  }
};

/* =========================================================
   DELETE COMPLETE DEPARTMENT OVERVIEW
========================================================= */

export const deleteDepartmentOverview = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const overview = await DepartmentOverview.findOne({
      departmentId,
    });

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Department overview not found",
      });
    }

    /* DELETE MAIN OVERVIEW IMAGE */

    if (overview.overviewImagePublicId) {
      try {
        await cloudinary3.uploader.destroy(overview.overviewImagePublicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Overview Image Cloudinary Delete Error:",
          cloudinaryError,
        );
      }
    }

    /* DELETE GALLERY IMAGES */

    if (Array.isArray(overview.departmentGallery)) {
      for (const image of overview.departmentGallery) {
        if (image.publicId) {
          try {
            await cloudinary3.uploader.destroy(image.publicId, {
              resource_type: "image",
            });
          } catch (cloudinaryError) {
            console.error(
              "Gallery Image Cloudinary Delete Error:",
              cloudinaryError,
            );
          }
        }
      }
    }

    await DepartmentOverview.findByIdAndDelete(overview._id);

    return res.status(200).json({
      success: true,
      message: "Department overview deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete department overview",
    });
  }
};
