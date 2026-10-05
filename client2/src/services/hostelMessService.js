import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/hostel-mess`;

/* =========================================================
   GET HOSTEL & MESS DATA
   Public API
========================================================= */

export const getHostelMess = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getHostelMess,
};
