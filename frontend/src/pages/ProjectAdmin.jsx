import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import "../admin.css";

const projectImagePool = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
];

const demoProjects = [
  { id: 1, name: "Green Valley Residence", location: "Dhaka", status: "ongoing", total_floors: 12, total_units: 96, launch_date: "2024-03-01", image: projectImagePool[0] },
  { id: 2, name: "Lake View Towers", location: "Gulshan", status: "completed", total_floors: 10, total_units: 84, launch_date: "2023-11-15", image: projectImagePool[1] },
  { id: 3, name: "Skyline Heights", location: "Banani", status: "upcoming", total_floors: 15, total_units: 120, launch_date: "2026-01-20", image: projectImagePool[2] },
];

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [modalType, setModalType] = useState("");
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "Ongoing",
    total_floors: 0,
    total_units: 0,
    launch_date: new Date().toISOString().split('T')[0],
    image_url: "",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/admin/projects/");
      const normalized = (Array.isArray(data) ? data : []).map((project, index) => ({
        ...project,
        image: project.image || project.image_url || projectImagePool[index % projectImagePool.length],
      }));
      setProjects(normalized);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
      setProjects(demoProjects);
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
      image_url: "",
    });
    setUploadedImage("");
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
      image_url: project.image || project.image_url || "",
    });
    setUploadedImage(project.image || project.image_url || "");
  };

  const openDeleteModal = (project) => {
    setModalType("delete");
    setCurrentProject(project);
  };

  const closeModal = () => {
    setModalType("");
    setUploadedImage("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProject = async () => {
    try {
      if (modalType === "add") {
        const payload = {
          name: formData.name,
          location: formData.location,
          status: formData.status,
          total_floors: formData.total_floors,
          total_units: formData.total_units,
          launch_date: formData.launch_date,
          ...(formData.image_url ? { image_url: formData.image_url } : {}),
        };

        const created = await apiProxy.post("/admin/projects/", payload);
        setProjects((prev) => ([
          {
            ...created,
            image: uploadedImage || created.image || created.image_url || projectImagePool[prev.length % projectImagePool.length],
          },
          ...prev,
        ]));
      } else if (modalType === "edit") {
        setProjects((prev) => prev.map((project) => (
          project.id === currentProject.id
            ? {
              ...project,
              ...formData,
              image: uploadedImage || formData.image_url || project.image,
            }
            : project
        )));
      }

      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);

      if (modalType === "add") {
        const localProject = {
          id: Date.now(),
          ...formData,
          image: uploadedImage || formData.image_url || projectImagePool[projects.length % projectImagePool.length],
        };
        setProjects((prev) => [localProject, ...prev]);
        closeModal();
      }
    }
  };

  const deleteProject = async () => {
    setProjects((prev) => prev.filter((project) => project.id !== currentProject.id));
    closeModal();
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
                  <td><img className="table-img" src={p.image || p.image_url || projectImagePool[p.id % projectImagePool.length]} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.location}</td>
                  <td><span className={`status ${(p.status || 'ongoing').toLowerCase()}`}>{(p.status || 'ongoing').toUpperCase()}</span></td>
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

            <input
              type="url"
              className="form-input"
              placeholder="Image URL (optional)"
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleImageUpload}
            />

            {uploadedImage && (
              <div style={{ marginBottom: '10px' }}>
                <img src={uploadedImage} alt="Project preview" className="table-img" style={{ width: '100px', height: '70px' }} />
              </div>
            )}

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
