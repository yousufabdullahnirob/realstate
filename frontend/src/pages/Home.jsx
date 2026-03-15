import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

const Home = () => {
  const [current, setCurrent] = useState(0);

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
      <Header />
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
              <button className="about-btn secondary">Our Process</button>
            </div>
          </div>
          <div className="about-right">
            <div className="about-card"></div>
            <div className="about-card small"></div>
          </div>
        </div>
      </section>

      <section className="connect">
        <div className="container connect-wrapper">
          <div className="connect-left">
            <h2>Connect With Us</h2>
            <p>
              Stay updated with our latest projects, news, and property insights.
              Follow us on social media or reach out directly.
            </p>
          </div>
          <div className="connect-right">
            <div className="social-item">🌐 Website</div>
            <div className="social-item">📘 Facebook</div>
            <div className="social-item">🐦 Twitter</div>
            <div className="social-item">💼 LinkedIn</div>
            <div className="social-item">📸 Instagram</div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-row">
          <div className="stat-box">
            <h2>120+</h2>
            <p>Projects Completed</p>
          </div>
          <div className="stat-box">
            <h2>350+</h2>
            <p>Clients Served</p>
          </div>
          <div className="stat-box">
            <h2>12</h2>
            <p>Years of Experience</p>
          </div>
          <div className="stat-box">
            <h2>8</h2>
            <p>Locations Served</p>
          </div>
        </div>
      </section>

      <section className="featured-projects">
        <div className="container">
          <div className="section-header">
            <h2>Featured Projects</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="project-grid">
            <div className="project-card">
              <div className="project-info">
                <h3>Skyline Residency</h3>
                <p>Dhaka • Luxury Apartments</p>
                <a href="/projects/skyline">Explore</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-info">
                <h3>Green Valley Homes</h3>
                <p>Chittagong • Eco Living</p>
                <a href="/projects/green-valley">Explore</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-info">
                <h3>Urban Heights</h3>
                <p>Sylhet • Modern Flats</p>
                <a href="/projects/urban">Explore</a>
              </div>
            </div>
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

      <section className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Property Management</h3>
              <p>End-to-end apartment and building management solutions.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Investment Advisory</h3>
              <p>Helping clients make informed real estate decisions.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛠</div>
              <h3>Maintenance Support</h3>
              <p>Reliable repair and maintenance services.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

