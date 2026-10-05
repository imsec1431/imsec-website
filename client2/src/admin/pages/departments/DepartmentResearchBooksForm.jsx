import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaBook, FaTimes } from "react-icons/fa";

import {
  getDepartmentResearchBookById,
  createDepartmentResearchBook,
  updateDepartmentResearchBook,
} from "../../services/departmentResearchBookService";

import "./department-research-books-form.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentResearchBooksForm = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [department, setDepartment] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    bookType: "Book",
    bookTitle: "",
    chapterTitle: "",
    publisher: "",
    publicationPlace: "",
    isbn: "",
    edition: "",
    year: "",
    pages: "",
    description: "",
    url: "",
    documentUrl: "",
    image: "",
    publicId: "",
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + BOOK
     ========================================================= */

  useEffect(() => {
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
           Get book / chapter in edit mode
           ----------------------------------------------- */

        if (isEditMode) {
          const result = await getDepartmentResearchBookById(id);

          const book = result?.data;

          if (!book) {
            throw new Error("Research book / chapter not found");
          }

          setFormData({
            title: book.title || "",
            authors: book.authors || "",
            bookType: book.bookType || "Book",
            bookTitle: book.bookTitle || "",
            chapterTitle: book.chapterTitle || "",
            publisher: book.publisher || "",
            publicationPlace: book.publicationPlace || "",
            isbn: book.isbn || "",
            edition: book.edition || "",
            year: book.year || "",
            pages: book.pages || "",
            description: book.description || "",
            url: book.url || "",
            documentUrl: book.documentUrl || "",
            image: book.image || "",
            publicId: book.publicId || "",
            order: book.order ?? 0,
            isActive: typeof book.isActive === "boolean" ? book.isActive : true,
          });
        }
      } catch (err) {
        console.error("Error loading research book form:", err);

        setError(err.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug, id, isEditMode]);

  /* =========================================================
     HANDLE CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!department?._id) {
      alert("Department information is missing.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter the book / chapter title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        department: department._id,

        title: formData.title.trim(),

        authors: formData.authors.trim(),

        bookType: formData.bookType.trim() || "Book",

        bookTitle: formData.bookTitle.trim(),

        chapterTitle: formData.chapterTitle.trim(),

        publisher: formData.publisher.trim(),

        publicationPlace: formData.publicationPlace.trim(),

        isbn: formData.isbn.trim(),

        edition: formData.edition.trim(),

        year: formData.year.trim(),

        pages: formData.pages.trim(),

        description: formData.description.trim(),

        url: formData.url.trim(),

        documentUrl: formData.documentUrl.trim(),

        image: formData.image.trim(),

        publicId: formData.publicId.trim(),

        order: Number(formData.order) || 0,

        isActive: Boolean(formData.isActive),
      };

      if (isEditMode) {
        await updateDepartmentResearchBook(id, payload);
      } else {
        await createDepartmentResearchBook(payload);
      }

      navigate(
        `/imsec-control-center/departments/${encodeURIComponent(
          slug,
        )}/research/books-chapters`,
      );
    } catch (err) {
      console.error("Error saving research book:", err);

      setError(err.message || "Failed to save book / chapter");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL / BACK
     ========================================================= */

  const handleCancel = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/research/books-chapters`,
    );
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="drbf-page">
        <div className="drbf-loading">
          <div className="drbf-spinner"></div>

          <h3>{isEditMode ? "Loading Book / Chapter..." : "Loading..."}</h3>

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
      <div className="drbf-page">
        <div className="drbf-error">
          <h3>Unable to Load Form</h3>

          <p>{error}</p>

          <button
            type="button"
            className="drbf-secondary-btn"
            onClick={handleCancel}
          >
            <FaArrowLeft />
            Back to Books / Chapters
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <div className="drbf-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="drbf-header">
        <div className="drbf-header-left">
          <button
            type="button"
            className="drbf-back-btn"
            onClick={handleCancel}
            title="Back"
          >
            <FaArrowLeft />
          </button>

          <div className="drbf-icon">
            <FaBook />
          </div>

          <div>
            <h1>{isEditMode ? "Edit Book / Chapter" : "Add Book / Chapter"}</h1>

            <p>{department?.name || "Department"} • Department Research</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR ALERT
          ===================================================== */}

      {error && <div className="drbf-alert">{error}</div>}

      {/* =====================================================
          FORM
          ===================================================== */}

      <form className="drbf-form" onSubmit={handleSubmit}>
        {/* ===================================================
            BASIC INFORMATION
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-card-header">
            <div>
              <h2>Publication Information</h2>

              <p>Enter the basic information about the book or chapter.</p>
            </div>
          </div>

          <div className="drbf-grid">
            {/* Title */}
            <div className="drbf-field drbf-full">
              <label htmlFor="title">
                Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book / chapter title"
                required
              />
            </div>

            {/* Type */}
            <div className="drbf-field">
              <label htmlFor="bookType">Publication Type</label>

              <select
                id="bookType"
                name="bookType"
                value={formData.bookType}
                onChange={handleChange}
              >
                <option value="Book">Book</option>

                <option value="Chapter">Book Chapter</option>
              </select>
            </div>

            {/* Authors */}
            <div className="drbf-field">
              <label htmlFor="authors">Authors</label>

              <input
                id="authors"
                name="authors"
                type="text"
                value={formData.authors}
                onChange={handleChange}
                placeholder="Enter author names"
              />
            </div>

            {/* Book Title */}
            <div className="drbf-field">
              <label htmlFor="bookTitle">Book Title</label>

              <input
                id="bookTitle"
                name="bookTitle"
                type="text"
                value={formData.bookTitle}
                onChange={handleChange}
                placeholder="Enter book title"
              />
            </div>

            {/* Chapter Title */}
            <div className="drbf-field">
              <label htmlFor="chapterTitle">Chapter Title</label>

              <input
                id="chapterTitle"
                name="chapterTitle"
                type="text"
                value={formData.chapterTitle}
                onChange={handleChange}
                placeholder="Enter chapter title"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            PUBLICATION DETAILS
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-card-header">
            <div>
              <h2>Publication Details</h2>

              <p>Add publisher and bibliographic information.</p>
            </div>
          </div>

          <div className="drbf-grid">
            {/* Publisher */}
            <div className="drbf-field">
              <label htmlFor="publisher">Publisher</label>

              <input
                id="publisher"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher"
              />
            </div>

            {/* Publication Place */}
            <div className="drbf-field">
              <label htmlFor="publicationPlace">Publication Place</label>

              <input
                id="publicationPlace"
                name="publicationPlace"
                type="text"
                value={formData.publicationPlace}
                onChange={handleChange}
                placeholder="Enter publication place"
              />
            </div>

            {/* ISBN */}
            <div className="drbf-field">
              <label htmlFor="isbn">ISBN</label>

              <input
                id="isbn"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
              />
            </div>

            {/* Edition */}
            <div className="drbf-field">
              <label htmlFor="edition">Edition</label>

              <input
                id="edition"
                name="edition"
                type="text"
                value={formData.edition}
                onChange={handleChange}
                placeholder="e.g. 2nd Edition"
              />
            </div>

            {/* Year */}
            <div className="drbf-field">
              <label htmlFor="year">Publication Year</label>

              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2026"
              />
            </div>

            {/* Pages */}
            <div className="drbf-field">
              <label htmlFor="pages">Pages</label>

              <input
                id="pages"
                name="pages"
                type="text"
                value={formData.pages}
                onChange={handleChange}
                placeholder="e.g. 120-135"
              />
            </div>

            {/* Order */}
            <div className="drbf-field">
              <label htmlFor="order">Display Order</label>

              <input
                id="order"
                name="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-card-header">
            <div>
              <h2>Description</h2>

              <p>Add a short description or publication details.</p>
            </div>
          </div>

          <div className="drbf-field">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="7"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description..."
            />
          </div>
        </div>

        {/* ===================================================
            LINKS
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-card-header">
            <div>
              <h2>Links</h2>

              <p>Add publication and document links.</p>
            </div>
          </div>

          <div className="drbf-grid">
            {/* Publication URL */}
            <div className="drbf-field">
              <label htmlFor="url">Publication URL</label>

              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Document URL */}
            <div className="drbf-field">
              <label htmlFor="documentUrl">Document / PDF URL</label>

              <input
                id="documentUrl"
                name="documentUrl"
                type="url"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            MEDIA
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-card-header">
            <div>
              <h2>Media</h2>

              <p>Add publication image details.</p>
            </div>
          </div>

          <div className="drbf-grid">
            {/* Image */}
            <div className="drbf-field">
              <label htmlFor="image">Image URL</label>

              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            {/* Public ID */}
            <div className="drbf-field">
              <label htmlFor="publicId">Cloudinary Public ID</label>

              <input
                id="publicId"
                name="publicId"
                type="text"
                value={formData.publicId}
                onChange={handleChange}
                placeholder="Enter Cloudinary public ID"
              />
            </div>
          </div>

          {formData.image && (
            <div className="drbf-preview">
              <span>Image Preview</span>

              <img
                src={formData.image}
                alt="Book preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* ===================================================
            STATUS
            =================================================== */}

        <div className="drbf-card">
          <div className="drbf-status-row">
            <div>
              <h2>Publication Status</h2>

              <p>Set whether this record should be visible.</p>
            </div>

            <label className="drbf-switch">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span className="drbf-slider"></span>
            </label>
          </div>

          <div
            className={
              formData.isActive
                ? "drbf-status-text active"
                : "drbf-status-text inactive"
            }
          >
            {formData.isActive
              ? "Publication is Active"
              : "Publication is Inactive"}
          </div>
        </div>

        {/* ===================================================
            ACTIONS
            =================================================== */}

        <div className="drbf-actions">
          <button
            type="button"
            className="drbf-cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            <FaTimes />
            Cancel
          </button>

          <button type="submit" className="drbf-save-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="drbf-mini-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEditMode ? "Update Book / Chapter" : "Save Book / Chapter"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentResearchBooksForm;
