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
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get('/projects/');
      const projectList = Array.isArray(data) ? data : [];
      setProjects(projectList);
      setLocations(Array.from(new Set(projectList.map((project) => project.location).filter(Boolean))).sort());
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

  const filteredProjects = projects.filter((project) => {
    const status = project.status ? project.status.toLowerCase() : '';
    const matchesStatus = activeFilter === 'all' || status === activeFilter;
    const matchesLocation = !selectedLocation || project.location === selectedLocation;
    return matchesStatus && matchesLocation;
  });

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

      <section className="project-filter" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap', alignItems: 'center', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {['all', 'completed', 'ongoing', 'upcoming'].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
            style={{ padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', background: activeFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeFilter === filter ? '#fff' : 'var(--text-muted)', border: '1px solid', borderColor: activeFilter === filter ? 'var(--primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}
          >
            {filter === 'all' ? 'All' : filter === 'completed' ? 'Completed' : filter === 'ongoing' ? 'Ongoing' : 'Upcoming'}
          </button>
        ))}

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{ padding: '10px 20px', borderRadius: '30px', background: '#fff', color: '#000', border: '1px solid rgba(0,0,0,0.12)', minWidth: '220px' }}
        >
          <option value="" style={{ color: '#000' }}>All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location} style={{ color: '#000' }}>{location}</option>
          ))}
        </select>
      </section>

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
