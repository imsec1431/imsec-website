import { Link } from "react-router-dom";
import {
  FaImages,
  FaChartBar,
  FaUniversity,
  FaTrophy,
  FaUserGraduate,
  FaAward,
  FaUsers,
} from "react-icons/fa";
import "./HomepageDashboard.css";

const modules = [
  {
    title: "Hero Slider",
    icon: <FaImages />,
    path: "/imsec-control-center/homepage/hero-slider",
  },
  {
    title: "Approval",
    icon: <FaImages />,
    path: "/imsec-control-center/homepage/approval",
  },
  {
    title: "Welcome To IMSEC",
    icon: <FaImages />,
    path: "/imsec-control-center/homepage/welcome-to-imsec",
  },
  {
    title: "AcademicMatrix ",
    icon: <FaImages />,
    path: "/imsec-control-center/homepage/academic-matrix",
  },
  {
    title: "Campus Highlights",
    icon: <FaUniversity />,
    path: "/imsec-control-center/homepage/campus-highlights",
  },
  {
    title: "University Rank Holders",
    icon: <FaTrophy />,
    path: "/imsec-control-center/homepage/university-rank-holder",
  },
  {
    title: "Placement Students",
    icon: <FaUserGraduate />,
    path: "/imsec-control-center/homepage/placements",
  },
  {
    title: "Achievements",
    icon: <FaAward />,
    path: "/imsec-control-center/homepage/achievements",
  },
  {
    title: "Alumni",
    icon: <FaUsers />,
    path: "/imsec-control-center/homepage/alumni",
  },
];

const HomepageDashboard = () => {
  return (
    <div className="homepage-dashboard">
      <h2 className="dashboard-title">Homepage CMS</h2>

      <div className="dashboard-grid">
        {modules.map((item, index) => (
          <Link to={item.path} className="dashboard-card" key={index}>
            <div className="dashboard-icon">{item.icon}</div>
            <h5>{item.title}</h5>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomepageDashboard;
