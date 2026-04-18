import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import apiProxy from '../utils/proxyClient';
import { useSearch } from '../context/SearchContext';
import "../admin.css";

const Projects = () => {
  const { updateSearch } = useSearch();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get('/projects/'); 
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateSearch(''); // Critical: Clear search for full visibility
    fetchProjects();
  }, [updateSearch]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <p style={{ fontWeight: 800 }}>Restoring Portfolio...</p>
    </div>
  );

  return (
    <div style={{ padding: '60px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 800 }}>Our Iconic Projects</h1>
      
      <div className="property-grid">
        {projects.length === 0 ? <p>No projects found.</p> : projects.map((project) => (
          <div key={project.id} className="property-card">
            <img 
              src={project.image || `https://images.unsplash.com/featured/?architecture,building&sig=${project.id}`} 
              className="property-img" 
              alt={project.name} 
            />

            <div className="property-body">
              <h3 className="property-title">{project.name}</h3>
              <div className="property-meta">
                <MapPin size={16} />
                <span>{project.location}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                STATUS: {project.status}
              </p>
              <div className="property-footer">
                <span className="property-price" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>LUXURY RESIDENCE</span>
                <Link to={`/projects/${project.id}`} className="details-btn">VIEW PROJECT →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
