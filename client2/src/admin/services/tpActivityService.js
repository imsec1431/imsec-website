import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/tp-activities`;

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* =========================================================
   GET ALL ACTIVITIES - ADMIN
========================================================= */

export const fetchTPActivitiesAdmin = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthHeaders());

  return response.data;
};

/* =========================================================
   GET PUBLIC ACTIVITIES
========================================================= */

export const fetchTPActivities = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

/* =========================================================
   CREATE ACTIVITY
========================================================= */

export const createTPActivity = async (formData) => {
  const response = await axios.post(API_URL, formData, getAuthHeaders());

  return response.data;
};

/* =========================================================
   UPDATE ACTIVITY
========================================================= */

export const updateTPActivity = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    getAuthHeaders(),
  );

  return response.data;
};

/* =========================================================
   DELETE ACTIVITY
========================================================= */

export const deleteTPActivity = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());

  return response.data;
};
