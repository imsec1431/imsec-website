import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFlask,
  FaRobot,
  FaCloud,
  FaShieldAlt,
  FaBrain,
  FaMicrochip,
} from "react-icons/fa";

import "./CentreOfExcellence.css";

/*=========================================================
                    Statistics
=========================================================*/

const stats = [
  {
    id: 1,
    number: "08+",
    title: "Centres of Excellence",
  },

  {
    id: 2,
    number: "35+",
    title: "Research Laboratories",
  },

  {
    id: 3,
    number: "120+",
    title: "Industry Projects",
  },

  {
    id: 4,
    number: "3000+",
    title: "Students Trained",
  },
];

/*=========================================================
                Centre Data
=========================================================*/

const centres = [
  {
    id: 1,

    title: "Artificial Intelligence & Machine Learning",

    partner: "Microsoft",

    icon: <FaBrain />,

    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",

    description:
      "Advanced research, deep learning, computer vision, NLP, predictive analytics and intelligent systems.",
  },

  {
    id: 2,

    title: "Cyber Security",

    partner: "Cisco",

    icon: <FaShieldAlt />,

    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",

    description:
      "Ethical hacking, penetration testing, network security and cyber defence technologies.",
  },

  {
    id: 3,

    title: "Cloud Computing",

    partner: "AWS",

    icon: <FaCloud />,

    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",

    description:
      "Cloud architecture, DevOps, virtualization and scalable enterprise infrastructure.",
  },

  {
    id: 4,

    title: "Robotics & Automation",

    partner: "ABB",

    icon: <FaRobot />,

    image:
      "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=1200&q=80",

    description:
      "Industrial robotics, automation systems, embedded controllers and smart manufacturing.",
  },

  {
    id: 5,

    title: "Internet of Things",

    partner: "Intel",

    icon: <FaMicrochip />,

    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",

    description:
      "Connected devices, smart sensors, embedded systems and IoT applications.",
  },

  {
    id: 6,

    title: "Innovation & Research Lab",

    partner: "Industry Partners",

    icon: <FaFlask />,

    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80",

    description:
      "Innovation ecosystem supporting patents, startups, funded research and product development.",
  },
];

const CentreOfExcellence = () => {
  return (
    <>
      {/*================ Hero =================*/}

      <section className="coe-hero">
        <Container>
          <div className="hero-content">
            <h1>Centre of Excellence</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              Coe
              <span>/</span>
              Centre of Excellence
            </p>
          </div>
        </Container>
      </section>

      {/*================ About =================*/}

      <section className="coe-about py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80"
                alt="Centre of Excellence"
                className="img-fluid about-image"
              />
            </Col>

            <Col lg={6}>
              <h6 className="section-tag">
                INNOVATION • RESEARCH • TECHNOLOGY
              </h6>

              <h2 className="section-title">
                Centre of
                <span> Excellence</span>
              </h2>

              <p>
                The Centre of Excellence at IMS Engineering College provides a
                dynamic platform for innovation, advanced research, industry
                collaboration and technology-driven learning. It enables
                students and faculty members to work on emerging technologies,
                multidisciplinary research and real-world industrial challenges.
              </p>

              <p>
                Through strategic collaborations with leading industries and
                research organizations, the Centre encourages innovation,
                entrepreneurship, skill enhancement, patents, publications and
                startup development.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Vision & Mission =================*/}

      <section className="vision-mission py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div className="vision-card">
                <h3>Our Vision</h3>

                <p>
                  To establish a world-class innovation ecosystem that nurtures
                  research excellence, technological advancement and globally
                  competent engineers.
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mission-card">
                <h3>Our Mission</h3>

                <ul>
                  <li>Promote interdisciplinary research.</li>

                  <li>Strengthen industry collaboration.</li>

                  <li>Encourage innovation & entrepreneurship.</li>

                  <li>Support patents and publications.</li>

                  <li>Develop future-ready professionals.</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/*================ Statistics =================*/}

      <section className="coe-stats py-5">
        <Container>
          <Row className="g-4">
            {stats.map((item) => (
              <Col lg={3} md={6} key={item.id}>
                <div className="stat-card">
                  <h2>{item.number}</h2>

                  <p>{item.title}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ Centres =================*/}

      <section className="centre-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">SPECIALIZED DOMAINS</h6>

            <h2 className="section-title">
              Our
              <span> Centres of Excellence</span>
            </h2>
          </div>

          <Row className="g-4">
            {centres.map((item) => (
              <Col lg={4} md={6} key={item.id}>
                <div className="centre-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                  />

                  <div className="centre-content">
                    <div className="centre-icon">{item.icon}</div>

                    <h4>{item.title}</h4>

                    <p>{item.description}</p>

                    <h6>Industry Partner</h6>

                    <span>{item.partner}</span>

                    <button className="btn btn-warning rounded-pill mt-4">
                      View Details
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/*================ Facilities =================*/}

      <section className="coe-facilities py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">WORLD-CLASS INFRASTRUCTURE</h6>

            <h2 className="section-title">
              Research
              <span> Facilities</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Advanced Research Labs",
              "High Performance Computing",
              "Cloud Infrastructure",
              "Innovation Hub",
              "Prototype Development",
              "Incubation Support",
              "Startup Mentoring",
              "Patent Assistance",
            ].map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="facility-card">
                  <FaFlask className="facility-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ Industry Partners =================*/}

      <section className="industry-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">COLLABORATION</h6>

            <h2 className="section-title">
              Industry
              <span> Partners</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Microsoft",
              "IBM",
              "AWS",
              "Oracle",
              "Cisco",
              "Intel",
              "NVIDIA",
              "TCS",
            ].map((partner, index) => (
              <Col lg={3} md={4} sm={6} key={index}>
                <div className="partner-card">
                  <h4>{partner}</h4>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ Student Benefits =================*/}

      <section className="benefits-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">STUDENT OPPORTUNITIES</h6>

            <h2 className="section-title">
              Benefits for
              <span> Students</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Live Industry Projects",
              "Internship Opportunities",
              "Industry Certifications",
              "Startup Incubation",
              "Hackathons",
              "Research Publications",
              "Patent Guidance",
              "Global Competitions",
            ].map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="benefit-card">
                  <FaBrain className="benefit-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ Activities =================*/}

      <section className="activities-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">ACTIVITIES</h6>

            <h2 className="section-title">
              Major
              <span> Activities</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Hands-on Workshops",
              "Faculty Development Programs",
              "Hackathons",
              "Bootcamps",
              "Research Projects",
              "Innovation Challenges",
              "Expert Talks",
              "Industrial Visits",
            ].map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="activity-card">
                  <FaRobot className="activity-icon" />

                  <h5>{item}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ Gallery =================*/}

      <section className="coe-gallery py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">GALLERY</h6>

            <h2 className="section-title">
              Innovation
              <span> Gallery</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80",
              "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
              "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=1200&q=80",
              "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
            ].map((image, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="gallery-card">
                  <img
                    src={image}
                    alt="Centre of Excellence"
                    className="img-fluid"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/*================ FAQ =================*/}

      <section className="coe-faq py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag">FAQ</h6>

            <h2 className="section-title">
              Frequently Asked
              <span> Questions</span>
            </h2>
          </div>

          <div className="accordion" id="coeAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqOne"
                >
                  What is a Centre of Excellence?
                </button>
              </h2>

              <div
                id="faqOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#coeAccordion"
              >
                <div className="accordion-body">
                  A Centre of Excellence provides advanced facilities for
                  research, innovation, industry collaboration and skill
                  development in emerging technologies.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqTwo"
                >
                  Can students participate in CoE activities?
                </button>
              </h2>

              <div
                id="faqTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#coeAccordion"
              >
                <div className="accordion-body">
                  Yes. Students can participate in research projects,
                  internships, innovation challenges, hackathons, workshops and
                  certification programs.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/*================ CTA =================*/}

      <section className="coe-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2>Become a Part of Innovation</h2>

              <p>
                Explore advanced technologies, collaborate with industry
                experts, and shape the future through our Centres of Excellence.
              </p>
            </Col>

            <Col lg={4} className="text-center text-lg-end mt-4 mt-lg-0">
              <button className="btn btn-warning rounded-pill px-4 me-3">
                Explore Centres
              </button>

              <button className="btn btn-outline-light rounded-pill px-4">
                Contact Coordinator
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CentreOfExcellence;
