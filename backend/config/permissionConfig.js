const permissionConfig = {
  /* =========================================================
     GLOBAL MODULES
  ========================================================= */
  modules: [
    {
      key: "dashboard",
      label: "Dashboard",
      subModules: [],
    },

    /* ================= ADMISSIONS ================= */
    {
      key: "admissions",
      label: "Admissions",
      subModules: [
        {
          key: "overview",
          label: "Admissions Dashboard",
        },
        {
          key: "uptac-counselling",
          label: "UPTAC Counselling",
        },
        {
          key: "admissions-process",
          label: "Admissions Process",
        },
        {
          key: "fee-structure",
          label: "Fee Structure",
        },
        {
          key: "faq",
          label: "FAQ",
        },
        {
          key: "government-scholarship-policy",
          label: "Government Scholarship Policy",
        },
        {
          key: "payment-procedure",
          label: "Payment Procedure",
        },
        {
          key: "applications",
          label: "Applications",
        },
      ],
    },

    /* ================= IQAC ================= */
    {
      key: "iqac",
      label: "IQAC",
      subModules: [
        {
          key: "overview",
          label: "IQAC Dashboard",
        },
        {
          key: "naac",
          label: "NAAC",
        },
        {
          key: "nirf",
          label: "NIRF",
        },
        {
          key: "nba",
          label: "NBA",
        },
        {
          key: "iqac",
          label: "IQAC",
        },
        {
          key: "aqar",
          label: "AQAR",
        },
      ],
    },

    /* ================= ACCREDITATIONS ================= */
    {
      key: "accreditations",
      label: "Accreditations",
      subModules: [
        {
          key: "overview",
          label: "Accreditations Dashboard",
        },
        {
          key: "accreditations",
          label: "Accreditations",
        },
        {
          key: "recognition",
          label: "Awards / Ranking / Recognition",
        },
      ],
    },

    /* ================= COE ================= */
    {
      key: "coe",
      label: "Centre of Excellence",
      subModules: [
        {
          key: "overview",
          label: "COE Dashboard",
        },
        {
          key: "mous",
          label: "MOUs",
        },
        {
          key: "industry-academics-collaboration",
          label: "Industry Academics Collaboration",
        },
      ],
    },

    /* ================= STUDENT WELFARE ================= */
    {
      key: "student-welfare",
      label: "Student Welfare",
      subModules: [
        {
          key: "overview",
          label: "Student Welfare Dashboard",
        },
        {
          key: "student-handbook",
          label: "Student Handbook",
        },
        {
          key: "counselling-support",
          label: "Counselling Support",
        },
        {
          key: "medical-support",
          label: "Medical Support",
        },
        {
          key: "gym",
          label: "Gym",
        },
        {
          key: "sports",
          label: "Sports",
        },
      ],
    },

    /* ================= PLACEMENTS ================= */
    {
      key: "placements",
      label: "Placements",
      subModules: [
        {
          key: "overview",
          label: "Placement Dashboard",
        },
        {
          key: "tp-activities",
          label: "TP Activities",
        },
        {
          key: "shining-stars",
          label: "Shining Stars",
        },
        {
          key: "placement-notices",
          label: "Placement Notices",
        },
        {
          key: "major-recruiters",
          label: "Major Recruiters",
        },
        {
          key: "cdc-team",
          label: "CDC Team",
        },
        {
          key: "training-internship",
          label: "Training & Internship",
        },
        {
          key: "placement-record",
          label: "Placement Record",
        },
        {
          key: "cdc-structure",
          label: "CDC Structure",
        },
        {
          key: "placement-policy",
          label: "Placement Policy",
        },
      ],
    },

    /* ================= DEPARTMENTS ================= */
    {
      key: "departments",
      label: "Departments",
      subModules: [
        {
          key: "overview",
          label: "Department Management",
        },
        {
          key: "add",
          label: "Add Department",
        },
        {
          key: "edit",
          label: "Edit Department",
        },
        {
          key: "hod-message",
          label: "HOD Message",
        },
        {
          key: "overview-management",
          label: "Department Overview",
        },
        {
          key: "faculty",
          label: "Department Faculty",
        },
        {
          key: "research",
          label: "Department Research",
        },
        {
          key: "alumni",
          label: "Department Alumni",
        },
        {
          key: "placement",
          label: "Department Placement",
        },
        {
          key: "results",
          label: "Department Results",
        },
        {
          key: "achievements",
          label: "Department Achievements",
        },
        {
          key: "events",
          label: "Department Events",
        },
        {
          key: "infrastructure",
          label: "Department Infrastructure",
        },
        {
          key: "student-corner",
          label: "Student Corner",
        },
      ],
    },

    /* ================= RESEARCH ================= */
    {
      key: "research",
      label: "Research",
      subModules: [
        {
          key: "overview",
          label: "Research Management",
        },
        {
          key: "about",
          label: "Research About",
        },
        {
          key: "research-policy",
          label: "Research Policy",
        },
        {
          key: "journals",
          label: "Journals",
        },
        {
          key: "conference-papers",
          label: "Conference Papers",
        },
        {
          key: "books-chapters",
          label: "Books / Chapters",
        },
        {
          key: "patents",
          label: "Patents",
        },
        {
          key: "fdps",
          label: "FDPs",
        },
      ],
    },

    /* ================= GRIEVANCE ================= */
    {
      key: "grievance",
      label: "Grievance",
      subModules: [
        {
          key: "overview",
          label: "Grievance Dashboard",
        },
        {
          key: "student-grievance",
          label: "Student Grievance",
        },
        {
          key: "employee-grievance",
          label: "Employee Grievance",
        },
        {
          key: "internal-grievance-committee",
          label: "Internal Grievance Committee",
        },
      ],
    },

    /* ================= LIBRARY ================= */
    {
      key: "library",
      label: "Library",
      subModules: [
        {
          key: "overview",
          label: "Library Dashboard",
        },
        {
          key: "statistics",
          label: "Library Statistics",
        },
        {
          key: "gallery",
          label: "Library Gallery",
        },
        {
          key: "guidelines",
          label: "Library Guidelines",
        },
        {
          key: "timings",
          label: "Library Timings",
        },
        {
          key: "librarian",
          label: "Librarian Profile",
        },
      ],
    },

    /* ================= ACADEMICS ================= */
    {
      key: "academics",
      label: "Academics",
      subModules: [
        {
          key: "overview",
          label: "Academics Dashboard",
        },
        {
          key: "academic-development-program",
          label: "Academic Development Program",
        },
        {
          key: "learning-development-centre",
          label: "Learning Development Centre",
        },
        {
          key: "convocation",
          label: "Convocation",
        },
        {
          key: "student-handbook",
          label: "Student Handbook",
        },
        {
          key: "classroom-labs",
          label: "Classroom & Labs",
        },
        {
          key: "academic-coordinator",
          label: "Academic Coordinator",
        },
        {
          key: "activity-calendar",
          label: "Activity Calendar",
        },
        {
          key: "teaching-learning-process",
          label: "Teaching Learning Process",
        },
        {
          key: "rules",
          label: "Rules",
        },
        {
          key: "mou",
          label: "MOU",
        },
        {
          key: "circular-notice",
          label: "Circular Notice",
        },
        {
          key: "academic-calendar",
          label: "Academic Calendar",
        },
        {
          key: "courses",
          label: "Courses",
        },
      ],
    },

    /* ================= ALUMNI ================= */
    {
      key: "alumni",
      label: "Alumni",
      subModules: [
        {
          key: "overview",
          label: "Alumni Management",
        },
      ],
    },

    /* ================= ANNOUNCEMENT ================= */
    {
      key: "announcement",
      label: "Announcements",
      subModules: [
        {
          key: "management",
          label: "Announcement Management",
        },
      ],
    },

    /* ================= WEBSITE CONTENT ================= */
    {
      key: "website-content",
      label: "Website Content",
      subModules: [
        {
          key: "news-ticker",
          label: "News Ticker",
        },
        {
          key: "social-media",
          label: "Social Media",
        },
        {
          key: "careers",
          label: "Careers",
        },
        {
          key: "all-committees",
          label: "All Committees",
        },
        {
          key: "mandatory-disclosure",
          label: "Mandatory Disclosure",
        },
        {
          key: "homepage-popup",
          label: "Homepage Popup",
        },
        {
          key: "newsletter",
          label: "Newsletter",
        },
        {
          key: "contact-us",
          label: "Contact Us",
        },
      ],
    },

    /* ================= LIFE @ IMSEC ================= */
    {
      key: "life-imsec",
      label: "Life @ IMSEC",
      subModules: [
        {
          key: "overview",
          label: "Life @ IMSEC Dashboard",
        },
        {
          key: "hostel-mess",
          label: "Hostel & Mess",
        },
        {
          key: "auditorium",
          label: "Auditorium",
        },
        {
          key: "cafeteria",
          label: "Cafeteria",
        },
        {
          key: "language-communication-lab",
          label: "Language Communication Lab",
        },
        {
          key: "students-clubs",
          label: "Student Clubs",
        },
        {
          key: "events",
          label: "Events",
        },
      ],
    },

    /* ================= ABOUT IMSEC ================= */
    {
      key: "about-imsec",
      label: "About IMSEC",
      subModules: [
        {
          key: "overview",
          label: "About IMSEC",
        },
        {
          key: "executive-council",
          label: "Executive Council",
        },
        {
          key: "approvals-affiliations",
          label: "Approvals & Affiliations",
        },
        {
          key: "governing-council",
          label: "Governing Council",
        },
        {
          key: "director",
          label: "Director",
        },
        {
          key: "organizational-chart",
          label: "Organizational Chart",
        },
        {
          key: "chairman",
          label: "Chairman",
        },
        {
          key: "vision-mission",
          label: "Vision & Mission",
        },
        {
          key: "about-imsec-page",
          label: "About IMSEC Page",
        },
        {
          key: "ims-society",
          label: "IMS Society",
        },
        {
          key: "ims-group",
          label: "IMS Group",
        },
        {
          key: "campus",
          label: "Campus",
        },
      ],
    },

    /* ================= HOMEPAGE ================= */
    {
      key: "homepage",
      label: "Homepage",
      subModules: [
        {
          key: "overview",
          label: "Homepage Dashboard",
        },
        {
          key: "hero-slider",
          label: "Hero Slider",
        },
        {
          key: "approval",
          label: "Approval",
        },
        {
          key: "welcome-to-imsec",
          label: "Welcome to IMSEC",
        },
        {
          key: "academic-matrix",
          label: "Academic Matrix",
        },
        {
          key: "campus-highlights",
          label: "Campus Highlights",
        },
        {
          key: "university-rank-holder",
          label: "University Rank Holders",
        },
        {
          key: "alumni",
          label: "Homepage Alumni",
        },
        {
          key: "achievements",
          label: "Homepage Achievements",
        },
        {
          key: "placement-stats",
          label: "Placement Statistics",
        },
        {
          key: "placements",
          label: "Homepage Placements",
        },
      ],
    },
  ],

  /* =========================================================
     DEPARTMENT PERMISSION CONFIGURATION
  ========================================================= */

  departments: [
    /* ================= OVERVIEW ================= */
    {
      key: "overview",
      label: "Overview",
      subModules: [
        {
          key: "department-overview",
          label: "Department Overview",
          subModules: [],
        },
        {
          key: "hod-message",
          label: "HOD Message",
          subModules: [],
        },
      ],
    },

    /* ================= FACULTY ================= */
    {
      key: "faculty",
      label: "Faculty",
      subModules: [
        {
          key: "faculty-list",
          label: "Faculty List",
          subModules: [],
        },
        {
          key: "faculty-achievements",
          label: "Faculty Achievements",
          subModules: [],
        },
      ],
    },

    /* ================= ACHIEVEMENTS ================= */
    {
      key: "achievements",
      label: "Achievements",
      subModules: [
        {
          key: "department-achievements",
          label: "Department Achievements",
          subModules: [],
        },
        {
          key: "faculty-achievements",
          label: "Faculty Achievements",
          subModules: [],
        },
        {
          key: "college-branch-toppers",
          label: "College Branch Toppers",
          subModules: [],
        },
        {
          key: "student-global-achievements",
          label: "Student Global Achievements",
          subModules: [],
        },
        {
          key: "internship-details",
          label: "Internship Details",
          subModules: [],
        },
      ],
    },

    /* ================= PLACEMENT ================= */
    {
      key: "placement",
      label: "Placement",
      subModules: [
        {
          key: "placement-overview",
          label: "Placement Overview",
          subModules: [],
        },
        {
          key: "placement-statistics",
          label: "Placement Statistics",
          subModules: [],
        },
        {
          key: "placement-companies",
          label: "Placement Companies",
          subModules: [],
        },
      ],
    },

    /* ================= ACADEMIC RESULTS ================= */
    {
      key: "academic-results",
      label: "Academic Results",
      subModules: [
        {
          key: "academic-results",
          label: "Academic Results",
          subModules: [],
        },
        {
          key: "university-results",
          label: "University Results",
          subModules: [],
        },
      ],
    },

    /* ================= DEPARTMENT EVENTS ================= */
    {
      key: "department-events",
      label: "Department Events",
      subModules: [
        {
          key: "events",
          label: "Events",
          subModules: [],
        },
        {
          key: "event-gallery",
          label: "Event Gallery",
          subModules: [],
        },
      ],
    },

    /* ================= ALUMNI ================= */
    {
      key: "alumni",
      label: "Alumni",
      subModules: [
        {
          key: "alumni-chapters",
          label: "Alumni Chapters",
          subModules: [],
        },
        {
          key: "proud-alumni",
          label: "Proud Alumni",
          subModules: [],
        },
      ],
    },

    /* ================= RESEARCH ================= */
    {
      key: "research",
      label: "Research",
      subModules: [
        {
          key: "about",
          label: "About",
          subModules: [],
        },
        {
          key: "research-policy",
          label: "Research Policy",
          subModules: [],
        },
        {
          key: "journals",
          label: "Journals",
          subModules: [],
        },
        {
          key: "conference-papers",
          label: "Conference Papers",
          subModules: [],
        },
        {
          key: "books-chapters",
          label: "Books / Chapters",
          subModules: [],
        },
        {
          key: "patents",
          label: "Patents",
          subModules: [],
        },
        {
          key: "centres-of-excellence",
          label: "Centres of Excellence",
          subModules: [],
        },
        {
          key: "fdps",
          label: "FDPs",
          subModules: [],
        },
      ],
    },

    /* ================= INFRASTRUCTURE ================= */
    {
      key: "infrastructure",
      label: "Infrastructure",
      subModules: [
        {
          key: "infrastructure-overview",
          label: "Infrastructure Overview",
          subModules: [],
        },
        {
          key: "labs",
          label: "Labs",
          subModules: [],
        },
        {
          key: "library",
          label: "Library",
          subModules: [],
        },
      ],
    },

    /* ================= STUDENT CORNER ================= */
    {
      key: "student-corner",
      label: "Student Corner",
      subModules: [
        {
          key: "rules-regulations",
          label: "Rules & Regulations",
          subModules: [],
        },
        {
          key: "rule-book",
          label: "Rule Book",
          subModules: [],
        },
      ],
    },
  ],
};

export default permissionConfig;
