import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/contact`;

// Send Contact Form
export const sendMessage = (data) => {
  return axios.post(API, data);
};

// Get All Messages (Admin)
export const getMessages = () => {
  return axios.get(API);
};

// Get Single Message
export const getMessage = (id) => {
  return axios.get(`${API}/${id}`);
};

// Mark As Read
export const markAsRead = (id) => {
  return axios.put(`${API}/${id}/read`);
};

// Delete Message
export const deleteMessage = (id) => {
  return axios.delete(`${API}/${id}`);
};
