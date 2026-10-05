import React, { useEffect, useState } from "react";
import "./Alumni.css";
import alumniProfileService from "../../services/alumniProfileService";

const Alumni = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);

        const response = await alumniProfileService.getAlumniProfile();

        const pageData = response?.data || response;

        setData(pageData);
      } catch (err) {
        console.error("Alumni page error:", err);

        setError(err?.message || "Unable to load alumni information.");
      } finally {
        setLoading(false);
      }
    };

    loadAlumni();
  }, []);

  if (loading) {
    return (
      <div className="alumni-page-loader">
        <div className="alumni-loader-spinner" />
        <p>Loading Alumni...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alumni-page-error">
        <h2>IMSEC Alumni</h2>
        <p>{error || "Alumni information is currently unavailable."}</p>
      </div>
    );
  }

  const hero = data.hero || {};
  const about = data.about || {};
  const statistics = data.statistics || {};
  const featured = data.featuredAlumni || {};
  const achievements = data.achievements || {};
  const stories = data.successStories || {};
  const testimonials = data.testimonials || {};
  const events = data.events || {};
  const chapters = data.chapters || {};
  const network = data.network || {};
  const mentorship = data.mentorship || {};
  const contribution = data.contribution || {};
  const cta = data.cta || {};

  return (
    <main className="alumni-page">
      {/* ================= HERO ================= */}
      <section className="alumni-hero">
        <div className="alumni-hero-glow alumni-glow-one" />
        <div className="alumni-hero-glow alumni-glow-two" />

        <div className="alumni-hero-content">
          <span className="alumni-hero-line" />

          <h1>{hero.title || "IMSEC Alumni"}</h1>

          <p>
            {hero.subtitle || "Connecting the IMSEC family beyond the campus"}
          </p>

          <div className="alumni-breadcrumb">
            {hero.breadcrumb || "Home / Alumni"}
          </div>

          {hero.buttonText && (
            <a
              href={hero.buttonLink || "#alumni-network"}
              className="alumni-primary-btn"
            >
              {hero.buttonText}
            </a>
          )}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="alumni-section alumni-about">
        <div className="alumni-container alumni-two-column">
          <div className="alumni-about-image">
            {about.image?.url ? (
              <img src={about.image.url} alt={about.title || "IMSEC Alumni"} />
            ) : (
              <div className="alumni-image-placeholder">
                <span>IMSEC</span>
                <strong>ALUMNI</strong>
              </div>
            )}
          </div>

          <div className="alumni-about-content">
            <span className="alumni-section-label">ABOUT ALUMNI</span>

            <h2>{about.title || "IMSEC Alumni Network"}</h2>

            {about.subtitle && <h3>{about.subtitle}</h3>}

            {about.description1 && <p>{about.description1}</p>}

            {about.description2 && <p>{about.description2}</p>}

            {about.buttonText && (
              <a
                href={about.buttonLink || "#alumni-network"}
                className="alumni-outline-btn"
              >
                {about.buttonText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ================= STATISTICS ================= */}
      <section className="alumni-statistics">
        <div className="alumni-container">
          <div className="alumni-stat-grid">
            <StatCard
              value={statistics.totalAlumni || "10,000+"}
              label="Alumni"
            />

            <StatCard
              value={statistics.successfulAlumni || "8,000+"}
              label="Successful Alumni"
            />

            <StatCard value={statistics.countries || "20+"} label="Countries" />

            <StatCard
              value={statistics.industryLeaders || "500+"}
              label="Industry Leaders"
            />

            <StatCard
              value={statistics.alumniEvents || "100+"}
              label="Alumni Events"
            />

            <StatCard
              value={statistics.alumniChapters || "15+"}
              label="Alumni Chapters"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURED ALUMNI ================= */}
      {featured.profiles?.length > 0 && (
        <section className="alumni-section">
          <SectionHeading
            label="OUR ALUMNI"
            title="Featured Alumni"
            description="Meet members of the IMSEC family making an impact across industries."
          />

          <div className="alumni-container">
            <div className="alumni-card-grid">
              {featured.profiles
                .slice(0, featured.displayCount || 6)
                .map((item, index) => (
                  <FeaturedAlumniCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}
      {achievements.items?.length > 0 && (
        <section className="alumni-section alumni-light-section">
          <SectionHeading
            label="EXCELLENCE"
            title="Alumni Achievements"
            description="Celebrating the accomplishments of our alumni."
          />

          <div className="alumni-container">
            <div className="alumni-achievement-grid">
              {achievements.items
                .slice(0, achievements.displayCount || 6)
                .map((item, index) => (
                  <AchievementCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= SUCCESS STORIES ================= */}
      {stories.items?.length > 0 && (
        <section className="alumni-section">
          <SectionHeading
            label="ALUMNI JOURNEY"
            title="Success Stories"
            description="Stories of ambition, growth and achievement from the IMSEC community."
          />

          <div className="alumni-container">
            <div className="alumni-story-grid">
              {stories.items
                .slice(0, stories.displayCount || 6)
                .map((item, index) => (
                  <SuccessStoryCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TESTIMONIALS ================= */}
      {testimonials.items?.length > 0 && (
        <section className="alumni-section alumni-testimonial-section">
          <SectionHeading
            label="ALUMNI VOICES"
            title="What Our Alumni Say"
            description="Hear from members of the IMSEC family."
          />

          <div className="alumni-container">
            <div className="alumni-testimonial-grid">
              {testimonials.items
                .slice(0, testimonials.displayCount || 6)
                .map((item, index) => (
                  <TestimonialCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= EVENTS ================= */}
      {events.events?.length > 0 && (
        <section className="alumni-section alumni-light-section">
          <SectionHeading
            label="STAY CONNECTED"
            title="Alumni Events"
            description="Reconnect, network and celebrate the IMSEC family."
          />

          <div className="alumni-container">
            <div className="alumni-event-grid">
              {events.events
                .slice(0, events.displayCount || 6)
                .map((item, index) => (
                  <AlumniEventCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CHAPTERS ================= */}
      {chapters.items?.length > 0 && (
        <section className="alumni-section">
          <SectionHeading
            label="GLOBAL NETWORK"
            title="Alumni Chapters"
            description="Stay connected with IMSEC alumni around the world."
          />

          <div className="alumni-container">
            <div className="alumni-chapter-grid">
              {chapters.items
                .slice(0, chapters.displayCount || 6)
                .map((item, index) => (
                  <ChapterCard key={item._id || index} item={item} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= NETWORK ================= */}
      <section className="alumni-network-section" id="alumni-network">
        <div className="alumni-container">
          <div className="alumni-network-content">
            <span className="alumni-section-label">CONNECT WITH US</span>

            <h2>{network.title || "Stay Connected With IMSEC"}</h2>

            {network.subtitle && <h3>{network.subtitle}</h3>}

            {network.description && <p>{network.description}</p>}

            <div className="alumni-network-details">
              {network.email && (
                <a href={`mailto:${network.email}`}>
                  <span>✉</span>
                  {network.email}
                </a>
              )}

              {network.phone && (
                <a href={`tel:${network.phone}`}>
                  <span>☎</span>
                  {network.phone}
                </a>
              )}
            </div>

            <div className="alumni-social-links">
              {network.linkedin && (
                <a href={network.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}

              {network.facebook && (
                <a href={network.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}

              {network.instagram && (
                <a href={network.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}

              {network.whatsapp && (
                <a href={network.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              )}
            </div>

            <div className="alumni-network-actions">
              {network.registrationLink && (
                <a
                  href={network.registrationLink}
                  className="alumni-primary-btn"
                >
                  {network.registrationText || "Join Alumni Network"}
                </a>
              )}

              {network.loginLink && (
                <a href={network.loginLink} className="alumni-outline-btn">
                  {network.loginText || "Alumni Login"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MENTORSHIP ================= */}
      <section className="alumni-section alumni-mentorship">
        <div className="alumni-container alumni-two-column">
          <div className="alumni-mentorship-content">
            <span className="alumni-section-label">GIVE BACK</span>

            <h2>{mentorship.title || "Alumni Mentorship"}</h2>

            <p>
              {mentorship.description ||
                "Share your experience, knowledge and expertise with the next generation of IMSEC students."}
            </p>

            {mentorship.buttonText && (
              <a
                href={mentorship.buttonLink || "/contact-us"}
                className="alumni-primary-btn"
              >
                {mentorship.buttonText}
              </a>
            )}
          </div>

          {mentorship.image?.url && (
            <div className="alumni-mentorship-image">
              <img src={mentorship.image.url} alt={mentorship.title} />
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTRIBUTION ================= */}
      <section className="alumni-contribution">
        <div className="alumni-container">
          <div className="alumni-contribution-inner">
            <span className="alumni-section-label">MAKE A DIFFERENCE</span>

            <h2>{contribution.title || "Give Back to Your Alma Mater"}</h2>

            <p>
              {contribution.description ||
                "Your experience, time and support can help strengthen the next generation."}
            </p>

            {contribution.buttonText && (
              <a
                href={contribution.buttonLink || "/contact-us"}
                className="alumni-primary-btn"
              >
                {contribution.buttonText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="alumni-final-cta">
        <div className="alumni-container">
          <div className="alumni-final-cta-content">
            <h2>{cta.title || "Be Part of the IMSEC Alumni Family"}</h2>

            <p>
              {cta.description ||
                "Stay connected. Stay involved. Stay part of IMSEC."}
            </p>

            {cta.buttonText && (
              <a
                href={cta.buttonLink || "/alumni/registration"}
                className="alumni-primary-btn"
              >
                {cta.buttonText}
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   COMPONENTS
========================================================= */

const SectionHeading = ({ label, title, description }) => (
  <div className="alumni-section-heading">
    <span>{label}</span>

    <h2>{title}</h2>

    {description && <p>{description}</p>}
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="alumni-stat-card">
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const FeaturedAlumniCard = ({ item }) => (
  <article className="featured-alumni-card">
    <div className="featured-alumni-image">
      {item.image?.url ? (
        <img src={item.image.url} alt={item.name} />
      ) : (
        <div className="alumni-card-placeholder">
          {item.name?.charAt(0) || "A"}
        </div>
      )}
    </div>

    <div className="featured-alumni-content">
      <h3>{item.name}</h3>

      {(item.batch || item.course) && (
        <div className="alumni-meta">
          {item.batch && <span>{item.batch}</span>}

          {item.course && <span>{item.course}</span>}
        </div>
      )}

      {item.designation && (
        <p className="alumni-designation">{item.designation}</p>
      )}

      {item.company && <p className="alumni-company">{item.company}</p>}

      {item.location && <p className="alumni-location">{item.location}</p>}

      {item.description && <p>{item.description}</p>}

      {item.achievement && (
        <p className="alumni-achievement">{item.achievement}</p>
      )}

      <div className="alumni-card-links">
        {item.linkedin && (
          <a href={item.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}

        {item.website && (
          <a href={item.website} target="_blank" rel="noreferrer">
            Website
          </a>
        )}
      </div>
    </div>
  </article>
);

const AchievementCard = ({ item }) => (
  <article className="alumni-achievement-card">
    {item.image?.url && (
      <div className="achievement-image">
        <img src={item.image.url} alt={item.title} />
      </div>
    )}

    <div className="achievement-content">
      {item.year && <span className="achievement-year">{item.year}</span>}

      <h3>{item.title}</h3>

      {item.alumniName && <strong>{item.alumniName}</strong>}

      {item.designation && <span>{item.designation}</span>}

      {item.company && <span>{item.company}</span>}

      {item.description && <p>{item.description}</p>}
    </div>
  </article>
);

const SuccessStoryCard = ({ item }) => (
  <article className="alumni-story-card">
    {item.image?.url && (
      <div className="story-image">
        <img src={item.image.url} alt={item.name} />
      </div>
    )}

    <div className="story-content">
      <span className="story-label">SUCCESS STORY</span>

      <h3>{item.title || `${item.name}'s IMSEC Journey`}</h3>

      <div className="story-person">
        <strong>{item.name}</strong>

        {item.batch && <span>Batch {item.batch}</span>}
      </div>

      {(item.designation || item.company) && (
        <p className="story-career">
          {item.designation}
          {item.designation && item.company && " • "}
          {item.company}
        </p>
      )}

      {item.story && <p>{item.story}</p>}

      {item.linkedin && (
        <a
          href={item.linkedin}
          target="_blank"
          rel="noreferrer"
          className="story-link"
        >
          Connect on LinkedIn →
        </a>
      )}
    </div>
  </article>
);

const TestimonialCard = ({ item }) => (
  <article className="alumni-testimonial-card">
    <div className="testimonial-quote">“</div>

    <p className="testimonial-message">{item.message}</p>

    <div className="testimonial-person">
      {item.image?.url ? (
        <img src={item.image.url} alt={item.name} />
      ) : (
        <div className="testimonial-placeholder">
          {item.name?.charAt(0) || "A"}
        </div>
      )}

      <div>
        <strong>{item.name}</strong>

        {item.batch && <span>Batch {item.batch}</span>}

        {item.designation && <span>{item.designation}</span>}

        {item.company && <span>{item.company}</span>}
      </div>
    </div>
  </article>
);

const AlumniEventCard = ({ item }) => (
  <article className="alumni-event-card">
    {item.image?.url && (
      <div className="event-image">
        <img src={item.image.url} alt={item.title} />
      </div>
    )}

    <div className="event-content">
      {item.date && <span className="event-date">{formatDate(item.date)}</span>}

      <h3>{item.title}</h3>

      {item.description && <p>{item.description}</p>}

      <div className="event-details">
        {item.time && <span>🕒 {item.time}</span>}

        {item.venue && <span>📍 {item.venue}</span>}

        {item.chapter && <span>{item.chapter}</span>}
      </div>

      {item.registrationLink && (
        <a
          href={item.registrationLink}
          target="_blank"
          rel="noreferrer"
          className="alumni-small-btn"
        >
          Register
        </a>
      )}
    </div>
  </article>
);

const ChapterCard = ({ item }) => (
  <article className="alumni-chapter-card">
    {item.image?.url && (
      <div className="chapter-image">
        <img src={item.image.url} alt={item.name} />
      </div>
    )}

    <div className="chapter-content">
      <span className="chapter-label">ALUMNI CHAPTER</span>

      <h3>{item.name}</h3>

      {(item.city || item.country) && (
        <p className="chapter-location">
          📍 {item.city}
          {item.city && item.country && ", "}
          {item.country}
        </p>
      )}

      {item.description && <p>{item.description}</p>}

      {item.coordinator && (
        <div className="chapter-coordinator">
          <strong>Coordinator</strong>

          <span>{item.coordinator}</span>
        </div>
      )}

      {item.email && (
        <a href={`mailto:${item.email}`} className="chapter-contact">
          {item.email}
        </a>
      )}

      {item.phone && (
        <a href={`tel:${item.phone}`} className="chapter-contact">
          {item.phone}
        </a>
      )}

      {/* Chapter PDF */}
      {item.pdfUrl && (
        <a
          href={item.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="alumni-pdf-btn"
        >
          View Chapter PDF
        </a>
      )}
    </div>
  </article>
);

const formatDate = (date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

export default Alumni;
