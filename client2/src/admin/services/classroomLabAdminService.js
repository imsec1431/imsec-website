import axios from "axios";
import { getToken, removeToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/classroom-lab`;

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
   AUTH ERROR HANDLER
========================================================= */

const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    removeToken();
    localStorage.removeItem("imsec_admin");

    window.location.href = "/imsec-control-center/login";
  }

  throw error;
};

/* =========================================================
   GET ADMIN DATA
========================================================= */

export const getClassroomLabAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin`, authConfig());

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   UPDATE ADMIN DATA
========================================================= */

export const updateClassroomLabAdmin = async (formData) => {
  try {
    const config = authConfig();

    const response = await axios.put(`${API_URL}/admin`, formData, {
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetClassroomLabDefaults = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reset-defaults`,
      {},
      authConfig(),
    );

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getClassroomLabAdmin,
  updateClassroomLabAdmin,
  resetClassroomLabDefaults,
};
