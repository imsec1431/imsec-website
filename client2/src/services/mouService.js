import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/mou`;

// Get All
export const getMOUs = () => axios.get(API);

// Get Single
export const getMOU = (id) => axios.get(`${API}/${id}`);

// Add
export const addMOU = (formData) => axios.post(API, formData);

// Update
export const updateMOU = (id, formData) => axios.put(`${API}/${id}`, formData);

// Delete
export const deleteMOU = (id) => axios.delete(`${API}/${id}`);
