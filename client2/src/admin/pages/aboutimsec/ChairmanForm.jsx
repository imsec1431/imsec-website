import { useEffect, useState } from "react";
import { getChairman, saveChairman } from "../../../services/chairmanService";

const ChairmanForm = () => {
  const [chairmanName, setChairmanName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch Chairman Data
  const fetchChairman = async () => {
    try {
      const res = await getChairman();

      if (res.data.data) {
        setChairmanName(res.data.data.chairmanName);
        setMessage(res.data.data.message);
        setPreview(res.data.data.imageUrl);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchChairman();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("chairmanName", chairmanName);
    formData.append("message", message);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setLoading(true);

      await saveChairman(formData);

      alert("Chairman Message Saved Successfully");

      fetchChairman();

      setPhoto(null);
    } catch (error) {
      // console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Chairman's Message</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Chairman Name</label>

              <input
                className="form-control"
                value={chairmanName}
                onChange={(e) => setChairmanName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Chairman Photo</label>

              <input
                type="file"
                className="form-control"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="Chairman"
                  width="180"
                  className="img-thumbnail"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Message</label>

              <textarea
                rows="8"
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Chairman Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChairmanForm;
