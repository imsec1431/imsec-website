import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { FaFilePdf, FaDownload } from "react-icons/fa";

import { getMandatoryDisclosure } from "../../services/mandatoryDisclosureService";

import "./MandatoryDisclosure.css";

const MandatoryDisclosure = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDisclosure = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMandatoryDisclosure();

      const data = (response?.data || [])
        .filter((item) => item.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      setDisclosures(data);
    } catch (err) {
      console.error("Error fetching Mandatory Disclosure:", err);

      setError(
        err?.response?.data?.message || "Unable to load Mandatory Disclosure.",
      );

      setDisclosures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisclosure();
  }, []);

  return (
    <div className="mandatory-disclosure-page">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mandatoryHero">
        <div className="mandatoryHeroContainer">
          <div className="mandatoryHeroContent">
            <span className="mandatoryHeroTag">STATUTORY DISCLOSURES</span>

            <h1>Mandatory Disclosure</h1>

            <p>
              Statutory disclosures, approvals, regulatory reports, and
              institutional documentation as per regulatory requirements.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTENT SECTION
      ========================================= */}

      <section className="mandatoryContentSection">
        <div className="mandatoryContainer">
          <div className="mandatorySectionHeading">
            <span>OFFICIAL DOCUMENTS</span>

            <h2>Statutory &amp; Regulatory Disclosures</h2>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mandatoryLoading">
              <div className="mandatorySpinner" />
              <p>Loading Mandatory Disclosure documents...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <Alert variant="danger" className="mandatoryAlert">
              {error}
            </Alert>
          )}

          {/* TABLE */}
          {!loading && !error && (
            <div className="mandatoryTableWrapper">
              {disclosures.length === 0 ? (
                <div className="mandatoryEmpty">
                  <FaFilePdf className="emptyIcon" />
                  <h3>No Documents Available</h3>
                  <p>No disclosure documents are currently published.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="mandatoryTable">
                    <thead>
                      <tr>
                        <th className="serialColumn">S. No.</th>
                        <th>Document Title</th>
                        <th className="downloadColumn">Download</th>
                      </tr>
                    </thead>

                    <tbody>
                      {disclosures.map((disclosure, index) => (
                        <tr key={disclosure._id}>
                          <td className="serialColumn">{index + 1}</td>

                          <td className="titleCell">
                            <span className="titleText">
                              {disclosure.title}
                            </span>
                          </td>

                          <td className="downloadColumn">
                            <a
                              href={disclosure.pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="mandatoryDownloadBtn"
                            >
                              <FaDownload className="btnIcon" />
                              Download PDF
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MandatoryDisclosure;
