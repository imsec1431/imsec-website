import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/announcement`;

// Get All
export const getAnnouncements = () => axios.get(API);

// Get Single
export const getAnnouncement = (id) => axios.get(`${API}/${id}`);

// Add
export const addAnnouncement = (data) => axios.post(API, data);

// Update
export const updateAnnouncement = (id, data) => axios.put(`${API}/${id}`, data);

// Delete
export const deleteAnnouncement = (id) => axios.delete(`${API}/${id}`);
