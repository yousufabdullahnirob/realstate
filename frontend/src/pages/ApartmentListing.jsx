import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentListing = () => {
  const [searchParams] = useSearchParams();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMeta, setFilterMeta] = useState({ apartment_locations: [], bedrooms: [], price_range: { min: 0, max: 0 }, size_range: { min: 0, max: 0 } });

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_size: searchParams.get('min_size') || '',
    max_size: searchParams.get('max_size') || '',
  });

  // Fetch filter metadata on mount
  useEffect(() => {
    apiProxy.get('/filters/metadata/')
      .then(data => setFilterMeta(data))
      .catch(err => console.error('Filter metadata error:', err));
  }, []);

  const fetchApartments = async (activeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilters.location) params.set('location', activeFilters.location);
      if (activeFilters.bedrooms) params.set('bedrooms', activeFilters.bedrooms);
      if (activeFilters.min_price) params.set('min_price', activeFilters.min_price);
      if (activeFilters.max_price) params.set('max_price', activeFilters.max_price);
      if (activeFilters.min_size) params.set('min_size', activeFilters.min_size);
      if (activeFilters.max_size) params.set('max_size', activeFilters.max_size);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await apiProxy.get(`/apartments/${qs}`);
      setApartments(data.map(DataAdapter.adaptApartment));
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load — use URL params
  useEffect(() => {
    fetchApartments(filters);
  }, []);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    fetchApartments(filters);
  };

  const handleClear = () => {
    const cleared = { location: '', bedrooms: '', min_price: '', max_price: '', min_size: '', max_size: '' };
    setFilters(cleared);
    fetchApartments(cleared);
  };

  // Build price step buckets from metadata
  const priceBuckets = (() => {
    const { min, max } = filterMeta.price_range;
    if (!max) return [];
    const step = Math.ceil((max - min) / 4 / 1000000) * 1000000 || 5000000;
    const buckets = [];
    for (let s = Math.floor(min / step) * step; s < max; s += step) {
      buckets.push({ label: `৳${(s/1000000).toFixed(0)}M – ৳${((s+step)/1000000).toFixed(0)}M`, min: s, max: s + step });
    }
    return buckets;
  })();

  const sizeBuckets = (() => {
    const { min, max } = filterMeta.size_range;
    if (!max) return [];
    const mid = Math.round((min + max) / 2 / 100) * 100;
    return [
      { label: `${Math.floor(min)} – ${mid} sqft`, min: Math.floor(min), max: mid },
      { label: `${mid} – ${Math.ceil(max)} sqft`, min: mid, max: Math.ceil(max) },
      { label: `${Math.ceil(max)}+ sqft`, min: Math.ceil(max), max: '' },
    ];
  })();

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
          {/* Location */}
          <select value={filters.location} onChange={e => handleChange('location', e.target.value)}>
            <option value="">📍 All Locations</option>
            {filterMeta.apartment_locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Bedrooms */}
          <select value={filters.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)}>
            <option value="">🛏 Any Bedrooms</option>
            {filterMeta.bedrooms.map(b => (
              <option key={b} value={b}>{b} Bedroom{b > 1 ? 's' : ''}</option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={filters.min_price ? `${filters.min_price}-${filters.max_price}` : ''}
            onChange={e => {
              if (!e.target.value) { handleChange('min_price', ''); handleChange('max_price', ''); return; }
              const [mn, mx] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, min_price: mn, max_price: mx || '' }));
            }}
          >
            <option value="">৳ Any Price</option>
            {priceBuckets.map(b => (
              <option key={b.label} value={`${b.min}-${b.max}`}>{b.label}</option>
            ))}
          </select>

          {/* Size Range */}
          <select
            value={filters.min_size ? `${filters.min_size}-${filters.max_size}` : ''}
            onChange={e => {
              if (!e.target.value) { handleChange('min_size', ''); handleChange('max_size', ''); return; }
              const [mn, mx] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, min_size: mn, max_size: mx || '' }));
            }}
          >
            <option value="">📐 Any Size</option>
            {sizeBuckets.map(b => (
              <option key={b.label} value={`${b.min}-${b.max}`}>{b.label}</option>
            ))}
          </select>

          <button className="apt-search-btn" onClick={handleSearch}>Search</button>
          <button className="apt-search-btn" onClick={handleClear} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Clear</button>
        </motion.div>
      </section>

      <section className="projects-gallery">
        {!loading && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', marginBottom: 8 }}>
            {apartments.length} apartment{apartments.length !== 1 ? 's' : ''} found
          </p>
        )}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Loading apartments...
              </motion.p>
            ) : apartments.length === 0 ? (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
                No apartments match your filters.
              </motion.p>
            ) : (
              apartments.map((apt, index) => (
                <motion.div
                  layout
                  key={apt.id || index}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="project-tile"
                >
                  <div className="project-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover', height: '220px' }}></div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px', color: 'var(--heading-color)' }}>{apt.title}</h3>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                      <span>📍 {apt.location}</span>
                      <span>🛏 {apt.bedrooms} Bed</span>
                      <span>📐 {apt.size}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 18 }}>{apt.price}</span>
                      <Link to={`/apartments/${apt.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>View Details →</Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </motion.div>
  );
};

export default ApartmentListing;
