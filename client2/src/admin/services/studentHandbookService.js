import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/student-handbooks`;

/* =========================================================
   AUTH CONFIG
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
   GET ALL — ADMIN
========================================================= */

export const getStudentHandbooks = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

/* =========================================================
   GET SINGLE — ADMIN
========================================================= */

export const getStudentHandbook = async (id) => {
  const response = await axios.get(`${API_URL}/admin/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   CREATE — ADMIN
========================================================= */

export const createStudentHandbook = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, {
    ...getAuthConfig(),

    headers: {
      ...getAuthConfig().headers,

      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE — ADMIN
========================================================= */

export const updateStudentHandbook = async (id, data) => {
  const response = await axios.put(`${API_URL}/admin/${id}`, data, {
    ...getAuthConfig(),

    headers: {
      ...getAuthConfig().headers,

      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE — ADMIN
========================================================= */

export const deleteStudentHandbook = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   PUBLISH / DRAFT
========================================================= */

export const toggleStudentHandbookStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/status`,
    {},
    getAuthConfig(),
  );

  return response.data;
};
