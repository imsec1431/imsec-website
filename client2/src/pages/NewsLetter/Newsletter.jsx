import React, { useEffect, useState } from "react";
import "./Newsletter.css";

import {
  FaBookOpen,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaArrowRight,
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

        // console.log("Newsletter API response:", result);

        /*
          Expected backend response:

          {
            success: true,
            count: 1,
            data: [...]
          }
        */

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

  /*
    If admin selected one newsletter as featured,
    display that newsletter.

    Otherwise use the first newsletter returned
    by the backend.
  */

  const featuredNewsletter =
    newsletters.find((item) => item.isFeatured === true) || newsletters[0];

  /*=========================================
  LATEST EDITION BUTTON
  =========================================*/

  const handleLatestEdition = () => {
    document.getElementById("newsletter-archive")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /*=========================================
  RENDER
  =========================================*/

  return (
    <div className="newsletterPage">
      {/*=====================================
      HERO
      =====================================*/}

      <section className="newsletterHero">
        <div className="heroContent">
          <span>
            <FaBookOpen />
            Monthly Publications
          </span>

          <h1>
            IMSEC
            <strong> Newsletter</strong>
          </h1>

          <p>
            Explore our monthly newsletters featuring academic excellence,
            student achievements, placement highlights, workshops, research
            activities and departmental events.
          </p>
        </div>
      </section>

      {/*=====================================
      SEARCH
      =====================================*/}

      <section className="newsletterSearch">
        <div className="searchBox">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by month or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/*=====================================
      LOADING
      =====================================*/}

      {loading && (
        <section className="featuredSection">
          <div className="sectionHeading">
            <span>Newsletter</span>

            <h2>Loading Newsletters...</h2>

            <p>Please wait while we load the latest publications.</p>
          </div>
        </section>
      )}

      {/*=====================================
      ERROR
      =====================================*/}

      {!loading && error && (
        <section className="featuredSection">
          <div className="sectionHeading">
            <span>Newsletter</span>

            <h2>Unable to Load Newsletters</h2>

            <p>{error}</p>
          </div>
        </section>
      )}

      {/*=====================================
      FEATURED NEWSLETTER
      =====================================*/}

      {!loading && !error && featuredNewsletter && (
        <section className="featuredSection">
          <div className="sectionHeading">
            <span>Latest Edition</span>

            <h2>Featured Newsletter</h2>
          </div>

          <div className="featuredCard">
            {/*=================================
              NO COVER PHOTO

              The cover field from the database
              is intentionally NOT used.
              =================================*/}

            <div className="featuredImage">
              <FaFilePdf />

              <span>
                {featuredNewsletter.month}
                <br />
                {featuredNewsletter.year}
              </span>
            </div>

            {/*=================================
              FEATURED CONTENT
              =================================*/}

            <div className="featuredContent">
              <h5>
                {featuredNewsletter.month} {featuredNewsletter.year}
              </h5>

              <h2>{featuredNewsletter.title}</h2>

              <p>{featuredNewsletter.description}</p>

              <div className="featuredButtons">
                {/* READ ONLINE */}

                <a
                  href={featuredNewsletter.drive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaBookOpen />
                  Read Online
                </a>

                {/* DOWNLOAD */}

                <a
                  href={featuredNewsletter.drive}
                  target="_blank"
                  rel="noopener noreferrer"
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
        <section className="featuredSection">
          <div className="sectionHeading">
            <span>Newsletter Archive</span>

            <h2>No Newsletters Available</h2>

            <p>There are currently no newsletters published.</p>
          </div>
        </section>
      )}

      {/*=====================================
      NEWSLETTER ARCHIVE
      =====================================*/}

      {!loading && !error && newsletters.length > 0 && (
        <section className="archiveSection" id="newsletter-archive">
          <div className="sectionHeading">
            {/* <span>Newsletter Archive</span> */}

            <h2>Browse All Editions</h2>

            {/* <p>
              Discover our monthly publications featuring academic excellence,
              placement achievements, technical events, faculty contributions,
              student accomplishments and departmental milestones.
            </p> */}
          </div>

          {/*=================================
            NO SEARCH RESULTS
            =================================*/}

          {filteredNewsletters.length === 0 && (
            <div className="sectionHeading">
              <h3>No newsletters found</h3>

              <p>Try searching for another month or year.</p>
            </div>
          )}

          {/*=================================
            NEWSLETTER GRID
            =================================*/}

          <div className="newsletterGrid">
            {filteredNewsletters.map((item) => (
              <div className="newsletterCard" key={item._id || item.id}>
                {/*=================================
                  PDF DISPLAY

                  NO COVER PHOTO
                  =================================*/}

                <div className="newsletterCover">
                  <FaFilePdf />

                  <div className="monthBadge">{item.month}</div>
                </div>

                {/*=================================
                  NEWSLETTER CONTENT
                  =================================*/}

                <div className="newsletterContent">
                  <div className="newsletterDate">
                    <FaCalendarAlt />
                    {item.month} {item.year}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  {/*=================================
                    ACTION BUTTONS
                    =================================*/}

                  <div className="newsletterActions">
                    <a
                      href={item.drive}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaBookOpen />
                      Read
                    </a>

                    <a
                      href={item.drive}
                      target="_blank"
                      rel="noopener noreferrer"
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
  );
};

export default Newsletter;
