import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { useSearch } from "../context/SearchContext";
import { RefreshCcw, Image as ImageIcon } from "lucide-react";
import "../admin.css";

const ProjectAdmin = () => {
  const { searchTerm, updateSearch } = useSearch();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get("/admin/projects/");
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    updateSearch('');
    fetchProjects(); 
  }, [updateSearch]);

  const handleDelete = async () => {
    try {
      await apiProxy.delete(`/admin/projects/${deleteModal.id}/`);
      setDeleteModal(null);
      fetchProjects();
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const filteredProjects = projects.filter(p => 
    !searchTerm || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCcw className="spinning" size={32} color="var(--accent)" />
      <p style={{ marginTop: '16px', fontWeight: 600 }}>Loading projects...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Projects Management</h2>
        <button className="btn-primary" onClick={() => navigate("/admin/projects/new")}>
          + Add Project
        </button>
      </div>

      <div className="property-grid">
        {filteredProjects.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', gridColumn: 'span 4' }}>
            <p style={{ color: '#64748b', fontWeight: 600 }}>No projects found matching your search.</p>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} className="property-card">
              {p.thumbnail || p.image ? (
                <img src={p.thumbnail || p.image} alt={p.name} className="property-img" />
              ) : (
                <div className="property-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                  <ImageIcon size={32} color="#cbd5e1" />
                </div>
              )}
              <div className="property-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 className="property-title" style={{ fontSize: '15px', margin: 0 }}>{p.name}</h3>
                  <span className={`status-pill status-${(p.status || 'Upcoming').toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>{p.location}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Floors</div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>{p.total_floors}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Units</div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>{p.total_units}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                   <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    Launched: {p.launch_date}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                      onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                      onClick={() => setDeleteModal(p)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '12px' }}>Delete Project?</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>Are you sure you want to delete {deleteModal.name}?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;
