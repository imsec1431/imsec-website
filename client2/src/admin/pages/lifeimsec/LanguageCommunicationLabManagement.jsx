import React, { useEffect, useState } from "react";
import { FaSave, FaUndo, FaImage, FaPlus, FaTrash } from "react-icons/fa";

import ImageUploader from "../../components/common/ImageUploader";

import {
  getLanguageCommunicationLabAdmin,
  updateLanguageCommunicationLabAdmin,
  resetLanguageCommunicationLabDefaults,
} from "../../services/languageCommunicationLabAdminService";

import "./LanguageCommunicationLabManagement.css";

const DEFAULT_DATA = {
  hero: {
    title: "Language & Communication Lab",
    subtitle:
      "Developing effective communication and language skills for academic and professional growth",
    breadcrumb: "Home / Life @ IMSEC / Language & Communication Lab",
    image: {},
  },

  about: {
    title: "Language & Communication Lab",
    description:
      "The Language & Communication Lab at IMSEC provides students with a supportive environment to improve their communication, language and presentation skills. The lab helps students develop confidence and effective communication abilities required for academic and professional success.",
    image: {},
  },

  features: [
    {
      title: "Communication Skills",
      description:
        "Students develop effective verbal and written communication skills through guided learning activities.",
    },
    {
      title: "Language Development",
      description:
        "The lab supports improvement in language proficiency, vocabulary and overall language usage.",
    },
    {
      title: "Presentation Skills",
      description:
        "Students get opportunities to improve their presentation, speaking and public communication abilities.",
    },
    {
      title: "Confidence Building",
      description:
        "Regular communication activities help students build confidence for academic and professional interactions.",
    },
  ],

  cta: {
    title: "Enhancing Communication Skills",
    description:
      "The lab supports students in developing language proficiency, communication skills, confidence and professional presentation abilities.",
  },
};

const normalizeData = (data = {}) => ({
  hero: {
    ...DEFAULT_DATA.hero,
    ...(data.hero || {}),
    image: {
      ...DEFAULT_DATA.hero.image,
      ...(data.hero?.image || {}),
    },
  },

  about: {
    ...DEFAULT_DATA.about,
    ...(data.about || {}),
    image: {
      ...DEFAULT_DATA.about.image,
      ...(data.about?.image || {}),
    },
  },

  features:
    Array.isArray(data.features) && data.features.length
      ? data.features
      : DEFAULT_DATA.features,

  cta: {
    ...DEFAULT_DATA.cta,
    ...(data.cta || {}),
  },
});

const LanguageCommunicationLabManagement = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getLanguageCommunicationLabAdmin();

      setData(normalizeData(response?.data));
    } catch (error) {
      console.error(error);

      setMessage(error?.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateFeature = (index, field, value) => {
    setData((prev) => {
      const features = [...prev.features];

      features[index] = {
        ...features[index],
        [field]: value,
      };

      return {
        ...prev,
        features,
      };
    });
  };

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeFeature = (index) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.filter(
        (_, featureIndex) => featureIndex !== index,
      ),
    }));
  };

  const handleImageChange = (section, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image size must be less than 10 MB.");
      return;
    }

    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        _newImage: file,
      },
    }));

    setMessage("");
  };

  const removeImage = (section) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        image: {},
        _removeImage: true,
        _newImage: null,
      },
    }));
  };

  const saveData = async () => {
    try {
      setSaving(true);
      setMessage("");

      const formData = new FormData();

      const cleanData = {
        hero: {
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          breadcrumb: data.hero.breadcrumb,
          image: data.hero._removeImage ? {} : data.hero.image,
        },

        about: {
          title: data.about.title,
          description: data.about.description,
          image: data.about._removeImage ? {} : data.about.image,
        },

        features: data.features.map((item) => ({
          title: item.title || "",
          description: item.description || "",
        })),

        cta: {
          title: data.cta.title,
          description: data.cta.description,
        },
      };

      formData.append("data", JSON.stringify(cleanData));

      if (data.hero._newImage) {
        formData.append("heroImage", data.hero._newImage);
      }

      if (data.about._newImage) {
        formData.append("aboutImage", data.about._newImage);
      }

      await updateLanguageCommunicationLabAdmin(formData);

      setMessage("Language & Communication Lab saved successfully.");

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage(error?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    const confirmed = window.confirm(
      "Restore all Language & Communication Lab content to default data?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");

      const response = await resetLanguageCommunicationLabDefaults();

      setData(normalizeData(response?.data));

      setMessage("Default data restored successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error?.response?.data?.message || "Failed to restore defaults.",
      );
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="lcl-loading">Loading Language & Communication Lab...</div>
    );
  }

  return (
    <div className="lcl-admin-page">
      <div className="lcl-admin-header">
        <div>
          <h1>Language & Communication Lab</h1>
          <p>Manage the public Language & Communication Lab page.</p>
        </div>

        <div className="lcl-header-actions">
          <button
            type="button"
            className="lcl-reset-btn"
            onClick={restoreDefaults}
            disabled={resetting || saving}
          >
            <FaUndo />
            {resetting ? "Restoring..." : "Restore Defaults"}
          </button>

          <button
            type="button"
            className="lcl-save-btn"
            onClick={saveData}
            disabled={saving || resetting}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && <div className="lcl-message">{message}</div>}

      {/* HERO */}
      <section className="lcl-card">
        <div className="lcl-card-title">
          <FaImage />
          <div>
            <h2>Hero Section</h2>
            <p>Page heading and hero image.</p>
          </div>
        </div>

        <div className="lcl-form-grid">
          <div className="lcl-field">
            <label>Title</label>
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => updateSection("hero", "title", e.target.value)}
            />
          </div>

          <div className="lcl-field">
            <label>Breadcrumb</label>
            <input
              type="text"
              value={data.hero.breadcrumb}
              onChange={(e) =>
                updateSection("hero", "breadcrumb", e.target.value)
              }
            />
          </div>

          <div className="lcl-field lcl-full">
            <label>Subtitle</label>
            <textarea
              rows="3"
              value={data.hero.subtitle}
              onChange={(e) =>
                updateSection("hero", "subtitle", e.target.value)
              }
            />
          </div>

          <div className="lcl-image-field lcl-full">
            <label>Hero Image</label>

            <ImageUploader
              onChange={(file) => handleImageChange("hero", file)}
              currentImage={data.hero.image?.url || ""}
            />

            {data.hero.image?.url && (
              <button
                type="button"
                className="lcl-remove-image"
                onClick={() => removeImage("hero")}
              >
                Remove Current Image
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="lcl-card">
        <div className="lcl-card-title">
          <div>
            <h2>About Section</h2>
            <p>Introduction to the laboratory.</p>
          </div>
        </div>

        <div className="lcl-form-grid">
          <div className="lcl-field lcl-full">
            <label>Title</label>
            <input
              type="text"
              value={data.about.title}
              onChange={(e) => updateSection("about", "title", e.target.value)}
            />
          </div>

          <div className="lcl-field lcl-full">
            <label>Description</label>
            <textarea
              rows="6"
              value={data.about.description}
              onChange={(e) =>
                updateSection("about", "description", e.target.value)
              }
            />
          </div>

          <div className="lcl-image-field lcl-full">
            <label>About Image</label>

            <ImageUploader
              onChange={(file) => handleImageChange("about", file)}
              currentImage={data.about.image?.url || ""}
            />

            {data.about.image?.url && (
              <button
                type="button"
                className="lcl-remove-image"
                onClick={() => removeImage("about")}
              >
                Remove Current Image
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lcl-card">
        <div className="lcl-card-title">
          <div>
            <h2>Features</h2>
            <p>Add simple highlights about the laboratory.</p>
          </div>

          <button type="button" className="lcl-add-btn" onClick={addFeature}>
            <FaPlus />
            Add Feature
          </button>
        </div>

        <div className="lcl-features">
          {data.features.map((feature, index) => (
            <div className="lcl-feature-editor" key={index}>
              <div className="lcl-feature-number">{index + 1}</div>

              <div className="lcl-feature-fields">
                <div className="lcl-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) =>
                      updateFeature(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="lcl-field">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="lcl-delete-btn"
                onClick={() => removeFeature(index)}
                disabled={data.features.length <= 1}
                title="Delete feature"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lcl-card">
        <div className="lcl-card-title">
          <div>
            <h2>CTA Section</h2>
            <p>Closing section of the page.</p>
          </div>
        </div>

        <div className="lcl-form-grid">
          <div className="lcl-field lcl-full">
            <label>Title</label>
            <input
              type="text"
              value={data.cta.title}
              onChange={(e) => updateSection("cta", "title", e.target.value)}
            />
          </div>

          <div className="lcl-field lcl-full">
            <label>Description</label>
            <textarea
              rows="4"
              value={data.cta.description}
              onChange={(e) =>
                updateSection("cta", "description", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <div className="lcl-bottom-actions">
        <button
          type="button"
          className="lcl-reset-btn"
          onClick={restoreDefaults}
          disabled={resetting || saving}
        >
          <FaUndo />
          Restore Defaults
        </button>

        <button
          type="button"
          className="lcl-save-btn"
          onClick={saveData}
          disabled={saving || resetting}
        >
          <FaSave />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default LanguageCommunicationLabManagement;
