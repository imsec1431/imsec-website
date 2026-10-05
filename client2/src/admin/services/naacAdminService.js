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
   GET NAAC - ADMIN
========================================================= */

export const getNAACAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/naac/admin`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Get NAAC Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NAAC data.",
      }
    );
  }
};

/* =========================================================
   UPDATE NAAC
========================================================= */

export const updateNAAC = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/naac/admin`,
      data,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Update NAAC Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update NAAC data.",
      }
    );
  }
};

/* =========================================================
   DELETE NAAC RECORD
========================================================= */

export const deleteNAACRecord = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/naac/admin/${id}`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Delete NAAC Record Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete NAAC record.",
      }
    );
  }
};

/* =========================================================
   RESET NAAC
========================================================= */

export const resetNAAC = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/naac/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Reset NAAC Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset NAAC data.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const naacAdminService = {
  getNAACAdmin,
  updateNAAC,
  deleteNAACRecord,
  resetNAAC,
};

export default naacAdminService;
