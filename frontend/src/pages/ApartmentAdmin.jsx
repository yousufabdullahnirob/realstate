import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "../admin.css";

const API_BASE = "http://localhost:8000";
const ENABLE_BACKEND_SYNC = true;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ApartmentAdmin = () => {
  const apartmentImagePool = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
  ];

  const [apartments, setApartments] = useState([
    { id: 1, name: "Green Valley Unit 101", project: "Green Valley Residence", status: "Completed", img: apartmentImagePool[0] },
    { id: 2, name: "Lake View Unit 203", project: "Lake View Towers", status: "Ongoing", img: apartmentImagePool[1] },
  ]);
  const [projects, setProjects] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(!ENABLE_BACKEND_SYNC);

  const [modalType, setModalType] = useState("");
  const [currentApartment, setCurrentApartment] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    project: "Green Valley Residence",
    status: "Completed",
  });

  useEffect(() => {
    if (!ENABLE_BACKEND_SYNC) {
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        const [apartmentsResponse, projectsResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/apartments/`, { headers: getAuthHeader() }),
          axios.get(`${API_BASE}/api/admin/projects/`, { headers: getAuthHeader() }),
        ]);

        if (!isMounted) {
          return;
        }

        const projectList = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
        const mappedApartments = (Array.isArray(apartmentsResponse.data) ? apartmentsResponse.data : []).map((apartment, index) => ({
          id: apartment.id,
          backendId: apartment.id,
          name: apartment.title,
          project: apartment.project_name || "Unknown Project",
          projectId: apartment.project,
          status: apartment.status === "available" ? "Completed" : apartment.status === "booked" ? "Ongoing" : "Planned",
          img: apartmentImagePool[index % apartmentImagePool.length],
          rawStatus: apartment.status,
          location: apartment.location,
          description: apartment.description,
          price: apartment.price,
          floor_area_sqft: apartment.floor_area_sqft,
          bedrooms: apartment.bedrooms,
          bathrooms: apartment.bathrooms,
        }));

        setProjects(projectList);
        setApartments(mappedApartments);
        setIsDemoMode(false);
      } catch {
        if (isMounted) {
          setIsDemoMode(true);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const projectOptions = useMemo(() => {
    if (projects.length > 0) {
      return projects.map((project) => ({ label: project.name, value: project.name, id: project.id }));
    }

    return [
      { label: "Green Valley Residence", value: "Green Valley Residence", id: null },
      { label: "Lake View Towers", value: "Lake View Towers", id: null },
    ];
  }, [projects]);

  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", project: projectOptions[0]?.value || "Green Valley Residence", status: "Completed" });
    setUploadedImage("");
  };

  const openEditModal = (apartment) => {
    setModalType("edit");
    setCurrentApartment(apartment);
    setFormData({ name: apartment.name, project: apartment.project, status: apartment.status });
    setUploadedImage(apartment.img);
  };

  const openDeleteModal = (apartment) => {
    setModalType("delete");
    setCurrentApartment(apartment);
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

  const saveApartment = async () => {
    if (ENABLE_BACKEND_SYNC && !isDemoMode) {
      const selectedProject = projectOptions.find((project) => project.value === formData.project);
      const mappedStatus = formData.status === "Completed" ? "available" : formData.status === "Ongoing" ? "booked" : "sold";

      const payload = {
        project: selectedProject?.id,
        title: formData.name,
        description: "Apartment managed from admin panel.",
        location: "Dhaka",
        floor_area_sqft: "900.00",
        price: "5000000.00",
        bedrooms: 3,
        bathrooms: 2,
        status: mappedStatus,
      };

      try {
        if (modalType === "add") {
          const response = await axios.post(`${API_BASE}/api/admin/apartments/`, payload, { headers: getAuthHeader() });
          const created = response.data;
          setApartments((previous) => ([
            {
              id: created.id,
              backendId: created.id,
              name: created.title,
              project: created.project_name || formData.project,
              projectId: created.project,
              status: formData.status,
              img: uploadedImage || apartmentImagePool[previous.length % apartmentImagePool.length],
              rawStatus: created.status,
            },
            ...previous,
          ]));
        }

        if (modalType === "edit" && currentApartment?.backendId) {
          const response = await axios.patch(`${API_BASE}/api/admin/apartments/${currentApartment.backendId}/`, payload, { headers: getAuthHeader() });
          const updated = response.data;
          setApartments((previous) => previous.map((apartment) => (
            apartment.id === currentApartment.id
              ? {
                ...apartment,
                name: updated.title,
                project: updated.project_name || formData.project,
                projectId: updated.project,
                status: formData.status,
                img: uploadedImage || apartment.img,
                rawStatus: updated.status,
              }
              : apartment
          )));
        }

        closeModal();
        return;
      } catch {
        setIsDemoMode(true);
      }
    }

    if (modalType === "add") {
      const newApartment = {
        id: apartments.length + 1,
        ...formData,
        img: uploadedImage || apartmentImagePool[apartments.length % apartmentImagePool.length],
      };
      setApartments([...apartments, newApartment]);
    }
    if (modalType === "edit") {
      setApartments(
        apartments.map((a) =>
          a.id === currentApartment.id
            ? { ...a, ...formData, img: uploadedImage || currentApartment.img }
            : a
        )
      );
    }
    closeModal();
  };

  const deleteApartment = async () => {
    if (ENABLE_BACKEND_SYNC && !isDemoMode && currentApartment?.backendId) {
      try {
        await axios.delete(`${API_BASE}/api/admin/apartments/${currentApartment.backendId}/`, { headers: getAuthHeader() });
      } catch {
        setIsDemoMode(true);
      }
    }

    setApartments(apartments.filter((a) => a.id !== currentApartment.id));
    closeModal();
  };

  const renderModal = (modalContent) => createPortal(modalContent, document.body);

  return (
    <div className="page-content">
      <div className="admin-page-shell">
        <div className="page-header">
          <h2>Apartments Management</h2>
          <button className="add-btn" onClick={openAddModal}>+ Add Apartment</button>
        </div>

        <div className="table-container">
          <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Apartment Name</th>
              <th>Project</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td><img className="table-img" src={a.img} alt={a.name} /></td>
                <td>{a.name}</td>
                <td>{a.project}</td>
                <td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="edit-btn" onClick={() => openEditModal(a)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDeleteModal(a)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <button className="floating-add-btn" aria-label="Add Apartment" onClick={openAddModal}>+</button>

      {(modalType === "add" || modalType === "edit") && renderModal(
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>{modalType === "add" ? "Add Apartment" : "Edit Apartment"}</h3>

            <input
              type="text"
              className="form-input"
              placeholder="Apartment Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <select
              className="form-select"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              {projectOptions.map((project) => (
                <option key={project.value} value={project.value}>{project.label}</option>
              ))}
            </select>

            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Planned">Planned</option>
            </select>

            <input
              type="file"
              accept="image/*"
              className="image-upload-input"
              onChange={handleImageUpload}
            />

            {uploadedImage && (
              <div className="modal-image-preview">
                <img src={uploadedImage} alt="Apartment preview" className="image-preview-thumb" />
              </div>
            )}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveApartment}>Save</button>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && renderModal(
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this apartment?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="confirm-delete-btn" onClick={deleteApartment}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentAdmin;
