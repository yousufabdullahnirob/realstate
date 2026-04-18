import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";
import { useSearch } from "../context/SearchContext";
import { RefreshCcw, Image as ImageIcon } from "lucide-react";
import "../admin.css";

const ApartmentAdmin = () => {
  const { searchTerm, updateSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/apartments/");
      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch apartments failed:", error);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // Handle navigation state filters (e.g. from Dashboard)
    const navState = location.state;
    if (navState?.filter === 'booked_sold') {
      updateSearch('booked/sold'); // Internal signal for the filteredApartments logic
    } else if (navState?.filter === 'available') {
      updateSearch('available');
    } else {
      updateSearch(''); // Clear search correctly on mount
    }
    
    fetchApartments(); 
  }, [location.state, updateSearch]); // Added updateSearch to deps


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

  const filteredApartments = (apartments || []).filter(a => {
    const s = (searchTerm || "").toLowerCase();
    if (!s) return true;

    // Special handling for the "Booked & Sold" hybrid filter from Dashboard
    if (s === 'booked/sold') {
      return a.status.toLowerCase() === 'booked' || a.status.toLowerCase() === 'sold';
    }

    return a.title.toLowerCase().includes(s) || 
      a.status.toLowerCase().includes(s) ||
      (a.project_name && a.project_name.toLowerCase().includes(s)) || 
      (a.location && a.location.toLowerCase().includes(s));
  });


  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCcw className="spinning" size={32} color="var(--accent)" />
      <p style={{ marginTop: '16px', fontWeight: 600, color: '#0f172a' }}>Accessing Property Database...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Inventory Management</h2>
        <button className="btn-primary" onClick={() => navigate("/admin/apartments/new")} style={{ background: 'var(--accent)', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          + Add Apartment
        </button>
      </div>

      {searchTerm && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '16px 24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Showing:</span>
          <span style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            {searchTerm === 'booked/sold' ? 'Booked & Sold Properties' : `${searchTerm} Properties`}
          </span>
          <button 
            onClick={() => {
              updateSearch('');
              navigate('/admin/apartments', { replace: true, state: {} }); // Clear navigation state
            }} 
            style={{ 
              marginLeft: 'auto', background: 'none', border: 'none', 
              color: '#ef4444', fontWeight: 700, cursor: 'pointer', 
              fontSize: '13px', textDecoration: 'underline' 
            }}
          >
            Show All Apartments
          </button>
        </div>
      )}


      <div className="admin-table-container">
        {filteredApartments.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '16px' }}>
              {searchTerm ? `No matches found for "${searchTerm}"` : "The inventory is currently empty."}
            </p>
            {searchTerm && (
              <button onClick={() => updateSearch('')} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="property-grid">
            {filteredApartments.map((a) => (
              <div key={a.id} className="property-card" style={{ position: 'relative' }}>
                {a.image ? (
                  <img src={a.image} alt={a.title} className="property-img" />
                ) : (
                  <div className="property-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <ImageIcon size={32} color="#cbd5e1" />
                  </div>
                )}
                <div className="property-body" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="property-title" style={{ fontSize: '15px', margin: 0 }}>{a.title}</h3>
                    <span className={`status-pill ${a.status.toLowerCase() === 'available' ? 'status-available' : 'status-booked'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {a.status}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{a.project_name || "Independent"}</p>
                  <p style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '15px', marginBottom: '12px' }}>{formatBDT(a.price)}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      {a.bedrooms}B / {a.bathrooms}B
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => navigate(`/admin/apartments/edit/${a.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => setDeleteModal(a)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>

      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', maxWidth: '440px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 800 }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '32px', color: '#64748b', lineHeight: '1.6' }}>You are about to permanently remove <strong>{deleteModal.title}</strong> from the database. This action cannot be reversed.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setDeleteModal(null)} 
                style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentAdmin;
