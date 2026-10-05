import React, { useEffect, useState } from "react";

import "./IMSGroupForm.css";

import { getToken } from "../../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/ims-group`;

const emptyInstitution = {
  name: "",
  location: "",
  courses: [""],
  description: "",
  website: "",
  image: "",
};

const initialForm = {
  title: "IMS Group of Institutions",

  subtitle: "",

  stats: {
    campuses: "3",
    students: "8500+",
    programs: "20+",
    experience: "30 Years",
  },

  institutions: [],

  isPublished: true,
};

const IMSGroupForm = () => {
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /*=========================================
  LOAD
  =========================================*/

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Admin session not found. Please login again.");
        }

        const response = await fetch(`${API_URL}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load IMS Group");
        }

        if (result?.data) {
          setForm({
            title: result.data.title || "IMS Group of Institutions",

            subtitle: result.data.subtitle || "",

            stats: {
              campuses: result.data.stats?.campuses || "3",

              students: result.data.stats?.students || "8500+",

              programs: result.data.stats?.programs || "20+",

              experience: result.data.stats?.experience || "30 Years",
            },

            institutions: result.data.institutions || [],

            isPublished: result.data.isPublished !== false,
          });
        }
      } catch (err) {
        console.error("IMS Group loading error:", err);

        setError(err?.message || "Failed to load IMS Group");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, []);

  /*=========================================
  BASIC FIELD
  =========================================*/

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*=========================================
  STATS
  =========================================*/

  const handleStatChange = (name, value) => {
    setForm((prev) => ({
      ...prev,

      stats: {
        ...prev.stats,
        [name]: value,
      },
    }));
  };

  /*=========================================
  INSTITUTION FIELD
  =========================================*/

  const handleInstitutionChange = (index, field, value) => {
    setForm((prev) => {
      const institutions = [...prev.institutions];

      institutions[index] = {
        ...institutions[index],
        [field]: value,
      };

      return {
        ...prev,
        institutions,
      };
    });
  };

  /*=========================================
  COURSE
  =========================================*/

  const handleCourseChange = (institutionIndex, courseIndex, value) => {
    setForm((prev) => {
      const institutions = [...prev.institutions];

      const courses = [...(institutions[institutionIndex].courses || [])];

      courses[courseIndex] = value;

      institutions[institutionIndex] = {
        ...institutions[institutionIndex],
        courses,
      };

      return {
        ...prev,
        institutions,
      };
    });
  };

  /*=========================================
  ADD INSTITUTION
  =========================================*/

  const addInstitution = () => {
    setForm((prev) => ({
      ...prev,

      institutions: [
        ...prev.institutions,
        {
          ...emptyInstitution,
          courses: [""],
        },
      ],
    }));
  };

  /*=========================================
  REMOVE INSTITUTION
  =========================================*/

  const removeInstitution = (index) => {
    setForm((prev) => ({
      ...prev,

      institutions: prev.institutions.filter((_, i) => i !== index),
    }));
  };

  /*=========================================
  ADD COURSE
  =========================================*/

  const addCourse = (institutionIndex) => {
    setForm((prev) => {
      const institutions = [...prev.institutions];

      institutions[institutionIndex] = {
        ...institutions[institutionIndex],

        courses: [...(institutions[institutionIndex].courses || []), ""],
      };

      return {
        ...prev,
        institutions,
      };
    });
  };

  /*=========================================
  REMOVE COURSE
  =========================================*/

  const removeCourse = (institutionIndex, courseIndex) => {
    setForm((prev) => {
      const institutions = [...prev.institutions];

      institutions[institutionIndex] = {
        ...institutions[institutionIndex],

        courses: (institutions[institutionIndex].courses || []).filter(
          (_, i) => i !== courseIndex,
        ),
      };

      return {
        ...prev,
        institutions,
      };
    });
  };

  /*=========================================
  SAVE
  =========================================*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin session not found. Please login again.");
      }

      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to save IMS Group");
      }

      if (result?.data) {
        setForm(result.data);
      }

      setMessage("IMS Group content saved successfully.");
    } catch (err) {
      console.error("IMS Group save error:", err);

      setError(err?.message || "Failed to save IMS Group");
    } finally {
      setSaving(false);
    }
  };

  /*=========================================
  LOADING
  =========================================*/

  if (loading) {
    return (
      <div className="ims-group-admin">
        <div className="ims-group-loading">
          <h2>Loading IMS Group...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /*=========================================
  RENDER
  =========================================*/

  return (
    <div className="ims-group-admin">
      <div className="ims-group-header">
        <h2>IMS Group of Institutions</h2>

        <p>
          Manage all content displayed on the public IMS Group of Institutions
          page.
        </p>
      </div>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}

      <form className="ims-group-form" onSubmit={handleSubmit}>
        {/*===================================
        PAGE TITLE
        ===================================*/}

        <div className="form-group">
          <label>Page Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/*===================================
        SUBTITLE
        ===================================*/}

        <div className="form-group">
          <label>Subtitle</label>

          <textarea
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            rows="4"
            placeholder="Enter page introduction..."
          />
        </div>

        {/*===================================
        STATISTICS
        ===================================*/}

        <div className="admin-section">
          <div className="admin-section-title">
            <h3>Group Statistics</h3>

            <p>
              These numbers appear in the statistics section of the public page.
            </p>
          </div>

          <div className="stats-grid">
            <div className="form-group">
              <label>Campuses</label>

              <input
                type="text"
                value={form.stats.campuses}
                onChange={(e) => handleStatChange("campuses", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Students</label>

              <input
                type="text"
                value={form.stats.students}
                onChange={(e) => handleStatChange("students", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Programs</label>

              <input
                type="text"
                value={form.stats.programs}
                onChange={(e) => handleStatChange("programs", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Academic Excellence</label>

              <input
                type="text"
                value={form.stats.experience}
                onChange={(e) => handleStatChange("experience", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/*===================================
        INSTITUTIONS
        ===================================*/}

        <div className="admin-section">
          <div className="admin-section-title">
            <h3>Institutions</h3>

            <p>Add and manage every institution in the IMS Group.</p>
          </div>

          {form.institutions.map((institution, institutionIndex) => (
            <div
              className="institution-editor"
              key={institution._id || institutionIndex}
            >
              <div className="institution-editor-header">
                <h4>Institution {institutionIndex + 1}</h4>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeInstitution(institutionIndex)}
                >
                  Remove
                </button>
              </div>

              {/* NAME */}

              <div className="form-group">
                <label>Institution Name</label>

                <input
                  type="text"
                  value={institution.name || ""}
                  onChange={(e) =>
                    handleInstitutionChange(
                      institutionIndex,
                      "name",
                      e.target.value,
                    )
                  }
                  placeholder="Institution name"
                />
              </div>

              {/* LOCATION */}

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  value={institution.location || ""}
                  onChange={(e) =>
                    handleInstitutionChange(
                      institutionIndex,
                      "location",
                      e.target.value,
                    )
                  }
                  placeholder="Location"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="form-group">
                <label>Description</label>

                <textarea
                  value={institution.description || ""}
                  onChange={(e) =>
                    handleInstitutionChange(
                      institutionIndex,
                      "description",
                      e.target.value,
                    )
                  }
                  rows="4"
                  placeholder="Institution description..."
                />
              </div>

              {/* WEBSITE */}

              <div className="form-group">
                <label>Website</label>

                <input
                  type="text"
                  value={institution.website || ""}
                  onChange={(e) =>
                    handleInstitutionChange(
                      institutionIndex,
                      "website",
                      e.target.value,
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              {/* IMAGE */}

              <div className="form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  value={institution.image || ""}
                  onChange={(e) =>
                    handleInstitutionChange(
                      institutionIndex,
                      "image",
                      e.target.value,
                    )
                  }
                  placeholder="Optional image URL"
                />
              </div>

              {/* COURSES */}

              <div className="courses-editor">
                <div className="courses-header">
                  <h5>Courses Offered</h5>

                  <button
                    type="button"
                    onClick={() => addCourse(institutionIndex)}
                  >
                    + Add Course
                  </button>
                </div>

                {(institution.courses || []).map((course, courseIndex) => (
                  <div className="course-row" key={courseIndex}>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) =>
                        handleCourseChange(
                          institutionIndex,
                          courseIndex,
                          e.target.value,
                        )
                      }
                      placeholder="Course name"
                    />

                    <button
                      type="button"
                      className="remove-course"
                      onClick={() =>
                        removeCourse(institutionIndex, courseIndex)
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-institution"
            onClick={addInstitution}
          >
            + Add Institution
          </button>
        </div>

        {/*===================================
        PUBLISH
        ===================================*/}

        <label className="publish-toggle">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />

          <span>Publish this page</span>
        </label>

        {/*===================================
        SAVE
        ===================================*/}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save IMS Group"}
        </button>
      </form>
    </div>
  );
};

export default IMSGroupForm;
