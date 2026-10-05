const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   GET ALL JOURNALS FOR DEPARTMENT
   ========================================================= */

export const getDepartmentResearchJournals = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/department-research/journals/department/${departmentId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch department research journals",
    );
  }

  return result;
};

/* =========================================================
   GET SINGLE JOURNAL
   ========================================================= */

export const getDepartmentResearchJournalById = async (id) => {
  const response = await fetch(`${API_URL}/department-research/journals/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch research journal");
  }

  return result;
};

/* =========================================================
   CREATE JOURNAL
   ========================================================= */

export const createDepartmentResearchJournal = async (journalData) => {
  const response = await fetch(`${API_URL}/department-research/journals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journalData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create research journal");
  }

  return result;
};

/* =========================================================
   UPDATE JOURNAL
   ========================================================= */

export const updateDepartmentResearchJournal = async (id, journalData) => {
  const response = await fetch(
    `${API_URL}/department-research/journals/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalData),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update research journal");
  }

  return result;
};

/* =========================================================
   DELETE JOURNAL
   ========================================================= */

export const deleteDepartmentResearchJournal = async (id) => {
  const response = await fetch(
    `${API_URL}/department-research/journals/${id}`,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete research journal");
  }

  return result;
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default {
  getDepartmentResearchJournals,
  getDepartmentResearchJournalById,
  createDepartmentResearchJournal,
  updateDepartmentResearchJournal,
  deleteDepartmentResearchJournal,
};
