import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/academic-calendar`;

/* =========================
   GET PUBLIC ACADEMIC CALENDARS
========================= */

export const getPublicAcademicCalendars = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================
   GET PUBLIC CALENDAR BY ID
========================= */

export const getPublicAcademicCalendarById = async (id) => {
  const response = await axios.get(`${API_URL}/public/${id}`);

  return response.data;
};
