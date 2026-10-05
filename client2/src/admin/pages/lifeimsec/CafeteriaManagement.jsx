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
} from "react-bootstrap";

import { FaSave, FaUndo, FaUtensils, FaImage } from "react-icons/fa";

import {
  getCafeteriaAdmin,
  updateCafeteriaAdmin,
  resetCafeteriaDefaults,
} from "../../services/cafeteriaAdminService";

import "./CafeteriaManagement.css";

const DEFAULT_DATA = {
  hero: {
    title: "Cafeteria",
    breadcrumb: "Home / Life @ IMSEC / Cafeteria",
    image: {
      url: "",
      publicId: "",
    },
  },

  about: {
    title: "A Place to Relax & Refresh",
    description:
      "The cafeteria at IMS Engineering College provides students and staff with a comfortable and welcoming space to relax, refresh and enjoy meals during the academic day.",
    image: {
      url: "",
      publicId: "",
    },
  },
};

const normalizeData = (data) => ({
  hero: {
    ...DEFAULT_DATA.hero,
    ...(data?.hero || {}),
    image: {
      ...DEFAULT_DATA.hero.image,
      ...(data?.hero?.image || {}),
    },
  },

  about: {
    ...DEFAULT_DATA.about,
    ...(data?.about || {}),
    image: {
      ...DEFAULT_DATA.about.image,
      ...(data?.about?.image || {}),
    },
  },
});

const CafeteriaManagement = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resetting, setResetting] = useState(false);

  const [heroFile, setHeroFile] = useState(null);

  const [aboutFile, setAboutFile] = useState(null);

  const [heroPreview, setHeroPreview] = useState("");

  const [aboutPreview, setAboutPreview] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadData();

    return () => {
      if (heroPreview) {
        URL.revokeObjectURL(heroPreview);
      }

      if (aboutPreview) {
        URL.revokeObjectURL(aboutPreview);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCafeteriaAdmin();

      if (response?.data) {
        setData(normalizeData(response.data));
      }
    } catch (err) {
      console.error("Cafeteria load error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load cafeteria data.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Text Change
  |--------------------------------------------------------------------------
  */

  const handleTextChange = (section, field, value) => {
    setData((previous) => ({
      ...previous,

      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Image Selection
  |--------------------------------------------------------------------------
  */

  const handleHeroImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Please select JPG, JPEG, PNG or WEBP image.");

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Hero image must be less than 10 MB.");

      event.target.value = "";
      return;
    }

    setError("");
    setHeroFile(file);

    if (heroPreview) {
      URL.revokeObjectURL(heroPreview);
    }

    setHeroPreview(URL.createObjectURL(file));
  };

  const handleAboutImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Please select JPG, JPEG, PNG or WEBP image.");

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("About image must be less than 10 MB.");

      event.target.value = "";
      return;
    }

    setError("");
    setAboutFile(file);

    if (aboutPreview) {
      URL.revokeObjectURL(aboutPreview);
    }

    setAboutPreview(URL.createObjectURL(file));
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      const cleanData = {
        hero: {
          title: data.hero.title.trim(),
          breadcrumb: data.hero.breadcrumb.trim(),
          image: {
            url: data.hero.image?.url || "",
            publicId: data.hero.image?.publicId || "",
          },
        },

        about: {
          title: data.about.title.trim(),
          description: data.about.description.trim(),
          image: {
            url: data.about.image?.url || "",
            publicId: data.about.image?.publicId || "",
          },
        },
      };

      formData.append("data", JSON.stringify(cleanData));

      if (heroFile) {
        formData.append("heroImage", heroFile);
      }

      if (aboutFile) {
        formData.append("aboutImage", aboutFile);
      }

      const response = await updateCafeteriaAdmin(formData);

      if (response?.data) {
        setData(normalizeData(response.data));
      }

      setHeroFile(null);
      setAboutFile(null);

      setHeroPreview("");
      setAboutPreview("");

      setMessage("Cafeteria updated successfully.");
    } catch (err) {
      console.error("Cafeteria save error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save cafeteria.",
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
      "Are you sure you want to restore the default cafeteria content? Your uploaded images and edited text will be replaced.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setResetting(true);
      setError("");
      setMessage("");

      const response = await resetCafeteriaDefaults();

      if (response?.data) {
        setData(normalizeData(response.data));
      } else {
        setData(normalizeData(DEFAULT_DATA));
      }

      setHeroFile(null);
      setAboutFile(null);

      setHeroPreview("");
      setAboutPreview("");

      setMessage("Cafeteria defaults restored successfully.");
    } catch (err) {
      console.error("Cafeteria reset error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
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
      <div className="cafeteria-loading">
        <Spinner animation="border" />

        <p>Loading cafeteria content...</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="cafeteria-management">
      {/* Header */}

      <div className="cafeteria-admin-header">
        <div>
          <div className="cafeteria-admin-icon">
            <FaUtensils />
          </div>

          <div>
            <h1>Cafeteria Management</h1>

            <p>Manage the cafeteria page content and images.</p>
          </div>
        </div>

        <div className="cafeteria-header-actions">
          <Button
            variant="outline-secondary"
            onClick={handleReset}
            disabled={saving || resetting}
          >
            {resetting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Restoring...
              </>
            ) : (
              <>
                <FaUndo className="me-2" />
                Restore Defaults
              </>
            )}
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}

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

      {/* Hero Section */}

      <Card className="cafeteria-admin-card">
        <Card.Body>
          <div className="cafeteria-section-heading">
            <div>
              <span>SECTION 01</span>

              <h2>Hero Section</h2>

              <p>
                Main heading and banner image shown at the top of the cafeteria
                page.
              </p>
            </div>
          </div>

          <Row className="g-4">
            <Col lg={7} md={12}>
              <Form.Group className="mb-4">
                <Form.Label>Hero Title</Form.Label>

                <Form.Control
                  type="text"
                  value={data.hero.title}
                  onChange={(e) =>
                    handleTextChange("hero", "title", e.target.value)
                  }
                  placeholder="Enter hero title"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Breadcrumb</Form.Label>

                <Form.Control
                  type="text"
                  value={data.hero.breadcrumb}
                  onChange={(e) =>
                    handleTextChange("hero", "breadcrumb", e.target.value)
                  }
                  placeholder="Home / Life @ IMSEC / Cafeteria"
                />
              </Form.Group>
            </Col>

            <Col lg={5} md={12}>
              <ImageUploadBox
                label="Hero Image"
                currentImage={data.hero.image?.url}
                preview={heroPreview}
                onChange={handleHeroImageChange}
                file={heroFile}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* About Section */}

      <Card className="cafeteria-admin-card">
        <Card.Body>
          <div className="cafeteria-section-heading">
            <div>
              <span>SECTION 02</span>

              <h2>About Cafeteria</h2>

              <p>
                Simple introduction content displayed below the hero section.
              </p>
            </div>
          </div>

          <Row className="g-4">
            <Col lg={7} md={12}>
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  type="text"
                  value={data.about.title}
                  onChange={(e) =>
                    handleTextChange("about", "title", e.target.value)
                  }
                  placeholder="Enter section title"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={7}
                  value={data.about.description}
                  onChange={(e) =>
                    handleTextChange("about", "description", e.target.value)
                  }
                  placeholder="Enter cafeteria description"
                />

                <Form.Text muted>
                  Keep the description simple and informative.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col lg={5} md={12}>
              <ImageUploadBox
                label="About Image"
                currentImage={data.about.image?.url}
                preview={aboutPreview}
                onChange={handleAboutImageChange}
                file={aboutFile}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bottom Save */}

      <div className="cafeteria-bottom-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={saving || resetting}
        >
          {saving ? (
            <>
              <Spinner size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="me-2" />
              Save Cafeteria
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Image Upload Component
|--------------------------------------------------------------------------
*/

const ImageUploadBox = ({ label, currentImage, preview, onChange, file }) => {
  const displayImage = preview || currentImage;

  return (
    <div className="cafeteria-image-upload">
      <Form.Label>{label}</Form.Label>

      <div className="cafeteria-image-preview">
        {displayImage ? (
          <Image src={displayImage} alt={label} fluid />
        ) : (
          <div className="cafeteria-image-placeholder">
            <FaImage />

            <span>No image selected</span>
          </div>
        )}
      </div>

      <Form.Control
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onChange}
      />

      {file && (
        <small className="cafeteria-selected-file">Selected: {file.name}</small>
      )}

      <small className="cafeteria-image-help">
        JPG, JPEG, PNG or WEBP · Maximum 10 MB
      </small>
    </div>
  );
};

export default CafeteriaManagement;
