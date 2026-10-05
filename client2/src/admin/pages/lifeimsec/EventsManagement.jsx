import React, { useEffect, useMemo, useState } from "react";

import {
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaEdit,
  FaEye,
  FaFacebook,
  FaFilePdf,
  FaGlobe,
  FaImage,
  FaInstagram,
  FaLayerGroup,
  FaLinkedin,
  FaPlus,
  FaSave,
  FaSearch,
  FaStar,
  FaTimes,
  FaTrash,
  FaTwitter,
  FaBullhorn,
  FaYoutube,
} from "react-icons/fa";

import eventAdminService from "../../services/eventAdminService";
import "./EventsManagement.css";

/* =========================================================
   EMPTY EVENT
========================================================= */

const EMPTY_EVENT = {
  title: "",
  shortDescription: "",
  description: "",

  category: "General",
  eventType: "College Event",

  startDate: "",
  endDate: "",
  time: "",

  venue: "",
  organizer: "",
  department: "",
  program: "",
  academicYear: "",

  participants: "",

  status: "Upcoming",

  featured: false,
  published: true,

  image: {},

  /*
   * PDF IS NOW A LINK.
   */
  photoPdf: {
    url: "",
  },

  reportPdf: {
    url: "",
  },

  registrationLink: "",

  socialLinks: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
};

/* =========================================================
   DEFAULT PAGE DATA
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Events",
    subtitle: "Discover events, activities and memorable moments at IMSEC",
    breadcrumb: "Home / Life @ IMSEC / Events",
  },

  about: {
    title: "Events at IMSEC",
    description1: "",
    description2: "",
    image: {},
  },

  featuredEvent: null,

  latestEvents: {
    displayCount: 6,
    events: [],
  },

  memorableEvents: {
    displayCount: 6,
    events: [],
  },

  signatureEvents: {
    displayCount: 8,
    events: [],
  },

  statistics: {
    eventsEveryYear: "200+",
    participants: "15,000+",
    industrySpeakers: "500+",
    studentClubs: "50+",
  },

  cta: {
    title: "Be a Part of IMSEC Events",
    description:
      "Participate in events, activities and experiences that make campus life memorable.",
    buttonText: "Explore Events",
    buttonLink: "/events",
  },
};

/* =========================================================
   SAFE CLONE
========================================================= */

const clonePlain = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
};

/* =========================================================
   NORMALIZE EVENT
========================================================= */

const normalizeEvent = (event) => {
  const source = event || {};

  const allowedStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  const status = allowedStatuses.includes(String(source.status || "").trim())
    ? String(source.status).trim()
    : "Upcoming";

  return {
    ...clonePlain(EMPTY_EVENT),
    ...source,

    status,

    featured: source.featured === true,

    published: source.published !== false,

    socialLinks: {
      ...clonePlain(EMPTY_EVENT.socialLinks),
      ...(source.socialLinks || {}),
    },

    image: source.image || {},

    photoPdf: {
      ...clonePlain(EMPTY_EVENT.photoPdf),
      ...(source.photoPdf || {}),
    },

    reportPdf: {
      ...clonePlain(EMPTY_EVENT.reportPdf),
      ...(source.reportPdf || {}),
    },
  };
};

/* =========================================================
   NORMALIZE PAGE
========================================================= */

const normalizePageData = (server = {}) => ({
  ...clonePlain(DEFAULT_DATA),
  ...server,

  hero: {
    ...clonePlain(DEFAULT_DATA.hero),
    ...(server.hero || {}),
  },

  about: {
    ...clonePlain(DEFAULT_DATA.about),
    ...(server.about || {}),
  },

  latestEvents: {
    ...clonePlain(DEFAULT_DATA.latestEvents),
    ...(server.latestEvents || {}),
    events: server.latestEvents?.events || [],
  },

  memorableEvents: {
    ...clonePlain(DEFAULT_DATA.memorableEvents),
    ...(server.memorableEvents || {}),
    events: server.memorableEvents?.events || [],
  },

  signatureEvents: {
    ...clonePlain(DEFAULT_DATA.signatureEvents),
    ...(server.signatureEvents || {}),
    events: server.signatureEvents?.events || [],
  },

  statistics: {
    ...clonePlain(DEFAULT_DATA.statistics),
    ...(server.statistics || {}),
  },

  cta: {
    ...clonePlain(DEFAULT_DATA.cta),
    ...(server.cta || {}),
  },

  featuredEvent: server.featuredEvent
    ? normalizeEvent(server.featuredEvent)
    : null,
});

/* =========================================================
   EVENT MODAL
========================================================= */

const EventModal = ({ open, event, mode, onClose, onSave }) => {
  const [form, setForm] = useState(() => normalizeEvent(event));

  useEffect(() => {
    if (open) {
      setForm(normalizeEvent(event));
    }
  }, [open, event]);

  if (!open) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateSocial = (field, value) => {
    setForm((previous) => ({
      ...previous,

      socialLinks: {
        ...(previous.socialLinks || {}),
        [field]: value,
      },
    }));
  };

  /* -------------------------------------------------------
     IMAGE ONLY
  ------------------------------------------------------- */

  const updateImage = (file) => {
    setForm((previous) => ({
      ...previous,

      image: file,

      removeImage: false,
    }));
  };

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,

      image: null,

      removeImage: true,
    }));
  };

  /* -------------------------------------------------------
     PDF URL
  ------------------------------------------------------- */

  const updatePdfLink = (field, value) => {
    setForm((previous) => ({
      ...previous,

      [field]: {
        ...(previous[field] || {}),
        url: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter event title.");
      return;
    }

    onSave(form);
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        {/* HEADER */}

        <div className="event-modal-header">
          <div>
            <span className="event-modal-kicker">
              {mode === "edit"
                ? "EDIT EVENT"
                : mode === "featured"
                  ? "FEATURED EVENT"
                  : "NEW EVENT"}
            </span>

            <h2>
              {mode === "edit"
                ? "Edit Event"
                : mode === "featured"
                  ? "Featured Event"
                  : "Add Event"}
            </h2>

            <p>Enter complete event information.</p>
          </div>

          <button type="button" className="event-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          {/* =================================================
              BASIC
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>01</span>

              <div>
                <h3>Basic Information</h3>

                <p>Main event information.</p>
              </div>
            </div>

            <div className="event-form-grid">
              <div className="event-form-group full">
                <label>Event Title *</label>

                <input
                  value={form.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="event-form-group full">
                <label>Short Description</label>

                <textarea
                  rows="3"
                  value={form.shortDescription || ""}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="Short event description"
                />
              </div>

              <div className="event-form-group full">
                <label>Full Description</label>

                <textarea
                  rows="6"
                  value={form.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Complete event description"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              CLASSIFICATION
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>02</span>

              <div>
                <h3>Classification</h3>

                <p>Categorize the event.</p>
              </div>
            </div>

            <div className="event-form-grid">
              <div className="event-form-group">
                <label>Category</label>

                <select
                  value={form.category || "General"}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option>General</option>

                  <option>Academic</option>

                  <option>Cultural</option>

                  <option>Technical</option>

                  <option>Sports</option>

                  <option>Workshop</option>

                  <option>Seminar</option>

                  <option>Conference</option>

                  <option>FDP</option>

                  <option>Competition</option>

                  <option>Celebration</option>

                  <option>Placement</option>

                  <option>Alumni</option>

                  <option>Student Activity</option>

                  <option>Departmental</option>
                </select>
              </div>

              <div className="event-form-group">
                <label>Event Type</label>

                <select
                  value={form.eventType || "College Event"}
                  onChange={(e) => updateField("eventType", e.target.value)}
                >
                  <option>College Event</option>

                  <option>Departmental Event</option>

                  <option>Inter College</option>

                  <option>Intra College</option>

                  <option>National</option>

                  <option>International</option>

                  <option>Online</option>

                  <option>Offline</option>

                  <option>Hybrid</option>
                </select>
              </div>

              <div className="event-form-group">
                <label>Department</label>

                <input
                  value={form.department || ""}
                  onChange={(e) => updateField("department", e.target.value)}
                  placeholder="CSE / MCA / MBA"
                />
              </div>

              <div className="event-form-group">
                <label>Course / Program</label>

                <input
                  value={form.program || ""}
                  onChange={(e) => updateField("program", e.target.value)}
                  placeholder="B.Tech CSE"
                />
              </div>

              <div className="event-form-group">
                <label>Academic Year</label>

                <input
                  value={form.academicYear || ""}
                  onChange={(e) => updateField("academicYear", e.target.value)}
                  placeholder="2026-27"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              SCHEDULE
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>03</span>

              <div>
                <h3>Schedule & Venue</h3>

                <p>Date, time and location.</p>
              </div>
            </div>

            <div className="event-form-grid">
              <div className="event-form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>

              <div className="event-form-group">
                <label>End Date</label>

                <input
                  type="date"
                  value={form.endDate || ""}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </div>

              <div className="event-form-group">
                <label>Event Time</label>

                <input
                  value={form.time || ""}
                  onChange={(e) => updateField("time", e.target.value)}
                  placeholder="10:00 AM - 4:00 PM"
                />
              </div>

              <div className="event-form-group">
                <label>Venue</label>

                <input
                  value={form.venue || ""}
                  onChange={(e) => updateField("venue", e.target.value)}
                  placeholder="Auditorium"
                />
              </div>

              <div className="event-form-group">
                <label>Organizer</label>

                <input
                  value={form.organizer || ""}
                  onChange={(e) => updateField("organizer", e.target.value)}
                  placeholder="Department / Club"
                />
              </div>

              <div className="event-form-group">
                <label>Participants</label>

                <input
                  value={form.participants || ""}
                  onChange={(e) => updateField("participants", e.target.value)}
                  placeholder="500+ Students"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              STATUS
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>04</span>

              <div>
                <h3>Visibility & Status</h3>

                <p>Control publication.</p>
              </div>
            </div>

            <div className="event-form-grid">
              <div className="event-form-group">
                <label>Event Status</label>

                <select
                  value={form.status || "Upcoming"}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option>Upcoming</option>

                  <option>Ongoing</option>

                  <option>Completed</option>

                  <option>Cancelled</option>
                </select>
              </div>

              <label className="event-toggle">
                <input
                  type="checkbox"
                  checked={!!form.published}
                  onChange={(e) => updateField("published", e.target.checked)}
                />

                <span />

                <div>
                  <strong>Published</strong>

                  <small>Show on public website.</small>
                </div>
              </label>

              <label className="event-toggle">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                />

                <span />

                <div>
                  <strong>Featured</strong>

                  <small>Highlight this event.</small>
                </div>
              </label>
            </div>
          </section>

          {/* =================================================
              IMAGE + PDF LINKS
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>05</span>

              <div>
                <h3>Photos & Documents</h3>

                <p>Upload photos and add PDF links.</p>
              </div>
            </div>

            {/* IMAGE */}

            <div className="event-upload-grid">
              <UploadBox
                icon={<FaImage />}
                title="Event Photo"
                help="JPG, JPEG, PNG, WEBP"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                value={form.image}
                onChange={updateImage}
                onRemove={removeImage}
              />
            </div>

            {/* PDF LINKS */}

            <div
              className="event-form-grid"
              style={{
                marginTop: "18px",
              }}
            >
              <div className="event-form-group">
                <label>
                  <FaFilePdf />
                  Photo PDF Link
                </label>

                <input
                  type="url"
                  value={form.photoPdf?.url || ""}
                  onChange={(e) => updatePdfLink("photoPdf", e.target.value)}
                  placeholder="https://example.com/event-photos.pdf"
                />

                {form.photoPdf?.url && (
                  <a
                    href={form.photoPdf.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      color: "#123f7a",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    <FaEye /> Open Photo PDF
                  </a>
                )}
              </div>

              <div className="event-form-group">
                <label>
                  <FaFilePdf />
                  Event Report PDF Link
                </label>

                <input
                  type="url"
                  value={form.reportPdf?.url || ""}
                  onChange={(e) => updatePdfLink("reportPdf", e.target.value)}
                  placeholder="https://example.com/event-report.pdf"
                />

                {form.reportPdf?.url && (
                  <a
                    href={form.reportPdf.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      color: "#123f7a",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    <FaEye /> Open Event Report
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              LINKS
          ================================================= */}

          <section className="event-form-section">
            <div className="event-form-section-title">
              <span>06</span>

              <div>
                <h3>Links</h3>

                <p>Registration and social media links.</p>
              </div>
            </div>

            <div className="event-form-grid">
              <div className="event-form-group full">
                <label>Registration Link</label>

                <input
                  type="url"
                  value={form.registrationLink || ""}
                  onChange={(e) =>
                    updateField("registrationLink", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <SocialInput
                icon={<FaFacebook />}
                label="Facebook"
                value={form.socialLinks?.facebook || ""}
                onChange={(value) => updateSocial("facebook", value)}
              />

              <SocialInput
                icon={<FaInstagram />}
                label="Instagram"
                value={form.socialLinks?.instagram || ""}
                onChange={(value) => updateSocial("instagram", value)}
              />

              <SocialInput
                icon={<FaYoutube />}
                label="YouTube"
                value={form.socialLinks?.youtube || ""}
                onChange={(value) => updateSocial("youtube", value)}
              />

              <SocialInput
                icon={<FaLinkedin />}
                label="LinkedIn"
                value={form.socialLinks?.linkedin || ""}
                onChange={(value) => updateSocial("linkedin", value)}
              />

              <SocialInput
                icon={<FaTwitter />}
                label="Twitter / X"
                value={form.socialLinks?.twitter || ""}
                onChange={(value) => updateSocial("twitter", value)}
              />

              <SocialInput
                icon={<FaGlobe />}
                label="Website"
                value={form.socialLinks?.website || ""}
                onChange={(value) => updateSocial("website", value)}
              />
            </div>
          </section>

          {/* FOOTER */}

          <div className="event-modal-footer">
            <button
              type="button"
              className="events-btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="events-btn primary">
              <FaSave />
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   IMAGE UPLOAD BOX
========================================================= */

const UploadBox = ({
  icon,
  title,
  help,
  accept,
  value,
  onChange,
  onRemove,
}) => {
  const isFile = typeof File !== "undefined" && value instanceof File;

  const previewUrl = isFile ? URL.createObjectURL(value) : value?.url || "";

  return (
    <div className="event-upload-box">
      {!value && (
        <label>
          {icon}

          <span>{title}</span>

          <small>{help}</small>

          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                onChange(file);
              }

              e.target.value = "";
            }}
          />
        </label>
      )}

      {value && (
        <div className="event-uploaded-file">
          {previewUrl ? (
            <img src={previewUrl} alt={title} />
          ) : (
            <div className="event-uploaded-pdf">
              <FaImage />
            </div>
          )}

          <div>
            <strong>{title}</strong>

            <small>{value.name || value.fileName || "Uploaded image"}</small>
          </div>

          {!isFile && value.url && (
            <a href={value.url} target="_blank" rel="noreferrer">
              View
            </a>
          )}

          <button type="button" onClick={onRemove}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SOCIAL INPUT
========================================================= */

const SocialInput = ({ icon, label, value, onChange }) => (
  <div className="event-form-group">
    <label>
      {icon}
      {label}
    </label>

    <input
      type="url"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`${label} URL`}
    />
  </div>
);

/* =========================================================
   EVENT ROW
========================================================= */

const EventRow = ({ event, index, onView, onEdit, onDelete }) => (
  <tr>
    <td>
      <span className="event-table-number">
        {String(index + 1).padStart(2, "0")}
      </span>
    </td>

    <td>
      <div className="event-table-event">
        {event.image?.url ? (
          <img src={event.image.url} alt={event.title} />
        ) : (
          <div className="event-table-placeholder">
            <FaCalendarAlt />
          </div>
        )}

        <div>
          <strong>{event.title || "Untitled Event"}</strong>

          <span>{event.category || "General"}</span>
        </div>
      </div>
    </td>

    <td>{event.startDate || "—"}</td>

    <td>{event.department || "General"}</td>

    <td>
      <span
        className={`event-status-badge ${String(event.status || "Upcoming")
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        {event.status || "Upcoming"}
      </span>
    </td>

    <td>
      {event.featured ? (
        <span className="event-featured-badge">
          <FaStar />
          Featured
        </span>
      ) : (
        <span className="event-normal-badge">Standard</span>
      )}
    </td>

    <td>
      <div className="event-row-actions">
        <button type="button" title="View" onClick={() => onView(event)}>
          <FaEye />
        </button>

        <button type="button" title="Edit" onClick={() => onEdit(event)}>
          <FaEdit />
        </button>

        <button
          type="button"
          title="Delete"
          className="danger"
          onClick={() => onDelete(event)}
        >
          <FaTrash />
        </button>
      </div>
    </td>
  </tr>
);

/* =========================================================
   MAIN
========================================================= */

const EventsManagement = () => {
  const [data, setData] = useState(clonePlain(DEFAULT_DATA));

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  const [search, setSearch] = useState("");

  const [modal, setModal] = useState({
    open: false,
    mode: "add",
    event: null,
  });

  const [viewEvent, setViewEvent] = useState(null);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadEvents = async () => {
    try {
      setLoading(true);

      const response = await eventAdminService.getEventsAdmin();

      if (response?.data?.success) {
        setData(normalizePageData(response.data.data));
      }
    } catch (error) {
      console.error("LOAD EVENTS ERROR:", error);

      alert(error?.response?.data?.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaLayerGroup />,
    },

    {
      id: "featured",
      label: "Featured",
      icon: <FaStar />,
    },

    {
      id: "latest",
      label: "Latest Events",
      icon: <FaCalendarAlt />,
      count: data.latestEvents?.events?.length || 0,
    },

    {
      id: "memorable",
      label: "Memorable Events",
      icon: <FaCalendarAlt />,
      count: data.memorableEvents?.events?.length || 0,
    },

    {
      id: "signature",
      label: "Signature Events",
      icon: <FaCalendarAlt />,
      count: data.signatureEvents?.events?.length || 0,
    },

    {
      id: "content",
      label: "Page Content",
      icon: <FaEdit />,
    },

    {
      id: "statistics",
      label: "Statistics",
      icon: <FaChartBar />,
    },

    {
      id: "cta",
      label: "CTA",
      icon: <FaBullhorn />,
    },
  ];

  /* =======================================================
     ACTIVE SECTION
  ======================================================= */

  const activeSection =
    activeTab === "latest"
      ? data.latestEvents
      : activeTab === "memorable"
        ? data.memorableEvents
        : activeTab === "signature"
          ? data.signatureEvents
          : null;

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredEvents = useMemo(() => {
    if (!activeSection) {
      return [];
    }

    const events = activeSection.events || [];

    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return events;
    }

    return events.filter(
      (event) =>
        String(event.title || "")
          .toLowerCase()
          .includes(keyword) ||
        String(event.category || "")
          .toLowerCase()
          .includes(keyword) ||
        String(event.department || "")
          .toLowerCase()
          .includes(keyword) ||
        String(event.program || "")
          .toLowerCase()
          .includes(keyword),
    );
  }, [activeSection, search]);

  /* =======================================================
     UPDATE DATA
  ======================================================= */

  const updateData = (parent, field, value) => {
    setData((previous) => ({
      ...previous,

      [parent]: {
        ...(previous[parent] || {}),
        [field]: value,
      },
    }));
  };

  /* =======================================================
     ADD
  ======================================================= */

  const openAddEvent = () => {
    setModal({
      open: true,
      mode: "add",
      event: normalizeEvent(null),
    });
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const openEditEvent = (event) => {
    setModal({
      open: true,
      mode: "edit",
      event: normalizeEvent(event),
    });
  };

  /* =======================================================
     SAVE EVENT TO STATE
  ======================================================= */

  const handleEventSave = (event) => {
    if (!["latest", "memorable", "signature"].includes(activeTab)) {
      return;
    }

    const sectionKey = `${activeTab}Events`;
    const cleanEvent = normalizeEvent(event);

    setData((previous) => {
      const section = previous[sectionKey] || {
        displayCount: 6,
        events: [],
      };

      const events = [...(section.events || [])];

      if (modal.mode === "add") {
        events.push(cleanEvent);
      } else {
        const index = events.findIndex(
          (item) => String(item._id) === String(cleanEvent._id),
        );

        if (index >= 0) {
          events[index] = {
            ...events[index],
            ...cleanEvent,

            status: cleanEvent.status,
            published: cleanEvent.published,
            featured: cleanEvent.featured,

            socialLinks: {
              ...(events[index].socialLinks || {}),
              ...(cleanEvent.socialLinks || {}),
            },

            photoPdf: {
              ...(cleanEvent.photoPdf || {}),
            },

            reportPdf: {
              ...(cleanEvent.reportPdf || {}),
            },
          };
        }
      }

      return {
        ...previous,

        [sectionKey]: {
          ...section,
          events,
        },
      };
    });

    setModal({
      open: false,
      mode: "add",
      event: null,
    });
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (event) => {
    if (!event?._id) {
      alert("This event has not been saved yet.");
      return;
    }

    if (!window.confirm(`Delete "${event.title}"?`)) {
      return;
    }

    try {
      setSaving(true);

      const response = await eventAdminService.deleteEvent(
        activeTab,
        event._id,
      );

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Unable to delete event.");
      }

      const sectionKey = `${activeTab}Events`;

      setData((previous) => {
        const section = previous[sectionKey] || {
          displayCount: 6,
          events: [],
        };

        return {
          ...previous,

          [sectionKey]: {
            ...section,

            events: (section.events || []).filter(
              (item) => String(item._id) !== String(event._id),
            ),
          },
        };
      });

      await loadEvents();

      alert(response?.data?.message || "Event deleted successfully.");
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete event.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     PREPARE EVENT FOR JSON
  ======================================================= */

  const prepareEventForJson = (event) => {
    const source = event || {};

    const allowedStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

    const status = allowedStatuses.includes(String(source.status || "").trim())
      ? String(source.status).trim()
      : "Upcoming";

    return {
      ...source,

      status,

      published: source.published !== false,

      featured: source.featured === true,

      socialLinks: {
        ...(source.socialLinks || {}),
      },

      /*
       * IMAGE FILE MUST NOT GO INSIDE
       * JSON. It is appended separately.
       */

      image:
        typeof File !== "undefined" && source.image instanceof File
          ? {}
          : source.image || {},

      /*
       * PDF IS ONLY A URL.
       */

      photoPdf: {
        ...(source.photoPdf || {}),
      },

      reportPdf: {
        ...(source.reportPdf || {}),
      },
    };
  };

  /* =======================================================
     BUILD FORM DATA
  ======================================================= */

  const buildFormData = () => {
    const formData = new FormData();

    const payload = {
      ...data,

      hero: {
        ...(data.hero || {}),
      },

      about: {
        ...(data.about || {}),

        image:
          typeof File !== "undefined" && data.about?.image instanceof File
            ? {}
            : data.about?.image || {},
      },

      latestEvents: {
        ...(data.latestEvents || {}),

        events: (data.latestEvents?.events || []).map(prepareEventForJson),
      },

      memorableEvents: {
        ...(data.memorableEvents || {}),

        events: (data.memorableEvents?.events || []).map(prepareEventForJson),
      },

      signatureEvents: {
        ...(data.signatureEvents || {}),

        events: (data.signatureEvents?.events || []).map(prepareEventForJson),
      },

      featuredEvent: data.featuredEvent
        ? prepareEventForJson(data.featuredEvent)
        : null,

      statistics: {
        ...(data.statistics || {}),
      },

      cta: {
        ...(data.cta || {}),
      },
    };

    formData.append("data", JSON.stringify(payload));

    /* -----------------------------------------------------
       ONLY IMAGE FILES
    ----------------------------------------------------- */

    const appendImages = (events, prefix) => {
      (events || []).forEach((event, index) => {
        if (typeof File !== "undefined" && event.image instanceof File) {
          formData.append(`${prefix}_${index}_image`, event.image);
        }
      });
    };

    appendImages(data.latestEvents?.events, "latest");

    appendImages(data.memorableEvents?.events, "memorable");

    appendImages(data.signatureEvents?.events, "signature");

    /* -----------------------------------------------------
       FEATURED IMAGE
    ----------------------------------------------------- */

    if (
      data.featuredEvent &&
      typeof File !== "undefined" &&
      data.featuredEvent.image instanceof File
    ) {
      formData.append("featured_image", data.featuredEvent.image);
    }

    /* -----------------------------------------------------
       ABOUT IMAGE
    ----------------------------------------------------- */

    if (typeof File !== "undefined" && data.about?.image instanceof File) {
      formData.append("about_image", data.about.image);
    }

    return formData;
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const saveAll = async () => {
    try {
      setSaving(true);

      const formData = buildFormData();

      const response = await eventAdminService.updateEventsAdmin(formData);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Unable to save events.");
      }

      await loadEvents();

      alert(response?.data?.message || "Events saved successfully.");
    } catch (error) {
      console.error("SAVE EVENTS ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save events.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetDefaults = async () => {
    if (!window.confirm("Reset the complete Events page?")) {
      return;
    }

    try {
      setSaving(true);

      await eventAdminService.resetEventsDefaults();

      await loadEvents();
    } catch (error) {
      console.error("RESET EVENTS ERROR:", error);

      alert(error?.response?.data?.message || "Unable to reset events.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="events-management-loading">
        <div className="events-loading-spinner" />

        <h3>Loading Events</h3>

        <p>Preparing Events Management...</p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="events-management">
      {/* HEADER */}

      <header className="events-management-header">
        <div>
          <span className="events-header-kicker">LIFE @ IMSEC</span>

          <h1>Events Management</h1>

          <p>
            Manage events, featured content, photos, PDF links and social media.
          </p>
        </div>

        <div className="events-header-actions">
          <button
            type="button"
            className="events-btn secondary"
            onClick={resetDefaults}
            disabled={saving}
          >
            Reset
          </button>

          <button
            type="button"
            className="events-btn primary"
            onClick={saveAll}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* TABS */}

      <div className="events-admin-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => {
              setActiveTab(tab.id);

              setSearch("");
            }}
          >
            <span className="events-tab-icon">{tab.icon}</span>

            <span className="events-tab-label">{tab.label}</span>

            {typeof tab.count === "number" && (
              <span className="events-tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===================================================
          OVERVIEW
      =================================================== */}

      {activeTab === "overview" && (
        <div className="events-overview">
          <div className="events-overview-grid">
            <OverviewCard
              icon={<FaCalendarAlt />}
              number={data.latestEvents?.events?.length || 0}
              label="Latest Events"
              onClick={() => setActiveTab("latest")}
            />

            <OverviewCard
              icon={<FaCalendarAlt />}
              number={data.memorableEvents?.events?.length || 0}
              label="Memorable Events"
              onClick={() => setActiveTab("memorable")}
            />

            <OverviewCard
              icon={<FaCalendarAlt />}
              number={data.signatureEvents?.events?.length || 0}
              label="Signature Events"
              onClick={() => setActiveTab("signature")}
            />

            <OverviewCard
              icon={<FaStar />}
              number={data.featuredEvent ? 1 : 0}
              label="Featured Event"
              onClick={() => setActiveTab("featured")}
            />
          </div>

          <div className="events-overview-bottom">
            <div className="events-overview-card">
              <div className="events-card-heading">
                <div>
                  <span>PUBLIC DISPLAY</span>

                  <h2>Event Sections</h2>
                </div>
              </div>

              <OverviewRow
                label="Latest Events"
                total={data.latestEvents?.events?.length || 0}
                display={data.latestEvents?.displayCount || 0}
              />

              <OverviewRow
                label="Memorable Events"
                total={data.memorableEvents?.events?.length || 0}
                display={data.memorableEvents?.displayCount || 0}
              />

              <OverviewRow
                label="Signature Events"
                total={data.signatureEvents?.events?.length || 0}
                display={data.signatureEvents?.displayCount || 0}
              />
            </div>

            <div className="events-overview-card">
              <div className="events-card-heading">
                <div>
                  <span>STATISTICS</span>

                  <h2>Public Numbers</h2>
                </div>
              </div>

              <div className="events-mini-stats">
                <div>
                  <strong>{data.statistics?.eventsEveryYear}</strong>

                  <span>Events / Year</span>
                </div>

                <div>
                  <strong>{data.statistics?.participants}</strong>

                  <span>Participants</span>
                </div>

                <div>
                  <strong>{data.statistics?.industrySpeakers}</strong>

                  <span>Speakers</span>
                </div>

                <div>
                  <strong>{data.statistics?.studentClubs}</strong>

                  <span>Clubs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          FEATURED
      =================================================== */}

      {activeTab === "featured" && (
        <FeaturedTab
          featuredEvent={data.featuredEvent}
          onAdd={() =>
            setModal({
              open: true,
              mode: "featured",
              event: normalizeEvent(data.featuredEvent),
            })
          }
          onRemove={async () => {
            if (!window.confirm("Remove featured event?")) {
              return;
            }

            try {
              await eventAdminService.deleteFeaturedEvent();

              await loadEvents();
            } catch (error) {
              alert(
                error?.response?.data?.message ||
                  "Unable to remove featured event.",
              );
            }
          }}
        />
      )}

      {/* ===================================================
          EVENT SECTIONS
      =================================================== */}

      {["latest", "memorable", "signature"].includes(activeTab) && (
        <EventSectionTab
          title={
            activeTab === "latest"
              ? "Latest Events"
              : activeTab === "memorable"
                ? "Memorable Events"
                : "Signature Events"
          }
          section={activeSection}
          events={filteredEvents}
          search={search}
          setSearch={setSearch}
          onAdd={openAddEvent}
          onView={setViewEvent}
          onEdit={openEditEvent}
          onDelete={handleDelete}
          onDisplayCount={(value) =>
            updateData(`${activeTab}Events`, "displayCount", Number(value) || 0)
          }
        />
      )}

      {/* CONTENT */}

      {activeTab === "content" && <ContentTab data={data} setData={setData} />}

      {/* STATISTICS */}

      {activeTab === "statistics" && (
        <StatisticsTab
          statistics={data.statistics}
          update={(field, value) => updateData("statistics", field, value)}
        />
      )}

      {/* CTA */}

      {activeTab === "cta" && (
        <CtaTab
          cta={data.cta}
          update={(field, value) => updateData("cta", field, value)}
        />
      )}

      {/* VIEW */}

      {viewEvent && (
        <ViewEventModal event={viewEvent} onClose={() => setViewEvent(null)} />
      )}

      {/* EVENT MODAL */}

      <EventModal
        open={modal.open}
        event={modal.event}
        mode={modal.mode}
        onClose={() =>
          setModal({
            open: false,
            mode: "add",
            event: null,
          })
        }
        onSave={(event) => {
          if (modal.mode === "featured") {
            setData((previous) => ({
              ...previous,

              featuredEvent: {
                ...normalizeEvent(event),
                featured: true,
              },
            }));

            setModal({
              open: false,
              mode: "add",
              event: null,
            });

            return;
          }

          handleEventSave(event);
        }}
      />

      {/* SAVE BAR */}

      <div className="events-save-bar">
        <div>
          <FaCheckCircle />

          <span>Unsaved changes are kept until you save.</span>
        </div>

        <button type="button" onClick={saveAll} disabled={saving}>
          <FaSave />

          {saving ? "Saving..." : "Save Events"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   OVERVIEW CARD
========================================================= */

const OverviewCard = ({ icon, number, label, onClick }) => (
  <button type="button" className="events-overview-stat" onClick={onClick}>
    <div className="events-overview-stat-icon">{icon}</div>

    <div>
      <strong>{number}</strong>

      <span>{label}</span>
    </div>
  </button>
);

/* =========================================================
   OVERVIEW ROW
========================================================= */

const OverviewRow = ({ label, total, display }) => (
  <div className="events-overview-row">
    <span>{label}</span>

    <div>
      <strong>{display}</strong>

      <small>/ {total} stored</small>
    </div>
  </div>
);

/* =========================================================
   EVENT SECTION
========================================================= */

const EventSectionTab = ({
  title,
  section,
  events,
  search,
  setSearch,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onDisplayCount,
}) => {
  const safeSection = section || {
    displayCount: 6,
    events: [],
  };

  return (
    <div className="events-section-page">
      <div className="events-section-page-header">
        <div>
          <span>EVENT COLLECTION</span>

          <h2>{title}</h2>

          <p>
            {safeSection.events?.length || 0} events stored in this section.
          </p>
        </div>

        <button type="button" className="events-btn primary" onClick={onAdd}>
          <FaPlus />
          Add Event
        </button>
      </div>

      <div className="events-section-controls">
        <div className="event-display-control">
          <label>Public Display Count</label>

          <input
            type="number"
            min="0"
            value={safeSection.displayCount ?? 0}
            onChange={(e) => onDisplayCount(e.target.value)}
          />

          <span>Number initially shown publicly.</span>
        </div>

        <div className="events-search">
          <FaSearch />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
          />
        </div>
      </div>

      <div className="events-table-card">
        <div className="events-table-header">
          <div>
            <span>{safeSection.events?.length || 0} TOTAL</span>

            <h2>{title}</h2>
          </div>

          <div className="events-public-count">
            Public: <strong>{safeSection.displayCount}</strong>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Feature</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event, index) => (
                  <EventRow
                    key={event._id || `${event.title}-${index}`}
                    event={event}
                    index={index}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="events-empty">
            <FaCalendarAlt />

            <h3>No Events Found</h3>

            <p>Add an event to this section.</p>

            <button
              type="button"
              className="events-btn primary"
              onClick={onAdd}
            >
              <FaPlus />
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   FEATURED TAB
========================================================= */

const FeaturedTab = ({ featuredEvent, onAdd, onRemove }) => (
  <div className="events-section-page">
    <div className="events-section-page-header">
      <div>
        <span>PUBLIC HIGHLIGHT</span>

        <h2>Featured Event</h2>

        <p>Select one event to highlight prominently.</p>
      </div>

      <button type="button" className="events-btn primary" onClick={onAdd}>
        <FaPlus />

        {featuredEvent ? "Edit Featured" : "Add Featured"}
      </button>
    </div>

    {featuredEvent ? (
      <div className="featured-event-preview">
        {featuredEvent.image?.url ? (
          <img src={featuredEvent.image.url} alt={featuredEvent.title} />
        ) : (
          <div className="featured-placeholder">
            <FaCalendarAlt />
          </div>
        )}

        <div className="featured-event-content">
          <span className="event-featured-label">FEATURED EVENT</span>

          <h3>{featuredEvent.title || "Featured Event"}</h3>

          <p>
            {featuredEvent.description ||
              featuredEvent.shortDescription ||
              "No description added."}
          </p>

          <div className="featured-meta">
            <span>{featuredEvent.startDate || "Date not set"}</span>

            <span>{featuredEvent.venue || "Venue not set"}</span>

            <span>{featuredEvent.department || "General"}</span>
          </div>

          <button
            type="button"
            className="featured-remove-btn"
            onClick={onRemove}
          >
            <FaTrash />
            Remove Featured
          </button>
        </div>
      </div>
    ) : (
      <div className="featured-empty">
        <FaStar />

        <h3>No Featured Event</h3>

        <p>Add a featured event to highlight it on the public page.</p>
      </div>
    )}
  </div>
);

/* =========================================================
   CONTENT TAB
========================================================= */

const ContentTab = ({ data, setData }) => {
  const update = (parent, field, value) => {
    setData((previous) => ({
      ...previous,

      [parent]: {
        ...(previous[parent] || {}),
        [field]: value,
      },
    }));
  };

  return (
    <div className="events-settings-card">
      <div className="events-settings-title">
        <div>
          <h2>Page Content</h2>

          <span>Hero and introduction</span>
        </div>
      </div>

      <div className="events-settings-grid">
        <div>
          <label>Hero Title</label>

          <input
            value={data.hero?.title || ""}
            onChange={(e) => update("hero", "title", e.target.value)}
          />
        </div>

        <div>
          <label>Hero Subtitle</label>

          <input
            value={data.hero?.subtitle || ""}
            onChange={(e) => update("hero", "subtitle", e.target.value)}
          />
        </div>

        <div className="full">
          <label>Breadcrumb</label>

          <input
            value={data.hero?.breadcrumb || ""}
            onChange={(e) => update("hero", "breadcrumb", e.target.value)}
          />
        </div>

        <div className="full">
          <label>About Title</label>

          <input
            value={data.about?.title || ""}
            onChange={(e) => update("about", "title", e.target.value)}
          />
        </div>

        <div className="full">
          <label>About Description 1</label>

          <textarea
            rows="5"
            value={data.about?.description1 || ""}
            onChange={(e) => update("about", "description1", e.target.value)}
          />
        </div>

        <div className="full">
          <label>About Description 2</label>

          <textarea
            rows="5"
            value={data.about?.description2 || ""}
            onChange={(e) => update("about", "description2", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STATISTICS
========================================================= */

const StatisticsTab = ({ statistics, update }) => (
  <div className="events-settings-card">
    <div className="events-settings-title">
      <div>
        <h2>Statistics</h2>

        <span>Numbers displayed on the public Events page.</span>
      </div>
    </div>

    <div className="events-stats-grid">
      <div>
        <label>Events Every Year</label>

        <input
          value={statistics?.eventsEveryYear || ""}
          onChange={(e) => update("eventsEveryYear", e.target.value)}
        />
      </div>

      <div>
        <label>Participants</label>

        <input
          value={statistics?.participants || ""}
          onChange={(e) => update("participants", e.target.value)}
        />
      </div>

      <div>
        <label>Industry Speakers</label>

        <input
          value={statistics?.industrySpeakers || ""}
          onChange={(e) => update("industrySpeakers", e.target.value)}
        />
      </div>

      <div>
        <label>Student Clubs</label>

        <input
          value={statistics?.studentClubs || ""}
          onChange={(e) => update("studentClubs", e.target.value)}
        />
      </div>
    </div>
  </div>
);

/* =========================================================
   CTA
========================================================= */

const CtaTab = ({ cta, update }) => (
  <div className="events-settings-card">
    <div className="events-settings-title">
      <div>
        <h2>Call To Action</h2>

        <span>Bottom section of public page.</span>
      </div>
    </div>

    <div className="events-settings-grid">
      <div>
        <label>CTA Title</label>

        <input
          value={cta?.title || ""}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div>
        <label>Button Text</label>

        <input
          value={cta?.buttonText || ""}
          onChange={(e) => update("buttonText", e.target.value)}
        />
      </div>

      <div>
        <label>Button Link</label>

        <input
          value={cta?.buttonLink || ""}
          onChange={(e) => update("buttonLink", e.target.value)}
        />
      </div>

      <div className="full">
        <label>Description</label>

        <textarea
          rows="5"
          value={cta?.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>
    </div>
  </div>
);

/* =========================================================
   VIEW EVENT
========================================================= */

const ViewEventModal = ({ event, onClose }) => (
  <div className="event-modal-overlay">
    <div className="event-view-modal">
      <button type="button" className="event-modal-close" onClick={onClose}>
        <FaTimes />
      </button>

      {event.image?.url && (
        <img
          className="event-view-image"
          src={event.image.url}
          alt={event.title}
        />
      )}

      <div className="event-view-content">
        <span className="event-modal-kicker">{event.category || "EVENT"}</span>

        <h2>{event.title || "Untitled Event"}</h2>

        <p className="event-view-description">
          {event.description ||
            event.shortDescription ||
            "No description available."}
        </p>

        <div className="event-view-grid">
          <div>
            <small>Event Type</small>

            <strong>{event.eventType || "—"}</strong>
          </div>

          <div>
            <small>Start Date</small>

            <strong>{event.startDate || "—"}</strong>
          </div>

          <div>
            <small>End Date</small>

            <strong>{event.endDate || "—"}</strong>
          </div>

          <div>
            <small>Time</small>

            <strong>{event.time || "—"}</strong>
          </div>

          <div>
            <small>Venue</small>

            <strong>{event.venue || "—"}</strong>
          </div>

          <div>
            <small>Department</small>

            <strong>{event.department || "—"}</strong>
          </div>

          <div>
            <small>Program</small>

            <strong>{event.program || "—"}</strong>
          </div>

          <div>
            <small>Academic Year</small>

            <strong>{event.academicYear || "—"}</strong>
          </div>

          <div>
            <small>Participants</small>

            <strong>{event.participants || "—"}</strong>
          </div>
        </div>

        {/* PDF LINKS */}

        <div className="event-view-files">
          {event.photoPdf?.url && (
            <a href={event.photoPdf.url} target="_blank" rel="noreferrer">
              <FaFilePdf />
              View Photo PDF
            </a>
          )}

          {event.reportPdf?.url && (
            <a href={event.reportPdf.url} target="_blank" rel="noreferrer">
              <FaFilePdf />
              View Event Report
            </a>
          )}

          {event.registrationLink && (
            <a href={event.registrationLink} target="_blank" rel="noreferrer">
              <FaGlobe />
              Registration
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default EventsManagement;
