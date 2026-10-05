import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";

import {
  FaBullseye,
  FaEye,
  FaPlus,
  FaSave,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

import ImageUploader from "../../components/common/ImageUploader";

import {
  getVisionMissionAdmin,
  createVisionMission,
  updateVisionMission,
  publishVisionMission,
  unpublishVisionMission,
  deleteVisionMission,
  uploadVisionMissionImage,
} from "../../services/visionMissionAdminService";

import "./VisionMission.css";

const DEFAULT_DATA = {
  heroTitle: "Vision & Mission",

  heroBreadcrumb: "Home / About / Vision & Mission",

  introImage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",

  introTitle: "Inspiring Future Leaders",

  introTitleHighlight: "Leaders",

  introDescription:
    "To become a globally recognized institution by providing quality education, promoting research, innovation, entrepreneurship and producing competent professionals with ethical values.",

  visionTitle: "Our Vision",

  visionDescription:
    "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",

  missionTitle: "Our Mission",

  missionItems: [
    "Provide quality technical education.",
    "Develop leadership and innovation.",
    "Promote industry collaboration.",
    "Encourage research and entrepreneurship.",
    "Build ethical and responsible professionals.",
  ],

  missionSectionTag: "OUR MISSION",

  missionSectionTitle: "What We Believe",

  missionSectionHighlight: "Believe",

  missionCards: [
    {
      title: "Quality Education",
      icon: "🎓",
      desc: "Provide outcome-based quality technical education.",
      displayOrder: 1,
    },
    {
      title: "Research",
      icon: "🔬",
      desc: "Promote innovation and interdisciplinary research.",
      displayOrder: 2,
    },
    {
      title: "Industry Connect",
      icon: "🏢",
      desc: "Build strong collaboration with industries.",
      displayOrder: 3,
    },
    {
      title: "Leadership",
      icon: "👨‍💼",
      desc: "Develop ethical and responsible leaders.",
      displayOrder: 4,
    },
    {
      title: "Entrepreneurship",
      icon: "🚀",
      desc: "Encourage startup culture and innovation.",
      displayOrder: 5,
    },
    {
      title: "Global Exposure",
      icon: "🌎",
      desc: "Prepare students for global opportunities.",
      displayOrder: 6,
    },
  ],

  valuesSectionTitle: "Core Values",

  valuesSectionHighlight: "Values",

  values: [
    {
      name: "Integrity",
      displayOrder: 1,
    },
    {
      name: "Innovation",
      displayOrder: 2,
    },
    {
      name: "Leadership",
      displayOrder: 3,
    },
    {
      name: "Excellence",
      displayOrder: 4,
    },
    {
      name: "Research",
      displayOrder: 5,
    },
    {
      name: "Team Work",
      displayOrder: 6,
    },
  ],

  philosophyTitle: "Our Educational Philosophy",

  philosophyHighlight: "Philosophy",

  philosophyDescription:
    "IMSEC believes in holistic education where academic excellence, innovation, research, leadership and ethics together prepare students to become responsible professionals and global citizens.",

  philosophyImage:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",

  ctaTitle: "Shape Your Future With IMSEC",

  ctaDescription:
    "Join one of the leading engineering institutions committed to academic excellence and innovation.",

  isPublished: true,

  displayOrder: 1,
};

const VisionMission = () => {
  const [formData, setFormData] = useState(DEFAULT_DATA);

  const [recordId, setRecordId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [introPreview, setIntroPreview] = useState(DEFAULT_DATA.introImage);

  const [philosophyPreview, setPhilosophyPreview] = useState(
    DEFAULT_DATA.philosophyImage,
  );

  const [introImage, setIntroImage] = useState(null);

  const [philosophyImage, setPhilosophyImage] = useState(null);

  // =====================================================
  // LOAD
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVisionMissionAdmin();

      const data = response?.data;

      if (data) {
        setFormData({
          ...DEFAULT_DATA,
          ...data,

          missionItems: data.missionItems?.length
            ? data.missionItems
            : DEFAULT_DATA.missionItems,

          missionCards: data.missionCards?.length
            ? data.missionCards
            : DEFAULT_DATA.missionCards,

          values: data.values?.length ? data.values : DEFAULT_DATA.values,
        });

        setRecordId(data._id);

        setIntroPreview(data.introImage || DEFAULT_DATA.introImage);

        setPhilosophyPreview(
          data.philosophyImage || DEFAULT_DATA.philosophyImage,
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load Vision & Mission.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // COMMON CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // MISSION ITEMS
  // =====================================================

  const updateMissionItem = (index, value) => {
    setFormData((prev) => {
      const items = [...prev.missionItems];

      items[index] = value;

      return {
        ...prev,
        missionItems: items,
      };
    });
  };

  const addMissionItem = () => {
    setFormData((prev) => ({
      ...prev,
      missionItems: [...prev.missionItems, "New mission objective"],
    }));
  };

  const removeMissionItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      missionItems: prev.missionItems.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // MISSION CARDS
  // =====================================================

  const updateMissionCard = (index, field, value) => {
    setFormData((prev) => {
      const cards = [...prev.missionCards];

      cards[index] = {
        ...cards[index],
        [field]: field === "displayOrder" ? Number(value) : value,
      };

      return {
        ...prev,
        missionCards: cards,
      };
    });
  };

  const addMissionCard = () => {
    setFormData((prev) => ({
      ...prev,
      missionCards: [
        ...prev.missionCards,
        {
          title: "New Mission",
          icon: "🎓",
          desc: "Mission description",
          displayOrder: prev.missionCards.length + 1,
        },
      ],
    }));
  };

  const removeMissionCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      missionCards: prev.missionCards.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // VALUES
  // =====================================================

  const updateValue = (index, field, value) => {
    setFormData((prev) => {
      const values = [...prev.values];

      values[index] = {
        ...values[index],
        [field]: field === "displayOrder" ? Number(value) : value,
      };

      return {
        ...prev,
        values,
      };
    });
  };

  const addValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          name: "New Value",
          displayOrder: prev.values.length + 1,
        },
      ],
    }));
  };

  const removeValue = (index) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // UPLOAD INTRO IMAGE
  // =====================================================

  const handleIntroUpload = async () => {
    if (!introImage) {
      setError("Please select the Intro Image first.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await uploadVisionMissionImage(introImage);

      const uploaded = response?.data?.[0];

      if (!uploaded?.imageUrl) {
        throw new Error("Image URL was not returned.");
      }

      setFormData((prev) => ({
        ...prev,
        introImage: uploaded.imageUrl,
      }));

      setIntroPreview(uploaded.imageUrl);

      setIntroImage(null);

      setMessage("Intro image uploaded successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to upload Intro Image.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UPLOAD PHILOSOPHY IMAGE
  // =====================================================

  const handlePhilosophyUpload = async () => {
    if (!philosophyImage) {
      setError("Please select the Educational Philosophy image first.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await uploadVisionMissionImage(philosophyImage);

      const uploaded = response?.data?.[0];

      if (!uploaded?.imageUrl) {
        throw new Error("Image URL was not returned.");
      }

      setFormData((prev) => ({
        ...prev,
        philosophyImage: uploaded.imageUrl,
      }));

      setPhilosophyPreview(uploaded.imageUrl);

      setPhilosophyImage(null);

      setMessage("Educational Philosophy image uploaded successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to upload image.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (recordId) {
        await updateVisionMission(recordId, formData);
      } else {
        const response = await createVisionMission(formData);

        if (response?.data?._id) {
          setRecordId(response.data._id);
        }
      }

      setMessage("Vision & Mission saved successfully.");

      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to save Vision & Mission.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PUBLISH
  // =====================================================

  const handlePublish = async () => {
    if (!recordId) {
      setError("Please save the content first.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await publishVisionMission(recordId);

      setFormData((prev) => ({
        ...prev,
        isPublished: true,
      }));

      setMessage("Vision & Mission published successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to publish content.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UNPUBLISH
  // =====================================================

  const handleUnpublish = async () => {
    if (!recordId) {
      setError("Please save the content first.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await unpublishVisionMission(recordId);

      setFormData((prev) => ({
        ...prev,
        isPublished: false,
      }));

      setMessage("Vision & Mission unpublished successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to unpublish content.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!recordId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete Vision & Mission content?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await deleteVisionMission(recordId);

      setRecordId(null);

      setMessage("Vision & Mission deleted successfully.");

      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to delete content.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="vm-admin-loading">
        <Spinner animation="border" />

        <p>Loading Vision & Mission...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="vm-admin-page">
      <div className="vm-admin-header">
        <div>
          <span className="vm-admin-eyebrow">ABOUT IMSEC</span>

          <h1>Vision &amp; Mission</h1>

          <p>Manage Vision, Mission, Core Values and Educational Philosophy.</p>
        </div>

        <div className="vm-admin-status">
          <span
            className={
              formData.isPublished ? "status-published" : "status-draft"
            }
          >
            {formData.isPublished ? "Published" : "Unpublished"}
          </span>
        </div>
      </div>

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSave}>
        {/* HERO */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Hero Section</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col md={7}>
                <Form.Group>
                  <Form.Label>Hero Title</Form.Label>

                  <Form.Control
                    name="heroTitle"
                    value={formData.heroTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group>
                  <Form.Label>Breadcrumb</Form.Label>

                  <Form.Control
                    name="heroBreadcrumb"
                    value={formData.heroBreadcrumb}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* INTRO */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Introduction Section</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col lg={5}>
                <Form.Label>Intro Image</Form.Label>

                <ImageUploader
                  preview={introPreview}
                  setPreview={setIntroPreview}
                  setImage={setIntroImage}
                />

                <Button
                  type="button"
                  variant="outline-primary"
                  className="mt-3"
                  onClick={handleIntroUpload}
                  disabled={saving || !introImage}
                >
                  <FaUpload className="me-2" />
                  Upload Intro Image
                </Button>
              </Col>

              <Col lg={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Title</Form.Label>

                  <Form.Control
                    name="introTitle"
                    value={formData.introTitle}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Highlight Word</Form.Label>

                  <Form.Control
                    name="introTitleHighlight"
                    value={formData.introTitleHighlight}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="introDescription"
                    value={formData.introDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* VISION & MISSION */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Vision &amp; Mission</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col lg={6}>
                <div className="vm-editor-box">
                  <div className="vm-editor-icon">
                    <FaEye />
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Vision Title</Form.Label>

                    <Form.Control
                      name="visionTitle"
                      value={formData.visionTitle}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Vision Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={7}
                      name="visionDescription"
                      value={formData.visionDescription}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </Col>

              <Col lg={6}>
                <div className="vm-editor-box">
                  <div className="vm-editor-icon">
                    <FaBullseye />
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Mission Title</Form.Label>

                    <Form.Control
                      name="missionTitle"
                      value={formData.missionTitle}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Label>Mission Points</Form.Label>

                  {formData.missionItems.map((item, index) => (
                    <div className="vm-repeat-row" key={index}>
                      <Form.Control
                        value={item}
                        onChange={(e) =>
                          updateMissionItem(index, e.target.value)
                        }
                      />

                      <Button
                        type="button"
                        variant="outline-danger"
                        onClick={() => removeMissionItem(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline-primary"
                    className="mt-2"
                    onClick={addMissionItem}
                  >
                    <FaPlus className="me-2" />
                    Add Mission Point
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* MISSION CARDS */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Mission Cards Section</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Section Tag</Form.Label>

                  <Form.Control
                    name="missionSectionTag"
                    value={formData.missionSectionTag}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Section Title</Form.Label>

                  <Form.Control
                    name="missionSectionTitle"
                    value={formData.missionSectionTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Highlight Word</Form.Label>

                  <Form.Control
                    name="missionSectionHighlight"
                    value={formData.missionSectionHighlight}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="vm-admin-subheader">
              <h4>Mission Cards</h4>

              <Button type="button" variant="primary" onClick={addMissionCard}>
                <FaPlus className="me-2" />
                Add Card
              </Button>
            </div>

            <Row className="g-4">
              {formData.missionCards.map((item, index) => (
                <Col lg={6} key={index}>
                  <div className="vm-repeat-card">
                    <div className="vm-repeat-card-header">
                      <strong>Mission #{index + 1}</strong>

                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeMissionCard(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>

                    <Row className="g-3">
                      <Col xs={3}>
                        <Form.Group>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={item.icon}
                            onChange={(e) =>
                              updateMissionCard(index, "icon", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>

                          <Form.Control
                            value={item.title}
                            onChange={(e) =>
                              updateMissionCard(index, "title", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={3}>
                        <Form.Group>
                          <Form.Label>Order</Form.Label>

                          <Form.Control
                            type="number"
                            value={item.displayOrder}
                            onChange={(e) =>
                              updateMissionCard(
                                index,
                                "displayOrder",
                                e.target.value,
                              )
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={item.desc}
                            onChange={(e) =>
                              updateMissionCard(index, "desc", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* CORE VALUES */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Core Values</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Section Title</Form.Label>

                  <Form.Control
                    name="valuesSectionTitle"
                    value={formData.valuesSectionTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Highlight Word</Form.Label>

                  <Form.Control
                    name="valuesSectionHighlight"
                    value={formData.valuesSectionHighlight}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="vm-admin-subheader">
              <h4>Values</h4>

              <Button type="button" variant="primary" onClick={addValue}>
                <FaPlus className="me-2" />
                Add Value
              </Button>
            </div>

            {formData.values.map((item, index) => (
              <div className="vm-repeat-row" key={index}>
                <Form.Control
                  value={item.name}
                  onChange={(e) => updateValue(index, "name", e.target.value)}
                />

                <Form.Control
                  type="number"
                  className="vm-order-input"
                  value={item.displayOrder}
                  onChange={(e) =>
                    updateValue(index, "displayOrder", e.target.value)
                  }
                />

                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={() => removeValue(index)}
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* PHILOSOPHY */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Educational Philosophy</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col lg={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Philosophy Title</Form.Label>

                  <Form.Control
                    name="philosophyTitle"
                    value={formData.philosophyTitle}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Highlight Word</Form.Label>

                  <Form.Control
                    name="philosophyHighlight"
                    value={formData.philosophyHighlight}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={7}
                    name="philosophyDescription"
                    value={formData.philosophyDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col lg={5}>
                <Form.Label>Philosophy Image</Form.Label>

                <ImageUploader
                  preview={philosophyPreview}
                  setPreview={setPhilosophyPreview}
                  setImage={setPhilosophyImage}
                />

                <Button
                  type="button"
                  variant="outline-primary"
                  className="mt-3"
                  onClick={handlePhilosophyUpload}
                  disabled={saving || !philosophyImage}
                >
                  <FaUpload className="me-2" />
                  Upload Philosophy Image
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* CTA */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Call To Action</h3>
          </Card.Header>

          <Card.Body>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>CTA Title</Form.Label>

                  <Form.Control
                    name="ctaTitle"
                    value={formData.ctaTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>CTA Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="ctaDescription"
                    value={formData.ctaDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* SETTINGS */}

        <Card className="vm-admin-card">
          <Card.Header>
            <h3>Publishing Settings</h3>
          </Card.Header>

          <Card.Body>
            <Row className="align-items-end g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Display Order</Form.Label>

                  <Form.Control
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="vm-published"
                  label={formData.isPublished ? "Published" : "Unpublished"}
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ACTIONS */}

        <div className="vm-admin-actions">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
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

          {recordId && formData.isPublished && (
            <Button
              type="button"
              variant="outline-warning"
              size="lg"
              onClick={handleUnpublish}
              disabled={saving}
            >
              Unpublish
            </Button>
          )}

          {recordId && !formData.isPublished && (
            <Button
              type="button"
              variant="outline-success"
              size="lg"
              onClick={handlePublish}
              disabled={saving}
            >
              Publish
            </Button>
          )}

          {recordId && (
            <Button
              type="button"
              variant="outline-danger"
              size="lg"
              onClick={handleDelete}
              disabled={saving}
            >
              <FaTrash className="me-2" />
              Delete
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default VisionMission;
