import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get data for admin
export const getIndustryAcademicsAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/industry-academics-collaboration/admin`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Get Industry Academics Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load Industry Academics Collaboration.",
      }
    );
  }
};

// Update complete page
export const updateIndustryAcademics = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/industry-academics-collaboration/admin`,
      data,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Update Industry Academics Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update Industry Academics Collaboration.",
      }
    );
  }
};

// Upload photograph
export const uploadIndustryAcademicsPhoto = async (file) => {
  try {
    const formData = new FormData();

    formData.append("photo", file);

    const response = await axios.post(
      `${API_BASE_URL}/api/industry-academics-collaboration/admin/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Upload Industry Academics Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to upload photograph.",
      }
    );
  }
};

// Delete photograph
export const deleteIndustryAcademicsPhoto = async (publicId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/industry-academics-collaboration/admin/delete-photo`,
      {
        ...getAuthConfig(),
        data: {
          publicId,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Delete Industry Academics Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete photograph.",
      }
    );
  }
};

// Reset defaults
export const resetIndustryAcademics = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/industry-academics-collaboration/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Reset Industry Academics Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset Industry Academics Collaboration.",
      }
    );
  }
};

const industryAcademicsAdminService = {
  getIndustryAcademicsAdmin,
  updateIndustryAcademics,
  uploadIndustryAcademicsPhoto,
  deleteIndustryAcademicsPhoto,
  resetIndustryAcademics,
};

export default industryAcademicsAdminService;
