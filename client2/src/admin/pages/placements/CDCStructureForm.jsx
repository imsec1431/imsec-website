import React, { useEffect, useState } from "react";
import { FaImage, FaSave, FaTrash, FaUpload, FaTimes } from "react-icons/fa";

import {
  fetchCDCStructureAdmin,
  createCDCStructure,
  updateCDCStructure,
  deleteCDCStructure,
} from "../../services/cdcStructureService";

import "./CDCStructureForm.css";

const initialForm = {
  title: "CDC Structure",
  imageAlt: "CDC Structure",
  isPublished: true,
};

const CDCStructureForm = () => {
  const [form, setForm] = useState(initialForm);

  const [existingImage, setExistingImage] = useState("");

  const [existingPublicId, setExistingPublicId] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {
    loadCDCStructure();
  }, []);

  const loadCDCStructure = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchCDCStructureAdmin();

      const data = result?.data;

      if (data) {
        setForm({
          title: data.title || "CDC Structure",

          imageAlt: data.imageAlt || "CDC Structure",

          isPublished: data.isPublished !== false,
        });

        setExistingImage(data.image || "");

        setExistingPublicId(data.publicId || "");
      }
    } catch (err) {
      console.error("CDC Structure load error:", err);

      setError(err?.message || "Failed to load CDC Structure.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================
     IMAGE SELECT
  ========================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* ---------------------------------------
       VALIDATE IMAGE TYPE
    --------------------------------------- */

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      e.target.value = "";

      return;
    }

    /* ---------------------------------------
       VALIDATE FILE SIZE
       10 MB
    --------------------------------------- */

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be less than 10 MB.");

      e.target.value = "";

      return;
    }

    setError("");
    setMessage("");

    setImageFile(file);

    /* ---------------------------------------
       CREATE LOCAL PREVIEW
    --------------------------------------- */

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  /* =========================================
     REMOVE SELECTED IMAGE
  ========================================= */

  const handleRemoveSelectedImage = () => {
    setImageFile(null);
    setPreview("");

    const input = document.getElementById("cdcStructureImage");

    if (input) {
      input.value = "";
    }
  };

  /* =========================================
     SAVE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setMessage("");
      setError("");

      /* -------------------------------------
         NEW RECORD REQUIRES IMAGE
      ------------------------------------- */

      if (!existingImage && !imageFile) {
        setError("Please select the CDC Structure image.");

        setSaving(false);

        return;
      }

      /* -------------------------------------
         FORM DATA
      ------------------------------------- */

      const formData = new FormData();

      formData.append("title", form.title);

      formData.append("imageAlt", form.imageAlt);

      formData.append("isPublished", String(form.isPublished));

      /* -------------------------------------
         IMAGE
      ------------------------------------- */

      if (imageFile) {
        formData.append("image", imageFile);
      }

      /* -------------------------------------
         CREATE / UPDATE
      ------------------------------------- */

      let result;

      if (existingImage) {
        result = await updateCDCStructure(formData);
      } else {
        result = await createCDCStructure(formData);
      }

      /* -------------------------------------
         UPDATE STATE
      ------------------------------------- */

      const data = result?.data;

      if (data) {
        setForm({
          title: data.title || "CDC Structure",

          imageAlt: data.imageAlt || "CDC Structure",

          isPublished: data.isPublished !== false,
        });

        setExistingImage(data.image || "");

        setExistingPublicId(data.publicId || "");
      }

      setImageFile(null);
      setPreview("");

      const input = document.getElementById("cdcStructureImage");

      if (input) {
        input.value = "";
      }

      setMessage(result?.message || "CDC Structure saved successfully.");
    } catch (err) {
      console.error("CDC Structure save error:", err);

      setError(err?.message || "Failed to save CDC Structure.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the CDC Structure image?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      setMessage("");
      setError("");

      const result = await deleteCDCStructure();

      setExistingImage("");
      setExistingPublicId("");

      setImageFile(null);
      setPreview("");

      setForm(initialForm);

      const input = document.getElementById("cdcStructureImage");

      if (input) {
        input.value = "";
      }

      setMessage(result?.message || "CDC Structure deleted successfully.");
    } catch (err) {
      console.error("CDC Structure delete error:", err);

      setError(err?.message || "Failed to delete CDC Structure.");
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="cdc-structure-admin">
        <div className="cdc-loading">
          <div className="spinner-border" role="status" />

          <h3>Loading CDC Structure...</h3>
        </div>
      </div>
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="cdc-structure-admin">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="cdc-admin-header">
        <div>
          <div className="cdc-admin-heading">
            <FaImage />

            <span>Placements</span>
          </div>

          <h2>CDC Structure</h2>

          <p>
            Upload and manage the Career Development Centre structure displayed
            on the public website.
          </p>
        </div>
      </div>

      {/* =====================================
          MESSAGES
      ===================================== */}

      {message && <div className="cdc-success-message">{message}</div>}

      {error && <div className="cdc-error-message">{error}</div>}

      {/* =====================================
          FORM
      ===================================== */}

      <form className="cdc-structure-form" onSubmit={handleSubmit}>
        {/* ===================================
            BASIC INFORMATION
        =================================== */}

        <div className="cdc-form-card">
          <div className="cdc-card-header">
            <h3>CDC Structure Information</h3>

            <p>Configure the title and publication status.</p>
          </div>

          <div className="cdc-form-body">
            {/* TITLE */}

            <div className="cdc-form-group">
              <label htmlFor="cdcTitle">Page Title</label>

              <input
                id="cdcTitle"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="CDC Structure"
              />
            </div>

            {/* ALT */}

            <div className="cdc-form-group">
              <label htmlFor="cdcImageAlt">Image Alt Text</label>

              <input
                id="cdcImageAlt"
                type="text"
                name="imageAlt"
                value={form.imageAlt}
                onChange={handleChange}
                placeholder="CDC Structure"
              />
            </div>

            {/* PUBLISH */}

            <label className="cdc-publish-toggle">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
              />

              <span>
                <strong>Publish CDC Structure</strong>

                <small>Display this image on the public website.</small>
              </span>
            </label>
          </div>
        </div>

        {/* ===================================
            IMAGE
        =================================== */}

        <div className="cdc-form-card">
          <div className="cdc-card-header">
            <h3>CDC Structure Image</h3>

            <p>Upload the image that represents the CDC structure.</p>
          </div>

          <div className="cdc-form-body">
            {/* UPLOAD */}

            <label htmlFor="cdcStructureImage" className="cdc-upload-area">
              <FaUpload />

              <strong>Click to upload image</strong>

              <span>PNG, JPG, JPEG or WEBP</span>

              <small>Maximum file size: 10 MB</small>
            </label>

            <input
              id="cdcStructureImage"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              hidden
            />

            {/* =================================
                NEW IMAGE PREVIEW
            ================================= */}

            {preview && (
              <div className="cdc-image-preview">
                <div className="cdc-preview-header">
                  <span>New Image Preview</span>

                  <button
                    type="button"
                    onClick={handleRemoveSelectedImage}
                    title="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="cdc-preview-image">
                  <img src={preview} alt="New CDC Structure preview" />
                </div>
              </div>
            )}

            {/* =================================
                EXISTING IMAGE
            ================================= */}

            {!preview && existingImage && (
              <div className="cdc-image-preview">
                <div className="cdc-preview-header">
                  <span>Current CDC Structure</span>
                </div>

                <div className="cdc-preview-image">
                  <img
                    src={existingImage}
                    alt={form.imageAlt || "CDC Structure"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================
            ACTIONS
        =================================== */}

        <div className="cdc-form-actions">
          {existingImage && (
            <button
              type="button"
              className="cdc-delete-button"
              onClick={handleDelete}
              disabled={deleting || saving}
            >
              <FaTrash />

              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}

          <button
            type="submit"
            className="cdc-save-button"
            disabled={saving || deleting}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : existingImage
                ? "Update CDC Structure"
                : "Save CDC Structure"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CDCStructureForm;
