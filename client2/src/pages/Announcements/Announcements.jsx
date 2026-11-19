import React, { useEffect, useState } from "react";
import "./Announcements.css";
import { getAnnouncements } from "../../services/announcementService";
import { FaBullhorn, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();

      if (res.data?.data) {
        // Only active announcements
        const activeAnnouncements = res.data.data.filter(
          (item) => item.active
        );

        setAnnouncements(activeAnnouncements);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="announcementsLoading">
        <div className="announcementsSpinner" />
        <p>Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="announcementsPage">
      {/* Hero Section */}
      <section className="announcementHero">
        <div className="announcementHeroContainer">
          <div className="announcementHeroContent">
            <span className="announcementHeroTag">NOTICES &amp; UPDATES</span>
            <h1>Announcements</h1>
            <p>
              Stay updated with the latest institutional and departmental announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Announcement List */}
      <section className="announcementSection">
        <div className="announcementsContainer">
          <div className="announcementSectionHeader">
            <div>
              <span className="announcementSectionTag">LATEST UPDATES</span>
              <h2>Official Announcements</h2>
            </div>

            {announcements.length > 0 && (
              <div className="announcementCountBadge">
                <FaBullhorn className="countIcon" />
                <span>
                  {announcements.length}{" "}
                  {announcements.length === 1 ? "Announcement" : "Announcements"}
                </span>
              </div>
            )}
          </div>

          {announcements.length === 0 ? (
            <div className="announcementEmptyState">
              <FaBullhorn className="emptyIcon" />
              <h3>No Active Announcements</h3>
              <p>
                There are no active announcements at this moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="announcementList">
              {announcements.map((item) => (
                <article className="announcementCard" key={item._id}>
                  <div className="announcementCardMain">
                    <div className="announcementTitleRow">
                      <FaChevronRight className="arrowIcon" />
                      <h3>{item.title}</h3>
                    </div>

                    {item.description && (
                      <p className="announcementDesc">{item.description}</p>
                    )}
                  </div>

                  <div className="announcementDateBadge">
                    <FaCalendarAlt className="dateIcon" />
                    <span>
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Announcements;
