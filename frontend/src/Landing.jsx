import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/mahim_logo.png";
import mahim_bg from "./assets/mahim_bg.png";
import hero_img from "./assets/photo-1486406146926-c627a92ad1ab.avif";

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav>
        <div className="nav-logo">
          <img src={logo} alt="Mahim Builders" style={{ height: '40px', marginRight: '10px' }} />
          Mahim <span>Builders</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Search</Link></li>
          <li><a href="#about">About Us</a></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><a href="#services">Services</a></li>
          <li><Link to="/login" className="nav-login-link" style={{ color: 'var(--cyan)', fontWeight: '600' }}>Login</Link></li>
        </ul>
        <button className="nav-contact-btn">Contact Us</button>
        <div className="nav-hamburger"><span></span><span></span><span></span></div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content-area">
          <div className="hero-left">
            <div className="hero-tag">Architecture & Design</div>
            <h1>Designing Spaces That <span>Inspire</span> & Endure</h1>
            <p>We transform visions into timeless architecture, blending innovative design with functional excellence.</p>
            <Link to="/projects" className="hero-btn">Click to another page →</Link>
          </div>
          <div className="hero-right">
            <div className="hero-img-card">
              <img src={hero_img} alt="Premium Residence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="hero-search-bar">
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select>
              <option value="">Location</option>
              <option>Downtown</option>
              <option>Suburbs</option>
              <option>Countryside</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select>
              <option value="">Price Range</option>
              <option>Under $500k</option>
              <option>$500k – $1M</option>
              <option>$1M+</option>
            </select>
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select>
              <option value="">Size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <button className="search-btn" onClick={() => navigate('/projects')}>Search</button>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section className="about" id="about">
        <div className="about-img">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            <rect x="15" y="15" width="110" height="110" rx="10" fill="rgba(30,58,138,0.12)"/>
            <circle cx="52" cy="58" r="20" fill="rgba(30,58,138,0.22)"/>
            <polygon points="92,28 124,86 60,86" fill="rgba(30,58,138,0.22)"/>
          </svg>
        </div>
        <div className="about-content">
          <div className="section-label">Who We Are</div>
          <h2>About Us</h2>
          <p>We are a passionate team of architects and designers dedicated to transforming visions into reality. With over 15 years of experience, we craft spaces that are not only beautiful but deeply functional.</p>
          <p>Every project begins with listening — understanding your lifestyle, your aspirations, and the unique story of each site. From residential masterpieces to commercial landmarks, we bring unmatched expertise.</p>
          <p>Our philosophy: great architecture is timeless, sustainable, and deeply human.</p>
          <a href="#" className="explore-btn">Explore →</a>
        </div>
      </section>

      {/* ===== CONNECT & STATS ===== */}
      <section className="connect-stats">
        <div className="connect-row">
          <span className="connect-label">Connect with us:</span>
          <div className="social-icons">
            <a href="#" className="social-icon fb">f</a>
            <a href="#" className="social-icon tw">𝕏</a>
            <a href="#" className="social-icon li">in</a>
            <a href="#" className="social-icon ig">◎</a>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="num">120<span>+</span></div>
            <div className="lbl">Projects Completed</div>
          </div>
          <div className="stat-card">
            <div className="num">85<span>+</span></div>
            <div className="lbl">Clients Dealt With</div>
          </div>
          <div className="stat-card">
            <div className="num">15<span>+</span></div>
            <div className="lbl">Years of Experience</div>
          </div>
          <div className="stat-card">
            <div className="num">30<span>+</span></div>
            <div className="lbl">Locations Served</div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="projects">
        <div className="section-header">
          <h2>Projects</h2>
        </div>
        <div className="projects-grid">
          <div className="project-card">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <circle cx="40" cy="46" r="18" fill="#1E3A8A" opacity="0.2"/>
              <polygon points="74,18 100,70 48,70" fill="#1E3A8A" opacity="0.2"/>
            </svg>
            <div className="project-card-overlay"></div>
            <div className="project-card-label">Modern Villa</div>
          </div>
          <div className="project-card">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <circle cx="40" cy="46" r="18" fill="#1E3A8A" opacity="0.2"/>
              <polygon points="74,18 100,70 48,70" fill="#1E3A8A" opacity="0.2"/>
            </svg>
            <div className="project-card-overlay"></div>
            <div className="project-card-label">Urban Office</div>
          </div>
          <div className="project-card">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <circle cx="40" cy="46" r="18" fill="#1E3A8A" opacity="0.2"/>
              <polygon points="74,18 100,70 48,70" fill="#1E3A8A" opacity="0.2"/>
            </svg>
            <div className="project-card-overlay"></div>
            <div className="project-card-label">Coastal Home</div>
          </div>
          <div className="project-card">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <circle cx="40" cy="46" r="18" fill="#1E3A8A" opacity="0.2"/>
              <polygon points="74,18 100,70 48,70" fill="#1E3A8A" opacity="0.2"/>
            </svg>
            <div className="project-card-overlay"></div>
            <div className="project-card-label">Luxury Penthouse</div>
          </div>
        </div>
        <div className="projects-cta">
          <Link to="/projects" className="cyan-btn">Click to another page →</Link>
        </div>
      </section>

      {/* ===== POPULAR HOMES ===== */}
      <section className="popular">
        <div className="section-header">
          <h2>POPULAR Homes</h2>
          <a href="#" className="cyan-btn">Explore All</a>
        </div>
        <div className="popular-grid">
          <div className="home-card">
            <div className="home-card-img">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <circle cx="32" cy="38" r="14" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="60,16 82,58 38,58" fill="#1E3A8A" opacity="0.25"/>
              </svg>
            </div>
            <div className="home-card-body">
              <h4>Skyline Residence</h4>
              <p>Contemporary living with panoramic city views. Open plan, light-filled interiors.</p>
              <div className="home-card-price">$1,250,000</div>
            </div>
          </div>
          <div className="home-card">
            <div className="home-card-img">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <circle cx="32" cy="38" r="14" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="60,16 82,58 38,58" fill="#1E3A8A" opacity="0.25"/>
              </svg>
            </div>
            <div className="home-card-body">
              <h4>Garden Retreat</h4>
              <p>Peaceful suburban sanctuary surrounded by lush landscaped gardens.</p>
              <div className="home-card-price">$890,000</div>
            </div>
          </div>
          <div className="home-card">
            <div className="home-card-img">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <circle cx="32" cy="38" r="14" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="60,16 82,58 38,58" fill="#1E3A8A" opacity="0.25"/>
              </svg>
            </div>
            <div className="home-card-body">
              <h4>Coastal Villa</h4>
              <p>Beachfront property with floor-to-ceiling ocean views and breezy terraces.</p>
              <div className="home-card-price">$2,100,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials">
        <h2>What Our Customers Say About Us?</h2>
        <p className="subtitle">Real stories from real clients who trusted us with their dream spaces.</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="t-avatar"></div>
            <div className="stars">★★★★★</div>
            <blockquote>"Mahim Builders completely transformed our vision into a breathtaking reality. Every detail was handled with precision and care. We couldn't be prouder of our new home."</blockquote>
            <div className="t-name">Sarah Mitchell</div>
            <div className="t-role">Homeowner, Dubai</div>
          </div>
          <div className="testimonial-card">
            <div className="t-avatar"></div>
            <div className="stars">★★★★★</div>
            <blockquote>"From first consultation to final handover, the process was seamless. The team's expertise in blending aesthetics with functionality is truly world-class."</blockquote>
            <div className="t-name">James Thornton</div>
            <div className="t-role">CEO, TechFirm HQ</div>
          </div>
          <div className="testimonial-card">
            <div className="t-avatar"></div>
            <div className="stars">★★★★★</div>
            <blockquote>"Exceptional attention to detail and a genuine passion for design. The result exceeded every expectation we had. Highly recommend to anyone seeking quality architecture."</blockquote>
            <div className="t-name">Priya Sharma</div>
            <div className="t-role">Interior Designer</div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services" id="services">
        <h2>Our Services</h2>
        <p className="subtitle">End-to-end architectural solutions tailored to your vision.</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-wrap"><span>🏛️</span></div>
            <h4>Architectural Design</h4>
            <p>From concept to blueprint, we craft spaces that stand the test of time.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap"><span>🛋️</span></div>
            <h4>Interior Design</h4>
            <p>Thoughtful, curated interiors that reflect personality and purpose.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap"><span>🌿</span></div>
            <h4>Landscape Planning</h4>
            <p>Outdoor environments that complement and enhance the built space.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap"><span>📐</span></div>
            <h4>Project Management</h4>
            <p>End-to-end oversight ensuring quality, timeline, and budget are respected.</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="footer-main">
          <div className="footer-logo-block">
            <div className="footer-logo-txt">Mahim <span>Builders</span></div>
            <p>Transforming visions into timeless architecture. Building the future, one space at a time.</p>
          </div>
          <div className="footer-links-col">
            <h5>Navigation</h5>
            <Link to="/">Home</Link>
            <a href="#about">About Us</a>
            <Link to="/projects">Projects</Link>
            <a href="#services">Services</a>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-contact-col">
            <h5>Get In Touch</h5>
            <div className="footer-contact-bar">
              <p>📍 123 Construction Avenue, Dhaka, Bangladesh</p>
              <p>✉️ info@mahimbuilders.com</p>
              <p>📞 +880 1234 567890</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Mahim Builders & Construction Ltd. All rights reserved. Designed with ❤️</div>
      </footer>

      <style>{`
        /* ===== VARIABLES ===== */
        :root {
          --blue: #1E3A8A;
          --blue-dark: #162d6e;
          --cyan: #06B6D4;
          --cyan-dark: #0891b2;
          --orange: #F97316;
          --white: #FFFFFF;
          --gray-light: #F3F4F6;
          --gray-dark: #111827;
          --gray-mid: #6B7280;
          --shadow: 0 4px 20px rgba(0,0,0,0.10);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Roboto', sans-serif; color: var(--gray-dark); background: var(--white); }

        /* ===== NAVBAR ===== */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: var(--blue);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 60px; height: 68px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.2);
        }
        .nav-logo {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          color: var(--white); font-size: 1.4rem; letter-spacing: 1px;
        }
        .nav-logo span { color: var(--cyan); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a, .nav-links Link {
          color: rgba(255,255,255,0.85); text-decoration: none;
          font-family: 'Poppins', sans-serif; font-size: 0.88rem; font-weight: 400;
          transition: color 0.2s; position: relative; padding-bottom: 4px;
        }
        .nav-links a::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
          background: var(--cyan); transition: width 0.25s;
        }
        .nav-links a:hover { color: var(--white); }
        .nav-links a:hover::after { width: 100%; }
        .nav-contact-btn {
          background: var(--cyan); color: var(--white); border: none;
          padding: 10px 26px; border-radius: 50px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.85rem;
          transition: background 0.2s, transform 0.2s;
        }
        .nav-contact-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
        .nav-hamburger span { width: 24px; height: 2px; background: white; border-radius: 2px; }

        /* ===== HERO ===== */
        .hero {
          position: relative; min-height: 100vh;
          background: linear-gradient(135deg, rgba(15, 36, 96, 0.95) 0%, rgba(30, 58, 138, 0.8) 40%, rgba(26, 79, 160, 0.7) 100%), url(${mahim_bg});
          background-size: cover; background-position: center;
          display: flex; flex-direction: column;
          padding-top: 68px; overflow: hidden;
        }
        .hero-bg-pattern {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%);
          background-size: 30px 30px;
        }
        .hero-content-area {
          flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: calc(100vh - 68px);
        }
        .hero-left {
          padding: 80px 60px; display: flex; flex-direction: column; justify-content: center;
          animation: fadeInUp 0.8s ease both;
        }
        .hero-tag {
          display: inline-block; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.4);
          color: var(--cyan); font-family: 'Poppins', sans-serif; font-size: 0.75rem;
          font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 50px; margin-bottom: 24px; width: fit-content;
        }
        .hero-left h1 {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          color: var(--white); font-size: 3.2rem; line-height: 1.15; margin-bottom: 24px;
        }
        .hero-left h1 span { color: var(--cyan); }
        .hero-left p {
          color: rgba(255,255,255,0.7); line-height: 1.8; font-size: 1rem;
          margin-bottom: 40px; max-width: 480px;
        }
        .hero-btn {
          display: inline-block; background: var(--gray-dark); color: var(--white);
          padding: 14px 32px; border-radius: 8px; text-decoration: none;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          transition: background 0.2s, transform 0.2s; width: fit-content;
          border: 2px solid rgba(255,255,255,0.1);
        }
        .hero-btn:hover { background: #000; transform: translateY(-2px); }
        .hero-right {
          display: flex; align-items: center; justify-content: center;
          position: relative; padding: 40px;
          animation: fadeInUp 0.8s ease 0.2s both;
        }
        .hero-img-card {
          width: 100%; max-width: 460px; aspect-ratio: 4/3;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(6,182,212,0.12));
          border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(10px); box-shadow: var(--shadow-lg);
          position: relative; overflow: hidden;
        }
        .hero-img-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 40%, rgba(6,182,212,0.15) 0%, transparent 60%);
        }
        .hero-img-card svg { opacity: 0.35; position: relative; z-index: 1; }

        /* SEARCH BAR (inside hero bottom) */
        .hero-search-bar {
          background: var(--white); margin: 0 60px 0; padding: 20px 24px;
          border-radius: 12px 12px 0 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
        }
        .filter-dropdown {
          flex: 1; min-width: 140px; display: flex; align-items: center; gap: 10px;
          background: var(--gray-light); border-radius: 8px; padding: 10px 16px;
          cursor: pointer; transition: box-shadow 0.2s;
        }
        .filter-dropdown:hover { box-shadow: 0 0 0 2px var(--cyan); }
        .filter-icon { color: var(--cyan); font-size: 1rem; }
        .filter-dropdown select {
          border: none; background: transparent; font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; color: var(--gray-dark); cursor: pointer; outline: none; flex: 1;
        }
        .search-btn {
          background: var(--cyan); color: var(--white); border: none;
          padding: 12px 32px; border-radius: 8px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.9rem;
          transition: background 0.2s, transform 0.2s; white-space: nowrap;
        }
        .search-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }

        /* ===== ABOUT ===== */
        .about {
          padding: 100px 60px; background: var(--white);
          display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center;
        }
        .about-img {
          background: linear-gradient(135deg, #e0eaff 0%, #c7d8f8 100%);
          border-radius: 16px; aspect-ratio: 4/3;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-lg); position: relative; overflow: hidden;
        }
        .about-img::after {
          content: ''; position: absolute; bottom: -20px; right: -20px;
          width: 120px; height: 120px; background: var(--cyan); border-radius: 50%; opacity: 0.15;
        }
        .about-img svg { opacity: 0.35; position: relative; z-index: 1; }
        .about-content {}
        .section-label {
          font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase; color: var(--cyan); margin-bottom: 12px;
        }
        .about-content h2 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 2.4rem; color: var(--blue); margin-bottom: 20px; line-height: 1.2;
        }
        .about-content p {
          color: var(--gray-mid); line-height: 1.8; margin-bottom: 16px; font-size: 0.95rem;
        }
        .explore-btn {
          display: inline-block; background: var(--cyan); color: var(--white);
          padding: 13px 36px; border-radius: 50px; text-decoration: none;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          transition: background 0.2s, transform 0.2s; margin-top: 10px;
        }
        .explore-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }

        /* ===== CONNECT & STATS ===== */
        .connect-stats { background: var(--gray-light); padding: 70px 60px; }
        .connect-row {
          display: flex; align-items: center; gap: 40px; flex-wrap: wrap;
          margin-bottom: 50px; padding-bottom: 40px; border-bottom: 1px solid #e5e7eb;
        }
        .connect-label {
          font-family: 'Poppins', sans-serif; font-weight: 600; color: var(--gray-dark);
          font-size: 0.95rem; white-space: nowrap;
        }
        .social-icons { display: flex; gap: 16px; }
        .social-icon {
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none; font-weight: 700; color: white;
        }
        .social-icon:hover { transform: scale(1.15); box-shadow: var(--shadow); }
        .social-icon.fb { background: #1877F2; }
        .social-icon.tw { background: #1DA1F2; }
        .social-icon.li { background: #0A66C2; }
        .social-icon.ig { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
        }
        .stat-card {
          background: var(--white); border-radius: 12px; padding: 32px 20px; text-align: center;
          box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .stat-card .num {
          font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 2.6rem;
          color: var(--blue); margin-bottom: 8px;
        }
        .stat-card .num span { color: var(--cyan); }
        .stat-card .lbl {
          font-family: 'Roboto', sans-serif; font-size: 0.85rem; color: var(--gray-mid);
          font-weight: 500;
        }

        /* ===== PROJECTS ===== */
        .projects { padding: 100px 60px; background: var(--white); }
        .section-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
        }
        .section-header h2 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 2rem; color: var(--blue);
        }
        .projects-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;
        }
        .project-card {
          background: var(--gray-light); border-radius: 12px; aspect-ratio: 16/10;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow); overflow: hidden; position: relative; cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .project-card:hover { transform: scale(1.02); box-shadow: var(--shadow-lg); }
        .project-card svg { opacity: 0.3; transition: opacity 0.2s; }
        .project-card:hover svg { opacity: 0.45; }
        .project-card-overlay {
          position: absolute; inset: 0; background: linear-gradient(to top, rgba(30,58,138,0.6) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .project-card:hover .project-card-overlay { opacity: 1; }
        .project-card-label {
          position: absolute; bottom: 16px; left: 20px;
          color: white; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          opacity: 0; transition: opacity 0.25s; z-index: 2;
        }
        .project-card:hover .project-card-label { opacity: 1; }
        .projects-cta { text-align: right; }
        .cyan-btn {
          display: inline-block; background: var(--cyan); color: var(--white);
          padding: 12px 30px; border-radius: 50px; text-decoration: none;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.88rem;
          transition: background 0.2s, transform 0.2s; border: none; cursor: pointer;
        }
        .cyan-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }

        /* ===== POPULAR HOMES ===== */
        .popular { padding: 100px 60px; background: var(--gray-light); }
        .popular-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 32px; }
        .home-card {
          background: var(--white); border-radius: 12px; overflow: hidden;
          box-shadow: var(--shadow); transition: transform 0.25s, box-shadow 0.25s;
        }
        .home-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .home-card-img {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe); height: 180px;
          display: flex; align-items: center; justify-content: center;
        }
        .home-card-img svg { opacity: 0.35; }
        .home-card-body { padding: 20px; }
        .home-card-body h4 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 1rem; color: var(--blue); margin-bottom: 8px;
        }
        .home-card-body p { font-size: 0.82rem; color: var(--gray-mid); line-height: 1.6; }
        .home-card-price {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          color: var(--cyan); font-size: 1rem; margin-top: 12px;
        }

        /* ===== TESTIMONIALS ===== */
        .testimonials { padding: 100px 60px; background: var(--white); text-align: center; }
        .testimonials h2 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 2rem; color: var(--blue); margin-bottom: 12px;
        }
        .testimonials .subtitle { color: var(--gray-mid); margin-bottom: 50px; font-size: 0.95rem; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .testimonial-card {
          background: var(--gray-light); border-radius: 12px; padding: 32px 24px;
          box-shadow: var(--shadow); text-align: left; transition: transform 0.2s;
        }
        .testimonial-card:hover { transform: translateY(-4px); }
        .t-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan), var(--blue));
          margin-bottom: 18px;
        }
        .testimonial-card blockquote {
          font-size: 0.88rem; color: var(--gray-mid); line-height: 1.75;
          margin-bottom: 16px; font-style: italic;
        }
        .t-name { font-family: 'Poppins', sans-serif; font-weight: 600; color: var(--gray-dark); font-size: 0.9rem; }
        .t-role { font-size: 0.78rem; color: var(--cyan); }
        .stars { color: var(--orange); font-size: 0.85rem; margin-bottom: 12px; }

        /* ===== SERVICES ===== */
        .services { padding: 100px 60px; background: var(--gray-light); text-align: center; }
        .services h2 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 2rem; color: var(--blue); margin-bottom: 12px;
        }
        .services .subtitle { color: var(--gray-mid); margin-bottom: 50px; }
        .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .service-card {
          background: var(--white); border-radius: 12px; padding: 36px 20px;
          box-shadow: var(--shadow); transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
          cursor: default;
        }
        .service-card:hover {
          transform: translateY(-6px); box-shadow: var(--shadow-lg);
          background: var(--blue);
        }
        .service-card:hover h4, .service-card:hover p { color: white; }
        .service-card:hover .service-icon-wrap { background: rgba(255,255,255,0.15); }
        .service-icon-wrap {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
        }
        .service-icon-wrap span { font-size: 1.8rem; }
        .service-card h4 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 1rem; color: var(--blue); margin-bottom: 10px; transition: color 0.25s;
        }
        .service-card p { font-size: 0.82rem; color: var(--gray-mid); line-height: 1.65; transition: color 0.25s; }

        /* ===== FOOTER ===== */
        footer {
          background: var(--blue); color: var(--white); padding: 50px 60px 24px;
        }
        .footer-main {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px;
          padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.15);
          align-items: start;
        }
        .footer-logo-block {}
        .footer-logo-txt {
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1.5rem;
          color: white; margin-bottom: 12px;
        }
        .footer-logo-txt span { color: var(--cyan); }
        .footer-logo-block p { color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.7; }
        .footer-links-col h5 {
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: var(--cyan); margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
        }
        .footer-links-col a, .footer-links-col Link {
          display: block; color: rgba(255,255,255,0.7); text-decoration: none;
          font-size: 0.85rem; line-height: 2.4; transition: color 0.2s;
        }
        .footer-links-col a:hover, .footer-links-col Link:hover { color: white; text-decoration: underline; }
        .footer-contact-col h5 {
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: var(--cyan); margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
        }
        .footer-contact-bar {
          background: rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .footer-contact-bar p { color: rgba(255,255,255,0.7); font-size: 0.83rem; line-height: 2; }
        .footer-bottom {
          margin-top: 24px; text-align: center;
          color: rgba(255,255,255,0.4); font-size: 0.78rem;
        }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          nav { padding: 0 30px; }
          .hero-left { padding: 60px 40px; }
          .hero-left h1 { font-size: 2.4rem; }
          .about, .projects, .popular, .testimonials, .services { padding: 70px 40px; }
          .connect-stats { padding: 60px 40px; }
          footer { padding: 50px 40px 24px; }
          .hero-search-bar { margin: 0 40px 0; }
        }

        @media (max-width: 768px) {
          nav { padding: 0 20px; }
          .nav-links, .nav-contact-btn { display: none; }
          .nav-hamburger { display: flex; }

          .hero-content-area { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { padding: 60px 24px; }
          .hero-left h1 { font-size: 2rem; }
          .hero-search-bar { margin: 0 16px 0; flex-direction: column; border-radius: 12px; }
          .filter-dropdown { min-width: unset; width: 100%; }

          .about { grid-template-columns: 1fr; padding: 60px 24px; gap: 40px; }
          .connect-stats { padding: 60px 24px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .projects { padding: 60px 24px; }
          .projects-grid { grid-template-columns: 1fr; }
          .popular { padding: 60px 24px; }
          .popular-grid { grid-template-columns: 1fr; }
          .testimonials { padding: 60px 24px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .services { padding: 60px 24px; }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          footer { padding: 40px 24px 20px; }
          .footer-main { grid-template-columns: 1fr; gap: 30px; }
          .section-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

export default Landing;
