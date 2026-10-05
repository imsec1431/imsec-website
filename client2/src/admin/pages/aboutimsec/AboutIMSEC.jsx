import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaUniversity,
  FaCertificate,
  FaBuilding,
  FaImage,
} from "react-icons/fa";

import "./AboutIMSEC.css";

const AboutIMSEC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "About IMSEC PAGE",
      icon: <FaBuilding />,
      path: "/imsec-control-center/about-imsec/about-imsec-page",
    },
    {
      title: "IMS Society",
      icon: <FaBuilding />,
      path: "/imsec-control-center/about-imsec/ims-society",
    },
    {
      title: "IMS Group of Institutions",
      icon: <FaBuilding />,
      path: "/imsec-control-center/about-imsec/ims-group",
    },
    {
      title: "Vision & Mission",
      icon: <FaUserTie />,
      path: "/imsec-control-center/about-imsec/vision-mission",
    },
    {
      title: "Chairman's Message",
      icon: <FaUserTie />,
      path: "/imsec-control-center/about-imsec/chairman",
    },
    {
      title: "Director's Message",
      icon: <FaUserGraduate />,
      path: "/imsec-control-center/about-imsec/director",
    },
    {
      title: "Governing Body",
      icon: <FaUniversity />,
      path: "/imsec-control-center/about-imsec/governing-council",
    },
    {
      title: "Organizational Chart",
      icon: <FaImage />,
      path: "/imsec-control-center/about-imsec/organizational-chart",
    },
    {
      title: "Executive Council",
      icon: <FaUsers />,
      path: "/imsec-control-center/about-imsec/executive-council",
    },
    {
      title: "Approvals",
      icon: <FaCertificate />,
      path: "/imsec-control-center/about-imsec/approvals-affiliations",
    },
    {
      title: "Campus",
      icon: <FaCertificate />,
      path: "/imsec-control-center/about-imsec/campus",
    },
  ];

  return (
    <div className="about-dashboard">
      <div className="about-header">
        <h2>About IMSEC CMS</h2>
        <p>
          Manage Chairman's Message, Director's Message, Governing Body,
          Executive Council and Approvals.
        </p>
      </div>

      <div className="about-grid">
        {modules.map((item) => (
          <div
            key={item.title}
            className="about-card"
            onClick={() => navigate(item.path)}
          >
            <div className="about-icon">{item.icon}</div>

            <h4>{item.title}</h4>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutIMSEC;
