import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaFlask,
  FaUsers,
  FaBuilding,
  FaLanguage,
  FaBed,
  FaCoffee,
} from "react-icons/fa";

import "./lifeimsec.css";

const cards = [
  {
    title: "Events",
    icon: <FaCalendarAlt />,
    path: "/imsec-control-center/life-imsec/events",
  },

  {
    title: "Students Clubs",
    icon: <FaUsers />,
    path: "/imsec-control-center/life-imsec/students-clubs",
  },

  {
    title: "Auditorium",
    icon: <FaBuilding />,
    path: "/imsec-control-center/life-imsec/auditorium",
  },

  {
    title: "Language & Communication Lab",
    icon: <FaLanguage />,
    path: "/imsec-control-center/life-imsec/language-communication-lab",
  },

  {
    title: "Hostel & Mess",
    icon: <FaBed />,
    path: "/imsec-control-center/life-imsec/hostel-mess",
  },

  {
    title: "Cafeteria",
    icon: <FaCoffee />,
    path: "/imsec-control-center/life-imsec/cafeteria",
  },
];

const LifeImsecDashboard = () => {
  return (
    <div className="container-fluid lifeimsec-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header mb-4">
        <h2>Life@IMSEC CMS</h2>

        <p>Manage Life @ IMSEC Content</p>
      </div>

      {/* =================================================
          CARDS
      ================================================= */}

      <div className="row">
        {cards.map((card) => (
          <div className="col-lg-4 col-md-6 mb-4" key={card.title}>
            <Link to={card.path} className="text-decoration-none">
              <div className="lifeimsec-card">
                <div className="lifeimsec-icon">{card.icon}</div>

                <h4>{card.title}</h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifeImsecDashboard;
