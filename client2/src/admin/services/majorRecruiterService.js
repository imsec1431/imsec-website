import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/major-recruiters`;

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
   GET MAJOR RECRUITERS - ADMIN
========================================================= */

export const fetchMajorRecruitersAdmin = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthHeaders());

  return response.data;
};

/* =========================================================
   GET PUBLIC MAJOR RECRUITERS
========================================================= */

export const fetchMajorRecruiters = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

/* =========================================================
   CREATE MAJOR RECRUITER
========================================================= */

export const createMajorRecruiter = async (formData) => {
  const response = await axios.post(API_URL, formData, getAuthHeaders());

  return response.data;
};

/* =========================================================
   UPDATE MAJOR RECRUITER
========================================================= */

export const updateMajorRecruiter = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    getAuthHeaders(),
  );

  return response.data;
};

/* =========================================================
   DELETE MAJOR RECRUITER
========================================================= */

export const deleteMajorRecruiter = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());

  return response.data;
};
