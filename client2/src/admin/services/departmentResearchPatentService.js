const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/department-research/patents`;

/* =========================================================
   GET ALL PATENTS BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchPatents = async (departmentId) => {
  try {
    const response = await fetch(`${API_URL}/department/${departmentId}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch research patents");
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchPatents error:", error);

    throw error;
  }
};

/* =========================================================
   GET SINGLE PATENT
   ========================================================= */

export const getDepartmentResearchPatentById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch research patent");
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchPatentById error:", error);

    throw error;
  }
};

/* =========================================================
   CREATE PATENT
   ========================================================= */

export const createDepartmentResearchPatent = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to create research patent");
    }

    return result;
  } catch (error) {
    console.error("createDepartmentResearchPatent error:", error);

    throw error;
  }
};

/* =========================================================
   UPDATE PATENT
   ========================================================= */

export const updateDepartmentResearchPatent = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to update research patent");
    }

    return result;
  } catch (error) {
    console.error("updateDepartmentResearchPatent error:", error);

    throw error;
  }
};

/* =========================================================
   DELETE PATENT
   ========================================================= */

export const deleteDepartmentResearchPatent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to delete research patent");
    }

    return result;
  } catch (error) {
    console.error("deleteDepartmentResearchPatent error:", error);

    throw error;
  }
};
