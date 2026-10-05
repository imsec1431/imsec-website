import axios from "axios";

import { getToken, removeToken } from "../utils/token";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/student-clubs`;

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
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

    return null;
  }

  throw error;
};

/* =========================================================
   GET STUDENT CLUBS - ADMIN
========================================================= */

export const getStudentClubsAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

    return response.data;
  } catch (error) {
    console.error(
      "Student Clubs GET Error:",
      error?.response?.data || error?.message || error,
    );

    return handleAuthError(error);
  }
};

/* =========================================================
   UPDATE STUDENT CLUBS
========================================================= */

export const updateStudentClubsAdmin = async (formData) => {
  try {
    /* -----------------------------------------------
         SAFETY CHECK
      ------------------------------------------------ */

    if (!(formData instanceof FormData)) {
      throw new Error("Student Clubs upload requires FormData.");
    }

    const token = getToken();

    if (!token) {
      throw new Error("Authentication required.");
    }

    /* -----------------------------------------------
         IMPORTANT
         
         DO NOT manually set:
         
         Content-Type:
         multipart/form-data
         
         Axios/browser must create the multipart
         boundary automatically.
      ------------------------------------------------ */

    const response = await axios.put(`${API_URL}/admin`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Student Clubs UPDATE Error:",
      error?.response?.data || error?.message || error,
    );

    return handleAuthError(error);
  }
};

/* =========================================================
   DELETE ONE STUDENT CLUB
========================================================= */

export const deleteStudentClub = async (clubId) => {
  try {
    if (!clubId) {
      throw new Error("Student Club ID is required.");
    }

    const token = getToken();

    if (!token) {
      throw new Error("Authentication required.");
    }

    // console.log("Deleting Student Club:", clubId);

    const response = await axios.delete(`${API_URL}/admin/${clubId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Student Club Delete Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Student Clubs DELETE Error:",
      error?.response?.data || error?.message || error,
    );

    return handleAuthError(error);
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetStudentClubsDefaults = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error(
      "Student Clubs RESET Error:",
      error?.response?.data || error?.message || error,
    );

    return handleAuthError(error);
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getStudentClubsAdmin,

  updateStudentClubsAdmin,

  deleteStudentClub,

  resetStudentClubsDefaults,
};
