import React, { useEffect, useState } from "react";
import "./IMSSocietyForm.css";

import { getToken } from "../../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/ims-society`;

const initialForm = {
  title: "About IMS Society",
  introduction: "",
  content: "",
  vision: "",
  mission: "",
  isPublished: true,
};

const IMSSocietyForm = () => {
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*=========================================
  LOAD IMS SOCIETY
  =========================================*/

  useEffect(() => {
    const loadSociety = async () => {
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
          throw new Error(result?.message || "Failed to load IMS Society");
        }

        if (result?.data) {
          setForm({
            title: result.data.title || "About IMS Society",

            introduction: result.data.introduction || "",

            content: result.data.content || "",

            vision: result.data.vision || "",

            mission: result.data.mission || "",

            isPublished: result.data.isPublished !== false,
          });
        }
      } catch (err) {
        console.error("IMS Society loading error:", err);

        setError(err?.message || "Failed to load IMS Society.");
      } finally {
        setLoading(false);
      }
    };

    loadSociety();
  }, []);

  /*=========================================
  HANDLE INPUT
  =========================================*/

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /*=========================================
  SAVE IMS SOCIETY
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
        throw new Error(result?.message || "Failed to save IMS Society");
      }

      /*=====================================
      UPDATE FORM WITH SAVED DATA
      =====================================*/

      if (result?.data) {
        setForm({
          title: result.data.title || "About IMS Society",

          introduction: result.data.introduction || "",

          content: result.data.content || "",

          vision: result.data.vision || "",

          mission: result.data.mission || "",

          isPublished: result.data.isPublished !== false,
        });
      }

      setMessage("IMS Society content saved successfully.");
    } catch (err) {
      console.error("IMS Society save error:", err);

      setError(err?.message || "Failed to save IMS Society.");
    } finally {
      setSaving(false);
    }
  };

  /*=========================================
  LOADING
  =========================================*/

  if (loading) {
    return (
      <div className="ims-society-admin">
        <div className="ims-society-loading">
          <h2>Loading IMS Society...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /*=========================================
  RENDER
  =========================================*/

  return (
    <div className="ims-society-admin">
      {/*=====================================
      HEADER
      =====================================*/}

      <div className="ims-society-header">
        <h2>IMS Society</h2>

        <p>
          Manage the content displayed on the public About IMS Society page.
        </p>
      </div>

      {/*=====================================
      SUCCESS MESSAGE
      =====================================*/}

      {message && <div className="success-message">{message}</div>}

      {/*=====================================
      ERROR MESSAGE
      =====================================*/}

      {error && <div className="error-message">{error}</div>}

      {/*=====================================
      FORM
      =====================================*/}

      <form className="ims-society-form" onSubmit={handleSubmit}>
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
            placeholder="About IMS Society"
          />
        </div>

        {/*===================================
        INTRODUCTION
        ===================================*/}

        <div className="form-group">
          <label htmlFor="introduction">Introduction</label>

          <textarea
            id="introduction"
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
            rows="5"
            placeholder="Enter the introduction..."
          />
        </div>

        {/*===================================
        MAIN CONTENT
        ===================================*/}

        <div className="form-group">
          <label htmlFor="content">About IMS Society</label>

          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="10"
            placeholder="Enter the main society information..."
          />
        </div>

        {/*===================================
        VISION
        ===================================*/}

        <div className="form-group">
          <label htmlFor="vision">Vision</label>

          <textarea
            id="vision"
            name="vision"
            value={form.vision}
            onChange={handleChange}
            rows="6"
            placeholder="Enter society vision..."
          />
        </div>

        {/*===================================
        MISSION
        ===================================*/}

        <div className="form-group">
          <label htmlFor="mission">Mission</label>

          <textarea
            id="mission"
            name="mission"
            value={form.mission}
            onChange={handleChange}
            rows="6"
            placeholder="Enter society mission..."
          />
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
          {saving ? "Saving..." : "Save IMS Society"}
        </button>
      </form>
    </div>
  );
};

export default IMSSocietyForm;
