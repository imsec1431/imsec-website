import axios from "axios";

import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

/* =========================================================
   GET NIRF - ADMIN
========================================================= */

export const getNIRFAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/nirf/admin`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Get NIRF Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NIRF data.",
      }
    );
  }
};

/* =========================================================
   UPDATE NIRF
========================================================= */

export const updateNIRF = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/nirf/admin`,
      data,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Update NIRF Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update NIRF data.",
      }
    );
  }
};

/* =========================================================
   DELETE NIRF RECORD
========================================================= */

export const deleteNIRFRecord = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/nirf/admin/${id}`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Delete NIRF Record Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete NIRF record.",
      }
    );
  }
};

/* =========================================================
   RESET NIRF
========================================================= */

export const resetNIRF = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/nirf/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Reset NIRF Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset NIRF data.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const nirfAdminService = {
  getNIRFAdmin,
  updateNIRF,
  deleteNIRFRecord,
  resetNIRF,
};

export default nirfAdminService;
