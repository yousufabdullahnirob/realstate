import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div>
      <Header />
      <section className="about-hero">
        <div className="about-hero-box">
          <h1>About Our Company</h1>
          <p>Building modern living spaces with quality, innovation and trust.</p>
        </div>
      </section>
      <section className="about-story">
        <h2>Who We Are</h2>
        <p>
          We are a real estate development company focused on building modern,
          comfortable and sustainable living environments. Our projects combine
          thoughtful architecture with quality construction to provide homes
          that people love living in.
        </p>
        <p>
          Over the years we have developed multiple residential projects designed
          to bring communities together while maintaining comfort, security
          and aesthetic appeal.
        </p>
      </section>
      <section className="about-mission">
        <div className="about-mission-grid">
          <div className="about-mission-card">
            <h3>Our Mission</h3>
            <p>
              To create modern residential spaces that enhance the quality of life
              for families and communities.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Our Vision</h3>
            <p>
              To become a trusted name in real estate development through innovation,
              quality construction and customer satisfaction.
            </p>
          </div>
        </div>
      </section>
      <section className="about-why">
        <h2>Why Choose Us</h2>
        <div className="about-why-grid">
          <div className="about-why-card">
            <h4>Quality Construction</h4>
            <p>Every project is built with durable materials and modern engineering.</p>
          </div>
          <div className="about-why-card">
            <h4>Prime Locations</h4>
            <p>Our projects are located in well connected urban areas.</p>
          </div>
          <div className="about-why-card">
            <h4>Modern Design</h4>
            <p>Architectural designs focused on space, comfort and beauty.</p>
          </div>
          <div className="about-why-card">
            <h4>Trusted Service</h4>
            <p>We value transparency and long term relationships with clients.</p>
          </div>
        </div>
      </section>
      <section className="about-team">
        <h2>Our Team</h2>
        <div className="about-team-grid">
          <div className="about-member">
            <div className="about-member-img"></div>
            <h4>John Smith</h4>
            <p>Project Director</p>
          </div>
          <div className="about-member">
            <div className="about-member-img"></div>
            <h4>Sarah Ahmed</h4>
            <p>Lead Architect</p>
          </div>
          <div className="about-member">
            <div className="about-member-img"></div>
            <h4>David Lee</h4>
            <p>Construction Manager</p>
          </div>
        </div>
      </section>
      <section className="about-cta">
        <h2>Looking for Your Dream Home?</h2>
        <a href="/projects" className="about-cta-btn">Explore Our Projects</a>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;

