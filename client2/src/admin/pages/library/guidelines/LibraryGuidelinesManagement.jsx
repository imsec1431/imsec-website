import { useEffect, useState } from "react";

import {
  getGuidelines,
  addGuideline,
  updateGuideline,
  deleteGuideline,
} from "../../../services/libraryGuidelineService";

const LibraryGuidelinesManagement = () => {
  const [guidelines, setGuidelines] = useState([]);

  const [guideline, setGuideline] = useState("");

  const [displayOrder, setDisplayOrder] = useState(1);

  const [active, setActive] = useState(true);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const res = await getGuidelines();

      if (res.data.success) {
        setGuidelines(res.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const filteredGuidelines = guidelines.filter((item) =>
    item.guideline.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setGuideline("");
    setDisplayOrder(1);
    setActive(true);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guideline.trim()) {
      return alert("Guideline is required");
    }

    const data = {
      guideline,
      displayOrder,
      active,
    };

    try {
      setLoading(true);

      if (editId) {
        await updateGuideline(editId, data);

        alert("Guideline Updated Successfully");
      } else {
        await addGuideline(data);

        alert("Guideline Added Successfully");
      }

      await fetchGuidelines();

      resetForm();
    } catch (error) {
      // console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setGuideline(item.guideline);

    setDisplayOrder(item.displayOrder);

    setActive(item.active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this guideline?",
    );

    if (!confirmDelete) return;

    try {
      await deleteGuideline(id);

      alert("Guideline Deleted Successfully");

      await fetchGuidelines();
    } catch (error) {
      // console.log(error);

      alert("Delete Failed");
    }
  };
  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {editId ? "Update Library Guideline" : "Add Library Guideline"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">Guideline</label>

            <textarea
              rows="3"
              className="form-control"
              value={guideline}
              onChange={(e) => setGuideline(e.target.value)}
            />
          </div>

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

          <div className="col-md-3 d-flex align-items-center">
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

        <button
          type="submit"
          className={`btn ${editId ? "btn-warning" : "btn-primary"}`}
          disabled={loading}
        >
          {loading
            ? "Please Wait..."
            : editId
              ? "Update Guideline"
              : "Add Guideline"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <hr className="my-5" />

      <h3 className="mb-3">Library Guidelines</h3>

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
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>

              <th>Guideline</th>

              <th>Order</th>

              <th>Status</th>

              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuidelines.length > 0 ? (
              filteredGuidelines.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>{item.guideline}</td>

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
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Guidelines Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibraryGuidelinesManagement;
