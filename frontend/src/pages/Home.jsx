import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { projectsData } from '../data/projectsData';
import approvedModel from '../assets/about/approved_model.png';
import communityVibe from '../assets/about/community_vibe.png';

const slides = [
  {
    title: "Building Dreams Into Reality",
    text: "Discover architectural excellence designed for modern living."
  },
  {
    title: "Modern Living Redefined",
    text: "Crafted spaces blending comfort, elegance, and innovation."
  },
  {
    title: "Spaces That Inspire Growth",
    text: "Where design meets functionality for timeless experiences."
  }
];

const offers = [
  {
    id: 'design',
    title: 'Design & Planning',
    text: 'We will help you to get the result you dreamed of.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5L10 28.5V71.5L50 95L90 71.5V28.5L50 5Z" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M50 5V95M10 28.5L90 71.5M90 28.5L10 71.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M30 40L50 28L70 40V60L50 72L30 60V40Z" stroke="currentColor" strokeWidth="2.5"/>
      </svg>
    )
  },
  {
    id: 'solutions',
    title: 'Custom Solutions',
    text: 'Individual, aesthetically stunning solutions for customers.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15L85 75H15L50 15Z" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M35 45H65M42 58H58M50 15V35" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="42" y="65" width="16" height="5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'furniture',
    title: 'Furniture & Decor',
    text: 'We create and produce our product design lines.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M20 50H80M50 20V80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
        <path d="M35 35L65 65M65 35L35 65" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'exterior',
    title: 'Exterior Design',
    text: 'We will help you to get the result you dreamed of.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 25H75L25 75H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 25V75M75 25V75" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4"/>
      </svg>
    )
  },
  {
    id: 'concept',
    title: 'Creating a Concept',
    text: 'Individual, aesthetically stunning solutions for customers.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L62 38L90 38L68 56L76 84L50 66L24 84L32 56L10 38L38 38L50 10Z" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    )
  },
  {
    id: 'control',
    title: "Author's Control",
    text: 'We create and produce our product design lines.',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L85 30V70L50 90L15 70V30L50 10Z" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M35 35L65 65M65 35L35 65" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  }
];

const processSteps = [
  {
    id: '01',
    title: 'Strategic Planning',
    text: 'We begin with rigorous location scouting, feasibility studies, and a clear architectural vision for the project.'
  },
  {
    id: '02',
    title: 'Modern Design',
    text: 'Our team crafts detailed 3D visualizations and functional layouts tailored for contemporary urban living.'
  },
  {
    id: '03',
    title: 'Quality Construction',
    text: 'Using premium materials and engineering excellence, we build structures that stand the test of time and safety.'
  },
  {
    id: '04',
    title: 'Final Handover',
    text: 'After thorough quality checks, we welcome you to your new home with a seamless keys delivery experience.'
  }
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [activeOffer, setActiveOffer] = useState(null); // All white initially
  const [activeProcess, setActiveProcess] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{slides[current].title}</h1>
            <p>{slides[current].text}</p>
            <div className="hero-dots" id="heroDots">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={current === index ? 'active' : ''}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hero-button">
          <button>Search Projects</button>
        </div>
      </section>

      <section className="search-section">
        <div className="search-box">
          <div className="filter">
            <span className="icon">📍</span>
            <select>
              <option>Location</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </select>
          </div>
          <div className="filter">
            <span className="icon">💰</span>
            <select>
              <option>Price</option>
              <option>$500 - $1000</option>
              <option>$1000 - $2000</option>
            </select>
          </div>
          <div className="filter">
            <span className="icon">📐</span>
            <select>
              <option>Size</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
            </select>
          </div>
          <button className="search-btn">Search</button>
        </div>
      </section>

      <section className="about">
        <div className="container about-wrapper">
          <div className="about-left">
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
          </div>
          <div className="about-right">
            <div className="about-card">
              <img src={approvedModel} alt="Architectural Model" />
            </div>
            <div className="about-card small">
              <img src={communityVibe} alt="Community Living" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="our-process" className="process-section">
        <div className="container">
          <div className="section-header-centered">
            <h2>Our Process</h2>
            <p>Follow our journey from visionary concepts to the moment we hand over the keys to your dream home.</p>
          </div>
          
          <div className="process-grid">
            {processSteps.map((step) => (
              <div 
                key={step.id} 
                className={`process-item ${activeProcess === step.id ? 'active' : ''}`}
                onClick={() => setActiveProcess(activeProcess === step.id ? null : step.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="process-number">{step.id}</div>
                <h3>{step.title}</h3>
                {activeProcess === step.id && (
                  <p className="process-text-active animate-fade-in">{step.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-projects">
        <div className="container">
          <div className="section-header">
            <h2>Featured Projects</h2>
            <Link to="/projects" className="view-all-btn">View All</Link>
          </div>

          <div className="projects-card-system">
             {projectsData.map((project) => (
                <div key={project.id} className="project-main-card">
                   <div className="project-card-image-wrap">
                     <img src={project.image} alt={project.name} />
                   </div>
                   <div className="project-card-info">
                     <Link to={`/projects/${project.id}`} className="project-card-name">
                       {project.name}
                     </Link>
                     <p className="project-card-status">[ {project.status} ]</p>
                   </div>
                </div>
             ))}
          </div>


        </div>
      </section>

      <section className="testimonial">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <p>"The professionalism and attention to detail exceeded our expectations. Our property management has never been smoother."</p>
              <h4>— Sarah Rahman</h4>
            </div>
            <div className="testimonial-card">
              <p>"From project consultation to execution, everything felt structured and transparent. Highly recommended."</p>
              <h4>— Ahmed Karim</h4>
            </div>
            <div className="testimonial-card">
              <p>"Modern design, efficient systems, and amazing support team. Truly reliable service."</p>
              <h4>— Nusrat Jahan</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="apartments">
        <div className="container">
          <h2>Most Viewed Apartments</h2>
          <div className="apartment-grid">
            <div className="apartment-card">
              <div className="apartment-img"></div>
              <div className="apartment-body">
                <h3>$1200 / Month</h3>
                <p>2 Bed • 2 Bath • 1200 sqft</p>
                <span className="location">📍 Dhaka</span>
              </div>
            </div>
            <div className="apartment-card">
              <div className="apartment-img"></div>
              <div className="apartment-body">
                <h3>$950 / Month</h3>
                <p>1 Bed • 1 Bath • 800 sqft</p>
                <span className="location">📍 Chittagong</span>
              </div>
            </div>
            <div className="apartment-card">
              <div className="apartment-img"></div>
              <div className="apartment-body">
                <h3>$1500 / Month</h3>
                <p>3 Bed • 2 Bath • 1500 sqft</p>
                <span className="location">📍 Sylhet</span>
              </div>
            </div>
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
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className={`offer-card ${activeOffer === offer.id ? 'dark-blueprint' : ''}`}
                onClick={() => setActiveOffer(offer.id === activeOffer ? null : offer.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`offer-icon ${activeOffer === offer.id ? 'white' : ''}`}>
                  {offer.icon}
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
                <Link to="/services" className="offer-read-more">READ MORE</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
