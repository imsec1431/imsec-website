import React from "react";
import "./utils/adminHttp";
import { Routes, Route, Navigate } from "react-router-dom";

/* =========================================================
   AUTH
   ========================================================= */
import SubAdminList from "./pages/subAdmins/SubAdminList";
import SubAdminForm from "./pages/subAdmins/SubAdminForm";
import SubAdminPermissions from "./pages/subAdmins/SubAdminPermissions";

import AccessDenied from "./pages/auth/AccessDenied";
import Login from "./pages/auth/Login";
import VerifyLoginOTP from "./pages/auth/VerifyLoginOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

/* =========================================================
   LAYOUT
   ========================================================= */

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

/* =========================================================
   DASHBOARD
   ========================================================= */

import Dashboard from "./pages/dashboard/Dashboard";
import HomepageDashboard from "./pages/homepage/HomepageDashboard";

/* =========================================================
   HOMEPAGE
   ========================================================= */

import HeroSliderList from "./pages/homepage/hero-slider/HeroSliderList";
import AddHeroSlide from "./pages/homepage/hero-slider/AddHeroSlide";
import EditHeroSlide from "./pages/homepage/hero-slider/EditHeroSlide";

import Approval from "./pages/homepage/Approval/Approval.jsx";

import CampusHighlightsList from "./pages/homepage/campus-highlights/CampusHighlightsList";
import AddCampusHighlight from "./pages/homepage/campus-highlights/AddCampusHighlight";
import EditCampusHighlight from "./pages/homepage/campus-highlights/EditCampusHighlight";

import WelcomeToIMSEC from "./pages/homepage/WelcomeToIMSEC/WelcomeToIMSEC.jsx";
import AcademicMatrix from "./pages/homepage/AcademicMatrix/AcademicMatrix";

import UniversityRankHolderList from "./pages/homepage/university-rank-holder/UniversityRankHolderList";
import AddUniversityRankHolder from "./pages/homepage/university-rank-holder/AddUniversityRankHolder";
import EditUniversityRankHolder from "./pages/homepage/university-rank-holder/EditUniversityRankHolder";

import AlumniList from "./pages/homepage/alumni/AlumniList";
import AddAlumni from "./pages/homepage/alumni/AddAlumni";
import EditAlumni from "./pages/homepage/alumni/EditAlumni";

import AchievementList from "./pages/homepage/achievements/AchievementList";
import AddAchievement from "./pages/homepage/achievements/AddAchievement";
import EditAchievement from "./pages/homepage/achievements/EditAchievement";

import PlacementStatList from "./pages/homepage/placement-stats/PlacementStatList";
import EditPlacementStat from "./pages/homepage/placement-stats/EditPlacementStat";

import PlacementManagement from "./pages/homepage/placements/PlacementManagement";
import AddPlacement from "./pages/homepage/placements/AddPlacement";
import EditPlacement from "./pages/homepage/placements/EditPlacement";

/* =========================================================
   PLACEMENTS
   ========================================================= */

import PlacementNoticeAdmin from "./pages/placements/PlacementNoticeAdmin";
import ShiningStarsAdmin from "./pages/placements/ShiningStarsAdmin";
import TrainingInternship from "./pages/placements/trainingInternship/TrainingInternship";

import PlacementsAdmin from "./pages/placements/PlacementsAdmin.jsx";
import CDCTeamAdmin from "./pages/placements/cdc-team/CDCTeamAdmin";
import MajorRecruitersAdmin from "./pages/placements/MajorRecruitersAdmin";
import TPActivitiesAdmin from "./pages/placements/TPActivitiesAdmin";
import PlacementPolicyAdmin from "./pages/placements/PlacementPolicyAdmin";
import PlacementRecordAdmin from "./pages/placements/PlacementRecordAdmin";
import CDCStructureForm from "./pages/placements/CDCStructureForm.jsx";

/* =========================================================
   ABOUT IMSEC
   ========================================================= */

import AboutIMSEC from "./pages/aboutimsec/AboutIMSEC";
import ChairmanForm from "./pages/aboutimsec/ChairmanForm";
import DirectorForm from "./pages/aboutimsec/DirectorForm";
import ExecutiveCouncilForm from "./pages/aboutimsec/ExecutiveCouncilForm";
import GoverningCouncilForm from "./pages/aboutimsec/GoverningCouncilForm";
import Campus from "./pages/aboutimsec/Campus";
import AboutImsecPage from "./pages/aboutimsec/AboutImsecPage";
import VisionMission from "./pages/aboutimsec/VisionMission";

import IMSSocietyForm from "./pages/aboutimsec/IMSSocietyForm";
import IMSGroupForm from "./pages/aboutimsec/IMSGroupForm";
import IMSGroupImageForm from "./pages/aboutimsec/IMSGroupImageForm";

import ApprovalAffiliation from "./pages/aboutimsec/ApprovalAffiliation.jsx";

/* =========================================================
   CONTACT / ANNOUNCEMENT
   ========================================================= */

import ContactList from "./pages/contact/ContactList";
import AnnouncementManagement from "./pages/announcement/AnnouncementManagement";

/* =========================================================
   ACADEMICS
   ========================================================= */

import AcademicsDashboard from "./pages/academics/AcademicsDashboard";

import StudentHandbook from "./pages/academics/StudentHandbook/StudentHandbook";

import ClassroomLabManagementOfficial from "./pages/academics/classroomLabs/ClassroomLabManagement.jsx";

import AcademicCoordinatorManagement from "./pages/academics/academic-coordinator/AcademicCoordinatorManagement";

import AcademicCalendarManagement from "./pages/academics/academic-calendar/AcademicCalendarManagement";

import LearningDevelopmentCentre from "./pages/academics/LearningDevelopmentCentre/LearningDevelopmentCentre";

import CircularNoticeManagement from "./pages/academics/circular-notice/CircularNoticeManagement";

import TeachingLearningProcess from "./pages/academics/TeachingLearningProcess/TeachingLearningProcess";

import Course from "./pages/academics/Course/Course";

import Convocation from "./pages/academics/Convocation/Convocation.jsx";

import MOUManagement from "./pages/academics/mou/MOUManagement";

import ActivityCalendar from "./pages/academics/ActivityCalendar/ActivityCalendar.jsx";

import RulesManagement from "./pages/academics/rules/RulesManagement";

import AcademicDevelopmentProgramManagement from "./pages/academics/academic-development-program/AcademicDevelopmentProgramManagement";

/* =========================================================
   LIBRARY
   ========================================================= */

import LibraryDashboard from "./pages/library/LibraryDashboard";

import LibraryStatisticsManagement from "./pages/library/statistics/LibraryStatisticsManagement";

import LibraryGalleryManagement from "./pages/library/gallery/LibraryGalleryManagement";

import LibraryGuidelinesManagement from "./pages/library/guidelines/LibraryGuidelinesManagement";

import LibraryTimingsManagement from "./pages/library/timings/LibraryTimingsManagement";

import LibrarianProfileManagement from "./pages/library/librarian/LibrarianProfileManagement";

/* =========================================================
   GRIEVANCE
   ========================================================= */

import GrievanceDashboard from "./pages/grievance/GrievanceDashboard";

import StudentGrievanceManagement from "./pages/grievance/student-grievance/StudentGrievanceManagement";

import EmployeeGrievance from "./pages/grievance/employee-grievance/EmployeeGrievance";

import InternalGrievanceCommittee from "./pages/grievance/internal-grievance-committee/InternalGrievanceCommittee";

/* =========================================================
   RESEARCH - GLOBAL
   ========================================================= */

import ResearchManagement from "./pages/research/ResearchManagement";
import ResearchAbout from "./pages/research/about/ResearchAbout";
import ResearchPolicy from "./pages/research/research-policy/ResearchPolicy";
import JournalManagement from "./pages/research/journals/JournalManagement";
import ConferencePaperManagement from "./pages/research/conference-papers/ConferencePaperManagement";
import BookManagement from "./pages/research/books/BookManagement";
import AdminPatents from "./pages/research/patent/AdminPatents";
import AdminFDP from "./pages/research/fdp/AdminFDP.jsx";

/* =========================================================
   DEPARTMENTS
   ========================================================= */

import DepartmentManagement from "./pages/departments/DepartmentManagement";
import DepartmentForm from "./pages/departments/DepartmentForm";
import DepartmentPage from "./pages/departments/DepartmentPage";

import DepartmentOverview from "./pages/departments/DepartmentOverview";

import DepartmentFaculty from "./pages/departments/DepartmentFaculty";
import DepartmentFacultyForm from "./pages/departments/DepartmentFacultyForm";

import DepartmentHodMessage from "./pages/departments/DepartmentHodMessage";
import DepartmentHodMessageForm from "./pages/departments/DepartmentHodMessageForm";

import DepartmentAchievements from "./pages/departments/DepartmentAchievements.jsx";
import DepartmentPlacement from "./pages/departments/DepartmentPlacement.jsx";
import DepartmentAcademicResults from "./pages/departments/DepartmentAcademicResults.jsx";
import DepartmentEvents from "./pages/departments/DepartmentEvents.jsx";
import Infrastructure from "./pages/departments/Infrastructure";
import StudentCorner from "./pages/departments/StudentCorner";

/* =========================================================
   DEPARTMENT RESEARCH
   ========================================================= */

import DepartmentResearch from "./pages/departments/DepartmentResearch";

import DepartmentResearchAbout from "./pages/departments/DepartmentResearchAbout";
import DepartmentResearchAboutForm from "./pages/departments/DepartmentResearchAboutForm";

import DepartmentResearchBooks from "./pages/departments/DepartmentResearchBooks";

import DepartmentResearchBooksForm from "./pages/departments/DepartmentResearchBooksForm";

import DepartmentResearchPolicy from "./pages/departments/DepartmentResearchPolicy";
import DepartmentResearchPolicyForm from "./pages/departments/DepartmentResearchPolicyForm";

import DepartmentResearchConferencePapers from "./pages/departments/DepartmentResearchConferencePapers";

import DepartmentResearchConferencePapersForm from "./pages/departments/DepartmentResearchConferencePapersForm";

import DepartmentAlumni from "./pages/departments/DepartmentAlumni";
import DepartmentAlumniForm from "./pages/departments/DepartmentAlumniForm";

import DepartmentResearchJournals from "./pages/departments/DepartmentResearchJournals";

import DepartmentResearchJournalsForm from "./pages/departments/DepartmentResearchJournalsForm";

import DepartmentResearchPatents from "./pages/departments/DepartmentResearchPatents";
import DepartmentResearchPatentsForm from "./pages/departments/DepartmentResearchPatentsForm";

import DepartmentResearchFDPs from "./pages/departments/DepartmentResearchFDPs";
import DepartmentResearchFDPsForm from "./pages/departments/DepartmentResearchFDPsForm";

/* =========================================================
   NEWSLETTER
   ========================================================= */

import AdminNewsletter from "./pages/newsLetter/AdminNewsletter.jsx";

/* =========================================================
   OTHER
   ========================================================= */

import AllCommittee from "./pages/AllCommittee/AllCommittee";
import HomepagePopup from "./pages/HomepagePopup/HomepagePopup";

import Careers from "../admin/pages/Careers/Careers.jsx";
import CareerApplicationDetails from "./pages/Careers/CareerApplicationDetails.jsx";

import AdmissionsDashboard from "./pages/admission/AdmissionsDashboard";
import UPTACCounselling from "./pages/admission/UPTACCounselling/UPTACCounselling.jsx";
import AdmissionProcess from "./pages/admission/AdmissionProcess.jsx";
import FeeStructure from "./pages/admission/FeeStructure.jsx";
import FAQ from "./pages/admission/FAQ.jsx";
import GovernmentScholarshipPolicy from "./pages/admission/GovernmentScholarshipPolicy.jsx";
import PaymentProcedure from "./pages/admission/PaymentProcedure.jsx";
import AdmissionApplications from "./pages/admission/AdmissionApplications.jsx";

import SocialMedia from "./pages/SocialMedia/SocialMedia.jsx";

import NewsTicker from "./pages/NewsTicker/NewsTicker.jsx";

import MandatoryDisclosure from "./pages/MandatoryDisclosure/MandatoryDisclosure.jsx";

/* =========================================================
   LIFE @ IMSEC
   ========================================================= */

import LifeImsecDashboard from "./pages/lifeimsec/LifeImsecDashboard";
import HostelMessManagement from "./pages/lifeimsec/HostelMessManagement";
import AuditoriumManagement from "./pages/lifeimsec/AuditoriumManagement";
import CafeteriaManagement from "./pages/lifeimsec/CafeteriaManagement";
import LanguageCommunicationLabManagement from "./pages/lifeimsec/LanguageCommunicationLabManagement";
import StudentClubsManagement from "./pages/lifeimsec/StudentClubsManagement";
import EventsManagement from "./pages/lifeimsec/EventsManagement";

/* =========================================================
   ALUMNI - GLOBAL
   ========================================================= */

import AlumniProfileManagement from "./pages/alumni/AlumniProfileManagement";

/* =========================================================
   IQAC
   ========================================================= */

import IQACDashboard from "./pages/iqac/IQACDashboard";
import NAAC from "./pages/iqac/NAAC";
import NIRF from "./pages/iqac/NIRF";
import NBA from "./pages/iqac/NBA";
import IQAC from "./pages/iqac/IQAC";
import AQAR from "./pages/iqac/AQAR";

/* =========================================================
   COE
   ========================================================= */

import COEDashboard from "./pages/coe/COEDashboard";
import MOUManagementForCoe from "./pages/academics/mou/MOUManagement";
import IndustryAcademicsCollaboration from "./pages/coe/IndustryAcademicsCollaboration";

/* =========================================================
   STUDENT WELFARE
   ========================================================= */

import StudentWelfareDashboard from "./pages/studentWelfare/StudentWelfareDashboard";
import StudentHandbookOfficial from "./pages/studentWelfare/StudentHandbook/StudentHandbook.jsx";
import CounsellingSupport from "./pages/studentWelfare/CounsellingSupport.jsx";
import MedicalSupport from "./pages/studentWelfare/MedicalSupport.jsx";
import Gym from "./pages/studentWelfare/Gym.jsx";
import Sports from "./pages/studentWelfare/Sports.jsx";

/* =========================================================
   ACCREDITATIONS
   ========================================================= */

import AccreditationsDashboard from "./pages/accreditations/AccreditationsDashboard";
import Accreditations from "./pages/accreditations/Accreditations";
import AwardsRankingRatings from "./pages/accreditations/AwardsRankingRatings";

/* =========================================================
   CSS
   ========================================================= */

import "./admin.css";

const AdminApp = () => {
  return (
    <Routes>
      {/* =====================================================
          DEFAULT
          ===================================================== */}

      <Route index element={<Navigate to="login" replace />} />

      {/* =====================================================
          PUBLIC AUTHENTICATION
          ===================================================== */}

      <Route path="login" element={<Login />} />

      <Route path="verify-login-otp" element={<VerifyLoginOTP />} />

      <Route path="forgot-password" element={<ForgotPassword />} />

      <Route path="verify-otp" element={<VerifyOTP />} />

      <Route path="reset-password" element={<ResetPassword />} />

      <Route path="access-denied" element={<AccessDenied />} />

      {/* =====================================================
          PROTECTED ADMIN
          ===================================================== */}

      <Route element={<ProtectedRoute />}>
        {/* =================================================
            ADMIN LAYOUT
            All protected admin pages, including Sub Admin
            management, must stay inside AdminLayout so that
            the Sidebar remains visible.
            ================================================= */}

        <Route element={<AdminLayout />}>
          {/* =================================================
              SUB-ADMIN MANAGEMENT
              ================================================= */}

          <Route path="sub-admins" element={<SubAdminList />} />

          <Route path="sub-admins/add" element={<SubAdminForm />} />

          <Route path="sub-admins/edit/:id" element={<SubAdminForm />} />

          <Route
            path="sub-admins/:id/permissions"
            element={<SubAdminPermissions />}
          />

          {/* =================================================
              CHANGE PASSWORD
              ================================================= */}

          <Route path="change-password" element={<ChangePassword />} />
          {/* =================================================
              ADMISSIONS
              ================================================= */}

          <Route path="admissions" element={<AdmissionsDashboard />} />

          <Route
            path="admissions/uptac-counselling"
            element={<UPTACCounselling />}
          />

          <Route
            path="admissions/admissions-process"
            element={<AdmissionProcess />}
          />

          <Route path="admissions/fee-structure" element={<FeeStructure />} />

          <Route path="admissions/faq" element={<FAQ />} />

          <Route
            path="admissions/government-scholarship-policy"
            element={<GovernmentScholarshipPolicy />}
          />

          <Route
            path="admissions/payment-procedure"
            element={<PaymentProcedure />}
          />

          <Route
            path="admissions/applications"
            element={<AdmissionApplications />}
          />

          {/* =================================================
              IQAC
              ================================================= */}

          <Route path="iqac" element={<IQACDashboard />} />

          <Route path="iqac/naac" element={<NAAC />} />

          <Route path="iqac/nirf" element={<NIRF />} />

          <Route path="iqac/nba" element={<NBA />} />

          <Route path="iqac/iqac" element={<IQAC />} />

          <Route path="iqac/aqar" element={<AQAR />} />

          {/* =================================================
              ACCREDITATIONS
              ================================================= */}

          <Route path="accreditations" element={<AccreditationsDashboard />} />

          <Route
            path="accreditations/accreditations"
            element={<Accreditations />}
          />

          <Route
            path="accreditations/recognition"
            element={<AwardsRankingRatings />}
          />

          {/* =================================================
              COE
              ================================================= */}

          <Route path="coe" element={<COEDashboard />} />

          <Route path="coe/mous" element={<MOUManagementForCoe />} />

          <Route
            path="coe/industry-academics-collaboration"
            element={<IndustryAcademicsCollaboration />}
          />

          {/* =================================================
              STUDENT WELFARE
              ================================================= */}

          <Route path="student-welfare" element={<StudentWelfareDashboard />} />

          <Route
            path="student-welfare/student-handbook"
            element={<StudentHandbookOfficial />}
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

          {/* =================================================
              PLACEMENTS
              ================================================= */}

          <Route path="placements" element={<PlacementsAdmin />} />

          <Route
            path="placements/tp-activities"
            element={<TPActivitiesAdmin />}
          />

          <Route
            path="placements/shining-stars"
            element={<ShiningStarsAdmin />}
          />

          <Route
            path="placements/placement-notices"
            element={<PlacementNoticeAdmin />}
          />

          <Route
            path="placements/major-recruiters"
            element={<MajorRecruitersAdmin />}
          />

          <Route path="placements/cdc-team" element={<CDCTeamAdmin />} />

          <Route
            path="placements/training-internship"
            element={<TrainingInternship />}
          />

          <Route
            path="placements/placement-record"
            element={<PlacementRecordAdmin />}
          />

          <Route
            path="placements/cdc-structure"
            element={<CDCStructureForm />}
          />

          <Route
            path="placements/placement-policy"
            element={<PlacementPolicyAdmin />}
          />

          {/* =================================================
              DEPARTMENTS
              ================================================= */}

          <Route path="departments" element={<DepartmentManagement />} />

          <Route path="departments/add" element={<DepartmentForm />} />

          <Route path="departments/edit/:id" element={<DepartmentForm />} />

          {/* =================================================
              DEPARTMENT HOD MESSAGE
              ================================================= */}

          <Route
            path="departments/:slug/hod-message"
            element={<DepartmentHodMessage />}
          />

          <Route
            path="departments/:slug/hod-message/add"
            element={<DepartmentHodMessageForm />}
          />

          <Route
            path="departments/:slug/hod-message/edit/:id"
            element={<DepartmentHodMessageForm />}
          />

          {/* =================================================
              DEPARTMENT OVERVIEW
              ================================================= */}

          <Route
            path="departments/:slug/overview"
            element={<DepartmentOverview />}
          />

          {/* =================================================
              DEPARTMENT RESEARCH
              ================================================= */}

          <Route
            path="departments/:slug/research"
            element={<DepartmentResearch />}
          />

          <Route
            path="departments/:slug/research/about"
            element={<DepartmentResearchAbout />}
          />

          <Route
            path="departments/:slug/research/about/add"
            element={<DepartmentResearchAboutForm />}
          />

          <Route
            path="departments/:slug/research/about/edit/:id"
            element={<DepartmentResearchAboutForm />}
          />

          <Route
            path="departments/:slug/research/conference-papers"
            element={<DepartmentResearchConferencePapers />}
          />

          <Route
            path="departments/:slug/research/conference-papers/add"
            element={<DepartmentResearchConferencePapersForm />}
          />

          <Route
            path="departments/:slug/research/conference-papers/edit/:id"
            element={<DepartmentResearchConferencePapersForm />}
          />

          <Route
            path="departments/:slug/research/books-chapters"
            element={<DepartmentResearchBooks />}
          />

          <Route
            path="departments/:slug/research/books-chapters/add"
            element={<DepartmentResearchBooksForm />}
          />

          <Route
            path="departments/:slug/research/books-chapters/edit/:id"
            element={<DepartmentResearchBooksForm />}
          />

          <Route
            path="departments/:slug/research/research-policy"
            element={<DepartmentResearchPolicy />}
          />

          <Route
            path="departments/:slug/research/research-policy/add"
            element={<DepartmentResearchPolicyForm />}
          />

          <Route
            path="departments/:slug/research/research-policy/edit/:id"
            element={<DepartmentResearchPolicyForm />}
          />

          <Route
            path="departments/:slug/research/journals"
            element={<DepartmentResearchJournals />}
          />

          <Route
            path="departments/:slug/research/journals/add"
            element={<DepartmentResearchJournalsForm />}
          />

          <Route
            path="departments/:slug/research/journals/edit/:id"
            element={<DepartmentResearchJournalsForm />}
          />

          <Route
            path="departments/:slug/research/patents"
            element={<DepartmentResearchPatents />}
          />

          <Route
            path="departments/:slug/research/patents/add"
            element={<DepartmentResearchPatentsForm />}
          />

          <Route
            path="departments/:slug/research/patents/edit/:id"
            element={<DepartmentResearchPatentsForm />}
          />

          <Route
            path="departments/:slug/research/fdps"
            element={<DepartmentResearchFDPs />}
          />

          <Route
            path="departments/:slug/research/fdps/add"
            element={<DepartmentResearchFDPsForm />}
          />

          <Route
            path="departments/:slug/research/fdps/edit/:id"
            element={<DepartmentResearchFDPsForm />}
          />

          {/* =================================================
              DEPARTMENT ALUMNI
              ================================================= */}

          <Route
            path="departments/:slug/alumni-section"
            element={<DepartmentAlumni />}
          />

          <Route
            path="departments/:slug/alumni-section/add"
            element={<DepartmentAlumniForm />}
          />

          <Route
            path="departments/:slug/alumni-section/edit/:id"
            element={<DepartmentAlumniForm />}
          />

          {/* =================================================
              DEPARTMENT PLACEMENT
              ================================================= */}

          <Route
            path="departments/:slug/placement"
            element={<DepartmentPlacement />}
          />

          {/* =================================================
              DEPARTMENT RESULTS
              ================================================= */}

          <Route
            path="departments/:slug/results"
            element={<DepartmentAcademicResults />}
          />

          {/* =================================================
              DEPARTMENT ACHIEVEMENTS
              ================================================= */}

          <Route
            path="departments/:slug/achievements"
            element={<DepartmentAchievements />}
          />

          {/* =================================================
              DEPARTMENT EVENTS
              ================================================= */}

          <Route
            path="departments/:slug/events"
            element={<DepartmentEvents />}
          />

          {/* =================================================
              DEPARTMENT INFRASTRUCTURE
              ================================================= */}

          <Route
            path="departments/:slug/infrastructure"
            element={<Infrastructure />}
          />

          {/* =================================================
              DEPARTMENT STUDENT CORNER
              ================================================= */}

          <Route
            path="departments/:slug/student-corner"
            element={<StudentCorner />}
          />

          {/* =================================================
              DEPARTMENT FACULTY
              ================================================= */}

          <Route
            path="departments/:slug/faculty/add"
            element={<DepartmentFacultyForm />}
          />

          <Route
            path="departments/:slug/faculty/edit/:id"
            element={<DepartmentFacultyForm />}
          />

          <Route
            path="departments/:slug/faculty"
            element={<DepartmentFaculty />}
          />

          {/* =================================================
              GENERIC DEPARTMENT PAGE
              KEEP THIS LAST
              ================================================= */}

          <Route path="departments/:slug" element={<DepartmentPage />} />

          {/* =================================================
              GLOBAL RESEARCH
              ================================================= */}

          <Route path="research/research-policy" element={<ResearchPolicy />} />

          <Route path="research/about" element={<ResearchAbout />} />

          <Route path="research/journals" element={<JournalManagement />} />

          <Route
            path="research/conference-papers"
            element={<ConferencePaperManagement />}
          />

          <Route path="research/books-chapters" element={<BookManagement />} />

          <Route path="research/patents" element={<AdminPatents />} />

          <Route path="research/fdps" element={<AdminFDP />} />

          <Route path="research/*" element={<ResearchManagement />} />

          {/* =================================================
              GRIEVANCE
              ================================================= */}

          <Route path="grievance/*" element={<GrievanceDashboard />} />

          <Route
            path="grievance/student-grievance"
            element={<StudentGrievanceManagement />}
          />

          <Route
            path="grievance/employee-grievance"
            element={<EmployeeGrievance />}
          />

          <Route
            path="grievance/internal-grievance-committee"
            element={<InternalGrievanceCommittee />}
          />

          {/* =================================================
              LIBRARY
              ================================================= */}

          <Route path="library" element={<LibraryDashboard />} />

          <Route
            path="library/statistics"
            element={<LibraryStatisticsManagement />}
          />

          <Route
            path="library/gallery"
            element={<LibraryGalleryManagement />}
          />

          <Route
            path="library/guidelines"
            element={<LibraryGuidelinesManagement />}
          />

          <Route
            path="library/timings"
            element={<LibraryTimingsManagement />}
          />

          <Route
            path="library/librarian"
            element={<LibrarianProfileManagement />}
          />

          {/* =================================================
              ACADEMICS
              ================================================= */}

          <Route path="academics" element={<AcademicsDashboard />} />

          <Route
            path="academics/academic-development-program"
            element={<AcademicDevelopmentProgramManagement />}
          />

          <Route
            path="academics/learning-development-centre"
            element={<LearningDevelopmentCentre />}
          />

          <Route path="academics/convocation" element={<Convocation />} />

          <Route
            path="academics/student-handbook"
            element={<StudentHandbook />}
          />

          <Route
            path="academics/classroom-labs"
            element={<ClassroomLabManagementOfficial />}
          />

          <Route
            path="academics/academic-coordinator"
            element={<AcademicCoordinatorManagement />}
          />

          <Route
            path="academics/activity-calendar"
            element={<ActivityCalendar />}
          />

          <Route
            path="academics/teaching-learning-process"
            element={<TeachingLearningProcess />}
          />

          <Route path="academics/rules" element={<RulesManagement />} />

          <Route path="academics/mou" element={<MOUManagement />} />

          <Route
            path="academics/circular-notice"
            element={<CircularNoticeManagement />}
          />

          <Route
            path="academics/academic-calendar"
            element={<AcademicCalendarManagement />}
          />

          <Route path="academics/courses" element={<Course />} />

          {/* =================================================
              ANNOUNCEMENT
              ================================================= */}

          <Route path="announcement" element={<AnnouncementManagement />} />

          {/* =================================================
              GLOBAL ALUMNI
              ================================================= */}

          <Route path="alumni-section" element={<AlumniProfileManagement />} />

          {/* =================================================
              NEWS / SOCIAL
              ================================================= */}

          <Route path="news-ticker" element={<NewsTicker />} />

          <Route path="social-media" element={<SocialMedia />} />

          {/* =================================================
              CAREERS
              ================================================= */}

          <Route path="careers" element={<Careers />} />

          <Route
            path="careers/applications/:applicationId"
            element={<CareerApplicationDetails />}
          />

          {/* =================================================
              OTHER
              ================================================= */}

          <Route path="all-committees" element={<AllCommittee />} />

          <Route
            path="mandatory-disclosure"
            element={<MandatoryDisclosure />}
          />

          <Route path="homepage-popup" element={<HomepagePopup />} />

          <Route path="newsletter" element={<AdminNewsletter />} />

          <Route path="contact-us" element={<ContactList />} />

          {/* =================================================
              LIFE @ IMSEC
              ================================================= */}

          <Route path="life-imsec" element={<LifeImsecDashboard />} />

          <Route
            path="life-imsec/hostel-mess"
            element={<HostelMessManagement />}
          />

          <Route
            path="life-imsec/auditorium"
            element={<AuditoriumManagement />}
          />

          <Route
            path="life-imsec/cafeteria"
            element={<CafeteriaManagement />}
          />

          <Route
            path="life-imsec/language-communication-lab"
            element={<LanguageCommunicationLabManagement />}
          />

          <Route
            path="life-imsec/students-clubs"
            element={<StudentClubsManagement />}
          />

          <Route path="life-imsec/events" element={<EventsManagement />} />

          {/* =================================================
              ABOUT IMSEC
              ================================================= */}

          <Route path="about-imsec" element={<AboutIMSEC />} />

          <Route
            path="about-imsec/executive-council"
            element={<ExecutiveCouncilForm />}
          />

          <Route
            path="about-imsec/approvals-affiliations"
            element={<ApprovalAffiliation />}
          />

          <Route
            path="about-imsec/governing-council"
            element={<GoverningCouncilForm />}
          />

          <Route path="about-imsec/director" element={<DirectorForm />} />

          <Route
            path="about-imsec/organizational-chart"
            element={<IMSGroupImageForm />}
          />

          <Route path="about-imsec/chairman" element={<ChairmanForm />} />

          <Route
            path="about-imsec/vision-mission"
            element={<VisionMission />}
          />

          <Route
            path="about-imsec/about-imsec-page"
            element={<AboutImsecPage />}
          />

          <Route path="about-imsec/ims-society" element={<IMSSocietyForm />} />

          <Route path="about-imsec/ims-group" element={<IMSGroupForm />} />

          <Route path="about-imsec/campus" element={<Campus />} />

          {/* =================================================
              DASHBOARD
              ================================================= */}

          <Route path="dashboard" element={<Dashboard />} />

          {/* =================================================
              HOMEPAGE
              ================================================= */}

          <Route path="homepage" element={<HomepageDashboard />} />

          <Route path="homepage/hero-slider" element={<HeroSliderList />} />

          <Route path="homepage/hero-slider/add" element={<AddHeroSlide />} />

          <Route
            path="homepage/hero-slider/edit/:id"
            element={<EditHeroSlide />}
          />

          <Route path="homepage/approval" element={<Approval />} />

          <Route
            path="homepage/welcome-to-imsec"
            element={<WelcomeToIMSEC />}
          />

          <Route path="homepage/academic-matrix" element={<AcademicMatrix />} />

          <Route
            path="homepage/campus-highlights"
            element={<CampusHighlightsList />}
          />

          <Route
            path="homepage/campus-highlights/add"
            element={<AddCampusHighlight />}
          />

          <Route
            path="homepage/campus-highlights/edit/:id"
            element={<EditCampusHighlight />}
          />

          <Route
            path="homepage/university-rank-holder"
            element={<UniversityRankHolderList />}
          />

          <Route
            path="homepage/university-rank-holder/add"
            element={<AddUniversityRankHolder />}
          />

          <Route
            path="homepage/university-rank-holder/edit/:id"
            element={<EditUniversityRankHolder />}
          />

          <Route path="homepage/alumni" element={<AlumniList />} />

          <Route path="homepage/alumni/add" element={<AddAlumni />} />

          <Route path="homepage/alumni/edit/:id" element={<EditAlumni />} />

          <Route path="homepage/achievements" element={<AchievementList />} />

          <Route
            path="homepage/achievements/add"
            element={<AddAchievement />}
          />

          <Route
            path="homepage/achievements/edit/:id"
            element={<EditAchievement />}
          />

          <Route
            path="homepage/placement-stats"
            element={<PlacementStatList />}
          />

          <Route
            path="homepage/placement-stats/edit/:id"
            element={<EditPlacementStat />}
          />

          <Route path="homepage/placements" element={<PlacementManagement />} />

          <Route path="homepage/placements/add" element={<AddPlacement />} />

          <Route
            path="homepage/placements/edit/:id"
            element={<EditPlacement />}
          />
        </Route>
      </Route>

      {/* =====================================================
          FALLBACK
          ===================================================== */}

      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AdminApp;
