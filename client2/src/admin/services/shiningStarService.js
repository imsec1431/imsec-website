import axios from "axios";

import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/shining-stars`;

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================================================
   GET ALL
========================================================= */

export const getShiningStars = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

/* =========================================================
   GET SINGLE
========================================================= */

export const getShiningStar = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   CREATE
========================================================= */

export const createShiningStar = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    ...getAuthConfig(),

    headers: {
      ...getAuthConfig().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE
========================================================= */

export const updateShiningStar = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    ...getAuthConfig(),

    headers: {
      ...getAuthConfig().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE
========================================================= */

export const deleteShiningStar = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   PUBLISH / DRAFT
========================================================= */

export const toggleShiningStarStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    getAuthConfig(),
  );

  return response.data;
};
