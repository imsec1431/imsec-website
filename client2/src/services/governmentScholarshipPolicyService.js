import axios from "axios";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/government-scholarship-policy`;

/* =========================================================
   GET PUBLIC GOVERNMENT SCHOLARSHIP POLICY
========================================================= */

export const getPublicGovernmentScholarshipPolicy = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   GET PDF URL
========================================================= */

export const getGovernmentScholarshipPdfUrl = (pdfUrl) => {
  if (!pdfUrl) {
    return "";
  }

  return pdfUrl;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const governmentScholarshipPolicyService = {
  getPublicGovernmentScholarshipPolicy,
  getGovernmentScholarshipPdfUrl,
};

export default governmentScholarshipPolicyService;
