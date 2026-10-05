const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/placement-notices`;

/* =========================================================
   GET ADMIN TOKEN

   IMPORTANT:
   Your project stores the token as:
   imsec_admin_token
========================================================= */

const getAdminToken = () => {
  const token = localStorage.getItem("imsec_admin_token");

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return token;
};

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
  const token = getAdminToken();

  return {
    Authorization: `Bearer ${token}`,

    Accept: "application/json",
  };
};

/* =========================================================
   GET ALL PLACEMENT NOTICES - ADMIN
========================================================= */

export const fetchPlacementNoticesAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    method: "GET",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load placement notices.");
  }

  return result;
};

/* =========================================================
   CREATE PLACEMENT NOTICE
========================================================= */

export const createPlacementNotice = async (data) => {
  if (!data) {
    throw new Error("Placement notice data is required.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      ...getAuthHeaders(),

      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create placement notice.");
  }

  return result;
};

/* =========================================================
   UPDATE PLACEMENT NOTICE
========================================================= */

export const updatePlacementNotice = async (id, data) => {
  if (!id) {
    throw new Error("Placement notice ID is required.");
  }

  if (!data) {
    throw new Error("Placement notice data is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      ...getAuthHeaders(),

      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update placement notice.");
  }

  return result;
};

/* =========================================================
   DELETE PLACEMENT NOTICE
========================================================= */

export const deletePlacementNotice = async (id) => {
  if (!id) {
    throw new Error("Placement notice ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete placement notice.");
  }

  return result;
};

/* =========================================================
   TOGGLE PUBLISHED STATUS

   OPTIONAL
   Keep this only if your backend route exists.
========================================================= */

export const togglePlacementNoticeStatus = async (id) => {
  if (!id) {
    throw new Error("Placement notice ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}/toggle-status`, {
    method: "PATCH",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to update placement notice status.",
    );
  }

  return result;
};
