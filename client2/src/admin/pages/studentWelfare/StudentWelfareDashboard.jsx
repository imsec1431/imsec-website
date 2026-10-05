import { Link } from "react-router-dom";

import {
  FaUsers,
  FaShieldAlt,
  FaExclamationTriangle,
  FaUniversity,
  FaGraduationCap,
  FaComments,
  FaHandsHelping,
  FaFileAlt,
} from "react-icons/fa";

import "./studentWelfare.css";

const cards = [
  {
    title: "Student Handbook",
    icon: <FaUsers />,
    path: "/imsec-control-center/student-welfare/student-handbook",
  },
  {
    title: "Counselling Support",
    icon: <FaShieldAlt />,
    path: "/imsec-control-center/student-welfare/counselling-support",
  },
  {
    title: "Medical Support",
    icon: <FaExclamationTriangle />,
    path: "/imsec-control-center/student-welfare/medical-support",
  },

  {
    title: " Gym Facilities",
    icon: <FaGraduationCap />,
    path: "/imsec-control-center/student-welfare/gym",
  },
  {
    title: "Sports Facilities",
    icon: <FaGraduationCap />,
    path: "/imsec-control-center/student-welfare/sports",
  },
];

const StudentWelfareDashboard = () => {
  return (
    <div className="container-fluid student-welfare-dashboard">
      <div className="page-header mb-4">
        <h2>Student Welfare CMS</h2>
        <p>Manage Student Welfare Content</p>
      </div>

      <div className="row">
        {cards.map((card) => (
          <div className="col-lg-4 col-md-6 mb-4" key={card.title}>
            <Link to={card.path} className="text-decoration-none">
              <div className="student-welfare-card">
                <div className="student-welfare-icon">{card.icon}</div>

                <h4>{card.title}</h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentWelfareDashboard;
