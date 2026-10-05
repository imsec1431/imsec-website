import React, { useEffect, useState } from "react";

import {
  getStudentGrievances,
  updateStudentGrievance,
  deleteStudentGrievance,
} from "../../../services/studentGrievanceService";
import ViewComplaint from "./ViewComplaint";
import RemarksModal from "./RemarksModal";

const StudentGrievanceManagement = () => {
  const [showRemarks, setShowRemarks] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setShowView(true);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRemarks = (complaint) => {
    setSelectedComplaint(complaint);
    setShowRemarks(true);
  };
  const handleSaveRemarks = async (remarks) => {
    try {
      await updateStudentGrievance(selectedComplaint._id, {
        remarks,
      });

      alert("Remarks Saved Successfully");

      setShowRemarks(false);

      fetchComplaints();
    } catch (error) {
      // console.log(error);
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?",
    );

    if (!confirmed) return;

    try {
      await deleteStudentGrievance(id);

      alert("Complaint deleted successfully.");

      fetchComplaints();
    } catch (error) {
      console.error("Delete grievance error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete complaint. Please try again.",
      );
    }
  };
  const fetchComplaints = async () => {
    try {
      const res = await getStudentGrievances();

      setComplaints(res.data.data);
    } catch (err) {
      // console.log(err);
    }

    setLoading(false);
  };
  const handleSolve = async (id) => {
    try {
      await updateStudentGrievance(id, {
        status: "Solved",
      });

      alert("Complaint marked as Solved.");

      fetchComplaints();
    } catch (error) {
      // console.log(error);
    }
  };
  if (loading) {
    return <h4>Loading...</h4>;
  }

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <h2>Student Grievance</h2>

        <p>Manage Student Complaints</p>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>

            <th>Complaint ID</th>

            <th>Name</th>

            <th>Department</th>

            <th>Category</th>

            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>

              <td>{item.complaintId}</td>

              <td>{item.studentName}</td>

              <td>{item.department}</td>

              <td>{item.category}</td>

              <td>
                {item.status === "Solved" ? (
                  <span className="badge bg-success">Solved</span>
                ) : (
                  <span className="badge bg-warning text-dark">Pending</span>
                )}
              </td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleView(item)}
                >
                  View
                </button>

                <button
                  className="btn btn-success btn-sm me-2"
                  disabled={item.status === "Solved"}
                  onClick={() => handleSolve(item._id)}
                  style={{ width: "100px" }}
                >
                  {item.status === "Solved" ? "Solved" : "Solve"}
                </button>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleRemarks(item)}
                >
                  Remarks
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ViewComplaint
        show={showView}
        handleClose={() => setShowView(false)}
        complaint={selectedComplaint}
      />
      <RemarksModal
        show={showRemarks}
        handleClose={() => setShowRemarks(false)}
        complaint={selectedComplaint}
        handleSave={handleSaveRemarks}
      />
    </div>
  );
};

export default StudentGrievanceManagement;
