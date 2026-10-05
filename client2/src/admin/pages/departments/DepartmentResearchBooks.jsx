import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBook,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  getDepartmentResearchBooks,
  deleteDepartmentResearchBook,
} from "../../services/departmentResearchBookService";

import "./department-research-books.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchBooks = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
     ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      /* -----------------------------------------------
         Get department by slug
         ----------------------------------------------- */

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult?.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;

      if (!departmentData?._id) {
        throw new Error("Department not found");
      }

      setDepartment(departmentData);

      /* -----------------------------------------------
         Get books / chapters
         ----------------------------------------------- */

      const booksResult = await getDepartmentResearchBooks(departmentData._id);

      setBooks(Array.isArray(booksResult?.data) ? booksResult.data : []);
    } catch (err) {
      console.error("Error loading research books:", err);

      setError(err.message || "Failed to load books / chapters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =========================================================
     ADD
     ========================================================= */

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/books-chapters/add`,
    );
  };

  /* =========================================================
     EDIT
     ========================================================= */

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/books-chapters/edit/${id}`,
    );
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book / chapter?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDepartmentResearchBook(id);

      await loadData();

      alert("Book / chapter deleted successfully.");
    } catch (err) {
      console.error("Delete research book error:", err);

      alert(err.message || "Failed to delete book / chapter.");
    }
  };

  /* =========================================================
     BACK
     ========================================================= */

  const handleBack = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(slug)}/research`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="drb-page">
        <div className="drb-loading">
          <div className="drb-spinner"></div>

          <h3>Loading Books / Chapters...</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error && !department) {
    return (
      <div className="drb-page">
        <div className="drb-error">
          <h3>Unable to Load Books / Chapters</h3>

          <p>{error}</p>

          <button type="button" className="drb-back-btn" onClick={handleBack}>
            <FaArrowLeft />
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <div className="drb-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drb-header">
        <div className="drb-header-left">
          <button
            type="button"
            className="drb-icon-back"
            onClick={handleBack}
            title="Back to Research"
          >
            <FaArrowLeft />
          </button>

          <div className="drb-title-icon">
            <FaBook />
          </div>

          <div>
            <h1>Books / Chapters</h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>

        <button type="button" className="drb-add-btn" onClick={handleAdd}>
          <FaPlus />
          Add Book / Chapter
        </button>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && <div className="drb-alert">{error}</div>}

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="drb-summary">
        <div className="drb-summary-card">
          <div className="drb-summary-icon">
            <FaBook />
          </div>

          <div>
            <span>Total Records</span>

            <strong>{books.length}</strong>
          </div>
        </div>

        <div className="drb-summary-card">
          <div className="drb-summary-icon">
            <FaFileAlt />
          </div>

          <div>
            <span>Active Records</span>

            <strong>
              {books.filter((item) => item.isActive === true).length}
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
          ===================================================== */}

      <div className="drb-card">
        <div className="drb-card-header">
          <div>
            <h2>Research Books & Chapters</h2>

            <p>Manage books and book chapters published by the department.</p>
          </div>

          <span className="drb-count">
            {books.length} {books.length === 1 ? "Record" : "Records"}
          </span>
        </div>

        {books.length === 0 ? (
          <div className="drb-empty">
            <div className="drb-empty-icon">
              <FaBook />
            </div>

            <h3>No Books / Chapters Found</h3>

            <p>Add the first research book or chapter for this department.</p>

            <button type="button" className="drb-empty-btn" onClick={handleAdd}>
              <FaPlus />
              Add Book / Chapter
            </button>
          </div>
        ) : (
          <div className="drb-table-wrapper">
            <table className="drb-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Book / Chapter</th>
                  <th>Type</th>
                  <th>Authors</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book, index) => (
                  <tr key={book._id}>
                    {/* Sr */}
                    <td>
                      <span className="drb-number">{index + 1}</span>
                    </td>

                    {/* Title */}
                    <td>
                      <div className="drb-title-cell">
                        <div className="drb-record-icon">
                          <FaBook />
                        </div>

                        <div>
                          <strong>{book.title || "Untitled"}</strong>

                          {book.bookTitle && <small>{book.bookTitle}</small>}

                          {book.chapterTitle && (
                            <small>Chapter: {book.chapterTitle}</small>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="drb-type">
                        {book.bookType || "Book"}
                      </span>
                    </td>

                    {/* Authors */}
                    <td>
                      <span className="drb-text">{book.authors || "—"}</span>
                    </td>

                    {/* Publisher */}
                    <td>
                      <span className="drb-text">{book.publisher || "—"}</span>
                    </td>

                    {/* ISBN */}
                    <td>
                      <span className="drb-text">{book.isbn || "—"}</span>
                    </td>

                    {/* Year */}
                    <td>
                      <span className="drb-year">{book.year || "—"}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={
                          book.isActive
                            ? "drb-status active"
                            : "drb-status inactive"
                        }
                      >
                        {book.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Order */}
                    <td>
                      <span className="drb-order">{book.order ?? 0}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="drb-actions">
                        {book.url && (
                          <a
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="drb-action view"
                            title="Open Publication"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}

                        {book.documentUrl && (
                          <a
                            href={book.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="drb-action document"
                            title="Open Document"
                          >
                            <FaFileAlt />
                          </a>
                        )}

                        <button
                          type="button"
                          className="drb-action edit"
                          onClick={() => handleEdit(book._id)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="drb-action delete"
                          onClick={() => handleDelete(book._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentResearchBooks;
