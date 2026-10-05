import axios from "axios";

/* =========================================================
   API BASE URL
   ========================================================= */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   DEFAULT PAGINATION
   ========================================================= */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/* =========================================================
   GET DEPARTMENT BY SLUG
   ========================================================= */

export const getDepartmentBySlug = async (slug) => {
  const response = await axios.get(
    `${API_URL}/api/departments/slug/${encodeURIComponent(slug)}`,
  );

  return response.data;
};

/* =========================================================
   RESEARCH ABOUT
   ========================================================= */

export const getDepartmentResearchAbout = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/about/department/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   RESEARCH POLICY
   ========================================================= */

export const getDepartmentResearchPolicy = async (departmentId) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/policy/department/${departmentId}`,
  );

  return response.data;
};

/* =========================================================
   RESEARCH JOURNALS
   ========================================================= */

export const getDepartmentResearchJournals = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/journals/department/${departmentId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

/* =========================================================
   CONFERENCE PAPERS
   ========================================================= */

export const getDepartmentResearchConferencePapers = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/conference-papers/department/${departmentId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

/* =========================================================
   BOOKS / CHAPTERS
   ========================================================= */

export const getDepartmentResearchBooks = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/books/department/${departmentId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

/* =========================================================
   PATENTS
   ========================================================= */

export const getDepartmentResearchPatents = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/patents/department/${departmentId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

/* =========================================================
   FDPs
   ========================================================= */

export const getDepartmentResearchFDPs = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const response = await axios.get(
    `${API_URL}/api/department-research/fdps/department/${departmentId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

/* =========================================================
   GET ALL DEPARTMENT RESEARCH DATA
   =========================================================
   
   Loads all Department Research modules together.
   
   Default:
   10 items per page for list-based modules.
   
   ========================================================= */

export const getAllDepartmentResearch = async (
  departmentId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) => {
  const [about, policy, journals, conferencePapers, books, patents, fdps] =
    await Promise.all([
      getDepartmentResearchAbout(departmentId),

      getDepartmentResearchPolicy(departmentId),

      getDepartmentResearchJournals(departmentId, page, limit),

      getDepartmentResearchConferencePapers(departmentId, page, limit),

      getDepartmentResearchBooks(departmentId, page, limit),

      getDepartmentResearchPatents(departmentId, page, limit),

      getDepartmentResearchFDPs(departmentId, page, limit),
    ]);

  return {
    about,
    policy,
    journals,
    conferencePapers,
    books,
    patents,
    fdps,
  };
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

const departmentResearchPublicService = {
  getDepartmentBySlug,

  getDepartmentResearchAbout,
  getDepartmentResearchPolicy,

  getDepartmentResearchJournals,
  getDepartmentResearchConferencePapers,
  getDepartmentResearchBooks,
  getDepartmentResearchPatents,
  getDepartmentResearchFDPs,

  getAllDepartmentResearch,
};

export default departmentResearchPublicService;
