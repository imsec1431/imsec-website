import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";

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
      <Container className="py-5">
        {/* PAGE TITLE */}
        <div className="mandatory-disclosure-heading">
          <h1>Mandatory Disclosure</h1>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && <Alert variant="danger">{error}</Alert>}

        {/* TABLE */}
        {!loading && !error && (
          <div className="mandatory-disclosure-table-wrapper">
            {disclosures.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No disclosure documents are currently available.
              </div>
            ) : (
              <table className="mandatory-disclosure-table">
                <thead>
                  <tr>
                    <th className="serial-column">S. No.</th>

                    <th>Title</th>

                    <th className="download-column">Download</th>
                  </tr>
                </thead>

                <tbody>
                  {disclosures.map((disclosure, index) => (
                    <tr key={disclosure._id}>
                      <td className="serial-column">{index + 1}</td>

                      <td className="disclosure-title-cell">
                        {disclosure.title}
                      </td>

                      <td className="download-column">
                        <Button
                          as="a"
                          href={disclosure.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          variant="dark"
                          className="mandatory-download-btn"
                        >
                          Download PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default MandatoryDisclosure;
