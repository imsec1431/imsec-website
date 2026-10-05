import React, { useEffect, useMemo, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";

import { getPublicFAQ } from "../../services/faqPublicService.js";

import "./FAQ.css";

const FAQ = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [faqData, setFaqData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeIndex, setActiveIndex] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");

  const [searchText, setSearchText] = useState("");

  /* =========================================================
     LOAD PUBLIC FAQ
  ========================================================= */

  const loadFAQ = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPublicFAQ();

      // console.log("Public FAQ response:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load FAQ.");
      }

      setFaqData(response.data || null);
    } catch (err) {
      console.error("Public FAQ error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load frequently asked questions.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadFAQ();
  }, []);

  /* =========================================================
     FILTER FAQS
  ========================================================= */

  const filteredFAQs = useMemo(() => {
    if (!faqData?.faqs) {
      return [];
    }

    const search = searchText.trim().toLowerCase();

    return faqData.faqs.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;

      const searchMatch =
        !search ||
        item.question?.toLowerCase().includes(search) ||
        item.answer?.toLowerCase().includes(search);

      return categoryMatch && searchMatch;
    });
  }, [faqData, activeCategory, searchText]);

  /* =========================================================
     TOGGLE FAQ
  ========================================================= */

  const handleToggle = (index) => {
    setActiveIndex((previous) => (previous === index ? null : index));
  };

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    setActiveIndex(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="publicFaqPage">
        <div className="publicFaqLoading">
          <Spinner animation="border" />

          <p>Loading frequently asked questions...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="publicFaqPage">
        <div className="publicFaqContainer">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT PUBLISHED
  ========================================================= */

  if (!faqData) {
    return (
      <div className="publicFaqPage">
        <div className="publicFaqContainer">
          <div className="publicFaqEmpty">
            <div className="publicFaqEmptyIcon">?</div>

            <h2>Frequently Asked Questions</h2>

            <p>FAQ information is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = ["All", ...(faqData.categories || [])];

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="publicFaqPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="publicFaqHero">
        <div className="publicFaqContainer">
          <div className="publicFaqBreadcrumb">
            <span>Admissions</span>

            <span>/</span>

            <strong>FAQ</strong>
          </div>

          <div className="publicFaqHeroContent">
            <span className="publicFaqEyebrow">
              {faqData.heroLabel || "ADMISSIONS"}
            </span>

            <h1>
              {faqData.heroTitle ||
                faqData.title ||
                "Frequently Asked Questions"}
            </h1>

            <p>
              {faqData.heroDescription ||
                faqData.subtitle ||
                "Find answers to frequently asked questions."}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="publicFaqMain">
        <div className="publicFaqContainer">
          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="publicFaqSearch">
            <div className="publicFaqSearchIcon">⌕</div>

            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search frequently asked questions..."
              aria-label="Search FAQ"
            />

            {searchText && (
              <button
                type="button"
                className="publicFaqSearchClear"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="publicFaqCategories">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "publicFaqCategory active"
                    : "publicFaqCategory"
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* =================================================
              FAQ HEADER
          ================================================= */}

          <div className="publicFaqHeading">
            <div>
              <span>KNOWLEDGE CENTRE</span>

              <h2>{faqData.title || "Frequently Asked Questions"}</h2>
            </div>

            <div className="publicFaqCount">
              {filteredFAQs.length}

              <span>
                {filteredFAQs.length === 1 ? " Question" : " Questions"}
              </span>
            </div>
          </div>

          {/* =================================================
              FAQ LIST
          ================================================= */}

          {filteredFAQs.length > 0 ? (
            <div className="publicFaqList">
              {filteredFAQs.map((item, index) => {
                const isOpen = activeIndex === index;

                return (
                  <article
                    className={isOpen ? "publicFaqItem open" : "publicFaqItem"}
                    key={item._id || `${item.question}-${index}`}
                  >
                    {/* ===================================
                          QUESTION
                      =================================== */}

                    <button
                      type="button"
                      className="publicFaqQuestion"
                      onClick={() => handleToggle(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="publicFaqQuestionNumber">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="publicFaqQuestionText">
                        {item.question}
                      </span>

                      {item.category && (
                        <span className="publicFaqItemCategory">
                          {item.category}
                        </span>
                      )}

                      <span className="publicFaqToggle">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {/* ===================================
                          ANSWER
                      =================================== */}

                    <div
                      className="publicFaqAnswerWrapper"
                      style={{
                        display: isOpen ? "block" : "none",
                      }}
                    >
                      <div className="publicFaqAnswer">
                        <div className="publicFaqAnswerLine" />

                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* =============================================
               NO RESULTS
            ============================================= */

            <div className="publicFaqNoResults">
              <div className="publicFaqNoResultsIcon">?</div>

              <h3>No questions found</h3>

              <p>
                {searchText
                  ? `No FAQ matches "${searchText}".`
                  : "There are no questions in this category."}
              </p>

              {(searchText || activeCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText("");

                    setActiveCategory("All");

                    setActiveIndex(null);
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* =================================================
              BOTTOM INFORMATION
          ================================================= */}

          <section className="publicFaqHelp">
            <div className="publicFaqHelpIcon">?</div>

            <div>
              <h3>Still have a question?</h3>

              <p>
                If you cannot find the information you are looking for, please
                contact the college for further assistance.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
