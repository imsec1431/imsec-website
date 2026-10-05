import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BOOK_API = `${API_BASE_URL}/api/research/books`;
const CONTENT_API = `${API_BASE_URL}/api/research/book-content`;

/* =========================================
   PUBLIC: GET ALL PUBLISHED BOOKS
========================================= */
export const getPublicBooks = async () => {
  try {
    const response = await axios.get(BOOK_API);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching public books:", error);
    throw error;
  }
};

/* =========================================
   PUBLIC: GET SINGLE BOOK DETAILS
========================================= */
export const getPublicBookById = async (id) => {
  try {
    const response = await axios.get(`${BOOK_API}/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching public book (${id}):`, error);
    throw error;
  }
};

/* =========================================
   PUBLIC: GET PAGE CONTENT (HERO, STATS, TIMELINE, ETC.)
========================================= */
export const getPublicBookContent = async () => {
  try {
    const response = await axios.get(CONTENT_API);
    return response.data?.data || response.data || {};
  } catch (error) {
    console.error("Error fetching public book content:", error);
    throw error;
  }
};
