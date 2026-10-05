import React, { useEffect, useState } from "react";
import {
  FaHandshake,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaLink,
  FaCertificate,
  FaEye,
  FaSave,
  FaUndo,
  FaTimes,
} from "react-icons/fa";

import industryAcademicsAdminService from "../../services/industryAcademicsAdminService";
import "./industryAcademics.css";

const emptyItem = {
  title: "",
  photoUrl: "",
  photoPublicId: "",
  linkUrl: "",
  description: "",
  certificateUrl: "",
  isActive: true,
  order: 1,
};

const IndustryAcademicsCollaboration = () => {
  const [pageData, setPageData] = useState({
    title: "Industry Academics Collaboration",
    description: "Industry-academia collaboration and Centres of Excellence.",
    items: [],
    published: true,
  });

  const [formData, setFormData] = useState(emptyItem);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD
  // --------------------------------------------------

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await industryAcademicsAdminService.getIndustryAcademicsAdmin();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setPageData({
          title: data.title || "Industry Academics Collaboration",

          description: data.description || "",

          items: Array.isArray(data.items) ? data.items : [],

          published: data.published !== undefined ? data.published : true,
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Unable to load Industry Academics Collaboration.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // PAGE DATA
  // --------------------------------------------------

  const handlePageChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPageData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  // --------------------------------------------------
  // ITEM FORM
  // --------------------------------------------------

  const handleItemChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  const openAddForm = () => {
    setFormData({
      ...emptyItem,
      order: pageData.items.length + 1,
    });

    setEditIndex(null);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const openEditForm = (index) => {
    const item = pageData.items[index];

    setFormData({
      title: item.title || "",
      photoUrl: item.photoUrl || "",
      photoPublicId: item.photoPublicId || "",
      linkUrl: item.linkUrl || "",
      description: item.description || "",
      certificateUrl: item.certificateUrl || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || index + 1,
      _id: item._id,
    });

    setEditIndex(index);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const closeForm = () => {
    setFormData(emptyItem);
    setEditIndex(null);
    setShowForm(false);
  };

  // --------------------------------------------------
  // PHOTO UPLOAD
  // --------------------------------------------------

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const response =
        await industryAcademicsAdminService.uploadIndustryAcademicsPhoto(file);

      const uploaded = response?.data?.data || response?.data || response;

      if (uploaded?.photoUrl) {
        setFormData((prev) => ({
          ...prev,
          photoUrl: uploaded.photoUrl,
          photoPublicId: uploaded.photoPublicId || "",
        }));

        setMessage("Photo uploaded successfully.");
      }
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to upload photo.");
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  // --------------------------------------------------
  // ADD / UPDATE ITEM
  // --------------------------------------------------

  const handleItemSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title / Name is required.");
      return;
    }

    const item = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      linkUrl: formData.linkUrl.trim(),
      certificateUrl: formData.certificateUrl.trim(),
    };

    if (editIndex !== null) {
      const updatedItems = [...pageData.items];

      updatedItems[editIndex] = item;

      setPageData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      setPageData((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));
    }

    closeForm();
    setMessage(
      editIndex !== null
        ? "Entry updated. Click Save Changes to store it."
        : "Entry added. Click Save Changes to store it.",
    );
  };

  // --------------------------------------------------
  // DELETE ITEM
  // --------------------------------------------------

  const handleDelete = async (index) => {
    const item = pageData.items[index];

    const confirmed = window.confirm(`Delete "${item.title}"?`);

    if (!confirmed) return;

    // Delete Cloudinary image if available
    if (item.photoPublicId) {
      try {
        await industryAcademicsAdminService.deleteIndustryAcademicsPhoto(
          item.photoPublicId,
        );
      } catch (err) {
        console.error("Photo deletion error:", err);
      }
    }

    setPageData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));

    setMessage("Entry deleted. Click Save Changes to store the changes.");
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await industryAcademicsAdminService.updateIndustryAcademics(pageData);

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setPageData({
          title: data.title || "Industry Academics Collaboration",

          description: data.description || "",

          items: Array.isArray(data.items) ? data.items : [],

          published: data.published !== undefined ? data.published : true,
        });
      }

      setMessage("Industry Academics Collaboration saved successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all Industry Academics Collaboration data to defaults?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setError("");
      setMessage("");

      const response =
        await industryAcademicsAdminService.resetIndustryAcademics();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setPageData({
          title: data.title || "Industry Academics Collaboration",

          description: data.description || "",

          items: Array.isArray(data.items) ? data.items : [],

          published: data.published !== undefined ? data.published : true,
        });
      }

      closeForm();

      setMessage("Data reset to defaults successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset data.");
    } finally {
      setResetting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="industry-admin-page">
        <div className="industry-loading">
          Loading Industry Academics Collaboration...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="industry-admin-page">
      {/* HEADER */}

      <div className="industry-admin-header">
        <div className="industry-header-left">
          <div className="industry-header-icon">
            <FaHandshake />
          </div>

          <div>
            <h1>Industry Academics Collaboration</h1>

            <p>Manage collaborations and Centres of Excellence</p>
          </div>
        </div>

        <div className="industry-header-actions">
          <button
            type="button"
            className="industry-reset-btn"
            onClick={handleReset}
            disabled={resetting}
          >
            <FaUndo />
            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="button"
            className="industry-add-btn"
            onClick={openAddForm}
          >
            <FaPlus />
            Add New
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      {message && <div className="industry-success">{message}</div>}

      {error && <div className="industry-error">{error}</div>}

      {/* PAGE SETTINGS */}

      <div className="industry-settings-card">
        <div className="industry-settings-header">
          <div>
            <h2>Page Information</h2>

            <p>Configure the main heading and description.</p>
          </div>
        </div>

        <div className="industry-settings-form">
          <div className="industry-field">
            <label>Page Title</label>

            <input
              type="text"
              name="title"
              value={pageData.title}
              onChange={handlePageChange}
            />
          </div>

          <div className="industry-field">
            <label>Page Description</label>

            <textarea
              name="description"
              rows="3"
              value={pageData.description}
              onChange={handlePageChange}
              placeholder="Enter page description..."
            />
          </div>

          <div className="industry-publish-box">
            <label className="industry-switch">
              <input
                type="checkbox"
                name="published"
                checked={pageData.published}
                onChange={handlePageChange}
              />

              <span></span>
            </label>

            <div>
              <strong>Publish Page</strong>

              <p>Show this page on the public website.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="industry-form-card">
          <div className="industry-form-header">
            <div>
              <h2>{editIndex !== null ? "Edit Entry" : "Add New Entry"}</h2>

              <p>Add collaboration or Centre of Excellence information.</p>
            </div>

            <button
              type="button"
              className="industry-close-btn"
              onClick={closeForm}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleItemSubmit}>
            <div className="industry-form-grid">
              {/* TITLE */}

              <div className="industry-field">
                <label>
                  Title / Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleItemChange}
                  placeholder="Enter title or name"
                />
              </div>

              {/* PHOTO */}

              <div className="industry-field">
                <label>Photograph</label>

                <div className="industry-photo-upload">
                  <div className="industry-photo-preview">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" />
                    ) : (
                      <FaImage />
                    )}
                  </div>

                  <div className="industry-file-area">
                    <input
                      type="file"
                      id="industry-photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />

                    <label htmlFor="industry-photo">
                      {uploading ? "Uploading..." : "Choose Photo"}
                    </label>

                    <small>One photograph</small>
                  </div>
                </div>
              </div>

              {/* LINK */}

              <div className="industry-field">
                <label>Link Button URL</label>

                <div className="industry-input-icon">
                  <FaLink />

                  <input
                    type="url"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleItemChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <small>
                  This URL will be opened when the visitor clicks the link
                  button.
                </small>
              </div>

              {/* CERTIFICATE */}

              <div className="industry-field">
                <label>Certificate URL</label>

                <div className="industry-input-icon">
                  <FaCertificate />

                  <input
                    type="url"
                    name="certificateUrl"
                    value={formData.certificateUrl}
                    onChange={handleItemChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <small>Google Drive URL containing the certificate.</small>
              </div>

              {/* DESCRIPTION */}

              <div className="industry-field industry-full">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleItemChange}
                  placeholder="Enter detailed description..."
                />
              </div>

              {/* ACTIVE */}

              <div className="industry-publish-box">
                <label className="industry-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleItemChange}
                  />

                  <span></span>
                </label>

                <div>
                  <strong>Active</strong>

                  <p>Show this entry on the public website.</p>
                </div>
              </div>
            </div>

            <div className="industry-form-footer">
              <button
                type="button"
                className="industry-cancel-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button type="submit" className="industry-save-btn">
                <FaSave />

                {editIndex !== null ? "Update Entry" : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ENTRIES */}

      <div className="industry-list-section">
        <div className="industry-list-header">
          <div>
            <h2>Industry Academics Collaboration</h2>

            <p>
              {pageData.items.length} entr
              {pageData.items.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </div>

        {pageData.items.length === 0 ? (
          <div className="industry-empty">
            <div className="industry-empty-icon">
              <FaHandshake />
            </div>

            <h3>No Entries Added</h3>

            <p>
              Add your first Industry Academics Collaboration or Centre of
              Excellence.
            </p>

            <button
              type="button"
              className="industry-empty-btn"
              onClick={openAddForm}
            >
              <FaPlus />
              Add New
            </button>
          </div>
        ) : (
          <div className="industry-items">
            {pageData.items.map((item, index) => (
              <div className="industry-item-card" key={item._id || index}>
                <div className="industry-item-image">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.title} />
                  ) : (
                    <FaImage />
                  )}
                </div>

                <div className="industry-item-content">
                  <div className="industry-item-top">
                    <h3>{item.title}</h3>

                    <span
                      className={
                        item.isActive ? "industry-active" : "industry-inactive"
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p>{item.description || "No description added."}</p>

                  <div className="industry-item-links">
                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLink />
                        Link
                      </a>
                    )}

                    {item.certificateUrl && (
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaCertificate />
                        Certificate
                      </a>
                    )}
                  </div>
                </div>

                <div className="industry-item-actions">
                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Link"
                    >
                      <FaEye />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditForm(index)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAVE ALL */}

      <div className="industry-bottom-save">
        <button
          type="button"
          className="industry-save-all-btn"
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

export default IndustryAcademicsCollaboration;
