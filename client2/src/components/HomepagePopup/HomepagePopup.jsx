import React, { useEffect, useMemo, useState } from "react";
import "./HomepagePopup.css";
import homepagePopupService from "../../services/homepagePopupService";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getFileUrl = (filePath) => {
  if (!filePath) return "";

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://") ||
    filePath.startsWith("data:")
  ) {
    return filePath;
  }

  if (filePath.startsWith("/")) {
    return `${API_BASE_URL}${filePath}`;
  }

  return `${API_BASE_URL}/${filePath}`;
};

const HomepagePopup = () => {
  const [popups, setPopups] = useState([]);
  const [settings, setSettings] = useState({
    rotationEnabled: true,
    rotationInterval: 5,
    published: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  /* ---------------------------------------------
     LOAD POPUPS
  --------------------------------------------- */
  useEffect(() => {
    const loadPopups = async () => {
      try {
        setLoading(true);

        const response = await homepagePopupService.getActiveHomepagePopups();

        const activePopups = Array.isArray(response?.data)
          ? response.data
              .filter((popup) => popup?.isActive !== false)
              .sort(
                (a, b) =>
                  Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0),
              )
          : [];

        const popupSettings = response?.settings || {
          rotationEnabled: true,
          rotationInterval: 5,
          published: true,
        };

        setPopups(activePopups);
        setSettings({
          rotationEnabled: popupSettings.rotationEnabled ?? true,
          rotationInterval: popupSettings.rotationInterval ?? 5,
          published: popupSettings.published ?? true,
        });

        setCurrentIndex(0);
      } catch (error) {
        console.error("Homepage popup loading error:", error);
        setPopups([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopups();
  }, []);

  /* ---------------------------------------------
     RESET INDEX IF REQUIRED
  --------------------------------------------- */
  useEffect(() => {
    if (currentIndex >= popups.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, popups.length]);

  /* ---------------------------------------------
     AUTO ROTATION
  --------------------------------------------- */
  useEffect(() => {
    if (
      !settings.published ||
      !settings.rotationEnabled ||
      popups.length <= 1 ||
      paused ||
      !visible
    ) {
      return undefined;
    }

    const intervalSeconds = Math.max(Number(settings.rotationInterval) || 5, 2);

    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % popups.length;
      });
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [
    settings.rotationEnabled,
    settings.rotationInterval,
    settings.published,
    popups.length,
    paused,
    visible,
  ]);

  /* ---------------------------------------------
     CURRENT POPUP
  --------------------------------------------- */
  const currentPopup = useMemo(() => {
    if (!popups.length) return null;

    return popups[currentIndex] || popups[0];
  }, [popups, currentIndex]);

  /* ---------------------------------------------
     NAVIGATION
  --------------------------------------------- */
  const goNext = () => {
    if (popups.length <= 1) return;

    setCurrentIndex((previousIndex) => (previousIndex + 1) % popups.length);
  };

  const goPrevious = () => {
    if (popups.length <= 1) return;

    setCurrentIndex(
      (previousIndex) => (previousIndex - 1 + popups.length) % popups.length,
    );
  };

  const goToPopup = (index) => {
    setCurrentIndex(index);
  };

  /* ---------------------------------------------
     CLOSE
  --------------------------------------------- */
  const handleClose = () => {
    setVisible(false);
  };

  /* ---------------------------------------------
     STATES
  --------------------------------------------- */
  if (loading) {
    return null;
  }

  if (!visible) {
    return null;
  }

  if (!settings.published) {
    return null;
  }

  if (!currentPopup) {
    return null;
  }

  const fileUrl = getFileUrl(currentPopup.filePath);

  return (
    <div
      className="homepage-popup-overlay"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="homepage-popup-container">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="homepage-popup-close"
          onClick={handleClose}
          aria-label="Close popup"
        >
          ×
        </button>

        {/* POPUP CONTENT */}
        <div className="homepage-popup-content">
          {currentPopup.type === "pdf" ? (
            <iframe
              src={fileUrl}
              title={currentPopup.title || "Homepage Popup"}
              className="homepage-popup-pdf"
            />
          ) : (
            <img
              src={fileUrl}
              alt={currentPopup.title || "Homepage Popup"}
              className="homepage-popup-image"
            />
          )}
        </div>

        {/* TITLE */}
        {currentPopup.title && (
          <div className="homepage-popup-title">{currentPopup.title}</div>
        )}

        {/* PREVIOUS / NEXT */}
        {popups.length > 1 && (
          <>
            <button
              type="button"
              className="homepage-popup-arrow homepage-popup-prev"
              onClick={goPrevious}
              aria-label="Previous popup"
            >
              ‹
            </button>

            <button
              type="button"
              className="homepage-popup-arrow homepage-popup-next"
              onClick={goNext}
              aria-label="Next popup"
            >
              ›
            </button>
          </>
        )}

        {/* DOTS */}
        {popups.length > 1 && (
          <div className="homepage-popup-dots">
            {popups.map((popup, index) => (
              <button
                key={popup._id || index}
                type="button"
                className={`homepage-popup-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToPopup(index)}
                aria-label={`Show popup ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* ROTATION INDICATOR */}
        {settings.rotationEnabled && popups.length > 1 && (
          <div className="homepage-popup-rotation">
            {paused
              ? "Paused"
              : `Auto changing every ${settings.rotationInterval}s`}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepagePopup;
