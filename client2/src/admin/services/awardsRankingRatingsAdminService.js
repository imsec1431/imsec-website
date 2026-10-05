import axios from "axios";

import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH HEADERS
   ========================================================= */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================================================
   GET ADMIN DATA
   ========================================================= */

export const getAwardsRankingRatingsAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/awards-ranking-ratings/admin`,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    console.error("Get Awards Ranking Ratings Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load awards, rankings and ratings.",
      }
    );
  }
};

/* =========================================================
   UPDATE DATA
   ========================================================= */

export const updateAwardsRankingRatings = async (data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/awards-ranking-ratings/admin`,
      data,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Awards Ranking Ratings Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update information.",
      }
    );
  }
};

/* =========================================================
   UPLOAD PHOTO
   ========================================================= */

export const uploadRecognitionPhoto = async (file) => {
  try {
    const formData = new FormData();

    formData.append("photo", file);

    const response = await axios.post(
      `${API_BASE_URL}/api/awards-ranking-ratings/admin/upload-photo`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Upload Recognition Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to upload photo.",
      }
    );
  }
};

/* =========================================================
   DELETE PHOTO
   ========================================================= */

export const deleteRecognitionPhoto = async (publicId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/awards-ranking-ratings/admin/delete-photo`,
      {
        headers: getAuthHeaders(),

        data: {
          publicId,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Delete Recognition Photo Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete photo.",
      }
    );
  }
};

/* =========================================================
   RESET DEFAULTS
   ========================================================= */

export const resetAwardsRankingRatings = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/awards-ranking-ratings/admin/reset-defaults`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset Awards Ranking Ratings Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset defaults.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
   ========================================================= */

const awardsRankingRatingsAdminService = {
  getAwardsRankingRatingsAdmin,
  updateAwardsRankingRatings,
  uploadRecognitionPhoto,
  deleteRecognitionPhoto,
  resetAwardsRankingRatings,
};

export default awardsRankingRatingsAdminService;
