import { useEffect, useState } from "react";

import {
  getCircularNotices,
  addCircularNotice,
  updateCircularNotice,
  deleteCircularNotice,
} from "../../../../services/circularNoticeService";

const CircularNoticeManagement = () => {
  const [notices, setNotices] = useState([]);

  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [publishDate, setPublishDate] = useState("");

  const [expiryDate, setExpiryDate] = useState("");

  const [pdfLink, setPdfLink] = useState("");

  const [displayOrder, setDisplayOrder] = useState(1);

  const [important, setImportant] = useState(false);

  const [active, setActive] = useState(true);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const fetchNotices = async () => {
    try {
      const res = await getCircularNotices();

      if (res.data?.data) {
        setNotices(res.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);
  const resetForm = () => {
    setTitle("");

    setCategory("");

    setDescription("");

    setPublishDate("");

    setExpiryDate("");

    setPdfLink("");

    setDisplayOrder(1);

    setImportant(false);

    setActive(true);

    setEditId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter Title");
      return;
    }

    if (!category.trim()) {
      alert("Please enter Category");
      return;
    }

    if (!description.trim()) {
      alert("Please enter Description");
      return;
    }

    if (!publishDate) {
      alert("Please select Publish Date");
      return;
    }

    if (!expiryDate) {
      alert("Please select Expiry Date");
      return;
    }

    if (!pdfLink.trim()) {
      alert("Please enter Google Drive PDF Link");
      return;
    }

    const data = {
      title,
      category,
      description,
      publishDate,
      expiryDate,
      pdfLink,
      displayOrder,
      important,
      active,
    };

    try {
      setLoading(true);

      if (editId) {
        await updateCircularNotice(editId, data);

        alert("Circular Updated Successfully");
      } else {
        await addCircularNotice(data);

        alert("Circular Added Successfully");
      }

      fetchNotices();

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

    setTitle(item.title);

    setCategory(item.category);

    setDescription(item.description);

    setPublishDate(item.publishDate?.substring(0, 10));

    setExpiryDate(item.expiryDate?.substring(0, 10));

    setPdfLink(item.pdfLink);

    setDisplayOrder(item.displayOrder);

    setImportant(item.important);

    setActive(item.active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Circular?")) return;

    try {
      await deleteCircularNotice(id);

      fetchNotices();

      alert("Deleted Successfully");
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Circular & Notice Management</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row"></div>
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
                placeholder="Circular / Notice / Tender / Office Order"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Description</label>

              <textarea
                rows="4"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Publish Date</label>

              <input
                type="date"
                className="form-control"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Expiry Date</label>

              <input
                type="date"
                className="form-control"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Google Drive PDF Link</label>

              <input
                type="text"
                className="form-control"
                placeholder="https://drive.google.com/file/d/..."
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Display Order</label>

              <input
                type="number"
                className="form-control"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-center">
              <div className="form-check mt-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                />

                <label className="form-check-label">Important Notice</label>
              </div>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-center">
              <div className="form-check mt-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />

                <label className="form-check-label">Active</label>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editId
                    ? "Update Circular"
                    : "Add Circular"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card shadow mt-4">
        <div className="card-header">
          <h4>Circular & Notice List</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>

                <th>Title</th>

                <th>Category</th>

                <th>Publish Date</th>

                <th>Expiry Date</th>

                <th>Order</th>

                <th>Important</th>

                <th>Status</th>

                <th>PDF</th>

                <th width="170">Action</th>
              </tr>
            </thead>

            <tbody>
              {notices.length > 0 ? (
                notices.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.title}</td>

                    <td>{item.category}</td>

                    <td>{new Date(item.publishDate).toLocaleDateString()}</td>

                    <td>{new Date(item.expiryDate).toLocaleDateString()}</td>

                    <td>{item.displayOrder}</td>

                    <td>
                      {item.important ? (
                        <span className="badge bg-danger">Important</span>
                      ) : (
                        <span className="badge bg-secondary">Normal</span>
                      )}
                    </td>

                    <td>
                      {item.active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>

                    <td>
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm"
                      >
                        View
                      </a>
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
                  <td colSpan="10" className="text-center py-4">
                    No Circulars Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CircularNoticeManagement;
