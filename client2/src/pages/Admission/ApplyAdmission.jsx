import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "./ApplyAdmission.css";

/* =========================================================
   API
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/admission-application/public`;

/* =========================================================
   OPTIONS
========================================================= */

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS"];
const PROGRAMME_OPTIONS = ["B.Tech", "MCA", "MBA"];

const BRANCH_OPTIONS = [
  { value: "BT", label: "BT" },
  { value: "CS", label: "CS" },
  { value: "CSE", label: "CSE" },
  { value: "CSE-AIML", label: "CSE AIML" },
  { value: "CSD", label: "CSD" },
  { value: "ECE", label: "ECE" },
  { value: "IT", label: "IT" },
  { value: "Other", label: "Other" },
];

/* =========================================================
   VALIDATION RULES
========================================================= */

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PIN_REGEX = /^\d{6}$/;
const YEAR_REGEX = /^\d{4}$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]*$/;
const BLOOD_GROUP_REGEX = /^(A|B|AB|O)[+-]$/i;
const PERCENTAGE_REGEX = /^(100(?:\.0{1,2})?|(?:\d{1,2})(?:\.\d{1,2})?)\s*%?$/;
const NON_NEGATIVE_NUMBER_REGEX = /^\d+(?:\.\d+)?$/;
const POSITIVE_INTEGER_REGEX = /^[1-9]\d*$/;
const CURRENT_YEAR = new Date().getFullYear();

const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

const isFutureDate = (value) => {
  if (!isValidDate(value)) return false;
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected > today;
};

const getAge = (value) => {
  if (!isValidDate(value)) return null;
  const dob = new Date(`${value}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const cleanDigits = (value) => String(value || "").replace(/\D/g, "");
const cleanName = (value) => String(value || "").replace(/[^A-Za-z .'-]/g, "");
const cleanNumber = (value) => String(value || "").replace(/[^0-9.]/g, "");

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM = {
  /* PERSONAL DETAILS */
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  alternateMobile: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  category: "",
  nationality: "Indian",
  aadhaar: "",

  /* PARENT DETAILS */
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  annualIncome: "",
  religion: "",

  /* ADDRESS */
  address: "",
  state: "",
  district: "",
  city: "",
  pinCode: "",

  /* 10TH */
  board10: "",
  school10: "",
  roll10: "",
  year10: "",
  marks10: "",
  medium10: "",

  /* 12TH */
  board12: "",
  school12: "",
  roll12: "",
  year12: "",
  marks12: "",
  stream12: "",

  /* GRADUATION */
  graduationUniversity: "",
  graduationCollege: "",
  graduationProgramme: "",
  graduationBranch: "",
  graduationYear: "",
  graduationMarks: "",

  /* ENTRANCE EXAM */
  entranceExam: "",
  entranceAppNo: "",
  entranceRollNo: "",
  entranceRank: "",
  entranceScore: "",
  entranceYear: "",
  achievements: "",

  /* ADMISSION */
  programme: "",
  branch: "",
  branchOther: "",
  admissionType: "",
  session: "2026-27",
  hostel: "No",
  scholarship: "No",

  /* DECLARATION */
  declarationAccepted: false,
};

/* =========================================================
   COMPONENT
========================================================= */

const ApplyAdmission = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(true);

  /* =======================================================
     HANDLE CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (
      [
        "mobile",
        "alternateMobile",
        "aadhaar",
        "pinCode",
        "year10",
        "year12",
        "graduationYear",
        "entranceYear",
        "entranceRank",
      ].includes(name)
    ) {
      nextValue = cleanDigits(nextValue);
    }

    if (
      [
        "firstName",
        "middleName",
        "lastName",
        "fatherName",
        "motherName",
      ].includes(name)
    ) {
      nextValue = cleanName(nextValue);
    }

    if (
      [
        "annualIncome",
        "marks10",
        "marks12",
        "graduationMarks",
        "entranceScore",
      ].includes(name)
    ) {
      nextValue = cleanNumber(nextValue);
    }

    if (["mobile", "alternateMobile"].includes(name))
      nextValue = nextValue.slice(0, 10);
    if (name === "aadhaar") nextValue = nextValue.slice(0, 12);
    if (name === "pinCode") nextValue = nextValue.slice(0, 6);
    if (["year10", "year12", "graduationYear", "entranceYear"].includes(name))
      nextValue = nextValue.slice(0, 4);

    setFormData((previous) => ({ ...previous, [name]: nextValue }));
    setError("");
    setSuccess("");
  };

  /* =======================================================
     VALIDATE
  ======================================================= */

  const validateForm = () => {
    const value = (field) => String(formData[field] || "").trim();

    if (!value("firstName")) return "First Name is required.";
    if (value("firstName").length < 2)
      return "First Name must contain at least 2 characters.";
    if (!NAME_REGEX.test(value("firstName")))
      return "First Name can contain only letters, spaces, apostrophe and hyphen.";
    if (value("middleName") && !NAME_REGEX.test(value("middleName")))
      return "Middle Name contains invalid characters.";
    if (value("lastName") && !NAME_REGEX.test(value("lastName")))
      return "Last Name contains invalid characters.";

    if (!value("email")) return "Email is required.";
    if (!EMAIL_REGEX.test(value("email")))
      return "Please enter a valid email address.";

    if (!value("mobile")) return "Mobile number is required.";
    if (!MOBILE_REGEX.test(value("mobile")))
      return "Mobile number must be exactly 10 digits and start with 6, 7, 8 or 9.";

    if (value("alternateMobile")) {
      if (!MOBILE_REGEX.test(value("alternateMobile")))
        return "Alternate Mobile must be exactly 10 digits and start with 6, 7, 8 or 9.";
      if (value("alternateMobile") === value("mobile"))
        return "Alternate Mobile must be different from Mobile number.";
    }

    if (value("dob")) {
      if (!isValidDate(value("dob")) || isFutureDate(value("dob")))
        return "Please enter a valid Date of Birth that is not in the future.";
      const age = getAge(value("dob"));
      if (age !== null && (age < 14 || age > 100))
        return "Please enter a valid Date of Birth.";
    }

    if (!formData.gender) return "Please select Gender.";
    if (!GENDER_OPTIONS.includes(formData.gender))
      return "Invalid Gender selected.";
    if (value("bloodGroup") && !BLOOD_GROUP_REGEX.test(value("bloodGroup")))
      return "Please enter a valid Blood Group, for example A+, B-, AB+ or O-.";
    if (!formData.category) return "Please select Category.";
    if (!CATEGORY_OPTIONS.includes(formData.category))
      return "Invalid Category selected.";
    if (value("nationality") && !/^[A-Za-z .'-]+$/.test(value("nationality")))
      return "Nationality contains invalid characters.";
    if (value("aadhaar") && !AADHAAR_REGEX.test(value("aadhaar")))
      return "Aadhaar Number must be exactly 12 digits.";

    if (!value("fatherName")) return "Father's Name is required.";
    if (!NAME_REGEX.test(value("fatherName")))
      return "Father's Name contains invalid characters.";
    if (value("motherName") && !NAME_REGEX.test(value("motherName")))
      return "Mother's Name contains invalid characters.";
    if (
      value("annualIncome") &&
      !NON_NEGATIVE_NUMBER_REGEX.test(value("annualIncome"))
    )
      return "Annual Family Income must contain numbers only.";

    if (value("address") && value("address").length < 10)
      return "Address must contain at least 10 characters.";
    if (value("pinCode") && !PIN_REGEX.test(value("pinCode")))
      return "PIN Code must be exactly 6 digits.";

    const required10thFields = [
      ["board10", "10th Board"],
      ["school10", "10th School"],
      ["roll10", "10th Roll Number"],
      ["year10", "10th Passing Year"],
      ["marks10", "10th Marks / Percentage"],
      ["medium10", "10th Medium"],
    ];
    for (const [field, label] of required10thFields) {
      if (!value(field)) return `${label} is required.`;
    }
    if (!YEAR_REGEX.test(value("year10")))
      return "10th Passing Year must be a 4-digit year.";
    const year10 = Number(value("year10"));
    if (year10 < 1900 || year10 > CURRENT_YEAR)
      return `10th Passing Year must be between 1900 and ${CURRENT_YEAR}.`;
    if (!PERCENTAGE_REGEX.test(value("marks10")))
      return "10th Marks / Percentage must be a valid value between 0 and 100.";

    const required12thFields = [
      ["board12", "12th Board"],
      ["school12", "12th School"],
      ["roll12", "12th Roll Number"],
      ["year12", "12th Passing Year"],
      ["marks12", "12th Marks / Percentage"],
      ["stream12", "12th Stream"],
    ];
    for (const [field, label] of required12thFields) {
      if (!value(field)) return `${label} is required.`;
    }
    if (!YEAR_REGEX.test(value("year12")))
      return "12th Passing Year must be a 4-digit year.";
    const year12 = Number(value("year12"));
    if (year12 < 1900 || year12 > CURRENT_YEAR + 1)
      return `12th Passing Year must be between 1900 and ${CURRENT_YEAR + 1}.`;
    if (year12 < year10)
      return "12th Passing Year cannot be earlier than 10th Passing Year.";
    if (!PERCENTAGE_REGEX.test(value("marks12")))
      return "12th Marks / Percentage must be a valid value between 0 and 100.";

    const graduationFields = [
      "graduationUniversity",
      "graduationCollege",
      "graduationProgramme",
      "graduationBranch",
      "graduationYear",
      "graduationMarks",
    ];
    if (graduationFields.some((field) => value(field))) {
      const required = [
        ["graduationUniversity", "Graduation University"],
        ["graduationCollege", "Graduation College"],
        ["graduationProgramme", "Graduation Programme"],
        ["graduationBranch", "Graduation Branch"],
        ["graduationYear", "Graduation Passing Year"],
        ["graduationMarks", "Graduation Marks / Percentage"],
      ];
      for (const [field, label] of required) {
        if (!value(field))
          return `${label} is required when Graduation Details are entered.`;
      }
      if (!YEAR_REGEX.test(value("graduationYear")))
        return "Graduation Passing Year must be a 4-digit year.";
      const graduationYear = Number(value("graduationYear"));
      if (graduationYear < year12 || graduationYear > CURRENT_YEAR + 2)
        return "Please enter a valid Graduation Passing Year.";
      if (!PERCENTAGE_REGEX.test(value("graduationMarks")))
        return "Graduation Marks / Percentage must be a valid value between 0 and 100.";
    }

    const entranceFields = [
      "entranceExam",
      "entranceAppNo",
      "entranceRollNo",
      "entranceRank",
      "entranceScore",
      "entranceYear",
    ];
    if (entranceFields.some((field) => value(field))) {
      if (!value("entranceExam"))
        return "Entrance Exam is required when entrance details are entered.";
      if (!value("entranceAppNo") && !value("entranceRollNo"))
        return "Please enter Entrance Application No. or Roll No.";
      if (
        value("entranceRank") &&
        !POSITIVE_INTEGER_REGEX.test(value("entranceRank"))
      )
        return "Entrance Rank must be a positive whole number.";
      if (
        value("entranceScore") &&
        !NON_NEGATIVE_NUMBER_REGEX.test(value("entranceScore"))
      )
        return "Entrance Score must be a valid number.";
      if (value("entranceYear")) {
        if (!YEAR_REGEX.test(value("entranceYear")))
          return "Entrance Exam Year must be a 4-digit year.";
        const entranceYear = Number(value("entranceYear"));
        if (entranceYear < 1900 || entranceYear > CURRENT_YEAR + 1)
          return `Entrance Exam Year must be between 1900 and ${CURRENT_YEAR + 1}.`;
      }
    }

    if (!formData.programme) return "Please select Programme.";
    if (!PROGRAMME_OPTIONS.includes(formData.programme))
      return "Invalid Programme selected.";
    if (!formData.branch) return "Please select Branch.";
    if (!BRANCH_OPTIONS.some((item) => item.value === formData.branch))
      return "Invalid Branch selected.";
    if (formData.branch === "Other" && value("branchOther").length < 2)
      return "Please enter the Other Branch Name.";
    if (value("admissionType") && value("admissionType").length < 3)
      return "Admission Type must contain at least 3 characters.";
    // if (!["2026-27", "2027-28", "2028-29"].includes(formData.session))
    //   return "Invalid Session selected.";
    if (!["Yes", "No"].includes(formData.hostel))
      return "Invalid Hostel selection.";
    if (!["Yes", "No"].includes(formData.scholarship))
      return "Invalid Scholarship selection.";
    if (!formData.declarationAccepted)
      return "Please accept the declaration before submitting.";

    return "";
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setApplicationNo("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        branchOther:
          formData.branch === "Other" ? formData.branchOther.trim() : "",
      };

      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Unable to submit admission application.",
        );
      }

      const submittedApplicationNo = response.data?.data?.applicationNo || "";

      setApplicationNo(submittedApplicationNo);
      setSuccess(
        response.data?.message ||
          "Your admission application has been submitted successfully.",
      );
      setFormData(INITIAL_FORM);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Admission Application Submit Error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit admission application.",
      );
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      {/* =================================================
          IMPORTANT INFORMATION MODAL
      ================================================= */}
      <Modal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="admission-info-modal-header">
          <Modal.Title>Important Information Before Applying</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="alert alert-warning admission-info-alert">
            <strong>Please read carefully before submitting.</strong>
            <div>
              Enter accurate information. The application will be validated
              before it is submitted.
            </div>
          </div>

          <ul className="admission-info-list">
            <li>
              <strong>Mobile Number:</strong> exactly 10 digits and must start
              with 6, 7, 8 or 9.
            </li>
            <li>
              <strong>Alternate Mobile:</strong> if provided, it must be a
              different valid 10-digit mobile number.
            </li>
            <li>
              <strong>Email:</strong> enter a valid email address.
            </li>
            <li>
              <strong>Aadhaar:</strong> if provided, it must contain exactly 12
              digits.
            </li>
            <li>
              <strong>PIN Code:</strong> if provided, it must contain exactly 6
              digits.
            </li>
            <li>
              <strong>10th &amp; 12th:</strong> all marked required academic
              details must be completed.
            </li>
            <li>
              <strong>Marks / Percentage:</strong> must be a valid value from 0
              to 100.
            </li>
            <li>
              <strong>Date of Birth:</strong> must be a valid date and cannot be
              a future date.
            </li>
            <li>
              <strong>Graduation / Entrance:</strong> if any details are
              entered, the related required fields must also be completed.
            </li>
            <li>
              <strong>Declaration:</strong> you must accept the declaration
              before submitting the application.
            </li>
          </ul>

          <div className="admission-info-tip">
            <strong>Tip:</strong> Please review your mobile number, email, date
            of birth and academic marks carefully before clicking
            <strong> Submit Application</strong>.
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            className="admission-modal-btn"
            onClick={() => setShowInfoModal(false)}
          >
            I Understand &amp; Continue
          </Button>
        </Modal.Footer>
      </Modal>

      <main className="apply-admission-page">
        <div className="apply-admission-container">
          {/* =================================================
              HEADER
          ================================================= */}
          <div className="apply-admission-header">
            <span>ADMISSIONS</span>
            <h1>Apply for Admission</h1>
            <p>
              Please complete all required information carefully before
              submitting your application.
            </p>
          </div>

          {/* =================================================
              SUCCESS
          ================================================= */}
          {success && (
            <Alert variant="success" className="application-success-alert">
              <strong>Application Submitted Successfully</strong>
              <div>{success}</div>
              {applicationNo && (
                <div className="application-number-box">
                  <span>Your Application Number</span>
                  <strong>{applicationNo}</strong>
                </div>
              )}
            </Alert>
          )}

          {/* =================================================
              ERROR
          ================================================= */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 01</span>
                <h2>Personal Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Alternate Mobile</Form.Label>
                      <Form.Control
                        type="tel"
                        name="alternateMobile"
                        value={formData.alternateMobile}
                        onChange={handleChange}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        {GENDER_OPTIONS.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Control
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Aadhaar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        maxLength={12}
                        inputMode="numeric"
                        pattern="[0-9]{12}"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Religion</Form.Label>
                      <Form.Control
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                PARENT DETAILS
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 02</span>
                <h2>Parent / Family Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Father's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Father's Occupation</Form.Label>
                      <Form.Control
                        type="text"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mother's Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mother's Occupation</Form.Label>
                      <Form.Control
                        type="text"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Annual Family Income</Form.Label>
                      <Form.Control
                        type="text"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                ADDRESS
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 03</span>
                <h2>Address Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>District</Form.Label>
                      <Form.Control
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>PIN Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                10TH DETAILS
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 04</span>
                <h2>Class 10th Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Board *</Form.Label>
                      <Form.Control
                        type="text"
                        name="board10"
                        value={formData.board10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>School *</Form.Label>
                      <Form.Control
                        type="text"
                        name="school10"
                        value={formData.school10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Roll Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="roll10"
                        value={formData.roll10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Passing Year *</Form.Label>
                      <Form.Control
                        type="text"
                        name="year10"
                        value={formData.year10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Marks / Percentage *</Form.Label>
                      <Form.Control
                        type="text"
                        name="marks10"
                        value={formData.marks10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Medium *</Form.Label>
                      <Form.Control
                        type="text"
                        name="medium10"
                        value={formData.medium10}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                12TH DETAILS
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 05</span>
                <h2>Class 12th Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Board *</Form.Label>
                      <Form.Control
                        type="text"
                        name="board12"
                        value={formData.board12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>School *</Form.Label>
                      <Form.Control
                        type="text"
                        name="school12"
                        value={formData.school12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Roll Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="roll12"
                        value={formData.roll12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Passing Year *</Form.Label>
                      <Form.Control
                        type="text"
                        name="year12"
                        value={formData.year12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Marks / Percentage *</Form.Label>
                      <Form.Control
                        type="text"
                        name="marks12"
                        value={formData.marks12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Stream *</Form.Label>
                      <Form.Control
                        type="text"
                        name="stream12"
                        value={formData.stream12}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                GRADUATION
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 06</span>
                <h2>Graduation Details</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>University</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationUniversity"
                        value={formData.graduationUniversity}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>College</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationCollege"
                        value={formData.graduationCollege}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Programme</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationProgramme"
                        value={formData.graduationProgramme}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Branch</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationBranch"
                        value={formData.graduationBranch}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Passing Year</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Marks / Percentage</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationMarks"
                        value={formData.graduationMarks}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                ENTRANCE
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 07</span>
                <h2>Entrance Examination</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Entrance Exam</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceExam"
                        value={formData.entranceExam}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Application No.</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceAppNo"
                        value={formData.entranceAppNo}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Roll No.</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceRollNo"
                        value={formData.entranceRollNo}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Rank</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceRank"
                        value={formData.entranceRank}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Score</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceScore"
                        value={formData.entranceScore}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="text"
                        name="entranceYear"
                        value={formData.entranceYear}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Achievements</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                COURSE / ADMISSION
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>STEP 08</span>
                <h2>Course & Admission Preference</h2>
              </Card.Header>

              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Programme *</Form.Label>
                      <Form.Select
                        name="programme"
                        value={formData.programme}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Programme</option>
                        {PROGRAMME_OPTIONS.map((programme) => (
                          <option key={programme} value={programme}>
                            {programme}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Branch *</Form.Label>
                      <Form.Select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {BRANCH_OPTIONS.map((branch) => (
                          <option key={branch.value} value={branch.value}>
                            {branch.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {formData.branch === "Other" && (
                      <Form.Group className="mt-3">
                        <Form.Label>Other Branch Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="branchOther"
                          value={formData.branchOther}
                          onChange={handleChange}
                          placeholder="Enter branch name"
                          required
                        />
                      </Form.Group>
                    )}
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Admission Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="admissionType"
                        value={formData.admissionType}
                        onChange={handleChange}
                        placeholder="Direct / Entrance / Lateral"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Session</Form.Label>
                      <Form.Select
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                      >
                        <option value="2026-27">2026-27</option>

                        <option value="2025-26">2027-28</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Hostel Required</Form.Label>
                      <Form.Select
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Scholarship</Form.Label>
                      <Form.Select
                        name="scholarship"
                        value={formData.scholarship}
                        onChange={handleChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                DECLARATION
            ================================================= */}
            <Card className="apply-admission-card">
              <Card.Header>
                <span>FINAL STEP</span>
                <h2>Declaration</h2>
              </Card.Header>

              <Card.Body>
                <Form.Check
                  type="checkbox"
                  name="declarationAccepted"
                  checked={formData.declarationAccepted}
                  onChange={handleChange}
                  required
                  label="I declare that the information provided by me in this application is true and correct to the best of my knowledge."
                />

                <div className="apply-admission-submit mt-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </div>
      </main>
    </>
  );
};

export default ApplyAdmission;
