import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";
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
      await apiProxy.delete(`/apartments/${currentApartment.id}/`);
      fetchApartments();
      closeModal();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Apartments Management</h2>
        <button className="add-btn">+ Add Apartment</button>
      </div>

      <div className="admin-table-container">
        {loading ? <p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Project</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{a.id}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{a.title}</td>
                  <td>{a.project_name || a.project}</td>
                  <td>{formatBDT(a.price)}</td>
                  <td><span className={`status ${a.status ? a.status.toLowerCase() : 'active'}`}>{a.status || 'Active'}</span></td>
                  <td style={{ textAlign: 'right' }}>
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
