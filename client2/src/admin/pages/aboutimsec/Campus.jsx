import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import {
  getAdminCampus,
  createCampus,
  updateCampus,
  publishCampus,
  unpublishCampus,
  uploadCampusImage,
} from "../../services/campusAdminService";

import ImageUploader from "../../components/common/ImageUploader";
import "./Campus.css";

const defaultForm = {
  overviewImage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",

  overviewTag: "CAMPUS OVERVIEW",

  overviewTitle: "Discover the IMSEC Campus",

  overviewDescription:
    "IMS Engineering College offers a vibrant, technology-enabled campus with smart classrooms, advanced laboratories, modern library, sports facilities, innovation centers and lush green surroundings that create the perfect learning environment.",

  overviewStats: [
    {
      value: "50+",
      label: "Labs",
      displayOrder: 1,
    },
    {
      value: "25+",
      label: "Acres",
      displayOrder: 2,
    },
    {
      value: "100%",
      label: "Wi-Fi",
      displayOrder: 3,
    },
  ],

  gallery: [
    {
      title: "Main Building",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      displayOrder: 1,
    },
    {
      title: "Central Library",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      displayOrder: 2,
    },
    {
      title: "Computer Lab",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
      displayOrder: 3,
    },
    {
      title: "Seminar Hall",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
      displayOrder: 4,
    },
    {
      title: "Sports Complex",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
      displayOrder: 5,
    },
    {
      title: "Campus Garden",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
      displayOrder: 6,
    },
  ],

  facilities: [
    {
      icon: "BookOpen",
      title: "Digital Library",
      displayOrder: 1,
    },
    {
      icon: "Computer",
      title: "Modern Labs",
      displayOrder: 2,
    },
    {
      icon: "Building",
      title: "Smart Classrooms",
      displayOrder: 3,
    },
    {
      icon: "Futbol",
      title: "Sports Arena",
      displayOrder: 4,
    },
    {
      icon: "Wifi",
      title: "Wi-Fi Campus",
      displayOrder: 5,
    },
    {
      icon: "Laptop",
      title: "A.C. Classes",
      displayOrder: 6,
    },
  ],

  tourImage:
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80",

  tourTag: "VIRTUAL CAMPUS TOUR",

  tourTitle: "Explore Our Campus Virtually",

  tourDescription:
    "Experience IMSEC from anywhere through our virtual campus tour. Discover classrooms, laboratories, innovation centers, sports facilities and beautiful green surroundings.",

  tourVideoLink: "https://www.youtube.com/",

  tourButtonText: "Watch Tour",

  greenTag: "GREEN CAMPUS",

  greenTitle: "Sustainable & Eco Friendly",

  greenDescription:
    "IMSEC promotes sustainable development through lush green gardens, energy-efficient infrastructure, clean surroundings and environmentally responsible practices.",

  greenCardTitle: "Green Environment",

  greenCardDescription:
    "Beautiful landscapes, eco-friendly initiatives and a peaceful learning atmosphere.",

  studentLifeTag: "STUDENT LIFE",

  studentLifeTitle: "Life at IMSEC",

  studentLife: [
    {
      title: "Technical Clubs",
      displayOrder: 1,
    },
    {
      title: "Cultural Events",
      displayOrder: 2,
    },
    {
      title: "Hackathons",
      displayOrder: 3,
    },
    {
      title: "Sports Activities",
      displayOrder: 4,
    },
    {
      title: "Innovation Cell",
      displayOrder: 5,
    },
    {
      title: "Industrial Visits",
      displayOrder: 6,
    },
  ],

  ctaTitle: "Visit Our Beautiful Campus",

  ctaDescription:
    "Experience modern infrastructure, academic excellence and vibrant student life by visiting IMS Engineering College.",

  isPublished: true,

  displayOrder: 1,
};

const Campus = () => {
  const [form, setForm] = useState(defaultForm);

  const [campusId, setCampusId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [activeModal, setActiveModal] = useState(null);

  /*
   * =====================================================
   * IMAGE FILE STATES
   *
   * Existing ImageUploader.jsx returns File objects.
   * We keep those files here and upload them on Save.
   * =====================================================
   */

  const [overviewImageFile, setOverviewImageFile] = useState(null);

  const [tourImageFile, setTourImageFile] = useState(null);

  const [galleryImageFiles, setGalleryImageFiles] = useState([]);

  const [overviewPreview, setOverviewPreview] = useState("");

  const [tourPreview, setTourPreview] = useState("");

  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    loadCampus();
  }, []);

  /* =====================================================
     LOAD CAMPUS
  ===================================================== */

  const loadCampus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCampus();

      if (response?.data) {
        setForm(response.data);
        setCampusId(response.data._id);

        /*
         * Existing database image URLs
         * become ImageUploader previews.
         */

        setOverviewPreview(response.data.overviewImage || "");

        setTourPreview(response.data.tourImage || "");

        setGalleryPreviews(
          (response.data.gallery || []).map((item) => item.image || ""),
        );

        /*
         * Clear newly selected files
         */

        setOverviewImageFile(null);
        setTourImageFile(null);
        setGalleryImageFiles([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load campus data",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     COMMON CHANGE
  ===================================================== */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     OVERVIEW STATS
  ===================================================== */

  const updateStat = (index, field, value) => {
    const updated = [...form.overviewStats];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      overviewStats: updated,
    }));
  };

  /* =====================================================
     GALLERY
  ===================================================== */

  const updateGallery = (index, field, value) => {
    const updated = [...form.gallery];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      gallery: updated,
    }));
  };

  const addGalleryItem = () => {
    setForm((prev) => ({
      ...prev,

      gallery: [
        ...prev.gallery,

        {
          title: "",
          image: "",
          displayOrder: prev.gallery.length + 1,
        },
      ],
    }));

    /*
     * Keep file and preview arrays
     * synchronized with gallery.
     */

    setGalleryImageFiles((prev) => [...prev, null]);

    setGalleryPreviews((prev) => [...prev, ""]);
  };

  const removeGalleryItem = (index) => {
    const updated = form.gallery.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,

      gallery: updated.map((item, i) => ({
        ...item,
        displayOrder: i + 1,
      })),
    }));

    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* =====================================================
     FACILITIES
  ===================================================== */

  const updateFacility = (index, field, value) => {
    const updated = [...form.facilities];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      facilities: updated,
    }));
  };

  /* =====================================================
     STUDENT LIFE
  ===================================================== */

  const updateStudentLife = (index, field, value) => {
    const updated = [...form.studentLife];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      studentLife: updated,
    }));
  };

  const addStudentLife = () => {
    setForm((prev) => ({
      ...prev,

      studentLife: [
        ...prev.studentLife,

        {
          title: "",
          displayOrder: prev.studentLife.length + 1,
        },
      ],
    }));
  };

  const removeStudentLife = (index) => {
    const updated = form.studentLife.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,

      studentLife: updated.map((item, i) => ({
        ...item,
        displayOrder: i + 1,
      })),
    }));
  };

  /* =====================================================
     UPLOAD ONE IMAGE
  ===================================================== */

  const uploadSingleImage = async (file, imageName) => {
    if (!file) {
      return null;
    }

    const response = await uploadCampusImage(file);

    const uploadedImage = response?.data?.[0];

    if (!uploadedImage?.imageUrl) {
      throw new Error(`${imageName} upload failed.`);
    }

    return uploadedImage.imageUrl;
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      /*
       * Make a copy so we don't directly
       * modify the React state while uploading.
       */

      const updatedForm = {
        ...form,

        overviewStats: [...(form.overviewStats || [])],

        gallery: [...(form.gallery || [])],

        facilities: [...(form.facilities || [])],

        studentLife: [...(form.studentLife || [])],
      };

      /* =================================================
         OVERVIEW IMAGE
      ================================================= */

      if (overviewImageFile) {
        const imageUrl = await uploadSingleImage(
          overviewImageFile,
          "Overview image",
        );

        updatedForm.overviewImage = imageUrl;
      }

      /* =================================================
         TOUR IMAGE
      ================================================= */

      if (tourImageFile) {
        const imageUrl = await uploadSingleImage(tourImageFile, "Tour image");

        updatedForm.tourImage = imageUrl;
      }

      /* =================================================
         GALLERY IMAGES
      ================================================= */

      for (let index = 0; index < galleryImageFiles.length; index++) {
        const file = galleryImageFiles[index];

        if (!file) {
          continue;
        }

        const imageUrl = await uploadSingleImage(
          file,
          `Gallery image ${index + 1}`,
        );

        if (updatedForm.gallery[index]) {
          updatedForm.gallery[index] = {
            ...updatedForm.gallery[index],

            image: imageUrl,
          };
        }
      }

      /* =================================================
         SAVE CAMPUS
      ================================================= */

      let response;

      if (campusId) {
        response = await updateCampus(campusId, updatedForm);
      } else {
        response = await createCampus(updatedForm);
      }

      /* =================================================
         UPDATE STATE FROM DATABASE
      ================================================= */

      if (response?.data) {
        setForm(response.data);

        setCampusId(response.data._id);

        setOverviewPreview(response.data.overviewImage || "");

        setTourPreview(response.data.tourImage || "");

        setGalleryPreviews(
          (response.data.gallery || []).map((item) => item.image || ""),
        );
      }

      /* =================================================
         CLEAR SELECTED FILES
      ================================================= */

      setOverviewImageFile(null);
      setTourImageFile(null);

      setGalleryImageFiles(new Array(updatedForm.gallery.length).fill(null));

      setMessage("Campus data and images saved successfully.");
    } catch (err) {
      console.error("Campus save error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save campus data",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     PUBLISH
  ===================================================== */

  const handlePublishToggle = async () => {
    if (!campusId) return;

    try {
      setError("");
      setMessage("");

      let response;

      if (form.isPublished) {
        response = await unpublishCampus(campusId);
      } else {
        response = await publishCampus(campusId);
      }

      if (response?.data) {
        setForm(response.data);
      }

      setMessage(
        response?.message ||
          (form.isPublished
            ? "Campus unpublished successfully."
            : "Campus published successfully."),
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update publish status",
      );
    }
  };

  /* =====================================================
     MODAL CLOSE
  ===================================================== */

  const closeModal = () => {
    setActiveModal(null);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="admin-loading">Loading Campus...</div>
      </div>
    );
  }

  return (
    <div className="admin-page-container campus-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-page-header">
        <div>
          <h1>Campus</h1>

          <p>Manage campus content, images and facilities.</p>
        </div>

        <button
          type="button"
          className={`btn ${form.isPublished ? "btn-warning" : "btn-success"}`}
          onClick={handlePublishToggle}
          disabled={!campusId}
        >
          {form.isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Campus Overview</h3>

            <p>Manage campus overview information and statistics.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("overview")}>
            Edit Info
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-admin-summary">
            <div>
              <strong>Title:</strong> {form.overviewTitle}
            </div>

            <div>
              <strong>Tag:</strong> {form.overviewTag}
            </div>

            <div>
              <strong>Statistics:</strong> {form.overviewStats?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          GALLERY
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Campus Gallery</h3>

            <p>Manage campus gallery images and titles.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("gallery")}>
            Manage Gallery
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-summary-count">
            {form.gallery?.length || 0} gallery images
          </div>
        </div>
      </div>

      {/* =================================================
          FACILITIES
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Campus Facilities</h3>

            <p>Manage facilities and their icons.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("facilities")}>
            Edit Facilities
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-summary-count">
            {form.facilities?.length || 0} facilities
          </div>
        </div>
      </div>

      {/* =================================================
          TOUR
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Virtual Campus Tour</h3>

            <p>Manage tour image, information and video link.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("tour")}>
            Edit Info
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-admin-summary">
            <div>
              <strong>Title:</strong> {form.tourTitle}
            </div>

            <div>
              <strong>Button:</strong> {form.tourButtonText}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          GREEN CAMPUS
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Green Campus</h3>

            <p>Manage sustainable and eco-friendly campus information.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("green")}>
            Edit Info
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-admin-summary">
            <div>
              <strong>Title:</strong> {form.greenTitle}
            </div>

            <div>
              <strong>Card:</strong> {form.greenCardTitle}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          STUDENT LIFE
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Student Life</h3>

            <p>Manage student activities and section information.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("studentLife")}>
            Edit Activities
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-summary-count">
            {form.studentLife?.length || 0} activities
          </div>
        </div>
      </div>

      {/* =================================================
          CTA
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Call To Action</h3>

            <p>Manage the campus visit call-to-action section.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("cta")}>
            Edit Info
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-admin-summary">
            <div>
              <strong>Title:</strong> {form.ctaTitle}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          SETTINGS
      ================================================= */}

      <div className="admin-card">
        <div className="admin-card-header campus-section-header">
          <div>
            <h3>Settings</h3>

            <p>Manage publishing and display order.</p>
          </div>

          <Button variant="dark" onClick={() => setActiveModal("settings")}>
            Edit Settings
          </Button>
        </div>

        <div className="admin-card-body">
          <div className="campus-admin-summary">
            <div>
              <strong>Status:</strong>{" "}
              {form.isPublished ? "Published" : "Unpublished"}
            </div>

            <div>
              <strong>Display Order:</strong> {form.displayOrder}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          OVERVIEW MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "overview"}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Campus Overview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-4">
            <label className="form-label">Overview Image</label>

            <ImageUploader
              preview={overviewPreview}
              setPreview={setOverviewPreview}
              setImage={setOverviewImageFile}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tag</label>

              <input
                type="text"
                className="form-control"
                value={form.overviewTag}
                onChange={(e) => handleChange("overviewTag", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Title</label>

              <input
                type="text"
                className="form-control"
                value={form.overviewTitle}
                onChange={(e) => handleChange("overviewTitle", e.target.value)}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description</label>

              <textarea
                className="form-control"
                rows="5"
                value={form.overviewDescription}
                onChange={(e) =>
                  handleChange("overviewDescription", e.target.value)
                }
              />
            </div>
          </div>

          <h5 className="mt-3 mb-3">Overview Statistics</h5>

          <div className="row">
            {form.overviewStats.map((stat, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="border rounded p-3">
                  <label className="form-label">Value</label>

                  <input
                    type="text"
                    className="form-control mb-3"
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                  />

                  <label className="form-label">Label</label>

                  <input
                    type="text"
                    className="form-control"
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          GALLERY MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "gallery"}
        onHide={closeModal}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Campus Gallery</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-end mb-4">
            <Button variant="dark" onClick={addGalleryItem}>
              + Add Gallery Image
            </Button>
          </div>

          {form.gallery.map((item, index) => (
            <div className="campus-modal-item" key={index}>
              <div className="campus-modal-item-header">
                <h5>Gallery Image {index + 1}</h5>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeGalleryItem(index)}
                >
                  Remove
                </button>
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label className="form-label">Image</label>

                  <ImageUploader
                    preview={galleryPreviews[index] || item.image || ""}
                    setPreview={(preview) => {
                      setGalleryPreviews((previous) => {
                        const updated = [...previous];

                        updated[index] = preview;

                        return updated;
                      });
                    }}
                    setImage={(file) => {
                      setGalleryImageFiles((previous) => {
                        const updated = [...previous];

                        updated[index] = file;

                        return updated;
                      });
                    }}
                  />
                </div>

                <div className="col-md-7">
                  <div className="mb-3">
                    <label className="form-label">Title</label>

                    <input
                      type="text"
                      className="form-control"
                      value={item.title}
                      onChange={(e) =>
                        updateGallery(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Display Order</label>

                    <input
                      type="number"
                      className="form-control"
                      value={item.displayOrder}
                      onChange={(e) =>
                        updateGallery(
                          index,
                          "displayOrder",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          FACILITIES MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "facilities"}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Campus Facilities</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {form.facilities.map((facility, index) => (
            <div className="campus-modal-item" key={index}>
              <div className="row align-items-end">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Icon</label>

                  <select
                    className="form-select"
                    value={facility.icon}
                    onChange={(e) =>
                      updateFacility(index, "icon", e.target.value)
                    }
                  >
                    <option value="BookOpen">BookOpen</option>

                    <option value="Computer">Computer</option>

                    <option value="Building">Building</option>

                    <option value="Futbol">Futbol</option>

                    <option value="Wifi">Wifi</option>

                    <option value="Laptop">Laptop</option>
                  </select>
                </div>

                <div className="col-md-5 mb-3">
                  <label className="form-label">Title</label>

                  <input
                    type="text"
                    className="form-control"
                    value={facility.title}
                    onChange={(e) =>
                      updateFacility(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Display Order</label>

                  <input
                    type="number"
                    className="form-control"
                    value={facility.displayOrder}
                    onChange={(e) =>
                      updateFacility(
                        index,
                        "displayOrder",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          TOUR MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "tour"}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Virtual Campus Tour</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-4">
            <label className="form-label">Tour Image</label>

            <ImageUploader
              preview={tourPreview}
              setPreview={setTourPreview}
              setImage={setTourImageFile}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tag</label>

              <input
                type="text"
                className="form-control"
                value={form.tourTag}
                onChange={(e) => handleChange("tourTag", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Title</label>

              <input
                type="text"
                className="form-control"
                value={form.tourTitle}
                onChange={(e) => handleChange("tourTitle", e.target.value)}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description</label>

              <textarea
                className="form-control"
                rows="5"
                value={form.tourDescription}
                onChange={(e) =>
                  handleChange("tourDescription", e.target.value)
                }
              />
            </div>

            <div className="col-md-8 mb-3">
              <label className="form-label">Video Link</label>

              <input
                type="url"
                className="form-control"
                value={form.tourVideoLink}
                onChange={(e) => handleChange("tourVideoLink", e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Button Text</label>

              <input
                type="text"
                className="form-control"
                value={form.tourButtonText}
                onChange={(e) => handleChange("tourButtonText", e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          GREEN CAMPUS MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "green"}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Green Campus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tag</label>

              <input
                type="text"
                className="form-control"
                value={form.greenTag}
                onChange={(e) => handleChange("greenTag", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Title</label>

              <input
                type="text"
                className="form-control"
                value={form.greenTitle}
                onChange={(e) => handleChange("greenTitle", e.target.value)}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description</label>

              <textarea
                className="form-control"
                rows="5"
                value={form.greenDescription}
                onChange={(e) =>
                  handleChange("greenDescription", e.target.value)
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Card Title</label>

              <input
                type="text"
                className="form-control"
                value={form.greenCardTitle}
                onChange={(e) => handleChange("greenCardTitle", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Card Description</label>

              <textarea
                className="form-control"
                rows="4"
                value={form.greenCardDescription}
                onChange={(e) =>
                  handleChange("greenCardDescription", e.target.value)
                }
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          STUDENT LIFE MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "studentLife"}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Life</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Tag</label>

              <input
                type="text"
                className="form-control"
                value={form.studentLifeTag}
                onChange={(e) => handleChange("studentLifeTag", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Title</label>

              <input
                type="text"
                className="form-control"
                value={form.studentLifeTitle}
                onChange={(e) =>
                  handleChange("studentLifeTitle", e.target.value)
                }
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Button variant="dark" onClick={addStudentLife}>
              + Add Activity
            </Button>
          </div>

          {form.studentLife.map((activity, index) => (
            <div className="campus-modal-item" key={index}>
              <div className="row align-items-end">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Activity</label>

                  <input
                    type="text"
                    className="form-control"
                    value={activity.title}
                    onChange={(e) =>
                      updateStudentLife(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-label">Order</label>

                  <input
                    type="number"
                    className="form-control"
                    value={activity.displayOrder}
                    onChange={(e) =>
                      updateStudentLife(
                        index,
                        "displayOrder",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="col-md-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeStudentLife(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          CTA MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "cta"}
        onHide={closeModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Call To Action</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Title</label>

            <input
              type="text"
              className="form-control"
              value={form.ctaTitle}
              onChange={(e) => handleChange("ctaTitle", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>

            <textarea
              className="form-control"
              rows="5"
              value={form.ctaDescription}
              onChange={(e) => handleChange("ctaDescription", e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          SETTINGS MODAL
      ===================================================== */}

      <Modal
        show={activeModal === "settings"}
        onHide={closeModal}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Campus Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Display Order</label>

            <input
              type="number"
              className="form-control"
              value={form.displayOrder}
              onChange={(e) =>
                handleChange("displayOrder", Number(e.target.value))
              }
            />
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="campusPublishedModal"
              checked={form.isPublished}
              onChange={(e) => handleChange("isPublished", e.target.checked)}
            />

            <label className="form-check-label" htmlFor="campusPublishedModal">
              Published
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="d-flex justify-content-end mb-5">
        <button
          type="button"
          className="btn btn-primary btn-lg px-5"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Save Campus"}
        </button>
      </div>
    </div>
  );
};

export default Campus;
