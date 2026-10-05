const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   GET ALL CONFERENCE PAPERS FOR DEPARTMENT
   ========================================================= */

export const getDepartmentResearchConferencePapers = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/department-research/conference-papers/department/${departmentId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch department conference papers",
    );
  }

  return result;
};

/* =========================================================
   GET SINGLE CONFERENCE PAPER
   ========================================================= */

export const getDepartmentResearchConferencePaperById = async (id) => {
  const response = await fetch(
    `${API_URL}/department-research/conference-papers/${id}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch conference paper");
  }

  return result;
};

/* =========================================================
   CREATE CONFERENCE PAPER
   ========================================================= */

export const createDepartmentResearchConferencePaper = async (paperData) => {
  const response = await fetch(
    `${API_URL}/department-research/conference-papers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperData),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create conference paper");
  }

  return result;
};

/* =========================================================
   UPDATE CONFERENCE PAPER
   ========================================================= */

export const updateDepartmentResearchConferencePaper = async (
  id,
  paperData,
) => {
  const response = await fetch(
    `${API_URL}/department-research/conference-papers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperData),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update conference paper");
  }

  return result;
};

/* =========================================================
   DELETE CONFERENCE PAPER
   ========================================================= */

export const deleteDepartmentResearchConferencePaper = async (id) => {
  const response = await fetch(
    `${API_URL}/department-research/conference-papers/${id}`,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete conference paper");
  }

  return result;
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default {
  getDepartmentResearchConferencePapers,
  getDepartmentResearchConferencePaperById,
  createDepartmentResearchConferencePaper,
  updateDepartmentResearchConferencePaper,
  deleteDepartmentResearchConferencePaper,
};
