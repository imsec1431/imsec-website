import AcademicMatrix from "../models/AcademicMatrix.js";

/* =========================================================
   PUBLIC - GET PUBLISHED ACADEMIC PROGRAMS
========================================================= */

export const getPublicAcademicMatrix = async (req, res) => {
  try {
    const programs = await AcademicMatrix.find({
      isPublished: true,
    })
      .sort({
        type: 1,
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get public Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Academic Matrix",
    });
  }
};

/* =========================================================
   ADMIN - GET ALL PROGRAMS
========================================================= */

export const getAdminAcademicMatrix = async (req, res) => {
  try {
    const programs = await AcademicMatrix.find()
      .sort({
        type: 1,
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get admin Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Academic Matrix",
    });
  }
};

/* =========================================================
   CREATE PROGRAM
========================================================= */

export const createAcademicMatrix = async (req, res) => {
  try {
    const {
      type,
      code,
      name,
      description,
      duration,
      basis,
      icon,
      buttonText,
      buttonLink,
      isPublished,
      displayOrder,
    } = req.body;

    if (!type || !code || !name || !duration || !basis) {
      return res.status(400).json({
        success: false,
        message: "Type, code, name, duration and admission basis are required",
      });
    }

    if (!["ug", "pg"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Program type must be either ug or pg",
      });
    }

    const program = await AcademicMatrix.create({
      type: type.trim().toLowerCase(),

      code: code.trim(),

      name: name.trim(),

      description: description ? description.trim() : "",

      duration: duration.trim(),

      basis: basis.trim(),

      icon: icon || "Microchip",

      buttonText: buttonText?.trim() || "More Details",

      buttonLink: buttonLink?.trim() || "#",

      isPublished: isPublished === true || isPublished === "true",

      displayOrder: Number(displayOrder) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Academic program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("Create Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create academic program",
    });
  }
};

/* =========================================================
   UPDATE PROGRAM
========================================================= */

export const updateAcademicMatrix = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      code,
      name,
      description,
      duration,
      basis,
      icon,
      buttonText,
      buttonLink,
      isPublished,
      displayOrder,
    } = req.body;

    if (!type || !code || !name || !duration || !basis) {
      return res.status(400).json({
        success: false,
        message: "Type, code, name, duration and admission basis are required",
      });
    }

    if (!["ug", "pg"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Program type must be either ug or pg",
      });
    }

    const program = await AcademicMatrix.findByIdAndUpdate(
      id,
      {
        type: type.trim().toLowerCase(),

        code: code.trim(),

        name: name.trim(),

        description: description ? description.trim() : "",

        duration: duration.trim(),

        basis: basis.trim(),

        icon: icon || "Microchip",

        buttonText: buttonText?.trim() || "More Details",

        buttonLink: buttonLink?.trim() || "#",

        isPublished: isPublished === true || isPublished === "true",

        displayOrder: Number(displayOrder) || 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Academic program not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic program updated successfully",
      data: program,
    });
  } catch (error) {
    console.error("Update Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update academic program",
    });
  }
};

/* =========================================================
   PUBLISH PROGRAM
========================================================= */

export const publishAcademicMatrix = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await AcademicMatrix.findByIdAndUpdate(
      id,
      {
        isPublished: true,
      },
      {
        new: true,
      },
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Academic program not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic program published successfully",
      data: program,
    });
  } catch (error) {
    console.error("Publish Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish academic program",
    });
  }
};

/* =========================================================
   UNPUBLISH PROGRAM
========================================================= */

export const unpublishAcademicMatrix = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await AcademicMatrix.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        new: true,
      },
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Academic program not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic program unpublished successfully",
      data: program,
    });
  } catch (error) {
    console.error("Unpublish Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish academic program",
    });
  }
};

/* =========================================================
   DELETE PROGRAM
========================================================= */

export const deleteAcademicMatrix = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await AcademicMatrix.findByIdAndDelete(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Academic program not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic program deleted successfully",
    });
  } catch (error) {
    console.error("Delete Academic Matrix error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete academic program",
    });
  }
};
