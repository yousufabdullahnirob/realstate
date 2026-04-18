import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import heroBg from '../assets/hero_1.png';
import { useSearch } from '../context/SearchContext';
import "../admin.css";

const Projects = () => {
  const { updateSearch } = useSearch();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const filteredProjects = projects.filter(project =>
    activeFilter === 'all' || project.status.toLowerCase() === activeFilter.toLowerCase()
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <p style={{ fontWeight: 800 }}>Restoring Portfolio...</p>
    </div>
  );

  return (
    <div style={{ padding: '60px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <section className="projects-hero" style={{ margin: '-60px -40px 40px -40px', backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="projects-hero-tile"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h1 style={{ color: '#fff', fontSize: '48px', margin: 0 }}>Projects</h1>
        </motion.div>
      </section>

      <section className="search-section" style={{ marginTop: '0', background: 'transparent' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="search-box glass-premium"
        >
          <div className="filter">
            <span className="icon">📍</span>
            <select>
              <option>Location</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </select>
          </div>
          <div className="filter">
            <span className="icon">৳</span>
            <select>
              <option>Price (BDT)</option>
              <option>50,00,000 - 1,00,00,000</option>
              <option>1,00,00,000 - 2,00,00,000</option>
            </select>
          </div>
          <button className="search-btn">Search</button>
        </motion.div>
      </section>

      <section className="project-filter" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
        {['all', 'completed', 'progress', 'future'].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
            style={{ padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', background: activeFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeFilter === filter ? '#fff' : 'var(--text-muted)', border: '1px solid', borderColor: activeFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}
          >
            {filter === 'all' ? 'All' : filter === 'progress' ? 'Under Progress' : filter === 'future' ? 'Future Planned' : 'Completed'}
          </button>
        ))}
      </section>

      <h1 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 800 }}>Our Iconic Projects</h1>
      <h1 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 800 }}>Our Iconic Projects</h1>
      
      <div className="property-grid">
        {filteredProjects.length === 0 ? <p>No projects found.</p> : filteredProjects.map((project) => (
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
