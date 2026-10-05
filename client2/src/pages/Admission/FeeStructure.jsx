import React, { useEffect, useState } from "react";

import { Alert, Spinner } from "react-bootstrap";

import { getPublicFeeStructure } from "../../admin/services/feeStructurePublicService.js";

import "./FeeStructure.css";

const FeeStructure = () => {
  const [feeStructure, setFeeStructure] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadFeeStructure = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getPublicFeeStructure();

      // console.log("Public Fee Structure:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load fee structure.");
      }

      setFeeStructure(response.data || null);
    } catch (err) {
      console.error("Public Fee Structure Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load fee structure.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadFeeStructure();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="publicFeePage">
        <div className="publicFeeLoading">
          <Spinner animation="border" />

          <p>Loading Fee Structure...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !feeStructure) {
    return (
      <div className="publicFeePage">
        <div className="publicFeeContainer">
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT PUBLISHED
  ======================================================= */

  if (!feeStructure) {
    return (
      <div className="publicFeePage">
        <div className="publicFeeContainer">
          <div className="publicFeeEmpty">
            <div className="publicFeeEmptyIcon">₹</div>

            <span>ADMISSIONS</span>

            <h1>Fee Structure</h1>

            <p>
              The fee structure is currently unavailable. Please check back
              later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publicFeePage">
      <div className="publicFeeContainer">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="publicFeeBreadcrumb">
          <span>Admissions</span>

          <span>/</span>

          <strong>Fee Structure</strong>
        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="publicFeeHero">
          <div className="publicFeeHeroContent">
            <span className="publicFeeEyebrow">
              {feeStructure.heroLabel || "ADMISSIONS"}
            </span>

            <h1>
              {feeStructure.heroTitle || feeStructure.title || "Fee Structure"}
            </h1>

            <p>
              {feeStructure.heroDescription ||
                feeStructure.subtitle ||
                "Explore the fee structure for various programmes offered by IMS Engineering College."}
            </p>

            <div className="publicFeeSession">
              <span>Academic Session</span>

              <strong>{feeStructure.academicYear || "-"}</strong>
            </div>
          </div>

          <div className="publicFeeHeroCard">
            <div className="publicFeeHeroIcon">₹</div>

            <span>OFFICIAL</span>

            <strong>Fee Information</strong>

            <small>IMS Engineering College</small>
          </div>
        </section>

        {/* =================================================
            GENERAL NOTE
        ================================================= */}

        {feeStructure.note && (
          <div className="publicFeeNotice">
            <div className="publicFeeNoticeIcon">i</div>

            <div>
              <strong>Important Information</strong>

              <p>{feeStructure.note}</p>
            </div>
          </div>
        )}

        {/* =================================================
            COURSE FEES
        ================================================= */}

        <section className="publicFeeSection">
          <div className="publicFeeSectionHeading">
            <span>01</span>

            <div>
              <small>PROGRAMMES</small>

              <h2>Programme Fee Structure</h2>
            </div>
          </div>

          <div className="publicCourseList">
            {(feeStructure.courses || []).map((course, courseIndex) => (
              <article
                className="publicCourseCard"
                key={course._id || courseIndex}
              >
                {/* COURSE HEADER */}

                <div className="publicCourseHeader">
                  <div>
                    <span>
                      PROGRAMME {String(courseIndex + 1).padStart(2, "0")}
                    </span>

                    <h3 style={{ color: "white" }}>{course.courseName}</h3>
                  </div>

                  <div className="publicCourseDuration">
                    <small>DURATION</small>

                    <strong>{course.years} Years</strong>
                  </div>
                </div>

                {/* FEE TABLE */}

                {course.feeRows && course.feeRows.length > 0 ? (
                  <div className="publicFeeTableWrapper">
                    <table className="publicFeeTable">
                      <thead>
                        <tr>
                          <th>Particulars</th>

                          {(course.feeRows?.[0]?.amounts || []).map(
                            (_, yearIndex) => (
                              <th key={yearIndex}>Year {yearIndex + 1}</th>
                            ),
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {(course.feeRows || []).map((row, rowIndex) => (
                          <tr key={row._id || rowIndex}>
                            <td>{row.particulars}</td>

                            {(row.amounts || []).map((amount, amountIndex) => (
                              <td key={amountIndex}>{amount || "—"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="publicFeeNoData">
                    Fee details are currently unavailable.
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* =================================================
            HOSTEL
        ================================================= */}

        {feeStructure.hostels && feeStructure.hostels.length > 0 && (
          <section className="publicFeeSection">
            <div className="publicFeeSectionHeading">
              <span>02</span>

              <div>
                <small>CAMPUS ACCOMMODATION</small>

                <h2>Hostel Fee</h2>
              </div>
            </div>

            <div className="publicHostelGrid">
              {feeStructure.hostels.map((hostel, hostelIndex) => (
                <article
                  className="publicHostelCard"
                  key={hostel._id || hostelIndex}
                >
                  <div className="publicHostelHeader">
                    <div className="publicHostelIcon">H</div>

                    <div>
                      <h3>{hostel.hostelName}</h3>

                      <span>{hostel.locationLabel}</span>
                    </div>
                  </div>

                  <div className="publicHostelRows">
                    {(hostel.rows || []).map((row, rowIndex) => (
                      <div
                        className="publicHostelRow"
                        key={row._id || rowIndex}
                      >
                        <span>{row.title}</span>

                        <strong>{row.amount}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            PAYMENT OPTIONS
        ================================================= */}

        {feeStructure.paymentOptions &&
          feeStructure.paymentOptions.length > 0 && (
            <section className="publicFeeSection">
              <div className="publicFeeSectionHeading">
                <span>03</span>

                <div>
                  <small>PAYMENT</small>

                  <h2>Payment Options</h2>
                </div>
              </div>

              <div className="publicPaymentGrid">
                {feeStructure.paymentOptions.map((option, index) => (
                  <div className="publicPaymentCard" key={option._id || index}>
                    <div>{String(index + 1).padStart(2, "0")}</div>

                    <strong>{option.title}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =================================================
            SCHOLARSHIPS
        ================================================= */}

        {feeStructure.scholarships && feeStructure.scholarships.length > 0 && (
          <section className="publicFeeSection">
            <div className="publicFeeSectionHeading">
              <span>04</span>

              <div>
                <small>FINANCIAL SUPPORT</small>

                <h2>Scholarships</h2>
              </div>
            </div>

            <div className="publicContentGrid">
              {feeStructure.scholarships.map((item, index) => (
                <article className="publicContentCard" key={item._id || index}>
                  <div className="publicContentNumber">{index + 1}</div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            EDUCATION LOAN
        ================================================= */}

        {feeStructure.educationLoans &&
          feeStructure.educationLoans.length > 0 && (
            <section className="publicFeeSection">
              <div className="publicFeeSectionHeading">
                <span>05</span>

                <div>
                  <small>FINANCIAL ASSISTANCE</small>

                  <h2>Education Loans</h2>
                </div>
              </div>

              <div className="publicContentGrid">
                {feeStructure.educationLoans.map((item, index) => (
                  <article
                    className="publicContentCard"
                    key={item._id || index}
                  >
                    <div className="publicContentNumber">{index + 1}</div>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

        {/* =================================================
            IMPORTANT NOTES
        ================================================= */}

        {feeStructure.importantNotes &&
          feeStructure.importantNotes.length > 0 && (
            <section className="publicFeeSection">
              <div className="publicFeeSectionHeading">
                <span>06</span>

                <div>
                  <small>PLEASE NOTE</small>

                  <h2>Important Notes</h2>
                </div>
              </div>

              <div className="publicNotesCard">
                {feeStructure.importantNotes.map((note, index) => (
                  <div className="publicNoteRow" key={index}>
                    <span>{index + 1}</span>

                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="publicFeeFooter">
          <strong>IMS Engineering College</strong>

          <p>Please verify the applicable fee before making any payment.</p>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;
