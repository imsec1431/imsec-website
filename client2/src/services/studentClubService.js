import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/student-clubs`;

/* =========================================================
   GET STUDENT CLUBS - PUBLIC
========================================================= */

export const getStudentClubs = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

export default {
  getStudentClubs,
};
