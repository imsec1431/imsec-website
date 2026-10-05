import { useEffect, useState } from "react";
import {
  getRules,
  addRule,
  updateRule,
  deleteRule,
} from "../../../../services/ruleService";

const RulesManagement = () => {
  const [rules, setRules] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [important, setImportant] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchRules = async () => {
    try {
      const res = await getRules();
      if (res.data?.data) {
        setRules(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setPdfLink("");
    setImportant(false);
    setDisplayOrder(1);
    setActive(true);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (!category.trim()) return alert("Category is required");
    if (!description.trim()) return alert("Description is required");

    const data = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      pdfLink: pdfLink.trim(),
      important,
      displayOrder,
      active,
    };

    try {
      setLoading(true);
      if (editId) {
        await updateRule(editId, data);
        alert("Rule Updated Successfully");
      } else {
        await addRule(data);
        alert("Rule Added Successfully");
      }
      await fetchRules();
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setEditId(rule._id);
    setTitle(rule.title || "");
    setCategory(rule.category || "");
    setDescription(rule.description || "");
    setPdfLink(rule.pdfLink || "");
    setImportant(Boolean(rule.important));
    setDisplayOrder(rule.displayOrder ?? 1);
    setActive(Boolean(rule.active));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rule?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteRule(id);
      alert("Rule Deleted Successfully");
      await fetchRules();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete Failed");
    } finally {
      setLoading(false);
    }
  };

  // Safe search filtering
  const filteredRules = rules.filter((rule) => {
    const searchTerm = search.toLowerCase();
    const matchesTitle = rule.title?.toLowerCase().includes(searchTerm);
    const matchesCategory = rule.category?.toLowerCase().includes(searchTerm);
    return matchesTitle || matchesCategory;
  });

  return (
    <div className="container py-4">
      <h3 className="mb-4">{editId ? "Update Rule" : "Add New Rule"}</h3>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Description</label>
            <textarea
              rows="4"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">PDF Link</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://..."
              value={pdfLink}
              onChange={(e) => setPdfLink(e.target.value)}
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
            <div className="form-check me-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="importantCheckbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="importantCheckbox">
                Important
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="activeCheckbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="activeCheckbox">
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
            ? "Update Rule"
            : "Add Rule"}
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

      {/* Rules Section Header + Search Input */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Rules</h3>
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search rules or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Important</th>
              <th>Status</th>
              <th>Order</th>
              <th>PDF</th>
              <th style={{ width: "180px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRules.length > 0 ? (
              filteredRules.map((rule, index) => (
                <tr key={rule._id || index}>
                  <td>{index + 1}</td>
                  <td>{rule.title}</td>
                  <td>{rule.category}</td>

                  <td>
                    {rule.important ? (
                      <span className="badge bg-danger">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>

                  <td>
                    {rule.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td>{rule.displayOrder}</td>

                  <td>
                    {rule.pdfLink ? (
                      <a
                        href={rule.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning me-2"
                      disabled={loading}
                      onClick={() => handleEdit(rule)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      disabled={loading}
                      onClick={() => handleDelete(rule._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-3">
                  No Rules Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RulesManagement;