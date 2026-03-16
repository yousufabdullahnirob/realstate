import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import "../admin.css";

const ApartmentAdmin = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState("");
  const [currentApartment, setCurrentApartment] = useState(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/apartments/");
      setApartments(data);
    } catch (error) {
      console.error("Fetch apartments failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const openDeleteModal = (apartment) => {
    setModalType("delete");
    setCurrentApartment(apartment);
  };

  const closeModal = () => setModalType("");

  const deleteApartment = async () => {
    try {
      // Assuming a DELETE request or a POST to delete
      await fetch(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchApartments();
      closeModal();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Apartments Management</h2>
        <button className="add-btn">+ Add Apartment</button>
      </div>

      <div className="dashboard-container">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Project</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.project_name || a.project}</td>
                  <td>{parseInt(a.price).toLocaleString()} BDT</td>
                  <td><span className={`status ${a.status ? a.status.toLowerCase() : 'active'}`}>{a.status || 'Active'}</span></td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn" onClick={() => openDeleteModal(a)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
