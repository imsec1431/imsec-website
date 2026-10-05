import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCertificate, FaTrophy, FaStar, FaAward } from "react-icons/fa";

import "./accreditations.css";

const AccreditationsDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Accreditations",
      description:
        "Manage institutional accreditations, accreditation details and supporting documents.",
      icon: <FaCertificate />,
      path: "/imsec-control-center/accreditations/accreditations",
    },
    {
      title: "Ranking , Ratings & Awards",
      description:
        "Manage ranking information, ranking achievements and related documents.",
      icon: <FaTrophy />,
      path: "/imsec-control-center/accreditations/recognition",
    },
  ];

  return (
    <div className="accreditations-dashboard">
      {/* Header */}

      <div className="accreditations-dashboard-header">
        <div>
          <span className="accreditations-dashboard-eyebrow">
            INSTITUTIONAL EXCELLENCE
          </span>

          <h1>Accreditations, Ranking, Ratings & Awards</h1>

          <p>
            Manage institutional accreditations, rankings, ratings and awards
            from one place.
          </p>
        </div>
      </div>

      {/* Cards */}

      <div className="accreditations-card-grid">
        {cards.map((card, index) => (
          <div
            className="accreditations-dashboard-card"
            key={card.title}
            onClick={() => navigate(card.path)}
          >
            <div className="accreditations-card-top">
              <div className="accreditations-card-icon">{card.icon}</div>

              <span className="accreditations-card-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h2>{card.title}</h2>

            <p>{card.description}</p>

            <button
              type="button"
              className="accreditations-card-button"
              onClick={(event) => {
                event.stopPropagation();
                navigate(card.path);
              }}
            >
              Manage
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccreditationsDashboard;
