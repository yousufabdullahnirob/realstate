import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Maximize2, ArrowRight, Zap, Target, Star } from 'lucide-react';
import Header from '../components/Header';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';
import hero1 from '../assets/hero_1.png';
import hero2 from '../assets/hero_2.png';
import hero3 from '../assets/hero_3.png';

const slides = [
  {
    title: "The Pinnacle of Modern Living",
    subtitle: "Architectural masterpieces crafted for those who demand excellence.",
    image: hero1
  },
  {
    title: "Luxury Defined by Details",
    subtitle: "Bespoke residential solutions in the heart of the city's elite zones.",
    image: hero2
  },
  {
    title: "Invest in Your Future",
    subtitle: "Premium real estate assets with unparalleled long-term value.",
    image: hero3
  }
];

const PropertyCard = ({ item, type, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="property-card-premium ultra-glass"
  >
    <div className="card-image-wrap">
      <img src={item.image} alt={item.name || item.title} className="card-image" />
      <div className="card-badge">{type === 'project' ? 'PROJECT' : 'APARTMENT'}</div>
    </div>
    <div className="card-content-premium">
      <h3 className="card-title-premium">{item.name || item.title}</h3>
      <div className="card-meta">
        <span className="meta-item"><MapPin size={14} /> {item.location}</span>
        {item.size && <span className="meta-item"><Maximize2 size={14} /> {item.size}</span>}
      </div>
      <div className="card-footer-premium">
        <span className="price-tag">{item.price || item.status}</span>
        <Link to={`/${type}s/${item.id}`} className="view-link-circle">
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredApartments, setFeaturedApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, apartments] = await Promise.all([
          apiProxy.get('/projects/'),
          apiProxy.get('/apartments/')
        ]);
        setFeaturedProjects(projects.slice(0, 3));
        setFeaturedApartments(apartments.slice(0, 3));
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-modern">
      <section className="hero-premium">
        <AnimatePresence mode='wait'>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="hero-bg"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
        </AnimatePresence>
        
        <div className="hero-overlay-refined" />
        
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-content-modern"
          >
            <span className="eyebrow"><Star size={14} style={{ marginRight: '8px' }} /> ESTABLISHED 1998</span>
            <h1 className="display-serif">{slides[current].title}</h1>
            <p className="hero-sub">{slides[current].subtitle}</p>
            
            <div className="hero-cta-group">
              <button onClick={() => navigate('/projects')} className="btn-premium">EXPLORE PORTFOLIO</button>
              <button onClick={() => navigate('/services')} className="btn-outline">OUR EXPERTISE</button>
            </div>
          </motion.div>
        </div>

        <div className="hero-footer">
          <div className="hero-dots-refined">
            {slides.map((_, i) => (
              <span key={i} className={current === i ? 'active' : ''} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="featured-grid-section">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title-premium">Signature Projects</h2>
              <p className="section-sub-premium">Icons of excellence in urban development</p>
            </div>
            <Link to="/projects" className="btn-text">VIEW FULL GALLERY <ArrowRight size={16} /></Link>
          </div>
          
          <div className="premium-grid-layout">
            {loading ? <div className="loader">Syncing...</div> : featuredProjects.map((p, i) => (
              <PropertyCard key={p.id} item={p} type="project" index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="value-proposition ultra-glass">
        <div className="container">
          <div className="v-prop-grid">
            <div className="v-prop-item">
              <Zap size={32} className="v-icon" />
              <h3>Instant Search</h3>
              <p>Type once, find everything. Our global ecosystem reflects search queries in real-time across all platforms.</p>
            </div>
            <div className="v-prop-item">
              <Target size={32} className="v-icon" />
              <h3>Precision Engineering</h3>
              <p>We build with materials and standards that far exceed industry benchmarks for safety and luxury.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-grid-section">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title-premium">Recent Collections</h2>
              <p className="section-sub-premium">Selected residences for immediate acquisition</p>
            </div>
            <Link to="/apartments" className="btn-text">BROWSE INVENTORY <ArrowRight size={16} /></Link>
          </div>
          
          <div className="premium-grid-layout">
            {loading ? <div className="loader">Syncing...</div> : featuredApartments.map((a, i) => (
              <PropertyCard key={a.id} item={a} type="apartment" index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

