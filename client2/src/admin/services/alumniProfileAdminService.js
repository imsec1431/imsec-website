import axios from "axios";
import { getToken, removeToken } from "../utils/token";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

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
   GET PUBLIC ALUMNI PROFILE
========================================================= */

export const getAlumniProfile = async () => {
  try {
    return await axios.get(`${API_BASE_URL}/api/alumni-profile`);
  } catch (error) {
    throw error;
  }
};

/* =========================================================
   GET ADMIN ALUMNI PROFILE
========================================================= */

export const getAlumniProfileAdmin = async () => {
  try {
    return await axios.get(
      `${API_BASE_URL}/api/alumni-profile/admin`,
      getAuthConfig(),
    );
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   UPDATE ALUMNI PROFILE
========================================================= */

export const updateAlumniProfile = async (formData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("updateAlumniProfile requires FormData.");
    }

    return await axios.put(
      `${API_BASE_URL}/api/alumni-profile/admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,

          /*
           * Do NOT manually set:
           * Content-Type: multipart/form-data
           *
           * Axios/browser will add the correct
           * multipart boundary automatically.
           */
        },
      },
    );
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   RESET ALUMNI PROFILE
========================================================= */

export const resetAlumniProfile = async () => {
  try {
    return await axios.post(
      `${API_BASE_URL}/api/alumni-profile/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );
  } catch (error) {
    return handleAuthError(error);
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const alumniProfileAdminService = {
  getAlumniProfile,
  getAlumniProfileAdmin,
  updateAlumniProfile,
  resetAlumniProfile,
};

export default alumniProfileAdminService;
