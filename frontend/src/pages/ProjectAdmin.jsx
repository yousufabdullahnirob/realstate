import React, { useState } from "react";
import "../admin.css";

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Green Valley Residence", location: "Dhaka", status: "Ongoing", img: "/assets/default-project.jpg" },
    { id: 2, name: "Lake View Towers", location: "Gulshan", status: "Completed", img: "/assets/default-project.jpg" },
  ]);

  const [modalType, setModalType] = useState("");
  const [currentProject, setCurrentProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "Ongoing",
  });

  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", location: "", status: "Ongoing" });
  };

  const openEditModal = (project) => {
    setModalType("edit");
    setCurrentProject(project);
    setFormData({ name: project.name, location: project.location, status: project.status });
  };

  const openDeleteModal = (project) => {
    setModalType("delete");
    setCurrentProject(project);
  };

  const closeModal = () => setModalType("");

  const saveProject = () => {
    if (modalType === "add") {
      const newProject = { id: projects.length + 1, ...formData, img: "/assets/default-project.jpg" };
      setProjects([...projects, newProject]);
    }
    if (modalType === "edit") {
      setProjects(projects.map((p) => (p.id === currentProject.id ? { ...p, ...formData } : p)));
    }
    closeModal();
  };

  const deleteProject = () => {
    setProjects(projects.filter((p) => p.id !== currentProject.id));
    closeModal();
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Projects Management</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Project</button>
      </div>

      <div className="dashboard-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
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
                <td><img className="table-img" src={p.img} alt={p.name} /></td>
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
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
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

