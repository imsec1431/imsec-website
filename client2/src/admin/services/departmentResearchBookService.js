const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/department-research/books`;

/* =========================================================
   GET ALL BOOKS / CHAPTERS BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchBooks = async (departmentId) => {
  try {
    const response = await fetch(`${API_URL}/department/${departmentId}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to fetch research books / chapters",
      );
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchBooks error:", error);

    throw error;
  }
};

/* =========================================================
   GET SINGLE BOOK / CHAPTER
   ========================================================= */

export const getDepartmentResearchBookById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to fetch research book / chapter",
      );
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchBookById error:", error);

    throw error;
  }
};

/* =========================================================
   CREATE BOOK / CHAPTER
   ========================================================= */

export const createDepartmentResearchBook = async (data) => {
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
      throw new Error(
        result?.message || "Failed to create research book / chapter",
      );
    }

    return result;
  } catch (error) {
    console.error("createDepartmentResearchBook error:", error);

    throw error;
  }
};

/* =========================================================
   UPDATE BOOK / CHAPTER
   ========================================================= */

export const updateDepartmentResearchBook = async (id, data) => {
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
      throw new Error(
        result?.message || "Failed to update research book / chapter",
      );
    }

    return result;
  } catch (error) {
    console.error("updateDepartmentResearchBook error:", error);

    throw error;
  }
};

/* =========================================================
   DELETE BOOK / CHAPTER
   ========================================================= */

export const deleteDepartmentResearchBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to delete research book / chapter",
      );
    }

    return result;
  } catch (error) {
    console.error("deleteDepartmentResearchBook error:", error);

    throw error;
  }
};
