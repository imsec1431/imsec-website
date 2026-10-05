import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  FaBullseye,
  FaEye,
  FaImage,
  FaPlus,
  FaSave,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";

import ImageUploader from "../../components/common/ImageUploader";

import {
  getAdminAboutImsec,
  createAboutImsec,
  updateAboutImsec,
  publishAboutImsec,
  unpublishAboutImsec,
  uploadAboutImsecImage,
} from "../../services/aboutImsecAdminService";

import "./AboutImsecPage.css";

/* =========================================================
   DEFAULT FORM
========================================================= */

const defaultForm = {
  heroTitle: "About IMSEC",
  heroBreadcrumb: "Home / About / Overview",

  aboutImage:
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",

  aboutTag: "ABOUT IMSEC",

  aboutTitle: "IMS Engineering College, Ghaziabad",

  aboutTitleHighlight: "Ghaziabad",

  aboutDescription1:
    "IMS Engineering College (IMSEC), Ghaziabad, established in 2002, is one of the leading engineering institutions in North India. IMSEC is approved by AICTE, affiliated with Dr. A.P.J. Abdul Kalam Azad Technical University (AKTU), Lucknow, and offers world-class infrastructure, experienced faculty, modern laboratories, research facilities, and excellent placement opportunities.",

  aboutDescription2:
    "The institute is dedicated to creating technically competent professionals through innovation, research, entrepreneurship, and industry collaboration.",

  highlights: [
    {
      title: "Established in 2002",
      description:
        "Over two decades of excellence in engineering and management education.",
      displayOrder: 1,
    },
    {
      title: "NAAC & NBA Accredited",
      description:
        "Committed to maintaining the highest standards of quality education.",
      displayOrder: 2,
    },
    {
      title: "Industry Collaboration",
      description:
        "Strong partnerships with leading industries for better learning and placements.",
      displayOrder: 3,
    },
  ],

  visionTag: "OUR VISION",

  visionTitle: "Our Vision",

  visionDescription:
    "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",

  missionTag: "OUR MISSION",

  missionTitle: "Our Mission",

  missionItems: [
    {
      text: "Provide quality technical education.",
      displayOrder: 1,
    },
    {
      text: "Develop leadership and innovation.",
      displayOrder: 2,
    },
    {
      text: "Promote industry collaboration.",
      displayOrder: 3,
    },
    {
      text: "Encourage research and entrepreneurship.",
      displayOrder: 4,
    },
    {
      text: "Build ethical and responsible professionals.",
      displayOrder: 5,
    },
  ],

  whyChooseTag: "WHY IMSEC",

  whyChooseTitle: "Why Choose IMSEC?",

  whyChooseDescription:
    "At IMSEC, students experience quality education, industry exposure, research opportunities and excellent placements that prepare them for successful careers.",

  whyChooseItems: [
    {
      icon: "🎓",
      title: "Quality Education",
      text: "Outcome-based education with experienced faculty.",
      displayOrder: 1,
    },
    {
      icon: "💼",
      title: "Excellent Placements",
      text: "250+ recruiters and outstanding placement records.",
      displayOrder: 2,
    },
    {
      icon: "🔬",
      title: "Research & Innovation",
      text: "Modern research labs and innovation ecosystem.",
      displayOrder: 3,
    },
    {
      icon: "🏢",
      title: "Industry Collaboration",
      text: "MoUs with industries for internships and training.",
      displayOrder: 4,
    },
    {
      icon: "🏆",
      title: "Student Achievements",
      text: "National level awards, hackathons and competitions.",
      displayOrder: 5,
    },
    {
      icon: "🌳",
      title: "Modern Campus",
      text: "Green campus with world-class infrastructure.",
      displayOrder: 6,
    },
  ],

  facilityTag: "CAMPUS LIFE",

  facilityTitle: "World-Class Facilities",

  facilityDescription:
    "IMSEC provides students with modern infrastructure, smart classrooms, laboratories, library, sports facilities and a vibrant campus environment.",

  facilities: [
    {
      title: "Central Library",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
      displayOrder: 1,
    },
    {
      title: "Modern Laboratories",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80",
      displayOrder: 2,
    },
    {
      title: "Smart Classrooms",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
      displayOrder: 3,
    },
    {
      title: "Sports Complex",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
      displayOrder: 4,
    },
    {
      title: "Hostel Facility",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
      displayOrder: 5,
    },
    {
      title: "Innovation Center",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
      displayOrder: 6,
    },
  ],

  ctaTitle: "Ready to Begin Your Journey at IMSEC?",

  ctaDescription:
    "Join one of the leading engineering institutions and shape your future with quality education, innovation, and excellent placements.",

  isPublished: true,

  displayOrder: 1,
};

/* =========================================================
   COMPONENT
========================================================= */

const AboutImsec = () => {
  const [form, setForm] = useState(defaultForm);

  const [aboutId, setAboutId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =======================================================
     IMAGE STATES
  ======================================================= */

  const [aboutImageFile, setAboutImageFile] = useState(null);

  const [aboutImagePreview, setAboutImagePreview] = useState(
    defaultForm.aboutImage,
  );

  const [facilityImageFiles, setFacilityImageFiles] = useState([]);

  const [facilityImagePreviews, setFacilityImagePreviews] = useState(
    defaultForm.facilities.map((item) => item.image || ""),
  );

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminAboutImsec();

      if (response?.success && response?.data) {
        const data = response.data;

        setAboutId(data._id);

        setForm({
          ...defaultForm,
          ...data,

          highlights: data.highlights?.length
            ? data.highlights
            : defaultForm.highlights,

          missionItems: data.missionItems?.length
            ? data.missionItems
            : defaultForm.missionItems,

          whyChooseItems: data.whyChooseItems?.length
            ? data.whyChooseItems
            : defaultForm.whyChooseItems,

          facilities: data.facilities?.length
            ? data.facilities
            : defaultForm.facilities,
        });

        setAboutImagePreview(data.aboutImage || defaultForm.aboutImage);

        setFacilityImagePreviews(
          (data.facilities?.length
            ? data.facilities
            : defaultForm.facilities
          ).map((item) => item.image || ""),
        );

        setAboutImageFile(null);
        setFacilityImageFiles([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load About IMSEC data.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     BASIC FIELD HANDLER
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     ARRAY FIELD HANDLER
  ======================================================= */

  const updateArrayItem = (field, index, key, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];

      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  /* =======================================================
     ADD ARRAY ITEM
  ======================================================= */

  const addArrayItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        {
          ...item,
          displayOrder: prev[field].length + 1,
        },
      ],
    }));
  };

  /* =======================================================
     REMOVE ARRAY ITEM
  ======================================================= */

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field]
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          displayOrder: itemIndex + 1,
        })),
    }));

    if (field === "facilities") {
      setFacilityImageFiles((prev) =>
        prev.filter((_, itemIndex) => itemIndex !== index),
      );

      setFacilityImagePreviews((prev) =>
        prev.filter((_, itemIndex) => itemIndex !== index),
      );
    }
  };

  /* =======================================================
     ABOUT IMAGE
  ======================================================= */

  const handleAboutImage = (file) => {
    setAboutImageFile(file);

    if (file) {
      setAboutImagePreview(URL.createObjectURL(file));
    }
  };

  /* =======================================================
     FACILITY IMAGE
  ======================================================= */

  const handleFacilityImage = (index, file) => {
    if (!file) return;

    setFacilityImageFiles((prev) => {
      const updated = [...prev];

      updated[index] = file;

      return updated;
    });

    setFacilityImagePreviews((prev) => {
      const updated = [...prev];

      updated[index] = URL.createObjectURL(file);

      return updated;
    });
  };

  /* =======================================================
     UPLOAD IMAGE HELPER
  ======================================================= */

  const uploadImage = async (file) => {
    if (!file) return "";

    const response = await uploadAboutImsecImage(file);

    /*
      Existing upload controller returns:
      {
        success: true,
        count: ...,
        data: [...]
      }

      imageUrl is stored inside data[0].
    */

    const uploaded = response?.data?.[0];

    return uploaded?.imageUrl || uploaded?.url || "";
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let updatedForm = {
        ...form,
      };

      /* ================================================
         ABOUT IMAGE UPLOAD
      ================================================ */

      if (aboutImageFile) {
        setUploading(true);

        const imageUrl = await uploadImage(aboutImageFile);

        if (imageUrl) {
          updatedForm.aboutImage = imageUrl;
        }

        setUploading(false);
      }

      /* ================================================
         FACILITY IMAGE UPLOADS
      ================================================ */

      const hasFacilityFiles = facilityImageFiles.some((file) => !!file);

      if (hasFacilityFiles) {
        setUploading(true);

        const updatedFacilities = [...updatedForm.facilities];

        for (let index = 0; index < facilityImageFiles.length; index++) {
          const file = facilityImageFiles[index];

          if (!file) continue;

          const imageUrl = await uploadImage(file);

          if (imageUrl) {
            updatedFacilities[index] = {
              ...updatedFacilities[index],
              image: imageUrl,
            };
          }
        }

        updatedForm.facilities = updatedFacilities;

        setUploading(false);
      }

      /* ================================================
         CREATE / UPDATE
      ================================================ */

      let response;

      if (aboutId) {
        response = await updateAboutImsec(aboutId, updatedForm);
      } else {
        response = await createAboutImsec(updatedForm);
      }

      if (response?.success) {
        setAboutId(response.data?._id || aboutId);

        setForm(response.data || updatedForm);

        setAboutImagePreview(
          response.data?.aboutImage || updatedForm.aboutImage,
        );

        setFacilityImagePreviews(
          (response.data?.facilities || updatedForm.facilities).map(
            (item) => item.image || "",
          ),
        );

        setAboutImageFile(null);
        setFacilityImageFiles([]);

        setSuccess(response.message || "About IMSEC saved successfully.");
      } else {
        throw new Error(response?.message || "Failed to save About IMSEC.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save About IMSEC.",
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  /* =======================================================
     PUBLISH / UNPUBLISH
  ======================================================= */

  const handlePublishToggle = async () => {
    if (!aboutId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      if (form.isPublished) {
        response = await unpublishAboutImsec(aboutId);
      } else {
        response = await publishAboutImsec(aboutId);
      }

      if (response?.success) {
        setForm((prev) => ({
          ...prev,
          isPublished: !prev.isPublished,
        }));

        setSuccess(response.message || "Publication status updated.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update publication status.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="about-admin-loading">
        <Spinner animation="border" />
        <p>Loading About IMSEC...</p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="about-imsec-admin">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-page-header">
        <div>
          <h2>About IMSEC</h2>

          <p>
            Manage About IMSEC, vision, mission, facilities and institutional
            highlights.
          </p>
        </div>

        <div className="admin-header-actions">
          {aboutId && (
            <Button
              variant={form.isPublished ? "outline-danger" : "outline-success"}
              onClick={handlePublishToggle}
              disabled={saving}
            >
              {form.isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || uploading}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {uploading && (
        <Alert variant="info">
          <FaUpload className="me-2" />
          Uploading image(s)... Please wait.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* =================================================
            HERO
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header>
            <h4>Hero Banner</h4>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hero Title</Form.Label>

                  <Form.Control
                    name="heroTitle"
                    value={form.heroTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Breadcrumb</Form.Label>

                  <Form.Control
                    name="heroBreadcrumb"
                    value={form.heroBreadcrumb}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* =================================================
            ABOUT SECTION
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header>
            <h4>About IMSEC</h4>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col lg={5}>
                <Form.Label>About Image</Form.Label>

                <ImageUploader
                  preview={aboutImagePreview}
                  setPreview={setAboutImagePreview}
                  setImage={handleAboutImage}
                />
              </Col>

              <Col lg={7}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Tag</Form.Label>

                      <Form.Control
                        name="aboutTag"
                        value={form.aboutTag}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Highlight Text</Form.Label>

                      <Form.Control
                        name="aboutTitleHighlight"
                        value={form.aboutTitleHighlight}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>About Title</Form.Label>

                  <Form.Control
                    name="aboutTitle"
                    value={form.aboutTitle}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description 1</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="aboutDescription1"
                    value={form.aboutDescription1}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description 2</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="aboutDescription2"
                    value={form.aboutDescription2}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* =================================================
            HIGHLIGHTS
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Overview Highlights</h4>

            <Button
              size="sm"
              onClick={() =>
                addArrayItem("highlights", {
                  title: "",
                  description: "",
                })
              }
            >
              <FaPlus className="me-1" />
              Add Highlight
            </Button>
          </Card.Header>

          <Card.Body>
            {form.highlights.map((item, index) => (
              <Card key={index} className="admin-inner-card mb-3">
                <Card.Body>
                  <Row>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>

                        <Form.Control
                          value={item.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "highlights",
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>

                        <Form.Control
                          value={item.description}
                          onChange={(e) =>
                            updateArrayItem(
                              "highlights",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeArrayItem("highlights", index)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>

        {/* =================================================
            VISION & MISSION
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header>
            <h4>Vision & Mission</h4>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              {/* VISION */}

              <Col lg={6}>
                <div className="vision-admin-box">
                  <div className="admin-box-icon">
                    <FaEye />
                  </div>

                  <h5>Vision</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Tag</Form.Label>

                    <Form.Control
                      name="visionTag"
                      value={form.visionTag}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>

                    <Form.Control
                      name="visionTitle"
                      value={form.visionTitle}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={7}
                      name="visionDescription"
                      value={form.visionDescription}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </Col>

              {/* MISSION */}

              <Col lg={6}>
                <div className="vision-admin-box">
                  <div className="admin-box-icon">
                    <FaBullseye />
                  </div>

                  <h5>Mission</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Tag</Form.Label>

                    <Form.Control
                      name="missionTag"
                      value={form.missionTag}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>

                    <Form.Control
                      name="missionTitle"
                      value={form.missionTitle}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Label>Mission Points</Form.Label>

                  {form.missionItems.map((item, index) => (
                    <div key={index} className="mission-admin-item">
                      <Form.Control
                        value={item.text}
                        onChange={(e) =>
                          updateArrayItem(
                            "missionItems",
                            index,
                            "text",
                            e.target.value,
                          )
                        }
                      />

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeArrayItem("missionItems", index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      addArrayItem("missionItems", {
                        text: "",
                      })
                    }
                  >
                    <FaPlus className="me-1" />
                    Add Mission
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* =================================================
            WHY CHOOSE
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Why Choose IMSEC</h4>

            <Button
              size="sm"
              onClick={() =>
                addArrayItem("whyChooseItems", {
                  icon: "🎓",
                  title: "",
                  text: "",
                })
              }
            >
              <FaPlus className="me-1" />
              Add Feature
            </Button>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Tag</Form.Label>

                  <Form.Control
                    name="whyChooseTag"
                    value={form.whyChooseTag}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Title</Form.Label>

                  <Form.Control
                    name="whyChooseTitle"
                    value={form.whyChooseTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                name="whyChooseDescription"
                value={form.whyChooseDescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="g-3">
              {form.whyChooseItems.map((item, index) => (
                <Col lg={6} key={index}>
                  <Card className="admin-inner-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-3">
                        <strong>Feature #{index + 1}</strong>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            removeArrayItem("whyChooseItems", index)
                          }
                        >
                          <FaTrash />
                        </Button>
                      </div>

                      <Row>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Icon</Form.Label>

                            <Form.Control
                              value={item.icon}
                              onChange={(e) =>
                                updateArrayItem(
                                  "whyChooseItems",
                                  index,
                                  "icon",
                                  e.target.value,
                                )
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col md={9}>
                          <Form.Group>
                            <Form.Label>Title</Form.Label>

                            <Form.Control
                              value={item.title}
                              onChange={(e) =>
                                updateArrayItem(
                                  "whyChooseItems",
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mt-3">
                        <Form.Label>Description</Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={item.text}
                          onChange={(e) =>
                            updateArrayItem(
                              "whyChooseItems",
                              index,
                              "text",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* =================================================
            FACILITIES
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4>Campus Facilities</h4>

            <Button
              size="sm"
              onClick={() => {
                addArrayItem("facilities", {
                  title: "",
                  image: "",
                });

                setFacilityImageFiles((prev) => [...prev, null]);

                setFacilityImagePreviews((prev) => [...prev, ""]);
              }}
            >
              <FaPlus className="me-1" />
              Add Facility
            </Button>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Tag</Form.Label>

                  <Form.Control
                    name="facilityTag"
                    value={form.facilityTag}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Title</Form.Label>

                  <Form.Control
                    name="facilityTitle"
                    value={form.facilityTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                name="facilityDescription"
                value={form.facilityDescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="g-4">
              {form.facilities.map((item, index) => (
                <Col lg={4} md={6} key={index}>
                  <Card className="facility-admin-card h-100">
                    <Card.Header className="d-flex justify-content-between">
                      <strong>Facility #{index + 1}</strong>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeArrayItem("facilities", index)}
                      >
                        <FaTrash />
                      </Button>
                    </Card.Header>

                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Facility Title</Form.Label>

                        <Form.Control
                          value={item.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "facilities",
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>

                      <div className="facility-upload-box">
                        <ImageUploader
                          preview={
                            facilityImagePreviews[index] || item.image || ""
                          }
                          setPreview={(preview) => {
                            setFacilityImagePreviews((prev) => {
                              const updated = [...prev];

                              updated[index] = preview;

                              return updated;
                            });
                          }}
                          setImage={(file) => handleFacilityImage(index, file)}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* =================================================
            CTA
        ================================================= */}

        <Card className="admin-section-card">
          <Card.Header>
            <h4>Call To Action</h4>
          </Card.Header>

          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>CTA Title</Form.Label>

              <Form.Control
                name="ctaTitle"
                value={form.ctaTitle}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>CTA Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={4}
                name="ctaDescription"
                value={form.ctaDescription}
                onChange={handleChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* =================================================
            BOTTOM SAVE
        ================================================= */}

        <div className="admin-bottom-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving || uploading}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save About IMSEC
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AboutImsec;
