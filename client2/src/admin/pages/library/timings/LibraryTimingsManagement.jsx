import { useEffect, useState } from "react";

import {
  getLibraryTiming,
  saveLibraryTiming,
} from "../../../services/libraryTimingService";

const LibraryTimingsManagement = () => {
  const [mondayFriday, setMondayFriday] = useState("");

  const [saturday, setSaturday] = useState("");

  const [sunday, setSunday] = useState("Closed");

  const [holidayNote, setHolidayNote] = useState("");

  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTiming();
  }, []);

  const fetchTiming = async () => {
    try {
      const res = await getLibraryTiming();

      if (res.data.data) {
        const data = res.data.data;

        setMondayFriday(data.mondayFriday);

        setSaturday(data.saturday);

        setSunday(data.sunday);

        setHolidayNote(data.holidayNote);

        setActive(data.active);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mondayFriday.trim()) {
      return alert("Enter Monday-Friday timing");
    }

    if (!saturday.trim()) {
      return alert("Enter Saturday timing");
    }

    const data = {
      mondayFriday,
      saturday,
      sunday,
      holidayNote,
      active,
    };

    try {
      setLoading(true);

      await saveLibraryTiming(data);

      alert("Library Timing Saved Successfully");
    } catch (error) {
      // console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container py-4">
      <h2 className="mb-4">Library Timings</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Monday - Friday</label>

            <input
              type="text"
              className="form-control"
              placeholder="09:00 AM - 06:00 PM"
              value={mondayFriday}
              onChange={(e) => setMondayFriday(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Saturday</label>

            <input
              type="text"
              className="form-control"
              placeholder="09:00 AM - 02:00 PM"
              value={saturday}
              onChange={(e) => setSaturday(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Sunday</label>

            <input
              type="text"
              className="form-control"
              value={sunday}
              onChange={(e) => setSunday(e.target.value)}
            />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Holiday Note</label>

            <textarea
              rows="3"
              className="form-control"
              value={holidayNote}
              onChange={(e) => setHolidayNote(e.target.value)}
            />
          </div>

          <div className="col-md-12 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />

              <label className="form-check-label">Active</label>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Library Timings"}
        </button>
      </form>
    </div>
  );
};

export default LibraryTimingsManagement;
