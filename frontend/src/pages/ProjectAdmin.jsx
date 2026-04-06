import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import "../admin.css";

const ProjectAdmin = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/admin/projects/");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    try {
      await apiProxy.delete(`/admin/projects/${deleteModal.id}/`);
      setDeleteModal(null);
      fetchProjects();
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2>Projects Management</h2>
        <button className="add-btn" onClick={() => navigate("/admin/projects/new")}>
          + Add Project
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p style={{ padding: 24, color: "var(--text-muted)" }}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏗️</div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>No projects yet</p>
            <p style={{ fontSize: 13 }}>Click "Add Project" to create your first one</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Location</th>
                <th>Floors</th>
                <th>Units</th>
                <th>Launch Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{p.id}</td>
                  <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{p.name}</td>
                  <td>{p.location}</td>
                  <td>{p.total_floors}</td>
                  <td>{p.total_units}</td>
                  <td>{p.launch_date}</td>
                  <td>
                    <span className={`status ${p.status}`}>{p.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => setDeleteModal(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete <strong>{deleteModal.name}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;
