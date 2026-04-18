// Triggering HMR
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
import approvedModel from '../assets/about/approved_model.png';
import communityVibe from '../assets/about/community_vibe.png';

const slides = [
  {
    title: "Building Dreams Into Reality",
    subtitle: "Discover architectural excellence designed for modern living.",
    image: hero1
  },
  {
    title: "Modern Living Redefined",
    subtitle: "Crafted spaces blending comfort, elegance, and innovation.",
    image: hero2
  },
  {
    title: "Spaces That Inspire Growth",
    subtitle: "Where design meets functionality for timeless experiences.",
    image: hero3
  }
];

const offers = [
  {
    id: 'design',
    title: 'Design & Planning',
    text: 'We will help you to get the result you dreamed of.',
    fullText: 'Our design and planning phase is where your vision begins to take shape. We collaborate closely with you to understand your lifestyle, aesthetic preferences, and practical needs. Using advanced architectural techniques and 3D modeling, we create comprehensive blueprints that meticulously plan every square foot. From spatial flow to structural integrity, our planning ensures a flawless execution process.',
    image: '/service_1.png',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M50 5L10 28.5V71.5L50 95L90 71.5V28.5L50 5Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <path d="M50 5V95M10 28.5L90 71.5M90 28.5L10 71.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.3"/>
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          d="M30 40L50 28L70 40V60L50 72L30 60V40Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
      </svg>
    )
  },
  {
    id: 'solutions',
    title: 'Custom Solutions',
    text: 'Individual, aesthetically stunning solutions for customers.',
    fullText: 'No two projects are identical, and neither are our solutions. We specialize in bespoke architectural and interior solutions tailored strictly to your unique requirements. Whether you need specialized smart-home integrations, custom-built storage systems, or unique material sourcing, our team designs solutions that are as functional as they are visually striking.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M50 15L85 75H15L50 15Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <path d="M35 45H65M42 58H58M50 15V35" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
        <rect x="42" y="65" width="16" height="5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'furniture',
    title: 'Furniture & Decor',
    text: 'We create and produce our product design lines.',
    fullText: 'A beautiful space is defined by what fills it. We offer complete interior furnishing services, sourcing premium global decor and crafting bespoke furniture pieces tailored to your exact floor plan. From selecting the perfect fabrics and luxury finishes to curating modern art pieces, our designers ensure your interior reflects absolute elegance and unparalleled comfort.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          x="20" y="20" width="60" height="60" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <path d="M20 50H80M50 20V80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M35 35L65 65M65 35L35 65" 
          stroke="currentColor" 
          strokeWidth="1.5"
        />
      </svg>
    )
  },
  {
    id: 'exterior',
    title: 'Exterior Design',
    text: 'We will help you to get the result you dreamed of.',
    fullText: 'First impressions matter. Our exterior design services focus on creating stunning facades and harmonious outdoor spaces that blend perfectly with the surrounding environment. We expertly balance form and function, incorporating durable high-end materials, beautiful landscaping, and striking outdoor lighting to maximize your property\'s curb appeal and longevity.',
    image: '/service_2.png',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M25 25H75L25 75H75" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path d="M25 25V75M75 25V75" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
      </svg>
    )
  },
  {
    id: 'concept',
    title: 'Creating a Concept',
    text: 'Individual, aesthetically stunning solutions for customers.',
    fullText: 'At the heart of every iconic building is a powerful core concept. We dedicate time to establishing a unique theme—be it minimalist, modern, or neo-classical—that dictates the design language of your entire project. This cohesive creative direction ensures that every room, texture, and architectural element tells the same beautiful story.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M50 10L62 38L90 38L68 56L76 84L50 66L24 84L32 56L10 38L38 38L50 10Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4"/>
      </svg>
    )
  },
  {
    id: 'control',
    title: "Author's Control",
    text: 'We create and produce our product design lines.',
    fullText: 'A great design is only as good as its execution. Through our Author\'s Control service, the original architects who designed your project actively supervise the construction phase. We conduct rigorous site inspections to guarantee that contractors strictly follow the blueprints and use the specified premium materials, ensuring the final build is nothing short of a masterpiece.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M50 10L85 30V70L50 90L15 70V30L50 10Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <motion.path 
          initial={{ pathLength: 0 }}
          whileHover={{ pathLength: 1 }}
          d="M35 35L65 65M65 35L35 65" 
          stroke="currentColor" 
          strokeWidth="2.5"
        />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      </svg>
    )
  }
];

const processSteps = [
  {
    id: '01',
    title: 'Strategic Planning',
    text: 'Every masterpiece starts with a vision. Our experts conduct rigorous location analysis and feasibility studies to ensure your property is built on the best foundation. We define clear architectural blueprints perfectly aligned with your personal aspirations.'
  },
  {
    id: '02',
    title: 'Modern Design',
    text: 'Step into the future with our state-of-the-art 3D visualizations and sustainable architecture. We blend aesthetics with functionality, creating living spaces that embrace natural light, smart layouts, and contemporary urban luxury.'
  },
  {
    id: '03',
    title: 'Quality Construction',
    text: 'Excellence lies in the details. We utilize the highest grade materials and cutting-edge engineering techniques to build resilient and safe structures. Uncompromising quality control ensures long-lasting perfection.'
  },
  {
    id: '04',
    title: 'Final Handover',
    text: 'The moment your dream becomes reality. Following a comprehensive multi-point quality check, we deliver your new home with complete documentation and a seamless key handover experience. Welcome to your redefined lifestyle.'
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
  const [activeOffer, setActiveOffer] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeProcess, setActiveProcess] = useState(null);
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
              <button onClick={() => navigate('/projects')} className="btn-premium">EXPLORE PROJECT</button>
              <button onClick={() => navigate('/about')} className="btn-outline">ABOUT US</button>
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

      <section className="about">
        <div className="container about-wrapper">
          <motion.div 
            className="about-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Who We Are</h2>
            <p>
              We specialize in modern apartment management solutions designed to
              create transparency, efficiency, and long-term value. Our mission
              is to bridge property owners and residents through smart systems
              and refined living experiences.
            </p>
            <div className="about-buttons">
              <button className="about-btn">Our Team</button>
              <button className="about-btn secondary" onClick={() => document.getElementById('our-process').scrollIntoView({ behavior: 'smooth' })}>
                Our Process
              </button>
            </div>
          </motion.div>
          <div className="about-right">
            <motion.div 
              className="about-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src={approvedModel} alt="Architectural Model" />
            </motion.div>
            <motion.div 
              className="about-card small"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img src={communityVibe} alt="Community Living" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="our-process" className="process-section">
        <div className="container">
          <div className="section-header-centered">
            <h2>Our Process</h2>
            <p>Follow our journey from visionary concepts to the moment we hand over the keys to your dream home.</p>
          </div>
          
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`process-item ${activeProcess === step.id ? 'active' : ''}`}
                onClick={() => setActiveProcess(activeProcess === step.id ? null : step.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="process-number">{step.id}</div>
                <h3>{step.title}</h3>
                <AnimatePresence>
                  {activeProcess === step.id && (
                    <motion.p 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="process-text-active"
                    >
                      {step.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
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

      <section className="testimonial">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonial-cards">
            {[
              { text: "The professionalism and attention to detail exceeded our expectations. Our property management has never been smoother.", author: "Sarah Rahman" },
              { text: "From project consultation to execution, everything felt structured and transparent. Highly recommended.", author: "Ahmed Karim" },
              { text: "Modern design, efficient systems, and amazing support team. Truly reliable service.", author: "Nusrat Jahan" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="testimonial-card"
              >
                <p>"{t.text}"</p>
                <h4>— {t.author}</h4>
              </motion.div>
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

      <section className="offer-section">
        <div className="container">
          <div className="offer-header">
            <h2>What Can We Offer</h2>
            <div className="dots-divider">............</div>
          </div>
          
          <div className="offer-grid">
            {offers.map((offer, index) => (
              <motion.div 
                key={offer.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`offer-card ${activeOffer === offer.id ? 'dark-blueprint' : ''}`}
                onClick={() => setActiveOffer(offer.id === activeOffer ? null : offer.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`offer-icon ${activeOffer === offer.id ? 'white' : ''}`}>
                  {offer.icon}
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
                <button 
                  className="offer-read-more" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOffer(offer);
                  }}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid currentColor', cursor: 'pointer', padding: 0 }}
                >
                  READ MORE
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedOffer && (
            <motion.div 
              className="service-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
            >
              <motion.div 
                className="service-modal glass-premium"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-close" onClick={() => setSelectedOffer(null)}>×</div>
                <div className="modal-content">
                  <div className="modal-icon">
                    {selectedOffer.icon}
                  </div>
                  <div className="modal-image-wrapper">
                    {selectedOffer.image ? <img src={selectedOffer.image} alt={selectedOffer.title} /> : <div className="placeholder-image">No Image</div>}
                  </div>
                  {selectedOffer.discount && <div className="discount-badge">{selectedOffer.discount} Off</div>}
                  <div className="modal-divider"></div>
                  <p>{selectedOffer.fullText}</p>
                  <button className="modal-btn" onClick={() => setSelectedOffer(null)}>Got It</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Home;

