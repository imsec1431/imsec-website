import axios from "axios";

import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET COUNSELLING SUPPORT - ADMIN
========================================================= */

export const getCounsellingSupportAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(
      `${API_BASE_URL}/api/counselling-support/admin`,
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

    console.error("Get Counselling Support Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load counselling support information.",
      }
    );
  }
};

/* =========================================================
   UPDATE COUNSELLING SUPPORT
========================================================= */

export const updateCounsellingSupport = async (data) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/counselling-support/admin`,
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

    console.error("Update Counselling Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update counselling support information.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetCounsellingSupport = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/counselling-support/admin/reset-defaults`,
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

    console.error("Reset Counselling Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset counselling support information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const counsellingSupportAdminService = {
  getCounsellingSupportAdmin,
  updateCounsellingSupport,
  resetCounsellingSupport,
};

export default counsellingSupportAdminService;
