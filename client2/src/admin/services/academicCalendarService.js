import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/academic-calendar`;

/* =========================
   AUTH CONFIG
========================= */

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
      Accept: "application/json",
    },
  };
};

/* =========================
   GET ALL
========================= */

export const getAcademicCalendars = async () => {
  const response = await axios.get(API_URL, getAuthConfig());

  return response.data;
};

/* =========================
   GET BY ID
========================= */

export const getAcademicCalendarById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================
   CREATE
========================= */

export const createAcademicCalendar = async (data) => {
  const authConfig = getAuthConfig();

  const response = await axios.post(API_URL, data, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================
   UPDATE
========================= */

export const updateAcademicCalendar = async (id, data) => {
  const authConfig = getAuthConfig();

  const response = await axios.put(`${API_URL}/${id}`, data, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================
   DELETE
========================= */

export const deleteAcademicCalendar = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================
   TOGGLE STATUS
========================= */

export const toggleAcademicCalendarStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    getAuthConfig(),
  );

  return response.data;
};
