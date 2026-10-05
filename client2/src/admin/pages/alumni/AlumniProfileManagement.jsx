import React, { useEffect, useState } from "react";
import {
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaUsers,
  FaTrophy,
  FaQuoteLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaImage,
} from "react-icons/fa";

import alumniProfileAdminService from "../../services/alumniProfileAdminService";
import "./AlumniProfileManagement.css";

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {
  hero: {
    title: "IMSEC Alumni",
    subtitle: "Connecting the IMSEC family beyond the campus",
    breadcrumb: "Home / Alumni",
    buttonText: "Join Alumni Network",
    buttonLink: "#alumni-network",
    image: {},
  },

  about: {
    title: "IMSEC Alumni Network",
    subtitle: "A lifelong connection between IMSEC and its alumni",
    description1:
      "The IMSEC Alumni Network brings together graduates of IMS Engineering College and strengthens the lifelong relationship between alumni, students and their alma mater.",
    description2:
      "Our alumni continue to contribute to industry, entrepreneurship, research, education and society. Their experiences, achievements and guidance inspire the next generation of IMSEC students.",
    image: {},
    buttonText: "Know More",
    buttonLink: "#alumni-network",
  },

  statistics: {
    totalAlumni: "10,000+",
    successfulAlumni: "8,000+",
    countries: "20+",
    industryLeaders: "500+",
    alumniEvents: "100+",
    alumniChapters: "15+",
  },

  featuredAlumni: {
    displayCount: 6,
    profiles: [],
  },

  achievements: {
    displayCount: 6,
    items: [],
  },

  successStories: {
    displayCount: 6,
    items: [],
  },

  testimonials: {
    displayCount: 6,
    items: [],
  },

  events: {
    displayCount: 6,
    events: [],
  },

  chapters: {
    displayCount: 6,
    items: [],
  },

  network: {
    title: "Stay Connected with IMSEC",
    subtitle: "Reconnect with your batchmates, seniors and juniors",
    description:
      "Stay connected with the IMSEC community, discover alumni events, share professional achievements, support current students and build meaningful professional relationships.",
    email: "",
    phone: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    registrationText: "Register as Alumni",
    registrationLink: "/alumni/registration",
    loginText: "Alumni Login",
    loginLink: "/alumni/login",
  },

  mentorship: {
    title: "Alumni Mentorship",
    description:
      "IMSEC alumni can support current students through career guidance, mentoring, industry interaction, placement guidance and professional knowledge sharing.",
    buttonText: "Become a Mentor",
    buttonLink: "/contact-us",
    image: {},
  },

  contribution: {
    title: "Give Back to Your Alma Mater",
    description:
      "Our alumni play an important role in the continued growth of IMSEC by sharing knowledge, mentoring students, supporting initiatives and contributing to the development of the institution.",
    buttonText: "Connect With IMSEC",
    buttonLink: "/contact-us",
  },

  cta: {
    title: "Be Part of the IMSEC Alumni Family",
    description:
      "Your journey with IMSEC does not end with graduation. Stay connected, inspire others and continue to be part of the IMSEC story.",
    buttonText: "Join Alumni Network",
    buttonLink: "/alumni/registration",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const ensureData = (data) => {
  const source = data || {};

  return {
    ...cloneData(defaultData),
    ...source,

    hero: {
      ...defaultData.hero,
      ...(source.hero || {}),
    },

    about: {
      ...defaultData.about,
      ...(source.about || {}),
    },

    statistics: {
      ...defaultData.statistics,
      ...(source.statistics || {}),
    },

    featuredAlumni: {
      ...defaultData.featuredAlumni,
      ...(source.featuredAlumni || {}),
      profiles: source.featuredAlumni?.profiles || [],
    },

    achievements: {
      ...defaultData.achievements,
      ...(source.achievements || {}),
      items: source.achievements?.items || [],
    },

    successStories: {
      ...defaultData.successStories,
      ...(source.successStories || {}),
      items: source.successStories?.items || [],
    },

    testimonials: {
      ...defaultData.testimonials,
      ...(source.testimonials || {}),
      items: source.testimonials?.items || [],
    },

    events: {
      ...defaultData.events,
      ...(source.events || {}),
      events: source.events?.events || [],
    },

    chapters: {
      ...defaultData.chapters,
      ...(source.chapters || {}),
      items: source.chapters?.items || [],
    },

    network: {
      ...defaultData.network,
      ...(source.network || {}),
    },

    mentorship: {
      ...defaultData.mentorship,
      ...(source.mentorship || {}),
    },

    contribution: {
      ...defaultData.contribution,
      ...(source.contribution || {}),
    },

    cta: {
      ...defaultData.cta,
      ...(source.cta || {}),
    },
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const AlumniProfileManagement = () => {
  const [data, setData] = useState(cloneData(defaultData));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [activeTab, setActiveTab] = useState("hero");
  const [editor, setEditor] = useState(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await alumniProfileAdminService.getAlumniProfileAdmin();

      setData(ensureData(response?.data?.data));
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to load Alumni page.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FIELD UPDATE
  ======================================================= */

  const updateField = (section, field, value) => {
    setData((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* =======================================================
     ARRAY UPDATE
  ======================================================= */

  const updateArrayItem = (section, arrayName, index, field, value) => {
    setData((prev) => {
      const array = [...(prev[section]?.[arrayName] || [])];

      array[index] = {
        ...array[index],
        [field]: value,
      };

      return {
        ...prev,

        [section]: {
          ...prev[section],
          [arrayName]: array,
        },
      };
    });
  };

  /* =======================================================
     ADD ITEM
  ======================================================= */

  const addItem = (section, arrayName, item) => {
    setData((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],

        [arrayName]: [...(prev[section]?.[arrayName] || []), item],
      },
    }));
  };

  /* =======================================================
     DELETE ITEM
  ======================================================= */

  const deleteItem = (section, arrayName, index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setData((prev) => {
      const array = [...(prev[section]?.[arrayName] || [])];

      array.splice(index, 1);

      return {
        ...prev,

        [section]: {
          ...prev[section],
          [arrayName]: array,
        },
      };
    });
  };

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  const handleImageChange = (event, section) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setData((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],

        imageFile: file,

        imagePreview: URL.createObjectURL(file),
      },
    }));
  };

  /* =======================================================
     TABLE EDITOR
  ======================================================= */

  const openEditor = (section, arrayName, index, viewOnly = false) => {
    const item = data?.[section]?.[arrayName]?.[index];
    if (!item) return;
    setEditor({ section, arrayName, index, draft: cloneData(item), viewOnly });
  };

  const openNewEditor = (section, arrayName, item) => {
    setEditor({
      section,
      arrayName,
      index: null,
      draft: cloneData(item),
    });
  };

  const closeEditor = () => setEditor(null);

  const saveEditor = () => {
    if (!editor) return;

    const { section, arrayName, index, draft } = editor;

    if (index === null) {
      addItem(section, arrayName, draft);
    } else {
      setData((prev) => {
        const array = [...(prev[section]?.[arrayName] || [])];
        array[index] = draft;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [arrayName]: array,
          },
        };
      });
    }

    setEditor(null);
  };

  const updateEditorField = (field, value) => {
    setEditor((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        [field]: value,
      },
    }));
  };

  const updateEditorImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEditor((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      },
    }));
  };

  const removeEditorImage = () => {
    setEditor((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        imageFile: null,
        imagePreview: "",
        image: {},
      },
    }));
  };

  const collectionDefinitions = {
    featured: {
      section: "featuredAlumni",
      arrayName: "profiles",
      title: "Featured Alumni",
      addLabel: "Add Alumni",
      columns: ["Photo", "Name", "Batch", "Course", "Company", "Status"],
      empty: "No alumni profiles added yet.",
      newItem: {
        name: "",
        batch: "",
        course: "",
        designation: "",
        company: "",
        location: "",
        description: "",
        achievement: "",
        image: {},
        linkedin: "",
        website: "",
        featured: false,
        published: true,
      },
    },
    achievements: {
      section: "achievements",
      arrayName: "items",
      title: "Alumni Achievements",
      addLabel: "Add Achievement",
      columns: ["Photo", "Title", "Alumni", "Year", "Company", "Status"],
      empty: "No achievements added yet.",
      newItem: {
        title: "",
        description: "",
        year: "",
        alumniName: "",
        designation: "",
        company: "",
        image: {},
        published: true,
      },
    },
    stories: {
      section: "successStories",
      arrayName: "items",
      title: "Alumni Success Stories",
      addLabel: "Add Success Story",
      columns: ["Photo", "Name", "Batch", "Course", "Company", "Status"],
      empty: "No success stories added yet.",
      newItem: {
        name: "",
        batch: "",
        course: "",
        designation: "",
        company: "",
        title: "",
        story: "",
        image: {},
        linkedin: "",
        published: true,
      },
    },
    testimonials: {
      section: "testimonials",
      arrayName: "items",
      title: "Alumni Testimonials",
      addLabel: "Add Testimonial",
      columns: ["Photo", "Name", "Batch", "Course", "Company", "Status"],
      empty: "No testimonials added yet.",
      newItem: {
        name: "",
        batch: "",
        course: "",
        designation: "",
        company: "",
        message: "",
        image: {},
        published: true,
      },
    },
    events: {
      section: "events",
      arrayName: "events",
      title: "Alumni Events",
      addLabel: "Add Alumni Event",
      columns: ["Photo", "Title", "Date", "Venue", "Chapter", "Status"],
      empty: "No alumni events added yet.",
      newItem: {
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        chapter: "",
        registrationLink: "",
        image: {},
        published: true,
      },
    },
    chapters: {
      section: "chapters",
      arrayName: "items",
      title: "Alumni Chapters",
      addLabel: "Add Alumni Chapter",
      columns: ["Photo", "Chapter", "City", "Country", "Coordinator", "Status"],
      empty: "No alumni chapters added yet.",
      newItem: {
        name: "",
        city: "",
        country: "India",
        description: "",
        coordinator: "",
        email: "",
        phone: "",
        image: {},
        pdfUrl: "",
        published: true,
      },
    },
  };

  const getCollectionRows = (key) => {
    const def = collectionDefinitions[key];
    return data?.[def.section]?.[def.arrayName] || [];
  };

  const deleteCollectionItem = (key, index) => {
    const def = collectionDefinitions[key];
    deleteItem(def.section, def.arrayName, index);
  };

  const renderCollection = (key, icon, description) => {
    const def = collectionDefinitions[key];
    const rows = getCollectionRows(key);

    return (
      <section className="alumni-admin-section">
        <SectionTitle icon={icon} title={def.title} description={description} />

        <div className="alumni-collection-toolbar">
          <DisplayCount
            value={data[def.section].displayCount}
            onChange={(value) =>
              updateField(def.section, "displayCount", value)
            }
          />
          <button
            type="button"
            className="alumni-add-btn"
            onClick={() =>
              openNewEditor(def.section, def.arrayName, def.newItem)
            }
          >
            <FaPlus /> {def.addLabel}
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="alumni-table-empty">
            <FaUsers />
            <strong>{def.empty}</strong>
            <span>Click “{def.addLabel}” to create the first item.</span>
          </div>
        ) : (
          <div className="alumni-table-wrap">
            <table className="alumni-data-table">
              <thead>
                <tr>
                  {def.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr key={item._id || `${key}-${index}`}>
                    <td>
                      <div className="alumni-table-photo">
                        {item.imagePreview || item.image?.url ? (
                          <img
                            src={item.imagePreview || item.image.url}
                            alt={item.name || item.title || "Alumni"}
                          />
                        ) : (
                          <FaImage />
                        )}
                      </div>
                    </td>
                    {key === "featured" && (
                      <>
                        <td>
                          <strong>{item.name || "—"}</strong>
                        </td>
                        <td>{item.batch || "—"}</td>
                        <td>{item.course || "—"}</td>
                        <td>{item.company || "—"}</td>
                      </>
                    )}
                    {key === "achievements" && (
                      <>
                        <td>
                          <strong>{item.title || "—"}</strong>
                        </td>
                        <td>{item.alumniName || "—"}</td>
                        <td>{item.year || "—"}</td>
                        <td>{item.company || "—"}</td>
                      </>
                    )}
                    {key === "stories" && (
                      <>
                        <td>
                          <strong>{item.name || "—"}</strong>
                        </td>
                        <td>{item.batch || "—"}</td>
                        <td>{item.course || "—"}</td>
                        <td>{item.company || "—"}</td>
                      </>
                    )}
                    {key === "testimonials" && (
                      <>
                        <td>
                          <strong>{item.name || "—"}</strong>
                        </td>
                        <td>{item.batch || "—"}</td>
                        <td>{item.course || "—"}</td>
                        <td>{item.company || "—"}</td>
                      </>
                    )}
                    {key === "events" && (
                      <>
                        <td>
                          <strong>{item.title || "—"}</strong>
                        </td>
                        <td>{item.date || "—"}</td>
                        <td>{item.venue || "—"}</td>
                        <td>{item.chapter || "—"}</td>
                      </>
                    )}
                    {key === "chapters" && (
                      <>
                        <td>
                          <strong>{item.name || "—"}</strong>
                        </td>
                        <td>{item.city || "—"}</td>
                        <td>{item.country || "—"}</td>
                        <td>{item.coordinator || "—"}</td>
                      </>
                    )}
                    <td>
                      <span
                        className={
                          item.published
                            ? "alumni-status published"
                            : "alumni-status hidden"
                        }
                      >
                        {item.published ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="alumni-table-actions">
                        <button
                          type="button"
                          className="alumni-view-btn"
                          onClick={() =>
                            openEditor(def.section, def.arrayName, index, true)
                          }
                        >
                          <FaEye /> View
                        </button>
                        <button
                          type="button"
                          className="alumni-edit-btn"
                          onClick={() =>
                            openEditor(def.section, def.arrayName, index)
                          }
                        >
                          <span>✎</span> Edit
                        </button>
                        <button
                          type="button"
                          className="alumni-delete-btn"
                          onClick={() => deleteCollectionItem(key, index)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      /* -----------------------------------------
         JSON CONTENT
      ----------------------------------------- */

      const jsonData = cloneData(data);

      /* imageFile is browser-only */
      delete jsonData.hero.imageFile;
      delete jsonData.hero.imagePreview;

      delete jsonData.about.imageFile;
      delete jsonData.about.imagePreview;

      delete jsonData.mentorship.imageFile;
      delete jsonData.mentorship.imagePreview;

      const imageCollections = [
        ["featuredAlumni", "profiles", "featuredAlumniImage_"],
        ["achievements", "items", "achievementsImage_"],
        ["successStories", "items", "successStoriesImage_"],
        ["testimonials", "items", "testimonialsImage_"],
        ["events", "events", "eventsImage_"],
        ["chapters", "items", "chaptersImage_"],
      ];

      imageCollections.forEach(([section, arrayName, prefix]) => {
        (jsonData[section]?.[arrayName] || []).forEach((item, index) => {
          delete item.imageFile;
          delete item.imagePreview;

          const originalItem = data[section]?.[arrayName]?.[index];
          if (originalItem?.imageFile) {
            formData.append(`${prefix}${index}`, originalItem.imageFile);
          }
        });
      });

      formData.append("data", JSON.stringify(jsonData));

      /* -----------------------------------------
         HERO IMAGE
      ----------------------------------------- */

      if (data.hero?.imageFile) {
        formData.append("heroImage", data.hero.imageFile);
      }

      /* -----------------------------------------
         ABOUT IMAGE
      ----------------------------------------- */

      if (data.about?.imageFile) {
        formData.append("aboutImage", data.about.imageFile);
      }

      /* -----------------------------------------
         MENTORSHIP IMAGE
      ----------------------------------------- */

      if (data.mentorship?.imageFile) {
        formData.append("mentorshipImage", data.mentorship.imageFile);
      }

      await alumniProfileAdminService.updateAlumniProfile(formData);

      setMessage("Alumni page saved successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to save Alumni page.");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = async () => {
    if (!window.confirm("Reset the complete Alumni page to default data?")) {
      return;
    }

    try {
      setResetting(true);
      setError("");
      setMessage("");

      const response = await alumniProfileAdminService.resetAlumniProfile();

      setData(ensureData(response?.data?.data));

      setMessage("Alumni page reset successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to reset Alumni page.");
    } finally {
      setResetting(false);
    }
  };

  /* =======================================================
     PROFILE DEFAULT
  ======================================================= */

  const addProfile = () => {
    addItem("featuredAlumni", "profiles", {
      name: "",
      batch: "",
      course: "",
      designation: "",
      company: "",
      location: "",
      description: "",
      achievement: "",
      image: {},
      linkedin: "",
      website: "",
      featured: false,
      published: true,
    });
  };

  /* =======================================================
     ACHIEVEMENT DEFAULT
  ======================================================= */

  const addAchievement = () => {
    addItem("achievements", "items", {
      title: "",
      description: "",
      year: "",
      alumniName: "",
      designation: "",
      company: "",
      image: {},
      published: true,
    });
  };

  /* =======================================================
     STORY DEFAULT
  ======================================================= */

  const addSuccessStory = () => {
    addItem("successStories", "items", {
      name: "",
      batch: "",
      course: "",
      designation: "",
      company: "",
      title: "",
      story: "",
      image: {},
      linkedin: "",
      published: true,
    });
  };

  /* =======================================================
     TESTIMONIAL DEFAULT
  ======================================================= */

  const addTestimonial = () => {
    addItem("testimonials", "items", {
      name: "",
      batch: "",
      course: "",
      designation: "",
      company: "",
      message: "",
      image: {},
      published: true,
    });
  };

  /* =======================================================
     EVENT DEFAULT
  ======================================================= */

  const addEvent = () => {
    addItem("events", "events", {
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      chapter: "",
      registrationLink: "",
      image: {},
      published: true,
    });
  };

  /* =======================================================
     CHAPTER DEFAULT
  ======================================================= */

  const addChapter = () => {
    addItem("chapters", "items", {
      name: "",
      city: "",
      country: "India",
      description: "",
      coordinator: "",
      email: "",
      phone: "",
      image: {},
      pdfUrl: "",
      published: true,
    });
  };

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "hero",
      label: "Hero",
    },
    {
      id: "about",
      label: "About",
    },
    {
      id: "statistics",
      label: "Statistics",
    },
    {
      id: "featured",
      label: "Featured Alumni",
    },
    {
      id: "achievements",
      label: "Achievements",
    },
    {
      id: "stories",
      label: "Success Stories",
    },
    {
      id: "testimonials",
      label: "Testimonials",
    },
    {
      id: "events",
      label: "Events",
    },
    {
      id: "chapters",
      label: "Chapters",
    },
    {
      id: "network",
      label: "Network",
    },
    {
      id: "mentorship",
      label: "Mentorship",
    },
    {
      id: "contribution",
      label: "Contribution",
    },
    {
      id: "cta",
      label: "CTA",
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <div className="alumni-admin-loading">Loading Alumni page...</div>;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="alumni-admin-page">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="alumni-admin-header">
        <div>
          <span className="alumni-admin-eyebrow">IMSEC ADMINISTRATION</span>

          <h1>Alumni Page Management</h1>

          <p>
            Manage Alumni content, achievements, stories, events and networking
            information.
          </p>
        </div>

        <div className="alumni-admin-actions">
          <button
            type="button"
            className="alumni-reset-btn"
            onClick={handleReset}
            disabled={resetting}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="button"
            className="alumni-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ===================================================
          MESSAGES
      =================================================== */}

      {message && <div className="alumni-success-message">{message}</div>}

      {error && <div className="alumni-error-message">{error}</div>}

      {/* ===================================================
          TABS
      =================================================== */}

      <div className="alumni-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="alumni-admin-content">
        {/* =================================================
            HERO
        ================================================= */}

        {activeTab === "hero" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaUsers />}
              title="Hero Section"
              description="Manage the main Alumni page heading."
            />

            <div className="alumni-form-grid">
              <Input
                label="Title"
                value={data.hero.title}
                onChange={(e) => updateField("hero", "title", e.target.value)}
              />

              <Input
                label="Subtitle"
                value={data.hero.subtitle}
                onChange={(e) =>
                  updateField("hero", "subtitle", e.target.value)
                }
              />

              <Input
                label="Breadcrumb"
                value={data.hero.breadcrumb}
                onChange={(e) =>
                  updateField("hero", "breadcrumb", e.target.value)
                }
              />

              <Input
                label="Button Text"
                value={data.hero.buttonText}
                onChange={(e) =>
                  updateField("hero", "buttonText", e.target.value)
                }
              />

              <Input
                label="Button Link"
                value={data.hero.buttonLink}
                onChange={(e) =>
                  updateField("hero", "buttonLink", e.target.value)
                }
              />
            </div>

            <ImageUpload
              label="Hero Image"
              image={data.hero.image}
              preview={data.hero.imagePreview}
              onChange={(e) => handleImageChange(e, "hero")}
            />
          </section>
        )}

        {/* =================================================
            ABOUT
        ================================================= */}

        {activeTab === "about" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaGraduationCap />}
              title="About Alumni"
              description="Introduce the IMSEC Alumni Network."
            />

            <Input
              label="Section Title"
              value={data.about.title}
              onChange={(e) => updateField("about", "title", e.target.value)}
            />

            <Input
              label="Subtitle"
              value={data.about.subtitle}
              onChange={(e) => updateField("about", "subtitle", e.target.value)}
            />

            <Textarea
              label="Description 1"
              value={data.about.description1}
              onChange={(e) =>
                updateField("about", "description1", e.target.value)
              }
            />

            <Textarea
              label="Description 2"
              value={data.about.description2}
              onChange={(e) =>
                updateField("about", "description2", e.target.value)
              }
            />

            <div className="alumni-form-grid">
              <Input
                label="Button Text"
                value={data.about.buttonText}
                onChange={(e) =>
                  updateField("about", "buttonText", e.target.value)
                }
              />

              <Input
                label="Button Link"
                value={data.about.buttonLink}
                onChange={(e) =>
                  updateField("about", "buttonLink", e.target.value)
                }
              />
            </div>

            <ImageUpload
              label="About Image"
              image={data.about.image}
              preview={data.about.imagePreview}
              onChange={(e) => handleImageChange(e, "about")}
            />
          </section>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        {activeTab === "statistics" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaTrophy />}
              title="Alumni Statistics"
              description="Control the statistics displayed on the public page."
            />

            <div className="alumni-form-grid alumni-stat-grid">
              <Input
                label="Total Alumni"
                value={data.statistics.totalAlumni}
                onChange={(e) =>
                  updateField("statistics", "totalAlumni", e.target.value)
                }
              />

              <Input
                label="Successful Alumni"
                value={data.statistics.successfulAlumni}
                onChange={(e) =>
                  updateField("statistics", "successfulAlumni", e.target.value)
                }
              />

              <Input
                label="Countries"
                value={data.statistics.countries}
                onChange={(e) =>
                  updateField("statistics", "countries", e.target.value)
                }
              />

              <Input
                label="Industry Leaders"
                value={data.statistics.industryLeaders}
                onChange={(e) =>
                  updateField("statistics", "industryLeaders", e.target.value)
                }
              />

              <Input
                label="Alumni Events"
                value={data.statistics.alumniEvents}
                onChange={(e) =>
                  updateField("statistics", "alumniEvents", e.target.value)
                }
              />

              <Input
                label="Alumni Chapters"
                value={data.statistics.alumniChapters}
                onChange={(e) =>
                  updateField("statistics", "alumniChapters", e.target.value)
                }
              />
            </div>
          </section>
        )}

        {/* =================================================
            FEATURED ALUMNI / ACHIEVEMENTS / STORIES / TESTIMONIALS / EVENTS / CHAPTERS
        ================================================= */}

        {activeTab === "featured" &&
          renderCollection(
            "featured",
            <FaUsers />,
            "Manage alumni profiles shown on the public page.",
          )}

        {activeTab === "achievements" &&
          renderCollection(
            "achievements",
            <FaTrophy />,
            "Highlight achievements of IMSEC alumni.",
          )}

        {activeTab === "stories" &&
          renderCollection(
            "stories",
            <FaBriefcase />,
            "Share inspiring alumni journeys.",
          )}

        {activeTab === "testimonials" &&
          renderCollection(
            "testimonials",
            <FaQuoteLeft />,
            "Manage alumni testimonials.",
          )}

        {activeTab === "events" &&
          renderCollection(
            "events",
            <FaCalendarAlt />,
            "Manage alumni meets, reunions and other events.",
          )}

        {activeTab === "chapters" &&
          renderCollection(
            "chapters",
            <FaMapMarkerAlt />,
            "Manage city and country based alumni chapters.",
          )}

        {/* =================================================
            NETWORK
        ================================================= */}

        {activeTab === "network" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaUsers />}
              title="Alumni Network"
              description="Manage alumni networking and registration information."
            />

            <Input
              label="Title"
              value={data.network.title}
              onChange={(e) => updateField("network", "title", e.target.value)}
            />

            <Input
              label="Subtitle"
              value={data.network.subtitle}
              onChange={(e) =>
                updateField("network", "subtitle", e.target.value)
              }
            />

            <Textarea
              label="Description"
              value={data.network.description}
              onChange={(e) =>
                updateField("network", "description", e.target.value)
              }
            />

            <div className="alumni-form-grid">
              <Input
                label="Email"
                value={data.network.email}
                onChange={(e) =>
                  updateField("network", "email", e.target.value)
                }
              />

              <Input
                label="Phone"
                value={data.network.phone}
                onChange={(e) =>
                  updateField("network", "phone", e.target.value)
                }
              />

              <Input
                label="LinkedIn"
                value={data.network.linkedin}
                onChange={(e) =>
                  updateField("network", "linkedin", e.target.value)
                }
              />

              <Input
                label="Facebook"
                value={data.network.facebook}
                onChange={(e) =>
                  updateField("network", "facebook", e.target.value)
                }
              />

              <Input
                label="Instagram"
                value={data.network.instagram}
                onChange={(e) =>
                  updateField("network", "instagram", e.target.value)
                }
              />

              <Input
                label="WhatsApp"
                value={data.network.whatsapp}
                onChange={(e) =>
                  updateField("network", "whatsapp", e.target.value)
                }
              />

              <Input
                label="Registration Text"
                value={data.network.registrationText}
                onChange={(e) =>
                  updateField("network", "registrationText", e.target.value)
                }
              />

              <Input
                label="Registration Link"
                value={data.network.registrationLink}
                onChange={(e) =>
                  updateField("network", "registrationLink", e.target.value)
                }
              />

              <Input
                label="Login Text"
                value={data.network.loginText}
                onChange={(e) =>
                  updateField("network", "loginText", e.target.value)
                }
              />

              <Input
                label="Login Link"
                value={data.network.loginLink}
                onChange={(e) =>
                  updateField("network", "loginLink", e.target.value)
                }
              />
            </div>
          </section>
        )}

        {/* =================================================
            MENTORSHIP
        ================================================= */}

        {activeTab === "mentorship" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaGraduationCap />}
              title="Alumni Mentorship"
              description="Manage alumni mentoring content."
            />

            <Input
              label="Title"
              value={data.mentorship.title}
              onChange={(e) =>
                updateField("mentorship", "title", e.target.value)
              }
            />

            <Textarea
              label="Description"
              value={data.mentorship.description}
              onChange={(e) =>
                updateField("mentorship", "description", e.target.value)
              }
            />

            <div className="alumni-form-grid">
              <Input
                label="Button Text"
                value={data.mentorship.buttonText}
                onChange={(e) =>
                  updateField("mentorship", "buttonText", e.target.value)
                }
              />

              <Input
                label="Button Link"
                value={data.mentorship.buttonLink}
                onChange={(e) =>
                  updateField("mentorship", "buttonLink", e.target.value)
                }
              />
            </div>

            <ImageUpload
              label="Mentorship Image"
              image={data.mentorship.image}
              preview={data.mentorship.imagePreview}
              onChange={(e) => handleImageChange(e, "mentorship")}
            />
          </section>
        )}

        {/* =================================================
            CONTRIBUTION
        ================================================= */}

        {activeTab === "contribution" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaUsers />}
              title="Contribution"
              description="Manage the give-back section."
            />

            <Input
              label="Title"
              value={data.contribution.title}
              onChange={(e) =>
                updateField("contribution", "title", e.target.value)
              }
            />

            <Textarea
              label="Description"
              value={data.contribution.description}
              onChange={(e) =>
                updateField("contribution", "description", e.target.value)
              }
            />

            <div className="alumni-form-grid">
              <Input
                label="Button Text"
                value={data.contribution.buttonText}
                onChange={(e) =>
                  updateField("contribution", "buttonText", e.target.value)
                }
              />

              <Input
                label="Button Link"
                value={data.contribution.buttonLink}
                onChange={(e) =>
                  updateField("contribution", "buttonLink", e.target.value)
                }
              />
            </div>
          </section>
        )}

        {/* =================================================
            CTA
        ================================================= */}

        {activeTab === "cta" && (
          <section className="alumni-admin-section">
            <SectionTitle
              icon={<FaUsers />}
              title="Final CTA"
              description="Manage the final Alumni call-to-action."
            />

            <Input
              label="Title"
              value={data.cta.title}
              onChange={(e) => updateField("cta", "title", e.target.value)}
            />

            <Textarea
              label="Description"
              value={data.cta.description}
              onChange={(e) =>
                updateField("cta", "description", e.target.value)
              }
            />

            <div className="alumni-form-grid">
              <Input
                label="Button Text"
                value={data.cta.buttonText}
                onChange={(e) =>
                  updateField("cta", "buttonText", e.target.value)
                }
              />

              <Input
                label="Button Link"
                value={data.cta.buttonLink}
                onChange={(e) =>
                  updateField("cta", "buttonLink", e.target.value)
                }
              />
            </div>
          </section>
        )}
      </div>

      {editor && (
        <ItemEditorModal
          editor={editor}
          onClose={closeEditor}
          onSave={saveEditor}
          onChange={updateEditorField}
          onImageChange={updateEditorImage}
          onRemoveImage={removeEditorImage}
        />
      )}

      {/* ===================================================
          BOTTOM SAVE
      =================================================== */}

      <div className="alumni-bottom-actions">
        <button
          type="button"
          className="alumni-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Alumni Page"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   ITEM EDITOR MODAL
========================================================= */

const ItemEditorModal = ({
  editor,
  onClose,
  onSave,
  onChange,
  onImageChange,
  onRemoveImage,
}) => {
  const { section, draft, viewOnly } = editor;
  const readOnly = !!viewOnly;
  const titleMap = {
    featuredAlumni: draft.name || "Alumni",
    achievements: draft.title || "Achievement",
    successStories: draft.name || "Success Story",
    testimonials: draft.name || "Testimonial",
    events: draft.title || "Alumni Event",
    chapters: draft.name || "Alumni Chapter",
  };

  const field = (label, key, type = "text") => (
    <Input
      label={label}
      value={draft[key]}
      type={type}
      onChange={(e) => onChange(key, e.target.value)}
      disabled={readOnly}
    />
  );

  const area = (label, key) => (
    <Textarea
      label={label}
      value={draft[key]}
      onChange={(e) => onChange(key, e.target.value)}
      disabled={readOnly}
    />
  );

  return (
    <div
      className="alumni-modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="alumni-item-modal">
        <div className="alumni-modal-header">
          <div>
            <span className="alumni-admin-eyebrow">ALUMNI ITEM</span>
            <h2>
              {readOnly ? "View" : editor.index === null ? "Add" : "Edit"}{" "}
              {titleMap[section]}
            </h2>
          </div>
          <button
            type="button"
            className="alumni-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="alumni-modal-body">
          {section === "featuredAlumni" && (
            <>
              {field("Name", "name")} {field("Batch", "batch")}{" "}
              {field("Course", "course")}
              {field("Designation", "designation")}{" "}
              {field("Company", "company")} {field("Location", "location")}
              {field("LinkedIn", "linkedin")} {field("Website", "website")}
              {area("Description", "description")}{" "}
              {area("Achievement", "achievement")}
            </>
          )}

          {section === "achievements" && (
            <>
              {field("Title", "title")} {field("Year", "year")}{" "}
              {field("Alumni Name", "alumniName")}
              {field("Designation", "designation")}{" "}
              {field("Company", "company")} {area("Description", "description")}
            </>
          )}

          {section === "successStories" && (
            <>
              {field("Name", "name")} {field("Batch", "batch")}{" "}
              {field("Course", "course")}
              {field("Designation", "designation")}{" "}
              {field("Company", "company")} {field("Story Title", "title")}{" "}
              {field("LinkedIn", "linkedin")}
              {area("Story", "story")}
            </>
          )}

          {section === "testimonials" && (
            <>
              {field("Name", "name")} {field("Batch", "batch")}{" "}
              {field("Course", "course")}
              {field("Designation", "designation")}{" "}
              {field("Company", "company")} {area("Testimonial", "message")}
            </>
          )}

          {section === "events" && (
            <>
              {field("Title", "title")} {field("Date", "date")}{" "}
              {field("Time", "time")} {field("Venue", "venue")}
              {field("Chapter", "chapter")}{" "}
              {field("Registration Link", "registrationLink")}{" "}
              {area("Description", "description")}
            </>
          )}

          {section === "chapters" && (
            <>
              {field("Chapter Name", "name")} {field("City", "city")}{" "}
              {field("Country", "country")}{" "}
              {field("Coordinator", "coordinator")}
              {field("Email", "email")} {field("Phone", "phone")}{" "}
              {field("PDF URL", "pdfUrl")} {area("Description", "description")}
            </>
          )}

          <div className="alumni-modal-image-row">
            <ImageUpload
              label="Photo"
              image={draft.image}
              preview={draft.imagePreview}
              onChange={onImageChange}
              disabled={readOnly}
            />
            {!readOnly && (draft.image?.url || draft.imagePreview) && (
              <button
                type="button"
                className="alumni-remove-image-btn"
                onClick={onRemoveImage}
              >
                Remove Photo
              </button>
            )}
          </div>

          <PublishToggle
            published={draft.published}
            onChange={(value) => onChange("published", value)}
            disabled={readOnly}
          />

          {section === "featuredAlumni" && (
            <button
              type="button"
              disabled={readOnly}
              className={
                draft.featured ? "alumni-featured active" : "alumni-featured"
              }
              onClick={() => !readOnly && onChange("featured", !draft.featured)}
            >
              <FaTrophy /> {draft.featured ? "Featured" : "Make Featured"}
            </button>
          )}
        </div>

        <div className="alumni-modal-footer">
          <button type="button" className="alumni-cancel-btn" onClick={onClose}>
            Close
          </button>
          {!readOnly && (
            <button type="button" className="alumni-save-btn" onClick={onSave}>
              <FaSave /> Save Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ icon, title, description }) => (
  <div className="alumni-section-title">
    <div className="alumni-section-icon">{icon}</div>

    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

/* =========================================================
   INPUT
========================================================= */

const Input = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="alumni-field">
    <label>{label}</label>

    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

/* =========================================================
   TEXTAREA
========================================================= */

const Textarea = ({ label, value, onChange, disabled = false }) => (
  <div className="alumni-field">
    <label>{label}</label>

    <textarea
      rows={5}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

/* =========================================================
   DISPLAY COUNT
========================================================= */

const DisplayCount = ({ value, onChange }) => (
  <div className="alumni-display-count">
    <label>Number of items displayed on public page</label>

    <input
      type="number"
      min="1"
      value={value || 6}
      onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
    />
  </div>
);

/* =========================================================
   IMAGE UPLOAD
========================================================= */

const ImageUpload = ({ label, image, preview, onChange, disabled = false }) => (
  <div className="alumni-image-upload">
    <label>{label}</label>

    <div className="alumni-image-box">
      {preview ? (
        <img src={preview} alt={label} />
      ) : image?.url ? (
        <img src={image.url} alt={label} />
      ) : (
        <div className="alumni-image-placeholder">
          <FaImage />
          <span>No image selected</span>
        </div>
      )}
    </div>

    <input
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

/* =========================================================
   PUBLISH TOGGLE
========================================================= */

const PublishToggle = ({ published, onChange, disabled = false }) => (
  <button
    type="button"
    className={published ? "alumni-publish active" : "alumni-publish"}
    onClick={() => !disabled && onChange(!published)}
    disabled={disabled}
  >
    {published ? (
      <>
        <FaEye />
        Published
      </>
    ) : (
      <>
        <FaEyeSlash />
        Hidden
      </>
    )}
  </button>
);

/* =========================================================
   EDITOR HEADER
========================================================= */

const EditorHeader = ({ title, onDelete }) => (
  <div className="alumni-editor-header">
    <h3>{title}</h3>

    <button type="button" className="alumni-delete-btn" onClick={onDelete}>
      <FaTrash />
      Delete
    </button>
  </div>
);

/* =========================================================
   PROFILE EDITOR
========================================================= */

const ProfileEditor = ({ item, index, onChange, onDelete }) => (
  <div className="alumni-editor-card">
    <EditorHeader
      title={item.name || `Alumni ${index + 1}`}
      onDelete={onDelete}
    />

    <div className="alumni-form-grid">
      <Input
        label="Name"
        value={item.name}
        onChange={(e) =>
          onChange("featuredAlumni", "profiles", index, "name", e.target.value)
        }
      />

      <Input
        label="Batch"
        value={item.batch}
        onChange={(e) =>
          onChange("featuredAlumni", "profiles", index, "batch", e.target.value)
        }
      />

      <Input
        label="Course"
        value={item.course}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "course",
            e.target.value,
          )
        }
      />

      <Input
        label="Designation"
        value={item.designation}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "designation",
            e.target.value,
          )
        }
      />

      <Input
        label="Company"
        value={item.company}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "company",
            e.target.value,
          )
        }
      />

      <Input
        label="Location"
        value={item.location}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "location",
            e.target.value,
          )
        }
      />

      <Input
        label="LinkedIn"
        value={item.linkedin}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "linkedin",
            e.target.value,
          )
        }
      />

      <Input
        label="Website"
        value={item.website}
        onChange={(e) =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "website",
            e.target.value,
          )
        }
      />
    </div>

    <Textarea
      label="Description"
      value={item.description}
      onChange={(e) =>
        onChange(
          "featuredAlumni",
          "profiles",
          index,
          "description",
          e.target.value,
        )
      }
    />

    <Textarea
      label="Achievement"
      value={item.achievement}
      onChange={(e) =>
        onChange(
          "featuredAlumni",
          "profiles",
          index,
          "achievement",
          e.target.value,
        )
      }
    />

    <div className="alumni-toggle-row">
      <PublishToggle
        published={item.published}
        onChange={(value) =>
          onChange("featuredAlumni", "profiles", index, "published", value)
        }
      />

      <button
        type="button"
        className={item.featured ? "alumni-featured active" : "alumni-featured"}
        onClick={() =>
          onChange(
            "featuredAlumni",
            "profiles",
            index,
            "featured",
            !item.featured,
          )
        }
      >
        <FaTrophy />

        {item.featured ? "Featured" : "Make Featured"}
      </button>
    </div>
  </div>
);

export default AlumniProfileManagement;
