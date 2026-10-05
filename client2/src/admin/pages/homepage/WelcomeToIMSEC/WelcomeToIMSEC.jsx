import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaBriefcase,
  FaBuilding,
  FaMicroscope,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import {
  getAdminWelcomeToIMSEC,
  createWelcomeToIMSEC,
  updateWelcomeToIMSEC,
  publishWelcomeToIMSEC,
  unpublishWelcomeToIMSEC,
  deleteWelcomeToIMSEC,
} from "../../../services/welcomeToIMSECAdminService";

import "./WelcomeToIMSEC.css";

const DEFAULT_PILLARS = [
  {
    icon: "GraduationCap",
    title: "Academic Excellence",
    description:
      "Outcome-based curriculum mapped directly to futuristic industry trends.",
  },
  {
    icon: "Briefcase",
    title: "Elite Placements",
    description:
      "Dedicated placement cell tracking multi-national opportunities globally.",
  },
  {
    icon: "Building",
    title: "Modern Ecosystem",
    description:
      "State-of-the-art residential campus equipped with ultra-fast smart infrastructure.",
  },
  {
    icon: "Microscope",
    title: "Research Driven",
    description:
      "Incubating dynamic student startups and handling real-world global patents.",
  },
];

const EMPTY_FORM = {
  label: "Welcome to IMSEC",
  title: "Nurturing Innovations, Engineering Futures",
  description:
    "IMS Engineering College stands as a premier institution of technology learning in Northern India. We merge rigorous industry frameworks with forward-thinking research, preparing engineered minds to lead corporate tech landscapes.",
  imageUrl:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920",
  pillars: DEFAULT_PILLARS,
  isPublished: true,
  displayOrder: 1,
};

const WelcomeToIMSEC = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminWelcomeToIMSEC();

      setItems(response?.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load Welcome to IMSEC data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

  const handlePillarChange = (index, field, value) => {
    setForm((prev) => {
      const updatedPillars = [...prev.pillars];

      updatedPillars[index] = {
        ...updatedPillars[index],
        [field]: value,
      };

      return {
        ...prev,
        pillars: updatedPillars,
      };
    });
  };

  const handlePublishedChange = (e) => {
    setForm((prev) => ({
      ...prev,
      isPublished: e.target.checked,
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      pillars: DEFAULT_PILLARS.map((pillar) => ({
        ...pillar,
      })),
    });

    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setError("");
  };

  const handleAdd = () => {
    setForm({
      ...EMPTY_FORM,
      pillars: DEFAULT_PILLARS.map((pillar) => ({
        ...pillar,
      })),
    });

    setEditingId(null);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setForm({
      label: item.label || "",
      title: item.title || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      pillars:
        item.pillars?.length > 0
          ? item.pillars.map((pillar) => ({
              icon: pillar.icon || "GraduationCap",
              title: pillar.title || "",
              description: pillar.description || "",
            }))
          : DEFAULT_PILLARS.map((pillar) => ({
              ...pillar,
            })),
      isPublished: Boolean(item.isPublished),
      displayOrder: item.displayOrder || 0,
    });

    setEditingId(item._id);
    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!form.label.trim()) {
        setError("Welcome label is required.");
        return;
      }

      if (!form.title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!form.description.trim()) {
        setError("Description is required.");
        return;
      }

      if (!form.imageUrl.trim()) {
        setError("Image URL is required.");
        return;
      }

      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder) || 0,
      };

      if (editingId) {
        await updateWelcomeToIMSEC(editingId, payload);

        setMessage("Welcome to IMSEC updated successfully.");
      } else {
        await createWelcomeToIMSEC(payload);

        setMessage("Welcome to IMSEC created successfully.");
      }

      await loadData();

      setTimeout(() => {
        resetForm();
      }, 800);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save Welcome to IMSEC.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async (item) => {
    try {
      setError("");
      setMessage("");

      if (item.isPublished) {
        await unpublishWelcomeToIMSEC(item._id);

        setMessage("Welcome to IMSEC unpublished successfully.");
      } else {
        await publishWelcomeToIMSEC(item._id);

        setMessage("Welcome to IMSEC published successfully.");
      }

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update publish status.",
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Welcome to IMSEC section?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteWelcomeToIMSEC(id);

      setMessage("Welcome to IMSEC deleted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete Welcome to IMSEC.",
      );
    }
  };

  const getPillarIcon = (icon) => {
    switch (icon) {
      case "GraduationCap":
        return <FaGraduationCap />;

      case "Briefcase":
        return <FaBriefcase />;

      case "Building":
        return <FaBuilding />;

      case "Microscope":
        return <FaMicroscope />;

      default:
        return <FaGraduationCap />;
    }
  };

  return (
    <div className="welcome-admin-page">
      {/* HEADER */}
      <div className="welcome-admin-header">
        <div>
          <div className="welcome-admin-eyebrow">HOMEPAGE CONTENT</div>

          <h1>Welcome to IMSEC</h1>

          <p>Manage the Welcome to IMSEC section displayed on the homepage.</p>
        </div>

        {!showForm && (
          <button type="button" className="welcome-add-btn" onClick={handleAdd}>
            <FaPlus />
            Add Welcome Section
          </button>
        )}
      </div>

      {/* ALERTS */}
      {message && (
        <div className="welcome-alert success">
          <FaCheckCircle />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="welcome-alert error">
          <FaTimesCircle />
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="welcome-form-card">
          <div className="welcome-form-header">
            <div>
              <span>CONTENT MANAGEMENT</span>
              <h2>
                {editingId ? "Edit Welcome Section" : "Create Welcome Section"}
              </h2>
            </div>

            <button
              type="button"
              className="welcome-close-btn"
              onClick={resetForm}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="welcome-form-grid">
              {/* LABEL */}
              <div className="welcome-field full">
                <label>Welcome Label</label>

                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="Welcome to IMSEC"
                />
              </div>

              {/* TITLE */}
              <div className="welcome-field full">
                <label>Main Heading</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Nurturing Innovations, Engineering Futures"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="welcome-field full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter Welcome to IMSEC description..."
                />
              </div>

              {/* IMAGE */}
              <div className="welcome-field full">
                <label>Image URL</label>

                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />

                {form.imageUrl && (
                  <div className="welcome-image-preview">
                    <img src={form.imageUrl} alt="Welcome preview" />
                  </div>
                )}
              </div>
            </div>

            {/* PILLARS */}
            <div className="welcome-section-title">
              <span>FEATURE PILLARS</span>
              <h3>Welcome Section Highlights</h3>
            </div>

            <div className="welcome-pillars-grid">
              {form.pillars.map((pillar, index) => (
                <div className="welcome-pillar-card" key={index}>
                  <div className="welcome-pillar-number">0{index + 1}</div>

                  <div className="welcome-pillar-icon">
                    {getPillarIcon(pillar.icon)}
                  </div>

                  <div className="welcome-field">
                    <label>Icon</label>

                    <select
                      value={pillar.icon}
                      onChange={(e) =>
                        handlePillarChange(index, "icon", e.target.value)
                      }
                    >
                      <option value="GraduationCap">Graduation Cap</option>

                      <option value="Briefcase">Briefcase</option>

                      <option value="Building">Building</option>

                      <option value="Microscope">Microscope</option>
                    </select>
                  </div>

                  <div className="welcome-field">
                    <label>Title</label>

                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) =>
                        handlePillarChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="welcome-field">
                    <label>Description</label>

                    <textarea
                      rows="4"
                      value={pillar.description}
                      onChange={(e) =>
                        handlePillarChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* SETTINGS */}
            <div className="welcome-section-title">
              <span>DISPLAY SETTINGS</span>
              <h3>Publication Controls</h3>
            </div>

            <div className="welcome-settings">
              <div className="welcome-field">
                <label>Display Order</label>

                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <label className="welcome-publish-toggle">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={handlePublishedChange}
                />

                <span className="welcome-toggle-ui"></span>

                <span>
                  <strong>Published</strong>
                  <small>Show this section on homepage</small>
                </span>
              </label>
            </div>

            {/* ACTIONS */}
            <div className="welcome-form-actions">
              <button
                type="button"
                className="welcome-cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                type="submit"
                className="welcome-save-btn"
                disabled={saving}
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Section"
                    : "Save Section"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="welcome-table-card">
        <div className="welcome-table-header">
          <div>
            <span>MANAGED CONTENT</span>
            <h2>Homepage Welcome Sections</h2>
          </div>

          <div className="welcome-count">
            {items.length} {items.length === 1 ? "Record" : "Records"}
          </div>
        </div>

        {loading ? (
          <div className="welcome-loading">
            Loading Welcome to IMSEC data...
          </div>
        ) : items.length === 0 ? (
          <div className="welcome-empty">
            <div className="welcome-empty-icon">
              <FaGraduationCap />
            </div>

            <h3>No Welcome Section Found</h3>

            <p>Create your first Welcome to IMSEC homepage section.</p>

            <button
              type="button"
              className="welcome-add-btn"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Welcome Section
            </button>
          </div>
        ) : (
          <div className="welcome-table-wrapper">
            <table className="welcome-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CONTENT</th>
                  <th>PILLARS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="welcome-order">{item.displayOrder}</div>
                    </td>

                    <td>
                      <div className="welcome-content-cell">
                        <strong>{item.label}</strong>

                        <b>{item.title}</b>

                        <p>{item.description}</p>
                      </div>
                    </td>

                    <td>
                      <div className="welcome-pillar-count">
                        {item.pillars?.length || 0}
                      </div>
                    </td>

                    <td>
                      {item.isPublished ? (
                        <span className="welcome-status published">
                          <FaCheckCircle />
                          Published
                        </span>
                      ) : (
                        <span className="welcome-status draft">
                          <FaTimesCircle />
                          Unpublished
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="welcome-actions">
                        <button
                          type="button"
                          className="welcome-action edit"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className={`welcome-action ${
                            item.isPublished ? "unpublish" : "publish"
                          }`}
                          onClick={() => handlePublishToggle(item)}
                          title={item.isPublished ? "Unpublish" : "Publish"}
                        >
                          {item.isPublished ? (
                            <FaTimesCircle />
                          ) : (
                            <FaCheckCircle />
                          )}
                        </button>

                        <button
                          type="button"
                          className="welcome-action delete"
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeToIMSEC;
