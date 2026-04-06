import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentListing = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await apiProxy.get('/apartments/');
        setApartments(data.map(DataAdapter.adaptApartment));
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="apt-hero">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >Available Apartments</motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >Find the perfect apartment within this project.</motion.p>
      </section>
      
      <section className="apt-intro">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >Your dream space is waiting</motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Browse through beautifully designed apartments built with comfort,
          modern architecture, and quality living in mind.
        </motion.p>
      </section>

      <section className="apt-filter-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="apt-filters glass-premium"
        >
          <select>
            <option>Bedrooms</option>
            <option>1 Bedroom</option>
            <option>2 Bedrooms</option>
            <option>3 Bedrooms</option>
          </select>
          <select>
            <option>Size</option>
            <option>800 - 1000 sqft</option>
            <option>1000 - 1400 sqft</option>
            <option>1400+ sqft</option>
          </select>
          <select>
            <option>Price Range (BDT)</option>
            <option>5,000,000 - 10,000,000</option>
            <option>10,00,000 - 15,000,000</option>
            <option>15,000,000+</option>
          </select>
          <button className="apt-search-btn">Search</button>
        </motion.div>
      </section>

      <section className="apt-gallery">
        <div className="apt-grid">
          {loading ? (
            <p>Loading apartments...</p>
          ) : (
            <motion.div 
              className="apt-grid-inner" 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', width: '100%' }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {apartments.map(apt => (
                <motion.div 
                  key={apt.id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -10 }}
                  className="apt-card"
                >
                  <div className="apt-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover' }}></div>
                  <div className="apt-card-body">
                    <h3>{apt.title}</h3>
                    <div className="apt-meta">
                      <span>{apt.size}</span>
                      <span>{apt.bedrooms} Bed</span>
                    </div>
                    <div className="apt-card-footer">
                      <span className="apt-price">{apt.price}</span>
                      <Link to={`/apartments/${apt.id}`} className="apt-link">View Details →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default ApartmentListing;
