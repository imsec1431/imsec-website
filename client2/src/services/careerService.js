import axios from "axios";

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ======================================================
// CAREER API BASE URL
// ======================================================

const CAREER_API_URL = `${API_BASE_URL}/api/careers`;

// ======================================================
// GET PUBLIC CAREER OPENINGS
// ======================================================
//
// Used on:
//
// /career
//
// ======================================================

export const getPublicCareerOpenings = async () => {
  try {
    const response = await axios.get(CAREER_API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get public career openings error:", error);

    throw error;
  }
};

// ======================================================
// GET SINGLE PUBLIC CAREER OPENING
// ======================================================
//
// Used by:
//
// CareerApplication.jsx
//
// Endpoint:
//
// GET /api/careers/:openingId
//
// ======================================================

export const getPublicCareerOpening = async (openingId) => {
  try {
    if (!openingId) {
      throw new Error("Career opening ID is required.");
    }

    const response = await axios.get(`${CAREER_API_URL}/${openingId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get public career opening error:", error);

    throw error;
  }
};

// ======================================================
// SUBMIT APPLICATION FOR A VACANCY
// ======================================================
//
// Endpoint:
//
// POST /api/careers/:openingId/apply
//
// The FormData must contain:
//
// resumeFile
//
// ======================================================

export const submitCareerApplication = async (openingId, formData) => {
  try {
    if (!openingId) {
      throw new Error("Career opening ID is required.");
    }

    if (!(formData instanceof FormData)) {
      throw new Error("Career application data must be FormData.");
    }

    const response = await axios.post(
      `${CAREER_API_URL}/${openingId}/apply`,
      formData,
      {
        headers: {
          /*
           * Do NOT manually set:
           *
           * Content-Type:
           * multipart/form-data
           *
           * Axios will automatically
           * create the boundary.
           */

          Accept: "application/json",
        },

        timeout: 60000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Submit career application error:", error);

    throw error;
  }
};

// ======================================================
// GENERAL APPLICATION
// ======================================================
//
// Used when there are no vacancies.
//
// Public page:
//
// Submit Your Profile to HR
//
// Endpoint:
//
// POST /api/careers/general-application
//
// ======================================================

export const submitGeneralCareerApplication = async (formData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("Career application data must be FormData.");
    }

    const response = await axios.post(
      `${CAREER_API_URL}/general-application`,
      formData,
      {
        headers: {
          Accept: "application/json",
        },

        timeout: 60000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Submit general career application error:", error);

    throw error;
  }
};

// ======================================================
// BACKWARD COMPATIBILITY ALIASES
// ======================================================
//
// These aliases prevent errors if another existing
// Career component imports the older function names.
//
// ======================================================

export const getCareerOpenings = getPublicCareerOpenings;

export const getCareerOpeningById = getPublicCareerOpening;

export const getCareers = getPublicCareerOpenings;

export const getCareerById = getPublicCareerOpening;

export const applyForCareer = submitCareerApplication;
