import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetails = () => {
  const amenities = [
    'Rooftop Garden', 'Parking Area', '24/7 Security', 'Elevator',
    'Children Play Area', 'Community Hall'
  ];

  return (
    <div>
      <Header />
      <section className="project-hero">
        <div className="project-hero-overlay">
          <h1>Skyline Residency</h1>
          <p className="project-location">Kaliganj, Dhaka</p>
        </div>
      </section>
      <div className="project-info-bar">
        <div className="info-item">
          <h4>Floors</h4>
          <p>10</p>
        </div>
        <div className="info-item">
          <h4>Units</h4>
          <p>40</p>
        </div>
        <div className="info-item">
          <h4>Apartment Size</h4>
          <p>1200–1800 sqft</p>
        </div>
        <div className="info-item">
          <h4>Completion</h4>
          <p>2027</p>
        </div>
      </div>
      <section className="project-overview">
        <div className="overview-text">
          <h2>Project Overview</h2>
          <p>
            Skyline Residency is a thoughtfully designed residential project
            combining modern architecture with comfortable living spaces.
            Located in a peaceful yet well-connected neighborhood, the
            development offers spacious apartments, natural lighting,
            and high-quality finishes.
          </p>
        </div>
        <div className="overview-info">
          <div className="catalog-grid">
            <a href="/project-skyline" className="catalog-card">
              <div className="catalog-image"></div>
              <div className="catalog-overlay">
                <h3>Skyline Residency</h3>
                <p>Kaliganj, Dhaka</p>
                <span className="catalog-link">View Project →</span>
              </div>
            </a>
            <a href="/project-mahim" className="catalog-card">
              <div className="catalog-image"></div>
              <div className="catalog-overlay">
                <h3>Mahim Heights</h3>
                <p>Dhaka</p>
                <span className="catalog-link">View Project →</span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className="project-gallery">
        <h2 className="gallery-title">Project Gallery</h2>
        <div className="gallery-premium">
          <div className="gallery-main"></div>
          <div className="gallery-small"></div>
          <div className="gallery-small"></div>
          <div className="gallery-small"></div>
          <div className="gallery-small"></div>
        </div>
      </section>
      <section className="project-amenities">
        <h2>Amenities</h2>
        <div className="amenities-grid">
          {amenities.map((amenity, index) => (
            <div key={index} className="amenity">{amenity}</div>
          ))}
        </div>
      </section>
      <section className="project-inquiry">
        <div className="inquiry-box">
          <h2>Interested in this project?</h2>
          <p>Contact us to learn more or schedule a visit.</p>
          <button className="btn-primary">Make Inquiry</button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectDetails;

