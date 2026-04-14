import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentListing = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMeta, setFilterMeta] = useState({ locations: [], price_range: {min:0, max:0}, size_range: {min:0, max:0} });
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    location: '',
    size: ''
  });

  const fetchApartments = async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(appliedFilters).forEach(key => {
        if (appliedFilters[key]) queryParams.append(key, appliedFilters[key]);
      });
      const data = await apiProxy.get(`/apartments/?${queryParams.toString()}`);
      setApartments(data.map(DataAdapter.adaptApartment));
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
        try {
            const metadata = await apiProxy.get('/filters/metadata/');
            setFilterMeta(metadata);
            
            // Check for URL parameters
            const params = new URLSearchParams(window.location.search);
            const initialFilters = {
                location: params.get('location') || '',
                max_price: params.get('max_price') || '',
                size: params.get('size') || '',
                min_price: ''
            };
            setFilters(initialFilters);
            fetchApartments(initialFilters);
        } catch (err) {
            fetchApartments();
        }
    };
    init();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApartments();
  };

  const handleToggleFavorite = async (e, aptId) => {
    e.preventDefault(); e.stopPropagation();
    if (!localStorage.getItem('access')) return alert("Please login to use wishlist.");
    try {
        await apiProxy.post('/favorites/toggle/', { apartment_id: aptId });
        // Optionally update local state if we want to show immediate feedback (heart change color)
        // For now, we'll just alert or trust it worked. 
        // Better: Fetch favorites or marks local state.
        alert("Wishlist updated!");
    } catch (err) {
        console.error("Favorite toggle error:", err);
    }
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
        >Find the perfect apartment within our premium projects.</motion.p>
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
          style={{ padding: '20px', borderRadius: '15px' }}
        >
          <div className="filter-group">
            <select 
              value={filters.location} 
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option value="">Any Location</option>
              {filterMeta.locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <select 
            value={filters.size} 
            onChange={(e) => setFilters({...filters, size: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="">Any Size</option>
            <option value="0-800">{"Small (< 800 sqft)"}</option>
            <option value="800-1500">Medium (800-1500 sqft)</option>
            <option value="1500-2500">Large (1500-2500 sqft)</option>
            <option value="2500">Extra Large (2500+ sqft)</option>
          </select>
          <select 
            value={filters.max_price} 
            onChange={(e) => setFilters({...filters, max_price: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="">Any Price</option>
            <option value="10000000">Up to 1 Crore</option>
            <option value="15000000">Up to 1.5 Crore</option>
            <option value="20000000">Up to 2 Crore</option>
            <option value="25000000">Up to 2.5 Crore</option>
            <option value="30000000">Up to 3 Crore</option>
          </select>
          <button className="apt-search-btn" onClick={handleSearch}>Search</button>
        </motion.div>
      </section>

      <section className="apt-gallery">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading apartments...</p>
        ) : (
          <motion.div 
            className="apt-grid" 
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
            {apartments.length === 0 ? <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No apartments found matching your criteria.</p> : apartments.map(apt => (
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
                        onClick={(e) => handleToggleFavorite(e, apt.id)}
                        className="fav-btn"
                        style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
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
              ))}
            </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default ApartmentListing;
