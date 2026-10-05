import React, { useEffect, useMemo, useState } from "react";
import "../CSS/DepartmentEvents.css";

import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaArrowRight,
  FaTags,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import { getPublicDepartmentEvents } from "../../../services/departmentPublicService";

const DEPARTMENT_SLUG = "computer-science-engineering";

const DepartmentEvents = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     FETCH EVENTS
  ========================================================= */

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicDepartmentEvents(DEPARTMENT_SLUG);

        if (!response?.success) {
          throw new Error(
            response?.message || "Failed to load department events",
          );
        }

        const eventData = Array.isArray(response.data) ? response.data : [];

        setEvents(eventData);
      } catch (err) {
        console.error("Public Department Events Error:", err);

        setError(err.message || "Failed to load department events");

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = events
      .map((item) => String(item.category || "").trim())
      .filter(Boolean);

    return ["All", ...Array.from(new Set(uniqueCategories))];
  }, [events]);

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const selectedCategory = String(category || "")
      .trim()
      .toLowerCase();

    return [...events]
      .sort((a, b) => {
        if (Boolean(a.featured) !== Boolean(b.featured)) {
          return a.featured ? -1 : 1;
        }

        return Number(a.displayOrder || 999) - Number(b.displayOrder || 999);
      })
      .filter((item) => {
        const title = String(item.title || "").toLowerCase();

        const eventCategory = String(item.category || "")
          .trim()
          .toLowerCase();

        const venue = String(item.venue || "").toLowerCase();

        const coordinator = String(item.coordinator || "").toLowerCase();

        const description = String(item.description || "").toLowerCase();

        /* SEARCH */

        const matchSearch =
          !keyword ||
          title.includes(keyword) ||
          eventCategory.includes(keyword) ||
          venue.includes(keyword) ||
          coordinator.includes(keyword) ||
          description.includes(keyword);

        /* CATEGORY */

        const matchCategory =
          selectedCategory === "all" || eventCategory === selectedCategory;

        return matchSearch && matchCategory;
      });
  }, [events, search, category]);

  /* =========================================================
     FEATURED EVENT
  ========================================================= */

  /*
    Featured event is displayed separately
    only when "All" is selected and
    there is no search text.

    This is important because otherwise
    selecting a category can make one
    matching event appear in the featured
    area instead of the filtered grid.
  */

  const featuredEvent =
    category === "All" && !search.trim()
      ? filteredEvents.find((item) => item.featured === true)
      : null;

  /* =========================================================
     OTHER EVENTS
  ========================================================= */

  const otherEvents = featuredEvent
    ? filteredEvents.filter((item) => item._id !== featuredEvent._id)
    : filteredEvents;

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* =========================================================
     SOCIAL LINKS
  ========================================================= */

  const SocialLinks = ({ socialLinks }) => {
    if (!socialLinks) {
      return null;
    }

    const hasSocialLinks =
      socialLinks.facebook ||
      socialLinks.instagram ||
      socialLinks.linkedin ||
      socialLinks.youtube ||
      socialLinks.twitter;

    if (!hasSocialLinks) {
      return null;
    }

    return (
      <div className="eventSocialLinks">
        {socialLinks.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            title="Facebook"
            onClick={(e) => e.stopPropagation()}
          >
            <FaFacebookF />
          </a>
        )}

        {socialLinks.instagram && (
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
            onClick={(e) => e.stopPropagation()}
          >
            <FaInstagram />
          </a>
        )}

        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLinkedinIn />
          </a>
        )}

        {socialLinks.youtube && (
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            title="YouTube"
            onClick={(e) => e.stopPropagation()}
          >
            <FaYoutube />
          </a>
        )}

        {socialLinks.twitter && (
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            title="X"
            onClick={(e) => e.stopPropagation()}
          >
            <FaXTwitter />
          </a>
        )}
      </div>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="eventsPage">
        <section className="eventsHero">
          <h1>Departmental Events</h1>

          <p>
            Discover workshops, coding contests, alumni talks, seminars and
            technical activities organized by the Department of CSE.
          </p>
        </section>

        <div className="eventsLoading">
          <FaCalendarAlt />

          <h3>Loading Department Events...</h3>

          <p>Please wait while we fetch the latest events.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="eventsPage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="eventsHero">
        <h1>Departmental Events</h1>

        <p>
          Discover workshops, coding contests, alumni talks, seminars and
          technical activities organized by the Department of CSE.
        </p>
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="searchSection">
        <div className="searchBox">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="categorySection">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "categoryBtn active" : "categoryBtn"}
            onClick={() => {
              setCategory(item);

              /*
                  Clear search so category
                  selection immediately shows
                  all events from that category.
                */

              setSearch("");
            }}
          >
            {item}
          </button>
        ))}
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && <div className="eventsError">{error}</div>}

      {/* =====================================================
          FEATURED EVENT
      ===================================================== */}

      {featuredEvent && (
        <section className="featuredEvent">
          {/* IMAGE */}

          <div className="featuredImage">
            {featuredEvent.image ? (
              <img src={featuredEvent.image} alt={featuredEvent.title} />
            ) : (
              <div className="imagePlaceholder">
                <FaCalendarAlt />
              </div>
            )}
          </div>

          {/* CONTENT */}

          <div className="featuredContent">
            <span className="featuredBadge">Featured Event</span>

            <h2>{featuredEvent.title}</h2>

            {featuredEvent.description && <p>{featuredEvent.description}</p>}

            {/* FEATURED INFORMATION */}

            <div className="featuredInfo">
              {featuredEvent.date && (
                <div>
                  <FaCalendarAlt />

                  <span>{formatDate(featuredEvent.date)}</span>
                </div>
              )}

              {featuredEvent.venue && (
                <div>
                  <FaMapMarkerAlt />

                  <span>{featuredEvent.venue}</span>
                </div>
              )}

              {featuredEvent.coordinator && (
                <div>
                  <FaUserTie />

                  <span>{featuredEvent.coordinator}</span>
                </div>
              )}

              {featuredEvent.category && (
                <div>
                  <FaTags />

                  <span>{featuredEvent.category}</span>
                </div>
              )}
            </div>

            {/* SOCIAL LINKS */}

            <SocialLinks socialLinks={featuredEvent.socialLinks} />
          </div>
        </section>
      )}

      {/* =====================================================
          EVENTS GRID
      ===================================================== */}

      <section className="eventsGrid" id="department-events-list">
        {otherEvents.length > 0 ? (
          otherEvents.map((event, index) => (
            <div className="eventCard" key={event._id || event.id || index}>
              {/* =================================================
                    DATE + EVENT TYPE
                ================================================= */}

              <div className="eventHeader">
                {event.date && (
                  <div className="dateBadge">
                    <FaCalendarAlt />

                    <span>{formatDate(event.date)}</span>
                  </div>
                )}

                {event.category && (
                  <div className="categoryBadge">
                    <FaTags />

                    <span>{event.category}</span>
                  </div>
                )}
              </div>

              {/* =================================================
                    IMAGE
                ================================================= */}

              <div className="eventImage">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="imagePlaceholder">
                    <FaCalendarAlt />
                  </div>
                )}
              </div>

              {/* =================================================
                    BODY
                ================================================= */}

              <div className="eventBody">
                <h3>{event.title}</h3>

                {event.description && <p>{event.description}</p>}

                {/* EVENT INFORMATION */}

                <div className="eventInfo">
                  {event.venue && (
                    <div>
                      <FaMapMarkerAlt />

                      <span>{event.venue}</span>
                    </div>
                  )}

                  {event.coordinator && (
                    <div>
                      <FaUserTie />

                      <span>{event.coordinator}</span>
                    </div>
                  )}
                </div>

                {/* SOCIAL MEDIA */}

                <SocialLinks socialLinks={event.socialLinks} />
              </div>
            </div>
          ))
        ) : !featuredEvent ? (
          <div className="noEvents">
            <FaCalendarAlt />

            <h3>No Events Found</h3>

            <p>No department events match your search or selected category.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default DepartmentEvents;
