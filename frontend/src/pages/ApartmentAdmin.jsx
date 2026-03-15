import React, { useState } from "react";
import "../admin.css";

const ApartmentAdmin = () => {
  const [apartments, setApartments] = useState([
    { id: 1, name: "Green Valley Unit 101", project: "Green Valley Residence", status: "Completed", img: "/assets/default-apartment.jpg" },
    { id: 2, name: "Lake View Unit 203", project: "Lake View Towers", status: "Ongoing", img: "/assets/default-apartment.jpg" },
  ]);

  const [modalType, setModalType] = useState("");
  const [currentApartment, setCurrentApartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    project: "Green Valley Residence",
    status: "Completed",
  });

  const openAddModal = () => {
    setModalType("add");
    setFormData({ name: "", project: "Green Valley Residence", status: "Completed" });
  };

  const openEditModal = (apartment) => {
    setModalType("edit");
    setCurrentApartment(apartment);
    setFormData({ name: apartment.name, project: apartment.project, status: apartment.status });
  };

  const openDeleteModal = (apartment) => {
    setModalType("delete");
    setCurrentApartment(apartment);
  };

  const closeModal = () => setModalType("");

  const saveApartment = () => {
    if (modalType === "add") {
      const newApartment = { id: apartments.length + 1, ...formData, img: "/assets/default-apartment.jpg" };
      setApartments([...apartments, newApartment]);
    }
    if (modalType === "edit") {
      setApartments(apartments.map((a) => (a.id === currentApartment.id ? { ...a, ...formData } : a)));
    }
    closeModal();
  };

  const deleteApartment = () => {
    setApartments(apartments.filter((a) => a.id !== currentApartment.id));
    closeModal();
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Apartments Management</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Apartment</button>
      </div>

      <div className="dashboard-container">
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
                  <button className="edit-btn" onClick={() => openEditModal(a)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDeleteModal(a)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="floating-add-btn" aria-label="Add Apartment" onClick={openAddModal}>+</button>

      {(modalType === "add" || modalType === "edit") && (
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
              <option value="Green Valley Residence">Green Valley Residence</option>
              <option value="Lake View Towers">Lake View Towers</option>
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

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveApartment}>Save</button>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && (
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

