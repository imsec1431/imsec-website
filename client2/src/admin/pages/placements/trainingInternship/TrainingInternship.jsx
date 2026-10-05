import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaUndo,
  FaImage,
  FaFilePdf,
} from "react-icons/fa";

import trainingInternshipAdminService from "../../../services/trainingInternshipAdminService";

import "./trainingInternship.css";

const DEFAULT_DATA = {
  hero: {
    title: "Training & Internship",
    subtitle: "Training and Internship Cell",
    breadcrumb: "Home / Training & Internship",
  },

  introduction: {
    heading: "Training & Internship",
    description:
      "The Training and Internship Cell facilitates training opportunities, internships and industry exposure for students.",
  },

  team: [
    {
      name: "Training & Internship Coordinator",
      designation: "Coordinator, Training & Internship Cell",
      qualification: "Faculty Coordinator",
      email: "",
      phone: "",
      photo: "",
      publicId: "",
      details:
        "Responsible for coordinating training and internship activities for students.",
      published: true,
      order: 1,
    },
  ],

  details: [
    {
      title: "Training",
      heading: "Student Training Programs",
      description:
        "Training programs are organized to enhance students' technical, professional and industry-oriented skills.",
      published: true,
      order: 1,
    },
    {
      title: "Internship",
      heading: "Internship Opportunities",
      description:
        "Students are encouraged to undertake internships to gain practical exposure and understand real-world industry practices.",
      published: true,
      order: 2,
    },
  ],

  documents: [],
};

const TrainingInternship = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [teamPhotos, setTeamPhotos] = useState({});

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await trainingInternshipAdminService.getTrainingInternshipAdmin();

      const pageData = response?.data?.data || response?.data || response;

      setData({
        ...DEFAULT_DATA,
        ...pageData,

        hero: {
          ...DEFAULT_DATA.hero,
          ...(pageData?.hero || {}),
        },

        introduction: {
          ...DEFAULT_DATA.introduction,
          ...(pageData?.introduction || {}),
        },

        team: Array.isArray(pageData?.team) ? pageData.team : DEFAULT_DATA.team,

        details: Array.isArray(pageData?.details)
          ? pageData.details
          : DEFAULT_DATA.details,

        documents: Array.isArray(pageData?.documents) ? pageData.documents : [],
      });
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to load Training & Internship data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     GENERIC MESSAGE
  ========================================================= */

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =========================================================
     HERO CHANGE
  ========================================================= */

  const handleHeroChange = (field, value) => {
    setData((prev) => ({
      ...prev,

      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     INTRODUCTION CHANGE
  ========================================================= */

  const handleIntroductionChange = (field, value) => {
    setData((prev) => ({
      ...prev,

      introduction: {
        ...prev.introduction,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     TEAM CHANGE
  ========================================================= */

  const handleTeamChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,

      team: prev.team.map((member, i) =>
        i === index
          ? {
              ...member,
              [field]: value,
            }
          : member,
      ),
    }));
  };

  /* =========================================================
     TEAM PHOTO
  ========================================================= */

  const handleTeamPhoto = (index, file) => {
    if (!file) return;

    setTeamPhotos((prev) => ({
      ...prev,
      [index]: file,
    }));
  };

  /* =========================================================
     ADD TEAM MEMBER
  ========================================================= */

  const addTeamMember = () => {
    setData((prev) => ({
      ...prev,

      team: [
        ...prev.team,

        {
          name: "",
          designation: "",
          qualification: "",
          email: "",
          phone: "",
          photo: "",
          publicId: "",
          details: "",
          published: true,
          order: prev.team.length + 1,
        },
      ],
    }));
  };

  /* =========================================================
     REMOVE TEAM MEMBER
  ========================================================= */

  const removeTeamMember = async (index) => {
    const member = data.team[index];

    if (member?._id && window.confirm("Delete this team member?")) {
      try {
        setSaving(true);

        await trainingInternshipAdminService.deleteTrainingTeamMember(
          member._id,
        );

        await loadData();

        showMessage("Team member deleted successfully.");
      } catch (err) {
        setError(err?.message || "Unable to delete team member.");
      } finally {
        setSaving(false);
      }

      return;
    }

    setData((prev) => ({
      ...prev,

      team: prev.team.filter((_, i) => i !== index),
    }));

    setTeamPhotos((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  /* =========================================================
     DETAILS CHANGE
  ========================================================= */

  const handleDetailChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,

      details: prev.details.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  /* =========================================================
     ADD DETAIL
  ========================================================= */

  const addDetail = () => {
    setData((prev) => ({
      ...prev,

      details: [
        ...prev.details,

        {
          title: "",
          heading: "",
          description: "",
          published: true,
          order: prev.details.length + 1,
        },
      ],
    }));
  };

  /* =========================================================
     REMOVE DETAIL
  ========================================================= */

  const removeDetail = (index) => {
    setData((prev) => ({
      ...prev,

      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     DOCUMENT CHANGE
  ========================================================= */

  const handleDocumentChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,

      documents: prev.documents.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  /* =========================================================
     ADD DOCUMENT
  ========================================================= */

  const addDocument = () => {
    setData((prev) => ({
      ...prev,

      documents: [
        ...prev.documents,

        {
          title: "",
          heading: "",
          pdfUrl: "",
          published: true,
          order: prev.documents.length + 1,
        },
      ],
    }));
  };

  /* =========================================================
     REMOVE DOCUMENT
  ========================================================= */

  const removeDocument = async (index) => {
    const document = data.documents[index];

    if (document?._id && window.confirm("Delete this document?")) {
      try {
        setSaving(true);

        await trainingInternshipAdminService.deleteTrainingDocument(
          document._id,
        );

        await loadData();

        showMessage("Document deleted successfully.");
      } catch (err) {
        setError(err?.message || "Unable to delete document.");
      } finally {
        setSaving(false);
      }

      return;
    }

    setData((prev) => ({
      ...prev,

      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      /* ================================================
         BASIC VALIDATION
      ================================================= */

      for (const member of data.team) {
        if (!member.name?.trim() || !member.designation?.trim()) {
          setError("Team member name and designation are required.");

          setSaving(false);
          return;
        }
      }

      for (const document of data.documents) {
        if (
          !document.title?.trim() ||
          !document.heading?.trim() ||
          !document.pdfUrl?.trim()
        ) {
          setError("Document title, heading and PDF URL are required.");

          setSaving(false);
          return;
        }
      }

      /* ================================================
         FORM DATA
      ================================================= */

      const formData = new FormData();

      const cleanData = {
        hero: data.hero,

        introduction: data.introduction,

        team: data.team.map((member, index) => ({
          ...member,
          order: index + 1,
        })),

        details: data.details.map((item, index) => ({
          ...item,
          order: index + 1,
        })),

        documents: data.documents.map((item, index) => ({
          ...item,
          order: index + 1,
        })),
      };

      formData.append("data", JSON.stringify(cleanData));

      /* ================================================
         TEAM PHOTOS
      ================================================= */

      Object.entries(teamPhotos).forEach(([index, file]) => {
        if (file) {
          formData.append(`teamPhoto_${index}`, file);
        }
      });

      await trainingInternshipAdminService.updateTrainingInternship(formData);

      setTeamPhotos({});

      await loadData();

      showMessage("Training & Internship information saved successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to save Training & Internship information.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset Training & Internship page to default data?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      await trainingInternshipAdminService.resetTrainingInternship();

      setTeamPhotos({});

      await loadData();

      showMessage("Page reset to default data.");
    } catch (err) {
      setError(err?.message || "Unable to reset page.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="training-admin-loading">
        Loading Training & Internship...
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="training-admin-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="training-admin-header">
        <div>
          <span className="training-admin-label">CMS MANAGEMENT</span>

          <h2>Training & Internship</h2>

          <p>Manage training, internship, team and related information.</p>
        </div>

        <div className="training-header-actions">
          <button
            type="button"
            className="training-reset-btn"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo />
            Reset Defaults
          </button>

          <button
            type="button"
            className="training-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && <div className="training-success-message">{message}</div>}

      {error && <div className="training-error-message">{error}</div>}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="training-admin-card">
        <div className="training-card-header">
          <div>
            <h3>Hero Section</h3>
            <p>Manage the main page heading.</p>
          </div>
        </div>

        <div className="training-form-grid">
          <div className="training-form-group">
            <label>Title</label>

            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => handleHeroChange("title", e.target.value)}
            />
          </div>

          <div className="training-form-group">
            <label>Subtitle</label>

            <input
              type="text"
              value={data.hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
            />
          </div>

          <div className="training-form-group training-full-width">
            <label>Breadcrumb</label>

            <input
              type="text"
              value={data.hero.breadcrumb}
              onChange={(e) => handleHeroChange("breadcrumb", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="training-admin-card">
        <div className="training-card-header">
          <div>
            <h3>Introduction</h3>
            <p>Manage introductory information.</p>
          </div>
        </div>

        <div className="training-form-grid">
          <div className="training-form-group">
            <label>Heading</label>

            <input
              type="text"
              value={data.introduction.heading}
              onChange={(e) =>
                handleIntroductionChange("heading", e.target.value)
              }
            />
          </div>

          <div className="training-form-group training-full-width">
            <label>Description</label>

            <textarea
              rows="5"
              value={data.introduction.description}
              onChange={(e) =>
                handleIntroductionChange("description", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
      ===================================================== */}

      <section className="training-admin-card">
        <div className="training-card-header">
          <div>
            <h3>Training & Internship Team</h3>
            <p>Add team members and upload their photos.</p>
          </div>

          <button
            type="button"
            className="training-add-btn"
            onClick={addTeamMember}
          >
            <FaPlus />
            Add Team Member
          </button>
        </div>

        <div className="training-team-list">
          {data.team.map((member, index) => (
            <div
              className="training-team-item"
              key={member._id || `team-${index}`}
            >
              <div className="training-team-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* =========================================
                    PHOTO
                ========================================== */}

              <div className="training-photo-box">
                {teamPhotos[index] ? (
                  <img
                    src={URL.createObjectURL(teamPhotos[index])}
                    alt={member.name}
                  />
                ) : member.photo ? (
                  <img src={member.photo} alt={member.name} />
                ) : (
                  <div className="training-photo-placeholder">
                    <FaImage />
                    <span>No Photo</span>
                  </div>
                )}

                <label className="training-photo-upload">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleTeamPhoto(index, e.target.files?.[0])
                    }
                  />
                </label>
              </div>

              {/* =========================================
                    DETAILS
                ========================================== */}

              <div className="training-team-fields">
                <div className="training-form-grid">
                  <div className="training-form-group">
                    <label>Name *</label>

                    <input
                      type="text"
                      value={member.name || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Designation *</label>

                    <input
                      type="text"
                      value={member.designation || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "designation", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Qualification</label>

                    <input
                      type="text"
                      value={member.qualification || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "qualification", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Email</label>

                    <input
                      type="email"
                      value={member.email || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "email", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Phone</label>

                    <input
                      type="text"
                      value={member.phone || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Status</label>

                    <label className="training-switch">
                      <input
                        type="checkbox"
                        checked={member.published !== false}
                        onChange={(e) =>
                          handleTeamChange(index, "published", e.target.checked)
                        }
                      />

                      <span>Published</span>
                    </label>
                  </div>

                  <div className="training-form-group training-full-width">
                    <label>Details</label>

                    <textarea
                      rows="4"
                      value={member.details || ""}
                      onChange={(e) =>
                        handleTeamChange(index, "details", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* =========================================
                    DELETE
                ========================================== */}

              <button
                type="button"
                className="training-delete-btn"
                onClick={() => removeTeamMember(index)}
                title="Delete team member"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <section className="training-admin-card">
        <div className="training-card-header">
          <div>
            <h3>Training & Internship Details</h3>

            <p>Manage training and internship sections.</p>
          </div>

          <button
            type="button"
            className="training-add-btn"
            onClick={addDetail}
          >
            <FaPlus />
            Add Section
          </button>
        </div>

        <div className="training-details-list">
          {data.details.map((item, index) => (
            <div
              className="training-detail-item"
              key={item._id || `detail-${index}`}
            >
              <div className="training-detail-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="training-detail-fields">
                <div className="training-form-grid">
                  <div className="training-form-group">
                    <label>Title</label>

                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label>Heading</label>

                    <input
                      type="text"
                      value={item.heading || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "heading", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group training-full-width">
                    <label>Description</label>

                    <textarea
                      rows="4"
                      value={item.description || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="training-form-group">
                    <label className="training-switch">
                      <input
                        type="checkbox"
                        checked={item.published !== false}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "published",
                            e.target.checked,
                          )
                        }
                      />

                      <span>Published</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="training-delete-btn"
                onClick={() => removeDetail(index)}
                title="Remove section"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      <section className="training-admin-card">
        <div className="training-card-header">
          <div>
            <h3>Documents & Links</h3>

            <p>Add PDF documents or external links.</p>
          </div>

          <button
            type="button"
            className="training-add-btn"
            onClick={addDocument}
          >
            <FaPlus />
            Add Document
          </button>
        </div>

        {data.documents.length === 0 ? (
          <div className="training-empty-state">
            <FaFilePdf />

            <h4>No Documents Added</h4>

            <p>Add training or internship related documents here.</p>
          </div>
        ) : (
          <div className="training-documents-list">
            {data.documents.map((document, index) => (
              <div
                className="training-document-item"
                key={document._id || `document-${index}`}
              >
                <div className="training-document-icon">
                  <FaFilePdf />
                </div>

                <div className="training-document-fields">
                  <div className="training-form-grid">
                    <div className="training-form-group">
                      <label>Title</label>

                      <input
                        type="text"
                        value={document.title || ""}
                        onChange={(e) =>
                          handleDocumentChange(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="training-form-group">
                      <label>Heading</label>

                      <input
                        type="text"
                        value={document.heading || ""}
                        onChange={(e) =>
                          handleDocumentChange(index, "heading", e.target.value)
                        }
                      />
                    </div>

                    <div className="training-form-group training-full-width">
                      <label>PDF / Document URL</label>

                      <input
                        type="url"
                        value={document.pdfUrl || ""}
                        placeholder="https://..."
                        onChange={(e) =>
                          handleDocumentChange(index, "pdfUrl", e.target.value)
                        }
                      />
                    </div>

                    <div className="training-form-group">
                      <label className="training-switch">
                        <input
                          type="checkbox"
                          checked={document.published !== false}
                          onChange={(e) =>
                            handleDocumentChange(
                              index,
                              "published",
                              e.target.checked,
                            )
                          }
                        />

                        <span>Published</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="training-delete-btn"
                  onClick={() => removeDocument(index)}
                  title="Delete document"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          BOTTOM SAVE
      ===================================================== */}

      <div className="training-bottom-actions">
        <button
          type="button"
          className="training-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Training & Internship"}
        </button>
      </div>
    </div>
  );
};

export default TrainingInternship;
