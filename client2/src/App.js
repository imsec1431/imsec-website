import React from "react";
import NavigationBar from "./components/navbar";
import Footer from "./components/fotter";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home";
import NewsTicker from "./components/newsticker";
import NotFound from "./pages/404page";

// About page data
import IMSSociety from "./pages/aboutpage/imsec-society";
import AboutImsec from "./pages/aboutpage/about-imsec";
import IMSGroup from "./pages/aboutpage/IMSGroup";
import VisionMisson from "./pages/aboutpage/vision-mission";
import Chairman from "./pages/aboutpage/chairman";
import Directors from "./pages/aboutpage/director";
import ExecutiveCouncil from "./pages/aboutpage/executivecouncil";
import GoverningBody from "./pages/aboutpage/governingcouncil";
import Approvals from "./pages/aboutpage/approvals";
import Campus from "./pages/aboutpage/campus";
import ContactUs from "./pages/aboutpage/contact";
import Location from "./pages/aboutpage/location";
import IMSGroupImage from "./pages/aboutpage/IMSGroupImage";

// Academic page data
import AcademicsCalender from "./pages/academics/academics-calender";
import CircularNotice from "./pages/academics/circular-noticed";
import AcademicDevelopmentProgram from "./pages/academics/AcademicDevelopmentProgram";
import MOUs from "./pages/academics/MOUs";
import RulesRegulations from "./pages/academics/RulesRegulations";
import ActivityCalendar from "./pages/academics/ActivityCalendar";
import TeachingLearningProcess from "./pages/academics/TeachingLearningProcess";
import StudentHandbook from "./pages/academics/StudentHandbook";
import LearningDevelopmentCentre from "./pages/academics/LearningDevelopmentCentre";
import Courses from "./pages/academics/Courses";
import Convocation from "./pages/academics/Convocation";
import AcademicCoordinators from "./pages/academics/AcademicCoordinators";

// Life@imsec
import ClassroomLabs from "./pages/Life@imsec/ClassroomLabs";
import Events from "./pages/Life@imsec/Events";
import HostelMess from "./pages/Life@imsec/HostelMess";
import Auditorium from "./pages/Life@imsec/Auditorium";
import Cafeteria from "./pages/Life@imsec/Cafeteria";
import LanguageCommunicationLab from "./pages/Life@imsec/LanguageCommunicationLab";
import StudentClubs from "./pages/Life@imsec/StudentClubs";

// Research
import About from "./pages/Research/About";
import ResearchPolicy from "./pages/Research/ResearchPolicy";
import Patents from "./pages/Research/Patents";
import ResearchPublications from "./pages/Research/ResearchPublications";
import FacultyDevelopmentPrograms from "./pages/Research/FacultyDevelopmentPrograms";
import ConferencePublications from "./pages/Research/ConferencePublications";
import BooksBookChapters from "./pages/Research/BooksBookChapters";
import CentreOfExcellence from "./pages/Research/CentreOfExcellence";

// Newsletter
import Newsletter from "./pages/NewsLetter/Newsletter";

// Grievances
import StudentGrievance from "./pages/Grievance/StudentGrievance";
import EmployeeGrievance from "./pages/Grievance/EmployeeGrievance";
import InternalGrievanceCommittee from "./pages/Grievance/InternalGrievanceCommittee";

// Departments
import McaPanel from "./pages/Departments/MCA/McaPanel";
import MbaPanel from "./pages/Departments/MBA/MbaPanel";
import CsPanel from "./pages/Departments/CS/CsPanel";
import CsePanel from "./pages/Departments/CSE/CsePanel";
import BtPanel from "./pages/Departments/BT/BtPanel";
import ASHPanel from "./pages/Departments/ASH/ASHPanel";
import CSDPanel from "./pages/Departments/CSD/CSDPanel";
import ITPanel from "./pages/Departments/IT/ITPanel";
import AIMLPanel from "./pages/Departments/AIML/AIMLPanel";
import MtechPanel from "./pages/Departments/MTECH/MtechPanel";
import ECEPanel from "./pages/Departments/ECE/ECEPanel";

// Placement
import CDCTeam from "./pages/Placements/CDCTeam";
import OurRecruiters from "./pages/Placements/OurRecruiters";
import PlacementPolicy from "./pages/Placements/PlacementPolicy";
import PlacementRecord from "./pages/Placements/PlacementRecord";
import TrainingPlacementActivity from "./pages/Placements/TrainingPlacementActivity";
import CDCStructure from "./pages/Placements/CDCStructure";
import PlacementNotices from "./pages/Placements/PlacementNotices";
import ShiningStars from "./pages/Placements/ShiningStars";
import TrainingInternship from "./pages/Placements/TrainingInternship";

// Admission
import AdmissionProcess from "./pages/Admission/AdmissionProcess";
import ApplyAdmission from "./pages/Admission/ApplyAdmission";
import FeeStructure from "./pages/Admission/FeeStructure";
import UPTACCounselling from "./pages/Admission/UPTACCounselling";

// Misc
import LibraryInMainMenu from "./pages/Library/Library";
import Announcements from "./pages/Announcements/Announcements";
import Alumni from "./pages/Alumni/Alumni";
import Career from "./pages/Career/Career";
import CareerDetails from "./pages/Career/CareerDetails";
import CareerApplication from "./pages/Career/CareerApplication";

import ScrollToTop from "./components/ScrollToTop";

import AllCommittee from "./pages/AllCommittee/AllCommittee";
import FAQ from "./pages/Admission/FAQ";
import GovernmentScholarshipPolicy from "./pages/Admission/GovernmentScholarshipPolicy.jsx";
import PaymentProcedure from "./pages/Admission/PaymentProcedure.jsx";
import MandatoryDisclosure from "./pages/MandatoryDisclosure/MandatoryDisclosure.jsx";

// iqac
import NAAC from "./pages/IQAC/NAAC";
import NIRF from "./pages/IQAC/NIRF";
import NBA from "./pages/IQAC/NBA";
import IQAC from "./pages/IQAC/IQAC";
import AQAR from "./pages/IQAC/AQAR";

// welfare
import CounsellingSupport from "./pages/StudentsWelfare/CounsellingSupport";
import MedicalSupport from "./pages/StudentsWelfare/MedicalSupport/MedicalSupport.js";
import Gym from "./pages/StudentsWelfare/Gym";
import Sports from "./pages/StudentsWelfare/Sports.js";

// Accreditations
import Accreditations from "./pages/Accreditations/Accreditations";
import AwardsRankingRatings from "./pages/Accreditations/AwardsRankingRatings";

// coe
import IndustryAcademicsCollaboration from "./pages/COE/IndustryAcademicsCollaboration";

// Admin Panel Data
import AdminApp from "./admin/AdminApp";

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/imsec-control-center");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <NavigationBar />}
      {!isAdmin && <NewsTicker />}

      <Routes>
        {/* Admin Route */}
        {/* Protected Admin Routes */}
        <Route path="/imsec-control-center/*" element={<AdminApp />} />

        {/* Website Routes */}
        <Route path="/" element={<Home />} />

        {/* About */}
        <Route path="/about/IMSSociety" element={<IMSSociety />} />

        <Route path="/about/aboutimsec" element={<AboutImsec />} />
        <Route path="/about/ims-group" element={<IMSGroup />} />
        <Route path="/about/vision-mission" element={<VisionMisson />} />
        <Route path="/about/ChairmansMessage" element={<Chairman />} />
        <Route path="/about/DirectorsMessage" element={<Directors />} />
        <Route path="/about/ExecutiveCouncil" element={<ExecutiveCouncil />} />
        <Route path="/about/GoverningBody" element={<GoverningBody />} />
        <Route path="/about/Approvals" element={<Approvals />} />
        <Route path="/about/Campus" element={<Campus />} />
        <Route path="/about/ContactUs" element={<ContactUs />} />
        <Route path="/about/Location" element={<Location />} />

        {/* Academics */}
        <Route
          path="/Academics/AcademicCalendar"
          element={<AcademicsCalender />}
        />
        <Route
          path="/Academics/AcademicCoordinators"
          element={<AcademicCoordinators />}
        />
        <Route path="/Academics/courses" element={<Courses />} />
        <Route
          path="/Academics/student-handbook"
          element={<StudentHandbook />}
        />
        <Route path="/Academics/convocation" element={<Convocation />} />
        <Route
          path="/Academics/activity-calendar"
          element={<ActivityCalendar />}
        />
        <Route path="/Academics/ClassroomLabs" element={<ClassroomLabs />} />

        <Route
          path="/Academics/circular-notices"
          element={<CircularNotice />}
        />
        <Route
          path="/Academics/AcademicDevelopmentProgram"
          element={<AcademicDevelopmentProgram />}
        />
        <Route
          path="/Academics/learning-development-centre"
          element={<LearningDevelopmentCentre />}
        />
        <Route path="/coe/MOUs" element={<MOUs />} />
        <Route
          path="/coe/industry-academics-collaboration"
          element={<IndustryAcademicsCollaboration />}
        />

        <Route
          path="/Academics/RulesRegulations"
          element={<RulesRegulations />}
        />
        <Route
          path="/Academics/teaching-learning-process"
          element={<TeachingLearningProcess />}
        />
        {/* Departments */}
        <Route path="/Departments/MCA" element={<McaPanel />} />
        <Route path="/Departments/MBA" element={<MbaPanel />} />
        <Route path="/Departments/CS" element={<CsPanel />} />
        <Route path="/Departments/CSE" element={<CsePanel />} />
        <Route path="/Departments/BT" element={<BtPanel />} />
        <Route path="/Departments/ASH" element={<ASHPanel />} />
        <Route path="/Departments/CSD" element={<CSDPanel />} />
        <Route path="/Departments/IT" element={<ITPanel />} />
        <Route path="/Departments/CSE-AIML" element={<AIMLPanel />} />
        <Route path="/Departments/MTECH" element={<MtechPanel />} />
        <Route path="/Departments/ECE" element={<ECEPanel />} />

        {/* Placements */}
        <Route path="/Placements/CDCTeam" element={<CDCTeam />} />
        <Route path="/Placements/OurRecruiters" element={<OurRecruiters />} />
        <Route path="/Placements/cdc-structure" element={<CDCStructure />} />
        <Route path="/placements/shining-stars" element={<ShiningStars />} />
        <Route
          path="/placements/training-internship"
          element={<TrainingInternship />}
        />
        <Route
          path="/Placements/T&PActivities"
          element={<TrainingPlacementActivity />}
        />
        <Route
          path="/placements/placement-notices"
          element={<PlacementNotices />}
        />
        <Route
          path="/Placements/PlacementsRecords"
          element={<PlacementRecord />}
        />
        <Route
          path="/Placements/PlacementPolicy"
          element={<PlacementPolicy />}
        />

        {/* Admissions */}
        <Route
          path="/Admission/UPTACCounselling"
          element={<UPTACCounselling />}
        />
        <Route
          path="/Admissions/AdmissionsProcess"
          element={<AdmissionProcess />}
        />
        <Route
          path="/Admissions/ApplyforAdmission"
          element={<ApplyAdmission />}
        />
        <Route path="/Admissions/FeeStructure" element={<FeeStructure />} />
        <Route path="/Admissions/FAQ" element={<FAQ />} />
        <Route
          path="/Admissions/GovernmentScholarshipPolicy"
          element={<GovernmentScholarshipPolicy />}
        />
        <Route
          path="/Admissions/PaymentProcedure"
          element={<PaymentProcedure />}
        />

        {/* Life@IMSEC */}
        <Route path="/Life@IMSEC/Events" element={<Events />} />
        <Route path="/Life@IMSEC/HostelMess" element={<HostelMess />} />
        <Route path="/Life@IMSEC/Auditorium" element={<Auditorium />} />
        <Route path="/Life@IMSEC/cafeteria" element={<Cafeteria />} />
        <Route
          path="/Life@IMSEC/language-communication-lab"
          element={<LanguageCommunicationLab />}
        />
        <Route path="/Life@IMSEC/students-clubs" element={<StudentClubs />} />

        {/* Grievances */}
        <Route
          path="/Grievance/StudentGrievance"
          element={<StudentGrievance />}
        />
        <Route
          path="/Grievance/EmployeeGrievance"
          element={<EmployeeGrievance />}
        />
        <Route
          path="/Grievance/InternalGrievanceCommittee"
          element={<InternalGrievanceCommittee />}
        />
        {/* start iqac */}
        <Route path="/iqac/naac" element={<NAAC />} />
        <Route path="/iqac/nirf" element={<NIRF />} />
        <Route path="/iqac/nba" element={<NBA />} />
        <Route path="/iqac/iqac" element={<IQAC />} />
        <Route path="/iqac/aqar" element={<AQAR />} />
        {/* end iqac */}
        {/* Research */}
        <Route path="/Research/About" element={<About />} />
        <Route path="/Research/ResearchPolicy" element={<ResearchPolicy />} />
        <Route
          path="/Research/ResearchPublications"
          element={<ResearchPublications />}
        />
        <Route
          path="/Research/ConferencePublications"
          element={<ConferencePublications />}
        />
        <Route
          path="/Research/BooksBookChapters"
          element={<BooksBookChapters />}
        />
        <Route path="/Research/Patents" element={<Patents />} />
        <Route
          path="/Research/FacultyDevelopmentPrograms"
          element={<FacultyDevelopmentPrograms />}
        />

        {/*start accreditations */}
        <Route
          path="/accreditations/accreditations"
          element={<Accreditations />}
        />
        <Route
          path="/accreditations/recognition"
          element={<AwardsRankingRatings />}
        />
        {/* end accreditations */}

        {/* Miscellaneous */}
        <Route path="/Announcements" element={<Announcements />} />
        <Route path="/all-committees" element={<AllCommittee />} />
        <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />

        <Route path="/Alumni" element={<Alumni />} />
        <Route path="/career" element={<Career />} />

        <Route path="/career/:openingId" element={<CareerDetails />} />

        <Route
          path="/career/:openingId/apply"
          element={<CareerApplication />}
        />
        <Route
          path="student-welfare/counselling-support"
          element={<CounsellingSupport />}
        />
        <Route
          path="student-welfare/medical-support"
          element={<MedicalSupport />}
        />
        <Route path="student-welfare/gym" element={<Gym />} />
        <Route path="student-welfare/sports" element={<Sports />} />
        <Route
          path="/career/general-application"
          element={<CareerApplication />}
        />
        <Route path="/IMSEC-NewsLetters" element={<Newsletter />} />
        <Route path="/Library" element={<LibraryInMainMenu />} />
        <Route path="/about/OrganizationalChart" element={<IMSGroupImage />} />

        {/* 404 / Fallback Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return <Layout />;
}

export default App;
