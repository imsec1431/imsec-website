import DepartmentInfrastructure from "../models/DepartmentInfrastructure.js";
import Department from "../models/Department.js";
import cloudinary3 from "../config/cloudinaryConfig3.js";
import fs from "fs";

/* =========================================================
   HELPER — DELETE LOCAL FILE
========================================================= */

const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/* =========================================================
   HELPER — UPLOAD TO CLOUDINARY
========================================================= */

const uploadToCloudinary = async (file, folder) => {
  if (!file) {
    return null;
  }

  const result = await cloudinary3.uploader.upload(file.path, {
    folder,
  });

  deleteLocalFile(file.path);

  return {
    image: result.secure_url,
    publicId: result.public_id,
  };
};

/* =========================================================
   GET INFRASTRUCTURE
   GET /api/department-infrastructure/:departmentId
========================================================= */

export const getDepartmentInfrastructure = async (req, res) => {
  try {
    const { departmentId } = req.params;

    /* ===============================================
       CHECK DEPARTMENT
    =============================================== */

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===============================================
       FIND INFRASTRUCTURE
    =============================================== */

    const infrastructure = await DepartmentInfrastructure.findOne({
      departmentId,
    });

    /* ===============================================
       NOT CREATED YET
    =============================================== */

    if (!infrastructure) {
      return res.status(200).json({
        success: true,
        exists: false,
        data: null,
        message: "Department infrastructure not created yet",
      });
    }

    /* ===============================================
       SUCCESS
    =============================================== */

    return res.status(200).json({
      success: true,
      exists: true,
      data: infrastructure,
    });
  } catch (error) {
    console.error("Get Department Infrastructure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department infrastructure",
    });
  }
};

/* =========================================================
   CREATE INFRASTRUCTURE
   POST /api/department-infrastructure
========================================================= */

export const createDepartmentInfrastructure = async (req, res) => {
  try {
    const {
      departmentId,
      title,
      description1,
      description2,
      highlights,
      facilities,
      status,
    } = req.body;

    /* ===============================================
       DEPARTMENT REQUIRED
    =============================================== */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    /* ===============================================
       CHECK DEPARTMENT
    =============================================== */

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* ===============================================
       CHECK EXISTING
    =============================================== */

    const existing = await DepartmentInfrastructure.findOne({
      departmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Infrastructure already exists for this department",
      });
    }

    /* ===============================================
       MAIN IMAGE
    =============================================== */

    let mainImage = "";
    let mainImagePublicId = "";

    if (req.files?.mainImage?.[0]) {
      const uploaded = await uploadToCloudinary(
        req.files.mainImage[0],
        "department-infrastructure",
      );

      mainImage = uploaded.image;
      mainImagePublicId = uploaded.publicId;
    }

    /* ===============================================
       PARSE HIGHLIGHTS
    =============================================== */

    let parsedHighlights = [];

    if (highlights) {
      try {
        parsedHighlights =
          typeof highlights === "string" ? JSON.parse(highlights) : highlights;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid highlights data",
        });
      }
    }

    if (!Array.isArray(parsedHighlights)) {
      parsedHighlights = [];
    }

    /* ===============================================
       HIGHLIGHT IMAGES
    =============================================== */

    const highlightFiles = req.files?.highlightImages || [];

    for (let i = 0; i < parsedHighlights.length; i++) {
      const item = parsedHighlights[i];

      /* -----------------------------------------------
         IMPORTANT:
         New highlights can contain _id: "".
         Remove it so Mongoose creates a new ObjectId.
      ------------------------------------------------ */

      if (item._id === "" || item._id === null || item._id === undefined) {
        delete item._id;
      }

      /* -----------------------------------------------
         Never allow File/Object to enter image field.
      ------------------------------------------------ */

      if (typeof item.image !== "string") {
        item.image = "";
      }

      if (typeof item.publicId !== "string") {
        item.publicId = "";
      }

      /* -----------------------------------------------
         Upload highlight image
      ------------------------------------------------ */

      const file = highlightFiles[i];

      if (file) {
        const uploaded = await uploadToCloudinary(
          file,
          "department-infrastructure/highlights",
        );

        item.image = uploaded.image;

        item.publicId = uploaded.publicId;
      }

      /* -----------------------------------------------
         Clean data
      ------------------------------------------------ */

      item.title = typeof item.title === "string" ? item.title.trim() : "";

      item.description =
        typeof item.description === "string" ? item.description.trim() : "";

      item.displayOrder = Number(item.displayOrder) || i + 1;
    }

    /* ===============================================
       PARSE FACILITIES
    =============================================== */

    let parsedFacilities = [];

    if (facilities) {
      try {
        parsedFacilities =
          typeof facilities === "string" ? JSON.parse(facilities) : facilities;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid facilities data",
        });
      }
    }

    if (!Array.isArray(parsedFacilities)) {
      parsedFacilities = [];
    }

    /* ===============================================
       CLEAN FACILITIES
    =============================================== */

    parsedFacilities = parsedFacilities.map((item, index) => {
      const cleaned = {
        title: typeof item.title === "string" ? item.title.trim() : "",

        icon: typeof item.icon === "string" ? item.icon : "desktop",

        displayOrder: Number(item.displayOrder) || index + 1,
      };

      /*
       * Do not send _id: "" to Mongoose
       */
      if (item._id && typeof item._id === "string") {
        cleaned._id = item._id;
      }

      return cleaned;
    });

    /* ===============================================
       CREATE
    =============================================== */

    const infrastructure = await DepartmentInfrastructure.create({
      departmentId,

      title: title?.trim() || "Department Infrastructure",

      mainImage,

      mainImagePublicId,

      description1: description1?.trim() || "",

      description2: description2?.trim() || "",

      highlights: parsedHighlights,

      facilities: parsedFacilities,

      gallery: [],

      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Department infrastructure created successfully",
      data: infrastructure,
    });
  } catch (error) {
    console.error("Create Department Infrastructure Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create department infrastructure",
    });
  }
};

/* =========================================================
   UPDATE INFRASTRUCTURE
   PUT /api/department-infrastructure/:departmentId
========================================================= */

export const updateDepartmentInfrastructure = async (req, res) => {
  try {
    const infrastructure = await DepartmentInfrastructure.findOne({
      departmentId: req.params.departmentId,
    });

    if (!infrastructure) {
      return res.status(404).json({
        success: false,
        message: "Department infrastructure not found",
      });
    }

    const {
      title,
      description1,
      description2,
      highlights,
      facilities,
      status,
    } = req.body;

    /* ===============================================
       MAIN IMAGE
    =============================================== */

    if (req.files?.mainImage?.[0]) {
      /* Delete old Cloudinary image */

      if (infrastructure.mainImagePublicId) {
        await cloudinary3.uploader.destroy(infrastructure.mainImagePublicId);
      }

      /* Upload new image */

      const uploaded = await uploadToCloudinary(
        req.files.mainImage[0],
        "department-infrastructure",
      );

      infrastructure.mainImage = uploaded.image;

      infrastructure.mainImagePublicId = uploaded.publicId;
    }

    /* ===============================================
       BASIC INFORMATION
    =============================================== */

    if (title !== undefined) {
      infrastructure.title = title.trim();
    }

    if (description1 !== undefined) {
      infrastructure.description1 = description1.trim();
    }

    if (description2 !== undefined) {
      infrastructure.description2 = description2.trim();
    }

    if (status !== undefined) {
      infrastructure.status = status;
    }

    /* ===============================================
       HIGHLIGHTS
    =============================================== */

    if (highlights !== undefined) {
      let parsedHighlights;

      try {
        parsedHighlights =
          typeof highlights === "string" ? JSON.parse(highlights) : highlights;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid highlights data",
        });
      }

      if (!Array.isArray(parsedHighlights)) {
        parsedHighlights = [];
      }

      const highlightFiles = req.files?.highlightImages || [];

      for (let i = 0; i < parsedHighlights.length; i++) {
        const item = parsedHighlights[i];

        /* -------------------------------------------
           Remove empty _id
        ------------------------------------------- */

        if (item._id === "" || item._id === null || item._id === undefined) {
          delete item._id;
        }

        /* -------------------------------------------
           Make sure image is a string
        ------------------------------------------- */

        if (typeof item.image !== "string") {
          item.image = "";
        }

        if (typeof item.publicId !== "string") {
          item.publicId = "";
        }

        /* -------------------------------------------
           New highlight image
        ------------------------------------------- */

        const file = highlightFiles[i];

        if (file) {
          /*
           * Delete old Cloudinary image
           */

          if (item.publicId) {
            await cloudinary3.uploader.destroy(item.publicId);
          }

          /*
           * Upload new image
           */

          const uploaded = await uploadToCloudinary(
            file,
            "department-infrastructure/highlights",
          );

          item.image = uploaded.image;

          item.publicId = uploaded.publicId;
        }

        /* -------------------------------------------
           Clean values
        ------------------------------------------- */

        item.title = typeof item.title === "string" ? item.title.trim() : "";

        item.description =
          typeof item.description === "string" ? item.description.trim() : "";

        item.displayOrder = Number(item.displayOrder) || i + 1;
      }

      /* -------------------------------------------
         Remove empty IDs from highlights
      ------------------------------------------- */

      parsedHighlights = parsedHighlights.map((item) => {
        const cleaned = {
          title: item.title || "",

          description: item.description || "",

          image: typeof item.image === "string" ? item.image : "",

          publicId: typeof item.publicId === "string" ? item.publicId : "",

          displayOrder: Number(item.displayOrder) || 1,
        };

        /*
         * Only add _id when it is a
         * valid existing ID.
         */

        if (item._id && typeof item._id === "string") {
          cleaned._id = item._id;
        }

        return cleaned;
      });

      infrastructure.highlights = parsedHighlights;
    }

    /* ===============================================
       FACILITIES
    =============================================== */

    if (facilities !== undefined) {
      let parsedFacilities;

      try {
        parsedFacilities =
          typeof facilities === "string" ? JSON.parse(facilities) : facilities;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid facilities data",
        });
      }

      if (!Array.isArray(parsedFacilities)) {
        parsedFacilities = [];
      }

      parsedFacilities = parsedFacilities.map((item, index) => {
        const cleaned = {
          title: typeof item.title === "string" ? item.title.trim() : "",

          icon: typeof item.icon === "string" ? item.icon : "desktop",

          displayOrder: Number(item.displayOrder) || index + 1,
        };

        /*
         * Only preserve a real
         * existing ObjectId.
         */

        if (item._id && typeof item._id === "string") {
          cleaned._id = item._id;
        }

        return cleaned;
      });

      infrastructure.facilities = parsedFacilities;
    }

    /* ===============================================
       SAVE
    =============================================== */

    await infrastructure.save();

    return res.status(200).json({
      success: true,
      message: "Department infrastructure updated successfully",
      data: infrastructure,
    });
  } catch (error) {
    console.error("Update Department Infrastructure Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update department infrastructure",
    });
  }
};

/* =========================================================
   ADD GALLERY IMAGE
   POST /api/department-infrastructure/:departmentId/gallery
========================================================= */

export const addGalleryImage = async (req, res) => {
  try {
    const infrastructure = await DepartmentInfrastructure.findOne({
      departmentId: req.params.departmentId,
    });

    if (!infrastructure) {
      return res.status(404).json({
        success: false,
        message: "Department infrastructure not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gallery image is required",
      });
    }

    const uploaded = await uploadToCloudinary(
      req.file,
      "department-infrastructure/gallery",
    );

    infrastructure.gallery.push({
      image: uploaded.image,

      publicId: uploaded.publicId,

      displayOrder: infrastructure.gallery.length + 1,
    });

    await infrastructure.save();

    return res.status(201).json({
      success: true,
      message: "Gallery image added successfully",
      data: infrastructure,
    });
  } catch (error) {
    console.error("Add Gallery Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add gallery image",
    });
  }
};

/* =========================================================
   DELETE GALLERY IMAGE
   DELETE /api/department-infrastructure/:departmentId/gallery/:galleryId
========================================================= */

export const deleteGalleryImage = async (req, res) => {
  try {
    const infrastructure = await DepartmentInfrastructure.findOne({
      departmentId: req.params.departmentId,
    });

    if (!infrastructure) {
      return res.status(404).json({
        success: false,
        message: "Department infrastructure not found",
      });
    }

    const galleryItem = infrastructure.gallery.id(req.params.galleryId);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    /* ===============================================
       DELETE FROM CLOUDINARY
    =============================================== */

    if (galleryItem.publicId) {
      await cloudinary3.uploader.destroy(galleryItem.publicId);
    }

    galleryItem.deleteOne();

    /* ===============================================
       RESET DISPLAY ORDER
    =============================================== */

    infrastructure.gallery.forEach((item, index) => {
      item.displayOrder = index + 1;
    });

    await infrastructure.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
      data: infrastructure,
    });
  } catch (error) {
    console.error("Delete Gallery Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery image",
    });
  }
};

/* =========================================================
   DELETE INFRASTRUCTURE
   DELETE /api/department-infrastructure/:departmentId
========================================================= */

export const deleteDepartmentInfrastructure = async (req, res) => {
  try {
    const infrastructure = await DepartmentInfrastructure.findOne({
      departmentId: req.params.departmentId,
    });

    if (!infrastructure) {
      return res.status(404).json({
        success: false,
        message: "Department infrastructure not found",
      });
    }

    /* =============================================
         DELETE MAIN IMAGE
      ============================================= */

    if (infrastructure.mainImagePublicId) {
      await cloudinary3.uploader.destroy(infrastructure.mainImagePublicId);
    }

    /* =============================================
         DELETE HIGHLIGHT IMAGES
      ============================================= */

    for (const highlight of infrastructure.highlights) {
      if (highlight.publicId) {
        await cloudinary3.uploader.destroy(highlight.publicId);
      }
    }

    /* =============================================
         DELETE GALLERY IMAGES
      ============================================= */

    for (const gallery of infrastructure.gallery) {
      if (gallery.publicId) {
        await cloudinary3.uploader.destroy(gallery.publicId);
      }
    }

    /* =============================================
         DELETE DOCUMENT
      ============================================= */

    await infrastructure.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department infrastructure deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Infrastructure Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department infrastructure",
    });
  }
};
