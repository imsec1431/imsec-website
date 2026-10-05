import { Link } from "react-router-dom";

import {
  FaUserGraduate,
  FaUserTie,
  FaBalanceScale,
} from "react-icons/fa";

import "./grievance.css";

const cards = [
  {
    title: "Student Grievance",
    icon: <FaUserGraduate />,
    path: "/imsec-control-center/grievance/student-grievance",
  },

  {
    title: "Employee Grievance",
    icon: <FaUserTie />,
    path: "/imsec-control-center/grievance/employee-grievance",
  },

  {
    title: "Internal Grievance Committee",
    icon: <FaBalanceScale />,
    path: "/imsec-control-center/grievance/internal-grievance-committee",
  },
];

const GrievanceDashboard = () => {
  return (
    <div className="container-fluid">

      <div className="page-header mb-4">
        <h2>Grievance CMS</h2>
        <p>Manage Grievance Portal</p>
      </div>

      <div className="row">

        {cards.map((card) => (
          <div
            className="col-lg-4 col-md-6 mb-4"
            key={card.title}
          >
            <Link
              to={card.path}
              className="text-decoration-none"
            >
              <div className="grievance-card">

                <div className="grievance-icon">
                  {card.icon}
                </div>

                <h4>{card.title}</h4>

              </div>
            </Link>
          </div>
        ))}

      </div>

    </div>
  );
};

export default GrievanceDashboard;