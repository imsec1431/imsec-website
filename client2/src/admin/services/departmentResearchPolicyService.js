const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   GET RESEARCH POLICY BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchPolicy = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/department-research/policy/department/${departmentId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch department research policy",
    );
  }

  return result;
};

/* =========================================================
   GET RESEARCH POLICY BY ID
   ========================================================= */

export const getDepartmentResearchPolicyById = async (id) => {
  const response = await fetch(`${API_URL}/department-research/policy/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch research policy");
  }

  return result;
};

/* =========================================================
   CREATE RESEARCH POLICY
   ========================================================= */

export const createDepartmentResearchPolicy = async (policyData) => {
  const response = await fetch(`${API_URL}/department-research/policy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(policyData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create research policy");
  }

  return result;
};

/* =========================================================
   UPDATE RESEARCH POLICY
   ========================================================= */

export const updateDepartmentResearchPolicy = async (id, policyData) => {
  const response = await fetch(`${API_URL}/department-research/policy/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(policyData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update research policy");
  }

  return result;
};

/* =========================================================
   DELETE RESEARCH POLICY
   ========================================================= */

export const deleteDepartmentResearchPolicy = async (id) => {
  const response = await fetch(`${API_URL}/department-research/policy/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete research policy");
  }

  return result;
};

export default {
  getDepartmentResearchPolicy,
  getDepartmentResearchPolicyById,
  createDepartmentResearchPolicy,
  updateDepartmentResearchPolicy,
  deleteDepartmentResearchPolicy,
};
