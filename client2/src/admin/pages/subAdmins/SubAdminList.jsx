import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaKey,
  FaUserShield,
  FaPowerOff,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getSubAdmins,
  deleteSubAdmin,
  toggleSubAdminStatus,
} from "../../services/subAdminService";

const SubAdminList = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSubAdmins = async () => {
    try {
      setLoading(true);

      const response = await getSubAdmins();

      if (response?.data?.success) {
        setSubAdmins(response.data.data || []);
      } else {
        setSubAdmins([]);
        toast.error(response?.data?.message || "Failed to load Sub Admins");
      }
    } catch (error) {
      console.error("Load Sub Admins Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load Sub Admins",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubAdmins();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Sub Admin?",
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteSubAdmin(id);

      if (response?.data?.success) {
        toast.success("Sub Admin deleted successfully");
        loadSubAdmins();
      } else {
        toast.error(response?.data?.message || "Failed to delete Sub Admin");
      }
    } catch (error) {
      console.error("Delete Sub Admin Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to delete Sub Admin",
      );
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await toggleSubAdminStatus(id);

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Sub Admin status updated successfully",
        );

        loadSubAdmins();
      } else {
        toast.error(
          response?.data?.message || "Failed to update Sub Admin status",
        );
      }
    } catch (error) {
      console.error("Toggle Status Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to update Sub Admin status",
      );
    }
  };

  const filteredSubAdmins = subAdmins.filter((admin) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      admin?.name?.toLowerCase().includes(searchText) ||
      admin?.email?.toLowerCase().includes(searchText) ||
      admin?.role?.toLowerCase().includes(searchText)
    );
  });

  const getPermissionCount = (admin) => {
    let count = 0;

    // Global modules
    admin?.permissions?.modules?.forEach((module) => {
      if (module?.enabled) {
        count++;

        module?.subModules?.forEach((subModule) => {
          if (subModule?.enabled) {
            count++;
          }
        });
      }
    });

    // Department modules
    admin?.permissions?.departments?.forEach((department) => {
      if (department?.enabled) {
        count++;

        department?.modules?.forEach((module) => {
          if (module?.enabled) {
            count++;

            module?.subModules?.forEach((subModule) => {
              if (subModule?.enabled) {
                count++;
              }
            });
          }
        });
      }
    });

    return count;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <FaSpinner className="fa-spin me-2" />
        <span>Loading Sub Admins...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <FaUserShield />
            <h2 className="mb-0">Sub Admin Management</h2>
          </div>

          <p className="text-muted mb-0">
            Create Sub Admins and manage their module permissions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            window.location.href = "/imsec-control-center/sub-admins/add";
          }}
        >
          <FaPlus />
          Create Sub Admin
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="position-relative">
            <FaSearch
              className="position-absolute text-muted"
              style={{
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "70px" }}>S.No.</th>
                  <th>Sub Admin</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Permissions</th>
                  <th className="text-center">Status</th>
                  <th className="text-center" style={{ minWidth: "220px" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSubAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No Sub Admin found.
                    </td>
                  </tr>
                ) : (
                  filteredSubAdmins.map((admin, index) => (
                    <tr key={admin._id}>
                      {/* S.NO */}
                      <td>{index + 1}</td>

                      {/* NAME */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                            }}
                          >
                            {admin?.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <div className="fw-semibold">
                              {admin?.name || "N/A"}
                            </div>

                            <small className="text-muted">
                              Created{" "}
                              {admin?.createdAt
                                ? new Date(admin.createdAt).toLocaleDateString()
                                : "N/A"}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td>{admin?.email || "N/A"}</td>

                      {/* ROLE */}
                      <td>
                        <span className="badge bg-secondary">
                          {admin?.role || "Sub Admin"}
                        </span>
                      </td>

                      {/* PERMISSIONS */}
                      <td className="text-center">
                        <span className="badge bg-info text-dark">
                          {getPermissionCount(admin)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="text-center">
                        {admin?.isActive ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          {/* EDIT */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            title="Edit Sub Admin"
                            onClick={() => {
                              window.location.href = `/imsec-control-center/sub-admins/edit/${admin._id}`;
                            }}
                          >
                            <FaPen />
                          </button>

                          {/* PERMISSIONS */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            title="Manage Permissions"
                            onClick={() => {
                              window.location.href = `/imsec-control-center/sub-admins/${admin._id}/permissions`;
                            }}
                          >
                            <FaKey />
                          </button>

                          {/* STATUS */}
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              admin?.isActive
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            title={admin?.isActive ? "Deactivate" : "Activate"}
                            onClick={() => handleToggleStatus(admin._id)}
                          >
                            <FaPowerOff />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            title="Delete Sub Admin"
                            onClick={() => handleDelete(admin._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminList;
