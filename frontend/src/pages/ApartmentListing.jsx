import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { formatBDT } from '../utils/formatters';
import { useSearch } from '../context/SearchContext';
import "../admin.css";

const ApartmentListing = () => {
  const { updateSearch } = useSearch();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await apiProxy.get('/apartments/'); 
      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateSearch(''); // Critical: Revert to 100% visibility on load
    fetchApartments();
  }, [updateSearch]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <p style={{ fontWeight: 800 }}>Restoring Properties...</p>
    </div>
  );

  return (
    <div style={{ padding: '60px 40px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <section className="apt-hero" style={{ margin: '-60px -40px 40px -40px' }}>
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
      <h1 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 800 }}>Available Apartments</h1>
      
      <div className="property-grid">
        {apartments.length === 0 ? <p>No apartments found.</p> : apartments.map((apt) => (
          <div key={apt.id} className="property-card">
             <img 
               src={apt.image || `https://images.unsplash.com/featured/?apartment,room&sig=${apt.id}`} 
               className="property-img" 
               alt={apt.title} 
             />

            <div className="property-body">
              <h3 className="property-title">{apt.title}</h3>
              <div className="property-meta">
                <MapPin size={16} />
                <span>{apt.location || 'Dhaka'}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700, marginBottom: '24px' }}>
                {apt.bedrooms} BEDS • {apt.floor_area_sqft} SQFT
              </div>
              <div className="property-footer">
                <span className="property-price">{formatBDT(apt.price)}</span>
                <Link to={`/apartments/${apt.id}`} className="details-btn">VIEW DETAILS →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentListing;
