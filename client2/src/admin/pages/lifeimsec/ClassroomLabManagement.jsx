import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
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
  FaArrowLeft,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaFlask,
  FaLaptopCode,
  FaLightbulb,
  FaRedo,
  FaSave,
  FaUpload,
  FaUsers,
} from "react-icons/fa";

import {
  getClassroomLabAdmin,
  updateClassroomLabAdmin,
  resetClassroomLabDefaults,
} from "../../services/classroomLabAdminService";

import "./ClassroomLabManagement.css";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Class Rooms & Labs",
    subtitle:
      "Modern learning spaces and practical facilities for academic excellence",
    breadcrumb: "Home / Life @ IMSEC / Class Rooms & Labs",
    image: {
      url: "",
    },
  },

  about: {
    title: "Modern Classrooms & Well-Equipped Laboratories",
    description:
      "IMS Engineering College provides a comfortable and supportive academic environment through modern classrooms and well-equipped laboratories. The academic facilities are designed to support effective teaching, practical learning, experimentation, interaction and overall student development. Well-planned learning spaces and technology-enabled facilities help students connect theoretical concepts with practical applications.",
    additionalDescription:
      "The classrooms provide a conducive environment for lectures, discussions, presentations and collaborative learning, while the laboratories provide opportunities for experimentation and hands-on practice. These facilities form an important part of the academic experience at IMSEC.",
    image: {
      url: "",
    },
  },

  classrooms: {
    title: "Modern & Comfortable Classrooms",
    description:
      "The classrooms at IMSEC are designed to provide students with a comfortable, focused and interactive learning environment. Spacious academic spaces support lectures, classroom discussions, presentations and various teaching-learning activities.",
    features: [
      {
        title: "Spacious Learning Spaces",
        description:
          "Comfortable classrooms provide an appropriate environment for regular academic activities and student interaction.",
      },
      {
        title: "Modern Teaching Aids",
        description:
          "Teaching-learning activities are supported through modern instructional and presentation facilities.",
      },
      {
        title: "Interactive Learning",
        description:
          "Classroom spaces encourage interaction, discussion, presentations and collaborative learning.",
      },
      {
        title: "Comfortable Environment",
        description:
          "Well-maintained classrooms provide a pleasant and focused environment for students and faculty.",
      },
    ],
  },

  laboratories: {
    title: "Well-Equipped Laboratories",
    description:
      "Practical laboratories provide students with opportunities to apply classroom concepts through experimentation, observation and hands-on activities. The laboratory environment supports practical understanding and development of technical skills.",
    features: [
      {
        title: "Practical Learning",
        description:
          "Students can apply theoretical concepts through practical exercises and experiments.",
      },
      {
        title: "Hands-on Experience",
        description:
          "Laboratory activities provide opportunities to develop practical and technical skills.",
      },
      {
        title: "Experimental Learning",
        description:
          "Students gain experience through observation, experimentation, analysis and problem-solving activities.",
      },
      {
        title: "Academic Support",
        description:
          "Laboratories complement classroom teaching and strengthen conceptual understanding.",
      },
    ],
  },

  technology: {
    title: "Technology-Enabled Learning",
    description:
      "Technology-enabled classrooms and academic facilities support contemporary teaching methods, presentations, demonstrations and interactive learning. Digital resources help faculty make classroom teaching more engaging and effective.",
    features: [
      {
        title: "ICT-Enabled Teaching",
        description:
          "Technology-supported facilities assist faculty in delivering effective and engaging academic sessions.",
      },
      {
        title: "Audio-Visual Support",
        description:
          "Presentation and demonstration facilities support different teaching-learning methods.",
      },
      {
        title: "Digital Learning",
        description:
          "Digital resources can be incorporated into classroom teaching and academic activities.",
      },
    ],
  },

  learningEnvironment: {
    title: "A Conducive Learning Environment",
    description:
      "The academic facilities at IMSEC are planned to create a disciplined, comfortable and supportive learning environment. Classrooms and laboratories together provide students with opportunities for conceptual learning, practical application and academic interaction.",
    features: [
      {
        title: "Focused Academic Environment",
        description:
          "Dedicated learning spaces help students maintain focus on academic activities.",
      },
      {
        title: "Student Interaction",
        description:
          "Classroom environments encourage communication and interaction between students and faculty.",
      },
      {
        title: "Theory to Practice",
        description:
          "Laboratory activities help students connect theoretical knowledge with practical applications.",
      },
      {
        title: "Overall Development",
        description:
          "Academic facilities contribute to the development of practical, analytical and problem-solving skills.",
      },
    ],
  },

  highlights: {
    classroomTitle: "Modern Classrooms",
    classroomDescription:
      "Spacious and comfortable classrooms provide an effective environment for teaching, interaction and academic learning.",

    laboratoryTitle: "Well-Equipped Laboratories",
    laboratoryDescription:
      "Practical laboratories provide students with opportunities to apply theoretical concepts, conduct experiments and develop hands-on technical skills.",

    technologyTitle: "ICT-Enabled Learning",
    technologyDescription:
      "Technology-enabled facilities support modern teaching methods, presentations, demonstrations and interactive learning.",

    environmentTitle: "Supportive Learning Environment",
    environmentDescription:
      "Well-maintained academic spaces provide a comfortable and supportive environment for students and faculty.",
  },

  academicExperience: {
    title: "Supporting Academic Excellence",
    description:
      "The combination of modern classrooms, practical laboratories and technology-enabled learning facilities supports a balanced academic experience. Students get opportunities to learn concepts, participate in discussions, perform practical activities and develop skills required for their academic and professional growth.",
  },

  cta: {
    title: "Learning Beyond the Classroom",
    description:
      "At IMSEC, classrooms and laboratories work together to provide students with meaningful opportunities for learning, experimentation and practical skill development.",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const normalizeData = (data) => ({
  ...DEFAULT_DATA,
  ...(data || {}),

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

  classrooms: {
    ...DEFAULT_DATA.classrooms,
    ...(data?.classrooms || {}),
    features: Array.isArray(data?.classrooms?.features)
      ? data.classrooms.features
      : DEFAULT_DATA.classrooms.features,
  },

  laboratories: {
    ...DEFAULT_DATA.laboratories,
    ...(data?.laboratories || {}),
    features: Array.isArray(data?.laboratories?.features)
      ? data.laboratories.features
      : DEFAULT_DATA.laboratories.features,
  },

  technology: {
    ...DEFAULT_DATA.technology,
    ...(data?.technology || {}),
    features: Array.isArray(data?.technology?.features)
      ? data.technology.features
      : DEFAULT_DATA.technology.features,
  },

  learningEnvironment: {
    ...DEFAULT_DATA.learningEnvironment,
    ...(data?.learningEnvironment || {}),
    features: Array.isArray(data?.learningEnvironment?.features)
      ? data.learningEnvironment.features
      : DEFAULT_DATA.learningEnvironment.features,
  },

  highlights: {
    ...DEFAULT_DATA.highlights,
    ...(data?.highlights || {}),
  },

  academicExperience: {
    ...DEFAULT_DATA.academicExperience,
    ...(data?.academicExperience || {}),
  },

  cta: {
    ...DEFAULT_DATA.cta,
    ...(data?.cta || {}),
  },
});

/* =========================================================
   FEATURE EDITOR
========================================================= */

const FeatureEditor = ({ features, onChange, title }) => {
  const updateFeature = (index, field, value) => {
    const updated = [...features];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const addFeature = () => {
    onChange([
      ...features,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);

    onChange(updated);
  };

  return (
    <div className="feature-editor">
      <div className="feature-editor-header">
        <h5>{title}</h5>

        <Button variant="outline-primary" size="sm" onClick={addFeature}>
          + Add Feature
        </Button>
      </div>

      {features.map((feature, index) => (
        <Card className="feature-item" key={index}>
          <Card.Body>
            <div className="feature-item-top">
              <Badge bg="secondary">Feature {index + 1}</Badge>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                Remove
              </Button>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Feature Title</Form.Label>

              <Form.Control
                type="text"
                value={feature.title || ""}
                onChange={(e) => updateFeature(index, "title", e.target.value)}
                placeholder="Enter feature title"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Feature Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                value={feature.description || ""}
                onChange={(e) =>
                  updateFeature(index, "description", e.target.value)
                }
                placeholder="Enter feature description"
              />
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ClassroomLabManagement = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [heroFile, setHeroFile] = useState(null);

  const [aboutFile, setAboutFile] = useState(null);

  const [heroPreview, setHeroPreview] = useState("");

  const [aboutPreview, setAboutPreview] = useState("");

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

      const response = await getClassroomLabAdmin();

      setData(normalizeData(response?.data || response));
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message || err.message || "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     GENERIC FIELD UPDATE
  ======================================================= */

  const updateSection = (section, field, value) => {
    setData((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* =======================================================
     IMAGE VALIDATION
  ======================================================= */

  const validateImage = (file) => {
    if (!file) return false;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");

      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      return false;
    }

    return true;
  };

  /* =======================================================
     HERO IMAGE
  ======================================================= */

  const handleHeroImage = (file) => {
    if (!validateImage(file)) return;

    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
    setError("");
  };

  /* =======================================================
     ABOUT IMAGE
  ======================================================= */

  const handleAboutImage = (file) => {
    if (!validateImage(file)) return;

    setAboutFile(file);
    setAboutPreview(URL.createObjectURL(file));
    setError("");
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("data", JSON.stringify(data));

      if (heroFile) {
        formData.append("heroImage", heroFile);
      }

      if (aboutFile) {
        formData.append("aboutImage", aboutFile);
      }

      const response = await updateClassroomLabAdmin(formData);

      setData(normalizeData(response?.data || data));

      setHeroFile(null);
      setAboutFile(null);

      setHeroPreview("");
      setAboutPreview("");

      setMessage("Class Rooms & Labs content updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message || err.message || "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to restore all Class Rooms & Labs content to default values?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await resetClassroomLabDefaults();

      setData(normalizeData(response?.data || DEFAULT_DATA));

      setHeroFile(null);
      setAboutFile(null);

      setHeroPreview("");
      setAboutPreview("");

      setMessage("Class Rooms & Labs restored to default successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to restore defaults",
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
      <div className="classroom-lab-admin-loading">
        <Spinner animation="border" />

        <p>Loading Class Rooms & Labs management...</p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="classroom-lab-admin">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="classroom-lab-admin-header">
        <div>
          <div className="classroom-lab-admin-breadcrumb">
            <FaArrowLeft />

            <span>Life @ IMSEC</span>

            <span>/</span>

            <strong>Class Rooms & Labs</strong>
          </div>

          <h1>Class Rooms & Labs Management</h1>

          <p>
            Manage all public content, descriptions, facilities and images for
            the Class Rooms & Labs page.
          </p>
        </div>

        <div className="classroom-lab-header-actions">
          <Button
            variant="light"
            onClick={handleReset}
            disabled={saving || resetting}
          >
            {resetting ? <Spinner size="sm" animation="border" /> : <FaRedo />}

            <span>Restore Defaults</span>
          </Button>

          <Button
            variant="warning"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}

            <span>Save All Changes</span>
          </Button>
        </div>
      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          <FaCheckCircle /> {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="classroom-lab-admin-content">
        <Tabs defaultActiveKey="hero" className="classroom-lab-tabs mb-4">
          {/* =================================================
              HERO
          ================================================= */}

          <Tab
            eventKey="hero"
            title={
              <>
                <FaBookOpen /> Hero
              </>
            }
          >
            <Card className="cms-section-card">
              <Card.Body>
                <SectionHeading
                  icon={<FaBookOpen />}
                  title="Hero Section"
                  description="Manage the main banner displayed at the top of the public page."
                />

                <Row>
                  <Col lg={7}>
                    <Form.Group className="mb-4">
                      <Form.Label>Page Title</Form.Label>

                      <Form.Control
                        value={data.hero.title}
                        onChange={(e) =>
                          updateSection("hero", "title", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Subtitle</Form.Label>

                      <Form.Control
                        value={data.hero.subtitle}
                        onChange={(e) =>
                          updateSection("hero", "subtitle", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Breadcrumb</Form.Label>

                      <Form.Control
                        value={data.hero.breadcrumb}
                        onChange={(e) =>
                          updateSection("hero", "breadcrumb", e.target.value)
                        }
                      />
                    </Form.Group>

                    <ImageUploadBox
                      label="Hero Image"
                      currentImage={data.hero.image?.url}
                      preview={heroPreview}
                      onChange={handleHeroImage}
                      file={heroFile}
                    />
                  </Col>

                  <Col lg={5}>
                    <PreviewImage
                      title="Hero Image Preview"
                      image={heroPreview || data.hero.image?.url}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* =================================================
              ABOUT
          ================================================= */}

          <Tab
            eventKey="about"
            title={
              <>
                <FaUsers /> About
              </>
            }
          >
            <Card className="cms-section-card">
              <Card.Body>
                <SectionHeading
                  icon={<FaUsers />}
                  title="About Class Rooms & Labs"
                  description="Introduce the academic learning spaces and laboratory facilities."
                />

                <Row>
                  <Col lg={7}>
                    <Form.Group className="mb-4">
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control
                        value={data.about.title}
                        onChange={(e) =>
                          updateSection("about", "title", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={data.about.description}
                        onChange={(e) =>
                          updateSection("about", "description", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Additional Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={data.about.additionalDescription}
                        onChange={(e) =>
                          updateSection(
                            "about",
                            "additionalDescription",
                            e.target.value,
                          )
                        }
                      />
                    </Form.Group>

                    <ImageUploadBox
                      label="About Image"
                      currentImage={data.about.image?.url}
                      preview={aboutPreview}
                      onChange={handleAboutImage}
                      file={aboutFile}
                    />
                  </Col>

                  <Col lg={5}>
                    <PreviewImage
                      title="About Image Preview"
                      image={aboutPreview || data.about.image?.url}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* =================================================
              CLASSROOMS
          ================================================= */}

          <Tab
            eventKey="classrooms"
            title={
              <>
                <FaChalkboardTeacher />
                Classrooms
              </>
            }
          >
            <ContentSection
              icon={<FaChalkboardTeacher />}
              title={data.classrooms.title}
              description="Manage the classroom section and its feature cards."
            >
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  value={data.classrooms.title}
                  onChange={(e) =>
                    updateSection("classrooms", "title", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Section Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  value={data.classrooms.description}
                  onChange={(e) =>
                    updateSection("classrooms", "description", e.target.value)
                  }
                />
              </Form.Group>

              <FeatureEditor
                title="Classroom Features"
                features={data.classrooms.features}
                onChange={(features) =>
                  updateSection("classrooms", "features", features)
                }
              />
            </ContentSection>
          </Tab>

          {/* =================================================
              LABORATORIES
          ================================================= */}

          <Tab
            eventKey="laboratories"
            title={
              <>
                <FaFlask /> Laboratories
              </>
            }
          >
            <ContentSection
              icon={<FaFlask />}
              title={data.laboratories.title}
              description="Manage the laboratory section and practical learning features."
            >
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  value={data.laboratories.title}
                  onChange={(e) =>
                    updateSection("laboratories", "title", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Section Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  value={data.laboratories.description}
                  onChange={(e) =>
                    updateSection("laboratories", "description", e.target.value)
                  }
                />
              </Form.Group>

              <FeatureEditor
                title="Laboratory Features"
                features={data.laboratories.features}
                onChange={(features) =>
                  updateSection("laboratories", "features", features)
                }
              />
            </ContentSection>
          </Tab>

          {/* =================================================
              TECHNOLOGY
          ================================================= */}

          <Tab
            eventKey="technology"
            title={
              <>
                <FaLaptopCode />
                Technology
              </>
            }
          >
            <ContentSection
              icon={<FaLaptopCode />}
              title={data.technology.title}
              description="Manage ICT-enabled and technology-supported learning content."
            >
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  value={data.technology.title}
                  onChange={(e) =>
                    updateSection("technology", "title", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Section Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  value={data.technology.description}
                  onChange={(e) =>
                    updateSection("technology", "description", e.target.value)
                  }
                />
              </Form.Group>

              <FeatureEditor
                title="Technology Features"
                features={data.technology.features}
                onChange={(features) =>
                  updateSection("technology", "features", features)
                }
              />
            </ContentSection>
          </Tab>

          {/* =================================================
              ENVIRONMENT
          ================================================= */}

          <Tab
            eventKey="environment"
            title={
              <>
                <FaLightbulb />
                Environment
              </>
            }
          >
            <ContentSection
              icon={<FaLightbulb />}
              title={data.learningEnvironment.title}
              description="Manage the learning environment and student experience content."
            >
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  value={data.learningEnvironment.title}
                  onChange={(e) =>
                    updateSection(
                      "learningEnvironment",
                      "title",
                      e.target.value,
                    )
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Section Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={5}
                  value={data.learningEnvironment.description}
                  onChange={(e) =>
                    updateSection(
                      "learningEnvironment",
                      "description",
                      e.target.value,
                    )
                  }
                />
              </Form.Group>

              <FeatureEditor
                title="Learning Environment Features"
                features={data.learningEnvironment.features}
                onChange={(features) =>
                  updateSection("learningEnvironment", "features", features)
                }
              />
            </ContentSection>
          </Tab>

          {/* =================================================
              HIGHLIGHTS
          ================================================= */}

          <Tab
            eventKey="highlights"
            title={
              <>
                <FaCheckCircle />
                Highlights
              </>
            }
          >
            <Card className="cms-section-card">
              <Card.Body>
                <SectionHeading
                  icon={<FaCheckCircle />}
                  title="Facilities Highlights"
                  description="Manage the short highlight cards shown on the public page."
                />

                <Row>
                  <HighlightEditor
                    md={6}
                    title="Classroom Highlight"
                    icon={<FaChalkboardTeacher />}
                    titleValue={data.highlights.classroomTitle}
                    descriptionValue={data.highlights.classroomDescription}
                    onTitleChange={(value) =>
                      updateSection("highlights", "classroomTitle", value)
                    }
                    onDescriptionChange={(value) =>
                      updateSection("highlights", "classroomDescription", value)
                    }
                  />

                  <HighlightEditor
                    md={6}
                    title="Laboratory Highlight"
                    icon={<FaFlask />}
                    titleValue={data.highlights.laboratoryTitle}
                    descriptionValue={data.highlights.laboratoryDescription}
                    onTitleChange={(value) =>
                      updateSection("highlights", "laboratoryTitle", value)
                    }
                    onDescriptionChange={(value) =>
                      updateSection(
                        "highlights",
                        "laboratoryDescription",
                        value,
                      )
                    }
                  />

                  <HighlightEditor
                    md={6}
                    title="Technology Highlight"
                    icon={<FaLaptopCode />}
                    titleValue={data.highlights.technologyTitle}
                    descriptionValue={data.highlights.technologyDescription}
                    onTitleChange={(value) =>
                      updateSection("highlights", "technologyTitle", value)
                    }
                    onDescriptionChange={(value) =>
                      updateSection(
                        "highlights",
                        "technologyDescription",
                        value,
                      )
                    }
                  />

                  <HighlightEditor
                    md={6}
                    title="Environment Highlight"
                    icon={<FaLightbulb />}
                    titleValue={data.highlights.environmentTitle}
                    descriptionValue={data.highlights.environmentDescription}
                    onTitleChange={(value) =>
                      updateSection("highlights", "environmentTitle", value)
                    }
                    onDescriptionChange={(value) =>
                      updateSection(
                        "highlights",
                        "environmentDescription",
                        value,
                      )
                    }
                  />
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* =================================================
              ACADEMIC EXPERIENCE
          ================================================= */}

          <Tab
            eventKey="academic"
            title={
              <>
                <FaBookOpen />
                Academic
              </>
            }
          >
            <ContentSection
              icon={<FaBookOpen />}
              title={data.academicExperience.title}
              description="Manage the concluding academic experience section."
            >
              <Form.Group className="mb-4">
                <Form.Label>Section Title</Form.Label>

                <Form.Control
                  value={data.academicExperience.title}
                  onChange={(e) =>
                    updateSection("academicExperience", "title", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={7}
                  value={data.academicExperience.description}
                  onChange={(e) =>
                    updateSection(
                      "academicExperience",
                      "description",
                      e.target.value,
                    )
                  }
                />
              </Form.Group>
            </ContentSection>
          </Tab>

          {/* =================================================
              CTA
          ================================================= */}

          <Tab eventKey="cta" title="CTA">
            <ContentSection
              title={data.cta.title}
              description="Manage the closing message displayed at the bottom of the public page."
            >
              <Form.Group className="mb-4">
                <Form.Label>CTA Title</Form.Label>

                <Form.Control
                  value={data.cta.title}
                  onChange={(e) =>
                    updateSection("cta", "title", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>CTA Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={6}
                  value={data.cta.description}
                  onChange={(e) =>
                    updateSection("cta", "description", e.target.value)
                  }
                />
              </Form.Group>
            </ContentSection>
          </Tab>
        </Tabs>

        {/* =================================================
            BOTTOM SAVE
        ================================================= */}

        <div className="classroom-lab-bottom-save">
          <Button
            variant="warning"
            size="lg"
            onClick={handleSave}
            disabled={saving || resetting}
          >
            {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

const SectionHeading = ({ icon, title, description }) => (
  <div className="cms-section-heading">
    <div className="cms-section-heading-icon">{icon}</div>

    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

/* =========================================================
   CONTENT SECTION
========================================================= */

const ContentSection = ({ icon, title, description, children }) => (
  <Card className="cms-section-card">
    <Card.Body>
      <SectionHeading icon={icon} title={title} description={description} />

      {children}
    </Card.Body>
  </Card>
);

/* =========================================================
   IMAGE UPLOAD
========================================================= */

const ImageUploadBox = ({ label, currentImage, preview, onChange, file }) => (
  <Form.Group className="image-upload-box">
    <Form.Label>{label}</Form.Label>

    <div className="image-upload-inner">
      <div>
        <FaUpload />

        <strong>Upload Image</strong>

        <small>
          JPG, JPEG, PNG or WEBP
          <br />
          Maximum 10 MB
        </small>

        <Form.Control
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => onChange(e.target.files?.[0])}
        />

        {file && (
          <Badge bg="success" className="mt-2">
            New image selected
          </Badge>
        )}
      </div>

      {currentImage && !preview && (
        <img src={currentImage} alt={label} className="upload-current-image" />
      )}
    </div>
  </Form.Group>
);

/* =========================================================
   IMAGE PREVIEW
========================================================= */

const PreviewImage = ({ title, image }) => (
  <div className="cms-preview-box">
    <h5>{title}</h5>

    {image ? (
      <img src={image} alt="Preview" />
    ) : (
      <div className="cms-preview-empty">No image selected</div>
    )}
  </div>
);

/* =========================================================
   HIGHLIGHT EDITOR
========================================================= */

const HighlightEditor = ({
  md,
  title,
  icon,
  titleValue,
  descriptionValue,
  onTitleChange,
  onDescriptionChange,
}) => (
  <Col md={md} className="mb-4">
    <Card className="highlight-editor-card">
      <Card.Body>
        <div className="highlight-editor-icon">{icon}</div>

        <h5>{title}</h5>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>

          <Form.Control
            value={titleValue || ""}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>

          <Form.Control
            as="textarea"
            rows={4}
            value={descriptionValue || ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  </Col>
);

export default ClassroomLabManagement;
