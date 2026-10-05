import { Link } from "react-router-dom";

import { FaAward, FaUniversity, FaCertificate } from "react-icons/fa";

import "./iqac.css";

const cards = [
  {
    title: "NIRF",
    description: "National Institutional Ranking Framework",
    icon: <FaUniversity />,
    path: "/imsec-control-center/iqac/nirf",
  },

  {
    title: "NBA",
    description: "National Board of Accreditation",
    icon: <FaAward />,
    path: "/imsec-control-center/iqac/nba",
  },

  {
    title: "NAAC",
    description: "National Assessment and Accreditation Council",
    icon: <FaCertificate />,
    path: "/imsec-control-center/iqac/naac",
  },
  {
    title: "IQAC",
    description: "Internal Quality Assurance Cell",
    icon: <FaCertificate />,
    path: "/imsec-control-center/iqac/iqac",
  },
  {
    title: "AQAR",
    description: "Internal Quality Assurance Cell",
    icon: <FaCertificate />,
    path: "/imsec-control-center/iqac/aqar",
  },
];

const IQACDashboard = () => {
  return (
    <div className="container-fluid iqac-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header mb-4">
        <h2>IQAC CMS</h2>

        <p>Manage NIRF, NBA and NAAC Content</p>
      </div>

      {/* =================================================
          CARDS
      ================================================= */}

      <div className="row">
        {cards.map((card) => (
          <div className="col-lg-4 col-md-6 mb-4" key={card.title}>
            <Link to={card.path} className="text-decoration-none">
              <div className="iqac-card">
                <div className="iqac-icon">{card.icon}</div>

                <h4>{card.title}</h4>

                <p>{card.description}</p>

                <span className="iqac-manage-link">Manage →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IQACDashboard;
