import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const BOOK_API = `${API_BASE_URL}/api/research/books`;
const CONTENT_API = `${API_BASE_URL}/api/research/book-content`;

/* =========================================
   BOOKS CRUD
========================================= */
export const getBooks = async () => {
  return await axios.get(BOOK_API);
};

export const getBook = async (id) => {
  return await axios.get(`${BOOK_API}/${id}`);
};

export const addBook = async (data) => {
  return await axios.post(BOOK_API, data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateBook = async (id, data) => {
  return await axios.put(`${BOOK_API}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteBook = async (id) => {
  return await axios.delete(`${BOOK_API}/${id}`);
};

/* =========================================
   PAGE CONTENT (HERO, STATS, ETC.)
========================================= */
export const getBookContent = async () => {
  return await axios.get(CONTENT_API);
};

export const updateBookContent = async (data) => {
  return await axios.put(CONTENT_API, data, {
    headers: { "Content-Type": "application/json" },
  });
};
