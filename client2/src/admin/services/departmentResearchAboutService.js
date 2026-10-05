const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   GET RESEARCH ABOUT BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchAbout = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/department-research/about/department/${departmentId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch department research information",
    );
  }

  return result;
};

/* =========================================================
   GET RESEARCH ABOUT BY ID
   ========================================================= */

export const getDepartmentResearchAboutById = async (id) => {
  const response = await fetch(`${API_URL}/department-research/about/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch research information");
  }

  return result;
};

/* =========================================================
   CREATE RESEARCH ABOUT
   ========================================================= */

export const createDepartmentResearchAbout = async (researchData) => {
  const response = await fetch(`${API_URL}/department-research/about`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(researchData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create research information");
  }

  return result;
};

/* =========================================================
   UPDATE RESEARCH ABOUT
   ========================================================= */

export const updateDepartmentResearchAbout = async (id, researchData) => {
  const response = await fetch(`${API_URL}/department-research/about/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(researchData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update research information");
  }

  return result;
};

/* =========================================================
   DELETE RESEARCH ABOUT
   ========================================================= */

export const deleteDepartmentResearchAbout = async (id) => {
  const response = await fetch(`${API_URL}/department-research/about/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete research information");
  }

  return result;
};

export default {
  getDepartmentResearchAbout,
  getDepartmentResearchAboutById,
  createDepartmentResearchAbout,
  updateDepartmentResearchAbout,
  deleteDepartmentResearchAbout,
};
