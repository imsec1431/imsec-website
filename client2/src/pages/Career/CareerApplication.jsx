import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getPublicCareerOpening,
  submitCareerApplication,
  submitGeneralCareerApplication,
} from "../../services/careerService";

import "./CareerApplication.css";

const CareerApplication = () => {
  const navigate = useNavigate();

  const { openingId } = useParams();

  // ====================================================
  // STATE
  // ====================================================

  const [opening, setOpening] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [resumeFile, setResumeFile] = useState(null);

  // ====================================================
  // MODAL
  // ====================================================

  const [showMessageModal, setShowMessageModal] = useState(false);

  const [messageType, setMessageType] = useState("error");

  const [messageTitle, setMessageTitle] = useState("");

  const [messageText, setMessageText] = useState("");

  // ====================================================
  // SHOW MESSAGE MODAL
  // ====================================================

  const showModalMessage = (type, title, message) => {
    setMessageType(type);

    setMessageTitle(title);

    setMessageText(message);

    setShowMessageModal(true);
  };

  // ====================================================
  // CLOSE MESSAGE MODAL
  // ====================================================

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  // ====================================================
  // FORM
  // ====================================================

  const [form, setForm] = useState({
    candidateName: "",

    dateOfBirth: "",

    mobileNo: "",

    emailId: "",

    tenthDivision: "",

    twelfthPercentage: "",

    twelfthDivision: "",

    graduationStream: "",

    graduationStreamOther: "",

    graduationUniversity: "",

    ugPercentage: "",

    ugDivision: "",

    postGraduationStream: "",

    postGraduationStreamOther: "",

    postGraduationUniversity: "",

    postGraduationSpecialisation: "",

    pgPercentage: "",

    pgDivision: "",

    netQualified: "",

    phdStatus: "",

    phdUniversity: "",

    phdDetail: "",

    phdSpecialisation: "",

    phdRegistrationDate: "",

    phdAwardedOn: "",

    otherQualification: "",

    teachingExperience: "",

    industryExperience: "",

    otherExperience: "",

    totalPublication: "",

    nationalJournals: "",

    internationalJournals: "",

    nationalConference: "",

    internationalConference: "",

    sciIndexed: "",

    scopusIndexed: "",

    ugcCareIndexed: "",

    otherIndexed: "",

    grantReceived: "",

    grantHead: "",

    fundingAgency: "",

    grantAmount: "",
  });

  // ====================================================
  // LOAD OPENING
  // ====================================================

  useEffect(() => {
    const loadOpening = async () => {
      try {
        setLoading(true);

        setError("");

        if (!openingId) {
          setOpening(null);

          return;
        }

        const response = await getPublicCareerOpening(openingId);

        setOpening(response?.data || response);
      } catch (err) {
        console.error("Career opening error:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load this career opening.";

        setError(message);

        showModalMessage("error", "Unable to Load Vacancy", message);
      } finally {
        setLoading(false);
      }
    };

    loadOpening();
  }, [openingId]);

  // ====================================================
  // HANDLE CHANGE
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));

    setError("");

    setSuccess("");

    // --------------------------------------------------
    // Ph.D. STATUS
    // --------------------------------------------------

    if (name === "phdStatus") {
      if (value === "No") {
        setForm((previous) => ({
          ...previous,

          phdStatus: value,

          phdUniversity: "",

          phdDetail: "",

          phdSpecialisation: "",

          phdRegistrationDate: "",

          phdAwardedOn: "",
        }));
      }

      if (value === "Pursuing") {
        setForm((previous) => ({
          ...previous,

          phdStatus: value,

          phdAwardedOn: "",
        }));
      }

      if (value === "Awarded") {
        setForm((previous) => ({
          ...previous,

          phdStatus: value,

          phdRegistrationDate: "",
        }));
      }
    }

    // --------------------------------------------------
    // GRADUATION OTHERS
    // --------------------------------------------------

    if (name === "graduationStream" && value !== "Others") {
      setForm((previous) => ({
        ...previous,

        graduationStreamOther: "",
      }));
    }

    // --------------------------------------------------
    // PG OTHERS
    // --------------------------------------------------

    if (name === "postGraduationStream" && value !== "Others") {
      setForm((previous) => ({
        ...previous,

        postGraduationStreamOther: "",
      }));
    }

    // --------------------------------------------------
    // GRANT
    // --------------------------------------------------

    if (name === "grantReceived" && value === "No") {
      setForm((previous) => ({
        ...previous,

        grantHead: "",

        fundingAgency: "",

        grantAmount: "",
      }));
    }
  };

  // ====================================================
  // RESUME
  // ====================================================

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    setSuccess("");

    if (!file) {
      setResumeFile(null);

      return;
    }

    const allowedTypes = [
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setResumeFile(null);

      event.target.value = "";

      showModalMessage(
        "error",
        "Invalid File",
        "Only PDF, DOC and DOCX files are allowed.",
      );

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setResumeFile(null);

      event.target.value = "";

      showModalMessage(
        "error",
        "File Too Large",
        "CV / Resume must not exceed 5 MB.",
      );

      return;
    }

    setResumeFile(file);
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {
    if (!form.candidateName.trim()) {
      return "Please enter your name.";
    }

    if (!form.dateOfBirth) {
      return "Please enter your date of birth.";
    }

    if (!/^[6-9]\d{9}$/.test(form.mobileNo.trim())) {
      return "Please enter a valid 10 digit mobile number.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.emailId.trim())) {
      return "Please enter a valid email address.";
    }

    // ==================================================
    // 10TH
    // ==================================================

    if (!form.tenthDivision) {
      return "Please select your 10th division.";
    }

    // ==================================================
    // 12TH
    // ==================================================

    if (form.twelfthPercentage === "") {
      return "Please enter your 12th percentage.";
    }

    if (
      Number(form.twelfthPercentage) < 0 ||
      Number(form.twelfthPercentage) > 100
    ) {
      return "12th percentage must be between 0 and 100.";
    }

    if (!form.twelfthDivision) {
      return "Please select your 12th division.";
    }

    // ==================================================
    // GRADUATION
    // ==================================================

    if (!form.graduationStream) {
      return "Please select your graduation stream.";
    }

    if (
      form.graduationStream === "Others" &&
      !form.graduationStreamOther.trim()
    ) {
      return "Please enter your graduation stream.";
    }

    if (!form.graduationUniversity.trim()) {
      return "Please enter your graduation university.";
    }

    if (form.ugPercentage === "") {
      return "Please enter your graduation percentage.";
    }

    if (Number(form.ugPercentage) < 0 || Number(form.ugPercentage) > 100) {
      return "Graduation percentage must be between 0 and 100.";
    }

    if (!form.ugDivision) {
      return "Please select your graduation division.";
    }

    // ==================================================
    // POST GRADUATION
    // ==================================================

    if (!form.postGraduationStream) {
      return "Please select your post-graduation stream.";
    }

    if (
      form.postGraduationStream === "Others" &&
      !form.postGraduationStreamOther.trim()
    ) {
      return "Please enter your post-graduation stream.";
    }

    if (!form.postGraduationUniversity.trim()) {
      return "Please enter your post-graduation university.";
    }

    if (!form.postGraduationSpecialisation.trim()) {
      return "Please enter your post-graduation specialisation.";
    }

    if (form.pgPercentage === "") {
      return "Please enter your post-graduation percentage.";
    }

    if (Number(form.pgPercentage) < 0 || Number(form.pgPercentage) > 100) {
      return "Post-graduation percentage must be between 0 and 100.";
    }

    if (!form.pgDivision) {
      return "Please select your post-graduation division.";
    }

    // ==================================================
    // NET
    // ==================================================

    if (!form.netQualified) {
      return "Please select your NET qualification status.";
    }

    // ==================================================
    // Ph.D.
    // ==================================================

    if (!form.phdStatus) {
      return "Please select your Ph.D. status.";
    }

    // --------------------------------------------------
    // PURSUING / AWARDED
    // --------------------------------------------------

    if (form.phdStatus === "Pursuing" || form.phdStatus === "Awarded") {
      if (!form.phdUniversity.trim()) {
        return "Please enter your Ph.D. university.";
      }

      if (!form.phdSpecialisation.trim()) {
        return "Please enter your Ph.D. specialisation.";
      }

      if (!form.phdDetail.trim()) {
        return "Please enter your Ph.D. details.";
      }
    }

    // --------------------------------------------------
    // PURSUING
    //
    // Registration Date REQUIRED
    // Awarded On NOT REQUIRED
    // --------------------------------------------------

    if (form.phdStatus === "Pursuing") {
      if (!form.phdRegistrationDate) {
        return "Please enter your Ph.D. registration date.";
      }
    }

    // --------------------------------------------------
    // AWARDED
    //
    // Registration Date NOT REQUIRED
    // Awarded On REQUIRED
    // --------------------------------------------------

    if (form.phdStatus === "Awarded") {
      if (!form.phdAwardedOn) {
        return "Please enter the date your Ph.D. was awarded.";
      }
    }

    // ==================================================
    // GRANT
    // ==================================================

    if (!form.grantReceived) {
      return "Please select whether you have received a grant.";
    }

    if (form.grantReceived === "Yes") {
      if (!form.grantHead.trim()) {
        return "Please enter the grant head.";
      }

      if (!form.fundingAgency.trim()) {
        return "Please enter the funding agency.";
      }

      if (form.grantAmount === "") {
        return "Please enter the grant amount.";
      }

      if (Number(form.grantAmount) < 0) {
        return "Grant amount cannot be negative.";
      }
    }

    // ==================================================
    // CV
    // ==================================================

    if (!resumeFile) {
      return "Please upload your CV / Resume.";
    }

    return "";
  };

  // ====================================================
  // RESET FORM
  // ====================================================

  const resetForm = () => {
    setForm({
      candidateName: "",

      dateOfBirth: "",

      mobileNo: "",

      emailId: "",

      tenthDivision: "",

      twelfthPercentage: "",

      twelfthDivision: "",

      graduationStream: "",

      graduationStreamOther: "",

      graduationUniversity: "",

      ugPercentage: "",

      ugDivision: "",

      postGraduationStream: "",

      postGraduationStreamOther: "",

      postGraduationUniversity: "",

      postGraduationSpecialisation: "",

      pgPercentage: "",

      pgDivision: "",

      netQualified: "",

      phdStatus: "",

      phdUniversity: "",

      phdDetail: "",

      phdSpecialisation: "",

      phdRegistrationDate: "",

      phdAwardedOn: "",

      otherQualification: "",

      teachingExperience: "",

      industryExperience: "",

      otherExperience: "",

      totalPublication: "",

      nationalJournals: "",

      internationalJournals: "",

      nationalConference: "",

      internationalConference: "",

      sciIndexed: "",

      scopusIndexed: "",

      ugcCareIndexed: "",

      otherIndexed: "",

      grantReceived: "",

      grantHead: "",

      fundingAgency: "",

      grantAmount: "",
    });

    setResumeFile(null);

    const fileInput = document.getElementById("career-resume");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      showModalMessage("error", "Please Check Your Form", validationError);

      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      // =================================================
      // PERSONAL
      // =================================================

      formData.append("candidateName", form.candidateName.trim());

      formData.append("dateOfBirth", form.dateOfBirth);

      formData.append("mobileNo", form.mobileNo.trim());

      formData.append("emailId", form.emailId.trim());

      // =================================================
      // 10TH / 12TH
      // =================================================

      formData.append("tenthDivision", form.tenthDivision);

      formData.append("twelfthPercentage", form.twelfthPercentage);

      formData.append("twelfthDivision", form.twelfthDivision);

      // =================================================
      // GRADUATION
      // =================================================

      formData.append("graduationStream", form.graduationStream);

      formData.append(
        "graduationStreamOther",
        form.graduationStreamOther.trim(),
      );

      formData.append("graduationUniversity", form.graduationUniversity.trim());

      formData.append("ugPercentage", form.ugPercentage);

      formData.append("ugDivision", form.ugDivision);

      // =================================================
      // POST GRADUATION
      // =================================================

      formData.append("postGraduationStream", form.postGraduationStream);

      formData.append(
        "postGraduationStreamOther",
        form.postGraduationStreamOther.trim(),
      );

      formData.append(
        "postGraduationUniversity",
        form.postGraduationUniversity.trim(),
      );

      formData.append(
        "postGraduationSpecialisation",
        form.postGraduationSpecialisation.trim(),
      );

      formData.append("pgPercentage", form.pgPercentage);

      formData.append("pgDivision", form.pgDivision);

      // =================================================
      // NET
      // =================================================

      formData.append("netQualified", form.netQualified);

      // =================================================
      // Ph.D.
      // =================================================

      formData.append("phdStatus", form.phdStatus);

      if (form.phdStatus === "Pursuing" || form.phdStatus === "Awarded") {
        formData.append("phdUniversity", form.phdUniversity.trim());

        formData.append("phdSpecialisation", form.phdSpecialisation.trim());

        formData.append("phdDetail", form.phdDetail.trim());
      }

      // Pursuing ONLY

      if (form.phdStatus === "Pursuing") {
        formData.append("phdRegistrationDate", form.phdRegistrationDate);
      }

      // Awarded ONLY

      if (form.phdStatus === "Awarded") {
        formData.append("phdAwardedOn", form.phdAwardedOn);
      }

      // =================================================
      // OTHER QUALIFICATION
      // =================================================

      formData.append("otherQualification", form.otherQualification.trim());

      // =================================================
      // EXPERIENCE
      // =================================================

      formData.append("teachingExperience", form.teachingExperience.trim());

      formData.append("industryExperience", form.industryExperience.trim());

      formData.append("otherExperience", form.otherExperience.trim());

      // =================================================
      // PUBLICATIONS
      // =================================================

      formData.append("totalPublication", form.totalPublication || 0);

      formData.append("nationalJournals", form.nationalJournals || 0);

      formData.append("internationalJournals", form.internationalJournals || 0);

      formData.append("nationalConference", form.nationalConference || 0);

      formData.append(
        "internationalConference",
        form.internationalConference || 0,
      );

      formData.append("sciIndexed", form.sciIndexed || 0);

      formData.append("scopusIndexed", form.scopusIndexed || 0);

      formData.append("ugcCareIndexed", form.ugcCareIndexed || 0);

      formData.append("otherIndexed", form.otherIndexed || 0);

      // =================================================
      // GRANT
      // =================================================

      formData.append("grantReceived", form.grantReceived);

      if (form.grantReceived === "Yes") {
        formData.append("grantHead", form.grantHead.trim());

        formData.append("fundingAgency", form.fundingAgency.trim());

        formData.append("grantAmount", form.grantAmount);
      }

      // =================================================
      // CV
      // =================================================

      formData.append("resumeFile", resumeFile);

      // =================================================
      // SUBMIT
      // =================================================

      let response;

      if (openingId) {
        response = await submitCareerApplication(openingId, formData);
      } else {
        response = await submitGeneralCareerApplication(formData);
      }

      const successMessage =
        response?.message ||
        "Your application has been submitted successfully.";

      setSuccess(successMessage);

      // =================================================
      // RESET
      // =================================================

      resetForm();

      // =================================================
      // SUCCESS MODAL
      // =================================================

      showModalMessage("success", "Application Submitted", successMessage);
    } catch (err) {
      console.error("Career application submission error:", err);

      const serverMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to submit your application.";

      setError(serverMessage);

      showModalMessage("error", "Application Failed", serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="careerApplicationPage">
        <div className="careerApplicationLoading">
          <div className="careerApplicationSpinner" />

          <p>Loading career application...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR PAGE
  // ====================================================

  if (openingId && error && !opening) {
    return (
      <div className="careerApplicationPage">
        <div className="careerApplicationError">
          <h2>Unable to load vacancy</h2>

          <p>{error}</p>

          <button type="button" onClick={() => navigate("/career")}>
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="careerApplicationPage">
      <div className="careerApplicationContainer">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="careerApplicationHeader">
          <button
            type="button"
            className="careerBackButton"
            onClick={() => navigate("/career")}
          >
            ← Back to Careers
          </button>

          <span className="careerApplicationEyebrow">CAREER APPLICATION</span>

          <h1>{opening?.title || "Submit Your Profile"}</h1>

          {opening && (
            <p>
              {opening.department || "IMSEC"}

              {opening.location ? ` • ${opening.location}` : ""}
            </p>
          )}
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit} noValidate>
          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 01</span>

              <h2>Personal Details</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>Candidate Name *</label>

                <input
                  type="text"
                  name="candidateName"
                  value={form.candidateName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="careerFormField">
                <label>Date of Birth *</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField">
                <label>Mobile Number *</label>

                <input
                  type="tel"
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className="careerFormField">
                <label>Email Address *</label>

                <input
                  type="email"
                  name="emailId"
                  value={form.emailId}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              SCHOOL
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 02</span>

              <h2>School Education</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>10th Division *</label>

                <select
                  name="tenthDivision"
                  value={form.tenthDivision}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>

                  <option value="First">First</option>

                  <option value="Second">Second</option>

                  <option value="Third">Third</option>
                </select>
              </div>

              <div className="careerFormField">
                <label>12th Percentage *</label>

                <input
                  type="number"
                  name="twelfthPercentage"
                  value={form.twelfthPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Percentage"
                />
              </div>

              <div className="careerFormField">
                <label>12th Division *</label>

                <select
                  name="twelfthDivision"
                  value={form.twelfthDivision}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>

                  <option value="First">First</option>

                  <option value="Second">Second</option>

                  <option value="Third">Third</option>
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              GRADUATION
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 03</span>

              <h2>Graduation</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>Graduation Stream *</label>

                <select
                  name="graduationStream"
                  value={form.graduationStream}
                  onChange={handleChange}
                >
                  <option value="">Select Stream</option>

                  <option value="B.Tech">B.Tech</option>

                  <option value="BBA">BBA</option>

                  <option value="BCA">BCA</option>

                  <option value="BA">BA</option>

                  <option value="B.Com">B.Com</option>

                  <option value="Others">Others</option>
                </select>
              </div>

              {form.graduationStream === "Others" && (
                <div className="careerFormField">
                  <label>Other Graduation Stream *</label>

                  <input
                    type="text"
                    name="graduationStreamOther"
                    value={form.graduationStreamOther}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="careerFormField">
                <label>University *</label>

                <input
                  type="text"
                  name="graduationUniversity"
                  value={form.graduationUniversity}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField">
                <label>UG Percentage *</label>

                <input
                  type="number"
                  name="ugPercentage"
                  value={form.ugPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="careerFormField">
                <label>UG Division *</label>

                <select
                  name="ugDivision"
                  value={form.ugDivision}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>

                  <option value="First">First</option>

                  <option value="Second">Second</option>

                  <option value="Third">Third</option>
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              POST GRADUATION
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 04</span>

              <h2>Post Graduation</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>Post Graduation Stream *</label>

                <select
                  name="postGraduationStream"
                  value={form.postGraduationStream}
                  onChange={handleChange}
                >
                  <option value="">Select Stream</option>

                  <option value="M.Tech">M.Tech</option>

                  <option value="MCA">MCA</option>

                  <option value="MBA">MBA</option>

                  <option value="Others">Others</option>
                </select>
              </div>

              {form.postGraduationStream === "Others" && (
                <div className="careerFormField">
                  <label>Other PG Stream *</label>

                  <input
                    type="text"
                    name="postGraduationStreamOther"
                    value={form.postGraduationStreamOther}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="careerFormField">
                <label>PG University *</label>

                <input
                  type="text"
                  name="postGraduationUniversity"
                  value={form.postGraduationUniversity}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField">
                <label>PG Specialisation *</label>

                <input
                  type="text"
                  name="postGraduationSpecialisation"
                  value={form.postGraduationSpecialisation}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField">
                <label>PG Percentage *</label>

                <input
                  type="number"
                  name="pgPercentage"
                  value={form.pgPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="careerFormField">
                <label>PG Division *</label>

                <select
                  name="pgDivision"
                  value={form.pgDivision}
                  onChange={handleChange}
                >
                  <option value="">Select Division</option>

                  <option value="First">First</option>

                  <option value="Second">Second</option>

                  <option value="Third">Third</option>
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              RESEARCH / PHD
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 05</span>

              <h2>Research Qualification</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>NET Qualified *</label>

                <select
                  name="netQualified"
                  value={form.netQualified}
                  onChange={handleChange}
                >
                  <option value="">Select</option>

                  <option value="Yes">Yes</option>

                  <option value="No">No</option>
                </select>
              </div>

              <div className="careerFormField">
                <label>Ph.D. Status *</label>

                <select
                  name="phdStatus"
                  value={form.phdStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Ph.D. Status</option>

                  <option value="No">No</option>

                  <option value="Pursuing">Pursuing</option>

                  <option value="Awarded">Awarded</option>
                </select>
              </div>

              {(form.phdStatus === "Pursuing" ||
                form.phdStatus === "Awarded") && (
                <>
                  <div className="careerFormField">
                    <label>Ph.D. University *</label>

                    <input
                      type="text"
                      name="phdUniversity"
                      value={form.phdUniversity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="careerFormField">
                    <label>Ph.D. Specialisation *</label>

                    <input
                      type="text"
                      name="phdSpecialisation"
                      value={form.phdSpecialisation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="careerFormField careerFormFieldFull">
                    <label>Ph.D. Details *</label>

                    <textarea
                      name="phdDetail"
                      value={form.phdDetail}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  {form.phdStatus === "Pursuing" && (
                    <div className="careerFormField">
                      <label>Ph.D. Registration Date *</label>

                      <input
                        type="date"
                        name="phdRegistrationDate"
                        value={form.phdRegistrationDate}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {form.phdStatus === "Awarded" && (
                    <div className="careerFormField">
                      <label>Ph.D. Awarded On *</label>

                      <input
                        type="date"
                        name="phdAwardedOn"
                        value={form.phdAwardedOn}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 06</span>

              <h2>Experience</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>Teaching Experience</label>

                <input
                  type="text"
                  name="teachingExperience"
                  value={form.teachingExperience}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField">
                <label>Industry Experience</label>

                <input
                  type="text"
                  name="industryExperience"
                  value={form.industryExperience}
                  onChange={handleChange}
                />
              </div>

              <div className="careerFormField careerFormFieldFull">
                <label>Other Experience</label>

                <textarea
                  name="otherExperience"
                  value={form.otherExperience}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              PUBLICATIONS
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 07</span>

              <h2>Publications</h2>
            </div>

            <div className="careerFormGrid">
              {[
                ["totalPublication", "Total Publications"],

                ["nationalJournals", "National Journals"],

                ["internationalJournals", "International Journals"],

                ["nationalConference", "National Conferences"],

                ["internationalConference", "International Conferences"],

                ["sciIndexed", "SCI Indexed"],

                ["scopusIndexed", "Scopus Indexed"],

                ["ugcCareIndexed", "UGC CARE Indexed"],

                ["otherIndexed", "Other Indexed"],
              ].map(([name, label]) => (
                <div className="careerFormField" key={name}>
                  <label>{label}</label>

                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              OTHER QUALIFICATION
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 08</span>

              <h2>Other Qualification</h2>
            </div>

            <div className="careerFormField">
              <label>Other Qualification</label>

              <textarea
                name="otherQualification"
                value={form.otherQualification}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </section>

          {/* =================================================
              GRANTS
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 09</span>

              <h2>Research Grants</h2>
            </div>

            <div className="careerFormGrid">
              <div className="careerFormField">
                <label>Grant Received *</label>

                <select
                  name="grantReceived"
                  value={form.grantReceived}
                  onChange={handleChange}
                >
                  <option value="">Select</option>

                  <option value="Yes">Yes</option>

                  <option value="No">No</option>
                </select>
              </div>

              {form.grantReceived === "Yes" && (
                <>
                  <div className="careerFormField">
                    <label>Grant Head *</label>

                    <input
                      type="text"
                      name="grantHead"
                      value={form.grantHead}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="careerFormField">
                    <label>Funding Agency *</label>

                    <input
                      type="text"
                      name="fundingAgency"
                      value={form.fundingAgency}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="careerFormField">
                    <label>Grant Amount *</label>

                    <input
                      type="number"
                      name="grantAmount"
                      value={form.grantAmount}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* =================================================
              CV
          ================================================= */}

          <section className="careerFormSection">
            <div className="careerFormSectionTitle">
              <span>STEP 10</span>

              <h2>Upload CV / Resume</h2>
            </div>

            <div className="careerResumeUpload">
              <label htmlFor="career-resume" className="careerResumeUploadBox">
                <span className="careerResumeIcon">↑</span>

                <strong>
                  {resumeFile ? resumeFile.name : "Upload your CV / Resume"}
                </strong>

                <small>PDF, DOC or DOCX • Maximum 5 MB</small>
              </label>

              <input
                id="career-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                hidden
              />
            </div>
          </section>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="careerApplicationSubmit">
            <button
              type="submit"
              disabled={submitting}
              className="careerSubmitButton"
            >
              {submitting
                ? "Submitting..."
                : openingId
                  ? "Submit Application"
                  : "Submit Profile to HR"}
            </button>
          </div>
        </form>

        {/* =================================================
            BOOTSTRAP MESSAGE MODAL
        ================================================= */}

        {showMessageModal && (
          <>
            <div
              className="modal fade show careerMessageModal"
              role="dialog"
              aria-modal="true"
              style={{
                display: "block",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content careerMessageModalContent">
                  {/* HEADER */}

                  <div className="modal-header">
                    <div className="careerMessageHeader">
                      <div
                        className={`careerMessageIcon ${
                          messageType === "success"
                            ? "careerMessageIconSuccess"
                            : "careerMessageIconError"
                        }`}
                      >
                        {messageType === "success" ? "✓" : "!"}
                      </div>

                      <div>
                        <h5 className="modal-title">{messageTitle}</h5>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeMessageModal}
                    />
                  </div>

                  {/* BODY */}

                  <div className="modal-body">
                    <p className="careerMessageText">{messageText}</p>
                  </div>

                  {/* FOOTER */}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className={`btn ${
                        messageType === "success" ? "btn-success" : "btn-danger"
                      } careerMessageButton`}
                      onClick={closeMessageModal}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal-backdrop fade show careerMessageBackdrop"
              onClick={closeMessageModal}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CareerApplication;
