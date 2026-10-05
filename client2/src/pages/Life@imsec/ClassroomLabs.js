import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaFlask,
  FaLaptopCode,
  FaLightbulb,
  FaUsers,
} from "react-icons/fa";

import { getClassroomLab } from "../../services/classroomLabService";
import "./ClassroomLabs.css";

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
   NORMALIZE DATA
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
   FEATURE ICON
========================================================= */

const getFeatureIcon = (index, type) => {
  if (type === "classroom") {
    return index % 2 === 0 ? <FaChalkboardTeacher /> : <FaUsers />;
  }

  if (type === "laboratory") {
    return index % 2 === 0 ? <FaFlask /> : <FaLightbulb />;
  }

  if (type === "technology") {
    return index % 2 === 0 ? <FaLaptopCode /> : <FaLightbulb />;
  }

  return index % 2 === 0 ? <FaCheckCircle /> : <FaUsers />;
};

/* =========================================================
   FEATURE SECTION
========================================================= */

const FeatureSection = ({ section, type, reverse = false }) => {
  const features = Array.isArray(section?.features) ? section.features : [];

  return (
    <section
      className={`classroom-lab-feature-section ${
        reverse ? "classroom-lab-feature-reverse" : ""
      }`}
    >
      <div className="container">
        <div className="classroom-lab-feature-header">
          <span className="classroom-lab-eyebrow">
            {type === "classroom"
              ? "CLASSROOM FACILITIES"
              : type === "laboratory"
                ? "PRACTICAL FACILITIES"
                : type === "technology"
                  ? "DIGITAL LEARNING"
                  : "LEARNING ENVIRONMENT"}
          </span>

          <h2>{section?.title}</h2>

          <div className="classroom-lab-heading-line"></div>

          <p>{section?.description}</p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-lg-6" key={`${type}-${index}`}>
              <div className="classroom-lab-feature-card">
                <div className="classroom-lab-feature-icon">
                  {getFeatureIcon(index, type)}
                </div>

                <div>
                  <h3>{feature?.title}</h3>

                  <p>{feature?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const ClassroomLabs = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getClassroomLab();

        const classroomData =
          response?.data || response?.classroomLab || response;

        setData(normalizeData(classroomData));
      } catch (error) {
        console.error("Failed to load Class Rooms & Labs:", error);

        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="classroom-lab-loading">
        <div className="classroom-lab-loader"></div>

        <p>Loading Class Rooms & Labs...</p>
      </div>
    );
  }

  const heroImage = data.hero?.image?.url;

  const aboutImage = data.about?.image?.url;

  return (
    <main className="classroom-lab-page">
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="classroom-lab-hero"
        style={
          heroImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    rgba(7, 29, 58, 0.84),
                    rgba(10, 46, 92, 0.90)
                  ),
                  url("${heroImage}")
                `,
              }
            : undefined
        }
      >
        <div className="classroom-lab-hero-glow"></div>

        <div className="classroom-lab-hero-circle"></div>

        <div className="container">
          <div className="classroom-lab-hero-content">
            <span className="classroom-lab-hero-small">LIFE @ IMSEC</span>

            <h1>{data.hero.title}</h1>

            <div className="classroom-lab-hero-line"></div>

            <p>{data.hero.subtitle}</p>

            <div className="classroom-lab-breadcrumb">
              {data.hero.breadcrumb}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          ABOUT
      =================================================== */}

      <section className="classroom-lab-about">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="classroom-lab-about-content">
                <span className="classroom-lab-eyebrow">
                  ACADEMIC FACILITIES
                </span>

                <h2>{data.about.title}</h2>

                <div className="classroom-lab-heading-line"></div>

                <p>{data.about.description}</p>

                <p>{data.about.additionalDescription}</p>

                <div className="classroom-lab-about-points">
                  <div>
                    <FaCheckCircle />
                    <span>Comfortable learning spaces</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Practical learning facilities</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Technology-supported teaching</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="classroom-lab-about-image-wrap">
                {aboutImage ? (
                  <img
                    src={aboutImage}
                    alt="Class Rooms and Laboratories at IMSEC"
                    className="classroom-lab-about-image"
                  />
                ) : (
                  <div className="classroom-lab-image-placeholder">
                    <FaChalkboardTeacher />
                    <span>Class Rooms & Labs</span>
                  </div>
                )}

                <div className="classroom-lab-image-badge">
                  <FaBookOpen />

                  <div>
                    <strong>Academic</strong>

                    <span>Learning Facilities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CLASSROOMS
      =================================================== */}

      <FeatureSection section={data.classrooms} type="classroom" />

      {/* ===================================================
          LABORATORIES
      =================================================== */}

      <FeatureSection section={data.laboratories} type="laboratory" reverse />

      {/* ===================================================
          TECHNOLOGY
      =================================================== */}

      <section className="classroom-lab-technology">
        <div className="classroom-lab-technology-overlay"></div>

        <div className="container">
          <div className="classroom-lab-technology-content">
            <span className="classroom-lab-eyebrow light">
              TECHNOLOGY & INNOVATION
            </span>

            <h2>{data.technology.title}</h2>

            <div className="classroom-lab-heading-line light-line"></div>

            <p>{data.technology.description}</p>
          </div>

          <div className="row g-4 classroom-lab-tech-grid">
            {data.technology.features.map((feature, index) => (
              <div className="col-lg-4 col-md-6" key={`technology-${index}`}>
                <div className="classroom-lab-tech-card">
                  <div className="classroom-lab-tech-icon">
                    {getFeatureIcon(index, "technology")}
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          LEARNING ENVIRONMENT
      =================================================== */}

      <FeatureSection section={data.learningEnvironment} type="environment" />

      {/* ===================================================
          HIGHLIGHTS
      =================================================== */}

      <section className="classroom-lab-highlights">
        <div className="container">
          <div className="classroom-lab-section-heading">
            <span className="classroom-lab-eyebrow">OUR STRENGTHS</span>

            <h2>Learning Facilities at a Glance</h2>

            <div className="classroom-lab-heading-line centered"></div>

            <p>
              Academic facilities at IMSEC are designed to support classroom
              learning, practical understanding and overall student development.
            </p>
          </div>

          <div className="row g-4">
            <HighlightCard
              icon={<FaChalkboardTeacher />}
              title={data.highlights.classroomTitle}
              description={data.highlights.classroomDescription}
            />

            <HighlightCard
              icon={<FaFlask />}
              title={data.highlights.laboratoryTitle}
              description={data.highlights.laboratoryDescription}
            />

            <HighlightCard
              icon={<FaLaptopCode />}
              title={data.highlights.technologyTitle}
              description={data.highlights.technologyDescription}
            />

            <HighlightCard
              icon={<FaLightbulb />}
              title={data.highlights.environmentTitle}
              description={data.highlights.environmentDescription}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          ACADEMIC EXPERIENCE
      =================================================== */}

      <section className="classroom-lab-academic">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="classroom-lab-academic-icon">
                <FaBookOpen />
              </div>

              <span className="classroom-lab-eyebrow">ACADEMIC EXPERIENCE</span>

              <h2>{data.academicExperience.title}</h2>

              <div className="classroom-lab-heading-line"></div>
            </div>

            <div className="col-lg-7">
              <p className="classroom-lab-academic-text">
                {data.academicExperience.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CTA
      =================================================== */}

      <section className="classroom-lab-cta">
        <div className="container">
          <div className="classroom-lab-cta-box">
            <div className="classroom-lab-cta-content">
              <span className="classroom-lab-eyebrow light">
                LEARN • EXPLORE • APPLY
              </span>

              <h2>{data.cta.title}</h2>

              <p>{data.cta.description}</p>
            </div>

            <div className="classroom-lab-cta-icon">
              <FaArrowRight />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   HIGHLIGHT CARD
========================================================= */

const HighlightCard = ({ icon, title, description }) => (
  <div className="col-xl-3 col-lg-6 col-md-6">
    <div className="classroom-lab-highlight-card">
      <div className="classroom-lab-highlight-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  </div>
);

export default ClassroomLabs;
