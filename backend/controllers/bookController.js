import Book from "../models/Book.js";

const getBookData = (body) => ({
  title: body.title?.trim(),
  authors: body.authors?.trim(),
  department: body.department?.trim() || "",
  type: body.type || "Book",
  publisher: body.publisher?.trim(),
  publicationYear: Number(body.publicationYear),
  isbn: body.isbn?.trim() || "",
  doi: body.doi?.trim() || "",
  bookLink: body.bookLink?.trim() || "",
  status: body.status || "Active",
  displayOrder: Number(body.displayOrder) || 1,
});

/* =========================================
   GET ALL BOOKS (ADMIN / PUBLIC)
========================================= */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   GET SINGLE BOOK BY ID
========================================= */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   CREATE BOOK
========================================= */
export const createBook = async (req, res) => {
  try {
    const bookData = getBookData(req.body);
    const newBook = await Book.create(bookData);
    res
      .status(201)
      .json({
        success: true,
        data: newBook,
        message: "Book added successfully",
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================================
   UPDATE BOOK
========================================= */
export const updateBook = async (req, res) => {
  try {
    const bookData = getBookData(req.body);
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        data: updatedBook,
        message: "Book updated successfully",
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================================
   DELETE BOOK
========================================= */
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
