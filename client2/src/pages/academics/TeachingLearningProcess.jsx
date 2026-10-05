import React, { useEffect, useState } from "react";

import { FaBookOpen, FaTimes, FaExpand } from "react-icons/fa";

import { getTeachingLearningProcesses } from "../../services/teachingLearningProcessService";

import "./TeachingLearningProcess.css";

const TeachingLearningProcess = () => {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  /* =========================================================
     LOAD PUBLIC DATA
  ========================================================= */

  const loadTeachingLearningProcesses = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getTeachingLearningProcesses();

      const data = Array.isArray(response?.data) ? response.data : [];

      const sortedData = [...data].sort(
        (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
      );

      setItems(sortedData);
    } catch (err) {
      console.error("Teaching Learning Process public loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load teaching learning process.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachingLearningProcesses();
  }, []);

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closePreview = () => {
    setSelectedImage(null);
  };

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <div className="publicTeachingLearningPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="publicTeachingLearningHero">
        <div className="publicTeachingLearningHeroOverlay"></div>

        <div className="publicTeachingLearningHeroContent">
          <div className="publicTeachingLearningHeroIcon">
            <FaBookOpen />
          </div>

          <span>ACADEMIC EXCELLENCE</span>

          <h1>Teaching Learning Process</h1>

          <p>
            Explore the teaching and learning practices that support academic
            excellence, innovation and holistic development at IMSEC.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="publicTeachingLearningSection">
        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="publicTeachingLearningLoading">
            <div className="publicTeachingLearningSpinner"></div>

            <p>Loading teaching learning activities...</p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="publicTeachingLearningError">
            <FaBookOpen />

            <p>{error}</p>
          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading && !error && items.length === 0 && (
          <div className="publicTeachingLearningEmpty">
            <FaBookOpen />

            <h3>No Activities Available</h3>

            <p>Teaching learning process activities will be displayed here.</p>
          </div>
        )}

        {/* ===================================================
            GALLERY
        =================================================== */}

        {!loading && !error && items.length > 0 && (
          <div className="publicTeachingLearningGrid">
            {items.map((item, index) => (
              <article
                className="publicTeachingLearningCard"
                key={item._id}
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="publicTeachingLearningImage">
                  <img
                    src={item.image}
                    alt={`Teaching Learning Process ${index + 1}`}
                    loading="lazy"
                  />

                  <div className="publicTeachingLearningImageOverlay">
                    <div className="publicTeachingLearningExpand">
                      <FaExpand />
                    </div>

                    <span>View Image</span>
                  </div>
                </div>

                <div className="publicTeachingLearningCardBottom">
                  <span>Academic Activity</span>

                  <h3>Teaching Learning Process</h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          FULL IMAGE MODAL
      ===================================================== */}

      {selectedImage && (
        <div
          className="publicTeachingLearningModal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview();
            }
          }}
        >
          <button
            type="button"
            className="publicTeachingLearningModalClose"
            onClick={closePreview}
            aria-label="Close image"
          >
            <FaTimes />
          </button>

          <div className="publicTeachingLearningModalImage">
            <img src={selectedImage} alt="Teaching Learning Process" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingLearningProcess;
