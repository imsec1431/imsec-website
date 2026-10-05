import axios from "axios";

import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET MEDICAL SUPPORT - ADMIN
========================================================= */

export const getMedicalSupportAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_BASE_URL}/api/medical-support/admin`,
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

    console.error("Get Medical Support Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load medical support information.",
      }
    );
  }
};

/* =========================================================
   UPDATE MEDICAL SUPPORT
========================================================= */

export const updateMedicalSupport = async (data) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/medical-support/admin`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Update Medical Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update medical support information.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetMedicalSupport = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/medical-support/admin/reset-defaults`,
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

    console.error("Reset Medical Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset medical support information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const medicalSupportAdminService = {
  getMedicalSupportAdmin,
  updateMedicalSupport,
  resetMedicalSupport,
};

export default medicalSupportAdminService;
