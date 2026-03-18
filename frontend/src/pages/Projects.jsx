import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiProxy.get('/projects/');
        setProjects(data.map(DataAdapter.adaptProject));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    activeFilter === 'all' || project.status.toLowerCase() === activeFilter.toLowerCase()
  );

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
          <div className="filter">
            <span className="icon">📐</span>
            <select>
              <option>Size</option>
              <option>1000 - 1500 sqft</option>
              <option>1500 - 2500 sqft</option>
            </select>
          </div>
          <button className="search-btn">Search</button>
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
        {['all', 'completed', 'progress', 'future'].map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'all' ? 'All' : filter === 'progress' ? 'Under Progress' : filter === 'future' ? 'Future Planned' : 'Completed'}
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
                >
                  <div className="project-img" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover' }}></div>
                  <h3>{project.name}</h3>
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
