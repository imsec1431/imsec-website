import DepartmentEvent from "../models/DepartmentEvent.js";
import Department from "../models/Department.js";
import cloudinary3 from "../config/cloudinaryConfig3.js";
import fs from "fs";

/* =========================================================
   CREATE EVENT
   POST /api/department-events
========================================================= */

export const createDepartmentEvent = async (req, res) => {
  try {
    const {
      departmentId,
      title,
      category,
      date,
      venue,
      coordinator,
      description,
      featured,
      displayOrder,

      linkedin,
      instagram,
      facebook,
      twitter,
    } = req.body;

    /* =====================================================
       DEPARTMENT VALIDATION
    ===================================================== */

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       REQUIRED FIELDS
    ===================================================== */

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event title is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event category is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Event date is required",
      });
    }

    if (!venue?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Venue is required",
      });
    }

    if (!coordinator?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coordinator is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    /* =====================================================
       IMAGE
    ===================================================== */

    let image = "";
    let publicId = "";

    if (req.file) {
      const result = await cloudinary3.uploader.upload(req.file.path, {
        folder: "department-events",
      });

      image = result.secure_url;
      publicId = result.public_id;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    /* =====================================================
       CREATE EVENT
    ===================================================== */

    const event = await DepartmentEvent.create({
      departmentId,

      title: title.trim(),

      category: category.trim(),

      date,

      venue: venue.trim(),

      coordinator: coordinator.trim(),

      description: description.trim(),

      image,

      publicId,

      socialLinks: {
        linkedin: linkedin?.trim() || "",

        instagram: instagram?.trim() || "",

        facebook: facebook?.trim() || "",

        twitter: twitter?.trim() || "",
      },

      featured: featured === true || featured === "true",

      displayOrder: Number(displayOrder) || 1,

      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Department event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create Department Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department event",
    });
  }
};

/* =========================================================
   GET ALL EVENTS
   GET /api/department-events/department/:departmentId
========================================================= */

export const getDepartmentEvents = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const events = await DepartmentEvent.find({
      departmentId,
    }).sort({
      displayOrder: 1,
      date: -1,
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Department Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department events",
    });
  }
};

/* =========================================================
   GET SINGLE EVENT
   GET /api/department-events/:id
========================================================= */

export const getDepartmentEventById = async (req, res) => {
  try {
    const event = await DepartmentEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get Department Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
};

/* =========================================================
   UPDATE EVENT
   PUT /api/department-events/:id
========================================================= */

export const updateDepartmentEvent = async (req, res) => {
  try {
    const event = await DepartmentEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const {
      title,
      category,
      date,
      venue,
      coordinator,
      description,
      featured,
      displayOrder,

      linkedin,
      instagram,
      facebook,
      twitter,
    } = req.body;

    /* ===================================================
         UPDATE IMAGE
      =================================================== */

    let image = event.image;
    let publicId = event.publicId;

    if (req.file) {
      if (event.publicId) {
        await cloudinary3.uploader.destroy(event.publicId);
      }

      const result = await cloudinary3.uploader.upload(req.file.path, {
        folder: "department-events",
      });

      image = result.secure_url;
      publicId = result.public_id;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    /* ===================================================
         UPDATE
      =================================================== */

    event.title = title?.trim() || "";

    event.category = category?.trim() || "";

    event.date = date;

    event.venue = venue?.trim() || "";

    event.coordinator = coordinator?.trim() || "";

    event.description = description?.trim() || "";

    event.image = image;

    event.publicId = publicId;

    event.socialLinks = {
      linkedin: linkedin?.trim() || "",

      instagram: instagram?.trim() || "",

      facebook: facebook?.trim() || "",

      twitter: twitter?.trim() || "",
    };

    event.featured = featured === true || featured === "true";

    event.displayOrder = Number(displayOrder) || 1;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Department event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update Department Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department event",
    });
  }
};

/* =========================================================
   DELETE EVENT
   DELETE /api/department-events/:id
========================================================= */

export const deleteDepartmentEvent = async (req, res) => {
  try {
    const event = await DepartmentEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    /* ===================================================
         DELETE CLOUDINARY IMAGE
      =================================================== */

    if (event.publicId) {
      await cloudinary3.uploader.destroy(event.publicId);
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department event",
    });
  }
};
/* =========================================================
   GET PUBLIC EVENTS BY DEPARTMENT SLUG
   GET /api/department-events/slug/:slug
========================================================= */

export const getPublicDepartmentEvents = async (req, res) => {
  try {
    const { slug } = req.params;

    /* =====================================================
       FIND DEPARTMENT BY SLUG
    ===================================================== */

    const department = await Department.findOne({
      slug: slug.toLowerCase(),
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    /* =====================================================
       GET ACTIVE EVENTS
    ===================================================== */

    const events = await DepartmentEvent.find({
      departmentId: department._id,
      status: "Active",
    }).sort({
      featured: -1,
      displayOrder: 1,
      date: -1,
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Public Department Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department events",
    });
  }
};
