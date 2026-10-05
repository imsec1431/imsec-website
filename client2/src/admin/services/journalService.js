import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const JOURNAL_API = `${API_BASE_URL}/api/research/journals`;
const CONTENT_API = `${API_BASE_URL}/api/research/publication-content`;

/* =========================================
   RESEARCH PUBLICATIONS TABLE
========================================= */

export const getJournals = async () => {
  return await axios.get(JOURNAL_API);
};

export const getJournal = async (id) => {
  return await axios.get(`${JOURNAL_API}/${id}`);
};

export const addJournal = async (data) => {
  return await axios.post(JOURNAL_API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateJournal = async (id, data) => {
  return await axios.put(`${JOURNAL_API}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteJournal = async (id) => {
  return await axios.delete(`${JOURNAL_API}/${id}`);
};

/* =========================================
   RESEARCH PUBLICATIONS PAGE CONTENT
   Hero, About, Statistics, Timeline,
   Indexing Databases and CTA
========================================= */

export const getResearchPublicationContent = async () => {
  return await axios.get(CONTENT_API);
};

export const updateResearchPublicationContent = async (data) => {
  return await axios.put(CONTENT_API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
