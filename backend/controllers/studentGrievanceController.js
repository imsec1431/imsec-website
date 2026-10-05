import StudentGrievance from "../models/StudentGrievance.js";
import cloudinary from "../config/cloudinaryConfig.js";

/* ======================================================
   Create Student Grievance
====================================================== */

export const createStudentGrievance = async (req, res) => {
  try {
    const {
      studentName,
      enrollmentNo,
      email,
      mobile,
      department,
      category,
      title,
      description,
    } = req.body;

    // Generate Complaint ID
    const complaintId = "SG" + Date.now().toString().slice(-6);

    let attachment = "";
    let publicId = "";

    // Upload attachment if available
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/student-grievance",
        resource_type: "auto",
      });

      attachment = result.secure_url;
      publicId = result.public_id;
    }

    const grievance = await StudentGrievance.create({
      complaintId,
      studentName,
      enrollmentNo,
      email,
      mobile,
      department,
      category,
      title,
      description,
      attachment,
      publicId,
      status: "Pending",
      remarks: "",
    });

    res.status(201).json({
      success: true,
      message: "Complaint Submitted Successfully.",
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

/* ======================================================
   Get All Student Grievances
====================================================== */

export const getAllStudentGrievances = async (req, res) => {
  try {
    const grievances = await StudentGrievance.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: grievances.length,
      data: grievances,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Get Single Student Grievance
====================================================== */

export const getStudentGrievanceById = async (req, res) => {
  try {
    const grievance = await StudentGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
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

/* ======================================================
   Update Student Grievance
====================================================== */

export const updateStudentGrievance = async (req, res) => {
  try {
    const grievance = await StudentGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    grievance.status = req.body.status || grievance.status;
    grievance.remarks = req.body.remarks || grievance.remarks;

    await grievance.save();

    res.status(200).json({
      success: true,
      message: "Complaint Updated Successfully.",
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

/* ======================================================
   Delete Student Grievance
====================================================== */

export const deleteStudentGrievance = async (req, res) => {
  try {
    const grievance = await StudentGrievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Delete attachment from Cloudinary
    if (grievance.publicId) {
      await cloudinary.uploader.destroy(grievance.publicId, {
        resource_type: "auto",
      });
    }

    await StudentGrievance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Complaint Deleted Successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
