import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import {
  FaBed,
  FaWifi,
  FaShieldAlt,
  FaUtensils,
  FaUsers,
  FaTint,
  FaTv,
  FaLaptopHouse,
  FaBolt,
  FaWater,
  FaTshirt,
  FaFirstAid,
  FaLeaf,
  FaClock,
} from "react-icons/fa";

import "./HostelMess.css";

import { getHostelMess } from "../../services/hostelMessService";

/* =========================================================
   DEFAULT DATA
   Used only while API data is unavailable.
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Hostel & Mess",
    breadcrumb: "Home / Life @ IMSEC / Hostel & Mess",
  },

  about: {
    tag: "LIFE @ IMSEC",
    title: "Comfortable",
    highlight: "Hostel Living",

    description1:
      "IMS Engineering College provides separate hostel facilities for boys and girls with modern infrastructure, comfortable rooms, high-speed Wi-Fi, recreation facilities, hygienic dining and 24×7 security.",

    description2:
      "Our hostels create a safe, healthy and student-friendly environment that supports academic excellence as well as personal development.",

    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    },
  },

  boysHostels: [
    {
      name: "Boys Hostel - A Block",

      image: {
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
      },

      capacity: "300 Students",

      description:
        "Well-furnished hostel with spacious rooms, Wi-Fi connectivity, reading rooms, indoor games and 24×7 security.",

      facilities: [
        "High-Speed Wi-Fi",
        "RO Drinking Water",
        "Laundry Service",
        "24×7 Security",
      ],
    },

    {
      name: "Boys Hostel - B Block",

      image: {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      },

      capacity: "250 Students",

      description:
        "Comfortable accommodation with modern amenities and dedicated wardens for student support.",

      facilities: [
        "Power Backup",
        "Indoor Games",
        "Medical Facility",
        "Common Room",
      ],
    },
  ],

  girlsHostels: [
    {
      name: "Girls Hostel",

      image: {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      },

      capacity: "350 Students",

      description:
        "Secure hostel with biometric access, CCTV surveillance, recreation area and hygienic dining facility.",

      facilities: ["CCTV", "Wi-Fi", "Lady Wardens"],
    },
  ],

  mess: {
    tag: "MESS & DINING",
    title: "Healthy &",
    highlight: "Hygienic Food",

    description:
      "The college mess serves fresh, nutritious and hygienically prepared meals under the supervision of experienced staff.",

    image: {
      url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    },

    items: [
      {
        icon: "utensils",
        title: "Nutritious Meals",
        description: "Fresh and balanced meals are served to students.",
      },
      {
        icon: "water",
        title: "RO Drinking Water",
        description: "Safe and purified drinking water is available.",
      },
      {
        icon: "dining",
        title: "Spacious Dining Hall",
        description:
          "Students can enjoy their meals in a clean dining environment.",
      },
      {
        icon: "hygiene",
        title: "Clean & Hygienic Kitchen",
        description: "The kitchen is maintained with proper hygiene standards.",
      },
    ],
  },

  facilities: [
    {
      icon: "wifi",
      title: "High-Speed Wi-Fi",
      description: "Internet connectivity for academic and personal use.",
    },
    {
      icon: "bed",
      title: "Furnished Rooms",
      description: "Comfortable rooms with essential furniture.",
    },
    {
      icon: "security",
      title: "24×7 Security",
      description:
        "Secure residential environment with round-the-clock security.",
    },
    {
      icon: "water",
      title: "RO Drinking Water",
      description: "Clean and safe drinking water facilities.",
    },
    {
      icon: "tv",
      title: "Common Room",
      description: "Recreation and relaxation space for hostel residents.",
    },
    {
      icon: "food",
      title: "Dining Hall",
      description: "Comfortable dining facility for hostel residents.",
    },
    {
      icon: "users",
      title: "Indoor Games",
      description: "Recreation facilities for students.",
    },
    {
      icon: "study",
      title: "Study Room",
      description: "Dedicated space for academic preparation.",
    },
  ],

  gallery: [
    {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    },
  ],

  weeklyMenu: [
    {
      day: "Monday",
      breakfast: "Poha + Tea",
      lunch: "Rice, Dal, Roti, Paneer",
      snacks: "Tea & Biscuits",
      dinner: "Chapati, Mix Veg",
    },
    {
      day: "Tuesday",
      breakfast: "Sandwich + Milk",
      lunch: "Rajma Rice",
      snacks: "Samosa & Tea",
      dinner: "Chapati, Dal Fry",
    },
    {
      day: "Wednesday",
      breakfast: "Paratha + Curd",
      lunch: "Rice, Dal, Seasonal Veg",
      snacks: "Tea & Biscuits",
      dinner: "Chapati, Kadai Paneer",
    },
    {
      day: "Thursday",
      breakfast: "Idli Sambhar",
      lunch: "Rice, Chole",
      snacks: "Pakora & Tea",
      dinner: "Veg Biryani",
    },
    {
      day: "Friday",
      breakfast: "Upma + Tea",
      lunch: "Dal, Rice, Roti",
      snacks: "Tea & Biscuits",
      dinner: "Shahi Paneer",
    },
  ],

  rules: [
    "Students must carry Hostel Identity Card.",
    "Maintain cleanliness inside hostel rooms.",
    "Ragging is strictly prohibited.",
    "Visitors are allowed only during permitted hours.",
    "Silence must be maintained during study hours.",
    "Damage to hostel property will be chargeable.",
  ],

  statistics: [
    {
      value: "1000+",
      label: "Hostel Capacity",
      icon: "users",
    },
    {
      value: "2",
      label: "Separate Hostels",
      icon: "building",
    },
    {
      value: "24×7",
      label: "Security",
      icon: "security",
    },
    {
      value: "4",
      label: "Meals Daily",
      icon: "food",
    },
  ],

  faqs: [
    {
      question: "Are hostel rooms furnished?",
      answer:
        "Yes, rooms are furnished with beds, study tables, chairs, wardrobes and other essential facilities.",
    },
    {
      question: "Is Wi-Fi available in the hostel?",
      answer:
        "Yes, high-speed Wi-Fi connectivity is available throughout the hostel premises.",
    },
    {
      question: "Are separate hostels available for boys and girls?",
      answer:
        "Yes, the institute provides separate hostels with dedicated wardens and 24×7 security.",
    },
  ],

  cta: {
    title: "Experience Comfortable Hostel Life",

    description:
      "Enjoy a safe, secure and comfortable living environment with modern facilities and nutritious meals at IMS Engineering College.",
  },
};

/* =========================================================
   NORMALIZE API DATA
========================================================= */

const normalizeData = (apiData = {}) => {
  const normalized = {
    ...DEFAULT_DATA,
    ...apiData,

    hero: {
      ...DEFAULT_DATA.hero,
      ...(apiData.hero || {}),
    },

    about: {
      ...DEFAULT_DATA.about,
      ...(apiData.about || {}),
    },

    mess: {
      ...DEFAULT_DATA.mess,
      ...(apiData.mess || {}),
    },

    cta: {
      ...DEFAULT_DATA.cta,
      ...(apiData.cta || {}),
    },
  };

  /* -------------------------------------------------------
     About image
  ------------------------------------------------------- */

  if (!normalized.about.image || !normalized.about.image.url) {
    normalized.about.image = DEFAULT_DATA.about.image;
  }

  /* -------------------------------------------------------
     Boys Hostels
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.boysHostels)) {
    normalized.boysHostels = DEFAULT_DATA.boysHostels;
  } else {
    normalized.boysHostels = apiData.boysHostels.map((hostel) => ({
      ...hostel,

      name: hostel.name || hostel.title || "",

      image: hostel.image || { url: "" },

      facilities: Array.isArray(hostel.facilities) ? hostel.facilities : [],
    }));
  }

  /* -------------------------------------------------------
     Girls Hostels
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.girlsHostels)) {
    normalized.girlsHostels = DEFAULT_DATA.girlsHostels;
  } else {
    normalized.girlsHostels = apiData.girlsHostels.map((hostel) => ({
      ...hostel,

      name: hostel.name || hostel.title || "",

      image: hostel.image || { url: "" },

      facilities: Array.isArray(hostel.facilities) ? hostel.facilities : [],
    }));
  }

  /* -------------------------------------------------------
     Mess
  ------------------------------------------------------- */

  if (!normalized.mess.description && normalized.mess.paragraph) {
    normalized.mess.description = normalized.mess.paragraph;
  }

  /* -------------------------------------------------------
     Mess Items
  ------------------------------------------------------- */

  if (!Array.isArray(normalized.mess.items)) {
    normalized.mess.items = DEFAULT_DATA.mess.items;
  }

  /* -------------------------------------------------------
     Facilities
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.facilities)) {
    normalized.facilities = DEFAULT_DATA.facilities;
  } else {
    normalized.facilities = apiData.facilities.map((facility) => {
      if (typeof facility === "string") {
        return {
          icon: "",
          title: facility,
          description: "",
        };
      }

      return facility;
    });
  }

  /* -------------------------------------------------------
     Gallery
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.gallery)) {
    normalized.gallery = DEFAULT_DATA.gallery;
  }

  /* -------------------------------------------------------
     Weekly Menu
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.weeklyMenu)) {
    normalized.weeklyMenu = DEFAULT_DATA.weeklyMenu;
  }

  /* -------------------------------------------------------
     Rules
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.rules)) {
    normalized.rules = DEFAULT_DATA.rules;
  }

  /* -------------------------------------------------------
     Statistics
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.statistics)) {
    normalized.statistics = DEFAULT_DATA.statistics;
  }

  /* -------------------------------------------------------
     FAQs
  ------------------------------------------------------- */

  if (!Array.isArray(apiData.faqs)) {
    normalized.faqs = DEFAULT_DATA.faqs;
  }

  return normalized;
};

/* =========================================================
   IMAGE URL HELPER
========================================================= */

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  return image.url || "";
};

/* =========================================================
   ICON HELPERS
========================================================= */

const getFacilityIcon = (icon) => {
  const value = String(icon || "").toLowerCase();

  if (value.includes("wifi")) {
    return <FaWifi />;
  }

  if (value.includes("security") || value.includes("shield")) {
    return <FaShieldAlt />;
  }

  if (
    value.includes("water") ||
    value.includes("tint") ||
    value.includes("ro")
  ) {
    return <FaTint />;
  }

  if (value.includes("bed") || value.includes("room")) {
    return <FaBed />;
  }

  if (value.includes("tv") || value.includes("common")) {
    return <FaTv />;
  }

  if (value.includes("food") || value.includes("dining")) {
    return <FaUtensils />;
  }

  if (value.includes("user") || value.includes("game")) {
    return <FaUsers />;
  }

  if (value.includes("study") || value.includes("laptop")) {
    return <FaLaptopHouse />;
  }

  if (value.includes("power") || value.includes("bolt")) {
    return <FaBolt />;
  }

  if (value.includes("shirt") || value.includes("laundry")) {
    return <FaTshirt />;
  }

  if (value.includes("medical") || value.includes("first")) {
    return <FaFirstAid />;
  }

  return <FaBed />;
};

const getMessIcon = (icon, index) => {
  const value = String(icon || "").toLowerCase();

  if (
    value.includes("water") ||
    value.includes("tint") ||
    value.includes("ro")
  ) {
    return <FaTint />;
  }

  if (value.includes("leaf") || value.includes("healthy")) {
    return <FaLeaf />;
  }

  if (value.includes("clock") || value.includes("time")) {
    return <FaClock />;
  }

  if (value.includes("dining") || value.includes("food")) {
    return <FaUtensils />;
  }

  const icons = [<FaUtensils />, <FaTint />, <FaTv />, <FaLaptopHouse />];

  return icons[index % icons.length];
};

/* =========================================================
   PUBLIC COMPONENT
========================================================= */

const HostelMess = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  /* =======================================================
     FETCH PUBLIC API
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadHostelMess = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getHostelMess();

        if (mounted && response?.success && response?.data) {
          setData(normalizeData(response.data));
        }
      } catch (err) {
        console.error("Hostel & Mess API Error:", err);

        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHostelMess();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading Hostel & Mess...</h3>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="hostel-hero">
        <Container>
          <div className="hero-content">
            <h1>{data.hero?.title || "Hostel & Mess"}</h1>

            <p
              style={{
                color: "white",
              }}
            >
              {data.hero?.breadcrumb || "Home / Life @ IMSEC / Hostel & Mess"}
            </p>
          </div>
        </Container>
      </section>

      {/* ==================================================
          ABOUT
      ================================================== */}

      <section className="hostel-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              {getImageUrl(data.about?.image) && (
                <img
                  src={getImageUrl(data.about.image)}
                  alt="Hostel"
                  className="img-fluid about-image"
                />
              )}
            </Col>

            <Col lg={6}>
              <h6
                className="section-tag"
                style={{
                  color: "black",
                }}
              >
                {data.about?.tag}
              </h6>

              <h2 className="section-title">
                {data.about?.title}

                <span> {data.about?.highlight}</span>
              </h2>

              {data.about?.description1 && <p>{data.about.description1}</p>}

              {data.about?.description2 && <p>{data.about.description2}</p>}
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================================================
          BOYS HOSTEL
      ================================================== */}

      <section className="boys-hostel py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              BOYS HOSTEL
            </h6>

            <h2 className="section-title">
              Residential
              <span> Facilities</span>
            </h2>
          </div>

          <Row className="g-4">
            {data.boysHostels.map((hostel, index) => (
              <Col lg={6} key={hostel._id || index}>
                <div className="hostel-card">
                  {getImageUrl(hostel.image) && (
                    <img
                      src={getImageUrl(hostel.image)}
                      alt={hostel.name || "Boys Hostel"}
                      className="img-fluid"
                    />
                  )}

                  <div className="hostel-content">
                    <h3>{hostel.name}</h3>

                    <p>{hostel.description}</p>

                    <ul>
                      {hostel.capacity && (
                        <li>
                          <FaUsers /> Capacity : {hostel.capacity}
                        </li>
                      )}

                      {(hostel.facilities || []).map(
                        (facility, facilityIndex) => (
                          <li key={facilityIndex}>
                            <FaWifi /> {facility}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================================================
          GIRLS HOSTEL
      ================================================== */}

      <section className="girls-hostel py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              GIRLS HOSTEL
            </h6>

            <h2 className="section-title">
              Safe & Secure
              <span> Accommodation</span>
            </h2>
          </div>

          <Row className="justify-content-center">
            {data.girlsHostels.map((hostel, index) => (
              <Col lg={8} key={hostel._id || index}>
                <div className="hostel-card">
                  {getImageUrl(hostel.image) && (
                    <img
                      src={getImageUrl(hostel.image)}
                      alt={hostel.name || "Girls Hostel"}
                      className="img-fluid"
                    />
                  )}

                  <div className="hostel-content">
                    <h3>{hostel.name}</h3>

                    <p>{hostel.description}</p>

                    <ul>
                      {hostel.capacity && (
                        <li>
                          <FaUsers /> Capacity : {hostel.capacity}
                        </li>
                      )}

                      {(hostel.facilities || []).map(
                        (facility, facilityIndex) => (
                          <li key={facilityIndex}>
                            <FaShieldAlt /> {facility}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================================================
          MESS
      ================================================== */}

      <section className="mess-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              {getImageUrl(data.mess?.image) && (
                <img
                  src={getImageUrl(data.mess.image)}
                  alt="Mess"
                  className="img-fluid mess-image"
                />
              )}
            </Col>

            <Col lg={6}>
              <h6
                className="section-tag"
                style={{
                  color: "black",
                }}
              >
                {data.mess?.tag}
              </h6>

              <h2 className="section-title">
                {data.mess?.title}

                <span> {data.mess?.highlight}</span>
              </h2>

              <p>{data.mess?.description}</p>

              <ul className="mess-list">
                {(data.mess?.items || []).map((item, index) => {
                  /*
                      New CMS structure:
                      {
                        icon,
                        title,
                        description
                      }

                      Also supports old string
                      structure.
                    */

                  if (typeof item === "string") {
                    return (
                      <li key={index}>
                        {getMessIcon("", index)} {item}
                      </li>
                    );
                  }

                  return (
                    <li key={item._id || index}>
                      {getMessIcon(item.icon, index)}{" "}
                      <strong>{item.title}</strong>
                      {item.description && (
                        <>
                          {" — "}
                          {item.description}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================================================
          FACILITIES
      ================================================== */}

      <section className="facility-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              HOSTEL FACILITIES
            </h6>

            <h2 className="section-title">
              Everything You Need
              <span> Under One Roof</span>
            </h2>
          </div>

          <Row className="g-4">
            {data.facilities.map((item, index) => {
              const title = typeof item === "string" ? item : item.title;

              const description =
                typeof item === "string" ? "" : item.description;

              const icon = typeof item === "string" ? "" : item.icon;

              return (
                <Col lg={3} md={6} key={item._id || index}>
                  <div className="facility-card">
                    <div className="facility-icon">{getFacilityIcon(icon)}</div>

                    <h5>{title}</h5>

                    {description && <p>{description}</p>}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ==================================================
          GALLERY
      ================================================== */}

      <section className="gallery-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              GALLERY
            </h6>

            <h2 className="section-title">
              Hostel &<span> Mess Gallery</span>
            </h2>
          </div>

          <Row className="g-4">
            {data.gallery.map((image, index) => (
              <Col lg={4} md={6} key={image._id || index}>
                <div className="gallery-card">
                  {getImageUrl(image) && (
                    <img
                      src={getImageUrl(image)}
                      alt={`Hostel Gallery ${index + 1}`}
                      className="img-fluid"
                    />
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================================================
          WEEKLY MENU
      ================================================== */}

      <section className="menu-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              MESS MENU
            </h6>

            <h2 className="section-title">
              Weekly
              <span> Meal Plan</span>
            </h2>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered menu-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Snacks</th>
                  <th>Dinner</th>
                </tr>
              </thead>

              <tbody>
                {data.weeklyMenu.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{item.day}</td>

                    <td>{item.breakfast}</td>

                    <td>{item.lunch}</td>

                    <td>{item.snacks}</td>

                    <td>{item.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ==================================================
          RULES
      ================================================== */}

      <section className="rules-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6
              className="section-tag"
              style={{
                color: "black",
              }}
            >
              HOSTEL RULES
            </h6>

            <h2 className="section-title">
              Rules &<span> Regulations</span>
            </h2>
          </div>

          <Row>
            <Col lg={12}>
              <div className="rules-card">
                <ul>
                  {data.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section className="stats-section py-5">
        <Container>
          <Row className="g-4">
            {data.statistics.map((stat, index) => (
              <Col lg={3} md={6} key={stat._id || index}>
                <div className="stat-card">
                  <h2>{stat.value}</h2>

                  <p>{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ==================================================
          FAQ
      ================================================== */}

      <section className="faq-section py-5">
        <Container>
          <div className="faq-card">
            {data.faqs.map((faq, index) => (
              <React.Fragment key={faq._id || index}>
                <h5>{faq.question}</h5>

                <p>{faq.answer}</p>

                {index < data.faqs.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section className="hostel-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2
                style={{
                  color: "white",
                }}
              >
                {data.cta?.title}
              </h2>

              <p
                style={{
                  color: "white",
                }}
              >
                {data.cta?.description}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ==================================================
          API ERROR NOTICE
          Content still displays from defaults.
      ================================================== */}

      {error && (
        <div
          style={{
            display: "none",
          }}
        >
          Hostel & Mess API unavailable
        </div>
      )}
    </>
  );
};

export default HostelMess;
