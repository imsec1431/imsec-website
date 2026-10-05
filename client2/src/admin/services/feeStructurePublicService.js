import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/fee-structure`;

/* =========================================================
   GET PUBLIC FEE STRUCTURE
   NO TOKEN
========================================================= */

export const getPublicFeeStructure = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const feeStructurePublicService = {
  getPublicFeeStructure,
};

export default feeStructurePublicService;
