import React, { useEffect, useMemo, useState } from "react";

import "../CSS/AcademicResults.css";

import {
  FaSearch,
  FaUserGraduate,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

import { getPublicAcademicResults } from "../../../services/departmentPublicService";

/* =========================================================
   CHART.JS REGISTRATION
========================================================= */

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/* =========================================================
   DEPARTMENT
========================================================= */

const DEPARTMENT_SLUG = "master-of-business-administration";

/* =========================================================
   HELPER
========================================================= */

const getNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const number = parseFloat(String(value).replace("%", "").trim());

  return Number.isFinite(number) ? number : null;
};

/* =========================================================
   YEAR SORTING

   Example:

   2024-25
   2025-26
   2026-27
   2027-28

   Always display from LEFT → RIGHT
   chronologically.
========================================================= */

const getYearNumber = (year) => {
  const match = String(year || "").match(/\d{4}/);

  return match ? Number(match[0]) : 0;
};

const sortByAcademicYear = (items) => {
  return [...items].sort((a, b) => {
    return getYearNumber(a.academicYear) - getYearNumber(b.academicYear);
  });
};

/* =========================================================
   SESSION SORTING

   Required chart/card order:

   CHARTS:
   2024-25 Odd
   2024-25 Even
   2025-26 Odd
   2025-26 Even

   CARDS:
   2025-26 Even
   2025-26 Odd
   2024-25 Even
   2024-25 Odd
========================================================= */

const getSessionType = (session) => {
  const value = String(session || "")
    .trim()
    .toLowerCase();

  if (
    value.includes("odd") ||
    value.includes("odd semester") ||
    value === "1,3" ||
    value === "1-3"
  ) {
    return "odd";
  }

  if (
    value.includes("even") ||
    value.includes("even semester") ||
    value === "2,4" ||
    value === "2-4"
  ) {
    return "even";
  }

  return "";
};

const getSessionRank = (session) => {
  const type = getSessionType(session);

  if (type === "odd") return 0;
  if (type === "even") return 1;

  return 2;
};

const sortYearThenSessionAscending = (items) => {
  return [...items].sort((a, b) => {
    const yearDifference =
      getYearNumber(a.academicYear) - getYearNumber(b.academicYear);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    const sessionDifference =
      getSessionRank(a.session) - getSessionRank(b.session);

    if (sessionDifference !== 0) {
      return sessionDifference;
    }

    return String(a.session || "").localeCompare(
      String(b.session || ""),
      undefined,
      { numeric: true },
    );
  });
};

const sortSessionCardsDescending = (items) => {
  return [...items].sort((a, b) => {
    const yearDifference =
      getYearNumber(b.academicYear) - getYearNumber(a.academicYear);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    return getSessionRank(b.session) - getSessionRank(a.session);
  });
};

const getSemesterNumber = (semester) => {
  const value = String(semester || "")
    .trim()
    .toLowerCase();

  const numericMatch = value.match(/\d+/);

  if (numericMatch) {
    return Number(numericMatch[0]);
  }

  const romanMap = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
  };

  return romanMap[value] || null;
};

const getSemesterResult = (item, semesterNumber) => {
  if (!Array.isArray(item?.semesters)) {
    return null;
  }

  const semester = item.semesters.find(
    (entry) => getSemesterNumber(entry?.semester) === semesterNumber,
  );

  return getNumber(semester?.result);
};

const getSemesterLabel = (semesterNumber) => {
  const labels = {
    1: "1 Sem",
    2: "2 Sem",
    3: "3 Sem",
    4: "4 Sem",
    5: "5 Sem",
    6: "6 Sem",
    7: "7 Sem",
    8: "8 Sem",
  };

  return labels[semesterNumber] || `${semesterNumber} Sem`;
};

/* =========================================================
   COMPONENT
========================================================= */

const AcademicResults = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getPublicAcademicResults(DEPARTMENT_SLUG);

        if (!response?.success) {
          throw new Error(
            response?.message || "Failed to load academic results",
          );
        }

        if (response.exists === false || !response.data) {
          setResults([]);

          return;
        }

        const resultData = Array.isArray(response.data.results)
          ? response.data.results
          : [];

        setResults(resultData);
      } catch (err) {
        console.error("Public Academic Results Error:", err);

        setError(err.message || "Failed to load academic results");

        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  /* =======================================================
     SORT RESULTS
  ======================================================= */

  const sortedResults = useMemo(() => {
    return sortByAcademicYear(results);
  }, [results]);

  /* =======================================================
     FILTER LIST
  ======================================================= */

  const filters = useMemo(() => {
    const years = [
      ...new Set(
        sortedResults.map((item) => item.academicYear).filter(Boolean),
      ),
    ];

    return ["All", "Current Year", "Previous Years", ...years];
  }, [sortedResults]);

  /* =======================================================
     FILTER RESULTS
  ======================================================= */

  const filteredResults = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return sortedResults.filter((item) => {
      const academicYear = String(item.academicYear || "").toLowerCase();

      const session = String(item.session || "").toLowerCase();

      const searchMatch =
        !keyword || academicYear.includes(keyword) || session.includes(keyword);

      switch (activeFilter) {
        case "Current Year":
          return searchMatch && item.currentSession === true;

        case "Previous Years":
          return searchMatch && item.currentSession !== true;

        case "All":
          return searchMatch;

        default:
          return searchMatch && item.academicYear === activeFilter;
      }
    });
  }, [sortedResults, search, activeFilter]);

  /* =======================================================
     CHART RESULTS

     IMPORTANT:
     Charts use FILTERED RESULTS.
     Therefore when user selects a year,
     graphics also change automatically.
  ======================================================= */

  const chartResults = useMemo(() => {
    return sortYearThenSessionAscending(filteredResults);
  }, [filteredResults]);

  /* =======================================================
     CHART SESSION POINTS

     Each academic year is shown as:

     2024-25 Odd
     2024-25 Even
     2025-26 Odd
     2025-26 Even

     The semester chart expands each session into:
     Odd  -> 1,3,5,7
     Even -> 2,4,6,8
  ======================================================= */

  const chartSessionPoints = useMemo(() => {
    return chartResults.flatMap((item) => {
      const sessionType = getSessionType(item.session);

      if (!sessionType) {
        return [
          {
            item,
            sessionType: "",
            label: `${item.academicYear || "—"} ${item.session || ""}`.trim(),
          },
        ];
      }

      return [
        {
          item,
          sessionType,
          label: `${item.academicYear || "—"} ${
            sessionType === "odd" ? "Odd" : "Even"
          }`,
        },
      ];
    });
  }, [chartResults]);

  const semesterChartPoints = useMemo(() => {
    return chartSessionPoints.flatMap(({ item, sessionType, label }) => {
      const semesterNumbers =
        sessionType === "odd"
          ? [1, 3, 5, 7]
          : sessionType === "even"
            ? [2, 4, 6, 8]
            : [1, 2, 3, 4, 5, 6, 7, 8];

      /*
        IMPORTANT:
        Only create a graph point when the semester result
        actually exists.

        Example:
        If 2025-26 Odd has only:
          1 Sem = 91
          3 Sem = 93

        the graph will show only:

        2025-26 Odd (1 Sem)
        2025-26 Odd (3 Sem)

        It will NOT show:
        2025-26 Odd (5 Sem)
        2025-26 Odd (7 Sem)

        This also means the year/session label appears
        only when there is real semester data.
      */

      return semesterNumbers
        .map((semesterNumber) => {
          const result = getSemesterResult(item, semesterNumber);

          if (result === null) {
            return null;
          }

          return {
            item,
            sessionType,
            sessionLabel: label,
            semesterNumber,
            label: `${label} (${getSemesterLabel(semesterNumber)})`,
            result,
          };
        })
        .filter(Boolean);
    });
  }, [chartSessionPoints]);

  /* =======================================================
     OVERALL RESULT CHART DATA
  ======================================================= */

  const overallChartData = useMemo(() => {
    return {
      labels: chartSessionPoints.map((point) => point.label),

      datasets: [
        {
          label: "Overall Result",

          data: chartSessionPoints.map(
            (point) => getNumber(point.item.overallResult) ?? 0,
          ),

          borderWidth: 3,

          tension: 0.35,

          pointRadius: 6,

          pointHoverRadius: 8,

          fill: true,

          backgroundColor: "rgba(21, 101, 192, 0.12)",

          borderColor: "#1565C0",

          pointBackgroundColor: "#1565C0",

          pointBorderColor: "#ffffff",

          pointBorderWidth: 2,
        },
      ],
    };
  }, [chartSessionPoints]);

  /* =======================================================
     SEMESTER CHART DATA
  ======================================================= */

  const semesterChartData = useMemo(() => {
    const labels = semesterChartPoints.map((point) => point.label);

    return {
      labels,

      datasets: [
        {
          label: "Semester Result",

          data: semesterChartPoints.map((point) => point.result),

          backgroundColor: semesterChartPoints.map((point) =>
            point.sessionType === "odd" ? "#1565C0" : "#00897B",
          ),

          borderColor: semesterChartPoints.map((point) =>
            point.sessionType === "odd" ? "#0D47A1" : "#00695C",
          ),

          borderWidth: 1,

          borderRadius: 7,

          maxBarThickness: 45,
        },
      ],
    };
  }, [semesterChartPoints]);

  /* =======================================================
     OVERALL CHART OPTIONS
  ======================================================= */

  const overallChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: true,

        position: "top",

        labels: {
          usePointStyle: true,

          padding: 18,

          font: {
            family: "Poppins",
            size: 13,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "rgba(13, 71, 161, 0.95)",

        padding: 12,

        displayColors: false,

        callbacks: {
          title: (items) => {
            return items[0]?.label || "";
          },

          label: (context) => {
            return `Overall Result: ${context.parsed.y}%`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#555",

          font: {
            family: "Poppins",
            size: 12,
            weight: "500",
          },
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax: 100,

        max: 100,

        ticks: {
          stepSize: 10,

          color: "#666",

          callback: (value) => `${value}%`,

          font: {
            family: "Poppins",
            size: 12,
          },
        },

        grid: {
          color: "rgba(13, 71, 161, 0.10)",

          drawBorder: false,
        },
      },
    },
  };

  /* =======================================================
     SEMESTER CHART OPTIONS
  ======================================================= */

  const semesterChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,

        position: "top",

        labels: {
          usePointStyle: true,

          padding: 18,

          font: {
            family: "Poppins",
            size: 12,
            weight: "600",
          },
        },
      },

      tooltip: {
        padding: 12,

        callbacks: {
          title: (items) => {
            return items[0]?.label || "";
          },

          label: (context) => {
            return `Result: ${context.parsed.y}%`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#555",

          font: {
            family: "Poppins",
            size: 12,
            weight: "500",
          },
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax: 100,

        max: 100,

        ticks: {
          stepSize: 10,

          color: "#666",

          callback: (value) => `${value}%`,
        },

        grid: {
          color: "rgba(13, 71, 161, 0.10)",

          drawBorder: false,
        },
      },
    },
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="academicResultsPage">
        <section className="resultsHero">
          <h1>MBA Academic Performance</h1>

          <p>
            The Department of MBA consistently demonstrates academic excellence
            with outstanding AKTU university results, university rank holders,
            and excellent student performance across all academic sessions.
          </p>
        </section>

        <div className="resultsLoading">
          <FaUserGraduate />

          <h3>Loading Academic Results...</h3>

          <p>Please wait while we fetch the latest results.</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="academicResultsPage">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="resultsHero">
        <div className="heroDecoration heroDecorationOne"></div>

        <div className="heroDecoration heroDecorationTwo"></div>

        <h1>MBA Academic Performance</h1>

        <p>
          The Department of MBA consistently demonstrates academic excellence
          with outstanding AKTU university results, university rank holders, and
          excellent student performance across all academic sessions.
        </p>
      </section>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <section className="searchSection">
        <div className="searchBox">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Academic Session..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ===================================================
          FILTER
      =================================================== */}

      <section className="filterSection">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filterBtn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && <div className="resultsError">{error}</div>}

      {/* ===================================================
          GRAPHICS SECTION
      =================================================== */}

      {chartResults.length > 0 && (
        <section className="academicChartsSection">
          <div className="chartsHeading">
            <span>PERFORMANCE ANALYTICS</span>

            <h2>Academic Result Trends</h2>

            <p>
              Academic sessions are shown from left to right in year-wise Odd
              and Even order.
            </p>
          </div>

          {/* ===============================================
              OVERALL RESULT GRAPH
          =============================================== */}

          <div className="academicChartCard">
            <div className="academicChartHeader">
              <div className="academicChartIcon">
                <FaChartLine />
              </div>

              <div>
                <h3>Overall Result Trend</h3>

                <p>Overall result in the order: Year Odd → Year Even.</p>
              </div>
            </div>

            <div className="academicChartContainer">
              <Line data={overallChartData} options={overallChartOptions} />
            </div>
          </div>

          {/* ===============================================
              SEMESTER RESULT GRAPH
          =============================================== */}

          {semesterChartPoints.length > 0 && (
            <div className="academicChartCard">
              <div className="academicChartHeader">
                <div className="academicChartIcon semesterChartIcon">
                  <FaChartBar />
                </div>

                <div>
                  <h3>Semester-wise Result</h3>

                  <p>
                    Odd sessions show 1, 3, 5, 7 Sem and Even sessions show 2,
                    4, 6, 8 Sem in year-wise order.
                  </p>
                </div>
              </div>

              <div className="academicChartContainer">
                <Bar data={semesterChartData} options={semesterChartOptions} />
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================
          RESULT CARDS
      =================================================== */}

      <section className="resultsSection">
        <div className="resultsSectionHeading">
          <span>ACADEMIC RECORDS</span>

          <h2>Session-wise Results</h2>
        </div>

        <div className="resultsGrid">
          {filteredResults.length > 0 ? (
            sortSessionCardsDescending(filteredResults).map((item, index) => {
              const semester1 = item.semesters?.[0];

              const semester2 = item.semesters?.[1];

              return (
                <div className="resultCard" key={item._id || index}>
                  <div className="cardTop">
                    <span
                      className={
                        item.currentSession ? "currentTag" : "previousTag"
                      }
                    >
                      {item.currentSession
                        ? "Current Session"
                        : "Previous Session"}
                    </span>

                    <h2>
                      {item.academicYear || "—"}

                      {" ("}

                      {item.session || "—"}

                      {")"}
                    </h2>
                  </div>

                  <div className="overallSection">
                    <h4>Overall Result</h4>

                    <h1>{item.overallResult || "—"}%</h1>
                  </div>

                  <div className="semesterGrid">
                    <div className="semesterBox">
                      <h5>Semester {semester1?.semester || "—"}</h5>

                      <span>{semester1?.result || "—"}%</span>
                    </div>

                    <div className="semesterBox">
                      <h5>Semester {semester2?.semester || "—"}</h5>

                      <span>{semester2?.result || "—"}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="noResults">
              <FaUserGraduate />

              <h3>No Academic Results Found</h3>

              <p>
                No results are available for the selected session or search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AcademicResults;
