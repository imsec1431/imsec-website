import axios from "axios";
import { getToken, removeToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/hostel-mess`;

/* =========================================================
   AUTH CONFIG
========================================================= */

const authConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================================================
   HANDLE AUTH ERRORS
========================================================= */

const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    removeToken();

    /*
      Remove admin data as well if your AuthContext
      stores it in localStorage.
    */

    localStorage.removeItem("imsec_admin");

    window.location.href = "/imsec-control-center/login";
  }

  throw error;
};

/* =========================================================
   GET ADMIN DATA
   GET /api/hostel-mess/admin
========================================================= */

export const getHostelMessAdmin = async () => {
  try {
    const config = authConfig();

    const response = await axios.get(`${API_URL}/admin`, config);

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/* =========================================================
   UPDATE HOSTEL & MESS
   PUT /api/hostel-mess/admin
========================================================= */

export const updateHostelMessAdmin = async (formData) => {
  try {
    const config = authConfig();

    const response = await axios.put(`${API_URL}/admin`, formData, {
      ...config,
      headers: {
        ...config.headers,

        /*
            Do NOT manually add the multipart boundary.
            Axios/browser will generate it automatically.
          */
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/* =========================================================
   RESTORE DEFAULT DATA
   POST /api/hostel-mess/admin/reset-defaults
========================================================= */

export const resetHostelMessDefaults = async () => {
  try {
    const config = authConfig();

    const response = await axios.post(
      `${API_URL}/admin/reset-defaults`,
      {},
      config,
    );

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getHostelMessAdmin,
  updateHostelMessAdmin,
  resetHostelMessDefaults,
};
