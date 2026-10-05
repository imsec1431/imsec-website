import axios from "axios";

import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET ADMIN DATA
========================================================= */

export const getTrainingInternshipAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_BASE_URL}/api/training-internship/admin`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Get Training Internship Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load Training & Internship information.",
      }
    );
  }
};

/* =========================================================
   UPDATE PAGE
========================================================= */

export const updateTrainingInternship = async (formData) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/training-internship/admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Update Training Internship Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update Training & Internship information.",
      }
    );
  }
};

/* =========================================================
   DELETE TEAM MEMBER
========================================================= */

export const deleteTrainingTeamMember = async (id) => {
  try {
    const token = getToken();

    const response = await axios.delete(
      `${API_BASE_URL}/api/training-internship/admin/team/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Delete Training Team Member Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete team member.",
      }
    );
  }
};

/* =========================================================
   DELETE DOCUMENT
========================================================= */

export const deleteTrainingDocument = async (id) => {
  try {
    const token = getToken();

    const response = await axios.delete(
      `${API_BASE_URL}/api/training-internship/admin/document/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Delete Training Document Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete document.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetTrainingInternship = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/training-internship/admin/reset-defaults`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Reset Training Internship Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset Training & Internship information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const trainingInternshipAdminService = {
  getTrainingInternshipAdmin,
  updateTrainingInternship,
  deleteTrainingTeamMember,
  deleteTrainingDocument,
  resetTrainingInternship,
};

export default trainingInternshipAdminService;
