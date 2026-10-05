import { useEffect, useState } from "react";

import {
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../../../services/libraryGalleryService";

const LibraryGalleryManagement = () => {
  const [gallery, setGallery] = useState([]);

  const [title, setTitle] = useState("");

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [displayOrder, setDisplayOrder] = useState(1);

  const [active, setActive] = useState(true);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await getGalleryImages();

      if (res.data.success) {
        setGallery(res.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const filteredGallery = gallery.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setTitle("");
    setImage(null);
    setPreview("");
    setDisplayOrder(1);
    setActive(true);
    setEditId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return alert("Title is required");
    }

    if (!editId && !image) {
      return alert("Please select an image");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("displayOrder", displayOrder);
    formData.append("active", active);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editId) {
        await updateGalleryImage(editId, formData);

        alert("Gallery Image Updated Successfully");
      } else {
        await addGalleryImage(formData);

        alert("Gallery Image Added Successfully");
      }

      await fetchGallery();

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

    setPreview(item.image);

    setDisplayOrder(item.displayOrder);

    setActive(item.active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmDelete) return;

    try {
      await deleteGalleryImage(id);

      alert("Gallery Image Deleted Successfully");

      await fetchGallery();
    } catch (error) {
      // console.log(error);

      alert("Delete Failed");
    }
  };
  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {editId ? "Update Library Gallery" : "Add Library Gallery"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Title */}

          <div className="col-md-6 mb-3">
            <label className="form-label">Title</label>

            <select
              className="form-select"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            >
              <option value="">Select Title</option>

              <option value="Book Collection">Book Collection</option>

              <option value="Reference Section">Reference Section</option>

              <option value="Reading Hall">Reading Hall</option>

              <option value="Central Library Hall">Central Library Hall</option>

              <option value="Reading Area">Reading Area</option>
            </select>
          </div>

          {/* Image */}

          <div className="col-md-6 mb-3">
            <label className="form-label">Upload Image</label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Preview */}

          {preview && (
            <div className="col-md-4 mb-3">
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded shadow"
                style={{
                  height: "180px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

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
          {loading ? "Please Wait..." : editId ? "Update Image" : "Add Image"}
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

      <h3 className="mb-3">Library Gallery</h3>

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

              <th>Image</th>

              <th>Title</th>

              <th>Order</th>

              <th>Status</th>

              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGallery.length > 0 ? (
              filteredGallery.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>

                  <td>{item.title}</td>

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
                <td colSpan="6" className="text-center">
                  No Images Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibraryGalleryManagement;
