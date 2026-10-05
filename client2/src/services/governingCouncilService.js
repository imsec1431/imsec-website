import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/governing-council`;

// Get Members
export const getMembers = () => axios.get(API);

// Add Member
export const addMember = (formData) =>
  axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update Member
export const updateMember = (id, formData) =>
  axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Member
export const deleteMember = (id) => axios.delete(`${API}/${id}`);
