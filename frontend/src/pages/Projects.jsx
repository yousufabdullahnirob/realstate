import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMeta, setFilterMeta] = useState({ locations: [] });
  const [filters, setFilters] = useState({
    search: '',
    location: ''
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      
      const data = await apiProxy.get(`/projects/?${queryParams.toString()}`);
      setProjects(data.map(DataAdapter.adaptProject));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
        try {
            const metadata = await apiProxy.get('/filters/metadata/');
            setFilterMeta(metadata);
        } catch (err) {
            console.error("Error fetching metadata");
        }
        fetchProjects();
    };
    init();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeFilter === 'all' || project.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesLocation = !filters.location || project.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesCategory && matchesLocation;
  });

  return (
    <div>
      <section className="projects-hero">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="projects-hero-tile"
          style={{ 
            background: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
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
            <select 
              value={filters.location} 
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ background: 'transparent', border: 'none', color: '#000', outline: 'none', width: '150px', cursor: 'pointer' }}
            >
              <option value="" style={{ color: '#000' }}>Location (Any)</option>
              {filterMeta.locations.map(loc => (
                <option key={loc} value={loc} style={{ color: '#000' }}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="filter" style={{ flex: 1 }}>
            <span className="icon">🏗️</span>
            <input 
              type="text" 
              placeholder="Project Name..." 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              style={{ background: 'transparent', border: 'none', color: '#000', outline: 'none', width: '100%' }}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
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
            className={activeFilter === filter.value ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="projects-gallery">
        <LayoutGroup>
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
            ) : (
              filteredProjects.map((project, index) => (
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
              ))
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </div>
  );
};

export default Projects;
