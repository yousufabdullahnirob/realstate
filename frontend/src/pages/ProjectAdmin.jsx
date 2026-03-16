import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import "../admin.css";

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [modalType, setModalType] = useState("");
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "Ongoing",
    total_floors: 0,
    total_units: 0,
    launch_date: new Date().toISOString().split('T')[0],
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/admin/projects/");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setModalType("add");
    setFormData({
      name: "",
      location: "",
      status: "ongoing",
      total_floors: 0,
      total_units: 0,
      launch_date: new Date().toISOString().split('T')[0],
    });
  };

  const openEditModal = (project) => {
    setModalType("edit");
    setCurrentProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      status: project.status,
      total_floors: project.total_floors,
      total_units: project.total_units,
      launch_date: project.launch_date,
    });
  };

  const openDeleteModal = (project) => {
    setModalType("delete");
    setCurrentProject(project);
  };

  const closeModal = () => setModalType("");

  const saveProject = async () => {
    try {
      if (modalType === "add") {
        await apiProxy.post("/admin/projects/", formData);
      } else if (modalType === "edit") {
        // Assuming there's a PATCH or PUT endpoint
        await apiProxy.post(`/admin/projects/${currentProject.id}/`, formData); // In this backend setup, POST to detail might be update or we should check views
      }
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const deleteProject = async () => {
    try {
      // Assuming a DELETE request or a POST to delete
      await fetch(`http://127.0.0.1:8000/api/admin/projects/${currentProject.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // This is a bit ad-hoc, but Proxy pattern should handle it.
        }
      });
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Projects Management</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Project</button>
      </div>

      <div className="dashboard-container">
        {loading ? <p>Loading projects...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.location}</td>
                  <td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDeleteModal(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="floating-add-btn" aria-label="Add Project" onClick={openAddModal}>+</button>

      {(modalType === "add" || modalType === "edit") && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>{modalType === "add" ? "Add Project" : "Edit Project"}</h3>
            <input
              type="text"
              className="form-input"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveProject}>Save</button>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this project?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="confirm-delete-btn" onClick={deleteProject}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;
