import React, { useEffect, useState } from "react";
import { FaArrowRight, FaUtensils } from "react-icons/fa";

import { getCafeteria } from "../../services/cafeteriaService";

import "./Cafeteria.css";

const DEFAULT_DATA = {
  hero: {
    title: "Cafeteria",
    breadcrumb: "Home / Life @ IMSEC / Cafeteria",
    image: {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
      publicId: "",
    },
  },

  about: {
    title: "A Place to Relax & Refresh",
    description:
      "The cafeteria at IMS Engineering College provides students and staff with a comfortable and welcoming space to relax, refresh and enjoy meals during the academic day.",
    image: {
      url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
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

const Cafeteria = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCafeteria = async () => {
      try {
        const response = await getCafeteria();

        if (mounted && response?.data) {
          setData(normalizeData(response.data));
        }
      } catch (error) {
        console.error("Cafeteria API Error:", error);

        /*
         * Keep default data if API
         * is unavailable.
         */
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCafeteria();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="cafeteria-page-loading">
        <div className="cafeteria-loading-spinner" />
        <p>Loading cafeteria...</p>
      </div>
    );
  }

  return (
    <main className="cafeteria-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="cafeteria-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(7, 29, 58, 0.94),
              rgba(10, 46, 92, 0.88),
              rgba(18, 63, 122, 0.82)
            ),
            url("${data.hero.image.url}")
          `,
        }}
      >
        <div className="cafeteria-hero-glow cafeteria-glow-one" />
        <div className="cafeteria-hero-glow cafeteria-glow-two" />

        <div className="cafeteria-hero-circle" />

        <div className="cafeteria-hero-content">
          <div className="cafeteria-hero-icon">
            <FaUtensils />
          </div>

          <h1>{data.hero.title}</h1>

          <div className="cafeteria-yellow-line" />

          <p>{data.hero.breadcrumb}</p>
        </div>
      </section>

      {/* =================================================
          ABOUT
      ================================================= */}

      <section className="cafeteria-about">
        <div className="cafeteria-container">
          <div className="cafeteria-about-grid">
            {/* Image */}

            <div className="cafeteria-about-image-wrap">
              <div className="cafeteria-image-decoration" />

              <img
                src={data.about.image.url}
                alt={data.about.title}
                className="cafeteria-about-image"
              />

              <div className="cafeteria-image-badge">
                <FaUtensils />

                <span>Cafeteria</span>
              </div>
            </div>

            {/* Content */}

            <div className="cafeteria-about-content">
              <span className="cafeteria-section-label">LIFE @ IMSEC</span>

              <h2>{data.about.title}</h2>

              <div className="cafeteria-heading-line" />

              <p>{data.about.description}</p>

              <div className="cafeteria-about-bottom">
                <div className="cafeteria-mini-icon">
                  <FaUtensils />
                </div>

                <span>Comfortable space for students & staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SIMPLE HIGHLIGHT
      ================================================= */}

      <section className="cafeteria-highlight">
        <div className="cafeteria-container">
          <div className="cafeteria-highlight-card">
            <div className="cafeteria-highlight-icon">
              <FaUtensils />
            </div>

            <div>
              <span>LIFE @ IMSEC</span>

              <h3>Food, Comfort & Community</h3>

              <p>
                A welcoming cafeteria environment where students and staff can
                take a break, refresh and spend quality time during the academic
                day.
              </p>
            </div>

            <div className="cafeteria-highlight-arrow">
              <FaArrowRight />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cafeteria;
