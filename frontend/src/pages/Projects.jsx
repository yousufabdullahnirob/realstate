import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    { name: 'Skyline Residency', status: 'completed' },
    { name: 'Mahim Heights', status: 'progress' },
    { name: 'Green Valley Homes', status: 'future' },
    { name: 'Ocean View Apartments', status: 'completed' },
    { name: 'Urban Nest', status: 'progress' },
    { name: 'City Garden Towers', status: 'future' },
    { name: 'Riverfront Residences', status: 'completed' },
    { name: 'Modern Habitat', status: 'progress' },
    { name: 'Future Living Complex', status: 'future' }
  ];

  const filteredProjects = projects.filter(project => 
    activeFilter === 'all' || project.status === activeFilter
  );

  return (
    <div>
      <Header />
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
            <span className="icon">💰</span>
            <select>
              <option>Price</option>
              <option>$500 - $1000</option>
              <option>$1000 - $2000</option>
            </select>
          </div>
          <div className="filter">
            <span className="icon">📐</span>
            <select>
              <option>Size</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
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
        {filteredProjects.map((project, index) => (
          <div key={index} className={`project-tile ${project.status}`}>
            <div className="project-img"></div>
            <h3>{project.name}</h3>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Projects;

