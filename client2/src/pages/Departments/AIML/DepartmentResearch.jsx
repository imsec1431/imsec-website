import React, { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaFileAlt,
  FaBook,
  FaCertificate,
  FaChalkboardTeacher,
  FaGavel,
  FaFlask,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import departmentResearchPublicService from "../../../services/departmentResearchPublicService";

import "../CSS/DepartmentResearch.css";

const DEPARTMENT_SLUG = "computer-science-and-engineering-ai-and-ml";

// =========================================================
// PUBLIC PAGINATION
// =========================================================

const ITEMS_PER_PAGE = 10;

// =========================================================
// PAGINATION COMPONENT
// =========================================================

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="department-research-pagination-wrapper">
      <div className="department-research-pagination">
        {/* PREVIOUS */}

        <button
          type="button"
          className="department-research-page-arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {/* PAGE NUMBERS */}

        <div className="department-research-page-numbers">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className={`department-research-page-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* NEXT */}

        <button
          type="button"
          className="department-research-page-arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* PAGINATION INFORMATION */}

      <div className="department-research-pagination-info">
        Showing <strong>{startItem}</strong>
        {" - "}
        <strong>{endItem}</strong>
        {" of "}
        <strong>{totalItems}</strong>
      </div>
    </div>
  );
};

// =========================================================
// RESEARCH LIST
// =========================================================

const ResearchList = ({
  items,
  icon,
  title,
  emptyText,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // =======================================================
  // SAFETY: RESET PAGE IF DATA CHANGES
  // =======================================================

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  // =======================================================
  // EMPTY
  // =======================================================

  if (!items || items.length === 0) {
    return (
      <section className="department-research-list-section">
        <div className="department-research-section-heading">
          <div className="department-research-section-icon">{icon}</div>

          <div>
            <span>RESEARCH</span>

            <h2>{title}</h2>
          </div>
        </div>

        <div className="department-research-empty">
          {icon}

          <h3>{emptyText}</h3>

          <p>Research information for this section will be updated soon.</p>
        </div>
      </section>
    );
  }

  // =======================================================
  // LIST
  // =======================================================

  return (
    <section className="department-research-list-section">
      {/* SECTION HEADING */}

      <div className="department-research-section-heading">
        <div className="department-research-section-icon">{icon}</div>

        <div>
          <span>RESEARCH</span>

          <h2>{title}</h2>

          <p>
            Showing {items.length} total records. Maximum 10 records are
            displayed per page.
          </p>
        </div>
      </div>

      {/* =================================================
          RESEARCH ITEMS
      ================================================= */}

      <div className="department-research-list">
        {visibleItems.map((item, index) => {
          const itemTitle =
            item.title ||
            item.name ||
            item.paperTitle ||
            item.publicationTitle ||
            item.bookTitle ||
            item.patentTitle ||
            item.programTitle ||
            `Research Record ${startIndex + index + 1}`;

          const authors =
            item.authors ||
            item.author ||
            item.faculty ||
            item.inventors ||
            item.participants;

          const journal = item.journal || item.journalName || item.publisher;

          const year = item.year || item.publicationYear || item.date;

          const description =
            item.description || item.abstract || item.details || item.content;

          return (
            <article
              className="department-research-item"
              key={item._id || `${title}-${index}`}
            >
              {/* ICON */}

              <div className="department-research-item-icon">{icon}</div>

              {/* CONTENT */}

              <div className="department-research-item-content">
                <h3>{itemTitle}</h3>

                {authors && (
                  <div className="department-research-meta">
                    <strong>Author:</strong>

                    <span>
                      {Array.isArray(authors) ? authors.join(", ") : authors}
                    </span>
                  </div>
                )}

                {journal && (
                  <div className="department-research-meta">
                    <strong>Publication:</strong>

                    <span>{journal}</span>
                  </div>
                )}

                {year && (
                  <div className="department-research-meta">
                    <strong>Year:</strong>

                    <span>{year}</span>
                  </div>
                )}

                {description && (
                  <p className="department-research-description">
                    {description}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={items.length}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const DepartmentResearch = () => {
  const [department, setDepartment] = useState(null);

  const [research, setResearch] = useState({
    about: null,
    policy: null,
    journals: [],
    conferencePapers: [],
    books: [],
    patents: [],
    fdps: [],
  });

  // =======================================================
  // PAGINATION STATES
  // =======================================================

  const [journalPage, setJournalPage] = useState(1);

  const [conferencePage, setConferencePage] = useState(1);

  const [bookPage, setBookPage] = useState(1);

  const [patentPage, setPatentPage] = useState(1);

  const [fdpPage, setFdpPage] = useState(1);

  // =======================================================
  // LOADING / ERROR
  // =======================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =======================================================
  // LOAD RESEARCH
  // =======================================================

  useEffect(() => {
    const loadResearch = async () => {
      try {
        setLoading(true);

        setError("");

        // -------------------------------------------------
        // GET DEPARTMENT
        // -------------------------------------------------

        const departmentResponse =
          await departmentResearchPublicService.getDepartmentBySlug(
            DEPARTMENT_SLUG,
          );

        if (!departmentResponse?.success || !departmentResponse?.data) {
          throw new Error("Department information not found.");
        }

        const departmentData = departmentResponse.data;

        setDepartment(departmentData);

        // -------------------------------------------------
        // GET ALL RESEARCH
        // -------------------------------------------------

        const researchResponse =
          await departmentResearchPublicService.getAllDepartmentResearch(
            departmentData._id,
          );

        setResearch({
          about: researchResponse?.about?.data || null,

          policy: researchResponse?.policy?.data || null,

          journals: Array.isArray(researchResponse?.journals?.data)
            ? researchResponse.journals.data
            : [],

          conferencePapers: Array.isArray(
            researchResponse?.conferencePapers?.data,
          )
            ? researchResponse.conferencePapers.data
            : [],

          books: Array.isArray(researchResponse?.books?.data)
            ? researchResponse.books.data
            : [],

          patents: Array.isArray(researchResponse?.patents?.data)
            ? researchResponse.patents.data
            : [],

          fdps: Array.isArray(researchResponse?.fdps?.data)
            ? researchResponse.fdps.data
            : [],
        });
      } catch (err) {
        console.error("Department Research Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load department research.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResearch();
  }, []);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="department-research-public">
        <div className="department-research-loading">
          <div className="department-research-spinner" />

          <h3>Loading Research...</h3>

          <p>Please wait while we load department research information.</p>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error) {
    return (
      <div className="department-research-public">
        <div className="department-research-error">
          <FaFlask />

          <h2>Research Information</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // =======================================================
  // MAIN
  // =======================================================

  return (
    <div className="department-research-public">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="department-research-hero">
        <div className="department-research-hero-overlay" />

        <div className="department-research-container">
          <div className="department-research-hero-content">
            <span>
              {department?.shortName || department?.code || "MCA"} DEPARTMENT
            </span>

            <h1>Research</h1>

            <p>
              Explore the research activities, publications, innovations and
              academic contributions of our department.
            </p>

            <div className="department-research-hero-line" />
          </div>
        </div>
      </section>

      {/* =================================================
          INTRO
      ================================================= */}

      <section className="department-research-intro">
        <div className="department-research-container">
          <div className="department-research-intro-content">
            <span>RESEARCH &amp; INNOVATION</span>

            <h2>
              {department?.name || "Master of Computer Applications"} Research
            </h2>

            <p>
              Our department promotes research, innovation and knowledge
              creation through publications, conferences, books, patents,
              faculty development programmes and collaborative academic
              activities.
            </p>
          </div>

          <div className="department-research-intro-icon">
            <FaFlask />
          </div>
        </div>
      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="department-research-statistics">
        <div className="department-research-container">
          {/* IMPORTANT:
              Five cards are inside this grid.
              CSS controls the horizontal layout.
          */}

          <div className="department-research-stat-grid">
            {/* JOURNALS */}

            <div className="department-research-stat-card">
              <FaBookOpen />

              <strong>{research.journals.length}</strong>

              <span>Journals</span>
            </div>

            {/* CONFERENCE PAPERS */}

            <div className="department-research-stat-card">
              <FaFileAlt />

              <strong>{research.conferencePapers.length}</strong>

              <span>Conference Papers</span>
            </div>

            {/* BOOKS */}

            <div className="department-research-stat-card">
              <FaBook />

              <strong>{research.books.length}</strong>

              <span>Books</span>
            </div>

            {/* PATENTS */}

            <div className="department-research-stat-card">
              <FaCertificate />

              <strong>{research.patents.length}</strong>

              <span>Patents</span>
            </div>

            {/* FDPS */}

            <div className="department-research-stat-card">
              <FaChalkboardTeacher />

              <strong>{research.fdps.length}</strong>

              <span>FDPs</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ABOUT
      ================================================= */}

      {research.about && (
        <section className="department-research-about">
          <div className="department-research-container">
            <div className="department-research-content-card">
              <span>ABOUT RESEARCH</span>

              <h2>Research Overview</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    research.about.content ||
                    research.about.description ||
                    research.about.about ||
                    "",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          POLICY
      ================================================= */}

      {research.policy && (
        <section className="department-research-policy">
          <div className="department-research-container">
            <div className="department-research-content-card">
              <div className="department-research-policy-icon">
                <FaGavel />
              </div>

              <span>RESEARCH POLICY</span>

              <h2>Research Policy</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    research.policy.content ||
                    research.policy.description ||
                    research.policy.policy ||
                    "",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          JOURNALS
      ================================================= */}

      <ResearchList
        title="Research Journals"
        icon={<FaBookOpen />}
        items={research.journals}
        emptyText="No journal publications available."
        currentPage={journalPage}
        setCurrentPage={setJournalPage}
      />

      {/* =================================================
          CONFERENCE PAPERS
      ================================================= */}

      <ResearchList
        title="Conference Papers"
        icon={<FaFileAlt />}
        items={research.conferencePapers}
        emptyText="No conference papers available."
        currentPage={conferencePage}
        setCurrentPage={setConferencePage}
      />

      {/* =================================================
          BOOKS
      ================================================= */}

      <ResearchList
        title="Books & Chapters"
        icon={<FaBook />}
        items={research.books}
        emptyText="No books or chapters available."
        currentPage={bookPage}
        setCurrentPage={setBookPage}
      />

      {/* =================================================
          PATENTS
      ================================================= */}

      <ResearchList
        title="Patents"
        icon={<FaCertificate />}
        items={research.patents}
        emptyText="No patents available."
        currentPage={patentPage}
        setCurrentPage={setPatentPage}
      />

      {/* =================================================
          FDPS
      ================================================= */}

      <ResearchList
        title="Faculty Development Programmes"
        icon={<FaChalkboardTeacher />}
        items={research.fdps}
        emptyText="No FDP records available."
        currentPage={fdpPage}
        setCurrentPage={setFdpPage}
      />

      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <section className="department-research-cta">
        <div className="department-research-container">
          <div className="department-research-cta-content">
            <span>RESEARCH • INNOVATION • KNOWLEDGE</span>

            <h2>Advancing Knowledge Through Research</h2>

            <p>
              Our department continues to encourage research, innovation and
              meaningful academic contributions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentResearch;
