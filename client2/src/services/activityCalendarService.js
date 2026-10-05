import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/activity-calendar`;

/* =========================================================
   GET PUBLIC ACTIVITY CALENDARS
   Only published calendars should be returned by backend.
   No authentication required.
========================================================= */

export const getPublicActivityCalendars = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   GET SINGLE PUBLIC ACTIVITY CALENDAR
========================================================= */

export const getPublicActivityCalendarById = async (id) => {
  const response = await axios.get(`${API_URL}/public/${id}`);

  return response.data;
};
