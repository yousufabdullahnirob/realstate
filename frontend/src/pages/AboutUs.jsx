import React from 'react';
import { Link } from 'react-router-dom';
import approvedModel from '../assets/about/approved_model.png';
import communityVibe from '../assets/about/community_vibe.png';

const AboutUs = () => {
  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <section className="about-hero" style={{ 
        height: '450px', 
        background: 'linear-gradient(rgba(29, 65, 83, 0.8), rgba(29, 65, 83, 0.8)), url("https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '60px', fontWeight: '800', marginBottom: '20px' }}>Our Legacy</h1>
          <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', opacity: '0.9' }}>
            Building the skyline of Bangladesh with architectural brilliance and uncompromising quality since 2010.
          </p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="about" style={{ padding: '120px 0' }}>
        <div className="container about-wrapper">
          <div className="about-left">
            <span style={{ color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>Who We Are</span>
            <h2 style={{ marginTop: '10px' }}>Mahim Builders: A Tradition of Excellence</h2>
            <p>
              We are a premier real estate development company in Bangladesh, committed to delivering 
              meticulously crafted living spaces. Our philosophy centers on "Architectural Integrity" 
              and "Customer Centricity."
            </p>
            <p>
              From the luxurious Mahim Sky View in Gulshan to our community-focused projects in Uttara, 
              we ensure every brick laid speaks of quality and every space designed offers comfort.
            </p>
            <div className="about-buttons">
              <Link to="/projects" className="about-btn">Explore Projects</Link>
              <Link to="/contact" className="about-btn secondary">Book Consultation</Link>
            </div>
          </div>
          <div className="about-right">
            <div className="about-card">
              <img src={approvedModel} alt="Mahim Builders Model" />
            </div>
            <div className="about-card small">
              <img src={communityVibe} alt="Community Life" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission" style={{ background: '#f8f9fa', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div className="form-card" style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '15px' }}>Our Mission</h3>
              <p style={{ color: '#666', fontSize: '18px', lineHeight: '1.6' }}>
                To set a benchmark in the real estate industry by delivering innovative, 
                sustainable, and high-quality residential solutions that empower families.
              </p>
            </div>
            <div className="form-card" style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>👁️</div>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '15px' }}>Our Vision</h3>
              <p style={{ color: '#666', fontSize: '18px', lineHeight: '1.6' }}>
                To become the most trusted architectural name in Bangladesh, known for 
                modern luxury, structural safety, and long-term value creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '120px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '42px', marginBottom: '60px' }}>Why Mahim Builders?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
            <div className="why-item">
              <div style={{ fontSize: '30px', color: 'var(--accent)', marginBottom: '15px' }}>🏗️</div>
              <h4 style={{ marginBottom: '10px' }}>Quality Build</h4>
              <p style={{ fontSize: '14px', color: '#777' }}>Using premium materials and global engineering standards.</p>
            </div>
            <div className="why-item">
              <div style={{ fontSize: '30px', color: 'var(--accent)', marginBottom: '15px' }}>📍</div>
              <h4 style={{ marginBottom: '10px' }}>Prime Locations</h4>
              <p style={{ fontSize: '14px', color: '#777' }}>Strategically located in the heart of Dhaka's best neighborhoods.</p>
            </div>
            <div className="why-item">
              <div style={{ fontSize: '30px', color: 'var(--accent)', marginBottom: '15px' }}>💎</div>
              <h4 style={{ marginBottom: '10px' }}>Luxury Design</h4>
              <p style={{ fontSize: '14px', color: '#777' }}>Modern aesthetics with functional, space-optimized layouts.</p>
            </div>
            <div className="why-item">
              <div style={{ fontSize: '30px', color: 'var(--accent)', marginBottom: '15px' }}>🛡️</div>
              <h4 style={{ marginBottom: '10px' }}>Trust & Safety</h4>
              <p style={{ fontSize: '14px', color: '#777' }}>Fully RAJUK approved with earthquake-resistant structures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Ready to Start Your Journey?</h2>
          <p style={{ opacity: '0.9', marginBottom: '30px' }}>Get in touch with our luxury consultants today.</p>
          <Link to="/contact" className="contact-btn" style={{ background: 'var(--bg-main)', color: 'var(--primary)', padding: '15px 40px', fontWeight: '700' }}>
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

