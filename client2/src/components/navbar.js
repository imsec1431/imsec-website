import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import { getPublicDepartments } from "../services/departmentService";
import imseclogo from "./imsec-logo.png";

import "./navbar.css";

const NavigationBar = () => {
  const location = useLocation();

  const [departments, setDepartments] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);

  const [expanded, setExpanded] = useState(false);
  const [mainNavExpanded, setMainNavExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navWrapperRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // =========================================================
  // ACTIVE MAIN NAVIGATION ITEM
  // =========================================================

  const isPathActive = (paths = []) => {
    const currentPath = location.pathname.toLowerCase();

    return paths.some((path) => {
      const normalizedPath = path.toLowerCase();

      if (normalizedPath === "/") {
        return currentPath === "/";
      }

      return (
        currentPath === normalizedPath ||
        currentPath.startsWith(`${normalizedPath}/`)
      );
    });
  };

  const isAboutActive = isPathActive(["/about"]);
  const isAdmissionsActive = isPathActive(["/admission", "/admissions"]);
  const isAcademicsActive = isPathActive(["/academics"]);
  const isDepartmentsActive = departments.some(
    (department) =>
      department.publicPath && isPathActive([department.publicPath]),
  );
  const isResearchActive = isPathActive(["/research"]);
  const isIqacActive = isPathActive(["/iqac"]);
  const isPlacementsActive = isPathActive(["/placements"]);
  const isLibraryActive = isPathActive(["/library"]);
  const isCoeActive = isPathActive(["/coe"]);
  const isStudentWelfareActive = isPathActive([
    "/student-welfare",
    "/all-committees",
  ]);
  const isLifeImsecActive = isPathActive(["/life@imsec"]);

  // =========================================================
  // FETCH DEPARTMENTS
  // =========================================================

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getPublicDepartments();

        setDepartments(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // =========================================================
  // FETCH SOCIAL MEDIA
  // =========================================================

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/social-media`);

        setSocialMedia(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch social media links:", error);

        setSocialMedia([]);
      }
    };

    fetchSocialMedia();
  }, [API_BASE_URL]);

  // =========================================================
  // NAVBAR HEIGHT
  // =========================================================

  useEffect(() => {
    const element = navWrapperRef.current;

    if (!element) return;

    const updateHeight = () => {
      setNavHeight(element.offsetHeight);
    };

    updateHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateHeight)
        : null;

    if (resizeObserver) {
      resizeObserver.observe(element);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener("resize", updateHeight);
    };
  }, [expanded, departments, socialMedia]);

  // =========================================================
  // NAV CLICK
  // =========================================================

  const handleNavClick = () => {
    // Close both desktop/mobile navigation states.
    setExpanded(false);
    setMainNavExpanded(false);
    setActiveDropdown(null);
  };

  // =========================================================
  // SOCIAL ICON
  // =========================================================

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "facebook":
        return <FaFacebookF />;

      case "instagram":
        return <FaInstagram />;

      case "linkedin":
        return <FaLinkedinIn />;

      case "x":
        return <FaXTwitter />;

      case "youtube":
        return <FaYoutube />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="main-navbar-fixed" ref={navWrapperRef}>
        {/* =====================================================
            TOP HEADER
        ===================================================== */}

        <Navbar
          expand="lg"
          expanded={expanded}
          onToggle={setExpanded}
          className="imsec-top-navbar"
        >
          <Container className="imsec-top-container">
            {/* =================================================
                LOGO
            ================================================= */}

            <Link to="/" className="imsec-logo-link" onClick={handleNavClick}>
              <img src={imseclogo} alt="IMSEC" className="logo-img" />
            </Link>

            {/* =================================================
                DESKTOP RIGHT AREA
            ================================================= */}

            <div className="desktop-top-right d-none d-lg-flex">
              {/* =================================================
                  TOP LINKS
              ================================================= */}

              <div className="top-links">
                <Nav.Link
                  as={Link}
                  to="/Announcements"
                  onClick={handleNavClick}
                >
                  ANNOUNCEMENTS
                </Nav.Link>

                <a
                  href="https://erp.imsec.ac.in/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  ERP
                </a>

                <Nav.Link as={Link} to="/Alumni" onClick={handleNavClick}>
                  ALUMNI
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/imsec-newsletters"
                  onClick={handleNavClick}
                >
                  NEWSLETTER
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/about/ContactUs"
                  onClick={handleNavClick}
                >
                  CONTACT US
                </Nav.Link>
              </div>

              {/* =================================================
                  SOCIAL ICONS
              ================================================= */}

              <div className="social-icons">
                {socialMedia.map((item) => {
                  const icon = getSocialIcon(item.platform);

                  if (!icon || !item.url) {
                    return null;
                  }

                  return (
                    <SocialIcon
                      key={item._id}
                      href={item.url}
                      icon={icon}
                      platform={item.platform}
                    />
                  );
                })}
              </div>
            </div>
          </Container>
        </Navbar>

        {/* =====================================================
            MAIN NAVIGATION
        ===================================================== */}

        <Navbar
          expand="lg"
          expanded={mainNavExpanded}
          onToggle={setMainNavExpanded}
          className="navbar-dark-blue"
          variant="dark"
        >
          <Container fluid className="main-nav-fluid">
            <Container className="main-nav-container">
              {/* =================================================
                  MOBILE TOGGLE
              ================================================= */}

              <Navbar.Toggle aria-controls="basic-navbar-nav" />

              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="main-navigation">
                  {/* =================================================
                      HOME
                  ================================================= */}

                  <Nav.Link
                    as={Link}
                    to="/"
                    className={isPathActive(["/"]) ? "active" : ""}
                    onMouseEnter={() => setActiveDropdown(null)}
                    onClick={handleNavClick}
                  >
                    Home
                  </Nav.Link>

                  {/* =================================================
                      ABOUT
                  ================================================= */}

                  <NavDropdown
                    title="About"
                    id="about-nav-dropdown"
                    className={isAboutActive ? "active" : ""}
                    show={activeDropdown === "about"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992) setActiveDropdown("about");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "about" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/about/IMSSociety"
                      onClick={handleNavClick}
                    >
                      About IMS Society
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/ims-group"
                      onClick={handleNavClick}
                    >
                      IMS Group of Institutions
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/aboutimsec"
                      onClick={handleNavClick}
                    >
                      About IMSEC
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/vision-mission"
                      onClick={handleNavClick}
                    >
                      Vision & Mission
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/ChairmansMessage"
                      onClick={handleNavClick}
                    >
                      Chairman's Message
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/DirectorsMessage"
                      onClick={handleNavClick}
                    >
                      Director's Message
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/ExecutiveCouncil"
                      onClick={handleNavClick}
                    >
                      Executive Council
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/GoverningBody"
                      onClick={handleNavClick}
                    >
                      Governing Body
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/OrganizationalChart"
                      onClick={handleNavClick}
                    >
                      Organizational Chart
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/Approvals"
                      onClick={handleNavClick}
                    >
                      Approvals
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/Campus"
                      onClick={handleNavClick}
                    >
                      Campus
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/ContactUs"
                      onClick={handleNavClick}
                    >
                      Contact Us
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/about/Location"
                      onClick={handleNavClick}
                    >
                      Location
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      ADMISSIONS
                  ================================================= */}

                  <NavDropdown
                    title="Admissions"
                    id="admissions-nav-dropdown"
                    className={isAdmissionsActive ? "active" : ""}
                    show={activeDropdown === "Admissions"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Admissions");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Admissions" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Admission/UPTACCounselling"
                      onClick={handleNavClick}
                    >
                      UPTAC Counselling Current Session
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/AdmissionsProcess"
                      onClick={handleNavClick}
                    >
                      Admissions Process
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/ApplyforAdmission"
                      onClick={handleNavClick}
                    >
                      Apply for Admission
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/FeeStructure"
                      onClick={handleNavClick}
                    >
                      Fee Structure
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/PaymentProcedure"
                      onClick={handleNavClick}
                    >
                      Payment Procedure
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/GovernmentScholarshipPolicy"
                      onClick={handleNavClick}
                    >
                      Goverment Scholarship Policies
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Admissions/FAQ"
                      onClick={handleNavClick}
                    >
                      Frequently Asked Questions (FAQ)
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      ACADEMICS
                  ================================================= */}

                  <NavDropdown
                    title="Academics"
                    id="academics-nav-dropdown"
                    className={isAcademicsActive ? "active" : ""}
                    show={activeDropdown === "Academics"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Academics");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Academics" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/AcademicCoordinators"
                      onClick={handleNavClick}
                    >
                      Academic Coordinators
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/AcademicCalendar"
                      onClick={handleNavClick}
                    >
                      Academic Calendar
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/activity-calendar"
                      onClick={handleNavClick}
                    >
                      Activity Calendar
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/courses"
                      onClick={handleNavClick}
                    >
                      Courses
                    </NavDropdown.Item>{" "}
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/teaching-learning-process"
                      onClick={handleNavClick}
                    >
                      Teaching Learning Process
                    </NavDropdown.Item>{" "}
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/learning-development-centre"
                      onClick={handleNavClick}
                    >
                      Learning & Development Centre (LDC)
                    </NavDropdown.Item>{" "}
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/AcademicDevelopmentProgram"
                      onClick={handleNavClick}
                    >
                      Academic Development Program
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/ClassroomLabs"
                      onClick={handleNavClick}
                    >
                      Classroom & Labs
                    </NavDropdown.Item>{" "}
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/RulesRegulations"
                      onClick={handleNavClick}
                    >
                      Rules and Regulations
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/circular-notices"
                      onClick={handleNavClick}
                    >
                      Circulars & Notices
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/convocation"
                      onClick={handleNavClick}
                    >
                      Convocation
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/student-handbook"
                      onClick={handleNavClick}
                    >
                      Student Handbook
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      DEPARTMENTS
                  ================================================= */}

                  <NavDropdown
                    title="Departments"
                    id="departments-nav-dropdown"
                    className={isDepartmentsActive ? "active" : ""}
                    show={activeDropdown === "Departments"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Departments");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Departments" : null);
                    }}
                    menuVariant="light"
                  >
                    {departments.length > 0 ? (
                      departments.map((department) => (
                        <NavDropdown.Item
                          as={Link}
                          to={department.publicPath}
                          key={department._id}
                          onClick={handleNavClick}
                        >
                          {department.name}
                        </NavDropdown.Item>
                      ))
                    ) : (
                      <NavDropdown.Item disabled>
                        Loading Departments...
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>

                  {/* =================================================
                      RESEARCH
                  ================================================= */}

                  <NavDropdown
                    title="Research"
                    id="research-nav-dropdown"
                    className={isResearchActive ? "active" : ""}
                    show={activeDropdown === "Research"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Research");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Research" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Research/About"
                      onClick={handleNavClick}
                    >
                      About
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/ResearchPolicy"
                      onClick={handleNavClick}
                    >
                      Research Policy
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/ResearchPublications"
                      onClick={handleNavClick}
                    >
                      Journals
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/ConferencePublications"
                      onClick={handleNavClick}
                    >
                      Conference Papers
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/BooksBookChapters"
                      onClick={handleNavClick}
                    >
                      Book/Chapter Publications
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/Patents"
                      onClick={handleNavClick}
                    >
                      Patents
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Research/FacultyDevelopmentPrograms"
                      onClick={handleNavClick}
                    >
                      FDPs
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      IQAC
                  ================================================= */}

                  <NavDropdown
                    title="IQAC"
                    id="iqac-nav-dropdown"
                    className={isIqacActive ? "active" : ""}
                    show={activeDropdown === "IQAC"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992) setActiveDropdown("IQAC");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "IQAC" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/iqac/iqac"
                      onClick={handleNavClick}
                    >
                      IQAC
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/iqac/aqar"
                      onClick={handleNavClick}
                    >
                      AQAR
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/iqac/nirf"
                      onClick={handleNavClick}
                    >
                      NIRF
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/iqac/nba"
                      onClick={handleNavClick}
                    >
                      NBA
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/iqac/naac"
                      onClick={handleNavClick}
                    >
                      NAAC
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      PLACEMENTS
                  ================================================= */}

                  <NavDropdown
                    title="Placements"
                    id="placements-nav-dropdown"
                    className={isPlacementsActive ? "active" : ""}
                    show={activeDropdown === "Placements"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Placements");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Placements" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/CDCTeam"
                      onClick={handleNavClick}
                    >
                      CDC Team
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/placements/training-internship"
                      onClick={handleNavClick}
                    >
                      TID Team
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/cdc-structure"
                      onClick={handleNavClick}
                    >
                      CDC Structure
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/PlacementsRecords"
                      onClick={handleNavClick}
                    >
                      Placements Records
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/shining-stars"
                      onClick={handleNavClick}
                    >
                      Shining Stars
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/OurRecruiters"
                      onClick={handleNavClick}
                    >
                      Major Recruiters
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/PlacementPolicy"
                      onClick={handleNavClick}
                    >
                      Placement Policy
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/placement-notices"
                      onClick={handleNavClick}
                    >
                      Placement Notice
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Placements/T&PActivities"
                      onClick={handleNavClick}
                    >
                      T&P Activities
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      LIBRARY
                  ================================================= */}

                  <Nav.Link
                    as={Link}
                    to="/Library"
                    className={isPathActive(["/Library"]) ? "active" : ""}
                    onMouseEnter={() => setActiveDropdown(null)}
                    onClick={handleNavClick}
                  >
                    Library
                  </Nav.Link>

                  {/* =================================================
                      COE
                  ================================================= */}

                  <NavDropdown
                    title="COE"
                    id="coe-nav-dropdown"
                    className={isCoeActive ? "active" : ""}
                    show={activeDropdown === "COE"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992) setActiveDropdown("COE");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "COE" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/coe/industry-academics-collaboration"
                      onClick={handleNavClick}
                    >
                      Industry Academics Collabration
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/coe/MOUs"
                      onClick={handleNavClick}
                    >
                      MOUs
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      STUDENT WELFARE
                  ================================================= */}

                  <NavDropdown
                    title="Student Welfare"
                    id="student-welfare-nav-dropdown"
                    className={isStudentWelfareActive ? "active" : ""}
                    show={activeDropdown === "Student Welfare"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Student Welfare");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Student Welfare" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Academics/student-handbook"
                      onClick={handleNavClick}
                    >
                      Student Handbook
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/students-clubs"
                      onClick={handleNavClick}
                    >
                      Student clubs
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/student-welfare/counselling-support"
                      onClick={handleNavClick}
                    >
                      Counselling Support
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/student-welfare/medical-support"
                      onClick={handleNavClick}
                    >
                      Medical Support
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/student-welfare/gym"
                      onClick={handleNavClick}
                    >
                      Gym Facilities
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/student-welfare/sports"
                      onClick={handleNavClick}
                    >
                      Sports Facilities
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/all-committees"
                      onClick={handleNavClick}
                    >
                      All Committees
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* =================================================
                      LIFE @ IMSEC
                  ================================================= */}

                  <NavDropdown
                    title="Life@IMSEC"
                    id="life-imsec-nav-dropdown"
                    className={isLifeImsecActive ? "active" : ""}
                    show={activeDropdown === "Life@IMSEC"}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 992)
                        setActiveDropdown("Life@IMSEC");
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 992) setActiveDropdown(null);
                    }}
                    onToggle={(isOpen) => {
                      setActiveDropdown(isOpen ? "Life@IMSEC" : null);
                    }}
                    menuVariant="light"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/Events"
                      onClick={handleNavClick}
                    >
                      Events
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/students-clubs"
                      onClick={handleNavClick}
                    >
                      Students Clubs
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/Auditorium"
                      onClick={handleNavClick}
                    >
                      Auditorium
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/language-communication-lab"
                      onClick={handleNavClick}
                    >
                      Language & Communication Lab
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/HostelMess"
                      onClick={handleNavClick}
                    >
                      Hostel & Mess
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/Life@IMSEC/cafeteria"
                      onClick={handleNavClick}
                    >
                      Cafeteria
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Container>
        </Navbar>
      </div>

      {/* =========================================================
          NAVBAR SPACER
      ========================================================= */}

      <div
        style={{
          height: navHeight,
        }}
        aria-hidden="true"
      />
    </>
  );
};

// =============================================================
// SOCIAL ICON COMPONENT
// =============================================================

const SocialIcon = ({ href, icon, platform }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="social-icon"
      aria-label={platform || "Social media"}
    >
      {icon}
    </a>
  );
};

export default NavigationBar;
