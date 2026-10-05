import EmployeeGrievance from "../models/EmployeeGrievance.js";
import cloudinary from "../config/cloudinaryConfig.js";

/* ===========================================
   Create Employee Grievance
=========================================== */

export const createEmployeeGrievance = async (req, res) => {
  try {
    const {
      employeeName,
      employeeCode,
      email,
      mobile,
      department,
      category,
      title,
      description,
    } = req.body;

    // Generate Complaint ID
    const complaintId = "EG" + Date.now().toString().slice(-6);

    let attachment = "";
    let publicId = "";

    // Upload attachment to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/employee-grievance",
        resource_type: "auto",
      });

      attachment = result.secure_url;
      publicId = result.public_id;
    }

    const grievance = new EmployeeGrievance({
      complaintId,
      employeeName,
      employeeCode,
      email,
      mobile,
      department,
      category,
      title,
      description,
      attachment,
      publicId,
    });

    await grievance.save();

    res.status(201).json({
      success: true,
      message: "Employee Grievance Submitted Successfully",
      data: grievance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Get All Employee Grievances
   Latest First
=========================================== */

export const getAllEmployeeGrievances = async (req, res) => {
  try {
    const grievances = await EmployeeGrievance.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Get Single Employee Grievance
=========================================== */

export const getEmployeeGrievanceById = async (req, res) => {
  try {
    const grievance = await EmployeeGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Employee Grievance not found",
      });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Update Employee Grievance
   Status / Remarks
=========================================== */

export const updateEmployeeGrievance = async (req, res) => {
  try {
    const grievance = await EmployeeGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Employee Grievance not found",
      });
    }

    if (req.body.status !== undefined) {
      grievance.status = req.body.status;
    }

    if (req.body.remarks !== undefined) {
      grievance.remarks = req.body.remarks;
    }

    await grievance.save();

    res.status(200).json({
      success: true,
      message: "Employee Grievance Updated Successfully",
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Delete Employee Grievance
=========================================== */

export const deleteEmployeeGrievance = async (req, res) => {
  try {
    const grievance = await EmployeeGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Employee Grievance not found",
      });
    }

    // Delete Cloudinary attachment
    if (grievance.publicId) {
      await cloudinary.uploader.destroy(grievance.publicId);
    }

    await EmployeeGrievance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee Grievance Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
