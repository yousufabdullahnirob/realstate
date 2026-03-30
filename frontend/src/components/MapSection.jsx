import React from 'react';
import { motion } from 'framer-motion';

const MapSection = () => {
  // Google Maps Embed URL for a premium area in Dhaka (Bashundhara R/A)
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.721449170281!2d90.41936496977537!3d23.821946399999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c65ea6973619%3A0xc3f8373322a4b868!2sBashundhara%20Residential%20Area%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1711820000000!5m2!1sen!2sbd";

  return (
    <section className="map-section" style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div 
          className="section-header" 
          style={{ textAlign: 'center', marginBottom: '50px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '40px', marginBottom: '15px' }}>Visit Our Projects</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
            Explore our premium developments across the most elite neighborhoods in Dhaka.
          </p>
        </motion.div>

        <motion.div 
          className="map-container glass-premium"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            height: '500px', 
            borderRadius: '30px', 
            overflow: 'hidden',
            padding: '15px',
            background: 'var(--glass)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <iframe
            title="Bashundhara Residential Area Map"
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
        
        <div className="map-info" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '30px', 
          marginTop: '40px' 
        }}>
          {[
            { label: 'Central Office', val: 'Block B, Bashundhara R/A, Dhaka' },
            { label: 'Support 24/7', val: '+880 1234 567890' },
            { label: 'Email Us', val: 'info@mahimbuilders.com' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <h4 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{item.label}</h4>
              <p style={{ fontWeight: '500' }}>{item.val}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
