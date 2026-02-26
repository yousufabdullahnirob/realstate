import { Link } from "react-router-dom";

function ProjectDetails() {
  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav>
        <div className="nav-logo">Archi<span>Space</span></div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#">Search</a></li>
          <li><a href="#">About Us</a></li>
          <li><Link to="/projects" className="active">Projects</Link></li>
          <li><a href="#">Services</a></li>
        </ul>
        <button className="nav-contact-btn">Contact Us</button>
        <div className="nav-hamburger"><span></span><span></span><span></span></div>
      </nav>

      {/* ===== HERO BANNER ===== */}
      <section className="hero-banner">
        <div className="hero-bg-pattern"></div>
        <div className="hero-banner-img">
          <svg width="900" height="480" viewBox="0 0 900 480" fill="none">
            <circle cx="260" cy="200" r="110" fill="white"/>
            <polygon points="520,50 730,380 310,380" fill="white"/>
            <rect x="80" y="370" width="740" height="10" rx="5" fill="white"/>
          </svg>
        </div>
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-content-left">
            <div className="breadcrumb">
              <Link to="/">Home</Link><span>›</span>
              <Link to="/projects">Projects</Link><span>›</span>
              <span className="current">Skyline Residence</span>
            </div>
            <h1>Skyline <span>Residence</span></h1>
            <div className="hero-badges">
              <span className="hero-badge badge-status">✓ Completed</span>
              <span className="hero-badge badge-type">Residential Villa</span>
              <span className="hero-badge badge-year">📅 2024</span>
            </div>
          </div>
          <div className="hero-content-right">
            <div className="hero-price-card">
              <div className="label">Starting From</div>
              <div className="price"><span>$</span>1,250,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK INFO BAR ===== */}
      <div className="info-bar">
        <div className="info-item">
          <div className="info-icon">📍</div>
          <div className="info-text">
            <div className="info-label">Location</div>
            <div className="info-value">Dubai, UAE</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">📐</div>
          <div className="info-text">
            <div className="info-label">Total Area</div>
            <div className="info-value">6,200 sq ft</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">🛏️</div>
          <div className="info-text">
            <div className="info-label">Bedrooms</div>
            <div className="info-value">5 Bedrooms</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">🚿</div>
          <div className="info-text">
            <div className="info-label">Bathrooms</div>
            <div className="info-value">4 Bathrooms</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">🏗️</div>
          <div className="info-text">
            <div className="info-label">Status</div>
            <div className="info-value" style={{color:"#22c55e"}}>Completed</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">📅</div>
          <div className="info-text">
            <div className="info-label">Year Built</div>
            <div className="info-value">2024</div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-wrapper">

        {/* LEFT COLUMN */}
        <div className="left-col">

          {/* GALLERY */}
          <div className="gallery-section">
            <div className="section-title">Photo Gallery</div>
            <div className="gallery-main" id="mainGallery">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle cx="70" cy="85" r="35" fill="#1E3A8A" opacity="0.2"/>
                <polygon points="135,30 185,125 85,125" fill="#1E3A8A" opacity="0.2"/>
                <rect x="20" y="155" width="160" height="8" rx="4" fill="#1E3A8A" opacity="0.15"/>
              </svg>
              <div className="gallery-main-overlay"></div>
              <button className="gallery-expand">⛶ Expand</button>
            </div>
            <div className="gallery-thumbs">
              <div className="gallery-thumb active">
                <div className="thumb-inner t1">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="18" cy="21" r="9" fill="#1E3A8A" opacity="0.3"/><polygon points="34,8 46,32 22,32" fill="#1E3A8A" opacity="0.3"/></svg>
                </div>
              </div>
              <div className="gallery-thumb">
                <div className="thumb-inner t2">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="18" cy="21" r="9" fill="#0E7490" opacity="0.3"/><polygon points="34,8 46,32 22,32" fill="#0E7490" opacity="0.3"/></svg>
                </div>
              </div>
              <div className="gallery-thumb">
                <div className="thumb-inner t3">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="18" cy="21" r="9" fill="#7C3AED" opacity="0.3"/><polygon points="34,8 46,32 22,32" fill="#7C3AED" opacity="0.3"/></svg>
                </div>
              </div>
              <div className="gallery-thumb">
                <div className="thumb-inner t4">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="18" cy="21" r="9" fill="#D97706" opacity="0.3"/><polygon points="34,8 46,32 22,32" fill="#D97706" opacity="0.3"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="description-section">
            <div className="section-title">Project Description</div>
            <p>Skyline Residence is a landmark family villa perched in the heart of Dubai, offering breathtaking panoramic views of the city skyline. Designed with a seamless blend of modern architecture and timeless elegance, every detail of this home speaks to refined living.</p>
            <div className="highlight-box">
              <p>"Our vision was to create a home that feels both grand and intimate — where every room tells a story of light, space, and connection to the landscape beyond."</p>
            </div>
            <p>The open-plan ground floor integrates the living, dining and kitchen areas into one fluid social space, anchored by floor-to-ceiling glazing that frames the city view like a living canvas. Upstairs, five generously proportioned bedrooms each offer their own private balcony, ensuring personal retreats within the home.</p>
            <p>Sustainability was central to the design philosophy. The villa incorporates passive cooling strategies, solar panels, and a smart home automation system that manages energy consumption with precision. The result is a home that is as responsible as it is beautiful.</p>
          </div>

          {/* FEATURES */}
          <div className="features-section">
            <div className="section-title">Key Features</div>
            <div className="features-grid">
              <div className="feature-item"><div className="feature-icon">🏊</div><span>Private Swimming Pool</span></div>
              <div className="feature-item"><div className="feature-icon">🌿</div><span>Landscaped Garden</span></div>
              <div className="feature-item"><div className="feature-icon">🚗</div><span>Double Garage</span></div>
              <div className="feature-item"><div className="feature-icon">☀️</div><span>Solar Panel System</span></div>
              <div className="feature-item"><div className="feature-icon">🏠</div><span>Smart Home Automation</span></div>
              <div className="feature-item"><div className="feature-icon">🔒</div><span>24/7 Security System</span></div>
              <div className="feature-item"><div className="feature-icon">🌬️</div><span>Central Air Conditioning</span></div>
              <div className="feature-item"><div className="feature-icon">🍽️</div><span>Chef's Open Kitchen</span></div>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div className="specs-section">
            <div className="section-title">Specifications</div>
            <table className="specs-table">
              <tbody>
                <tr><td>Property Type</td><td>Residential Villa</td></tr>
                <tr><td>Total Built Area</td><td>6,200 sq ft</td></tr>
                <tr><td>Plot Area</td><td>9,500 sq ft</td></tr>
                <tr><td>Number of Floors</td><td>2 Floors + Basement</td></tr>
                <tr><td>Bedrooms</td><td>5 Bedrooms</td></tr>
                <tr><td>Bathrooms</td><td>4 Bathrooms + 2 Powder Rooms</td></tr>
                <tr><td>Parking</td><td>Double Garage + 2 External</td></tr>
                <tr><td>Construction Year</td><td>2024</td></tr>
                <tr><td>Architect</td><td>ArchiSpace Design Studio</td></tr>
                <tr><td>Interior Designer</td><td>Lumina Interiors</td></tr>
                <tr><td>Structural Engineer</td><td>CoreBuild Engineering</td></tr>
                <tr><td>Project Status</td><td style={{color:"#22c55e",fontWeight:"600"}}>✓ Completed</td></tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">

          {/* ENQUIRE FORM */}
          <div className="enquire-card">
            <h3>Enquire About This Project</h3>
            <p className="sub">Our team will get back to you within 24 hours.</p>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. John Smith" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="e.g. john@email.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="e.g. +971 50 000 0000" />
            </div>
            <div className="form-group">
              <label>Enquiry Type</label>
              <select>
                <option value="">Select a reason</option>
                <option>Purchase Inquiry</option>
                <option>Site Visit Request</option>
                <option>General Information</option>
                <option>Investment Interest</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Tell us more about your interest in this project..."></textarea>
            </div>
            <button className="submit-btn">Send Enquiry →</button>
            <div className="or-divider">or</div>
            <button className="call-btn">📞 Call Us Now</button>
          </div>

          {/* AGENT CARD */}
          <div className="agent-card">
            <div className="agent-avatar">👤</div>
            <div className="agent-info">
              <div className="name">Ahmed Al Mansouri</div>
              <div className="role">Senior Project Consultant</div>
              <div className="phone">📞 +971 50 123 4567</div>
            </div>
          </div>

          {/* SHARE CARD */}
          <div className="share-card">
            <h4>Share This Project</h4>
            <div className="share-btns">
              <button className="share-btn share-fb">Facebook</button>
              <button className="share-btn share-wa">WhatsApp</button>
              <button className="share-btn share-li">LinkedIn</button>
              <button className="share-btn share-copy">Copy Link</button>
            </div>
          </div>

        </div>
      </div>

      {/* ===== SIMILAR PROJECTS ===== */}
      <section className="similar-section">
        <div className="sec-title">Similar Residential Projects</div>
        <div className="similar-grid">
          <div className="sim-card">
            <div className="sim-card-img s1">
              <span className="sim-badge">Completed</span>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="28" cy="33" r="12" fill="#1E3A8A" opacity="0.25"/><polygon points="54,12 72,50 36,50" fill="#1E3A8A" opacity="0.25"/></svg>
            </div>
            <div className="sim-card-body">
              <div className="sim-meta">📍 Sharjah, UAE &nbsp;·&nbsp; Villa</div>
              <h4>Garden Retreat Villa</h4>
              <p>A peaceful family home surrounded by lush landscaped gardens and water features.</p>
              <div className="sim-footer">
                <span className="sim-price">$890,000</span>
                <Link to="/project-details" className="sim-link">View →</Link>
              </div>
            </div>
          </div>
          <div className="sim-card">
            <div className="sim-card-img s2">
              <span className="sim-badge" style={{background:"var(--orange)"}}>Under Progress</span>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="28" cy="33" r="12" fill="#0E7490" opacity="0.25"/><polygon points="54,12 72,50 36,50" fill="#0E7490" opacity="0.25"/></svg>
            </div>
            <div className="sim-card-body">
              <div className="sim-meta">📍 Dubai Marina &nbsp;·&nbsp; Apartment</div>
              <h4>Marina Heights Apartment</h4>
              <p>Upscale residential apartment with stunning marina views and premium finishes.</p>
              <div className="sim-footer">
                <span className="sim-price">$1,450,000</span>
                <Link to="/project-details" className="sim-link">View →</Link>
              </div>
            </div>
          </div>
          <div className="sim-card">
            <div className="sim-card-img s3">
              <span className="sim-badge" style={{background:"var(--blue)"}}>Future Project</span>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="28" cy="33" r="12" fill="#7C3AED" opacity="0.25"/><polygon points="54,12 72,50 36,50" fill="#7C3AED" opacity="0.25"/></svg>
            </div>
            <div className="sim-card-body">
              <div className="sim-meta">📍 Jumeirah &nbsp;·&nbsp; Townhouse</div>
              <h4>Heritage Townhouse</h4>
              <p>Residential townhouse with traditional Arabian architectural motifs and modern comforts.</p>
              <div className="sim-footer">
                <span className="sim-price">$750,000</span>
                <Link to="/project-details" className="sim-link">View →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="footer-main">
          <div className="footer-logo-block">
            <div className="footer-logo-txt">Archi<span>Space</span></div>
            <p>Transforming visions into timeless architecture. Building the future, one space at a time.</p>
          </div>
          <div className="footer-links-col">
            <h5>Navigation</h5>
            <Link to="/">Home</Link>
            <a href="#">About Us</a>
            <Link to="/projects">Projects</Link>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-contact-col">
            <h5>Get In Touch</h5>
            <div className="footer-contact-bar">
              <p>📍 123 Design Avenue, Dubai, UAE</p>
              <p>✉️ hello@archispace.com</p>
              <p>📞 +971 4 000 0000</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 ArchiSpace. All rights reserved. Designed with ❤️</div>
      </footer>

      <style>{`
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
          --shadow: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Roboto', sans-serif; color: var(--gray-dark); background: var(--gray-light); }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: var(--blue);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 60px; height: 68px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.2);
        }
        .nav-logo { font-family: 'Poppins', sans-serif; font-weight: 700; color: var(--white); font-size: 1.4rem; letter-spacing: 1px; }
        .nav-logo span { color: var(--cyan); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a, .nav-links Link {
          color: rgba(255,255,255,0.85); text-decoration: none;
          font-family: 'Poppins', sans-serif; font-size: 0.88rem; font-weight: 400;
          transition: color 0.2s; position: relative; padding-bottom: 4px;
        }
        .nav-links a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--cyan); transition: width 0.25s; }
        .nav-links a:hover, .nav-links a.active { color: var(--white); }
        .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
        .nav-contact-btn {
          background: var(--cyan); color: var(--white); border: none;
          padding: 10px 26px; border-radius: 50px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.85rem;
          transition: background 0.2s, transform 0.2s;
        }
        .nav-contact-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
        .nav-hamburger span { width: 24px; height: 2px; background: white; border-radius: 2px; }

        .hero-banner {
          margin-top: 68px; position: relative; height: 500px; overflow: hidden;
          background: linear-gradient(135deg, #0f2460 0%, #1E3A8A 50%, #1a4fa0 100%);
          display: flex; align-items: flex-end;
        }
        .hero-bg-pattern {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%);
          background-size: 30px 30px;
        }
        .hero-banner-img {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        }
        .hero-banner-img svg { opacity: 0.18; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,36,96,0.92) 0%, rgba(15,36,96,0.3) 55%, transparent 100%); }
        .hero-content {
          position: relative; z-index: 2; padding: 0 60px 50px;
          display: flex; justify-content: space-between; align-items: flex-end; width: 100%;
        }
        .hero-content-left { animation: fadeInUp 0.7s ease both; }
        .breadcrumb {
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem;
        }
        .breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--cyan); }
        .breadcrumb span { color: rgba(255,255,255,0.4); }
        .breadcrumb .current { color: var(--cyan); }
        .hero-content h1 {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          color: var(--white); font-size: 3rem; line-height: 1.15; margin-bottom: 14px;
        }
        .hero-content h1 span { color: var(--cyan); }
        .hero-badges { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-badge {
          padding: 6px 18px; border-radius: 50px; font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px;
        }
        .badge-status { background: #22c55e; color: white; }
        .badge-type { background: var(--cyan); color: white; }
        .badge-year { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); }
        .hero-content-right { animation: fadeInUp 0.7s ease 0.15s both; text-align: right; }
        .hero-price-card {
          background: rgba(255,255,255,0.12); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 14px; padding: 20px 28px;
        }
        .hero-price-card .label { color: rgba(255,255,255,0.6); font-size: 0.78rem; font-family: 'Poppins', sans-serif; margin-bottom: 4px; }
        .hero-price-card .price { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 2rem; color: white; }
        .hero-price-card .price span { color: var(--cyan); font-size: 1.1rem; }

        .info-bar {
          background: var(--white); padding: 0 60px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex; align-items: stretch;
        }
        .info-item {
          flex: 1; padding: 22px 20px; display: flex; align-items: center; gap: 14px;
          border-right: 1px solid var(--gray-light); transition: background 0.2s;
        }
        .info-item:last-child { border-right: none; }
        .info-item:hover { background: var(--gray-light); }
        .info-icon {
          width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
        }
        .info-text .info-label { font-size: 0.72rem; color: var(--gray-mid); font-family: 'Poppins', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
        .info-text .info-value { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.92rem; color: var(--gray-dark); }

        .main-wrapper { max-width: 1200px; margin: 0 auto; padding: 60px 60px 80px; display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }

        .gallery-section { margin-bottom: 50px; }
        .section-title {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 1.4rem; color: var(--blue); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-title::after { content: ''; flex: 1; height: 2px; background: var(--gray-light); }

        .gallery-main {
          width: 100%; aspect-ratio: 16/9; border-radius: 14px; overflow: hidden;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; cursor: pointer; position: relative;
          box-shadow: var(--shadow-lg);
        }
        .gallery-main svg { opacity: 0.3; transition: transform 0.3s; }
        .gallery-main:hover svg { transform: scale(1.05); }
        .gallery-main-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(30,58,138,0.4) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .gallery-main:hover .gallery-main-overlay { opacity: 1; }
        .gallery-expand {
          position: absolute; bottom: 16px; right: 16px;
          background: rgba(255,255,255,0.9); border: none; border-radius: 8px;
          padding: 8px 16px; font-family: 'Poppins', sans-serif; font-size: 0.78rem;
          font-weight: 600; color: var(--blue); cursor: pointer; opacity: 0; transition: opacity 0.3s;
        }
        .gallery-main:hover .gallery-expand { opacity: 1; }

        .gallery-thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .gallery-thumb {
          aspect-ratio: 4/3; border-radius: 8px; overflow: hidden;
          cursor: pointer; position: relative; transition: transform 0.2s, box-shadow 0.2s;
        }
        .gallery-thumb:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .gallery-thumb.active { outline: 3px solid var(--cyan); outline-offset: 2px; }
        .thumb-inner {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
        }
        .thumb-inner svg { opacity: 0.3; }
        .t1 { background: linear-gradient(135deg, #dbeafe, #93c5fd); }
        .t2 { background: linear-gradient(135deg, #e0f2fe, #7dd3fc); }
        .t3 { background: linear-gradient(135deg, #ede9fe, #c4b5fd); }
        .t4 { background: linear-gradient(135deg, #fef3c7, #fcd34d); }

        .description-section { margin-bottom: 50px; }
        .description-section p {
          color: var(--gray-mid); line-height: 1.85; margin-bottom: 16px; font-size: 0.95rem;
        }
        .description-section p:last-child { margin-bottom: 0; }
        .highlight-box {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-left: 4px solid var(--cyan); border-radius: 0 10px 10px 0;
          padding: 20px 24px; margin: 24px 0;
        }
        .highlight-box p { color: var(--blue); font-style: italic; margin: 0; font-weight: 500; }

        .features-section { margin-bottom: 50px; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .feature-item {
          background: var(--white); border-radius: 10px; padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          box-shadow: var(--shadow); transition: transform 0.2s;
        }
        .feature-item:hover { transform: translateY(-2px); }
        .feature-icon {
          width: 40px; height: 40px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
        }
        .feature-item span { font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 0.88rem; color: var(--gray-dark); }

        .specs-section { margin-bottom: 50px; }
        .specs-table { width: 100%; border-collapse: collapse; background: var(--white); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow); }
        .specs-table tr { border-bottom: 1px solid var(--gray-light); }
        .specs-table tr:last-child { border-bottom: none; }
        .specs-table td { padding: 14px 20px; font-size: 0.88rem; }
        .specs-table td:first-child { color: var(--gray-mid); font-family: 'Poppins', sans-serif; font-weight: 500; width: 40%; background: var(--gray-light); }
        .specs-table td:last-child { color: var(--gray-dark); font-weight: 500; }

        .right-col { display: flex; flex-direction: column; gap: 24px; position: sticky; top: 88px; }

        .enquire-card {
          background: var(--white); border-radius: 16px; padding: 32px 28px;
          box-shadow: var(--shadow-lg);
        }
        .enquire-card h3 {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 1.2rem; color: var(--blue); margin-bottom: 6px;
        }
        .enquire-card .sub { color: var(--gray-mid); font-size: 0.82rem; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label {
          display: block; font-family: 'Poppins', sans-serif; font-size: 0.78rem;
          font-weight: 600; color: var(--gray-dark); margin-bottom: 6px; letter-spacing: 0.3px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-family: 'Roboto', sans-serif; font-size: 0.88rem; color: var(--gray-dark);
          background: var(--gray-light); outline: none; transition: border-color 0.2s, background 0.2s;
          resize: none;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus { border-color: var(--cyan); background: var(--white); }
        .form-group input::placeholder,
        .form-group textarea::placeholder { color: #9ca3af; }
        .submit-btn {
          width: 100%; background: var(--blue); color: var(--white); border: none;
          padding: 14px; border-radius: 10px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.92rem;
          transition: background 0.2s, transform 0.2s; margin-top: 4px;
        }
        .submit-btn:hover { background: var(--blue-dark); transform: translateY(-1px); }
        .or-divider { text-align: center; color: var(--gray-mid); font-size: 0.8rem; margin: 16px 0; position: relative; }
        .or-divider::before, .or-divider::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: #e5e7eb; }
        .or-divider::before { left: 0; } .or-divider::after { right: 0; }
        .call-btn {
          width: 100%; background: var(--cyan); color: var(--white); border: none;
          padding: 13px; border-radius: 10px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.88rem;
          transition: background 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .call-btn:hover { background: var(--cyan-dark); transform: translateY(-1px); }

        .agent-card {
          background: var(--white); border-radius: 16px; padding: 24px 28px;
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 16px;
        }
        .agent-avatar {
          width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--cyan), var(--blue));
          display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: white;
        }
        .agent-info .name { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; color: var(--gray-dark); margin-bottom: 2px; }
        .agent-info .role { font-size: 0.78rem; color: var(--cyan); margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
        .agent-info .phone { font-size: 0.82rem; color: var(--gray-mid); }

        .share-card {
          background: var(--white); border-radius: 16px; padding: 22px 28px; box-shadow: var(--shadow);
        }
        .share-card h4 { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; color: var(--gray-dark); margin-bottom: 14px; }
        .share-btns { display: flex; gap: 10px; }
        .share-btn {
          flex: 1; padding: 9px 8px; border-radius: 8px; border: none; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600;
          transition: opacity 0.2s, transform 0.2s; color: white;
        }
        .share-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .share-fb { background: #1877F2; }
        .share-wa { background: #25D366; }
        .share-li { background: #0A66C2; }
        .share-copy { background: var(--gray-dark); }

        .similar-section { background: var(--white); padding: 70px 60px; }
        .similar-section .sec-title {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 1.6rem; color: var(--blue); margin-bottom: 30px;
        }
        .similar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .sim-card {
          background: var(--gray-light); border-radius: 12px; overflow: hidden;
          box-shadow: var(--shadow); transition: transform 0.25s, box-shadow 0.25s;
        }
        .sim-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
        .sim-card-img {
          height: 160px; display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .sim-card-img svg { opacity: 0.3; }
        .s1 { background: linear-gradient(135deg, #dbeafe, #93c5fd); }
        .s2 { background: linear-gradient(135deg, #e0f2fe, #7dd3fc); }
        .s3 { background: linear-gradient(135deg, #ede9fe, #c4b5fd); }
        .sim-badge {
          position: absolute; top: 10px; left: 10px;
          background: var(--cyan); color: white; font-family: 'Poppins', sans-serif;
          font-size: 0.68rem; font-weight: 600; padding: 3px 10px; border-radius: 50px;
        }
        .sim-card-body { padding: 16px 18px; }
        .sim-meta { font-size: 0.72rem; color: var(--gray-mid); margin-bottom: 6px; font-family: 'Poppins', sans-serif; }
        .sim-card-body h4 { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; color: var(--gray-dark); margin-bottom: 6px; }
        .sim-card-body p { font-size: 0.78rem; color: var(--gray-mid); line-height: 1.5; margin-bottom: 12px; }
        .sim-footer { display: flex; justify-content: space-between; align-items: center; }
        .sim-price { font-family: 'Poppins', sans-serif; font-weight: 700; color: var(--blue); font-size: 0.9rem; }
        .sim-link { color: var(--cyan); font-size: 0.78rem; font-family: 'Poppins', sans-serif; font-weight: 600; text-decoration: none; }
        .sim-link:hover { color: var(--cyan-dark); }

        footer { background: var(--blue); color: var(--white); padding: 50px 60px 24px; }
        .footer-main {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px;
          padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.15); align-items: start;
        }
        .footer-logo-txt { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1.5rem; color: white; margin-bottom: 12px; }
        .footer-logo-txt span { color: var(--cyan); }
        .footer-logo-block p { color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.7; }
        .footer-links-col h5, .footer-contact-col h5 {
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: var(--cyan); margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
        }
        .footer-links-col a, .footer-links-col Link { display: block; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.85rem; line-height: 2.4; transition: color 0.2s; }
        .footer-links-col a:hover, .footer-links-col Link:hover { color: white; text-decoration: underline; }
        .footer-contact-bar { background: rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.1); }
        .footer-contact-bar p { color: rgba(255,255,255,0.7); font-size: 0.83rem; line-height: 2; }
        .footer-bottom { margin-top: 24px; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.78rem; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1100px) {
          .main-wrapper { grid-template-columns: 1fr; padding: 40px 30px 60px; }
          .right-col { position: static; }
          .similar-section { padding: 60px 30px; }
        }
        @media (max-width: 768px) {
          nav { padding: 0 20px; }
          .nav-links, .nav-contact-btn { display: none; }
          .nav-hamburger { display: flex; }
          .hero-banner { height: 380px; }
          .hero-content { padding: 0 24px 36px; flex-direction: column; align-items: flex-start; gap: 20px; }
          .hero-content h1 { font-size: 2rem; }
          .info-bar { flex-direction: column; padding: 0 24px; }
          .info-item { border-right: none; border-bottom: 1px solid var(--gray-light); }
          .main-wrapper { padding: 30px 20px 50px; }
          .features-grid { grid-template-columns: 1fr; }
          .gallery-thumbs { grid-template-columns: repeat(2, 1fr); }
          .similar-grid { grid-template-columns: 1fr; }
          .similar-section { padding: 50px 20px; }
          footer { padding: 40px 20px 20px; }
          .footer-main { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </>
  );
}

export default ProjectDetails;
