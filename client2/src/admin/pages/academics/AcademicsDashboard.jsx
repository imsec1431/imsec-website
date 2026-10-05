import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaBullhorn,
  FaChalkboardTeacher,
  FaHandshake,
  FaBook,
} from "react-icons/fa";

import "./academics.css";

const cards = [
  {
    title: "Academic Coordinator",
    icon: <FaCalendarAlt />,
    path: "/imsec-control-center/academics/academic-coordinator",
  },
  {
    title: "Academic Calendar",
    icon: <FaCalendarAlt />,
    path: "/imsec-control-center/academics/academic-calendar",
  },
  {
    title: "Activity Calendar",
    icon: <FaCalendarAlt />,
    path: "/imsec-control-center/academics/activity-calendar",
  },
  {
    title: "Courses",
    icon: <FaBook />,
    path: "/imsec-control-center/academics/courses",
  },
  {
    title: "Teaching-Learning-Process",
    icon: <FaChalkboardTeacher />,
    path: "/imsec-control-center/academics/teaching-learning-process",
  },
  {
    title: "Learning Development Centre (LDC)",
    icon: <FaBook />,
    path: "/imsec-control-center/academics/learning-development-centre",
  },
  {
    title: "Academic Development Program",
    icon: <FaChalkboardTeacher />,
    path: "/imsec-control-center/academics/academic-development-program",
  },
  {
    title: "Classroom & Labs",
    icon: <FaChalkboardTeacher />,
    path: "/imsec-control-center/academics/classroom-labs",
  },
  {
    title: "Rules & Regulations",
    icon: <FaBook />,
    path: "/imsec-control-center/academics/rules",
  },
  {
    title: "Circular & Notices",
    icon: <FaBullhorn />,
    path: "/imsec-control-center/academics/circular-notice",
  },
  {
    title: "Convocations",
    icon: <FaBook />,
    path: "/imsec-control-center/academics/convocation",
  },

  {
    title: "Student-Handbook",
    icon: <FaBook />,
    path: "/imsec-control-center/academics/student-handbook",
  },
];

const AcademicsDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <h2>Academics CMS</h2>
        <p>Manage Academic Content</p>
      </div>

      <div className="row">
        {cards.map((card) => (
          <div className="col-lg-4 col-md-6 mb-4" key={card.title}>
            <Link to={card.path} className="text-decoration-none">
              <div className="academic-card">
                <div className="academic-icon">{card.icon}</div>

                <h4>{card.title}</h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicsDashboard;
