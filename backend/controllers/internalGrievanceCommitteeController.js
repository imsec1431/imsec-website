import InternalGrievanceCommittee from "../models/InternalGrievanceCommittee.js";

/* ==========================================
   CREATE COMMITTEE MEMBER
========================================== */

export const createCommitteeMember = async (req, res) => {
  try {
    const { name, designation, role, email, priority, status } = req.body;

    const member = await InternalGrievanceCommittee.create({
      name,
      designation,
      role,
      email,
      priority,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Committee member added successfully.",
      data: member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET ALL
   PRIORITY WISE
========================================== */

export const getAllCommitteeMembers = async (req, res) => {
  try {
    const members = await InternalGrievanceCommittee.find().sort({
      priority: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   GET SINGLE
========================================== */

export const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await InternalGrievanceCommittee.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Committee member not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   UPDATE
========================================== */

export const updateCommitteeMember = async (req, res) => {
  try {
    const member = await InternalGrievanceCommittee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Committee member not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Committee member updated successfully.",
      data: member,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE
========================================== */

export const deleteCommitteeMember = async (req, res) => {
  try {
    const member = await InternalGrievanceCommittee.findByIdAndDelete(
      req.params.id,
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Committee member not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Committee member deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
