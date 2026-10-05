import React, { useEffect, useState } from "react";
import {
  FaRunning,
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaEdit,
  FaImage,
  FaTrophy,
  FaBuilding,
  FaPhone,
  FaClock,
  FaUpload,
  FaSyncAlt,
  FaEye,
} from "react-icons/fa";

import sportsAdminService from "../../services/sportsAdminService";
import "./sports.css";

const DEFAULT_DATA = {
  title: "Sports",
  heroSubtitle: "Sports, Fitness & Recreation",
  breadcrumb: "Home / Student Welfare / Sports",
  heading: "Sports & Physical Fitness",
  description:
    "The institute encourages students to participate in sports and physical fitness activities as an important part of holistic education. Sports provide opportunities to develop discipline, teamwork, leadership, confidence and a healthy lifestyle.",

  coordinatorName: "Sports Coordinator",
  coordinatorDesignation: "Coordinator, Sports & Physical Education",
  coordinatorEmail: "sports@imsec.ac.in",
  coordinatorPhone: "+91-120-4081999",

  outdoorHeading: "Outdoor Sports Facilities",
  outdoorDescription:
    "The institute provides outdoor sports facilities that encourage students to participate in regular practice, recreational activities and competitive events.",

  indoorHeading: "Indoor Sports Facilities",
  indoorDescription:
    "Indoor sports facilities provide students with opportunities to practice recreational and competitive indoor games throughout the year.",

  fitnessHeading: "Fitness & Recreation",
  fitnessDescription:
    "Fitness and recreational activities help students maintain physical fitness, improve endurance and develop healthy lifestyle habits.",

  trainingHeading: "Coaching & Training",
  trainingDescription:
    "Students are encouraged to participate in regular practice and sports activities under appropriate guidance. Coaching and training opportunities may be organized for different sports according to institutional requirements.",

  activitiesHeading: "Sports Activities & Events",
  activitiesDescription:
    "The institute promotes participation in inter-college competitions, sports events, tournaments, fitness activities and other recreational programmes.",

  timingsHeading: "Sports Facility Timings",
  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",

  facilities: [
    {
      title: "Cricket",
      description: "Facilities for cricket practice and recreational play.",
      category: "Outdoor",
      order: 1,
      isActive: true,
    },
    {
      title: "Football",
      description:
        "Outdoor football facility for practice and student activities.",
      category: "Outdoor",
      order: 2,
      isActive: true,
    },
    {
      title: "Basketball",
      description:
        "Basketball facility for regular practice and recreational activities.",
      category: "Outdoor",
      order: 3,
      isActive: true,
    },
    {
      title: "Volleyball",
      description:
        "Volleyball facility for practice, recreation and competitions.",
      category: "Outdoor",
      order: 4,
      isActive: true,
    },
    {
      title: "Badminton",
      description: "Indoor badminton facility for regular student practice.",
      category: "Indoor",
      order: 5,
      isActive: true,
    },
    {
      title: "Table Tennis",
      description:
        "Indoor table tennis facility for recreational and competitive practice.",
      category: "Indoor",
      order: 6,
      isActive: true,
    },
    {
      title: "Chess & Carrom",
      description: "Indoor recreational games for students.",
      category: "Indoor",
      order: 7,
      isActive: true,
    },
    {
      title: "Gym & Fitness",
      description:
        "Fitness facilities supporting physical conditioning and healthy lifestyle activities.",
      category: "Fitness",
      order: 8,
      isActive: true,
    },
  ],

  achievements: [
    {
      title: "Inter-College Sports Participation",
      description:
        "Students are encouraged to represent the institute in inter-college and university-level sporting events.",
      year: "2026",
      order: 1,
      isActive: true,
    },
    {
      title: "Annual Sports Activities",
      description:
        "The institute promotes annual sports activities and competitions for student participation.",
      year: "2026",
      order: 2,
      isActive: true,
    },
  ],

  images: [],
  published: true,
};

const Sports = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [activeTab, setActiveTab] = useState("basic");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);

  const [editingFacility, setEditingFacility] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [facilityForm, setFacilityForm] = useState({
    title: "",
    description: "",
    category: "Outdoor",
    order: 1,
    isActive: true,
  });

  const [achievementForm, setAchievementForm] = useState({
    title: "",
    description: "",
    year: "",
    order: 1,
    isActive: true,
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      setLoading(true);

      const response = await sportsAdminService.getSportsAdmin();

      const pageData = response?.data?.data || response?.data || response;

      if (pageData) {
        setData({
          ...DEFAULT_DATA,
          ...pageData,
          facilities: Array.isArray(pageData.facilities)
            ? pageData.facilities
            : DEFAULT_DATA.facilities,
          achievements: Array.isArray(pageData.achievements)
            ? pageData.achievements
            : DEFAULT_DATA.achievements,
          images: Array.isArray(pageData.images)
            ? pageData.images
            : DEFAULT_DATA.images,
        });
      }
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Unable to load Sports information.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     MESSAGE
  ===================================================== */

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 4000);
  };

  /* =====================================================
     TEXT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      const cleanData = {
        ...data,

        facilities: data.facilities || [],

        achievements: data.achievements || [],

        images: (data.images || []).map((image) => ({
          _id: image._id,
          title: image.title,
          imageUrl: image.imageUrl,
          publicId: image.publicId || "",
          altText: image.altText || "",
          order: Number(image.order) || 1,
        })),
      };

      formData.append("data", JSON.stringify(cleanData));

      selectedImages.forEach((file) => {
        formData.append("galleryImages", file);
      });

      const response = await sportsAdminService.updateSports(formData);

      const updatedData = response?.data?.data || response?.data || response;

      if (updatedData) {
        setData({
          ...DEFAULT_DATA,
          ...updatedData,
          facilities: updatedData.facilities || [],
          achievements: updatedData.achievements || [],
          images: updatedData.images || [],
        });
      }

      setSelectedImages([]);

      showMessage("success", "Sports information saved successfully.");
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Unable to save Sports information.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset Sports information to default data?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);

      const response = await sportsAdminService.resetSports();

      const resetData = response?.data?.data || response?.data || response;

      setData({
        ...DEFAULT_DATA,
        ...resetData,
        facilities: resetData?.facilities || DEFAULT_DATA.facilities,
        achievements: resetData?.achievements || DEFAULT_DATA.achievements,
        images: resetData?.images || DEFAULT_DATA.images,
      });

      setSelectedImages([]);

      showMessage("success", "Sports information reset successfully.");
    } catch (error) {
      showMessage(
        "error",
        error?.message || "Unable to reset Sports information.",
      );
    } finally {
      setResetting(false);
    }
  };

  /* =====================================================
     FACILITY FORM
  ===================================================== */

  const resetFacilityForm = () => {
    setEditingFacility(null);

    setFacilityForm({
      title: "",
      description: "",
      category: "Outdoor",
      order: data.facilities.length + 1,
      isActive: true,
    });
  };

  const handleFacilityChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFacilityForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
            ? Number(value)
            : value,
    }));
  };

  const handleAddFacility = () => {
    if (!facilityForm.title.trim()) {
      showMessage("error", "Facility title is required.");
      return;
    }

    if (!facilityForm.description.trim()) {
      showMessage("error", "Facility description is required.");
      return;
    }

    if (editingFacility !== null) {
      setData((prev) => ({
        ...prev,
        facilities: prev.facilities.map((item, index) =>
          index === editingFacility
            ? {
                ...item,
                ...facilityForm,
              }
            : item,
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        facilities: [
          ...prev.facilities,
          {
            ...facilityForm,
          },
        ],
      }));
    }

    resetFacilityForm();
  };

  const editFacility = (index) => {
    const facility = data.facilities[index];

    setEditingFacility(index);

    setFacilityForm({
      title: facility.title || "",
      description: facility.description || "",
      category: facility.category || "Outdoor",
      order: facility.order || index + 1,
      isActive: facility.isActive !== false,
    });
  };

  const deleteFacility = (index) => {
    const confirmed = window.confirm("Delete this facility?");

    if (!confirmed) return;

    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, itemIndex) => itemIndex !== index),
    }));

    if (editingFacility === index) {
      resetFacilityForm();
    }
  };

  /* =====================================================
     ACHIEVEMENT FORM
  ===================================================== */

  const resetAchievementForm = () => {
    setEditingAchievement(null);

    setAchievementForm({
      title: "",
      description: "",
      year: "",
      order: data.achievements.length + 1,
      isActive: true,
    });
  };

  const handleAchievementChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAchievementForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
            ? Number(value)
            : value,
    }));
  };

  const handleAddAchievement = () => {
    if (!achievementForm.title.trim()) {
      showMessage("error", "Achievement title is required.");
      return;
    }

    if (!achievementForm.description.trim()) {
      showMessage("error", "Achievement description is required.");
      return;
    }

    if (editingAchievement !== null) {
      setData((prev) => ({
        ...prev,
        achievements: prev.achievements.map((item, index) =>
          index === editingAchievement
            ? {
                ...item,
                ...achievementForm,
              }
            : item,
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        achievements: [
          ...prev.achievements,
          {
            ...achievementForm,
          },
        ],
      }));
    }

    resetAchievementForm();
  };

  const editAchievement = (index) => {
    const achievement = data.achievements[index];

    setEditingAchievement(index);

    setAchievementForm({
      title: achievement.title || "",
      description: achievement.description || "",
      year: achievement.year || "",
      order: achievement.order || index + 1,
      isActive: achievement.isActive !== false,
    });
  };

  const deleteAchievement = (index) => {
    const confirmed = window.confirm("Delete this achievement?");

    if (!confirmed) return;

    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));

    if (editingAchievement === index) {
      resetAchievementForm();
    }
  };

  /* =====================================================
     GALLERY SELECT
  ===================================================== */

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      showMessage("error", "Only image files are allowed.");
    }

    setSelectedImages((prev) => [...prev, ...imageFiles]);

    e.target.value = "";
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  /* =====================================================
     EXISTING IMAGE DETAILS
  ===================================================== */

  const handleImageDetailChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              [field]: field === "order" ? Number(value) : value,
            }
          : image,
      ),
    }));
  };

  /* =====================================================
     DELETE EXISTING IMAGE
  ===================================================== */

  const handleDeleteImage = async (image) => {
    if (!image?._id) {
      showMessage("error", "Image ID not available.");
      return;
    }

    const confirmed = window.confirm("Delete this image permanently?");

    if (!confirmed) return;

    try {
      await sportsAdminService.deleteSportsImage(image._id);

      setData((prev) => ({
        ...prev,
        images: prev.images.filter((item) => item._id !== image._id),
      }));

      showMessage("success", "Image deleted successfully.");
    } catch (error) {
      showMessage("error", error?.message || "Unable to delete image.");
    }
  };

  /* =====================================================
     REPLACE IMAGE
  ===================================================== */

  const handleReplaceImage = async (image, file) => {
    if (!image?._id || !file) return;

    try {
      const response = await sportsAdminService.replaceSportsImage(
        image._id,
        file,
      );

      const updatedData = response?.data?.data || response?.data || response;

      if (updatedData?.images) {
        setData((prev) => ({
          ...prev,
          images: updatedData.images,
        }));
      }

      showMessage("success", "Image replaced successfully.");
    } catch (error) {
      showMessage("error", error?.message || "Unable to replace image.");
    }
  };

  /* =====================================================
     SAVE IMAGE DETAILS
  ===================================================== */

  const saveImageDetails = async (image) => {
    if (!image?._id) return;

    try {
      const response = await sportsAdminService.updateSportsImage(image._id, {
        title: image.title,
        altText: image.altText,
        order: Number(image.order) || 1,
      });

      const updatedData = response?.data?.data || response?.data || response;

      if (updatedData?.images) {
        setData((prev) => ({
          ...prev,
          images: updatedData.images,
        }));
      }

      showMessage("success", "Image details saved.");
    } catch (error) {
      showMessage("error", error?.message || "Unable to save image details.");
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="sports-admin-loading">
        <FaSyncAlt className="sports-admin-spin" />
        <p>Loading Sports Management...</p>
      </div>
    );
  }

  /* =====================================================
     TABS
  ===================================================== */

  const tabs = [
    {
      id: "basic",
      label: "Basic Information",
      icon: <FaBuilding />,
    },
    {
      id: "facilities",
      label: "Facilities",
      icon: <FaRunning />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <FaTrophy />,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: <FaImage />,
    },
    {
      id: "contact",
      label: "Contact & Timings",
      icon: <FaPhone />,
    },
  ];

  return (
    <div className="sports-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="sports-admin-header">
        <div>
          <div className="sports-admin-title-row">
            <div className="sports-admin-title-icon">
              <FaRunning />
            </div>

            <div>
              <h1>Sports Management</h1>

              <p>Manage Sports, Facilities, Achievements and Gallery.</p>
            </div>
          </div>
        </div>

        <div className="sports-admin-header-actions">
          <button
            type="button"
            className="sports-admin-reset-btn"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="button"
            className="sports-admin-save-btn"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message.text && (
        <div
          className={`sports-admin-message ${
            message.type === "success" ? "success" : "error"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* =================================================
          PUBLISH
      ================================================= */}

      <div className="sports-admin-publish-bar">
        <div>
          <strong>Publish Sports Page</strong>

          <span>Enable this option to display the Sports page publicly.</span>
        </div>

        <label className="sports-admin-switch">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                published: e.target.checked,
              }))
            }
          />

          <span className="sports-admin-slider" />
        </label>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="sports-admin-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =================================================
          TAB CONTENT
      ================================================= */}

      <div className="sports-admin-content">
        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        {activeTab === "basic" && (
          <div className="sports-admin-tab-panel">
            <div className="sports-admin-panel-heading">
              <div>
                <h2>Basic Information</h2>
                <p>Manage the main Sports page heading and introduction.</p>
              </div>

              <FaBuilding />
            </div>

            <div className="sports-admin-form-grid">
              <div className="sports-admin-field">
                <label>Page Title</label>

                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                />
              </div>

              <div className="sports-admin-field">
                <label>Hero Subtitle</label>

                <input
                  type="text"
                  name="heroSubtitle"
                  value={data.heroSubtitle}
                  onChange={handleChange}
                />
              </div>

              <div className="sports-admin-field full">
                <label>Breadcrumb</label>

                <input
                  type="text"
                  name="breadcrumb"
                  value={data.breadcrumb}
                  onChange={handleChange}
                />
              </div>

              <div className="sports-admin-field full">
                <label>Main Heading</label>

                <input
                  type="text"
                  name="heading"
                  value={data.heading}
                  onChange={handleChange}
                />
              </div>

              <div className="sports-admin-field full">
                <label>Introduction</label>

                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  rows="6"
                />
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            FACILITIES
        ================================================= */}

        {activeTab === "facilities" && (
          <div className="sports-admin-tab-panel">
            <div className="sports-admin-panel-heading">
              <div>
                <h2>Sports Facilities</h2>
                <p>Add, edit, remove and activate sports facilities.</p>
              </div>

              <FaRunning />
            </div>

            {/* FORM */}

            <div className="sports-admin-sub-panel">
              <h3>
                {editingFacility !== null
                  ? "Edit Facility"
                  : "Add New Facility"}
              </h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field">
                  <label>Facility Name</label>

                  <input
                    type="text"
                    name="title"
                    value={facilityForm.title}
                    onChange={handleFacilityChange}
                    placeholder="e.g. Cricket"
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Category</label>

                  <select
                    name="category"
                    value={facilityForm.category}
                    onChange={handleFacilityChange}
                  >
                    <option value="Outdoor">Outdoor</option>

                    <option value="Indoor">Indoor</option>

                    <option value="Fitness">Fitness</option>
                  </select>
                </div>

                <div className="sports-admin-field full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={facilityForm.description}
                    onChange={handleFacilityChange}
                    rows="4"
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Order</label>

                  <input
                    type="number"
                    name="order"
                    value={facilityForm.order}
                    onChange={handleFacilityChange}
                    min="1"
                  />
                </div>

                <div className="sports-admin-checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={facilityForm.isActive}
                      onChange={handleFacilityChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="sports-admin-form-actions">
                <button
                  type="button"
                  className="sports-admin-primary-small"
                  onClick={handleAddFacility}
                >
                  {editingFacility !== null ? (
                    <>
                      <FaEdit />
                      Update Facility
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Facility
                    </>
                  )}
                </button>

                {editingFacility !== null && (
                  <button
                    type="button"
                    className="sports-admin-secondary-small"
                    onClick={resetFacilityForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* FACILITY LIST */}

            <div className="sports-admin-list">
              {data.facilities.length === 0 ? (
                <div className="sports-admin-empty">No facilities added.</div>
              ) : (
                data.facilities.map((facility, index) => (
                  <div
                    className={`sports-admin-list-card ${
                      facility.isActive === false ? "inactive" : ""
                    }`}
                    key={facility._id || `facility-${index}`}
                  >
                    <div className="sports-admin-list-icon">
                      <FaRunning />
                    </div>

                    <div className="sports-admin-list-content">
                      <div className="sports-admin-list-title-row">
                        <h3>{facility.title}</h3>

                        <span className="sports-admin-category">
                          {facility.category}
                        </span>
                      </div>

                      <p>{facility.description}</p>

                      <small>Order: {facility.order || index + 1}</small>
                    </div>

                    <div className="sports-admin-list-actions">
                      <button
                        type="button"
                        onClick={() => editFacility(index)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteFacility(index)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SECTION CONTENT */}

            <div className="sports-admin-sub-panel">
              <h3>Facility Section Content</h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field">
                  <label>Outdoor Heading</label>

                  <input
                    type="text"
                    name="outdoorHeading"
                    value={data.outdoorHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Indoor Heading</label>

                  <input
                    type="text"
                    name="indoorHeading"
                    value={data.indoorHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Outdoor Description</label>

                  <textarea
                    name="outdoorDescription"
                    value={data.outdoorDescription}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Indoor Description</label>

                  <textarea
                    name="indoorDescription"
                    value={data.indoorDescription}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Fitness Heading</label>

                  <input
                    type="text"
                    name="fitnessHeading"
                    value={data.fitnessHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Training Heading</label>

                  <input
                    type="text"
                    name="trainingHeading"
                    value={data.trainingHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Fitness Description</label>

                  <textarea
                    name="fitnessDescription"
                    value={data.fitnessDescription}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Training Description</label>

                  <textarea
                    name="trainingDescription"
                    value={data.trainingDescription}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        {activeTab === "achievements" && (
          <div className="sports-admin-tab-panel">
            <div className="sports-admin-panel-heading">
              <div>
                <h2>Sports Achievements</h2>
                <p>Manage sports achievements, participation and highlights.</p>
              </div>

              <FaTrophy />
            </div>

            <div className="sports-admin-sub-panel">
              <h3>
                {editingAchievement !== null
                  ? "Edit Achievement"
                  : "Add New Achievement"}
              </h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field">
                  <label>Title</label>

                  <input
                    type="text"
                    name="title"
                    value={achievementForm.title}
                    onChange={handleAchievementChange}
                    placeholder="Achievement title"
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Year</label>

                  <input
                    type="text"
                    name="year"
                    value={achievementForm.year}
                    onChange={handleAchievementChange}
                    placeholder="2026"
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={achievementForm.description}
                    onChange={handleAchievementChange}
                    rows="5"
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Order</label>

                  <input
                    type="number"
                    name="order"
                    value={achievementForm.order}
                    onChange={handleAchievementChange}
                    min="1"
                  />
                </div>

                <div className="sports-admin-checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={achievementForm.isActive}
                      onChange={handleAchievementChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="sports-admin-form-actions">
                <button
                  type="button"
                  className="sports-admin-primary-small"
                  onClick={handleAddAchievement}
                >
                  {editingAchievement !== null ? (
                    <>
                      <FaEdit />
                      Update Achievement
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Achievement
                    </>
                  )}
                </button>

                {editingAchievement !== null && (
                  <button
                    type="button"
                    className="sports-admin-secondary-small"
                    onClick={resetAchievementForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="sports-admin-list">
              {data.achievements.length === 0 ? (
                <div className="sports-admin-empty">No achievements added.</div>
              ) : (
                data.achievements.map((achievement, index) => (
                  <div
                    className={`sports-admin-list-card ${
                      achievement.isActive === false ? "inactive" : ""
                    }`}
                    key={achievement._id || `achievement-${index}`}
                  >
                    <div className="sports-admin-list-icon trophy">
                      <FaTrophy />
                    </div>

                    <div className="sports-admin-list-content">
                      <div className="sports-admin-list-title-row">
                        <h3>{achievement.title}</h3>

                        {achievement.year && (
                          <span className="sports-admin-category">
                            {achievement.year}
                          </span>
                        )}
                      </div>

                      <p>{achievement.description}</p>
                    </div>

                    <div className="sports-admin-list-actions">
                      <button
                        type="button"
                        onClick={() => editAchievement(index)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteAchievement(index)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="sports-admin-sub-panel">
              <h3>Sports Activities & Events</h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field full">
                  <label>Section Heading</label>

                  <input
                    type="text"
                    name="activitiesHeading"
                    value={data.activitiesHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Description</label>

                  <textarea
                    name="activitiesDescription"
                    value={data.activitiesDescription}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            GALLERY
        ================================================= */}

        {activeTab === "gallery" && (
          <div className="sports-admin-tab-panel">
            <div className="sports-admin-panel-heading">
              <div>
                <h2>Sports Gallery</h2>
                <p>Upload, replace, edit and delete Sports gallery images.</p>
              </div>

              <FaImage />
            </div>

            {/* UPLOAD */}

            <div className="sports-upload-box">
              <div className="sports-upload-icon">
                <FaUpload />
              </div>

              <div>
                <h3>Upload New Images</h3>

                <p>Select one or multiple JPG, JPEG, PNG or WEBP images.</p>
              </div>

              <label className="sports-upload-button">
                <FaUpload />
                Select Images
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleGallerySelect}
                />
              </label>
            </div>

            {/* SELECTED */}

            {selectedImages.length > 0 && (
              <div className="sports-selected-images">
                <div className="sports-selected-heading">
                  <h3>New Images Selected</h3>

                  <span>{selectedImages.length} image(s)</span>
                </div>

                <div className="sports-selected-grid">
                  {selectedImages.map((file, index) => (
                    <div
                      className="sports-selected-card"
                      key={`${file.name}-${index}`}
                    >
                      <img src={URL.createObjectURL(file)} alt={file.name} />

                      <div>
                        <span>{file.name}</span>

                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sports-upload-note">
                  Click <strong>Save Changes</strong> above to upload these
                  images to Cloudinary.
                </div>
              </div>
            )}

            {/* EXISTING IMAGES */}

            <div className="sports-existing-gallery">
              <div className="sports-selected-heading">
                <h3>Existing Gallery Images</h3>

                <span>{data.images.length} image(s)</span>
              </div>

              {data.images.length === 0 ? (
                <div className="sports-admin-empty">
                  No gallery images available.
                </div>
              ) : (
                <div className="sports-existing-grid">
                  {data.images
                    .slice()
                    .sort((a, b) => (a.order || 1) - (b.order || 1))
                    .map((image, index) => (
                      <div
                        className="sports-existing-card"
                        key={image._id || `image-${index}`}
                      >
                        <div className="sports-existing-preview">
                          <img
                            src={image.imageUrl}
                            alt={image.altText || image.title || "Sports"}
                          />

                          <div className="sports-existing-overlay">
                            <a
                              href={image.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="View Image"
                            >
                              <FaEye />
                            </a>
                          </div>
                        </div>

                        <div className="sports-existing-body">
                          <div className="sports-admin-field">
                            <label>Image Title</label>

                            <input
                              type="text"
                              value={image.title || ""}
                              onChange={(e) =>
                                handleImageDetailChange(
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="sports-admin-field">
                            <label>Alt Text</label>

                            <input
                              type="text"
                              value={image.altText || ""}
                              onChange={(e) =>
                                handleImageDetailChange(
                                  index,
                                  "altText",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="sports-existing-small-grid">
                            <div className="sports-admin-field">
                              <label>Order</label>

                              <input
                                type="number"
                                min="1"
                                value={image.order || 1}
                                onChange={(e) =>
                                  handleImageDetailChange(
                                    index,
                                    "order",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="sports-admin-field">
                              <label>Replace</label>

                              <label className="sports-replace-button">
                                <FaSyncAlt />
                                Replace Image
                                <input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/webp"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                      handleReplaceImage(image, file);
                                    }

                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sports-existing-actions">
                            <button
                              type="button"
                              className="sports-save-image-btn"
                              onClick={() => saveImageDetails(image)}
                            >
                              <FaSave />
                              Save Details
                            </button>

                            <button
                              type="button"
                              className="sports-delete-image-btn"
                              onClick={() => handleDeleteImage(image)}
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
            </div>
          </div>
        )}

        {/* =================================================
            CONTACT & TIMINGS
        ================================================= */}

        {activeTab === "contact" && (
          <div className="sports-admin-tab-panel">
            <div className="sports-admin-panel-heading">
              <div>
                <h2>Contact & Timings</h2>

                <p>Manage Sports coordination and facility timing details.</p>
              </div>

              <FaPhone />
            </div>

            <div className="sports-admin-sub-panel">
              <h3>Sports Coordinator</h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field">
                  <label>Coordinator Name</label>

                  <input
                    type="text"
                    name="coordinatorName"
                    value={data.coordinatorName}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Designation</label>

                  <input
                    type="text"
                    name="coordinatorDesignation"
                    value={data.coordinatorDesignation}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="coordinatorEmail"
                    value={data.coordinatorEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="coordinatorPhone"
                    value={data.coordinatorPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="sports-admin-sub-panel">
              <h3>Facility Timings</h3>

              <div className="sports-admin-form-grid">
                <div className="sports-admin-field full">
                  <label>Timings Section Heading</label>

                  <input
                    type="text"
                    name="timingsHeading"
                    value={data.timingsHeading}
                    onChange={handleChange}
                  />
                </div>

                <div className="sports-admin-field full">
                  <label>Sports Facility Timings</label>

                  <div className="sports-admin-input-icon">
                    <FaClock />

                    <input
                      type="text"
                      name="timings"
                      value={data.timings}
                      onChange={handleChange}
                      placeholder="Monday to Saturday: 7:00 AM to 8:00 PM"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          BOTTOM SAVE
      ================================================= */}

      <div className="sports-admin-bottom-actions">
        <button
          type="button"
          className="sports-admin-reset-btn"
          onClick={handleReset}
          disabled={resetting || saving}
        >
          <FaUndo />

          {resetting ? "Resetting..." : "Reset Defaults"}
        </button>

        <button
          type="button"
          className="sports-admin-save-btn"
          onClick={handleSave}
          disabled={saving || resetting}
        >
          <FaSave />

          {saving ? "Saving..." : "Save Sports Information"}
        </button>
      </div>
    </div>
  );
};

export default Sports;
