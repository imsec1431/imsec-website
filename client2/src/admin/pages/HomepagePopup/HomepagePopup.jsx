import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaSyncAlt,
  FaEye,
  FaExternalLinkAlt,
  FaFilePdf,
  FaImage,
  FaTimes,
} from "react-icons/fa";

import homepagePopupAdminService from "../../services/homepagePopupService";

import "./HomepagePopup.css";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   MAX FILE SIZE
   10 MB
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/* =========================================================
   INITIAL FORM
========================================================= */

const getInitialForm = (displayOrder = 1) => ({
  title: "",

  type: "image",

  file: null,

  isActive: true,

  displayOrder,
});

/* =========================================================
   COMPONENT
========================================================= */

const HomepagePopup = () => {
  /* =======================================================
     POPUPS
  ======================================================= */

  const [popups, setPopups] = useState([]);

  /* =======================================================
     SETTINGS
  ======================================================= */

  const [settings, setSettings] = useState({
    rotationEnabled: true,

    rotationInterval: 5,

    published: true,
  });

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState(getInitialForm(1));

  /* =======================================================
     FILE PREVIEW
  ======================================================= */

  const [filePreview, setFilePreview] = useState("");

  /* =======================================================
     EXISTING FILE
  ======================================================= */

  const [existingFileUrl, setExistingFileUrl] = useState("");

  /* =======================================================
     EXISTING FILE NAME
  ======================================================= */

  const [existingFileName, setExistingFileName] = useState("");

  /* =======================================================
     EDITING
  ======================================================= */

  const [editingId, setEditingId] = useState(null);

  /* =======================================================
     GENERAL STATE
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =======================================================
     LOAD POPUPS
  ======================================================= */

  useEffect(() => {
    loadPopups();

    return () => {
      /*
       * Cleanup object URL when component
       * is unmounted.
       */
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadPopups = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await homepagePopupAdminService.getAllHomepagePopups();

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   data: [],
       *   settings: {}
       * }
       */

      const popupData = Array.isArray(data?.data) ? data.data : [];

      setPopups(popupData);

      setSettings({
        rotationEnabled: data?.settings?.rotationEnabled ?? true,

        rotationInterval: data?.settings?.rotationInterval ?? 5,

        published: data?.settings?.published ?? true,
      });
    } catch (err) {
      console.error("Load homepage popups error:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to load homepage popup information.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : name === "displayOrder"
            ? Number(value)
            : value,
    }));

    setError("");

    setMessage("");
  };

  /* =======================================================
     FILE CHANGE
  ======================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    setMessage("");

    /* -----------------------------------------------------
       FILE SIZE
    ----------------------------------------------------- */

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 10 MB.");

      event.target.value = "";

      return;
    }

    /* -----------------------------------------------------
       FILE TYPE
    ----------------------------------------------------- */

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setError("Please select a valid image or PDF file.");

      event.target.value = "";

      return;
    }

    /* -----------------------------------------------------
       IMAGE EXTENSIONS
    ----------------------------------------------------- */

    if (isImage) {
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedImageTypes.includes(file.type)) {
        setError("Only JPG, JPEG, PNG and WEBP images are allowed.");

        event.target.value = "";

        return;
      }
    }

    /* -----------------------------------------------------
       DETECT TYPE
    ----------------------------------------------------- */

    const detectedType = isPdf ? "pdf" : "image";

    /* -----------------------------------------------------
       REVOKE OLD PREVIEW
    ----------------------------------------------------- */

    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }

    /* -----------------------------------------------------
       SET FORM
    ----------------------------------------------------- */

    setForm((previous) => ({
      ...previous,

      file,

      type: detectedType,
    }));

    /* -----------------------------------------------------
       IMAGE PREVIEW
    ----------------------------------------------------- */

    if (isImage) {
      const previewUrl = URL.createObjectURL(file);

      setFilePreview(previewUrl);
    } else {
      setFilePreview("");
    }
  };

  /* =======================================================
     REMOVE SELECTED FILE
  ======================================================= */

  const removeSelectedFile = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }

    setFilePreview("");

    setForm((previous) => ({
      ...previous,

      file: null,
    }));
  };

  /* =======================================================
     GET FILE URL
  ======================================================= */

  const getFileUrl = (popup) => {
    if (!popup?.filePath) {
      return "";
    }

    /*
     * Cloudinary / external URL
     */

    if (
      popup.filePath.startsWith("http://") ||
      popup.filePath.startsWith("https://")
    ) {
      return popup.filePath;
    }

    /*
     * Local backend file
     */

    if (popup.filePath.startsWith("/")) {
      return `${API_BASE_URL}${popup.filePath}`;
    }

    return `${API_BASE_URL}/${popup.filePath}`;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setMessage("");

    /* -----------------------------------------------------
       TITLE VALIDATION
    ----------------------------------------------------- */

    if (!form.title.trim()) {
      setError("Popup title is required.");

      return;
    }

    /* -----------------------------------------------------
       FILE VALIDATION
    ----------------------------------------------------- */

    /*
     * New popup requires a file.
     *
     * During editing the existing file can
     * remain if admin does not select a new one.
     */

    if (!editingId && !form.file) {
      setError("Please select an image or PDF file.");

      return;
    }

    /* -----------------------------------------------------
       TYPE VALIDATION
    ----------------------------------------------------- */

    if (form.type !== "image" && form.type !== "pdf") {
      setError("Please select a valid popup type.");

      return;
    }

    /* -----------------------------------------------------
       DISPLAY ORDER
    ----------------------------------------------------- */

    if (
      Number.isNaN(Number(form.displayOrder)) ||
      Number(form.displayOrder) < 0
    ) {
      setError("Display order must be a valid number.");

      return;
    }

    /* -----------------------------------------------------
       FILE / TYPE MATCH
    ----------------------------------------------------- */

    if (form.file) {
      const isPdf =
        form.file.type === "application/pdf" ||
        form.file.name.toLowerCase().endsWith(".pdf");

      const actualType = isPdf ? "pdf" : "image";

      if (actualType !== form.type) {
        setError("Selected file type does not match popup type.");

        return;
      }
    }

    try {
      setSaving(true);

      /* ---------------------------------------------------
         CREATE FORMDATA
      --------------------------------------------------- */

      const formData = new FormData();

      formData.append("title", form.title.trim());

      formData.append("type", form.type);

      formData.append("isActive", String(form.isActive));

      formData.append("displayOrder", String(Number(form.displayOrder) || 1));

      /* ---------------------------------------------------
         FILE
      --------------------------------------------------- */

      if (form.file) {
        formData.append("file", form.file);
      }

      /* ---------------------------------------------------
         UPDATE
      --------------------------------------------------- */

      if (editingId) {
        await homepagePopupAdminService.updateHomepagePopup(
          editingId,
          formData,
        );

        setMessage("Homepage popup updated successfully.");
      } else {

      /* ---------------------------------------------------
         CREATE
      --------------------------------------------------- */
        await homepagePopupAdminService.createHomepagePopup(formData);

        setMessage("Homepage popup uploaded successfully.");
      }

      /* ---------------------------------------------------
         RESET FORM
      --------------------------------------------------- */

      resetForm();

      /* ---------------------------------------------------
         RELOAD
      --------------------------------------------------- */

      await loadPopups();
    } catch (err) {
      console.error("Save homepage popup error:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to save homepage popup.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (popup) => {
    if (!popup?._id) {
      return;
    }

    /* -----------------------------------------------------
       CLEAN OLD PREVIEW
    ----------------------------------------------------- */

    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }

    setEditingId(popup._id);

    /* -----------------------------------------------------
       EXISTING FILE
    ----------------------------------------------------- */

    const fileUrl = getFileUrl(popup);

    setExistingFileUrl(fileUrl);

    setExistingFileName(
      popup.fileName ||
        (popup.type === "pdf" ? "Existing PDF" : "Existing Image"),
    );

    /* -----------------------------------------------------
       FORM
    ----------------------------------------------------- */

    setForm({
      title: popup.title || "",

      type: popup.type === "pdf" ? "pdf" : "image",

      file: null,

      isActive: popup.isActive !== false,

      displayOrder: Number(popup.displayOrder) || 1,
    });

    setFilePreview("");

    setMessage("");

    setError("");

    /* -----------------------------------------------------
       SCROLL
    ----------------------------------------------------- */

    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this popup?\n\nThe uploaded file will also be removed.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      setMessage("");

      await homepagePopupAdminService.deleteHomepagePopup(id);

      setMessage("Homepage popup deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadPopups();
    } catch (err) {
      console.error("Delete popup error:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to delete homepage popup.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }

    setEditingId(null);

    setFilePreview("");

    setExistingFileUrl("");

    setExistingFileName("");

    setForm(getInitialForm(popups.length + 1));

    /*
     * Reset file input.
     */

    const fileInput = document.getElementById("homepage-popup-file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =======================================================
     SETTINGS CHANGE
  ======================================================= */

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : Number(value),
    }));

    setError("");

    setMessage("");
  };

  /* =======================================================
     SAVE SETTINGS
  ======================================================= */

  const saveSettings = async () => {
    try {
      setSaving(true);

      setError("");

      setMessage("");

      await homepagePopupAdminService.updateHomepagePopupSettings({
        rotationEnabled: settings.rotationEnabled,

        rotationInterval: Number(settings.rotationInterval),

        published: settings.published,
      });

      setMessage("Popup rotation settings saved successfully.");

      await loadPopups();
    } catch (err) {
      console.error("Save settings error:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to save popup settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET SETTINGS
  ======================================================= */

  const resetSettings = async () => {
    const confirmed = window.confirm(
      "Reset popup rotation settings to defaults?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      setMessage("");

      const data = await homepagePopupAdminService.resetHomepagePopupSettings();

      const resetData = data?.data || data?.settings || data;

      setSettings({
        rotationEnabled: resetData?.rotationEnabled ?? true,

        rotationInterval: resetData?.rotationInterval ?? 5,

        published: resetData?.published ?? true,
      });

      setMessage("Popup settings reset successfully.");

      await loadPopups();
    } catch (err) {
      console.error("Reset settings error:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to reset popup settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     SORT POPUPS
  ======================================================= */

  const sortedPopups = [...popups].sort(
    (a, b) => Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0),
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="homepage-popup-loading">
        <div className="homepage-popup-spinner"></div>

        <p>Loading homepage popups...</p>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="homepage-popup-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="homepage-popup-header">
        <div>
          <span className="homepage-popup-eyebrow">HOME PAGE</span>

          <h1>Homepage Popups</h1>

          <p>Upload and manage multiple homepage images and PDF popups.</p>
        </div>

        <button
          type="button"
          className="popup-refresh-btn"
          onClick={loadPopups}
          disabled={saving}
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && <div className="popup-success">{message}</div>}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && <div className="popup-error">{error}</div>}

      {/* =====================================================
          ROTATION SETTINGS
      ===================================================== */}

      <section className="popup-settings-card">
        <div className="popup-section-heading">
          <div>
            <h2>Popup Rotation Settings</h2>

            <p>Control automatic popup rotation on the homepage.</p>
          </div>
        </div>

        <div className="popup-settings-grid">
          {/* AUTOMATIC ROTATION */}

          <label className="popup-switch-row">
            <span>
              <strong>Enable Automatic Rotation</strong>

              <small>Automatically change between active popups.</small>
            </span>

            <input
              type="checkbox"
              name="rotationEnabled"
              checked={settings.rotationEnabled}
              onChange={handleSettingsChange}
            />
          </label>

          {/* ROTATION INTERVAL */}

          <div className="popup-field">
            <label>Rotation Interval</label>

            <select
              name="rotationInterval"
              value={settings.rotationInterval}
              onChange={handleSettingsChange}
            >
              <option value={2}>2 Seconds</option>

              <option value={3}>3 Seconds</option>

              <option value={5}>5 Seconds</option>

              <option value={10}>10 Seconds</option>

              <option value={15}>15 Seconds</option>

              <option value={20}>20 Seconds</option>

              <option value={30}>30 Seconds</option>

              <option value={60}>1 Minute</option>

              <option value={120}>2 Minutes</option>

              <option value={300}>5 Minutes</option>
            </select>
          </div>

          {/* PUBLISH */}

          <label className="popup-switch-row">
            <span>
              <strong>Publish Popup Section</strong>

              <small>Show or hide popup section on the homepage.</small>
            </span>

            <input
              type="checkbox"
              name="published"
              checked={settings.published}
              onChange={handleSettingsChange}
            />
          </label>
        </div>

        {/* SETTINGS ACTIONS */}

        <div className="popup-settings-actions">
          <button
            type="button"
            className="popup-save-btn"
            onClick={saveSettings}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Settings"}
          </button>

          <button
            type="button"
            className="popup-reset-btn"
            onClick={resetSettings}
            disabled={saving}
          >
            <FaSyncAlt />
            Reset Defaults
          </button>
        </div>
      </section>

      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      <section className="popup-form-card">
        <div className="popup-section-heading">
          <div>
            <h2>{editingId ? "Edit Popup" : "Add New Popup"}</h2>

            <p>
              {editingId
                ? "Update popup details or replace the uploaded file."
                : "Upload an image or PDF to display on the homepage."}
            </p>
          </div>

          {editingId && <span className="popup-editing-badge">Editing</span>}
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="popup-form-grid">
            {/* =================================================
                TITLE
            ================================================= */}

            <div className="popup-field">
              <label>Popup Title *</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Admission Open 2026"
                maxLength={200}
                disabled={saving}
              />
            </div>

            {/* =================================================
                TYPE
            ================================================= */}

            <div className="popup-field">
              <label>File Type *</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={saving || Boolean(form.file)}
              >
                <option value="image">Image</option>

                <option value="pdf">PDF</option>
              </select>

              {form.file && (
                <small className="popup-type-note">
                  Type detected automatically from selected file.
                </small>
              )}
            </div>

            {/* =================================================
                FILE UPLOAD
            ================================================= */}

            <div className="popup-field popup-full">
              <label>
                {editingId ? "Replace Image / PDF" : "Upload Image / PDF *"}
              </label>

              <div className="popup-file-input-wrapper">
                <input
                  id="homepage-popup-file"
                  type="file"
                  name="file"
                  accept={
                    form.type === "pdf"
                      ? "application/pdf,.pdf"
                      : "image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  }
                  onChange={handleFileChange}
                  disabled={saving}
                />
              </div>

              <small className="popup-upload-help">
                {form.type === "pdf"
                  ? "PDF only • Maximum 10 MB"
                  : "JPG, JPEG, PNG or WEBP • Maximum 10 MB"}
              </small>
            </div>

            {/* =================================================
                EXISTING FILE
            ================================================= */}

            {editingId && existingFileUrl && !form.file && (
              <div className="popup-existing-file popup-full">
                <div className="popup-existing-header">
                  <strong>Current File</strong>

                  <a
                    href={existingFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEye />
                    View Current File
                  </a>
                </div>

                <div className="popup-existing-content">
                  {form.type === "image" ? (
                    <img
                      src={existingFileUrl}
                      alt={existingFileName || "Current popup"}
                    />
                  ) : (
                    <div className="popup-existing-pdf">
                      <FaFilePdf />

                      <span>{existingFileName || "Current PDF"}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                NEW FILE PREVIEW
            ================================================= */}

            {form.file && (
              <div className="popup-selected-file popup-full">
                <div className="popup-selected-header">
                  <div>
                    <strong>Selected File</strong>

                    <small>Ready to upload</small>
                  </div>

                  <button
                    type="button"
                    className="popup-remove-file-btn"
                    onClick={removeSelectedFile}
                    disabled={saving}
                    title="Remove selected file"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="popup-selected-content">
                  <div className="popup-selected-preview">
                    {form.type === "image" && filePreview ? (
                      <img src={filePreview} alt="Selected popup preview" />
                    ) : (
                      <div className="popup-pdf-preview-large">
                        <FaFilePdf />

                        <strong>PDF</strong>
                      </div>
                    )}
                  </div>

                  <div className="popup-selected-info">
                    <div>
                      <span>File Name</span>

                      <strong>{form.file.name}</strong>
                    </div>

                    <div>
                      <span>File Size</span>

                      <strong>
                        {(form.file.size / 1024 / 1024).toFixed(2)} MB
                      </strong>
                    </div>

                    <div>
                      <span>Type</span>

                      <strong>{form.type === "pdf" ? "PDF" : "Image"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                DISPLAY ORDER
            ================================================= */}

            <div className="popup-field">
              <label>Display Order</label>

              <input
                type="number"
                name="displayOrder"
                min="0"
                value={form.displayOrder}
                onChange={handleChange}
                disabled={saving}
              />

              <small>Lower number appears first.</small>
            </div>
          </div>

          {/* =================================================
              FORM BOTTOM
          ================================================= */}

          <div className="popup-form-bottom">
            <label className="popup-active-check">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                disabled={saving}
              />

              <span>Active on homepage</span>
            </label>

            <div className="popup-form-actions">
              {editingId && (
                <button
                  type="button"
                  className="popup-cancel-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  <FaTimes />
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="popup-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSyncAlt className="popup-button-spinner" />

                    {editingId ? "Uploading Changes..." : "Uploading Popup..."}
                  </>
                ) : (
                  <>
                    {editingId ? <FaSave /> : <FaPlus />}

                    {editingId ? "Save Changes" : "Upload Popup"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* =====================================================
          POPUP LIST
      ===================================================== */}

      <section className="popup-list-card">
        <div className="popup-section-heading">
          <div>
            <h2>Popup List</h2>

            <p>
              {popups.length} popup
              {popups.length !== 1 ? "s" : ""} configured.
            </p>
          </div>

          {popups.length > 0 && (
            <div className="popup-list-summary">
              <span>
                <FaImage />
                {popups.filter((item) => item.type === "image").length} Images
              </span>

              <span>
                <FaFilePdf />
                {popups.filter((item) => item.type === "pdf").length} PDFs
              </span>
            </div>
          )}
        </div>

        {sortedPopups.length === 0 ? (
          <div className="popup-empty">
            <div className="popup-empty-icon">
              <FaPlus />
            </div>

            <h3>No Popups Added</h3>

            <p>Upload your first homepage image or PDF above.</p>
          </div>
        ) : (
          <div className="popup-table-wrapper">
            <table className="popup-table">
              <thead>
                <tr>
                  <th>Order</th>

                  <th>Preview</th>

                  <th>Title</th>

                  <th>Type</th>

                  <th>Status</th>

                  <th>File</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedPopups.map((popup) => {
                  const fileUrl = getFileUrl(popup);

                  const isPdf =
                    popup.type === "pdf" ||
                    popup.fileName?.toLowerCase().endsWith(".pdf");

                  return (
                    <tr key={popup._id}>
                      {/* ORDER */}

                      <td>
                        <span className="popup-order">
                          {popup.displayOrder}
                        </span>
                      </td>

                      {/* PREVIEW */}

                      <td>
                        {isPdf ? (
                          <div className="popup-pdf-preview">
                            <FaFilePdf />

                            <span>PDF</span>
                          </div>
                        ) : fileUrl ? (
                          <img
                            src={fileUrl}
                            alt={popup.title || "Homepage popup"}
                            className="popup-thumbnail"
                          />
                        ) : (
                          <div className="popup-pdf-preview">N/A</div>
                        )}
                      </td>

                      {/* TITLE */}

                      <td>
                        <div className="popup-title-cell">
                          <strong>{popup.title}</strong>

                          {popup.fileName && <small>{popup.fileName}</small>}
                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span
                          className={`popup-type-badge ${
                            isPdf ? "pdf" : "image"
                          }`}
                        >
                          {isPdf ? <FaFilePdf /> : <FaImage />}

                          {isPdf ? "PDF" : "Image"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            popup.isActive
                              ? "popup-status active"
                              : "popup-status inactive"
                          }
                        >
                          <span className="popup-status-dot"></span>

                          {popup.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* FILE */}

                      <td>
                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="popup-file-link"
                          >
                            <FaExternalLinkAlt />
                            Open
                          </a>
                        ) : (
                          <span>—</span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="popup-action-buttons">
                          {/* VIEW */}

                          {fileUrl && (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="popup-view-btn"
                              title="View File"
                            >
                              <FaEye />
                            </a>
                          )}

                          {/* EDIT */}

                          <button
                            type="button"
                            className="popup-edit-btn"
                            onClick={() => handleEdit(popup)}
                            disabled={saving}
                            title="Edit Popup"
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="popup-delete-btn"
                            onClick={() => handleDelete(popup._id)}
                            disabled={saving}
                            title="Delete Popup"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <div className="popup-info-box">
        <div className="popup-info-icon">
          <FaExternalLinkAlt />
        </div>

        <div>
          <strong>How popup rotation works</strong>

          <p>
            Only active popups are displayed on the homepage. Popups are shown
            according to Display Order. When automatic rotation is enabled, the
            homepage automatically changes to the next popup after the selected
            interval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomepagePopup;
