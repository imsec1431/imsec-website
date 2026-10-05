import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import AccessDenied from "../auth/AccessDenied";

import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaStar,
  FaImage,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaTimes,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./DepartmentEvents.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const categories = [
  "Technical",
  "Workshop",
  "Coding Contest",
  "Competition",
  "Industrial Visit",
  "Alumni Talk",
  "Alumni Meet",
  "Cultural",
  "FDP",
  "National Conferences",
  "Conference",
  "Industrial Visit",
  "Sports",
  "seminar",
  "Guest Lecture",
  "webinar",
  "Social Activity",
  "Training & Internship Division",
  "Convocation",
  "Placement",
  "Value Education",
  "Other",
];

const emptyForm = {
  title: "",
  category: "Technical",
  date: "",
  venue: "",
  coordinator: "",
  description: "",

  featured: false,
  displayOrder: 1,

  linkedin: "",
  instagram: "",
  facebook: "",
  twitter: "",

  image: null,
};

const DepartmentEvents = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin } = useAuth();
  const isSubAdmin = admin?.role === "Sub Admin";

  const departmentPermission = useMemo(() => {
    if (!isSubAdmin) return null;
    return (
      (admin?.permissions?.departments || []).find(
        (item) => item?.slug?.toLowerCase() === slug?.toLowerCase(),
      ) || null
    );
  }, [admin, isSubAdmin, slug]);

  const eventsPermission = useMemo(() => {
    if (!isSubAdmin) return null;
    return (
      (departmentPermission?.modules || []).find(
        (item) => item?.key === "department-events",
      ) || null
    );
  }, [departmentPermission, isSubAdmin]);

  const canManageEvents =
    !isSubAdmin ||
    Boolean(
      departmentPermission?.enabled &&
      (eventsPermission?.enabled ||
        eventsPermission?.subModules?.some((item) => item?.enabled)),
    );

  const authHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [department, setDepartment] = useState(null);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState("");

  /* =====================================================
     MODAL STATE
  ===================================================== */

  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    event: null,
  });

  /* =====================================================
     SHOW MODAL
  ===================================================== */

  const showMessage = (type, title, message) => {
    setModal({
      show: true,
      type,
      title,
      message,
    });
  };

  const closeMessage = () => {
    setModal({
      show: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadData = async () => {
    try {
      setLoading(true);

      /* ===============================================
         GET DEPARTMENT
      =============================================== */

      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${slug}`,
        { headers: authHeaders() },
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult.message || "Failed to fetch department",
        );
      }

      const departmentData = departmentResult.data;

      setDepartment(departmentData);

      /* ===============================================
         GET EVENTS
      =============================================== */

      const eventsResponse = await fetch(
        `${API_URL}/department-events/department/${departmentData._id}`,
        { headers: authHeaders() },
      );

      const eventsResult = await eventsResponse.json();

      if (!eventsResponse.ok) {
        throw new Error(eventsResult.message || "Failed to fetch events");
      }

      setEvents(Array.isArray(eventsResult.data) ? eventsResult.data : []);
    } catch (error) {
      console.error("Load Department Events Error:", error);

      showMessage(
        "error",
        "Unable to Load Events",
        error.message || "Failed to load department events.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage(
        "error",
        "Invalid Image",
        "Please select a valid image file.",
      );

      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  /* =====================================================
     OPEN ADD
  ===================================================== */

  const handleAdd = () => {
    if (!canManageEvents) return;

    setEditingId(null);

    setFormData({
      ...emptyForm,
      displayOrder: events.length + 1,
    });

    setImagePreview("");

    setShowForm(true);
  };

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const handleEdit = (event) => {
    if (!canManageEvents) return;

    setEditingId(event._id);

    setFormData({
      title: event.title || "",
      category: event.category || "Technical",

      date: event.date ? event.date.substring(0, 10) : "",

      venue: event.venue || "",

      coordinator: event.coordinator || "",

      description: event.description || "",

      featured: Boolean(event.featured),

      displayOrder: event.displayOrder || 1,

      linkedin: event.socialLinks?.linkedin || "",

      instagram: event.socialLinks?.instagram || "",

      facebook: event.socialLinks?.facebook || "",

      twitter: event.socialLinks?.twitter || "",

      image: null,
    });

    setImagePreview(event.image || "");

    setShowForm(true);
  };

  /* =====================================================
     CLOSE FORM
  ===================================================== */

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setImagePreview("");
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManageEvents) {
      showMessage(
        "error",
        "Access Denied",
        "You do not have permission to manage department events.",
      );
      return;
    }

    if (!department?._id) {
      showMessage(
        "error",
        "Department Missing",
        "Department information could not be found.",
      );

      return;
    }

    if (!formData.title.trim()) {
      showMessage("error", "Validation Error", "Event title is required.");

      return;
    }

    if (!formData.category) {
      showMessage(
        "error",
        "Validation Error",
        "Please select an event category.",
      );

      return;
    }

    if (!formData.date) {
      showMessage("error", "Validation Error", "Event date is required.");

      return;
    }

    if (!formData.venue.trim()) {
      showMessage("error", "Validation Error", "Venue is required.");

      return;
    }

    if (!formData.coordinator.trim()) {
      showMessage("error", "Validation Error", "Coordinator is required.");

      return;
    }

    if (!formData.description.trim()) {
      showMessage("error", "Validation Error", "Description is required.");

      return;
    }

    if (!editingId && !formData.image) {
      showMessage("error", "Image Required", "Please select an event image.");

      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("departmentId", department._id);

      data.append("title", formData.title.trim());

      data.append("category", formData.category);

      data.append("date", formData.date);

      data.append("venue", formData.venue.trim());

      data.append("coordinator", formData.coordinator.trim());

      data.append("description", formData.description.trim());

      data.append("featured", formData.featured);

      data.append("displayOrder", formData.displayOrder);

      data.append("linkedin", formData.linkedin.trim());

      data.append("instagram", formData.instagram.trim());

      data.append("facebook", formData.facebook.trim());

      data.append("twitter", formData.twitter.trim());

      if (formData.image) {
        data.append("image", formData.image);
      }

      const url = editingId
        ? `${API_URL}/department-events/${editingId}`
        : `${API_URL}/department-events`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save event");
      }

      await loadData();

      handleCloseForm();

      showMessage(
        "success",
        editingId ? "Event Updated" : "Event Created",
        editingId
          ? "Department event has been updated successfully."
          : "Department event has been created successfully.",
      );
    } catch (error) {
      console.error("Save Event Error:", error);

      showMessage(
        "error",
        "Save Failed",
        error.message || "Failed to save event.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const openDeleteModal = (event) => {
    if (!canManageEvents) return;

    setDeleteModal({
      show: true,
      event,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      event: null,
    });
  };

  const handleDelete = async () => {
    if (!canManageEvents) return;

    const event = deleteModal.event;

    if (!event?._id) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/department-events/${event._id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event");
      }

      closeDeleteModal();

      await loadData();

      showMessage(
        "success",
        "Event Deleted",
        "Department event has been deleted successfully.",
      );
    } catch (error) {
      console.error("Delete Event Error:", error);

      closeDeleteModal();

      showMessage(
        "error",
        "Delete Failed",
        error.message || "Failed to delete event.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     FILTER EVENTS
  ===================================================== */

  const filteredEvents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return [...events]
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .filter((event) => {
        const matchSearch =
          !keyword ||
          event.title?.toLowerCase().includes(keyword) ||
          event.category?.toLowerCase().includes(keyword) ||
          event.venue?.toLowerCase().includes(keyword) ||
          event.coordinator?.toLowerCase().includes(keyword);

        const matchCategory =
          categoryFilter === "All" || event.category === categoryFilter;

        return matchSearch && matchCategory;
      });
  }, [events, search, categoryFilter]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (isSubAdmin && !canManageEvents) {
    return <AccessDenied />;
  }

  if (loading) {
    return (
      <div className="department-events-loading">
        <div className="department-events-spinner" />
        <p>Loading department events...</p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="department-events-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="department-events-header">
        <button
          type="button"
          className="department-events-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="department-events-heading">
          <div>
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{department?.name} — Events</h1>

            <p>
              Manage seminars, workshops, competitions, visits and other
              department events.
            </p>
          </div>

          <button
            type="button"
            className="department-events-add-btn"
            onClick={handleAdd}
            disabled={!canManageEvents}
          >
            <FaPlus />
            Add Event
          </button>
        </div>
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="department-events-toolbar">
        <div className="department-events-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="department-events-filter"
        >
          <option value="All">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* =================================================
          EVENT LIST
      ================================================= */}

      {filteredEvents.length === 0 ? (
        <div className="department-events-empty">
          <FaCalendarAlt />

          <h3>No Events Found</h3>

          <p>No department events have been added yet.</p>

          <button type="button" onClick={handleAdd} disabled={!canManageEvents}>
            <FaPlus />
            Add First Event
          </button>
        </div>
      ) : (
        <div className="department-events-grid">
          {filteredEvents.map((event) => (
            <div className="department-event-card" key={event._id}>
              {/* IMAGE */}

              <div className="department-event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="department-event-no-image">
                    <FaImage />
                  </div>
                )}

                {event.featured && (
                  <span className="department-event-featured">
                    <FaStar />
                    Featured
                  </span>
                )}

                <span className="department-event-order">
                  #{event.displayOrder}
                </span>
              </div>

              {/* CONTENT */}

              <div className="department-event-body">
                <span className="department-event-category">
                  {event.category}
                </span>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <div className="department-event-info">
                  <div>
                    <FaCalendarAlt />

                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>

                  <div>
                    <FaMapMarkerAlt />

                    <span>{event.venue}</span>
                  </div>

                  <div>
                    <FaUserTie />

                    <span>{event.coordinator}</span>
                  </div>
                </div>

                {/* SOCIAL LINKS */}

                <div className="department-event-social">
                  {event.socialLinks?.linkedin && (
                    <a
                      href={event.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                    >
                      <FaLinkedinIn />
                    </a>
                  )}

                  {event.socialLinks?.instagram && (
                    <a
                      href={event.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  )}

                  {event.socialLinks?.facebook && (
                    <a
                      href={event.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Facebook"
                    >
                      <FaFacebookF />
                    </a>
                  )}

                  {event.socialLinks?.twitter && (
                    <a
                      href={event.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="X / Twitter"
                    >
                      <FaXTwitter />
                    </a>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="department-event-actions">
                  <button
                    type="button"
                    className="department-event-edit"
                    onClick={() => handleEdit(event)}
                    disabled={!canManageEvents}
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="department-event-delete"
                    onClick={() => openDeleteModal(event)}
                    disabled={!canManageEvents}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (
        <div className="department-event-modal-overlay">
          <div className="department-event-modal">
            <div className="department-event-modal-header">
              <div>
                <span>DEPARTMENT EVENTS</span>

                <h2>{editingId ? "Edit Event" : "Add Event"}</h2>
              </div>

              <button type="button" onClick={handleCloseForm} disabled={saving}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="department-event-form">
              {/* BASIC INFORMATION */}

              <div className="event-form-section">
                <div className="event-form-section-heading">
                  <span>EVENT INFORMATION</span>

                  <h3>Basic Details</h3>
                </div>

                <div className="event-form-grid">
                  <div className="event-form-group full">
                    <label>Event Title *</label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="event-form-group">
                    <label>Category *</label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="event-form-group">
                    <label>Event Date *</label>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="event-form-group">
                    <label>Venue *</label>

                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="Seminar Hall"
                    />
                  </div>

                  <div className="event-form-group">
                    <label>Coordinator *</label>

                    <input
                      type="text"
                      name="coordinator"
                      value={formData.coordinator}
                      onChange={handleChange}
                      placeholder="Faculty / Team"
                    />
                  </div>

                  <div className="event-form-group full">
                    <label>Description *</label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE */}

              <div className="event-form-section">
                <div className="event-form-section-heading">
                  <span>EVENT IMAGE</span>

                  <h3>Cloudinary Image</h3>
                </div>

                <div className="event-image-upload">
                  <label className="event-image-upload-box">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : (
                      <>
                        <FaImage />

                        <strong>Choose Event Image</strong>

                        <small>JPG, PNG, WEBP</small>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* SOCIAL MEDIA */}

              <div className="event-form-section">
                <div className="event-form-section-heading">
                  <span>SOCIAL MEDIA</span>

                  <h3>Event Links</h3>

                  <p>Add social media links related to this event.</p>
                </div>

                <div className="event-social-grid">
                  <div className="event-form-group">
                    <label>
                      <FaLinkedinIn />
                      LinkedIn
                    </label>

                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>

                  <div className="event-form-group">
                    <label>
                      <FaInstagram />
                      Instagram
                    </label>

                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="event-form-group">
                    <label>
                      <FaFacebookF />
                      Facebook
                    </label>

                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="event-form-group">
                    <label>
                      <FaXTwitter />X / Twitter
                    </label>

                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://x.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* SETTINGS */}

              <div className="event-form-section">
                <div className="event-form-section-heading">
                  <span>DISPLAY SETTINGS</span>

                  <h3>Event Visibility</h3>
                </div>

                <div className="event-settings-grid">
                  <div className="event-form-group">
                    <label>Display Order</label>

                    <input
                      type="number"
                      name="displayOrder"
                      min="1"
                      value={formData.displayOrder}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="event-featured-toggle">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />

                    <span />

                    <div>
                      <strong>Featured Event</strong>

                      <small>Show this event as the featured event.</small>
                    </div>
                  </label>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="department-event-form-actions">
                <button
                  type="button"
                  className="event-cancel-btn"
                  onClick={handleCloseForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="event-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Event"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteModal.show && (
        <div className="department-event-modal-overlay">
          <div className="department-event-confirm-modal">
            <div className="delete-modal-icon">
              <FaTrash />
            </div>

            <h3>Delete Event?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteModal.event?.title}</strong>?
            </p>

            <small>The event image will also be removed from Cloudinary.</small>

            <div className="delete-modal-actions">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button type="button" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SUCCESS / ERROR MODAL
      ================================================= */}

      {modal.show && (
        <div className="department-event-modal-overlay">
          <div className={`department-event-message-modal ${modal.type}`}>
            <div className="message-modal-icon">
              {modal.type === "success" ? "✓" : "!"}
            </div>

            <h3>{modal.title}</h3>

            <p>{modal.message}</p>

            <button type="button" onClick={closeMessage}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentEvents;
