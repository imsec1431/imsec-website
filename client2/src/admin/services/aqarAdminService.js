import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get AQAR for admin
export const getAQARAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/aqar/admin`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Get AQAR Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load AQAR information.",
      }
    );
  }
};

// Update AQAR
export const updateAQAR = async (aqarData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/aqar/admin`,
      aqarData,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Update AQAR Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update AQAR information.",
      }
    );
  }
};

// Reset defaults
export const resetAQAR = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/aqar/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Reset AQAR Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset AQAR.",
      }
    );
  }
};

const aqarAdminService = {
  getAQARAdmin,
  updateAQAR,
  resetAQAR,
};

export default aqarAdminService;
