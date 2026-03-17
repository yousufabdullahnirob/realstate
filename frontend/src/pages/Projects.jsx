import React, { useState, useEffect } from 'react';
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
        <div className="projects-hero-tile">
          <h1>Projects</h1>
        </div>
      </section>

      <section className="search-section">
        <div className="search-box">
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
        </div>
      </section>

      <section className="projects-intro">
        <h2>Your Vision, Our Creation</h2>
        <p>
          Every project reflects our dedication to thoughtful design and
          precision construction. Explore the spaces where vision meets
          craftsmanship.
        </p>
      </section>

      <section className="project-filter">
        <button
          className={activeFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
          data-filter="all"
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={activeFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
          data-filter="completed"
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </button>
        <button
          className={activeFilter === 'progress' ? 'filter-btn active' : 'filter-btn'}
          data-filter="progress"
          onClick={() => setActiveFilter('progress')}
        >
          Under Progress
        </button>
        <button
          className={activeFilter === 'future' ? 'filter-btn active' : 'filter-btn'}
          data-filter="future"
          onClick={() => setActiveFilter('future')}
        >
          Future Planned
        </button>
      </section>

      <section className="projects-gallery">
        {loading ? <p>Loading projects...</p> : filteredProjects.map((project, index) => (
          <div key={index} className={`project-tile ${project.status}`}>
            <div className="project-img" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover' }}></div>
            <h3>{project.name}</h3>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Projects;
