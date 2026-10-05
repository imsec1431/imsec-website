const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/cdc-team`;

/* =========================================
   GET ADMIN TOKEN
========================================= */

const getAdminToken = () => {
  const token = localStorage.getItem("imsec_admin_token");

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return token;
};

/* =========================================
   AUTH HEADERS
========================================= */

const getAuthHeaders = () => {
  const token = getAdminToken();

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

/* =========================================
   GET ALL CDC TEAM
========================================= */

export const fetchCDCTeamAdmin = async () => {
  const response = await fetch(`${API_URL}/admin`, {
    method: "GET",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to load CDC Team.");
  }

  return result;
};

/* =========================================
   CREATE CDC TEAM MEMBER
========================================= */

export const createCDCTeamMember = async (formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error("CDC Team data must be sent as FormData.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: getAuthHeaders(),

    /*
            IMPORTANT:
            Do NOT set Content-Type here.
            Browser automatically sets multipart/form-data
            boundary for FormData.
          */

    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create CDC Team member.");
  }

  return result;
};

/* =========================================
   UPDATE CDC TEAM MEMBER
========================================= */

export const updateCDCTeamMember = async (id, formData) => {
  if (!id) {
    throw new Error("CDC Team member ID is required.");
  }

  if (!(formData instanceof FormData)) {
    throw new Error("CDC Team data must be sent as FormData.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: getAuthHeaders(),

    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update CDC Team member.");
  }

  return result;
};

/* =========================================
   DELETE CDC TEAM MEMBER
========================================= */

export const deleteCDCTeamMember = async (id) => {
  if (!id) {
    throw new Error("CDC Team member ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete CDC Team member.");
  }

  return result;
};
