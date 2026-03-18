import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate send
    setStatus('Thank you! Message sent successfully.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      <section className="contact-hero" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        padding: '120px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: '48px', marginBottom: '12px' }}
          >Get In Touch</motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '20px', opacity: 0.9 }}
          >Ready to discuss your project or have questions? We're here to help.</motion.p>
        </div>
      </section>

      {/* Contact Container */}
      <section className="contact-container" style={{ padding: '100px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            
            {/* Contact Info */}
            <motion.div 
              className="contact-info"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={{ fontSize: '32px', marginBottom: '30px', color: 'var(--primary)' }}>Contact Information</h2>
              {[
                { icon: '📍', text: 'Mahim Shopping Mall, 4 East Maniknagor, Mugdapara Dhaka-1203, Bangladesh' },
                { icon: '📞', text: '+880 1778 117 118' },
                { icon: '✉️', text: 'info@mahimbuilders.com' }
              ].map((item, idx) => (
                <motion.div 
                  key={item.icon}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="contact-item"
                  style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
                >
                  <span className="contact-icon" style={{ fontSize: '24px' }}>{item.icon}</span>
                  <p>{item.text}</p>
                </motion.div>
              ))}
              <div className="contact-social" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <a href="#" className="social-link" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Facebook</a>
                <a href="#" className="social-link" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
                <a href="#" className="social-link" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              className="contact-form-wrapper"
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
                <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Send Message</h2>
                <AnimatePresence>
                  {status && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="form-status" 
                      style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: '#d4edda', color: '#155724', textAlign: 'center' }}
                    >{status}</motion.div>
                  )}
                </AnimatePresence>
                {['name', 'email', 'phone'].map((field, idx) => (
                  <motion.input 
                    key={field}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    type={field === 'email' ? 'email' : (field === 'phone' ? 'tel' : 'text')} 
                    name={field} 
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-field"
                    style={{ width: '100%', padding: '16px', marginBottom: '20px', border: '2px solid #eee', borderRadius: '10px', fontSize: '16px' }}
                    required 
                  />
                ))}
                <motion.textarea 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  name="message" 
                  placeholder="Your Message" 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-field"
                  style={{ width: '100%', padding: '16px', marginBottom: '20px', border: '2px solid #eee', borderRadius: '10px', fontSize: '16px' }}
                  required 
                ></motion.textarea>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="submit-btn"
                  style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="contact-map" style={{ padding: '100px 0' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >Our Location</motion.h2>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="map-placeholder"
            style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.123456789!2d90.123456789!3d23.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzI5LjIiTiA5MMKwMDcnMjkuMyJF!5e0!3m2!1sen!2sbd!4v1234567890" 
              width="100%" 
              height="400" 
              style={{border:0, borderRadius:'12px'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactUs;

