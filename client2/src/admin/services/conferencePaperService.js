import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/research/conference-papers`;

/* =========================================
   GET ALL CONFERENCE PAPERS
========================================= */

export const getConferencePapers = async () => {
  return await axios.get(API);
};

/* =========================================
   GET SINGLE CONFERENCE PAPER
========================================= */

export const getConferencePaper = async (id) => {
  return await axios.get(`${API}/${id}`);
};

/* =========================================
   CREATE CONFERENCE PAPER
========================================= */

export const addConferencePaper = async (data) => {
  return await axios.post(API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* =========================================
   UPDATE CONFERENCE PAPER
========================================= */

export const updateConferencePaper = async (id, data) => {
  return await axios.put(`${API}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* =========================================
   DELETE CONFERENCE PAPER
========================================= */

export const deleteConferencePaper = async (id) => {
  return await axios.delete(`${API}/${id}`);
};

const CONTENT_API = `${API_BASE_URL}/api/research/conference-paper-content`;

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
