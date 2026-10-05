import React, { useEffect, useMemo, useState } from "react";

import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaDownload,
  FaFacebookF,
  FaFilePdf,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaUsers,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import eventService, {
  getEventImageUrl,
  getEventSocialLinks,
  getPdfUrl,
} from "../../services/eventService";

import "./Events.css";

/* =========================================================
   CONSTANTS
========================================================= */

const EVENTS_PER_PAGE = 20;

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Events",
    subtitle: "Discover events, activities and memorable moments at IMSEC",
    breadcrumb: "Home / Life @ IMSEC / Events",
  },

  about: {
    title: "Events at IMSEC",
    description1: "",
    description2: "",
    image: {},
  },

  featuredEvent: null,

  latestEvents: {
    displayCount: 6,
    totalCount: 0,
    events: [],
  },

  memorableEvents: {
    displayCount: 6,
    totalCount: 0,
    events: [],
  },

  signatureEvents: {
    displayCount: 8,
    totalCount: 0,
    events: [],
  },

  statistics: {
    eventsEveryYear: "200+",
    participants: "15,000+",
    industrySpeakers: "500+",
    studentClubs: "50+",
  },

  cta: {
    title: "Be a Part of IMSEC Events",
    description:
      "Participate in events, activities and experiences that make campus life memorable.",
    buttonText: "Explore Events",
    buttonLink: "/events",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const cloneData = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateRange = (event) => {
  const start = event?.startDate;

  const end = event?.endDate;

  if (!start && !end) {
    return "";
  }

  if (start && end && start !== end) {
    return `${formatDate(start)} – ${formatDate(end)}`;
  }

  return formatDate(start || end);
};

const getSectionEvents = (section) => {
  if (!section || !Array.isArray(section.events)) {
    return [];
  }

  return section.events.filter((event) => event?.published !== false);
};

/* =========================================================
   EVENT DOCUMENT BUTTONS
========================================================= */

const EventDocuments = ({ event }) => {
  const photoPdf = getPdfUrl(event?.photoPdf);

  const reportPdf = getPdfUrl(event?.reportPdf);

  if (!photoPdf && !reportPdf) {
    return null;
  }

  return (
    <div className="event-documents">
      {photoPdf && (
        <a
          href={photoPdf}
          target="_blank"
          rel="noreferrer"
          className="event-document-btn"
        >
          <FaFilePdf />
          <span>View Photo PDF</span>
        </a>
      )}

      {reportPdf && (
        <a
          href={reportPdf}
          target="_blank"
          rel="noreferrer"
          className="event-document-btn"
        >
          <FaFilePdf />
          <span>View Event Report</span>
        </a>
      )}
    </div>
  );
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

const EventSocialLinks = ({ socialLinks }) => {
  const links = getEventSocialLinks(socialLinks);

  const items = [
    {
      key: "facebook",
      url: links.facebook,
      icon: <FaFacebookF />,
      label: "Facebook",
    },

    {
      key: "instagram",
      url: links.instagram,
      icon: <FaInstagram />,
      label: "Instagram",
    },

    {
      key: "youtube",
      url: links.youtube,
      icon: <FaYoutube />,
      label: "YouTube",
    },

    {
      key: "linkedin",
      url: links.linkedin,
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
    },

    {
      key: "twitter",
      url: links.twitter,
      icon: <FaTwitter />,
      label: "Twitter",
    },

    {
      key: "website",
      url: links.website,
      icon: <FaGlobe />,
      label: "Website",
    },
  ].filter((item) => item.url);

  if (!items.length) {
    return null;
  }

  return (
    <div className="event-social-links">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

/* =========================================================
   EVENT CARD
========================================================= */

const EventCard = ({ event, featured = false }) => {
  const imageUrl = getEventImageUrl(event?.image);

  return (
    <article className={`event-card ${featured ? "featured" : ""}`}>
      {/* IMAGE */}

      <div className="event-card-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event?.title || "IMSEC Event"}
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <div className="event-card-image-placeholder">
            <FaCalendarAlt />

            <span>IMSEC EVENT</span>
          </div>
        )}

        {event?.category && (
          <span className="event-card-category">{event.category}</span>
        )}

        {event?.featured && (
          <span className="event-card-featured">FEATURED</span>
        )}
      </div>

      {/* CONTENT */}

      <div className="event-card-content">
        <div className="event-card-top">
          {event?.eventType && (
            <span className="event-card-type">{event.eventType}</span>
          )}

          {event?.status && (
            <span
              className={`event-card-status ${String(event.status)
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {event.status}
            </span>
          )}
        </div>

        <h3>{event?.title || "IMSEC Event"}</h3>

        {event?.shortDescription && (
          <p className="event-card-short-description">
            {event.shortDescription}
          </p>
        )}

        {!event?.shortDescription && event?.description && (
          <p className="event-card-short-description">{event.description}</p>
        )}

        {/* META */}

        <div className="event-meta">
          {formatDateRange(event) && (
            <div className="event-meta-item">
              <FaCalendarAlt />

              <span>{formatDateRange(event)}</span>
            </div>
          )}

          {event?.time && (
            <div className="event-meta-item">
              <FaClock />

              <span>{event.time}</span>
            </div>
          )}

          {event?.venue && (
            <div className="event-meta-item">
              <FaMapMarkerAlt />

              <span>{event.venue}</span>
            </div>
          )}

          {event?.participants && (
            <div className="event-meta-item">
              <FaUsers />

              <span>{event.participants}</span>
            </div>
          )}
        </div>

        {/* DEPARTMENT */}

        {event?.department && (
          <div className="event-department">
            <span>Department</span>

            <strong>{event.department}</strong>
          </div>
        )}

        {/* PROGRAM */}

        {event?.program && (
          <div className="event-program">
            <span>Program</span>

            <strong>{event.program}</strong>
          </div>
        )}

        {/* ORGANIZER */}

        {event?.organizer && (
          <div className="event-organizer">
            <strong>Organizer:</strong>

            <span>{event.organizer}</span>
          </div>
        )}

        {/* DOCUMENTS */}

        <EventDocuments event={event} />

        {/* REGISTRATION */}

        {event?.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="event-registration-btn"
          >
            Register / Know More
            <FaArrowRight />
          </a>
        )}

        {/* SOCIAL */}

        <EventSocialLinks socialLinks={event?.socialLinks} />
      </div>
    </article>
  );
};

/* =========================================================
   PAGINATION
========================================================= */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const addPage = (page) => {
    if (page >= 1 && page <= totalPages && !pages.includes(page)) {
      pages.push(page);
    }
  };

  addPage(1);

  addPage(currentPage - 1);

  addPage(currentPage);

  addPage(currentPage + 1);

  addPage(totalPages);

  const sortedPages = pages.sort((a, b) => a - b);

  return (
    <div className="events-pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {sortedPages.map((page, index) => {
        const previous = sortedPages[index - 1];

        const gap = previous && page - previous > 1;

        return (
          <React.Fragment key={page}>
            {gap && <span className="events-pagination-dots">…</span>}

            <button
              type="button"
              className={currentPage === page ? "active" : ""}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

/* =========================================================
   EVENT SECTION
========================================================= */

const EventSection = ({ sectionKey, title, subtitle, section }) => {
  const events = getSectionEvents(section);

  const adminDisplayCount = Math.max(0, Number(section?.displayCount || 0));

  /*
   * Admin display count determines the
   * initial amount, but NEVER exceeds
   * 20 cards per page.
   */

  const initialCount = Math.min(
    adminDisplayCount || EVENTS_PER_PAGE,
    EVENTS_PER_PAGE,
  );

  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Reset pagination when the
   * section data changes.
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [sectionKey, events.length]);

  /*
   * First page respects the admin
   * displayCount.
   *
   * Subsequent pages contain
   * maximum 20 events.
   */

  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(events.length - initialCount, 0) / EVENTS_PER_PAGE) + 1,
  );

  const visibleEvents = useMemo(() => {
    if (!events.length) {
      return [];
    }

    if (currentPage === 1) {
      return events.slice(0, initialCount);
    }

    const start = initialCount + (currentPage - 2) * EVENTS_PER_PAGE;

    return events.slice(start, start + EVENTS_PER_PAGE);
  }, [events, currentPage, initialCount]);

  /*
   * If admin display count is
   * greater than 20, page 1 is
   * exactly 20.
   */

  const totalDisplayed = events.length;

  if (!events.length) {
    return null;
  }

  const firstPageCount = Math.min(initialCount, events.length);

  return (
    <section className="events-section" id={`events-${sectionKey}`}>
      <div className="events-container">
        {/* HEADING */}

        <div className="events-section-heading">
          <span className="events-eyebrow">IMSEC EVENTS</span>

          <h2>{title}</h2>

          {subtitle && <p>{subtitle}</p>}

          <div className="events-heading-line" />
        </div>

        {/* INFO */}

        <div className="events-section-info">
          <span>
            {totalDisplayed} {totalDisplayed === 1 ? "Event" : "Events"}
          </span>

          {totalPages > 1 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* GRID */}

        <div className="events-grid">
          {visibleEvents.map((event, index) => (
            <EventCard
              key={event?._id || `${sectionKey}-${currentPage}-${index}`}
              event={event}
            />
          ))}
        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="events-pagination-wrapper">
            <div className="events-pagination-summary">
              Showing{" "}
              {currentPage === 1
                ? `1–${firstPageCount}`
                : `${initialCount + (currentPage - 2) * EVENTS_PER_PAGE + 1}–${Math.min(
                    initialCount + (currentPage - 1) * EVENTS_PER_PAGE,
                    events.length,
                  )}`}{" "}
              of {events.length} events
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   FEATURED EVENT
========================================================= */

const FeaturedEvent = ({ event }) => {
  if (!event) {
    return null;
  }

  return (
    <section className="events-featured-section">
      <div className="events-container">
        <div className="events-section-heading">
          <span className="events-eyebrow">FEATURED EVENT</span>

          <h2>{event.title}</h2>

          <div className="events-heading-line" />
        </div>

        <EventCard event={event} featured />
      </div>
    </section>
  );
};

/* =========================================================
   ABOUT
========================================================= */

const AboutSection = ({ about }) => {
  if (
    !about ||
    (!about.title &&
      !about.description1 &&
      !about.description2 &&
      !about.image?.url)
  ) {
    return null;
  }

  return (
    <section className="events-about">
      <div className="events-container events-about-grid">
        <div className="events-about-content">
          <span className="events-eyebrow">CAMPUS EXPERIENCE</span>

          <h2>{about.title || "Events at IMSEC"}</h2>

          <div className="events-heading-line left" />

          {about.description1 && <p>{about.description1}</p>}

          {about.description2 && <p>{about.description2}</p>}
        </div>

        {about.image?.url && (
          <div className="events-about-image">
            <img
              src={about.image.url}
              alt={about.title || "IMSEC Events"}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   STATISTICS
========================================================= */

const StatisticsSection = ({ statistics }) => {
  if (!statistics) {
    return null;
  }

  const items = [
    {
      value: statistics.eventsEveryYear || "200+",
      label: "Events Every Year",
    },

    {
      value: statistics.participants || "15,000+",
      label: "Participants",
    },

    {
      value: statistics.industrySpeakers || "500+",
      label: "Industry Speakers",
    },

    {
      value: statistics.studentClubs || "50+",
      label: "Student Clubs",
    },
  ];

  return (
    <section className="events-statistics">
      <div className="events-container">
        <div className="events-section-heading light">
          <span className="events-eyebrow">IMSEC BY THE NUMBERS</span>

          <h2>Our Events Impact</h2>

          <div className="events-heading-line" />
        </div>

        <div className="events-stats-grid">
          {items.map((item) => (
            <div className="event-stat-card" key={item.label}>
              <strong>{item.value}</strong>

              <span style={{ color: "black" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   CTA
========================================================= */

const CtaSection = ({ cta }) => {
  if (!cta) {
    return null;
  }

  return (
    <section className="events-cta">
      <div className="events-container events-cta-content">
        <span className="events-eyebrow">EXPERIENCE IMSEC</span>

        <h2>{cta.title || "Be a Part of the IMSEC Experience"}</h2>

        {cta.description && <p>{cta.description}</p>}

        {cta.buttonText && cta.buttonLink && (
          <a className="events-cta-button">{cta.buttonText}</a>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   MAIN EVENTS PAGE
========================================================= */

const Events = () => {
  const [data, setData] = useState(cloneData(DEFAULT_DATA));

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await eventService.fetchPublicEvents();

        if (!mounted) {
          return;
        }

        setData({
          ...cloneData(DEFAULT_DATA),

          ...result,

          hero: {
            ...DEFAULT_DATA.hero,
            ...(result?.hero || {}),
          },

          about: {
            ...DEFAULT_DATA.about,
            ...(result?.about || {}),
          },

          latestEvents: {
            ...DEFAULT_DATA.latestEvents,
            ...(result?.latestEvents || {}),
          },

          memorableEvents: {
            ...DEFAULT_DATA.memorableEvents,
            ...(result?.memorableEvents || {}),
          },

          signatureEvents: {
            ...DEFAULT_DATA.signatureEvents,
            ...(result?.signatureEvents || {}),
          },

          statistics: {
            ...DEFAULT_DATA.statistics,
            ...(result?.statistics || {}),
          },

          cta: {
            ...DEFAULT_DATA.cta,
            ...(result?.cta || {}),
          },
        });
      } catch (err) {
        console.error("PUBLIC EVENTS ERROR:", err);

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load events.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="events-page">
        <section className="events-hero">
          <div className="events-hero-glow events-hero-glow-one" />

          <div className="events-hero-glow events-hero-glow-two" />

          <div className="events-container events-hero-content">
            <div className="events-hero-badge">LIFE @ IMSEC</div>

            <h1>Events</h1>

            <div className="events-hero-line" />

            <p>Discover events, activities and memorable moments at IMSEC</p>

            <div className="events-breadcrumb">
              Home / Life @ IMSEC / Events
            </div>
          </div>
        </section>

        <div className="events-loading">
          <div className="events-loading-spinner" />

          <h3>Loading Events...</h3>

          <p>Please wait while we fetch the latest events.</p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <main className="events-page">
        <section className="events-hero">
          <div className="events-hero-glow events-hero-glow-one" />

          <div className="events-hero-glow events-hero-glow-two" />

          <div className="events-container events-hero-content">
            <div className="events-hero-badge">LIFE @ IMSEC</div>

            <h1>{data.hero?.title || "Events"}</h1>

            <div className="events-hero-line" />

            <p>{data.hero?.subtitle || "Explore events at IMSEC"}</p>

            <div className="events-breadcrumb">
              {data.hero?.breadcrumb || "Home / Life @ IMSEC / Events"}
            </div>
          </div>
        </section>

        <div className="events-error">
          <FaCalendarAlt />

          <h2>Events unavailable</h2>

          <p>{error}</p>

          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="events-page">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="events-hero">
        <div className="events-hero-glow events-hero-glow-one" />

        <div className="events-hero-glow events-hero-glow-two" />

        <div className="events-hero-circle events-hero-circle-one" />

        <div className="events-hero-circle events-hero-circle-two" />

        <div className="events-container events-hero-content">
          <div className="events-hero-badge">LIFE @ IMSEC</div>

          <h1>{data.hero?.title || "Events @ IMSEC"}</h1>

          <div className="events-hero-line" />

          <p>
            {data.hero?.subtitle ||
              "Explore the vibrant events, activities and celebrations at IMSEC"}
          </p>

          <div className="events-breadcrumb">
            {data.hero?.breadcrumb || "Home / Life @ IMSEC / Events"}
          </div>
        </div>
      </section>

      {/* ===================================================
          ABOUT
      =================================================== */}

      <AboutSection about={data.about} />

      {/* ===================================================
          FEATURED
      =================================================== */}

      <FeaturedEvent event={data.featuredEvent} />

      {/* ===================================================
          LATEST
      =================================================== */}

      <EventSection
        sectionKey="latest"
        title="Latest Events"
        subtitle="Stay updated with the latest activities and events at IMSEC."
        section={data.latestEvents}
      />

      {/* ===================================================
          MEMORABLE
      =================================================== */}

      <EventSection
        sectionKey="memorable"
        title="Memorable Events"
        subtitle="Relive some of the most memorable moments from IMSEC."
        section={data.memorableEvents}
      />

      {/* ===================================================
          SIGNATURE
      =================================================== */}

      <EventSection
        sectionKey="signature"
        title="Signature Events"
        subtitle="Our flagship events that define the vibrant IMSEC campus experience."
        section={data.signatureEvents}
      />

      {/* ===================================================
          STATISTICS
      =================================================== */}

      <StatisticsSection statistics={data.statistics} />

      {/* ===================================================
          CTA
      =================================================== */}

      <CtaSection cta={data.cta} />
    </main>
  );
};

export default Events;
