import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  getHostelMessAdmin,
  updateHostelMessAdmin,
  resetHostelMessDefaults,
} from "../../services/hostelMessAdminService";

import "./HostelMessManagement.css";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Hostel & Mess",
    breadcrumb: "Home / Life @ IMSEC / Hostel & Mess",
  },

  about: {
    tag: "LIFE @ IMSEC",
    title: "Comfortable",
    highlight: "Hostel Living",
    description1: "",
    description2: "",
    image: {
      url: "",
      publicId: "",
    },
  },

  boysHostels: [],

  girlsHostels: [],

  mess: {
    tag: "MESS & DINING",
    title: "Healthy &",
    highlight: "Hygienic Food",
    description: "",
    image: {
      url: "",
      publicId: "",
    },
    items: [],
  },

  facilities: [],

  gallery: [],

  weeklyMenu: [],

  rules: [],

  statistics: [],

  faqs: [],

  cta: {
    title: "",
    description: "",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

const HostelMessManagement = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [imageFiles, setImageFiles] = useState({});

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getHostelMessAdmin();

      if (response?.data) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Hostel & Mess load error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load Hostel & Mess data.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     GENERAL CHANGE
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
     HERO
  ======================================================= */

  const updateHero = (field, value) => {
    setData((prev) => ({
      ...prev,

      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     ABOUT
  ======================================================= */

  const updateAbout = (field, value) => {
    setData((prev) => ({
      ...prev,

      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     MESS
  ======================================================= */

  const updateMess = (field, value) => {
    setData((prev) => ({
      ...prev,

      mess: {
        ...prev.mess,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     IMAGE SELECT
  ======================================================= */

  const handleImageChange = (fieldName, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setImageFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setError("");
  };

  /* =======================================================
     HOSTEL CHANGE
  ======================================================= */

  const updateHostel = (type, index, field, value) => {
    setData((prev) => {
      const list = [...prev[type]];

      list[index] = {
        ...list[index],
        [field]: value,
      };

      return {
        ...prev,
        [type]: list,
      };
    });
  };

  /* =======================================================
     ADD HOSTEL
  ======================================================= */

  const addHostel = (type) => {
    const newHostel = {
      name: "",
      image: {
        url: "",
        publicId: "",
      },
      capacity: "",
      description: "",
      facilities: [],
    };

    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], newHostel],
    }));
  };

  /* =======================================================
     REMOVE HOSTEL
  ======================================================= */

  const removeHostel = (type, index) => {
    if (!window.confirm("Are you sure you want to remove this hostel?")) {
      return;
    }

    setData((prev) => ({
      ...prev,

      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     FACILITY STRING
  ======================================================= */

  const updateHostelFacility = (type, hostelIndex, facilityIndex, value) => {
    setData((prev) => {
      const list = [...prev[type]];

      const facilities = [...(list[hostelIndex].facilities || [])];

      facilities[facilityIndex] = value;

      list[hostelIndex] = {
        ...list[hostelIndex],
        facilities,
      };

      return {
        ...prev,
        [type]: list,
      };
    });
  };

  const addHostelFacility = (type, hostelIndex) => {
    setData((prev) => {
      const list = [...prev[type]];

      list[hostelIndex] = {
        ...list[hostelIndex],
        facilities: [...(list[hostelIndex].facilities || []), ""],
      };

      return {
        ...prev,
        [type]: list,
      };
    });
  };

  const removeHostelFacility = (type, hostelIndex, facilityIndex) => {
    setData((prev) => {
      const list = [...prev[type]];

      list[hostelIndex] = {
        ...list[hostelIndex],
        facilities: list[hostelIndex].facilities.filter(
          (_, i) => i !== facilityIndex,
        ),
      };

      return {
        ...prev,
        [type]: list,
      };
    });
  };

  /* =======================================================
     FACILITIES
  ======================================================= */

  const addFacility = () => {
    setData((prev) => ({
      ...prev,

      facilities: [
        ...prev.facilities,
        {
          icon: "wifi",
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateFacility = (index, field, value) => {
    setData((prev) => {
      const list = [...prev.facilities];

      list[index] = {
        ...list[index],
        [field]: value,
      };

      return {
        ...prev,
        facilities: list,
      };
    });
  };

  const removeFacility = (index) => {
    setData((prev) => ({
      ...prev,

      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     GALLERY
  ======================================================= */

  const addGalleryImage = () => {
    setData((prev) => ({
      ...prev,

      gallery: [
        ...prev.gallery,
        {
          url: "",
          publicId: "",
        },
      ],
    }));
  };

  const removeGalleryImage = (index) => {
    setData((prev) => ({
      ...prev,

      gallery: prev.gallery.filter((_, i) => i !== index),
    }));

    setImageFiles((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[`galleryImage_${index}`];

      return updated;
    });
  };

  /* =======================================================
     MENU
  ======================================================= */

  const addMenu = () => {
    setData((prev) => ({
      ...prev,

      weeklyMenu: [
        ...prev.weeklyMenu,
        {
          day: "",
          breakfast: "",
          lunch: "",
          snacks: "",
          dinner: "",
        },
      ],
    }));
  };

  const updateMenu = (index, field, value) => {
    setData((prev) => {
      const list = [...prev.weeklyMenu];

      list[index] = {
        ...list[index],
        [field]: value,
      };

      return {
        ...prev,
        weeklyMenu: list,
      };
    });
  };

  const removeMenu = (index) => {
    setData((prev) => ({
      ...prev,

      weeklyMenu: prev.weeklyMenu.filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     RULES
  ======================================================= */

  const addRule = () => {
    setData((prev) => ({
      ...prev,

      rules: [...prev.rules, ""],
    }));
  };

  const updateRule = (index, value) => {
    setData((prev) => {
      const rules = [...prev.rules];

      rules[index] = value;

      return {
        ...prev,
        rules,
      };
    });
  };

  const removeRule = (index) => {
    setData((prev) => ({
      ...prev,

      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     STATISTICS
  ======================================================= */

  const addStatistic = () => {
    setData((prev) => ({
      ...prev,

      statistics: [
        ...prev.statistics,
        {
          value: "",
          label: "",
          icon: "users",
        },
      ],
    }));
  };

  const updateStatistic = (index, field, value) => {
    setData((prev) => {
      const list = [...prev.statistics];

      list[index] = {
        ...list[index],
        [field]: value,
      };

      return {
        ...prev,
        statistics: list,
      };
    });
  };

  const removeStatistic = (index) => {
    setData((prev) => ({
      ...prev,

      statistics: prev.statistics.filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     FAQ
  ======================================================= */

  const addFaq = () => {
    setData((prev) => ({
      ...prev,

      faqs: [
        ...prev.faqs,
        {
          question: "",
          answer: "",
        },
      ],
    }));
  };

  const updateFaq = (index, field, value) => {
    setData((prev) => {
      const list = [...prev.faqs];

      list[index] = {
        ...list[index],
        [field]: value,
      };

      return {
        ...prev,
        faqs: list,
      };
    });
  };

  const removeFaq = (index) => {
    setData((prev) => ({
      ...prev,

      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  /* =======================================================
     MESS ITEMS
  ======================================================= */

  const addMessItem = () => {
    setData((prev) => ({
      ...prev,

      mess: {
        ...prev.mess,

        items: [
          ...(prev.mess.items || []),
          {
            icon: "utensils",
            title: "",
            description: "",
          },
        ],
      },
    }));
  };

  const updateMessItem = (index, field, value) => {
    setData((prev) => {
      const items = [...(prev.mess.items || [])];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,

        mess: {
          ...prev.mess,
          items,
        },
      };
    });
  };

  const removeMessItem = (index) => {
    setData((prev) => ({
      ...prev,

      mess: {
        ...prev.mess,

        items: prev.mess.items.filter((_, i) => i !== index),
      },
    }));
  };

  /* =======================================================
     SAVE ALL
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("data", JSON.stringify(data));

      /*
        About image
      */

      if (imageFiles.aboutImage) {
        formData.append("aboutImage", imageFiles.aboutImage);
      }

      /*
        Mess image
      */

      if (imageFiles.messImage) {
        formData.append("messImage", imageFiles.messImage);
      }

      /*
        Boys hostel images
      */

      data.boysHostels.forEach((_, index) => {
        const file = imageFiles[`boysImage_${index}`];

        if (file) {
          formData.append(`boysImage_${index}`, file);
        }
      });

      /*
        Girls hostel images
      */

      data.girlsHostels.forEach((_, index) => {
        const file = imageFiles[`girlsImage_${index}`];

        if (file) {
          formData.append(`girlsImage_${index}`, file);
        }
      });

      /*
        Gallery images
      */

      data.gallery.forEach((_, index) => {
        const file = imageFiles[`galleryImage_${index}`];

        if (file) {
          formData.append(`galleryImage_${index}`, file);
        }
      });

      const response = await updateHostelMessAdmin(formData);

      if (response?.data) {
        setData(response.data);
      }

      setImageFiles({});

      setMessage("Hostel & Mess data saved successfully.");
    } catch (err) {
      console.error("Save Hostel & Mess error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save Hostel & Mess data.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESTORE DEFAULTS
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Restore all Hostel & Mess content to default data?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await resetHostelMessDefaults();

      if (response?.data) {
        setData(response.data);
      }

      setImageFiles({});

      setMessage("Default Hostel & Mess data restored successfully.");
    } catch (err) {
      console.error("Reset error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to restore defaults.",
      );
    } finally {
      setResetting(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="hostel-admin-loading">
        <Spinner animation="border" />
        <h5 className="mt-3">Loading Hostel & Mess...</h5>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="hostel-mess-admin">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="hostel-admin-header">
        <div>
          <span className="admin-page-label">LIFE @ IMSEC</span>

          <h1>Hostel & Mess</h1>

          <p>
            Manage hostel accommodation, mess, facilities, gallery and student
            residential information.
          </p>
        </div>

        <div className="hostel-admin-actions">
          <Button
            variant="outline-secondary"
            onClick={handleReset}
            disabled={saving || resetting}
          >
            {resetting ? "Restoring..." : "Restore Defaults"}
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

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

      {/* ===================================================
          TABS
      =================================================== */}

      <Card className="hostel-admin-card">
        <Card.Body>
          <Tabs defaultActiveKey="general" className="hostel-admin-tabs mb-4">
            {/* ============================================
                GENERAL
            ============================================ */}

            <Tab eventKey="general" title="General">
              <div className="admin-section">
                <h3>Hero Section</h3>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Hero Title</Form.Label>

                      <Form.Control
                        value={data.hero.title}
                        onChange={(e) => updateHero("title", e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Breadcrumb</Form.Label>

                      <Form.Control
                        value={data.hero.breadcrumb}
                        onChange={(e) =>
                          updateHero("breadcrumb", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="admin-section">
                <h3>About Hostel</h3>

                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Section Tag</Form.Label>

                      <Form.Control
                        value={data.about.tag}
                        onChange={(e) => updateAbout("tag", e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>

                      <Form.Control
                        value={data.about.title}
                        onChange={(e) => updateAbout("title", e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Highlight</Form.Label>

                      <Form.Control
                        value={data.about.highlight}
                        onChange={(e) =>
                          updateAbout("highlight", e.target.value)
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
                        value={data.about.description1}
                        onChange={(e) =>
                          updateAbout("description1", e.target.value)
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
                        value={data.about.description2}
                        onChange={(e) =>
                          updateAbout("description2", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="image-upload-box mt-4">
                  <Form.Label>About Image</Form.Label>

                  {data.about.image?.url && (
                    <img
                      src={data.about.image.url}
                      alt="About Hostel"
                      className="admin-preview-image"
                    />
                  )}

                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) =>
                      handleImageChange("aboutImage", e.target.files?.[0])
                    }
                  />

                  <small>JPG, PNG or WEBP. Maximum 10 MB.</small>
                </div>
              </div>
            </Tab>

            {/* ============================================
                HOSTELS
            ============================================ */}

            <Tab eventKey="hostels" title="Hostels">
              <HostelSection
                title="Boys Hostels"
                type="boysHostels"
                data={data}
                addHostel={addHostel}
                removeHostel={removeHostel}
                updateHostel={updateHostel}
                updateHostelFacility={updateHostelFacility}
                addHostelFacility={addHostelFacility}
                removeHostelFacility={removeHostelFacility}
                handleImageChange={handleImageChange}
                imageFiles={imageFiles}
              />

              <HostelSection
                title="Girls Hostels"
                type="girlsHostels"
                data={data}
                addHostel={addHostel}
                removeHostel={removeHostel}
                updateHostel={updateHostel}
                updateHostelFacility={updateHostelFacility}
                addHostelFacility={addHostelFacility}
                removeHostelFacility={removeHostelFacility}
                handleImageChange={handleImageChange}
                imageFiles={imageFiles}
              />
            </Tab>

            {/* ============================================
                MESS
            ============================================ */}

            <Tab eventKey="mess" title="Mess">
              <div className="admin-section">
                <h3>Mess & Dining</h3>

                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Tag</Form.Label>

                    <Form.Control
                      value={data.mess.tag}
                      onChange={(e) => updateMess("tag", e.target.value)}
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Title</Form.Label>

                    <Form.Control
                      value={data.mess.title}
                      onChange={(e) => updateMess("title", e.target.value)}
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Highlight</Form.Label>

                    <Form.Control
                      value={data.mess.highlight}
                      onChange={(e) => updateMess("highlight", e.target.value)}
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={data.mess.description}
                      onChange={(e) =>
                        updateMess("description", e.target.value)
                      }
                    />
                  </Col>
                </Row>

                <div className="image-upload-box mt-4">
                  <Form.Label>Mess Image</Form.Label>

                  {data.mess.image?.url && (
                    <img
                      src={data.mess.image.url}
                      alt="Mess"
                      className="admin-preview-image"
                    />
                  )}

                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) =>
                      handleImageChange("messImage", e.target.files?.[0])
                    }
                  />
                </div>

                <div className="admin-section-inner">
                  <div className="section-heading-row">
                    <h4>Mess Items</h4>

                    <Button size="sm" onClick={addMessItem}>
                      + Add Item
                    </Button>
                  </div>

                  {data.mess.items?.map((item, index) => (
                    <Card key={index} className="item-card mb-3">
                      <Card.Body>
                        <Row className="g-3">
                          <Col md={3}>
                            <Form.Label>Icon</Form.Label>

                            <Form.Control
                              value={item.icon || ""}
                              onChange={(e) =>
                                updateMessItem(index, "icon", e.target.value)
                              }
                            />
                          </Col>

                          <Col md={3}>
                            <Form.Label>Title</Form.Label>

                            <Form.Control
                              value={item.title || ""}
                              onChange={(e) =>
                                updateMessItem(index, "title", e.target.value)
                              }
                            />
                          </Col>

                          <Col md={5}>
                            <Form.Label>Description</Form.Label>

                            <Form.Control
                              value={item.description || ""}
                              onChange={(e) =>
                                updateMessItem(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                            />
                          </Col>

                          <Col md={1}>
                            <Button
                              variant="outline-danger"
                              className="mt-4"
                              onClick={() => removeMessItem(index)}
                            >
                              ×
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>

            {/* ============================================
                FACILITIES
            ============================================ */}

            <Tab eventKey="facilities" title="Facilities">
              <div className="admin-section">
                <div className="section-heading-row">
                  <div>
                    <h3>Hostel Facilities</h3>

                    <p>Add facilities displayed on the public page.</p>
                  </div>

                  <Button onClick={addFacility}>+ Add Facility</Button>
                </div>

                {data.facilities.map((facility, index) => (
                  <Card key={index} className="item-card mb-3">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={2}>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={facility.icon || ""}
                            onChange={(e) =>
                              updateFacility(index, "icon", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={4}>
                          <Form.Label>Title</Form.Label>

                          <Form.Control
                            value={facility.title || ""}
                            onChange={(e) =>
                              updateFacility(index, "title", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={5}>
                          <Form.Label>Description</Form.Label>

                          <Form.Control
                            value={facility.description || ""}
                            onChange={(e) =>
                              updateFacility(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </Col>

                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            className="mt-4"
                            onClick={() => removeFacility(index)}
                          >
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ============================================
                GALLERY
            ============================================ */}

            <Tab eventKey="gallery" title="Gallery">
              <div className="admin-section">
                <div className="section-heading-row">
                  <div>
                    <h3>Hostel Gallery</h3>

                    <p>Upload images for the public Hostel & Mess gallery.</p>
                  </div>

                  <Button onClick={addGalleryImage}>+ Add Image</Button>
                </div>

                <Row className="g-4">
                  {data.gallery.map((image, index) => {
                    const selectedFile = imageFiles[`galleryImage_${index}`];

                    const preview = selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : image.url;

                    return (
                      <Col md={4} key={index}>
                        <Card className="gallery-admin-card">
                          {preview && (
                            <img
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              className="gallery-preview"
                            />
                          )}

                          <Card.Body>
                            <Form.Control
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) =>
                                handleImageChange(
                                  `galleryImage_${index}`,
                                  e.target.files?.[0],
                                )
                              }
                            />

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-3"
                              onClick={() => removeGalleryImage(index)}
                            >
                              Remove Image
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Tab>

            {/* ============================================
                WEEKLY MENU
            ============================================ */}

            <Tab eventKey="menu" title="Weekly Menu">
              <div className="admin-section">
                <div className="section-heading-row">
                  <h3>Weekly Mess Menu</h3>

                  <Button onClick={addMenu}>+ Add Day</Button>
                </div>

                {data.weeklyMenu.map((menu, index) => (
                  <Card key={index} className="item-card mb-4">
                    <Card.Body>
                      <div className="section-heading-row">
                        <h5>Menu Day #{index + 1}</h5>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeMenu(index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Row className="g-3">
                        {["day", "breakfast", "lunch", "snacks", "dinner"].map(
                          (field) => (
                            <Col md={field === "day" ? 2 : 2.5} key={field}>
                              <Form.Label>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </Form.Label>

                              <Form.Control
                                value={menu[field] || ""}
                                onChange={(e) =>
                                  updateMenu(index, field, e.target.value)
                                }
                              />
                            </Col>
                          ),
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ============================================
                RULES
            ============================================ */}

            <Tab eventKey="rules" title="Rules">
              <div className="admin-section">
                <div className="section-heading-row">
                  <h3>Hostel Rules</h3>

                  <Button onClick={addRule}>+ Add Rule</Button>
                </div>

                {data.rules.map((rule, index) => (
                  <div className="repeat-row" key={index}>
                    <Form.Control
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() => removeRule(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* ============================================
                STATISTICS
            ============================================ */}

            <Tab eventKey="statistics" title="Statistics">
              <div className="admin-section">
                <div className="section-heading-row">
                  <h3>Hostel Statistics</h3>

                  <Button onClick={addStatistic}>+ Add Statistic</Button>
                </div>

                {data.statistics.map((stat, index) => (
                  <Card key={index} className="item-card mb-3">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={3}>
                          <Form.Label>Value</Form.Label>

                          <Form.Control
                            value={stat.value || ""}
                            onChange={(e) =>
                              updateStatistic(index, "value", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={5}>
                          <Form.Label>Label</Form.Label>

                          <Form.Control
                            value={stat.label || ""}
                            onChange={(e) =>
                              updateStatistic(index, "label", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={3}>
                          <Form.Label>Icon</Form.Label>

                          <Form.Control
                            value={stat.icon || ""}
                            onChange={(e) =>
                              updateStatistic(index, "icon", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            className="mt-4"
                            onClick={() => removeStatistic(index)}
                          >
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ============================================
                FAQ
            ============================================ */}

            <Tab eventKey="faq" title="FAQ">
              <div className="admin-section">
                <div className="section-heading-row">
                  <h3>Frequently Asked Questions</h3>

                  <Button onClick={addFaq}>+ Add FAQ</Button>
                </div>

                {data.faqs.map((faq, index) => (
                  <Card key={index} className="item-card mb-3">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={5}>
                          <Form.Label>Question</Form.Label>

                          <Form.Control
                            value={faq.question || ""}
                            onChange={(e) =>
                              updateFaq(index, "question", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Answer</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={faq.answer || ""}
                            onChange={(e) =>
                              updateFaq(index, "answer", e.target.value)
                            }
                          />
                        </Col>

                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            className="mt-4"
                            onClick={() => removeFaq(index)}
                          >
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>

            {/* ============================================
                CTA
            ============================================ */}

            <Tab eventKey="cta" title="CTA">
              <div className="admin-section">
                <h3>Call To Action</h3>

                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label>CTA Title</Form.Label>

                    <Form.Control
                      value={data.cta.title}
                      onChange={(e) =>
                        updateField("cta", "title", e.target.value)
                      }
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label>CTA Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={data.cta.description}
                      onChange={(e) =>
                        updateField("cta", "description", e.target.value)
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

/* =========================================================
   HOSTEL SECTION COMPONENT
========================================================= */

const HostelSection = ({
  title,
  type,
  data,
  addHostel,
  removeHostel,
  updateHostel,
  updateHostelFacility,
  addHostelFacility,
  removeHostelFacility,
  handleImageChange,
  imageFiles,
}) => {
  return (
    <div className="admin-section">
      <div className="section-heading-row">
        <div>
          <h3>{title}</h3>

          <p>
            Manage {title.toLowerCase()}
            information and images.
          </p>
        </div>

        <Button onClick={() => addHostel(type)}>+ Add Hostel</Button>
      </div>

      {data[type].map((hostel, index) => {
        const imageFile =
          imageFiles[
            `${type === "boysHostels" ? "boysImage" : "girlsImage"}_${index}`
          ];

        const preview = imageFile
          ? URL.createObjectURL(imageFile)
          : hostel.image?.url;

        return (
          <Card key={index} className="hostel-item-card mb-4">
            <Card.Body>
              <div className="section-heading-row">
                <h4>Hostel #{index + 1}</h4>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeHostel(type, index)}
                >
                  Remove Hostel
                </Button>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Hostel Name</Form.Label>

                  <Form.Control
                    value={hostel.name || ""}
                    onChange={(e) =>
                      updateHostel(type, index, "name", e.target.value)
                    }
                  />
                </Col>

                <Col md={6}>
                  <Form.Label>Capacity</Form.Label>

                  <Form.Control
                    value={hostel.capacity || ""}
                    onChange={(e) =>
                      updateHostel(type, index, "capacity", e.target.value)
                    }
                  />
                </Col>

                <Col md={12}>
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={hostel.description || ""}
                    onChange={(e) =>
                      updateHostel(type, index, "description", e.target.value)
                    }
                  />
                </Col>
              </Row>

              <div className="image-upload-box mt-4">
                <Form.Label>Hostel Image</Form.Label>

                {preview && (
                  <img
                    src={preview}
                    alt={hostel.name}
                    className="admin-preview-image"
                  />
                )}

                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleImageChange(
                      `${
                        type === "boysHostels" ? "boysImage" : "girlsImage"
                      }_${index}`,
                      e.target.files?.[0],
                    )
                  }
                />
              </div>

              <div className="admin-section-inner mt-4">
                <div className="section-heading-row">
                  <h5>Facilities</h5>

                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => addHostelFacility(type, index)}
                  >
                    + Add Facility
                  </Button>
                </div>

                {(hostel.facilities || []).map((facility, facilityIndex) => (
                  <div className="repeat-row" key={facilityIndex}>
                    <Form.Control
                      value={facility}
                      onChange={(e) =>
                        updateHostelFacility(
                          type,
                          index,
                          facilityIndex,
                          e.target.value,
                        )
                      }
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        removeHostelFacility(type, index, facilityIndex)
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default HostelMessManagement;
