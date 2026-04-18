import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { formatBDT } from '../utils/formatters';
import { FilterUtils } from '../utils/filterUtils';
import { useSearch } from '../context/SearchContext';
import "../admin.css";

const ApartmentListing = () => {
  const { searchTerm, updateSearch } = useSearch();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', max_price: '', min_size: '' });
  const [filterMeta, setFilterMeta] = useState({ price_range: { min: 0, max: 0 }, size_range: { min: 0, max: 0 } });
  const navigate = useNavigate();

  const locationOptions = ['Dhaka', 'Banani', 'Gulshan', 'Dhanmondi', 'Uttara', 'Mirpur'];

  const fetchApartments = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (searchFilters.location) params.set('location', searchFilters.location);
      if (searchFilters.max_price) params.set('max_price', searchFilters.max_price);
      if (searchFilters.min_size) params.set('min_size', searchFilters.min_size);
      
      const queryString = params.toString();
      const url = queryString ? `/apartments/?${queryString}` : '/apartments/';
      
      const data = await apiProxy.get(url); 
      setApartments(Array.isArray(data) ? data : []);
      
      // Update filter metadata if we have results
      if (Array.isArray(data) && data.length > 0) {
        const prices = data.map(apt => apt.price).filter(p => p);
        const sizes = data.map(apt => apt.floor_area_sqft).filter(s => s);
        
        setFilterMeta({
          price_range: {
            min: prices.length > 0 ? Math.min(...prices) : 0,
            max: prices.length > 0 ? Math.max(...prices) : 0
          },
          size_range: {
            min: sizes.length > 0 ? Math.min(...sizes) : 0,
            max: sizes.length > 0 ? Math.max(...sizes) : 0
          }
        });
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchApartments(filters);
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

      {/* Search Filters */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.88)', 
          borderRadius: '50px', 
          padding: '20px', 
          boxShadow: '0 25px 60px rgba(15,23,42,0.14)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(15,23,42,0.08)',
          opacity: 0.9,
          width: '100%',
          maxWidth: '1000px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '12px' }}>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                style={{ 
                  width: '100%', 
                  background: '#fff', 
                  border: '2px solid #e0e0e0', 
                  color: '#333', 
                  padding: '10px 12px', 
                  borderRadius: '50px', 
                  fontSize: '12px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  opacity: 0.8
                }}
                onFocus={(e) => { e.target.style.borderColor = '#007bff'; e.target.style.opacity = '1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
              >
                <option value="" style={{ color: '#333' }}>Any</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location} style={{ color: '#333' }}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '12px' }}>Price Range</label>
              <select
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                style={{ 
                  width: '100%', 
                  background: '#fff', 
                  border: '2px solid #e0e0e0', 
                  color: '#333', 
                  padding: '10px 12px', 
                  borderRadius: '50px', 
                  fontSize: '12px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  opacity: 0.8
                }}
                onFocus={(e) => { e.target.style.borderColor = '#007bff'; e.target.style.opacity = '1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
              >
                <option value="" style={{ color: '#333' }}>Any</option>
                {FilterUtils.generatePriceRanges(filterMeta.price_range.min, filterMeta.price_range.max).map(price => (
                  <option key={price} value={price} style={{ color: '#333' }}>
                    Up to {FilterUtils.formatPrice(price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '12px' }}>Property Size</label>
              <select
                value={filters.min_size}
                onChange={(e) => setFilters({ ...filters, min_size: e.target.value })}
                style={{ 
                  width: '100%', 
                  background: '#fff', 
                  border: '2px solid #e0e0e0', 
                  color: '#333', 
                  padding: '10px 12px', 
                  borderRadius: '50px', 
                  fontSize: '12px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  opacity: 0.8
                }}
                onFocus={(e) => { e.target.style.borderColor = '#007bff'; e.target.style.opacity = '1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
              >
                <option value="" style={{ color: '#333' }}>Any</option>
                {FilterUtils.generateSizeRanges(filterMeta.size_range.min, filterMeta.size_range.max).map(size => (
                  <option key={size} value={size} style={{ color: '#333' }}>
                    {size} sqft +
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(226,232,240,1) 100%)', 
                color: '#0f172a', 
                border: '1px solid rgba(15,23,42,0.12)', 
                padding: '10px 20px', 
                borderRadius: '50px', 
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
                transition: 'all 0.3s',
                opacity: 0.9,
                height: 'fit-content'
              }}
            >
              Search
            </motion.button>
          </div>
        </div>
      </div>

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
