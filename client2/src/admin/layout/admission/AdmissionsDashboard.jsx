import { Link } from "react-router-dom";

import {
  FaUniversity,
  FaFileAlt,
  FaUserGraduate,
  FaMoneyBillWave,
  FaCreditCard,
  FaGraduationCap,
  FaStar,
  FaQuestionCircle,
} from "react-icons/fa";

import "./admissions.css";

const cards = [
  {
    title: "UPTAC Counselling Current Session",
    icon: <FaUniversity />,
    path: "/imsec-control-center/admissions/uptac-counselling",
  },

  {
    title: "Admissions Process",
    icon: <FaFileAlt />,
    path: "/imsec-control-center/admissions/admissions-process",
  },

  {
    title: "Apply for Admission",
    icon: <FaUserGraduate />,
    path: "/imsec-control-center/admission/apply-admission",
  },

  {
    title: "Fee Structure",
    icon: <FaMoneyBillWave />,
    path: "/imsec-control-center/admission/fee-structure",
  },

  {
    title: "Payment Procedure",
    icon: <FaCreditCard />,
    path: "/imsec-control-center/admission/payment-procedure",
  },

  {
    title: "Government Scholarship Policies",
    icon: <FaGraduationCap />,
    path: "/imsec-control-center/admission/scholarship-policies",
  },

  {
    title: "Success Story",
    icon: <FaStar />,
    path: "/imsec-control-center/admission/success-story",
  },

  {
    title: "Frequently Asked Questions (FAQ)",
    icon: <FaQuestionCircle />,
    path: "/imsec-control-center/admission/faq",
  },
];

const AdmissionsDashboard = () => {
  return (
    <div className="container-fluid admissions-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header mb-4">
        <h2>Admissions CMS</h2>

        <p>Manage Admission Content</p>
      </div>

      {/* =================================================
          CARDS
      ================================================= */}

      <div className="row">
        {cards.map((card) => (
          <div className="col-lg-4 col-md-6 mb-4" key={card.title}>
            <Link to={card.path} className="text-decoration-none">
              <div className="admission-card">
                <div className="admission-icon">{card.icon}</div>

                <h4>{card.title}</h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionsDashboard;
