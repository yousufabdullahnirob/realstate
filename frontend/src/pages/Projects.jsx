import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const Projects = () => {
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectLocations, setProjectLocations] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');

  // Fetch dynamic location options
  useEffect(() => {
    apiProxy.get('/filters/metadata/')
      .then(data => setProjectLocations(data.project_locations || []))
      .catch(err => console.error('Filter metadata error:', err));
  }, []);

  const fetchProjects = async (location, status) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      // status tab passed to backend as well
      if (status && status !== 'all') params.set('status', status);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await apiProxy.get(`/projects/${qs}`);
      setProjects(data.map(DataAdapter.adaptProject));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects('', 'all');
  }, []);

  const handleSearch = () => {
    fetchProjects(locationFilter, activeStatusFilter);
  };

  const handleStatusFilter = (status) => {
    setActiveStatusFilter(status);
    fetchProjects(locationFilter, status);
  };

  return (
    <div>
      <section className="projects-hero">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="projects-hero-tile"
        >
          <h1>Projects</h1>
        </motion.div>
      </section>

      <section className="search-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="search-box glass-premium"
        >
          <div className="filter">
            <span className="icon">📍</span>
            <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {projectLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
          <button className="search-btn" onClick={() => { setLocationFilter(''); fetchProjects('', activeStatusFilter); }}
            style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Clear</button>
        </motion.div>
      </section>

      <motion.section 
        className="projects-intro"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2>Your Vision, Our Creation</h2>
        <p>
          Every project reflects our dedication to thoughtful design and
          precision construction. Explore the spaces where vision meets
          craftsmanship.
        </p>
      </motion.section>

      <section className="project-filter">
        {[
          { value: 'all', label: 'All' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'completed', label: 'Completed' },
        ].map((filter) => (
          <button
            key={filter.value}
            className={activeStatusFilter === filter.value ? 'filter-btn active' : 'filter-btn'}
            onClick={() => handleStatusFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="projects-gallery">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading projects...
            </motion.p>
          ) : projects.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}
            >
              No projects found for the selected filters.
            </motion.p>
          ) : projects.map((project, index) => (
            <motion.div
              layout
              key={project.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`project-tile ${project.status}`}
              style={{ cursor: 'pointer' }}
            >
              <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="project-img" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover' }}></div>
                <h3>{project.name}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', padding: '0 16px 16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{project.status}</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Projects;
