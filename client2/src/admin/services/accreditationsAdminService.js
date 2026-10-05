import axios from "axios";

import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH HEADERS
   ========================================================= */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================================================
   GET ACCREDITATIONS - ADMIN
   ========================================================= */

export const getAccreditationsAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/accreditations/admin`,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    console.error("Get Accreditations Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load accreditations.",
      }
    );
  }
};

/* =========================================================
   UPDATE ACCREDITATIONS
   ========================================================= */

export const updateAccreditations = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/accreditations/admin`,
      data,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Accreditations Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update accreditations.",
      }
    );
  }
};

/* =========================================================
   UPLOAD ACCREDITATION PHOTO
   ========================================================= */

export const uploadAccreditationPhoto = async (file) => {
  try {
    const formData = new FormData();

    formData.append("photo", file);

    const response = await axios.post(
      `${API_BASE_URL}/api/accreditations/admin/upload-photo`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Upload Accreditation Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to upload accreditation photo.",
      }
    );
  }
};

/* =========================================================
   DELETE ACCREDITATION PHOTO
   ========================================================= */

export const deleteAccreditationPhoto = async (publicId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/accreditations/admin/delete-photo`,
      {
        headers: getAuthHeaders(),

        data: {
          publicId,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Delete Accreditation Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete accreditation photo.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
   ========================================================= */

export const resetAccreditations = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/accreditations/admin/reset-defaults`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset Accreditations Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset accreditations.",
      }
    );
  }
};

/* =========================================================
   DEFAULT SERVICE OBJECT
   ========================================================= */

const accreditationsAdminService = {
  getAccreditationsAdmin,
  updateAccreditations,
  uploadAccreditationPhoto,
  deleteAccreditationPhoto,
  resetAccreditations,
};

export default accreditationsAdminService;
