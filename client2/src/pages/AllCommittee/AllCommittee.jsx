import React, { useEffect, useState } from "react";

import {
  FaUsers,
  FaFilePdf,
  FaExternalLinkAlt,
  FaDownload,
} from "react-icons/fa";

import { getPublishedCommittees } from "../../../src/admin/services/allCommitteeService";
// import { getPublishedCommittees } from "../../../services/allCommitteeService";

import "./AllCommittee.css";

const AllCommittee = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD COMMITTEES
  ======================================================= */

  const loadCommittees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPublishedCommittees();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setCommittees(data);
    } catch (err) {
      console.error("Unable to load committees:", err);

      setError(
        err?.response?.data?.message || "Unable to load committee information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommittees();
  }, []);

  return (
    <main className="publicAllCommitteePage">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="publicCommitteeHero">
        <div className="publicCommitteeHeroContent">
          <div className="publicCommitteeHeroIcon">
            <FaUsers />
          </div>

          <span>INSTITUTIONAL GOVERNANCE</span>

          <h1>All Committees</h1>

          <p>
            View the official committees and related documents of IMS
            Engineering College.
          </p>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="publicCommitteeContainer">
        {loading ? (
          <div className="publicCommitteeLoading">
            <div className="publicCommitteeSpinner" />

            <p>Loading committees...</p>
          </div>
        ) : error ? (
          <div className="publicCommitteeError">{error}</div>
        ) : committees.length === 0 ? (
          <div className="publicCommitteeEmpty">
            <div className="publicCommitteeEmptyIcon">
              <FaUsers />
            </div>

            <h2>No Committee Information Available</h2>

            <p>Committee information will be available here soon.</p>
          </div>
        ) : (
          <div className="publicCommitteeList">
            {committees.map((committee, index) => (
              <article className="publicCommitteeCard" key={committee._id}>
                {/* =======================================
                    NUMBER
                ======================================= */}

                <div className="publicCommitteeNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* =======================================
                    PDF ICON
                ======================================= */}

                <div className="publicCommitteePdfIcon">
                  <FaFilePdf />
                </div>

                {/* =======================================
                    NAME
                ======================================= */}

                <div className="publicCommitteeInfo">
                  <span>COMMITTEE</span>

                  <h2>{committee.committeeName}</h2>
                </div>

                {/* =======================================
                    ACTIONS
                ======================================= */}

                <div className="publicCommitteeActions">
                  <a
                    href={committee.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publicCommitteeView"
                  >
                    <FaExternalLinkAlt />
                    View PDF
                  </a>

                  <a
                    href={committee.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="publicCommitteeDownload"
                  >
                    <FaDownload />
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AllCommittee;
