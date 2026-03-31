import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';
import { useCompare } from '../context/CompareContext';
import ComparisonModal from '../components/ComparisonModal';

const ApartmentListing = () => {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { compareList, addToCompare, clearCompare } = useCompare();

  const [filters, setFilters] = useState({
    bedrooms: 'Bedrooms',
    size: 'Size',
    price: 'Price Range (BDT)'
  });

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await apiProxy.get('/apartments/');
        const adapted = data.map(DataAdapter.adaptApartment);
        setApartments(adapted);
        
        // Parse query params
        const params = new URLSearchParams(location.search);
        const urlPrice = params.get('price');
        const urlSize = params.get('size');
        const urlLocation = params.get('location'); // Currently we only have 1 project, but we can store it

        const initialFilters = {
          bedrooms: urlSize || 'Bedrooms',
          size: 'Size', // Map "1 BHK" logic if needed
          price: urlPrice || 'Price Range (BDT)'
        };
        setFilters(prev => ({...prev, ...initialFilters}));

        // Apply initial filters logic
        applyFilters(adapted, initialFilters);

        // Fetch favorites
        if (localStorage.getItem('access')) {
          const favs = await apiProxy.get("/favorites/");
          setFavorites(favs.map(f => f.apartment));
        }

      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, [location.search]);

  const toggleFavorite = async (e, apartmentId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const resp = await apiProxy.post("/favorites/toggle/", { apartment_id: apartmentId });
      if (resp.is_favorited) {
        setFavorites([...favorites, apartmentId]);
      } else {
        setFavorites(favorites.filter(id => id !== apartmentId));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleFilterChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const applyFilters = (data = apartments, currentFilters = filters) => {
    let result = [...data];

    if (currentFilters.bedrooms !== 'Bedrooms') {
      const beds = parseInt(currentFilters.bedrooms);
      result = result.filter(apt => apt.bedrooms === beds);
    }
    
    // ... rest of filtering logic ...

    if (filters.bedrooms !== 'Bedrooms') {
      const beds = parseInt(filters.bedrooms);
      result = result.filter(apt => apt.bedrooms === beds);
    }

    if (filters.size !== 'Size') {
      if (filters.size === '800 - 1000 sqft') {
        result = result.filter(apt => parseInt(apt.size) >= 800 && parseInt(apt.size) <= 1000);
      } else if (filters.size === '1000 - 1400 sqft') {
        result = result.filter(apt => parseInt(apt.size) > 1000 && parseInt(apt.size) <= 1400);
      } else if (filters.size === '1400+ sqft') {
        result = result.filter(apt => parseInt(apt.size) > 1400);
      }
    }

    if (filters.price !== 'Price Range (BDT)') {
      // Helper to parse price string like "৳ 12,000,000"
      const parsePrice = (p) => parseInt(p.replace(/[^\d]/g, ''));
      
      if (filters.price === '5,00,000 - 10,00,000') {
         // Note: Fix the typo in the UI option as well (50L to 1Cr)
         result = result.filter(apt => parsePrice(apt.price) >= 5000000 && parsePrice(apt.price) <= 10000000);
      } else if (filters.price === '10,00,000 - 15,00,000') {
         result = result.filter(apt => parsePrice(apt.price) > 10000000 && parsePrice(apt.price) <= 150000000);
      } else if (filters.price === '15,00,000+') {
         result = result.filter(apt => parsePrice(apt.price) > 15000000);
      }
    }

    setFilteredApartments(result);
  };

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
          <select value={filters.bedrooms} onChange={(e) => handleFilterChange(e, 'bedrooms')}>
            <option>Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
          </select>
          <select value={filters.size} onChange={(e) => handleFilterChange(e, 'size')}>
            <option>Size</option>
            <option>800 - 1000 sqft</option>
            <option>1000 - 1400 sqft</option>
            <option>1400+ sqft</option>
          </select>
          <select value={filters.price} onChange={(e) => handleFilterChange(e, 'price')}>
            <option>Price Range (BDT)</option>
            <option>5,000,000 - 10,000,000</option>
            <option>10,00,000 - 15,000,000</option>
            <option>15,000,000+</option>
          </select>
          <button className="apt-search-btn" onClick={applyFilters}>Search</button>
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
              {filteredApartments.length > 0 ? filteredApartments.map(apt => (
                <motion.div 
                  key={apt.id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -10 }}
                  className="apt-card"
                >
                    <div className="apt-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover', position: 'relative' }}>
                      <button 
                        className={`compare-btn ${compareList.find(i => i.id === apt.id) ? 'active' : ''}`}
                        onClick={() => addToCompare(apt)}
                      >
                        {compareList.find(i => i.id === apt.id) ? '✓ Added' : '+ Compare'}
                      </button>
                      <button 
                        className="fav-toggle-btn"
                        onClick={(e) => toggleFavorite(e, apt.id)}
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: 'rgba(0,0,0,0.3)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: favorites.includes(apt.id) ? '#f44336' : 'white',
                          cursor: 'pointer',
                          zIndex: 5,
                          backdropFilter: 'blur(5px)'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.includes(apt.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>
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
              )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <h3>No apartments found matching these criteria.</h3>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
      {/* Floating Compare Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            className="compare-bar glass-premium"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="compare-bar-content">
              <p>{compareList.length} apartment{compareList.length > 1 ? 's' : ''} selected</p>
              <div className="compare-bar-actions">
                <button onClick={clearCompare} className="clear-btn">Clear</button>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="compare-now-btn"
                  disabled={compareList.length < 2}
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparisonModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
};

export default ApartmentListing;
