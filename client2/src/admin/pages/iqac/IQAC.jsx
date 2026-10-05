import React, { useEffect, useState } from "react";
import {
  FaInfoCircle,
  FaListAlt,
  FaUsers,
  FaFilePdf,
  FaStar,
  FaAddressCard,
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import iqacAdminService from "../../services/iqacAdminService";
import "./iqacforpage.css";

const DEFAULT_DATA = {
  title: "IQAC",
  heroSubtitle: "Internal Quality Assurance Cell",
  breadcrumb: "Home / IQAC",
  heading: "Internal Quality Assurance Cell",
  description:
    "The Internal Quality Assurance Cell (IQAC) is established to promote continuous improvement in the academic and administrative quality of the institution. IQAC facilitates quality enhancement initiatives, documentation, feedback and systematic monitoring of institutional processes.",

  aboutHeading: "About IQAC",
  aboutDescription:
    "IQAC works as a quality enhancement mechanism within the institution. It encourages a consistent approach towards improving teaching-learning processes, academic practices, institutional activities and overall student development.",

  functionsHeading: "IQAC Functions",
  functionsDescription:
    "IQAC facilitates quality-related initiatives, documentation, feedback analysis, academic and administrative improvements and continuous quality monitoring across the institution.",

  membersHeading: "IQAC Composition",
  membersDescription:
    "The IQAC consists of representatives from different areas of the institution who contribute towards planning, monitoring and continuous quality improvement.",

  meetingsHeading: "IQAC Meetings",
  meetingsDescription:
    "IQAC meetings are conducted periodically to review quality initiatives, discuss institutional requirements and plan activities for continuous improvement.",

  initiativesHeading: "Quality Initiatives",
  initiativesDescription:
    "The institution undertakes various quality enhancement initiatives through systematic planning, implementation, review and continuous improvement.",

  documentsHeading: "IQAC Reports & Documents",

  coordinatorName: "IQAC Coordinator",
  coordinatorDesignation: "Coordinator, Internal Quality Assurance Cell",
  coordinatorEmail: "iqac@imsec.ac.in",
  coordinatorPhone: "+91-120-4081999",

  members: [],
  documents: [],
  initiatives: [],

  published: true,
};

const IQAC = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [activeTab, setActiveTab] = useState("basic");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await iqacAdminService.getIQACAdmin();

      const pageData = response?.data?.data || response?.data || response;

      if (pageData && typeof pageData === "object") {
        setData({
          ...DEFAULT_DATA,
          ...pageData,

          members: Array.isArray(pageData.members) ? pageData.members : [],

          documents: Array.isArray(pageData.documents)
            ? pageData.documents
            : [],

          initiatives: Array.isArray(pageData.initiatives)
            ? pageData.initiatives
            : [],
        });
      }
    } catch (err) {
      console.error("Load IQAC Error:", err);

      setError(err?.message || "Unable to load IQAC information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =====================================================
     BASIC FIELD UPDATE
  ===================================================== */

  const updateField = (field, value) => {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     MEMBERS
  ===================================================== */

  const addMember = () => {
    setData((previous) => ({
      ...previous,

      members: [
        ...(previous.members || []),
        {
          name: "",
          designation: "",
          role: "",
          department: "",
          order: (previous.members?.length || 0) + 1,
          isActive: true,
        },
      ],
    }));
  };

  const updateMember = (index, field, value) => {
    setData((previous) => {
      const members = [...(previous.members || [])];

      members[index] = {
        ...members[index],
        [field]: value,
      };

      return {
        ...previous,
        members,
      };
    });
  };

  const deleteMember = (index) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    setData((previous) => ({
      ...previous,

      members: previous.members.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  const addDocument = () => {
    setData((previous) => ({
      ...previous,

      documents: [
        ...(previous.documents || []),
        {
          title: "",
          heading: "",
          pdfUrl: "",
          published: true,
          order: (previous.documents?.length || 0) + 1,
        },
      ],
    }));
  };

  const updateDocument = (index, field, value) => {
    setData((previous) => {
      const documents = [...(previous.documents || [])];

      documents[index] = {
        ...documents[index],
        [field]: value,
      };

      return {
        ...previous,
        documents,
      };
    });
  };

  const deleteDocument = (index) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setData((previous) => ({
      ...previous,

      documents: previous.documents.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =====================================================
     INITIATIVES
  ===================================================== */

  const addInitiative = () => {
    setData((previous) => ({
      ...previous,

      initiatives: [
        ...(previous.initiatives || []),
        {
          title: "",
          description: "",
          order: (previous.initiatives?.length || 0) + 1,
          isActive: true,
        },
      ],
    }));
  };

  const updateInitiative = (index, field, value) => {
    setData((previous) => {
      const initiatives = [...(previous.initiatives || [])];

      initiatives[index] = {
        ...initiatives[index],
        [field]: value,
      };

      return {
        ...previous,
        initiatives,
      };
    });
  };

  const deleteInitiative = (index) => {
    if (!window.confirm("Are you sure you want to delete this initiative?")) {
      return;
    }

    setData((previous) => ({
      ...previous,

      initiatives: previous.initiatives.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...data,
      };

      const response = await iqacAdminService.updateIQAC(payload);

      const updatedData = response?.data?.data || response?.data;

      if (updatedData && typeof updatedData === "object") {
        setData({
          ...DEFAULT_DATA,
          ...updatedData,
          members: Array.isArray(updatedData.members)
            ? updatedData.members
            : [],
          documents: Array.isArray(updatedData.documents)
            ? updatedData.documents
            : [],
          initiatives: Array.isArray(updatedData.initiatives)
            ? updatedData.initiatives
            : [],
        });
      }

      setMessage("IQAC information updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Save IQAC Error:", err);

      setError(err?.message || "Unable to update IQAC information.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset IQAC to the default data? All admin changes will be replaced.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await iqacAdminService.resetIQAC();

      const resetData = response?.data?.data || response?.data;

      if (resetData && typeof resetData === "object") {
        setData({
          ...DEFAULT_DATA,
          ...resetData,

          members: Array.isArray(resetData.members) ? resetData.members : [],

          documents: Array.isArray(resetData.documents)
            ? resetData.documents
            : [],

          initiatives: Array.isArray(resetData.initiatives)
            ? resetData.initiatives
            : [],
        });
      } else {
        await loadData();
      }

      setMessage("IQAC has been reset to default data.");

      setActiveTab("basic");
    } catch (err) {
      console.error("Reset IQAC Error:", err);

      setError(err?.message || "Unable to reset IQAC.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="iqac-admin-loading">
        <div className="iqac-spinner" />
        <p>Loading IQAC information...</p>
      </div>
    );
  }

  /* =====================================================
     TABS
  ===================================================== */

  const tabs = [
    {
      id: "basic",
      label: "Basic Information",
      icon: <FaInfoCircle />,
    },
    {
      id: "sections",
      label: "Page Sections",
      icon: <FaListAlt />,
    },
    {
      id: "members",
      label: "IQAC Members",
      icon: <FaUsers />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FaFilePdf />,
    },
    {
      id: "initiatives",
      label: "Quality Initiatives",
      icon: <FaStar />,
    },
    {
      id: "contact",
      label: "Coordinator",
      icon: <FaAddressCard />,
    },
  ];

  return (
    <div className="iqac-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="iqac-admin-header">
        <div>
          <span className="iqac-admin-kicker">IQAC MANAGEMENT</span>

          <h1>Internal Quality Assurance Cell</h1>

          <p>
            Manage IQAC page content, members, documents and quality
            initiatives.
          </p>
        </div>

        <div className="iqac-admin-header-actions">
          <button
            type="button"
            className="iqac-reset-btn"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo />
            Reset Defaults
          </button>

          <button
            type="button"
            className="iqac-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {message && <div className="iqac-alert iqac-success">{message}</div>}

      {error && <div className="iqac-alert iqac-error">{error}</div>}

      {/* =================================================
          PUBLISH
      ================================================= */}

      <div className="iqac-publish-bar">
        <div>
          <strong>Public Page Status</strong>

          <span>
            {data.published
              ? "The IQAC page is visible to visitors."
              : "The IQAC page is currently unpublished."}
          </span>
        </div>

        <button
          type="button"
          className={
            data.published
              ? "iqac-publish-toggle active"
              : "iqac-publish-toggle"
          }
          onClick={() => updateField("published", !data.published)}
        >
          {data.published ? (
            <>
              <FaEye />
              Published
            </>
          ) : (
            <>
              <FaEyeSlash />
              Unpublished
            </>
          )}
        </button>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="iqac-admin-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={
              activeTab === tab.id ? "iqac-admin-tab active" : "iqac-admin-tab"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =================================================
          TAB CONTENT
      ================================================= */}

      <div className="iqac-admin-content">
        {/* =================================================
            BASIC
        ================================================= */}

        {activeTab === "basic" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading">
              <h2>Basic Information</h2>

              <p>Manage the main IQAC page title and introduction.</p>
            </div>

            <div className="iqac-form-grid">
              <div className="iqac-field">
                <label>Page Title</label>

                <input
                  value={data.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div className="iqac-field">
                <label>Hero Subtitle</label>

                <input
                  value={data.heroSubtitle || ""}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                />
              </div>

              <div className="iqac-field iqac-full">
                <label>Breadcrumb</label>

                <input
                  value={data.breadcrumb || ""}
                  onChange={(e) => updateField("breadcrumb", e.target.value)}
                />
              </div>

              <div className="iqac-field iqac-full">
                <label>Main Heading</label>

                <input
                  value={data.heading || ""}
                  onChange={(e) => updateField("heading", e.target.value)}
                />
              </div>

              <div className="iqac-field iqac-full">
                <label>Main Description</label>

                <textarea
                  rows="6"
                  value={data.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            PAGE SECTIONS
        ================================================= */}

        {activeTab === "sections" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading">
              <h2>Page Sections</h2>

              <p>
                Manage headings and descriptions displayed throughout the IQAC
                page.
              </p>
            </div>

            <div className="iqac-section-editor">
              {[
                ["aboutHeading", "aboutDescription", "About IQAC"],
                ["functionsHeading", "functionsDescription", "IQAC Functions"],
                ["membersHeading", "membersDescription", "IQAC Composition"],
                ["meetingsHeading", "meetingsDescription", "IQAC Meetings"],
                [
                  "initiativesHeading",
                  "initiativesDescription",
                  "Quality Initiatives",
                ],
                ["documentsHeading", null, "IQAC Reports & Documents"],
              ].map(([headingField, descriptionField, fallback], index) => (
                <div className="iqac-section-editor-card" key={headingField}>
                  <div className="iqac-section-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="iqac-section-editor-fields">
                    <div className="iqac-field">
                      <label>Section Heading</label>

                      <input
                        value={data[headingField] || fallback}
                        onChange={(e) =>
                          updateField(headingField, e.target.value)
                        }
                      />
                    </div>

                    {descriptionField && (
                      <div className="iqac-field">
                        <label>Section Description</label>

                        <textarea
                          rows="5"
                          value={data[descriptionField] || ""}
                          onChange={(e) =>
                            updateField(descriptionField, e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            MEMBERS
        ================================================= */}

        {activeTab === "members" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading iqac-heading-with-action">
              <div>
                <h2>IQAC Members</h2>

                <p>Add and manage members displayed on the public IQAC page.</p>
              </div>

              <button
                type="button"
                className="iqac-add-btn"
                onClick={addMember}
              >
                <FaPlus />
                Add Member
              </button>
            </div>

            <div className="iqac-list">
              {(data.members || []).length === 0 && (
                <div className="iqac-empty">No IQAC members added.</div>
              )}

              {(data.members || []).map((member, index) => (
                <div
                  className="iqac-item-card"
                  key={member._id || `member-${index}`}
                >
                  <div className="iqac-item-top">
                    <span className="iqac-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>Member {index + 1}</strong>

                    <button
                      type="button"
                      className="iqac-delete-btn"
                      onClick={() => deleteMember(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="iqac-form-grid">
                    <div className="iqac-field">
                      <label>Name</label>

                      <input
                        value={member.name || ""}
                        onChange={(e) =>
                          updateMember(index, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Designation</label>

                      <input
                        value={member.designation || ""}
                        onChange={(e) =>
                          updateMember(index, "designation", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Role</label>

                      <input
                        value={member.role || ""}
                        onChange={(e) =>
                          updateMember(index, "role", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Department</label>

                      <input
                        value={member.department || ""}
                        onChange={(e) =>
                          updateMember(index, "department", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Display Order</label>

                      <input
                        type="number"
                        min="1"
                        value={member.order || index + 1}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "order",
                            Number(e.target.value) || 1,
                          )
                        }
                      />
                    </div>

                    <div className="iqac-field iqac-checkbox-field">
                      <label>
                        <input
                          type="checkbox"
                          checked={member.isActive !== false}
                          onChange={(e) =>
                            updateMember(index, "isActive", e.target.checked)
                          }
                        />
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            DOCUMENTS
        ================================================= */}

        {activeTab === "documents" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading iqac-heading-with-action">
              <div>
                <h2>IQAC Reports & Documents</h2>

                <p>
                  Add PDF URLs for reports, minutes and other IQAC documents.
                </p>
              </div>

              <button
                type="button"
                className="iqac-add-btn"
                onClick={addDocument}
              >
                <FaPlus />
                Add Document
              </button>
            </div>

            <div className="iqac-list">
              {(data.documents || []).length === 0 && (
                <div className="iqac-empty">No documents added yet.</div>
              )}

              {(data.documents || []).map((document, index) => (
                <div
                  className="iqac-item-card"
                  key={document._id || `document-${index}`}
                >
                  <div className="iqac-item-top">
                    <span className="iqac-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>Document {index + 1}</strong>

                    <button
                      type="button"
                      className="iqac-delete-btn"
                      onClick={() => deleteDocument(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="iqac-form-grid">
                    <div className="iqac-field">
                      <label>Document Title</label>

                      <input
                        value={document.title || ""}
                        onChange={(e) =>
                          updateDocument(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Display Heading</label>

                      <input
                        value={document.heading || ""}
                        onChange={(e) =>
                          updateDocument(index, "heading", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field iqac-full">
                      <label>PDF URL</label>

                      <input
                        type="url"
                        placeholder="https://..."
                        value={document.pdfUrl || ""}
                        onChange={(e) =>
                          updateDocument(index, "pdfUrl", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Display Order</label>

                      <input
                        type="number"
                        min="1"
                        value={document.order || index + 1}
                        onChange={(e) =>
                          updateDocument(
                            index,
                            "order",
                            Number(e.target.value) || 1,
                          )
                        }
                      />
                    </div>

                    <div className="iqac-document-actions">
                      <label className="iqac-checkbox-label">
                        <input
                          type="checkbox"
                          checked={document.published !== false}
                          onChange={(e) =>
                            updateDocument(index, "published", e.target.checked)
                          }
                        />
                        Published
                      </label>

                      {document.pdfUrl && (
                        <a
                          href={document.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="iqac-view-pdf-btn"
                        >
                          <FaEye />
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            INITIATIVES
        ================================================= */}

        {activeTab === "initiatives" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading iqac-heading-with-action">
              <div>
                <h2>Quality Initiatives</h2>

                <p>
                  Manage quality enhancement initiatives displayed on the public
                  page.
                </p>
              </div>

              <button
                type="button"
                className="iqac-add-btn"
                onClick={addInitiative}
              >
                <FaPlus />
                Add Initiative
              </button>
            </div>

            <div className="iqac-list">
              {(data.initiatives || []).length === 0 && (
                <div className="iqac-empty">No quality initiatives added.</div>
              )}

              {(data.initiatives || []).map((initiative, index) => (
                <div
                  className="iqac-item-card"
                  key={initiative._id || `initiative-${index}`}
                >
                  <div className="iqac-item-top">
                    <span className="iqac-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>Initiative {index + 1}</strong>

                    <button
                      type="button"
                      className="iqac-delete-btn"
                      onClick={() => deleteInitiative(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="iqac-form-grid">
                    <div className="iqac-field iqac-full">
                      <label>Initiative Title</label>

                      <input
                        value={initiative.title || ""}
                        onChange={(e) =>
                          updateInitiative(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field iqac-full">
                      <label>Description</label>

                      <textarea
                        rows="5"
                        value={initiative.description || ""}
                        onChange={(e) =>
                          updateInitiative(index, "description", e.target.value)
                        }
                      />
                    </div>

                    <div className="iqac-field">
                      <label>Display Order</label>

                      <input
                        type="number"
                        min="1"
                        value={initiative.order || index + 1}
                        onChange={(e) =>
                          updateInitiative(
                            index,
                            "order",
                            Number(e.target.value) || 1,
                          )
                        }
                      />
                    </div>

                    <div className="iqac-field iqac-checkbox-field">
                      <label>
                        <input
                          type="checkbox"
                          checked={initiative.isActive !== false}
                          onChange={(e) =>
                            updateInitiative(
                              index,
                              "isActive",
                              e.target.checked,
                            )
                          }
                        />
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            COORDINATOR
        ================================================= */}

        {activeTab === "contact" && (
          <div className="iqac-tab-panel">
            <div className="iqac-panel-heading">
              <h2>IQAC Coordinator</h2>

              <p>Manage IQAC coordinator contact information.</p>
            </div>

            <div className="iqac-form-grid">
              <div className="iqac-field">
                <label>Coordinator Name</label>

                <input
                  value={data.coordinatorName || ""}
                  onChange={(e) =>
                    updateField("coordinatorName", e.target.value)
                  }
                />
              </div>

              <div className="iqac-field">
                <label>Designation</label>

                <input
                  value={data.coordinatorDesignation || ""}
                  onChange={(e) =>
                    updateField("coordinatorDesignation", e.target.value)
                  }
                />
              </div>

              <div className="iqac-field">
                <label>Email</label>

                <input
                  type="email"
                  value={data.coordinatorEmail || ""}
                  onChange={(e) =>
                    updateField("coordinatorEmail", e.target.value)
                  }
                />
              </div>

              <div className="iqac-field">
                <label>Phone</label>

                <input
                  value={data.coordinatorPhone || ""}
                  onChange={(e) =>
                    updateField("coordinatorPhone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          BOTTOM SAVE BAR
      ================================================= */}

      <div className="iqac-bottom-bar">
        <span>
          Changes are saved to the database only when you click
          <strong> Save Changes</strong>.
        </span>

        <button
          type="button"
          className="iqac-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default IQAC;
