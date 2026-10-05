import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/activity-calendar`;

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
      Accept: "application/json",
    },
  };
};

/* =========================================================
   GET ALL - ADMIN
========================================================= */

export const getActivityCalendars = async () => {
  const response = await axios.get(API_URL, getAuthConfig());

  return response.data;
};

/* =========================================================
   GET SINGLE - ADMIN
========================================================= */

export const getActivityCalendarById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   CREATE
========================================================= */

export const createActivityCalendar = async (data) => {
  const response = await axios.post(API_URL, data, {
    ...getAuthConfig(),
    headers: {
      ...getAuthConfig().headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE
========================================================= */

export const updateActivityCalendar = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    ...getAuthConfig(),
    headers: {
      ...getAuthConfig().headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE
========================================================= */

export const deleteActivityCalendar = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   PUBLISH / DRAFT
========================================================= */

export const toggleActivityCalendarStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    getAuthConfig(),
  );

  return response.data;
};
