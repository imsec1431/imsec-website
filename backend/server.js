import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import heroSliderRoutes from "./routes/heroSliderRoutes.js";
import campusHighlightRoutes from "./routes/campusHighlightRoutes.js";
import universityRankHolderRoutes from "./routes/universityRankHolderRoutes.js";

import alumniRoutes from "./routes/alumniRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

import placementStatRoutes from "./routes/placementStatRoutes.js";
import cdcStructureRoutes from "./routes/cdcStructureRoutes.js";
import cdcTeamRoutes from "./routes/cdcTeamRoutes.js";
import majorRecruiterRoutes from "./routes/majorRecruiterRoutes.js";
import placementNoticeRoutes from "./routes/placementNoticeRoutes.js";
import tpActivityRoutes from "./routes/tpActivityRoutes.js";
import placementRecordRoutes from "./routes/placementRecordRoutes.js";
import trainingInternshipRoutes from "./routes/trainingInternshipRoutes.js";

import placementRoutes from "./routes/placementRoutes.js";

import chairmanRoutes from "./routes/chairmanRoutes.js";

import directorRoutes from "./routes/directorRoutes.js";

import executiveCouncilRoutes from "./routes/executiveCouncilRoutes.js";

import governingCouncilRoutes from "./routes/governingCouncilRoutes.js";

import contactRoutes from "./routes/contactRoutes.js";

import announcementRoutes from "./routes/announcementRoutes.js";

import academicCalendarRoutes from "./routes/academicCalendarRoutes.js";

import teachingLearningProcessRoutes from "./routes/teachingLearningProcessRoutes.js";

import circularNoticeRoutes from "./routes/circularNoticeRoutes.js";

import mouRoutes from "./routes/mouRoutes.js";

import ruleRoutes from "./routes/ruleRoutes.js";

import academicDevelopmentProgramRoutes from "./routes/academicDevelopmentProgramRoutes.js";

import libraryStatisticRoutes from "./routes/libraryStatisticRoutes.js";

import libraryGalleryRoutes from "./routes/libraryGalleryRoutes.js";

import libraryGuidelineRoutes from "./routes/libraryGuidelineRoutes.js";

import libraryTimingRoutes from "./routes/libraryTimingRoutes.js";

import librarianProfileRoutes from "./routes/librarianProfileRoutes.js";

import studentGrievanceRoutes from "./routes/studentGrievanceRoutes.js";

import employeeGrievanceRoutes from "./routes/employeeGrievanceRoutes.js";

import internalGrievanceCommitteeRoutes from "./routes/internalGrievanceCommitteeRoutes.js";

import researchAboutRoutes from "./routes/researchAboutRoutes.js";
import researchPartnerRoutes from "./routes/researchPartnerRoutes.js";
import researchPolicyRoutes from "./routes/researchPolicyRoutes.js";
import conferencePaperContentRoutes from "./routes/conferencePaperContentRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import researchPublicationContentRoutes from "./routes/researchPublicationContentRoutes.js";
import conferencePaperRoutes from "./routes/conferencePaperRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import bookContentRoutes from "./routes/bookContentRoutes.js";
import patentRoutes from "./routes/patentRoutes.js";
import facultyDevelopmentProgramRoutes from "./routes/facultyDevelopmentProgramRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

import departmentRoutes from "./routes/departmentRoutes.js";
import departmentOverviewRoutes from "./routes/departmentOverviewRoutes.js";
import departmentFacultyRoutes from "./routes/departmentFacultyRoutes.js";
import departmentHodMessageRoutes from "./routes/departmentHodMessageRoutes.js";
import departmentAchievementRoutes from "./routes/departmentAchievementRoutes.js";
import departmentPlacementRoutes from "./routes/departmentPlacementRoutes.js";
import departmentAcademicResultRoutes from "./routes/departmentAcademicResultRoutes.js";
import departmentEventRoutes from "./routes/departmentEventRoutes.js";
import departmentInfrastructureRoutes from "./routes/departmentInfrastructureRoutes.js";
import studentCornerRoutes from "./routes/studentCornerRoutes.js";

import imsSocietyRoutes from "./routes/imsSocietyRoutes.js";
import imsGroupRoutes from "./routes/imsGroupRoutes.js";
import imsGroupImageRoutes from "./routes/imsGroupImageRoutes.js";

import placementPolicyRoutes from "./routes/placementPolicyRoutes.js";
import activityCalendarRoutes from "./routes/activityCalendarRoutes.js";

import shiningStarRoutes from "./routes/shiningStarRoutes.js";

import studentHandbookRoutes from "./routes/studentHandbookRoutes.js";

import learningDevelopmentCentreRoutes from "./routes/learningDevelopmentCentreRoutes.js";

import courseRoutes from "./routes/courseRoutes.js";

import allCommitteeRoutes from "./routes/allCommitteeRoutes.js";

import homepagePopupRoutes from "./routes/homepagePopupRoutes.js";

import careerRoutes from "./routes/careerRoutes.js";

import uptacCounsellingRoutes from "./routes/uptacCounsellingRoutes.js";
import admissionProcessRoutes from "./routes/admissionProcessRoutes.js";
import feeStructureRoutes from "./routes/feeStructureRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import governmentScholarshipPolicyRoutes from "./routes/governmentScholarshipPolicyRoutes.js";
import paymentProcedureRoutes from "./routes/paymentProcedureRoutes.js";
import admissionApplicationRoutes from "./routes/admissionApplicationRoutes.js";

import newsTickerRoutes from "./routes/newsTickerRoutes.js";
import socialMediaRoutes from "./routes/socialMediaRoutes.js";
import approvalAffiliationRoutes from "./routes/approvalAffiliationRoutes.js";

import convocationRoutes from "./routes/convocationRoutes.js";

import approvalRoutes from "./routes/approvalRoutes.js";
import welcomeToIMSECRoutes from "./routes/welcomeToIMSECRoutes.js";
import academicMatrixRoutes from "./routes/academicMatrixRoutes.js";

import mandatoryDisclosureRoutes from "./routes/mandatoryDisclosureRoutes.js";
import campusRoutes from "./routes/campusRoutes.js";
import aboutImsecRoutes from "./routes/aboutImsecRoutes.js";
import visionMissionRoutes from "./routes/visionMissionRoutes.js";

import hostelMessRoutes from "./routes/hostelMessRoutes.js";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import cafeteriaRoutes from "./routes/cafeteriaRoutes.js";
import classroomLabRoutes from "./routes/classroomLabRoutes.js";
import languageCommunicationLabRoutes from "./routes/languageCommunicationLabRoutes.js";
import studentClubRoutes from "./routes/studentClubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

import naacRoutes from "./routes/naacRoutes.js";
import nirfRoutes from "./routes/nirfRoutes.js";
import nbaRoutes from "./routes/nbaRoutes.js";

import alumniProfileRoutes from "./routes/alumniProfileRoutes.js";

import counsellingSupportRoutes from "./routes/counsellingSupportRoutes.js";

import medicalSupportRoutes from "./routes/medicalSupportRoutes.js";
import gymRoutes from "./routes/gymRoutes.js";
import sportsRoutes from "./routes/sportsRoutes.js";

import iqacRoutes from "./routes/iqacRoutes.js";
import aqarRoutes from "./routes/aqarRoutes.js";

import industryAcademicsCollaborationRoutes from "./routes/industryAcademicsCollaborationRoutes.js";

import academicCoordinatorRoutes from "./routes/academicCoordinatorRoutes.js";

import accreditationsRoutes from "./routes/accreditationsRoutes.js";
import awardsRankingRatingsRoutes from "./routes/awardsRankingRatingsRoutes.js";
import placementHighlightRoutes from "./routes/placementHighlightRoutes.js";
import departmentAlumniRoutes from "./routes/departmentAlumniRoutes.js";

import departmentResearchAboutRoutes from "./routes/departmentResearchAboutRoutes.js";
import departmentResearchPolicyRoutes from "./routes/departmentResearchPolicyRoutes.js";
import departmentResearchJournalRoutes from "./routes/departmentResearchJournalRoutes.js";
import departmentResearchConferencePaperRoutes from "./routes/departmentResearchConferencePaperRoutes.js";
import departmentResearchBookRoutes from "./routes/departmentResearchBookRoutes.js";
import departmentResearchPatentRoutes from "./routes/departmentResearchPatentRoutes.js";
import departmentResearchFDPRoutes from "./routes/departmentResearchFDPRoutes.js";

import departmentAchievementItemRoutes from "./routes/departmentAchievementItemRoutes.js";
import facultyAchievementItemRoutes from "./routes/facultyAchievementItemRoutes.js";

import subAdminRoutes from "./routes/subAdminRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api", uploadRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/hero-slider", heroSliderRoutes);

app.use("/api/campus-highlights", campusHighlightRoutes);

app.use("/api/university-rank-holders", universityRankHolderRoutes);

app.use("/api/alumni", alumniRoutes);
app.use("/api/achievements", achievementRoutes);

app.use("/api/placement-stats", placementStatRoutes);

app.use("/api/placements", placementRoutes);
app.use("/api/cdc-structure", cdcStructureRoutes);

app.use("/api/chairman", chairmanRoutes);
app.use("/api/director", directorRoutes);

app.use("/api/executive-council", executiveCouncilRoutes);

app.use("/api/governing-council", governingCouncilRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/announcement", announcementRoutes);

app.use("/api/academic-calendar", academicCalendarRoutes);

app.use("/api/circular-notice", circularNoticeRoutes);

app.use("/api/mou", mouRoutes);

app.use("/api/rules", ruleRoutes);

app.use("/api/academic-development-programs", academicDevelopmentProgramRoutes);

app.use("/api/library-statistics", libraryStatisticRoutes);

app.use("/api/library-gallery", libraryGalleryRoutes);

app.use("/api/library-guidelines", libraryGuidelineRoutes);

app.use("/api/library-timings", libraryTimingRoutes);

app.use("/api/librarian-profile", librarianProfileRoutes);

app.use("/api/student-grievance", studentGrievanceRoutes);

app.use("/api/employee-grievance", employeeGrievanceRoutes);

app.use("/api/internal-grievance-committee", internalGrievanceCommitteeRoutes);

app.use("/api/research/about", researchAboutRoutes);

app.use("/api/research/partners", researchPartnerRoutes);

app.use("/api/research/policies", researchPolicyRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/department-overview", departmentOverviewRoutes);

app.use("/api/department-faculty", departmentFacultyRoutes);

app.use("/api/department-hod-message", departmentHodMessageRoutes);

app.use("/api/department-achievements", departmentAchievementRoutes);

app.use("/api/department-placement", departmentPlacementRoutes);

app.use("/api/department-academic-results", departmentAcademicResultRoutes);

app.use("/api/department-events", departmentEventRoutes);

app.use("/api/department-infrastructure", departmentInfrastructureRoutes);

app.use("/api/student-corner", studentCornerRoutes);

app.use("/api/research/journals", journalRoutes);

app.use("/api/research/publication-content", researchPublicationContentRoutes);

app.use("/api/research/conference-papers", conferencePaperRoutes);

app.use("/api/research/conference-paper-content", conferencePaperContentRoutes);

app.use("/api/research/books", bookRoutes);

app.use("/api/research/book-content", bookContentRoutes);

app.use("/api/research/patent", patentRoutes);

app.use("/api/research/fdp", facultyDevelopmentProgramRoutes);

app.use("/api/newsletter", newsletterRoutes);

app.use("/api/ims-society", imsSocietyRoutes);

app.use("/api/ims-group", imsGroupRoutes);

app.use("/api/ims-group-image", imsGroupImageRoutes);

app.use("/api/cdc-team", cdcTeamRoutes);

app.use("/api/major-recruiters", majorRecruiterRoutes);

app.use("/api/placement-notices", placementNoticeRoutes);

app.use("/api/tp-activities", tpActivityRoutes);

app.use("/api/placement-policies", placementPolicyRoutes);

app.use("/api/shining-stars", shiningStarRoutes);

app.use("/api/placement-records", placementRecordRoutes);

app.use("/api/training-internship", trainingInternshipRoutes);

app.use("/api/activity-calendar", activityCalendarRoutes);

app.use("/api/teaching-learning-process", teachingLearningProcessRoutes);

app.use("/api/student-handbooks", studentHandbookRoutes);

app.use("/api/learning-development-centre", learningDevelopmentCentreRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/all-committees", allCommitteeRoutes);

app.use("/api/homepage-popup", homepagePopupRoutes);

app.use("/api/careers", careerRoutes);

app.use("/api/uptac-counselling", uptacCounsellingRoutes);

app.use("/api/admission-process", admissionProcessRoutes);

app.use("/api/fee-structure", feeStructureRoutes);

app.use("/api/faq", faqRoutes);

app.use(
  "/api/government-scholarship-policy",
  governmentScholarshipPolicyRoutes,
);

app.use("/api/payment-procedure", paymentProcedureRoutes);

app.use("/api/admission-application", admissionApplicationRoutes);

app.use("/api/news-ticker", newsTickerRoutes);

app.use("/api/social-media", socialMediaRoutes);

app.use("/api/approvals-affiliations", approvalAffiliationRoutes);

app.use("/api/convocation", convocationRoutes);

app.use("/api/approvals", approvalRoutes);

app.use("/api/welcome-to-imsec", welcomeToIMSECRoutes);

app.use("/api/academic-matrix", academicMatrixRoutes);

app.use("/api/campus", campusRoutes);

app.use("/api/mandatory-disclosure", mandatoryDisclosureRoutes);

app.use("/api/about-imsec", aboutImsecRoutes);

app.use("/api/vision-mission", visionMissionRoutes);

app.use("/api/hostel-mess", hostelMessRoutes);

app.use("/api/auditorium", auditoriumRoutes);

app.use("/api/cafeteria", cafeteriaRoutes);

app.use("/api/classroom-lab", classroomLabRoutes);

app.use("/api/language-communication-lab", languageCommunicationLabRoutes);

app.use("/api/student-clubs", studentClubRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/alumni-profile", alumniProfileRoutes);

app.use("/api/naac", naacRoutes);

app.use("/api/nirf", nirfRoutes);

app.use("/api/nba", nbaRoutes);

app.use("/api/iqac", iqacRoutes);

app.use("/api/medical-support", medicalSupportRoutes);

app.use("/api/counselling-support", counsellingSupportRoutes);

app.use("/api/gym", gymRoutes);

app.use("/api/sports", sportsRoutes);

app.use("/api/aqar", aqarRoutes);

app.use("/api/department-alumni", departmentAlumniRoutes);

app.use("/api/accreditations", accreditationsRoutes);

app.use("/api/awards-ranking-ratings", awardsRankingRatingsRoutes);

app.use(
  "/api/industry-academics-collaboration",
  industryAcademicsCollaborationRoutes,
);

app.use("/api/academic-coordinators", academicCoordinatorRoutes);

app.use("/api/placement-highlights", placementHighlightRoutes);

/* =========================================================
   DEPARTMENT RESEARCH
========================================================= */

app.use("/api/department-research/about", departmentResearchAboutRoutes);

app.use("/api/department-research/policy", departmentResearchPolicyRoutes);

app.use("/api/department-research/journals", departmentResearchJournalRoutes);

app.use(
  "/api/department-research/conference-papers",
  departmentResearchConferencePaperRoutes,
);

app.use("/api/department-research/books", departmentResearchBookRoutes);

app.use("/api/department-research/patents", departmentResearchPatentRoutes);

app.use("/api/department-research/fdps", departmentResearchFDPRoutes);

/* =========================================================
   NEW DEPARTMENT ACHIEVEMENTS
========================================================= */

app.use("/api/department-achievement-items", departmentAchievementItemRoutes);

/* =========================================================
   NEW FACULTY ACHIEVEMENTS
========================================================= */

app.use("/api/faculty-achievement-items", facultyAchievementItemRoutes);

app.use("/api/sub-admins", subAdminRoutes);
/* =========================================================
   UPLOADS
========================================================= */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // console.log(`Server Running on ${PORT}`);
});
