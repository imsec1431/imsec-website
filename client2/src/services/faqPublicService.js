import axios from "axios";

/* =========================================================
   API URL
========================================================= */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/faq`;

/* =========================================================
   GET PUBLIC FAQ
========================================================= */

export const getPublicFAQ = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const faqPublicService = {
  getPublicFAQ,
};

export default faqPublicService;
