import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET SPORTS FOR ADMIN
========================================================= */

export const getSportsAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(`${API_BASE_URL}/api/sports/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get Sports Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load sports information.",
      }
    );
  }
};

/* =========================================================
   UPDATE SPORTS
========================================================= */

export const updateSports = async (formData) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/sports/admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Sports Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update sports information.",
      }
    );
  }
};

/* =========================================================
   DELETE IMAGE
========================================================= */

export const deleteSportsImage = async (imageId) => {
  try {
    const token = getToken();

    const response = await axios.delete(
      `${API_BASE_URL}/api/sports/admin/images/${imageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Delete Sports Image Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete sports image.",
      }
    );
  }
};

/* =========================================================
   UPDATE IMAGE DETAILS
========================================================= */

export const updateSportsImage = async (imageId, imageData) => {
  try {
    const token = getToken();

    const response = await axios.put(
      `${API_BASE_URL}/api/sports/admin/images/${imageId}`,
      imageData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Sports Image Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update sports image.",
      }
    );
  }
};

/* =========================================================
   REPLACE IMAGE
========================================================= */

export const replaceSportsImage = async (imageId, imageFile) => {
  try {
    const token = getToken();

    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await axios.put(
      `${API_BASE_URL}/api/sports/admin/images/${imageId}/replace`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Replace Sports Image Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to replace sports image.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetSports = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/sports/admin/reset-defaults`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset Sports Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset sports information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const sportsAdminService = {
  getSportsAdmin,
  updateSports,
  deleteSportsImage,
  updateSportsImage,
  replaceSportsImage,
  resetSports,
};

export default sportsAdminService;
