import axios from "axios";

/* =========================================================
   API URL
========================================================= */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/student-handbooks`;

/* =========================================================
   GET PUBLISHED STUDENT HANDBOOKS
========================================================= */

export const getStudentHandbooks = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};
