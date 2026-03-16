import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "../admin.css";

const API_BASE = "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProjectAdmin = () => {
  const projectImagePool = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  ];

  const DEMO_PROJECTS = [
    { id: 1, name: "Green Valley Residence", location: "Dhaka", status: "ongoing", img: projectImagePool[0] },
    { id: 2, name: "Lake View Towers", location: "Gulshan", status: "completed", img: projectImagePool[1] },
  ];

  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [modalType, setModalType] = useState("");
  const [currentProject, setCurrentProject] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "ongoing",
    total_floors: "",
    total_units: "",
    launch_date: "",
    description: "",
  });

  // Load projects from backend
  useEffect(() => {
    axios.get(`${API_BASE}/api/admin/projects/`, { headers: getAuthHeader() })
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setProjects(rows.map((project, index) => ({
          ...project,
          img: projectImagePool[index % projectImagePool.length],
        })));
      })
      .catch(() => {
        setProjects(DEMO_PROJECTS);
      });
  }, []);

  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", location: "", status: "ongoing", total_floors: "", total_units: "", launch_date: "", description: "" });
    setUploadedImage("");
    setApiError("");
  };

  const openEditModal = (project) => {
    setModalType("edit");
    setCurrentProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      status: project.status,
      total_floors: project.total_floors || "",
      total_units: project.total_units || "",
      launch_date: project.launch_date || "",
      description: project.description || "",
    });
    setUploadedImage(project.img);
    setApiError("");
  };

  const openDeleteModal = (project) => {
    setModalType("delete");
    setCurrentProject(project);
    setApiError("");
  };

  const closeModal = () => {
    setModalType("");
    setUploadedImage("");
    setApiError("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProject = async () => {
    setSaving(true);
    setApiError("");
    const payload = {
      name: formData.name,
      location: formData.location,
      status: formData.status,
      total_floors: formData.total_floors || 1,
      total_units: formData.total_units || 1,
      launch_date: formData.launch_date || new Date().toISOString().split("T")[0],
      description: formData.description || "",
    };
    try {
      if (modalType === "add") {
        const res = await axios.post(`${API_BASE}/api/admin/projects/`, payload, { headers: getAuthHeader() });
        setProjects(prev => [...prev, { ...res.data, img: uploadedImage || projectImagePool[prev.length % projectImagePool.length] }]);
      } else if (modalType === "edit") {
        const res = await axios.patch(`${API_BASE}/api/admin/projects/${currentProject.id}/`, payload, { headers: getAuthHeader() });
        setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...res.data, img: uploadedImage || currentProject.img } : p));
      }
      closeModal();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save. Check backend.";
      setApiError(msg);
      if (modalType === "add") {
        setProjects(prev => [...prev, { id: Date.now(), ...formData, img: uploadedImage || projectImagePool[prev.length % projectImagePool.length] }]);
      } else if (modalType === "edit") {
        setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, ...formData, img: uploadedImage || currentProject.img } : p));
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async () => {
    setSaving(true);
    setApiError("");
    try {
      await axios.delete(`${API_BASE}/api/admin/projects/${currentProject.id}/`, { headers: getAuthHeader() });
      setProjects(prev => prev.filter(p => p.id !== currentProject.id));
      closeModal();
    } catch (err) {
      setProjects(prev => prev.filter(p => p.id !== currentProject.id));
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const renderModal = (modalContent) => createPortal(modalContent, document.body);

  return (
    <div className="page-content">
      <div className="admin-page-shell">
        <div className="page-header">
          <h2>Projects Management</h2>
          <button className="add-btn" onClick={openAddModal}>+ Add Project</button>
        </div>
        {apiError && <div className="form-error">{apiError}</div>}

        <div className="table-container">
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
                <td><span className={`status ${(p.status || "").toLowerCase()}`}>{p.status}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDeleteModal(p)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#587181", fontWeight: 600 }}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      <button className="floating-add-btn" aria-label="Add Project" onClick={openAddModal}>+</button>

      {(modalType === "add" || modalType === "edit") && renderModal(
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
              type="number"
              className="form-input"
              placeholder="Total Floors"
              value={formData.total_floors}
              onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
            />

            <input
              type="number"
              className="form-input"
              placeholder="Total Units"
              value={formData.total_units}
              onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
            />

            <input
              type="date"
              className="form-input"
              placeholder="Launch Date"
              value={formData.launch_date}
              onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
            />

            <input
              type="text"
              className="form-input"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              className="image-upload-input"
              onChange={handleImageUpload}
            />

            {uploadedImage && (
              <div className="modal-image-preview">
                <img src={uploadedImage} alt="Project preview" className="image-preview-thumb" />
              </div>
            )}

            {apiError && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>{apiError}</div>}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="save-btn" onClick={saveProject} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && renderModal(
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this project?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="confirm-delete-btn" onClick={deleteProject} disabled={saving}>{saving ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;

