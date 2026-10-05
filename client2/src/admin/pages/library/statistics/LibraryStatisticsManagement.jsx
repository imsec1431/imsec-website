import { useEffect, useState } from "react";
import {
  FaBook,
  FaJournalWhills,
  FaNewspaper,
  FaChair,
  FaQuestionCircle,
} from "react-icons/fa";

import {
  getStatistics,
  addStatistic,
  updateStatistic,
  deleteStatistic,
} from "../../../services/libraryStatisticService";

// Define icon map to render icons based on string keys
const iconMap = {
  books: <FaBook className="text-primary" />,
  journal: <FaJournalWhills className="text-success" />,
  magazine: <FaNewspaper className="text-warning" />,
  chair: <FaChair className="text-info" />,
};

const LibraryStatisticsManagement = () => {
  const [statistics, setStatistics] = useState([]);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchStatistics = async () => {
    try {
      const res = await getStatistics();
      if (res.data?.success) {
        setStatistics(res.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const resetForm = () => {
    setTitle("");
    setValue("");
    setIcon("");
    setDisplayOrder(1);
    setActive(true);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return alert("Title is required");
    }

    if (!value.trim()) {
      return alert("Value is required");
    }

    const duplicate = statistics.find(
      (item) => item.title === title && item._id !== editId
    );

    if (duplicate) {
      return alert("This statistic already exists.");
    }

    const data = {
      title,
      value,
      icon,
      displayOrder,
      active,
    };

    try {
      setLoading(true);

      if (editId) {
        await updateStatistic(editId, data);
        alert("Updated Successfully");
      } else {
        await addStatistic(data);
        alert("Added Successfully");
      }

      await fetchStatistics();
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (statistic) => {
    setEditId(statistic._id);
    setTitle(statistic.title || "");
    setValue(statistic.value || "");
    setIcon(statistic.icon || "");
    setDisplayOrder(statistic.displayOrder ?? 1);
    setActive(Boolean(statistic.active));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this statistic?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteStatistic(id);
      alert("Statistic Deleted Successfully");
      await fetchStatistics();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete Failed");
    } finally {
      setLoading(false);
    }
  };

  // Safe search filtering
  const filteredStatistics = statistics.filter((item) => {
    const searchTerm = search.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(searchTerm);
    const valueMatch = item.value?.toLowerCase().includes(searchTerm);
    return titleMatch || valueMatch;
  });

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {editId ? "Update Library Statistic" : "Add Library Statistic"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Title */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Title</label>
            <select
              className="form-select"
              value={title}
              onChange={(e) => {
                const selectedTitle = e.target.value;
                setTitle(selectedTitle);

                // Automatically select the correct icon
                switch (selectedTitle) {
                  case "Books":
                    setIcon("books");
                    break;
                  case "National Journals":
                    setIcon("journal");
                    break;
                  case "Magazines":
                    setIcon("magazine");
                    break;
                  case "Seating Capacity":
                    setIcon("chair");
                    break;
                  default:
                    setIcon("");
                }
              }}
            >
              <option value="">Select Title</option>
              <option value="Books">Books</option>
              <option value="National Journals">National Journals</option>
              <option value="Magazines">Magazines</option>
              <option value="Seating Capacity">Seating Capacity</option>
            </select>
          </div>

          {/* Value */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Value</label>
            <input
              type="text"
              className="form-control"
              placeholder="Example : 35,000+"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* Display Order */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          {/* Active */}
          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="activeCheck"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="activeCheck">
                Active
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`btn ${editId ? "btn-warning" : "btn-primary"}`}
          disabled={loading}
        >
          {loading
            ? "Please Wait..."
            : editId
            ? "Update Statistic"
            : "Add Statistic"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      <hr className="my-5" />

      <h3 className="mb-3">Library Statistics</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Value</th>
              <th>Icon</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ width: "170px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStatistics.length > 0 ? (
              filteredStatistics.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.value}</td>
                  <td style={{ textAlign: "center", fontSize: "22px" }}>
                    {iconMap[item.icon] || (
                      <FaQuestionCircle className="text-muted" />
                    )}
                  </td>
                  <td>{item.displayOrder}</td>
                  <td>
                    {item.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      disabled={loading}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  No Statistics Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibraryStatisticsManagement;