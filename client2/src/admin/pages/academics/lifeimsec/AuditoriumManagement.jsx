import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  getAuditoriumAdmin,
  updateAuditoriumAdmin,
  resetAuditoriumDefaults,
} from "../../services/auditoriumAdminService";

import "./AuditoriumManagement.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80";

const createEmptyFeature = () => ({
  icon: "",
  title: "",
  description: "",
});

const createEmptyFacility = () => ({
  icon: "",
  title: "",
  description: "",
});

const createEmptyStatistic = () => ({
  value: "",
  label: "",
  icon: "",
});

const createEmptyFaq = () => ({
  question: "",
  answer: "",
});

const AuditoriumManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [heroImage, setHeroImage] = useState(null);
  const [introductionImage, setIntroductionImage] = useState(null);

  const [galleryImages, setGalleryImages] = useState({});

  const [heroPreview, setHeroPreview] = useState("");
  const [introductionPreview, setIntroductionPreview] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Data
  |--------------------------------------------------------------------------
  */

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAuditoriumAdmin();

      if (response?.data) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Auditorium admin fetch error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load Auditorium data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Object URLs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (heroPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(heroPreview);
      }

      if (introductionPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(introductionPreview);
      }

      Object.values(galleryImages).forEach((item) => {
        if (item?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Generic Field Update
  |--------------------------------------------------------------------------
  */

  const updateField = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Array Item Update
  |--------------------------------------------------------------------------
  */

  const updateArrayItem = (section, index, field, value) => {
    setData((prev) => {
      const updated = [...(prev[section] || [])];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Add Array Item
  |--------------------------------------------------------------------------
  */

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      features: [...(prev.features || []), createEmptyFeature()],
    }));
  };

  const addFacility = () => {
    setData((prev) => ({
      ...prev,
      facilities: [...(prev.facilities || []), createEmptyFacility()],
    }));
  };

  const addStatistic = () => {
    setData((prev) => ({
      ...prev,
      statistics: [...(prev.statistics || []), createEmptyStatistic()],
    }));
  };

  const addFaq = () => {
    setData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), createEmptyFaq()],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Array Item
  |--------------------------------------------------------------------------
  */

  const removeArrayItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));

    /*
    |--------------------------------------------------------------------------
    | Clear related gallery file when necessary
    |--------------------------------------------------------------------------
    */

    if (section === "gallery") {
      setGalleryImages((prev) => {
        const updated = {};

        Object.entries(prev).forEach(([key, value]) => {
          const oldIndex = Number(key);

          if (oldIndex < index) {
            updated[oldIndex] = value;
          } else if (oldIndex > index) {
            updated[oldIndex - 1] = value;
          }
        });

        return updated;
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | String Array Update
  |--------------------------------------------------------------------------
  */

  const updateStringArrayItem = (section, index, value) => {
    setData((prev) => {
      const updated = [...(prev[section] || [])];

      updated[index] = value;

      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Add String Item
  |--------------------------------------------------------------------------
  */

  const addStringItem = (section) => {
    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), ""],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Remove String Item
  |--------------------------------------------------------------------------
  */

  const removeStringItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Hero Image
  |--------------------------------------------------------------------------
  */

  const handleHeroImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (heroPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(heroPreview);
    }

    setHeroImage(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  /*
  |--------------------------------------------------------------------------
  | Introduction Image
  |--------------------------------------------------------------------------
  */

  const handleIntroductionImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (introductionPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(introductionPreview);
    }

    setIntroductionImage(file);
    setIntroductionPreview(URL.createObjectURL(file));
  };

  /*
  |--------------------------------------------------------------------------
  | Gallery Image
  |--------------------------------------------------------------------------
  */

  const handleGalleryImage = (index, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setGalleryImages((prev) => {
      const oldPreview = prev[index]?.preview;

      if (oldPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }

      return {
        ...prev,
        [index]: {
          file,
          preview: URL.createObjectURL(file),
        },
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Add Gallery Image
  |--------------------------------------------------------------------------
  */

  const addGalleryImage = () => {
    setData((prev) => ({
      ...prev,
      gallery: [
        ...(prev.gallery || []),
        {
          url: "",
          publicId: "",
        },
      ],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save All
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      /*
      |--------------------------------------------------------------------------
      | Send JSON Data
      |--------------------------------------------------------------------------
      */

      formData.append("data", JSON.stringify(data));

      /*
      |--------------------------------------------------------------------------
      | Hero Image
      |--------------------------------------------------------------------------
      */

      if (heroImage) {
        formData.append("heroImage", heroImage);
      }

      /*
      |--------------------------------------------------------------------------
      | Introduction Image
      |--------------------------------------------------------------------------
      */

      if (introductionImage) {
        formData.append("introductionImage", introductionImage);
      }

      /*
      |--------------------------------------------------------------------------
      | Gallery Images
      |--------------------------------------------------------------------------
      */

      Object.entries(galleryImages).forEach(([index, item]) => {
        if (item?.file) {
          formData.append(`galleryImage_${index}`, item.file);
        }
      });

      /*
      |--------------------------------------------------------------------------
      | API Request
      |--------------------------------------------------------------------------
      */

      const response = await updateAuditoriumAdmin(formData);

      if (response?.data) {
        setData(response.data);
      }

      /*
      |--------------------------------------------------------------------------
      | Clear Selected Files
      |--------------------------------------------------------------------------
      */

      setHeroImage(null);
      setIntroductionImage(null);
      setGalleryImages({});

      setHeroPreview("");
      setIntroductionPreview("");

      setMessage("Auditorium content saved successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Auditorium save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Auditorium.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Restore Defaults
  |--------------------------------------------------------------------------
  */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to restore all Auditorium default data? Your current custom content and uploaded images will be replaced.",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await resetAuditoriumDefaults();

      if (response?.data) {
        setData(response.data);
      }

      setHeroImage(null);
      setIntroductionImage(null);
      setGalleryImages({});

      setHeroPreview("");
      setIntroductionPreview("");

      setMessage("Auditorium defaults restored successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Auditorium reset error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to restore defaults.",
      );
    } finally {
      setResetting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="auditorium-admin-loading">
        <Spinner animation="border" />
        <h5>Loading Auditorium...</h5>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error Without Data
  |--------------------------------------------------------------------------
  */

  if (!data) {
    return (
      <div className="auditorium-admin-page">
        <Alert variant="danger">
          {error || "Unable to load Auditorium data."}
        </Alert>

        <Button onClick={fetchData} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="auditorium-admin-page">
      {/* --------------------------------------------------------------- */}
      {/* Header */}
      {/* --------------------------------------------------------------- */}

      <div className="auditorium-admin-header">
        <div>
          <span className="admin-page-label">LIFE @ IMSEC</span>

          <h1>Auditorium Management</h1>

          <p>
            Manage Auditorium content, facilities, gallery, statistics, FAQs and
            images.
          </p>
        </div>

        <div className="admin-header-actions">
          <Button
            variant="outline-danger"
            onClick={handleReset}
            disabled={saving || resetting}
          >
            {resetting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Restoring...
              </>
            ) : (
              "Restore Defaults"
            )}
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* Alerts */}
      {/* --------------------------------------------------------------- */}

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

      {/* --------------------------------------------------------------- */}
      {/* Tabs */}
      {/* --------------------------------------------------------------- */}

      <Card className="auditorium-admin-card">
        <Card.Body>
          <Tabs
            defaultActiveKey="general"
            id="auditorium-management-tabs"
            className="auditorium-admin-tabs mb-4"
          >
            {/* ========================================================= */}
            {/* GENERAL */}
            {/* ========================================================= */}

            <Tab eventKey="general" title="General">
              <div className="admin-section">
                <div className="admin-section-title">
                  <h3>Hero Section</h3>

                  <p>Manage the main Auditorium banner.</p>
                </div>

                <Row className="g-4">
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Hero Title</Form.Label>

                      <Form.Control
                        value={data.hero?.title || ""}
                        onChange={(e) =>
                          updateField("hero", "title", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Breadcrumb</Form.Label>

                      <Form.Control
                        value={data.hero?.breadcrumb || ""}
                        onChange={(e) =>
                          updateField("hero", "breadcrumb", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={12}>
                    <Form.Group>
                      <Form.Label>Hero Image</Form.Label>

                      <Form.Control
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleHeroImage}
                      />
                    </Form.Group>

                    <div className="image-preview-box">
                      <Image
                        src={
                          heroPreview || data.hero?.image?.url || FALLBACK_IMAGE
                        }
                        alt="Hero"
                        fluid
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="admin-section">
                <div className="admin-section-title">
                  <h3>Introduction</h3>

                  <p>Manage the main introductory content.</p>
                </div>

                <Row className="g-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Section Tag</Form.Label>

                      <Form.Control
                        value={data.introduction?.tag || ""}
                        onChange={(e) =>
                          updateField("introduction", "tag", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Main Title</Form.Label>

                      <Form.Control
                        value={data.introduction?.title || ""}
                        onChange={(e) =>
                          updateField("introduction", "title", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Highlight</Form.Label>

                      <Form.Control
                        value={data.introduction?.highlight || ""}
                        onChange={(e) =>
                          updateField(
                            "introduction",
                            "highlight",
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Description 1</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={data.introduction?.description1 || ""}
                        onChange={(e) =>
                          updateField(
                            "introduction",
                            "description1",
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Description 2</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={data.introduction?.description2 || ""}
                        onChange={(e) =>
                          updateField(
                            "introduction",
                            "description2",
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Introduction Image</Form.Label>

                      <Form.Control
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleIntroductionImage}
                      />
                    </Form.Group>

                    <div className="image-preview-box small-preview">
                      <Image
                        src={
                          introductionPreview ||
                          data.introduction?.image?.url ||
                          FALLBACK_IMAGE
                        }
                        alt="Introduction"
                        fluid
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* FEATURES */}
            {/* ========================================================= */}

            <Tab eventKey="features" title="Features">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Features</h3>

                    <p>Add or edit key Auditorium features.</p>
                  </div>

                  <Button onClick={addFeature}>+ Add Feature</Button>
                </div>

                {(data.features || []).map((feature, index) => (
                  <Card
                    className="repeatable-admin-card"
                    key={`feature-${index}`}
                  >
                    <Card.Body>
                      <div className="repeatable-card-header">
                        <h5>Feature #{index + 1}</h5>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => removeArrayItem("features", index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={feature.icon || ""}
                            placeholder="FaUsers"
                            onChange={(e) =>
                              updateArrayItem(
                                "features",
                                index,
                                "icon",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={9}>
                          <Form.Label>Title</Form.Label>

                          <Form.Control
                            value={feature.title || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "features",
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={12}>
                          <Form.Label>Description</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={feature.description || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "features",
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* FACILITIES */}
            {/* ========================================================= */}

            <Tab eventKey="facilities" title="Facilities">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Facilities</h3>

                    <p>Manage available facilities.</p>
                  </div>

                  <Button onClick={addFacility}>+ Add Facility</Button>
                </div>

                {(data.facilities || []).map((facility, index) => (
                  <Card
                    className="repeatable-admin-card"
                    key={`facility-${index}`}
                  >
                    <Card.Body>
                      <div className="repeatable-card-header">
                        <h5>Facility #{index + 1}</h5>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => removeArrayItem("facilities", index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={facility.icon || ""}
                            placeholder="FaChair"
                            onChange={(e) =>
                              updateArrayItem(
                                "facilities",
                                index,
                                "icon",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={9}>
                          <Form.Label>Title</Form.Label>

                          <Form.Control
                            value={facility.title || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "facilities",
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={12}>
                          <Form.Label>Description</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={facility.description || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "facilities",
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* GALLERY */}
            {/* ========================================================= */}

            <Tab eventKey="gallery" title="Gallery">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Gallery</h3>

                    <p>Default images can be replaced by admin.</p>
                  </div>

                  <Button onClick={addGalleryImage}>+ Add Image</Button>
                </div>

                <Row className="g-4">
                  {(data.gallery || []).map((image, index) => (
                    <Col lg={4} md={6} key={`gallery-${index}`}>
                      <Card className="gallery-admin-card">
                        <div className="gallery-admin-image">
                          <Image
                            src={
                              galleryImages[index]?.preview ||
                              image.url ||
                              FALLBACK_IMAGE
                            }
                            alt={`Gallery ${index + 1}`}
                            fluid
                          />
                        </div>

                        <Card.Body>
                          <h6>Gallery Image #{index + 1}</h6>

                          <Form.Control
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleGalleryImage(index, e)}
                          />

                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="mt-3"
                            onClick={() => removeArrayItem("gallery", index)}
                          >
                            Remove Image
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* STATISTICS */}
            {/* ========================================================= */}

            <Tab eventKey="statistics" title="Statistics">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Statistics</h3>

                    <p>Manage numbers displayed on the public page.</p>
                  </div>

                  <Button onClick={addStatistic}>+ Add Statistic</Button>
                </div>

                {(data.statistics || []).map((stat, index) => (
                  <Card className="repeatable-admin-card" key={`stat-${index}`}>
                    <Card.Body>
                      <div className="repeatable-card-header">
                        <h5>Statistic #{index + 1}</h5>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => removeArrayItem("statistics", index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Label>Value</Form.Label>

                          <Form.Control
                            value={stat.value || ""}
                            placeholder="500+"
                            onChange={(e) =>
                              updateArrayItem(
                                "statistics",
                                index,
                                "value",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={5}>
                          <Form.Label>Label</Form.Label>

                          <Form.Control
                            value={stat.label || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "statistics",
                                index,
                                "label",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={stat.icon || ""}
                            placeholder="FaUsers"
                            onChange={(e) =>
                              updateArrayItem(
                                "statistics",
                                index,
                                "icon",
                                e.target.value,
                              )
                            }
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* USES */}
            {/* ========================================================= */}

            <Tab eventKey="uses" title="Uses">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Uses</h3>

                    <p>
                      Manage activities and programmes conducted in the
                      auditorium.
                    </p>
                  </div>

                  <Button onClick={() => addStringItem("uses")}>
                    + Add Use
                  </Button>
                </div>

                {(data.uses || []).map((item, index) => (
                  <div className="string-admin-row" key={`use-${index}`}>
                    <Form.Control
                      value={item}
                      onChange={(e) =>
                        updateStringArrayItem("uses", index, e.target.value)
                      }
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() => removeStringItem("uses", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* RULES */}
            {/* ========================================================= */}

            <Tab eventKey="rules" title="Rules">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Auditorium Rules</h3>

                    <p>Manage rules displayed on the public page.</p>
                  </div>

                  <Button onClick={() => addStringItem("rules")}>
                    + Add Rule
                  </Button>
                </div>

                {(data.rules || []).map((item, index) => (
                  <div className="string-admin-row" key={`rule-${index}`}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={item}
                      onChange={(e) =>
                        updateStringArrayItem("rules", index, e.target.value)
                      }
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() => removeStringItem("rules", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* FAQ */}
            {/* ========================================================= */}

            <Tab eventKey="faqs" title="FAQs">
              <div className="admin-section">
                <div className="admin-section-heading-row">
                  <div>
                    <h3>Frequently Asked Questions</h3>

                    <p>Manage Auditorium FAQs.</p>
                  </div>

                  <Button onClick={addFaq}>+ Add FAQ</Button>
                </div>

                {(data.faqs || []).map((faq, index) => (
                  <Card className="repeatable-admin-card" key={`faq-${index}`}>
                    <Card.Body>
                      <div className="repeatable-card-header">
                        <h5>FAQ #{index + 1}</h5>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => removeArrayItem("faqs", index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>

                        <Form.Control
                          value={faq.question || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "faqs",
                              index,
                              "question",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Answer</Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={faq.answer || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "faqs",
                              index,
                              "answer",
                              e.target.value,
                            )
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ========================================================= */}
            {/* CTA */}
            {/* ========================================================= */}

            <Tab eventKey="cta" title="CTA">
              <div className="admin-section">
                <div className="admin-section-title">
                  <h3>Call To Action</h3>

                  <p>Manage the final section of the Auditorium page.</p>
                </div>

                <Row className="g-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>CTA Title</Form.Label>

                      <Form.Control
                        value={data.cta?.title || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            cta: {
                              ...prev.cta,
                              title: e.target.value,
                            },
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>CTA Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={data.cta?.description || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            cta: {
                              ...prev.cta,
                              description: e.target.value,
                            },
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Tab>
          </Tabs>

          {/* ----------------------------------------------------------- */}
          {/* Bottom Save */}
          {/* ----------------------------------------------------------- */}

          <div className="auditorium-bottom-actions">
            <Button
              variant="outline-danger"
              onClick={handleReset}
              disabled={saving || resetting}
            >
              Restore Defaults
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving || resetting}
            >
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuditoriumManagement;
