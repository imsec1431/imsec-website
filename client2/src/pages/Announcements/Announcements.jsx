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
    <div className="text-center py-5">
      <h3>Loading...</h3>
    </div>
  );
}

  return (
    <>
      {/* Hero Section */}
      <section className="announcementHero">
        <div className="container">
          <h1>Announcements</h1>
          <p style={{ color: "#f1f1f1" }}>Stay updated with the latest departmental announcements.</p>
        </div>
      </section>

      {/* Announcement List */}
      <section className="announcementSection">
        <div className="container">

          <div className="announcementHeader">
            <FaBullhorn className="headerIcon" />
            <h2>Latest Announcements</h2>
          </div>

          <div className="announcementList">
            {announcements.map((item) => (
              <div className="announcementCard" key={item._id}>
                <div className="announcementLeft">
                  <FaChevronRight className="arrowIcon" />
                  <span>{item.title}</span>
                </div>

                <div className="announcementDate">
                  <FaCalendarAlt />
                  <span>
  {new Date(item.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Announcements;