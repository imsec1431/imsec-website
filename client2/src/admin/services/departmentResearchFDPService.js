const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/department-research/fdps`;

/* =========================================================
   GET ALL FDPs BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchFDPs = async (departmentId) => {
  try {
    const response = await fetch(`${API_URL}/department/${departmentId}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch research FDPs");
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchFDPs error:", error);

    throw error;
  }
};

/* =========================================================
   GET SINGLE FDP
   ========================================================= */

export const getDepartmentResearchFDPById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to fetch research FDP");
    }

    return result;
  } catch (error) {
    console.error("getDepartmentResearchFDPById error:", error);

    throw error;
  }
};

/* =========================================================
   CREATE FDP
   ========================================================= */

export const createDepartmentResearchFDP = async (data) => {
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
      throw new Error(result?.message || "Failed to create research FDP");
    }

    return result;
  } catch (error) {
    console.error("createDepartmentResearchFDP error:", error);

    throw error;
  }
};

/* =========================================================
   UPDATE FDP
   ========================================================= */

export const updateDepartmentResearchFDP = async (id, data) => {
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
      throw new Error(result?.message || "Failed to update research FDP");
    }

    return result;
  } catch (error) {
    console.error("updateDepartmentResearchFDP error:", error);

    throw error;
  }
};

/* =========================================================
   DELETE FDP
   ========================================================= */

export const deleteDepartmentResearchFDP = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Failed to delete research FDP");
    }

    return result;
  } catch (error) {
    console.error("deleteDepartmentResearchFDP error:", error);

    throw error;
  }
};
