import React, { useEffect, useState } from "react";
import { FaAward, FaTrophy, FaStar, FaFilePdf } from "react-icons/fa";
import awardsRankingRatingsService from "../../services/awardsRankingRatingsService";
import "./awardsRankingRatings.css";

const AwardsRankingRatings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await awardsRankingRatingsService.getAwardsRankingRatings();

      const pageData = response?.data?.data || response?.data || response;

      setData(pageData);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to load Awards, Rankings & Ratings.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeDetails = (type) => {
    switch (type) {
      case "award":
        return {
          label: "Award",
          icon: <FaAward />,
        };

      case "ranking":
        return {
          label: "Ranking",
          icon: <FaTrophy />,
        };

      case "rating":
        return {
          label: "Rating",
          icon: <FaStar />,
        };

      default:
        return {
          label: "Recognition",
          icon: <FaAward />,
        };
    }
  };

  if (loading) {
    return (
      <div className="arr-loading">
        <div className="arr-loader"></div>
        <p>Loading information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="arr-error">
        <h3>Unable to Load Information</h3>
        <p>{error}</p>
        <button onClick={loadData}>Try Again</button>
      </div>
    );
  }

  if (!data || data.published === false) {
    return null;
  }

  const records = Array.isArray(data.records)
    ? data.records
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <div className="arr-page">
      {/* Hero */}
      <section className="arr-hero">
        <div className="arr-hero-overlay">
          <div className="container">
            <span className="arr-eyebrow">Institutional Recognition</span>

            <h1>{data.title || "Awards, Rankings & Ratings"}</h1>

            <p>
              {data.description ||
                "Awards, rankings and ratings received by the institution."}
            </p>

            <div className="arr-breadcrumb">
              Home / Accreditations / Awards, Rankings & Ratings
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="arr-content">
        <div className="container">
          {records.length === 0 ? (
            <div className="arr-empty">
              <FaAward />
              <h3>No Information Available</h3>
              <p>
                Awards, rankings and ratings information will be updated here.
              </p>
            </div>
          ) : (
            <div className="arr-grid">
              {records.map((item) => {
                const typeDetails = getTypeDetails(item.type);

                return (
                  <article className="arr-card" key={item._id}>
                    {/* Photo */}
                    <div className="arr-photo">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.title} />
                      ) : (
                        <div className="arr-photo-placeholder">
                          {typeDetails.icon}
                        </div>
                      )}

                      <div className="arr-type">
                        <span>{typeDetails.icon}</span>
                        {typeDetails.label}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="arr-card-body">
                      <h2>{item.title}</h2>

                      <div className="arr-card-actions">
                        {item.pdfUrl && (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="arr-pdf-btn"
                          >
                            <FaFilePdf />
                            View / Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AwardsRankingRatings;
