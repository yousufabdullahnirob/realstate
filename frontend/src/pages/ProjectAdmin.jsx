import React, { useState } from "react";
import "../admin.css";

import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

import project1 from "../images/project1.jpg";
import project2 from "../images/project2.jpg";

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Green Valley Residence", location: "Dhaka", status: "Completed", img: project1 },
    { id: 2, name: "Lake View Towers", location: "Gulshan", status: "Ongoing", img: project2 },
  ]);

  const [modalType, setModalType] = useState(""); // add | edit | delete
  const [currentProject, setCurrentProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "Completed"
  });

  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", location: "", status: "Completed" });
  };

  const openEditModal = (project) => {
    setModalType("edit");
    setCurrentProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      status: project.status
    });
  };

  const openDeleteModal = (project) => {
    setModalType("delete");
    setCurrentProject(project);
  };

  const closeModal = () => setModalType("");

  const saveProject = () => {
    if (modalType === "add") {
      const newProject = {
        id: projects.length + 1,
        ...formData,
        img: ""
      };
      setProjects([...projects, newProject]);
    }

    if (modalType === "edit") {
      setProjects(
        projects.map((p) =>
          p.id === currentProject.id ? { ...p, ...formData } : p
        )
      );
    }

    closeModal();
  };

  const deleteProject = () => {
    setProjects(projects.filter((p) => p.id !== currentProject.id));
    closeModal();
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="main">

        <AdminHeader title="Manage Projects" />

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
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>

                  <td>
                    <img
                      className="table-img"
                      src={project.img}
                      alt={project.name}
                    />
                  </td>

                  <td>{project.name}</td>
                  <td>{project.location}</td>

                  <td>
                    <span
                      className={`status ${project.status.toLowerCase()}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(project)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(project)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Floating Add Button */}
        <button className="floating-add-btn" onClick={openAddModal}>
          +
        </button>

        {/* ADD / EDIT MODAL */}
        {(modalType === "add" || modalType === "edit") && (
          <div className="modal-overlay active">
            <div className="modal-box">

              <h3>{modalType === "add" ? "Add Project" : "Edit Project"}</h3>

              <input
                type="text"
                className="form-input"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="text"
                className="form-input"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <select
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planned">Planned</option>
              </select>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>

                <button className="confirm-delete-btn" onClick={saveProject}>
                  Save
                </button>
              </div>

            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {modalType === "delete" && (
          <div className="modal-overlay active">
            <div className="modal-box">

              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this project?</p>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>

                <button className="confirm-delete-btn" onClick={deleteProject}>
                  Delete
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectAdmin;