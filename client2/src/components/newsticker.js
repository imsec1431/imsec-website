import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/news-ticker`;

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  // =========================================================
  // LOAD NEWS FROM BACKEND
  // =========================================================

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await axios.get(API_URL);

        setNews(response.data?.data || []);
      } catch (error) {
        console.error("Unable to load news ticker:", error);

        setNews([]);
      }
    };

    loadNews();
  }, []);

  // =========================================================
  // OPEN MODAL
  // =========================================================

  const handleTitleClick = (item) => {
    setSelectedNews(item);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setSelectedNews(null);
  };

  return (
    <>
      <style>{`

        /* =====================================================
           TICKER
        ===================================================== */

        .ticker-container{
          width:100%;
          background:#FDB913;
          display:flex;
          align-items:center;
          overflow:hidden;
          border-top:1px solid #ddd;
          border-bottom:1px solid #ddd;
          height:45px;
        }

        .ticker-label{
          background:#0A2E5C;
          color:#fff;
          min-width:180px;
          height:45px;

          display:flex;
          align-items:center;
          justify-content:center;

          font-weight:700;
          font-size:15px;

          z-index:5;
          flex-shrink:0;
        }

        .ticker-wrapper{
          overflow:hidden;
          flex:1;
          white-space:nowrap;
        }

        .ticker{
          display:inline-block;
          white-space:nowrap;

          animation:scroll 35s linear infinite;
        }

        .ticker-wrapper:hover .ticker{
          animation-play-state:paused;
        }

        .ticker-item{
          display:inline-block;

          margin-right:80px;

          color:#0A2E5C;

          font-weight:600;

          cursor:pointer;

          transition:.3s;
        }

        .ticker-item:hover{
          color:blue;
          text-decoration:underline;
        }

        @keyframes scroll{

          0%{
            transform:translateX(10%);
          }

          100%{
            transform:translateX(-100%);
          }

        }


        /* =====================================================
           MODAL
        ===================================================== */

        .news-modal-overlay{
          position:fixed;

          top:0;
          left:0;

          width:100%;
          height:100%;

          background:rgba(0,0,0,.55);

          display:flex;

          align-items:center;
          justify-content:center;

          z-index:99999;

          padding:20px;
        }

        .news-modal{

          width:100%;
          max-width:650px;

          background:#fff;

          border-radius:8px;

          box-shadow:
            0 8px 30px rgba(0,0,0,.25);

          overflow:hidden;

          animation:modalShow .2s ease-in-out;
        }

        @keyframes modalShow{

          from{
            opacity:0;
            transform:translateY(-25px);
          }

          to{
            opacity:1;
            transform:translateY(0);
          }

        }


        /* =====================================================
           MODAL HEADER
        ===================================================== */

        .news-modal-header{

          display:flex;

          align-items:center;
          justify-content:space-between;

          padding:15px 20px;

          background:#0A2E5C;

          color:#fff;
        }

        .news-modal-header h5{

          margin:0;

          font-size:19px;

          font-weight:600;
        }

        .news-modal-close{

          border:0;

          background:transparent;

          color:#fff;

          font-size:28px;

          line-height:1;

          cursor:pointer;
        }


        /* =====================================================
           MODAL BODY
        ===================================================== */

        .news-modal-body{

          padding:25px;

        }

        .news-modal-news-title{

          color:#0A2E5C;

          font-size:22px;

          font-weight:700;

          margin-bottom:15px;
        }

        .news-modal-description{

          color:#555;

          font-size:15px;

          line-height:1.7;

          margin-bottom:25px;

          white-space:pre-line;
        }


        /* =====================================================
           PDF / LINK BUTTON
        ===================================================== */

        .news-view-button{

          display:inline-block;

          padding:9px 18px;

          background:#0A2E5C;

          color:#fff;

          border-radius:5px;

          text-decoration:none;

          font-size:14px;

          font-weight:600;
        }

        .news-view-button:hover{

          background:#082448;

          color:#fff;
        }


        /* =====================================================
           MODAL FOOTER
        ===================================================== */

        .news-modal-footer{

          display:flex;

          justify-content:flex-end;

          padding:15px 20px;

          border-top:1px solid #dee2e6;

          background:#f8f9fa;
        }

        .news-close-button{

          padding:9px 18px;

          border:1px solid #6c757d;

          background:#fff;

          color:#333;

          border-radius:5px;

          cursor:pointer;

          font-size:14px;
        }

        .news-close-button:hover{

          background:#e9ecef;

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media(max-width:768px){

          .ticker-container{
            height:40px;
          }

          .ticker-label{

            min-width:110px;

            height:40px;

            font-size:12px;
          }

          .ticker-item{

            font-size:13px;

            margin-right:40px;
          }

          .news-modal{

            max-width:95%;
          }

          .news-modal-body{

            padding:20px;
          }

          .news-modal-news-title{

            font-size:19px;
          }

        }

      `}</style>

      {/* =====================================================
          NEWS TICKER
      ===================================================== */}

      <div className="ticker-container">
        {/* Fixed Latest News Label */}

        <div className="ticker-label">📢 Latest News</div>

        {/* Scrolling Titles */}

        <div className="ticker-wrapper">
          <div className="ticker">
            {news.map((item) => (
              <span
                key={item._id}
                className="ticker-item"
                onClick={() => handleTitleClick(item)}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          NEWS DETAILS MODAL
      ===================================================== */}

      {selectedNews && (
        <div className="news-modal-overlay" onClick={handleCloseModal}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}

            <div className="news-modal-header">
              <h5>Latest News</h5>

              <button
                type="button"
                className="news-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* BODY */}

            <div className="news-modal-body">
              <div className="news-modal-news-title">{selectedNews.title}</div>

              <div className="news-modal-description">
                {selectedNews.description}
              </div>

              {selectedNews.pdfLink && (
                <a
                  href={selectedNews.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-view-button"
                >
                  {selectedNews.buttonText || "View Details"}
                </a>
              )}
            </div>

            {/* FOOTER */}

            <div className="news-modal-footer">
              <button
                type="button"
                className="news-close-button"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsTicker;
