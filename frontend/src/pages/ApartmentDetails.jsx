import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const data = await apiProxy.get(`/apartments/`);
        const found = data.find(a => a.id === parseInt(id));
        if (found) {
          setApartment(DataAdapter.adaptApartment(found));
        }
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id]);

  if (loading) return <div style={{ padding: '150px 0', textAlign: 'center' }}>Loading...</div>;

  if (!apartment) {
    return (
      <div style={{ padding: '150px 0', textAlign: 'center' }}>
        <h1>Apartment Not Found</h1>
        <button className="about-btn" onClick={() => navigate('/apartments')}>Back to Listings</button>
      </div>
    );
  }

  const specItems = [
    { label: 'Size', value: apartment.size },
    { label: 'Bedrooms', value: apartment.bedrooms },
    { label: 'Bathrooms', value: apartment.bathrooms },
    { label: 'Location', value: apartment.location },
  ];

  return (
    <div>
      <section className="apt-detail-main">
        <div className="apt-detail-container">
          <div className="apt-detail-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover="hover"
              className="apt-main-img" 
              style={{ 
                backgroundImage: `url(${apartment.image})`, 
                backgroundSize: 'cover', 
                height: '400px', 
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Blueprint Overlay */}
              <motion.div
                variants={{
                  hover: { opacity: 1 }
                }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <motion.path 
                    d="M 50 150 L 350 150 M 50 140 L 50 160 M 350 140 L 350 160" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    variants={{ hover: { pathLength: 1 } }}
                  />
                  <motion.text 
                    x="200" y="140" 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="12" 
                    fontWeight="bold"
                    variants={{ hover: { opacity: 1, y: 135 } }}
                    initial={{ opacity: 0, y: 145 }}
                  >
                    PREMIUM ARCHITECTURE
                  </motion.text>
                </svg>
              </motion.div>

              <div className="glass-premium" style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '10px 20px', borderRadius: '12px', zIndex: 10 }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Scale 1:100</span>
              </div>
            </motion.div>
            <div className="apt-thumb-row" style={{ marginTop: '20px' }}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="apt-thumb" 
                style={{ backgroundImage: `url(${apartment.image})`, backgroundSize: 'cover', borderRadius: '12px', border: '2px solid var(--accent)' }}
              ></motion.div>
            </div>
          </div>
          <div className="apt-detail-right">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {apartment.title}
            </motion.h1>
            <motion.div 
              className="apt-price"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '2.5rem', color: 'var(--accent)', fontWeight: 800, margin: '20px 0' }}
            >
              {apartment.price}
            </motion.div>
            <div className="apt-specs">
              {specItems.map((spec, index) => (
                <motion.div 
                  key={spec.label} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="apt-spec"
                >
                  <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                  <strong style={{ display: 'block', fontSize: '1.1rem' }}>{spec.value}</strong>
                </motion.div>
              ))}
            </div>
            <motion.p 
              className="apt-short-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ lineHeight: 1.8, color: '#444', margin: '30px 0' }}
            >
              {apartment.description || "A beautifully designed modern apartment located within a premium residential project, offering comfort, space and elegant architecture."}
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="apt-contact-btn animate-pulse-glow"
              style={{ padding: '15px 40px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}
            >
              Send Inquiry
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetails;
