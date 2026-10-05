const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   GET ALL ALUMNI OF A DEPARTMENT
========================================================= */

export const getDepartmentAlumni = async (departmentId) => {
  if (!departmentId) {
    throw new Error("Department ID is required");
  }

  const response = await fetch(
    `${API_URL}/department-alumni/department/${departmentId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch department alumni");
  }

  return result;
};

/* =========================================================
   GET SINGLE ALUMNI
========================================================= */

export const getDepartmentAlumniById = async (id) => {
  if (!id) {
    throw new Error("Alumni ID is required");
  }

  const response = await fetch(`${API_URL}/department-alumni/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch alumni record");
  }

  return result;
};

/* =========================================================
   CREATE ALUMNI
========================================================= */

export const createDepartmentAlumni = async (alumniData) => {
  const response = await fetch(`${API_URL}/department-alumni`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alumniData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create alumni record");
  }

  return result;
};

/* =========================================================
   UPDATE ALUMNI
========================================================= */

export const updateDepartmentAlumni = async (id, alumniData) => {
  if (!id) {
    throw new Error("Alumni ID is required");
  }

  const response = await fetch(`${API_URL}/department-alumni/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alumniData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update alumni record");
  }

  return result;
};

/* =========================================================
   DELETE ALUMNI
========================================================= */

export const deleteDepartmentAlumni = async (id) => {
  if (!id) {
    throw new Error("Alumni ID is required");
  }

  const response = await fetch(`${API_URL}/department-alumni/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete alumni record");
  }

  return result;
};

export default {
  getDepartmentAlumni,
  getDepartmentAlumniById,
  createDepartmentAlumni,
  updateDepartmentAlumni,
  deleteDepartmentAlumni,
};
