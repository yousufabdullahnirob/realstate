import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";
import "../admin.css";

const ApartmentAdmin = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

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

  useEffect(() => { fetchApartments(); }, []);

  const handleDelete = async () => {
    try {
      await apiProxy.delete(`/apartments/${deleteModal.id}/`);
      setDeleteModal(null);
      fetchApartments();
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleApprove = async (apt) => {
    try {
      await apiProxy.patch(`/apartments/${apt.id}/`, { is_approved: !apt.is_approved });
      fetchApartments();
    } catch (error) {
      alert("Failed to update approval: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2>Apartments Management</h2>
        <button className="add-btn" onClick={() => navigate("/admin/apartments/new")}>
          + Add Apartment
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p style={{ padding: 24, color: "var(--text-muted)" }}>Loading apartments...</p>
        ) : apartments.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>No apartments yet</p>
            <p style={{ fontSize: 13 }}>Click "Add Apartment" to create your first one</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Project</th>
                <th>Price</th>
                <th>Beds/Baths</th>
                <th>Area</th>
                <th>Status</th>
                <th>Approved</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>#{a.id}</td>
                  <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{a.title}</td>
                  <td>{a.project_name || "—"}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>{formatBDT(a.price)}</td>
                  <td>{a.bedrooms} bed / {a.bathrooms} bath</td>
                  <td>{a.floor_area_sqft} sqft</td>
                  <td>
                    <span className={`status ${a.status}`}>{a.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleApprove(a)}
                      style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800,
                        border: "none", cursor: "pointer",
                        background: a.is_approved ? "#d1fae5" : "#fee2e2",
                        color: a.is_approved ? "#065f46" : "#991b1b",
                      }}
                    >
                      {a.is_approved ? "✓ Yes" : "✗ No"}
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/apartments/edit/${a.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => setDeleteModal(a)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Delete Apartment</h3>
            <p>Are you sure you want to delete <strong>{deleteModal.title}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentAdmin;
