const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const API_URL = import.meta.env?.VITE_API_URL
//   ? `${import.meta.env.VITE_API_URL}/newsletters`
//   : "http://localhost:5000/api/newsletter";
const API_URL = `${API_BASE_URL}/api/newsletter`;

// Helper function to attach auth headers (JWT / token)
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Fetch all newsletters for admin management
 */
export const fetchNewslettersAdmin = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch newsletters");
    return data;
  } catch (error) {
    console.error("Admin Service [fetchNewslettersAdmin]:", error.message);
    throw error;
  }
};

/**
 * Create a new newsletter publication
 */
export const createNewsletterAdmin = async (formData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create newsletter");
    return data;
  } catch (error) {
    console.error("Admin Service [createNewsletterAdmin]:", error.message);
    throw error;
  }
};

/**
 * Update an existing newsletter edition by ID
 */
export const updateNewsletterAdmin = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update newsletter");
    return data;
  } catch (error) {
    console.error("Admin Service [updateNewsletterAdmin]:", error.message);
    throw error;
  }
};

/**
 * Delete a newsletter edition by ID
 */
export const deleteNewsletterAdmin = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete newsletter");
    return data;
  } catch (error) {
    console.error("Admin Service [deleteNewsletterAdmin]:", error.message);
    throw error;
  }
};
