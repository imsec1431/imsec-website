import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET GYM FOR ADMIN
   ========================================================= */

export const getGymAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(`${API_BASE_URL}/api/gym/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Gym Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load gym information.",
      }
    );
  }
};

/* =========================================================
   UPDATE GYM
   ========================================================= */

export const updateGym = async (formData) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/gym/admin`,
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
    console.error("Update Gym Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update gym information.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
   ========================================================= */

export const resetGym = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/gym/admin/reset-defaults`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset Gym Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset gym information.",
      }
    );
  }
};

const gymAdminService = {
  getGymAdmin,
  updateGym,
  resetGym,
};

export default gymAdminService;
