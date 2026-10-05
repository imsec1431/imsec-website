import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/placement-policies`;

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  };
};

/* =========================================================
   GET ADMIN PLACEMENT POLICIES
========================================================= */

export const getPlacementPolicies = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthHeaders());

  return response.data;
};

/* =========================================================
   GET SINGLE POLICY
========================================================= */

export const getPlacementPolicy = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());

  return response.data;
};

/* =========================================================
   GET PUBLIC POLICIES
========================================================= */

export const getPublicPlacementPolicies = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

/* =========================================================
   CREATE POLICY
========================================================= */

export const createPlacementPolicy = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());

  return response.data;
};

/* =========================================================
   UPDATE POLICY
========================================================= */

export const updatePlacementPolicy = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());

  return response.data;
};

/* =========================================================
   DELETE POLICY
========================================================= */

export const deletePlacementPolicy = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());

  return response.data;
};

/* =========================================================
   PUBLISH / DRAFT
========================================================= */

export const togglePlacementPolicyStatus = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    {},
    getAuthHeaders(),
  );

  return response.data;
};
