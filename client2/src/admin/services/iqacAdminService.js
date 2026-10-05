import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =====================================================
   GET IQAC ADMIN DATA
===================================================== */

export const getIQACAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(`${API_BASE_URL}/api/iqac/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get IQAC Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load IQAC information.",
      }
    );
  }
};

/* =====================================================
   UPDATE IQAC
===================================================== */

export const updateIQAC = async (iqacData) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/iqac/admin`,
      iqacData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update IQAC Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update IQAC information.",
      }
    );
  }
};

/* =====================================================
   RESET IQAC DEFAULTS
===================================================== */

export const resetIQAC = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/iqac/admin/reset-defaults`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset IQAC Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset IQAC information.",
      }
    );
  }
};

/* =====================================================
   DEFAULT EXPORT
===================================================== */

const iqacAdminService = {
  getIQACAdmin,
  updateIQAC,
  resetIQAC,
};

export default iqacAdminService;
