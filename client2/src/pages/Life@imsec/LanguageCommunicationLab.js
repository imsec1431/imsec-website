import React, { useEffect, useState } from "react";
import {
  FaComments,
  FaLanguage,
  FaMicrophone,
  FaUserCheck,
} from "react-icons/fa";

import { getLanguageCommunicationLab } from "../../services/languageCommunicationLabService";

import "./LanguageCommunicationLab.css";

const DEFAULT_DATA = {
  hero: {
    title: "Language & Communication Lab",
    subtitle:
      "Developing effective communication and language skills for academic and professional growth",
    breadcrumb: "Home / Life @ IMSEC / Language & Communication Lab",
  },

  about: {
    title: "Language & Communication Lab",
    description:
      "The Language & Communication Lab at IMSEC provides students with a supportive environment to improve their communication, language and presentation skills. The lab helps students develop confidence and effective communication abilities required for academic and professional success.",
  },

  features: [
    {
      title: "Communication Skills",
      description:
        "Students develop effective verbal and written communication skills through guided learning activities.",
    },
    {
      title: "Language Development",
      description:
        "The lab supports improvement in language proficiency, vocabulary and overall language usage.",
    },
    {
      title: "Presentation Skills",
      description:
        "Students get opportunities to improve their presentation, speaking and public communication abilities.",
    },
    {
      title: "Confidence Building",
      description:
        "Regular communication activities help students build confidence for academic and professional interactions.",
    },
  ],

  cta: {
    title: "Enhancing Communication Skills",
    description:
      "The lab supports students in developing language proficiency, communication skills, confidence and professional presentation abilities.",
  },
};

const ICONS = [FaComments, FaLanguage, FaMicrophone, FaUserCheck];

const normalizeData = (data = {}) => ({
  hero: {
    ...DEFAULT_DATA.hero,
    ...(data.hero || {}),
  },

  about: {
    ...DEFAULT_DATA.about,
    ...(data.about || {}),
  },

  features:
    Array.isArray(data.features) && data.features.length
      ? data.features
      : DEFAULT_DATA.features,

  cta: {
    ...DEFAULT_DATA.cta,
    ...(data.cta || {}),
  },
});

const LanguageCommunicationLab = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getLanguageCommunicationLab();

        setData(normalizeData(response?.data));
      } catch (error) {
        console.error("Language & Communication Lab load error:", error);

        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="lcl-public-loading">
        Loading Language & Communication Lab...
      </div>
    );
  }

  return (
    <main className="lcl-public-page">
      {/* =========================
          HERO
      ========================= */}
      <section className="lcl-public-hero">
        <div className="lcl-hero-overlay">
          <div className="lcl-hero-content">
            <span className="lcl-hero-label">LIFE @ IMSEC</span>

            <h1>{data.hero.title}</h1>

            <div className="lcl-hero-line"></div>

            <p>{data.hero.subtitle}</p>

            <div className="lcl-breadcrumb">{data.hero.breadcrumb}</div>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT
      ========================= */}
      <section className="lcl-about-section">
        <div className="lcl-container">
          <div className="lcl-about-content">
            <span className="lcl-section-label">ABOUT THE LAB</span>

            <h2>{data.about.title}</h2>

            <div className="lcl-section-line"></div>

            <p>{data.about.description}</p>

            <div className="lcl-about-points">
              <div>
                <FaComments />
                <span>Effective communication</span>
              </div>

              <div>
                <FaLanguage />
                <span>Language development</span>
              </div>

              <div>
                <FaMicrophone />
                <span>Presentation skills</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}
      <section className="lcl-features-section">
        <div className="lcl-container">
          <div className="lcl-section-heading">
            <span className="lcl-section-label">KEY FEATURES</span>

            <h2>Building Better Communication</h2>

            <div className="lcl-section-line center"></div>

            <p>
              The Language & Communication Lab supports students in developing
              essential communication and language skills.
            </p>
          </div>

          <div className="lcl-feature-grid">
            {data.features.map((feature, index) => {
              const Icon = ICONS[index % ICONS.length];

              return (
                <article
                  className="lcl-feature-card"
                  key={`${feature.title}-${index}`}
                >
                  <div className="lcl-feature-icon">
                    <Icon />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="lcl-public-cta">
        <div className="lcl-container">
          <div className="lcl-cta-content">
            <span className="lcl-section-label">LANGUAGE & COMMUNICATION</span>

            <h2>{data.cta.title}</h2>

            <div className="lcl-cta-line"></div>

            <p>{data.cta.description}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LanguageCommunicationLab;
