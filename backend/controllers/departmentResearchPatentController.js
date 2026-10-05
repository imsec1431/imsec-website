import DepartmentResearchPatent from "../models/DepartmentResearchPatent.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL PATENTS BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchPatents = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const patents = await DepartmentResearchPatent.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: patents,
    });
  } catch (error) {
    console.error("Get department research patents error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department research patents",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE PATENT
   ========================================================= */

export const getDepartmentResearchPatentById = async (req, res) => {
  try {
    const { id } = req.params;

    const patent = await DepartmentResearchPatent.findById(id).populate(
      "department",
      "name slug",
    );

    if (!patent) {
      return res.status(404).json({
        success: false,
        message: "Research patent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patent,
    });
  } catch (error) {
    console.error("Get department research patent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research patent",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE PATENT
   ========================================================= */

export const createDepartmentResearchPatent = async (req, res) => {
  try {
    const {
      department,
      title,
      inventors,
      applicant,
      patentNumber,
      applicationNumber,
      filingDate,
      publicationDate,
      grantDate,
      country,
      status,
      patentOffice,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patent title is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const patent = await DepartmentResearchPatent.create({
      department,

      title: title.trim(),

      inventors: typeof inventors === "string" ? inventors.trim() : "",

      applicant: typeof applicant === "string" ? applicant.trim() : "",

      patentNumber: typeof patentNumber === "string" ? patentNumber.trim() : "",

      applicationNumber:
        typeof applicationNumber === "string" ? applicationNumber.trim() : "",

      filingDate: typeof filingDate === "string" ? filingDate.trim() : "",

      publicationDate:
        typeof publicationDate === "string" ? publicationDate.trim() : "",

      grantDate: typeof grantDate === "string" ? grantDate.trim() : "",

      country: typeof country === "string" ? country.trim() : "",

      status: typeof status === "string" ? status.trim() : "",

      patentOffice: typeof patentOffice === "string" ? patentOffice.trim() : "",

      description: typeof description === "string" ? description.trim() : "",

      url: typeof url === "string" ? url.trim() : "",

      documentUrl: typeof documentUrl === "string" ? documentUrl.trim() : "",

      image: typeof image === "string" ? image.trim() : "",

      publicId: typeof publicId === "string" ? publicId.trim() : "",

      order: Number(order) || 0,

      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Research patent created successfully",
      data: patent,
    });
  } catch (error) {
    console.error("Create department research patent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create research patent",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PATENT
   ========================================================= */

export const updateDepartmentResearchPatent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPatent = await DepartmentResearchPatent.findById(id);

    if (!existingPatent) {
      return res.status(404).json({
        success: false,
        message: "Research patent not found",
      });
    }

    const {
      department,
      title,
      inventors,
      applicant,
      patentNumber,
      applicationNumber,
      filingDate,
      publicationDate,
      grantDate,
      country,
      status,
      patentOffice,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    /* -----------------------------------------------
       Department
       ----------------------------------------------- */

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      existingPatent.department = department;
    }

    /* -----------------------------------------------
       Title
       ----------------------------------------------- */

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Patent title is required",
        });
      }

      existingPatent.title = title.trim();
    }

    /* -----------------------------------------------
       Text fields
       ----------------------------------------------- */

    if (inventors !== undefined) {
      existingPatent.inventors =
        typeof inventors === "string" ? inventors.trim() : "";
    }

    if (applicant !== undefined) {
      existingPatent.applicant =
        typeof applicant === "string" ? applicant.trim() : "";
    }

    if (patentNumber !== undefined) {
      existingPatent.patentNumber =
        typeof patentNumber === "string" ? patentNumber.trim() : "";
    }

    if (applicationNumber !== undefined) {
      existingPatent.applicationNumber =
        typeof applicationNumber === "string" ? applicationNumber.trim() : "";
    }

    if (filingDate !== undefined) {
      existingPatent.filingDate =
        typeof filingDate === "string" ? filingDate.trim() : "";
    }

    if (publicationDate !== undefined) {
      existingPatent.publicationDate =
        typeof publicationDate === "string" ? publicationDate.trim() : "";
    }

    if (grantDate !== undefined) {
      existingPatent.grantDate =
        typeof grantDate === "string" ? grantDate.trim() : "";
    }

    if (country !== undefined) {
      existingPatent.country =
        typeof country === "string" ? country.trim() : "";
    }

    if (status !== undefined) {
      existingPatent.status = typeof status === "string" ? status.trim() : "";
    }

    if (patentOffice !== undefined) {
      existingPatent.patentOffice =
        typeof patentOffice === "string" ? patentOffice.trim() : "";
    }

    if (description !== undefined) {
      existingPatent.description =
        typeof description === "string" ? description.trim() : "";
    }

    if (url !== undefined) {
      existingPatent.url = typeof url === "string" ? url.trim() : "";
    }

    if (documentUrl !== undefined) {
      existingPatent.documentUrl =
        typeof documentUrl === "string" ? documentUrl.trim() : "";
    }

    if (image !== undefined) {
      existingPatent.image = typeof image === "string" ? image.trim() : "";
    }

    if (publicId !== undefined) {
      existingPatent.publicId =
        typeof publicId === "string" ? publicId.trim() : "";
    }

    /* -----------------------------------------------
       Number / Boolean fields
       ----------------------------------------------- */

    if (order !== undefined) {
      existingPatent.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      existingPatent.isActive = Boolean(isActive);
    }

    const updatedPatent = await existingPatent.save();

    res.status(200).json({
      success: true,
      message: "Research patent updated successfully",
      data: updatedPatent,
    });
  } catch (error) {
    console.error("Update department research patent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research patent",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE PATENT
   ========================================================= */

export const deleteDepartmentResearchPatent = async (req, res) => {
  try {
    const { id } = req.params;

    const patent = await DepartmentResearchPatent.findById(id);

    if (!patent) {
      return res.status(404).json({
        success: false,
        message: "Research patent not found",
      });
    }

    await DepartmentResearchPatent.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Research patent deleted successfully",
    });
  } catch (error) {
    console.error("Delete department research patent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research patent",
      error: error.message,
    });
  }
};
