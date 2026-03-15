import React, { useState } from "react";
import "./admin.css";
import logo from "../../images/logo.svg"; // adjust path
import apartment1 from "../../images/apartment1.jpg";
import apartment2 from "../../images/apartment2.jpg";

const ApartmentAdmin = () => {
  const [apartments, setApartments] = useState([
    { id: 1, name: "Green Valley Unit 101", project: "Green Valley Residence", status: "Completed", img: apartment1 },
    { id: 2, name: "Lake View Unit 203", project: "Lake View Towers", status: "Ongoing", img: apartment2 },
  ]);

  const [modalType, setModalType] = useState(""); // "add" | "edit" | "delete"
  const [currentApartment, setCurrentApartment] = useState(null);
  const [formData, setFormData] = useState({ name: "", project: "Green Valley Residence", status: "Completed" });

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
      const newApartment = {
        id: apartments.length + 1,
        ...formData,
        img: "", // placeholder
      };
      setApartments([...apartments, newApartment]);
    } else if (modalType === "edit") {
      setApartments(apartments.map(a => a.id === currentApartment.id ? { ...a, ...formData } : a));
    }
    closeModal();
  };

  const deleteApartment = () => {
    setApartments(apartments.filter(a => a.id !== currentApartment.id));
    closeModal();
  };

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Company Logo" />
          <div className="logo-text">Mahim Builders</div>
        </div>
        <nav className="sidebar-nav">
          <a href="/admin-dashboard">📊 Dashboard</a>
          <a href="/project-admin">🏗 Projects</a>
          <a className="active" href="/apartment-admin">🏢 Apartments</a>
          <a href="#">📅 Bookings</a>
          <a href="#">👤 Users</a>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="admin-header">
          <h3>Manage Apartments</h3>
        </header>

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
              {apartments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td><img className="table-img" src={a.img} alt="" /></td>
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

        {/* FLOATING ADD BUTTON */}
        <button className="floating-add-btn" onClick={openAddModal}>+</button>

        {/* ADD/EDIT MODAL */}
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
                <button className="confirm-delete-btn" onClick={saveApartment}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
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
    </div>
  );
};

export default ApartmentAdmin;