import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const PAPER_API = `${API_BASE_URL}/api/research/conference-papers`;

const CONTENT_API = `${API_BASE_URL}/api/research/conference-paper-content`;

/* =========================================
   CONFERENCE PAPER TABLE
========================================= */

export const getConferencePapers = async () => {
  return await axios.get(PAPER_API);
};

export const getConferencePaper = async (id) => {
  return await axios.get(`${PAPER_API}/${id}`);
};

export const addConferencePaper = async (data) => {
  return await axios.post(PAPER_API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateConferencePaper = async (id, data) => {
  return await axios.put(`${PAPER_API}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteConferencePaper = async (id) => {
  return await axios.delete(`${PAPER_API}/${id}`);
};

/* =========================================
   CONFERENCE PAGE CONTENT
   Hero, About, Statistics, Timeline,
   Indexing Databases and CTA
========================================= */

export const getConferencePaperContent = async () => {
  return await axios.get(CONTENT_API);
};

export const updateConferencePaperContent = async (data) => {
  return await axios.put(CONTENT_API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
