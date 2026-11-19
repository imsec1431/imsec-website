import React, { useEffect, useState } from "react";
import "./Newsletter.css";

import {
  FaBookOpen,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaFilePdf,
} from "react-icons/fa";

/*=========================================
API
=========================================*/

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/newsletter`;

/*=========================================
NEWSLETTER COMPONENT
=========================================*/

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*=========================================
  LOAD NEWSLETTERS FROM BACKEND
  =========================================*/

  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to load newsletters. Server returned ${response.status}.`,
          );
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setNewsletters(result);
        } else if (Array.isArray(result?.data)) {
          setNewsletters(result.data);
        } else {
          setNewsletters([]);
        }
      } catch (err) {
        console.error("Newsletter loading error:", err);

        setError(
          err?.message || "Unable to load newsletters. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadNewsletters();
  }, []);

  /*=========================================
  SEARCH
  =========================================*/

  const filteredNewsletters = newsletters.filter((item) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      item.month?.toLowerCase().includes(query) ||
      String(item.year || "").includes(query) ||
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  /*=========================================
  FEATURED NEWSLETTER
  =========================================*/

  const featuredNewsletter =
    newsletters.find((item) => item.isFeatured === true) || newsletters[0];

  /*=========================================
  RENDER
  =========================================*/

  return (
    <div className="newsletterPage">
      {/*=====================================
      HERO
      =====================================*/}

      <section className="newsletterHero">
        <div className="newsletterHeroContainer">
          <div className="newsletterHeroContent">
            <span className="newsletterHeroTag">PUBLICATIONS &amp; MEDIA</span>

            <h1>IMSEC Newsletter</h1>

            <p>
              Explore our monthly newsletters featuring academic excellence,
              student achievements, placement highlights, workshops, research
              activities and departmental events.
            </p>
          </div>
        </div>
      </section>

      {/*=====================================
      MAIN CONTAINER (90% FLUID)
      =====================================*/}

      <div className="newsletterContainer">
        {/*=====================================
        SEARCH
        =====================================*/}

        <section className="newsletterSearch">
          <div className="searchBox">
            <FaSearch />

            <input
              type="text"
              placeholder="Search by month, year, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/*=====================================
        LOADING
        =====================================*/}

        {loading && (
          <section className="newsletterStatus">
            <div className="newsletterLoadingSpinner" />
            <h3>Loading Newsletters...</h3>
            <p>Please wait while we load the latest publications.</p>
          </section>
        )}

        {/*=====================================
        ERROR
        =====================================*/}

        {!loading && error && (
          <section className="newsletterStatus">
            <h3>Unable to Load Newsletters</h3>
            <p>{error}</p>
          </section>
        )}

        {/*=====================================
        FEATURED NEWSLETTER
        =====================================*/}

        {!loading && !error && featuredNewsletter && (
          <section className="featuredSection">
            <div className="sectionHeading">
              <span>LATEST EDITION</span>

              <h2>Featured Newsletter</h2>
            </div>

            <div className="featuredCard">
              <div className="featuredImage">
                <FaFilePdf />

                <span>
                  {featuredNewsletter.month}
                  <br />
                  {featuredNewsletter.year}
                </span>
              </div>

              <div className="featuredContent">
                <h5>
                  {featuredNewsletter.month} {featuredNewsletter.year}
                </h5>

                <h2>{featuredNewsletter.title}</h2>

                <p>{featuredNewsletter.description}</p>

                <div className="featuredButtons">
                  <a
                    href={featuredNewsletter.drive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="readButton"
                  >
                    <FaBookOpen />
                    Read Online
                  </a>

                  <a
                    href={featuredNewsletter.drive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="downloadButton"
                  >
                    <FaDownload />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/*=====================================
        NO NEWSLETTERS
        =====================================*/}

        {!loading && !error && newsletters.length === 0 && (
          <section className="newsletterStatus">
            <h3>No Newsletters Available</h3>
            <p>There are currently no newsletters published.</p>
          </section>
        )}

        {/*=====================================
        NEWSLETTER ARCHIVE
        =====================================*/}

        {!loading && !error && newsletters.length > 0 && (
          <section className="archiveSection" id="newsletter-archive">
            <div className="sectionHeading">
              <span>ALL EDITIONS</span>

              <h2>Browse Newsletter Archive</h2>
            </div>

            {filteredNewsletters.length === 0 && (
              <div className="noSearchResults">
                <h3>No newsletters found</h3>

                <p>Try searching for another month or year.</p>
              </div>
            )}

            <div className="newsletterGrid">
              {filteredNewsletters.map((item) => (
                <div className="newsletterCard" key={item._id || item.id}>
                  <div className="newsletterCover">
                    <FaFilePdf />

                    <div className="monthBadge">{item.month}</div>
                  </div>

                  <div className="newsletterContent">
                    <div className="newsletterDate">
                      <FaCalendarAlt />
                      {item.month} {item.year}
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <div className="newsletterActions">
                      <a
                        href={item.drive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cardReadButton"
                      >
                        <FaBookOpen />
                        Read
                      </a>

                      <a
                        href={item.drive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cardDownloadButton"
                      >
                        <FaDownload />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/*=====================================
        CALL TO ACTION
        =====================================*/}

        <section className="newsletterCTA">
          <div className="ctaBox">
            <FaFilePdf className="ctaIcon" />

            <h2>Never Miss a Newsletter</h2>

            <p>
              Explore every monthly edition and stay updated with department
              achievements, research, placements, workshops and student success
              stories.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Newsletter;
