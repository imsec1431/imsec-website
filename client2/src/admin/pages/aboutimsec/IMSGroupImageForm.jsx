import React, { useEffect, useState } from "react";
import "./IMSGroupImageForm.css";

import { getToken } from "../../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/ims-group-image`;

const initialForm = {
  title: "IMS Group of Institutions",
  description: "",
  image: "",
  imageAlt: "IMS Group of Institutions",
  isPublished: true,
};

const IMSGroupImageForm = () => {
  const [form, setForm] = useState(initialForm);

  const [selectedImage, setSelectedImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /*=========================================
  LOAD EXISTING CONTENT
  =========================================*/

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Admin session not found. Please login again.");
        }

        const response = await fetch(`${API_URL}/admin`, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to load IMS Group information",
          );
        }

        if (result?.data) {
          const data = result.data;

          setForm({
            title: data.title || "IMS Group of Institutions",

            description: data.description || "",

            image: data.image || "",

            imageAlt: data.imageAlt || "IMS Group of Institutions",

            isPublished: data.isPublished !== false,
          });

          setPreview(data.image || "");
        }
      } catch (err) {
        console.error("IMS Group Image load error:", err);

        setError(err?.message || "Failed to load page.");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  /*=========================================
  HANDLE TEXT INPUT
  ========================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*=========================================
  IMAGE SELECT
  ========================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*---------------------------------------
    CHECK IMAGE TYPE
    ---------------------------------------*/

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      e.target.value = "";

      return;
    }

    /*---------------------------------------
    CHECK IMAGE SIZE
    ---------------------------------------*/

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be less than 5 MB.");

      e.target.value = "";

      return;
    }

    setError("");
    setMessage("");

    setSelectedImage(file);

    /*---------------------------------------
    CREATE PREVIEW
    ---------------------------------------*/

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  /*=========================================
  REMOVE SELECTED IMAGE
  ========================================= */

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);

    setPreview(form.image || "");

    const fileInput = document.getElementById("ims-group-image-upload");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /*=========================================
  SAVE
  ========================================= */

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

      /*---------------------------------------
      FORM DATA
      ---------------------------------------*/

      const formData = new FormData();

      formData.append("title", form.title);

      formData.append("description", form.description);

      formData.append("imageAlt", form.imageAlt);

      formData.append("isPublished", String(form.isPublished));

      /*---------------------------------------
      ONLY SEND IMAGE IF NEW IMAGE SELECTED
      ---------------------------------------*/

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      /*---------------------------------------
      REQUEST
      ---------------------------------------*/

      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to save IMS Group information",
        );
      }

      /*---------------------------------------
      UPDATE FORM
      ---------------------------------------*/

      if (result?.data) {
        const data = result.data;

        setForm({
          title: data.title || "IMS Group of Institutions",

          description: data.description || "",

          image: data.image || "",

          imageAlt: data.imageAlt || "IMS Group of Institutions",

          isPublished: data.isPublished !== false,
        });

        setPreview(data.image || "");
      }

      setSelectedImage(null);

      /*---------------------------------------
      CLEAR FILE INPUT
      ---------------------------------------*/

      const fileInput = document.getElementById("ims-group-image-upload");

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage("IMS Group information saved successfully.");
    } catch (err) {
      console.error("IMS Group Image save error:", err);

      setError(err?.message || "Failed to save information.");
    } finally {
      setSaving(false);
    }
  };

  /*=========================================
  LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="ims-group-image-admin">
        <div className="ims-group-image-loading">
          <h2>Loading IMS Group...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /*=========================================
  RENDER
  ========================================= */

  return (
    <div className="ims-group-image-admin">
      {/*=====================================
      HEADER
      =====================================*/}

      <div className="ims-group-image-header">
        <h2>IMS Group Image</h2>

        <p>Manage the image and information displayed on the public page.</p>
      </div>

      {/*=====================================
      SUCCESS
      =====================================*/}

      {message && <div className="success-message">{message}</div>}

      {/*=====================================
      ERROR
      =====================================*/}

      {error && <div className="error-message">{error}</div>}

      {/*=====================================
      FORM
      =====================================*/}

      <form className="ims-group-image-form" onSubmit={handleSubmit}>
        {/*===================================
        TITLE
        ===================================*/}

        <div className="form-group">
          <label htmlFor="title">Page Title</label>

          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="IMS Group of Institutions"
          />
        </div>

        {/*===================================
        DESCRIPTION
        ===================================*/}

        <div className="form-group">
          <label htmlFor="description">Information</label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="10"
            placeholder="Enter the information that will be displayed in the modal..."
          />

          <small>
            This information will be shown inside the Bootstrap modal on the
            public page.
          </small>
        </div>

        {/*===================================
        IMAGE ALT
        ===================================*/}

        <div className="form-group">
          <label htmlFor="imageAlt">Image Alt Text</label>

          <input
            id="imageAlt"
            type="text"
            name="imageAlt"
            value={form.imageAlt}
            onChange={handleChange}
            placeholder="IMS Group of Institutions"
          />
        </div>

        {/*===================================
        IMAGE UPLOAD
        ===================================*/}

        <div className="form-group">
          <label htmlFor="ims-group-image-upload">Page Image</label>

          <input
            id="ims-group-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageChange}
          />

          <small>Maximum image size: 5 MB.</small>
        </div>

        {/*===================================
        IMAGE PREVIEW
        ===================================*/}

        {preview && (
          <div className="image-preview-section">
            <div className="image-preview-header">
              <h3>Image Preview</h3>

              {selectedImage && (
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={handleRemoveSelectedImage}
                >
                  Remove New Image
                </button>
              )}
            </div>

            <div className="image-preview">
              <img src={preview} alt={form.imageAlt || form.title} />
            </div>

            {selectedImage && (
              <div className="selected-image-info">
                <strong>Selected:</strong> {selectedImage.name}
              </div>
            )}
          </div>
        )}

        {/*===================================
        NO IMAGE
        ===================================*/}

        {!preview && (
          <div className="no-image">
            <p>No image uploaded yet.</p>
          </div>
        )}

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

        <button type="submit" className="save-button" disabled={saving}>
          {saving ? "Saving..." : "Save IMS Group"}
        </button>
      </form>
    </div>
  );
};

export default IMSGroupImageForm;
