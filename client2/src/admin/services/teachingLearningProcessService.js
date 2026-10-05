import axios from "axios";

import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/teaching-learning-process`;

/* =========================================================
   AUTH
========================================================= */

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

export const getAdminTeachingLearningProcesses = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

/* =========================================================
   GET SINGLE
========================================================= */

export const getAdminTeachingLearningProcess = async (id) => {
  const response = await axios.get(`${API_URL}/admin/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   CREATE
========================================================= */

export const createTeachingLearningProcess = async (formData) => {
  const authConfig = getAuthConfig();

  const response = await axios.post(`${API_URL}/admin`, formData, {
    ...authConfig,

    headers: {
      ...authConfig.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE
========================================================= */

export const updateTeachingLearningProcess = async (id, formData) => {
  const authConfig = getAuthConfig();

  const response = await axios.put(`${API_URL}/admin/${id}`, formData, {
    ...authConfig,

    headers: {
      ...authConfig.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE
========================================================= */

export const deleteTeachingLearningProcess = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   PUBLISH / DRAFT
========================================================= */

export const toggleTeachingLearningProcessStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/status`,
    {},
    getAuthConfig(),
  );

  return response.data;
};
