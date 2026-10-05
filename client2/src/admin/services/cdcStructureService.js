import { getToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/cdc-structure`;

/* =========================================
   AUTH HEADERS
========================================= */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

/* =========================================
   GET CDC STRUCTURE - ADMIN
========================================= */

export const fetchCDCStructureAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    method: "GET",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load CDC Structure");
  }

  return result;
};

/* =========================================
   CREATE CDC STRUCTURE
========================================= */

export const createCDCStructure = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: getAuthHeaders(),

    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create CDC Structure");
  }

  return result;
};

/* =========================================
   UPDATE CDC STRUCTURE
========================================= */

export const updateCDCStructure = async (formData) => {
  const response = await fetch(API_URL, {
    method: "PUT",

    headers: getAuthHeaders(),

    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update CDC Structure");
  }

  return result;
};

/* =========================================
   DELETE CDC STRUCTURE
========================================= */

export const deleteCDCStructure = async () => {
  const response = await fetch(API_URL, {
    method: "DELETE",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete CDC Structure");
  }

  return result;
};
