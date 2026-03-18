import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import approvedModel from '../assets/about/approved_model.png';
import communityVibe from '../assets/about/community_vibe.png';

const AboutUs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="about-page-wrapper"
    >
      {/* Hero Section */}
      <section className="about-hero" style={{ 
        height: '450px', 
        background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '60px', fontWeight: '800', marginBottom: '20px' }}
          >Our Legacy</motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', opacity: '0.9' }}
          >
            Building the skyline of Bangladesh with architectural brilliance and uncompromising quality since 2010.
          </motion.p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="about" style={{ padding: '120px 0' }}>
        <div className="container about-wrapper">
          <motion.div 
            className="about-left"
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
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
            <div className="about-buttons" style={{ marginTop: '40px' }}>
              <Link to="/projects" className="about-btn">Explore Projects</Link>
              <Link to="/contact" className="about-btn secondary" style={{ marginLeft: '15px' }}>Book Consultation</Link>
            </div>
          </motion.div>
          <motion.div 
            className="about-right"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-card">
              <img src={approvedModel} alt="Mahim Builders Model" />
            </div>
            <motion.div 
              className="about-card small"
              whileHover={{ rotate: -2, scale: 1.05 }}
            >
              <img src={communityVibe} alt="Community Life" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission" style={{ background: '#f8f9fa', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <motion.div 
              className="form-card" 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '15px' }}>Our Mission</h3>
              <p style={{ color: '#666', fontSize: '18px', lineHeight: '1.6' }}>
                To set a benchmark in the real estate industry by delivering innovative, 
                sustainable, and high-quality residential solutions that empower families.
              </p>
            </motion.div>
            <motion.div 
              className="form-card" 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>👁️</div>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '15px' }}>Our Vision</h3>
              <p style={{ color: '#666', fontSize: '18px', lineHeight: '1.6' }}>
                To become the most trusted architectural name in Bangladesh, known for 
                modern luxury, structural safety, and long-term value creation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '120px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: '42px', marginBottom: '60px' }}
          >Why Mahim Builders?</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
            {[
              { icon: '🏗️', title: 'Quality Build', text: 'Using premium materials and global engineering standards.' },
              { icon: '📍', title: 'Prime Locations', text: "Strategically located in the heart of Dhaka's best neighborhoods." },
              { icon: '💎', title: 'Luxury Design', text: 'Modern aesthetics with functional, space-optimized layouts.' },
              { icon: '🛡️', title: 'Trust & Safety', text: 'Fully RAJUK approved with earthquake-resistant structures.' }
            ].map((item, idx) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="why-item"
              >
                <div style={{ fontSize: '30px', color: 'var(--accent)', marginBottom: '15px' }}>{item.icon}</div>
                <h4 style={{ marginBottom: '10px' }}>{item.title}</h4>
                <p style={{ fontSize: '14px', color: '#777' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Ready to Start Your Journey?</h2>
          <p style={{ opacity: '0.9', marginBottom: '30px' }}>Get in touch with our luxury consultants today.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/contact" className="contact-btn animate-pulse-glow" style={{ background: 'white', color: 'var(--primary)', padding: '15px 40px', fontWeight: '700', borderRadius: '50px', textDecoration: 'none', display: 'inline-block' }}>
              Contact Us Now
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutUs;
