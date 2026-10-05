import React, { useEffect, useMemo, useState } from "react";

import {
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaExternalLinkAlt,
  FaDownload,
} from "react-icons/fa";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../../services/courseService";

import "./Course.css";

/* =========================================================
   CONSTANTS
========================================================= */

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const UG_COURSES = [
  "B.Tech Applied Science & Humanities",
  "B.Tech Biotechnology",
  "B.Tech Computer Science",
  "B.Tech Computer Science & Design",
  "B.Tech Computer Science & Engineering",
  "B.Tech Computer Science & Engineering - AI & ML",
  "B.Tech Electronics & Communication",
  "B.Tech 	Information Technology",
];

const PG_COURSES = ["MCA", "MBA", "M.Tech"];

/* =========================================================
   COMPONENT
========================================================= */

const Course = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("UG");

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({
    category: "UG",
    courseName: "",
    year: "1st Year",
    title: "",
    description: "",
    pdfLink: "",
    displayOrder: 0,
    status: "published",
  });

  /* =======================================================
     LOAD COURSES
  ======================================================= */

  const loadCourses = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getCourses();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setCourses(data);
    } catch (err) {
      console.error("Course loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load courses.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* =======================================================
     HANDLE FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     CHANGE CATEGORY
  ======================================================= */

  const handleCategoryChange = (event) => {
    const category = event.target.value;

    setForm((previous) => ({
      ...previous,

      category,

      courseName: "",
    }));
  };

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      category: activeCategory,
      courseName: "",
      year: "1st Year",
      title: "",
      description: "",
      pdfLink: "",
      displayOrder: 0,
      status: "published",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setEditingId(item._id);

    setActiveCategory(item.category || "UG");

    setForm({
      category: item.category || "UG",

      courseName: item.courseName || "",

      year: item.year || "1st Year",

      title: item.title || "",

      description: item.description || "",

      pdfLink: item.pdfLink || "",

      displayOrder: item.displayOrder ?? 0,

      status: item.status || "draft",
    });

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingId(null);

    setError("");
  };

  /* =======================================================
     VALIDATE
  ======================================================= */

  const validateForm = () => {
    if (!form.category) {
      setError("Please select UG or PG.");

      return false;
    }

    if (!form.courseName.trim()) {
      setError("Please select a course.");

      return false;
    }

    if (!form.year) {
      setError("Please select the year.");

      return false;
    }

    if (!form.title.trim()) {
      setError("Please enter the title.");

      return false;
    }

    if (!form.pdfLink.trim()) {
      setError("Please enter the PDF link.");

      return false;
    }

    try {
      new URL(form.pdfLink.trim());
    } catch {
      setError("Please enter a valid PDF URL.");

      return false;
    }

    return true;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        category: form.category.trim().toUpperCase(),

        courseName: form.courseName.trim(),

        year: form.year.trim(),

        title: form.title.trim(),

        description: form.description.trim(),

        pdfLink: form.pdfLink.trim(),

        displayOrder: Number(form.displayOrder) || 0,

        status: form.status,
      };

      if (editingId) {
        await updateCourse(editingId, payload);

        setMessage("Course updated successfully.");
      } else {
        await createCourse(payload);

        setMessage("Course created successfully.");
      }

      await loadCourses();

      setShowModal(false);

      setEditingId(null);
    } catch (err) {
      console.error("Course save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save course.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setMessage("");

      await deleteCourse(id);

      setMessage("Course deleted successfully.");

      await loadCourses();
    } catch (err) {
      console.error("Course delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete course.",
      );
    }
  };

  /* =======================================================
     CURRENT CATEGORY
  ======================================================= */

  const currentCourses = useMemo(() => {
    return courses
      .filter((item) => item.category === activeCategory)
      .sort((a, b) => {
        const courseCompare = String(a.courseName || "").localeCompare(
          String(b.courseName || ""),
        );

        if (courseCompare !== 0) {
          return courseCompare;
        }

        const yearOrder = {
          "1st Year": 1,
          "2nd Year": 2,
          "3rd Year": 3,
          "4th Year": 4,
        };

        const yearCompare =
          (yearOrder[a.year] || 99) - (yearOrder[b.year] || 99);

        if (yearCompare !== 0) {
          return yearCompare;
        }

        return Number(a.displayOrder || 0) - Number(b.displayOrder || 0);
      });
  }, [courses, activeCategory]);

  /* =======================================================
     GROUP BY COURSE
  ======================================================= */

  const groupedCourses = useMemo(() => {
    return currentCourses.reduce((groups, item) => {
      const name = item.courseName || "Unknown Course";

      if (!groups[name]) {
        groups[name] = [];
      }

      groups[name].push(item);

      return groups;
    }, {});
  }, [currentCourses]);

  /* =======================================================
     COURSE OPTIONS
  ======================================================= */

  const courseOptions = form.category === "UG" ? UG_COURSES : PG_COURSES;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="courseAdminPage">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="courseAdminHeader">
        <div className="courseAdminHeading">
          <div className="courseAdminIcon">
            <FaBookOpen />
          </div>

          <div>
            <span>ACADEMIC MANAGEMENT</span>

            <h1>Courses</h1>

            <p>Manage UG and PG courses year-wise PDF links.</p>
          </div>
        </div>

        <button type="button" className="courseAddButton" onClick={handleAdd}>
          <FaPlus />
          Add Course
        </button>
      </div>

      {/* ===================================================
          MESSAGE
      =================================================== */}

      {message && <div className="courseSuccess">{message}</div>}

      {error && !showModal && <div className="courseError">{error}</div>}

      {/* ===================================================
          CATEGORY TABS
      =================================================== */}

      <div className="courseCategoryTabs">
        <button
          type="button"
          className={activeCategory === "UG" ? "active" : ""}
          onClick={() => setActiveCategory("UG")}
        >
          Undergraduate
          <span>{courses.filter((item) => item.category === "UG").length}</span>
        </button>

        <button
          type="button"
          className={activeCategory === "PG" ? "active" : ""}
          onClick={() => setActiveCategory("PG")}
        >
          Postgraduate
          <span>{courses.filter((item) => item.category === "PG").length}</span>
        </button>
      </div>

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading ? (
        <div className="courseLoading">Loading courses...</div>
      ) : currentCourses.length === 0 ? (
        <div className="courseEmpty">
          <div className="courseEmptyIcon">
            <FaBookOpen />
          </div>

          <h2>No {activeCategory} Courses</h2>

          <p>Add a course to display it here.</p>

          <button type="button" onClick={handleAdd}>
            <FaPlus />
            Add Course
          </button>
        </div>
      ) : (
        <div className="courseGroups">
          {Object.entries(groupedCourses).map(([courseName, items]) => (
            <section className="courseGroup" key={courseName}>
              {/* =========================================
                    COURSE HEADER
                ========================================= */}

              <div className="courseGroupHeader">
                <div>
                  <span>
                    {activeCategory === "UG" ? "UNDERGRADUATE" : "POSTGRADUATE"}
                  </span>

                  <h2>{courseName}</h2>
                </div>

                <div className="courseYearCount">
                  {items.length} {items.length === 1 ? "Year" : "Years"}
                </div>
              </div>

              {/* =========================================
                    YEAR CARDS
                ========================================= */}

              <div className="courseYearGrid">
                {items.map((item) => (
                  <article className="courseYearCard" key={item._id}>
                    <div className="courseYearNumber">
                      <FaBookOpen />
                    </div>

                    <div className="courseYearInfo">
                      <span>{item.year}</span>

                      <h3>{item.title}</h3>

                      {item.description && <p>{item.description}</p>}

                      <div className="courseMeta">
                        <span>Order: {item.displayOrder ?? 0}</span>

                        <span
                          className={
                            item.status === "published"
                              ? "courseStatus published"
                              : "courseStatus draft"
                          }
                        >
                          {item.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    {/* =================================
                            ACTIONS
                        ================================= */}

                    <div className="courseActions">
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="courseViewButton"
                      >
                        <FaExternalLinkAlt />
                        View PDF
                      </a>

                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="courseDownloadButton"
                      >
                        <FaDownload />
                        PDF
                      </a>

                      <button
                        type="button"
                        className="courseEditButton"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="courseDeleteButton"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showModal && (
        <div
          className="courseModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="courseModal">
            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="courseModalHeader">
              <div>
                <span>{editingId ? "UPDATE COURSE" : "NEW COURSE"}</span>

                <h2>{editingId ? "Edit Course" : "Add Course"}</h2>
              </div>

              <button
                type="button"
                className="courseModalClose"
                onClick={handleClose}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* =============================================
                MODAL ERROR
            ============================================= */}

            {error && <div className="courseError">{error}</div>}

            {/* =============================================
                FORM
            ============================================= */}

            <form className="courseForm" onSubmit={handleSubmit}>
              {/* CATEGORY */}

              <div className="courseFormGroup">
                <label>Course Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="UG">Undergraduate (UG)</option>

                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>

              {/* COURSE */}

              <div className="courseFormGroup">
                <label>Course</label>

                <select
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>

                  {courseOptions.map((course) => (
                    <option value={course} key={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* YEAR */}

              <div className="courseFormGroup">
                <label>Year</label>

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>

                  {(form.category === "PG" ? YEARS.slice(0, 2) : YEARS).map(
                    (year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* TITLE */}

              <div className="courseFormGroup">
                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="MCA 1st Year"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="courseFormGroup">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter course details..."
                  rows="3"
                />
              </div>

              {/* PDF LINK */}

              <div className="courseFormGroup">
                <label>PDF Link</label>

                <input
                  type="url"
                  name="pdfLink"
                  value={form.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/course.pdf"
                  required
                />

                <small>
                  Paste the public PDF URL. The PDF itself is not uploaded to
                  the website.
                </small>
              </div>

              {/* DISPLAY ORDER */}

              <div className="courseFormGroup">
                <label>Display Order</label>

                <input
                  type="number"
                  name="displayOrder"
                  min="0"
                  value={form.displayOrder}
                  onChange={handleChange}
                />

                <small>Lower numbers appear first.</small>
              </div>

              {/* STATUS */}

              <div className="courseFormGroup">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="published">Published</option>

                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="courseModalActions">
                <button
                  type="button"
                  className="courseCancelButton"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="courseSaveButton"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Course"
                      : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
