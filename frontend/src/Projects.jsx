import { Link } from "react-router-dom";

function Projects() {
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
        <div className="hero-banner-bg-pattern"></div>
        <div className="hero-banner-img">
          <svg width="700" height="340" viewBox="0 0 700 340" fill="none">
            <circle cx="200" cy="150" r="80" fill="white"/>
            <polygon points="400,40 560,280 240,280" fill="white"/>
            <rect x="100" y="260" width="500" height="8" rx="4" fill="white"/>
          </svg>
        </div>
        <div className="hero-banner-content">
          <div className="tag">Our Portfolio</div>
          <h1>Explore Our <span>Projects</span></h1>
          <p>Browse our full portfolio of architectural masterpieces — from cozy residences to iconic commercial spaces.</p>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <div className="search-section">
        <div className="search-bar">
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select><option value="">Location</option><option>Downtown</option><option>Suburbs</option><option>Countryside</option><option>Coastal</option></select>
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select><option value="">Price Range</option><option>Under $500k</option><option>$500k – $1M</option><option>$1M – $2M</option><option>$2M+</option></select>
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select><option value="">Project Type</option><option>Residential</option><option>Commercial</option><option>Mixed Use</option><option>Landscape</option></select>
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">⊿</span>
            <select><option value="">Size</option><option>Small</option><option>Medium</option><option>Large</option></select>
          </div>
          <button className="search-btn">Search</button>
        </div>
      </div>

      {/* ===== FILTERS & SORT ROW ===== */}
      <div className="filters-sort-row">
        <div className="filter-tags">
          <span style={{fontFamily: "'Poppins',sans-serif", fontSize: "0.82rem", color: "var(--gray-mid)", marginRight: "4px"}}>Filter:</span>
          <span className="filter-tag active-cyan">All</span>
          <span className="filter-tag">Completed</span>
          <span className="filter-tag">Under Progress</span>
          <span className="filter-tag">Future Projects</span>
        </div>
        <div className="results-sort">
          <span className="results-count">Showing <strong>9</strong> of 24 projects</span>
          <select className="sort-select">
            <option>Sort: Newest First</option>
            <option>Sort: Price Low–High</option>
            <option>Sort: Price High–Low</option>
            <option>Sort: Most Popular</option>
          </select>
        </div>
      </div>

      {/* ===== PROJECT GRID ===== */}
      <div className="main-content">
        <div className="projects-grid">

          {/* Card 1 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge">Completed</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Villa</span><span className="meta-location">📍 Dubai, UAE</span></div>
              <h4>Skyline Residence</h4>
              <p>Contemporary family villa with panoramic city views and open-plan living spaces.</p>
              <div className="project-card-footer">
                <span className="project-price">$1,250,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge orange">Under Progress</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Townhouse</span><span className="meta-location">📍 Abu Dhabi</span></div>
              <h4>Palm Grove Townhouse</h4>
              <p>A cluster of 6 modern townhouses nestled within a private gated community.</p>
              <div className="project-card-footer">
                <span className="project-price">$980,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge blue">Future Project</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Penthouse</span><span className="meta-location">📍 Palm Jumeirah</span></div>
              <h4>Coastal Penthouse</h4>
              <p>Luxury residential penthouse with floor-to-ceiling ocean views and private terrace.</p>
              <div className="project-card-footer">
                <span className="project-price">$6,200,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge">Completed</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Villa</span><span className="meta-location">📍 Sharjah</span></div>
              <h4>Garden Retreat Villa</h4>
              <p>Peaceful family home surrounded by lush landscaped gardens and water features.</p>
              <div className="project-card-footer">
                <span className="project-price">$890,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge orange">Under Progress</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Apartment</span><span className="meta-location">📍 Dubai Marina</span></div>
              <h4>Marina Heights Apartment</h4>
              <p>Upscale residential apartment with stunning marina views and premium finishes.</p>
              <div className="project-card-footer">
                <span className="project-price">$1,450,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge">Completed</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Eco Home</span><span className="meta-location">📍 Ras Al Khaimah</span></div>
              <h4>Green Echo House</h4>
              <p>Net-zero energy family home with solar panels, green roof and rainwater harvesting.</p>
              <div className="project-card-footer">
                <span className="project-price">$1,100,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 7 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge blue">Future Project</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Townhouse</span><span className="meta-location">📍 Jumeirah</span></div>
              <h4>Heritage Townhouse</h4>
              <p>Residential townhouse with subtle nods to traditional Arabian architectural motifs.</p>
              <div className="project-card-footer">
                <span className="project-price">$750,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 8 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge orange">Under Progress</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Villa</span><span className="meta-location">📍 Umm Suqeim</span></div>
              <h4>Dune View Villa</h4>
              <p>Spacious 5-bedroom family villa with private pool and desert landscape views.</p>
              <div className="project-card-footer">
                <span className="project-price">$2,300,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

          {/* Card 9 */}
          <div className="project-card">
            <div className="project-card-img">
              <span className="project-card-badge blue">Future Project</span>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="36" cy="42" r="16" fill="#1E3A8A" opacity="0.25"/>
                <polygon points="68,16 92,62 44,62" fill="#1E3A8A" opacity="0.25"/>
              </svg>
              <div className="project-card-overlay"></div>
            </div>
            <div className="project-card-body">
              <div className="project-card-meta"><span className="meta-tag">Apartment</span><span className="meta-location">📍 Fujairah Coast</span></div>
              <h4>Azure Beachfront Residences</h4>
              <p>Exclusive beachfront residential complex with private beach access and infinity pools.</p>
              <div className="project-card-footer">
                <span className="project-price">$3,800,000</span>
                <Link to="/project-details" className="project-link">View Project →</Link>
              </div>
            </div>
          </div>

        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button className="page-btn arrow">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn arrow">›</button>
        </div>
      </div>

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
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
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
          margin-top: 68px;
          position: relative; height: 380px; overflow: hidden;
          background: linear-gradient(135deg, #0f2460 0%, #1E3A8A 50%, #1a4fa0 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .hero-banner-bg-pattern {
          position: absolute; inset: 0; opacity: 0.05;
          background-image: repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%);
          background-size: 30px 30px;
        }
        .hero-banner-img {
          position: absolute; inset: 0; display:: center; justify flex; align-items-content: center;
        }
        .hero-banner-img svg { opacity: 0.2; }
        .hero-banner-content {
          position: relative; z-index: 2; text-align: center;
          animation: fadeInUp 0.8s ease both;
        }
        .hero-banner-content .tag {
          display: inline-block; background: rgba(6,182,212,0.15);
          border: 1px solid rgba(6,182,212,0.4); color: var(--cyan);
          font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 50px; margin-bottom: 18px;
        }
        .hero-banner-content h1 {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          color: var(--white); font-size: 2.8rem; line-height: 1.2; margin-bottom: 14px;
        }
        .hero-banner-content h1 span { color: var(--cyan); }
        .hero-banner-content p {
          color: rgba(255,255,255,0.7); font-size: 1rem; max-width: 500px;
        }

        .search-section {
          background: var(--white);
          padding: 0 60px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .search-bar {
          display: flex; gap: 12px; align-items: center;
          padding: 20px 0; flex-wrap: wrap;
        }
        .filter-dropdown {
          flex: 1; min-width: 140px; display: flex; align-items: center; gap: 10px;
          background: var(--gray-light); border-radius: 8px; padding: 11px 16px;
          cursor: pointer; transition: box-shadow 0.2s;
        }
        .filter-dropdown:hover { box-shadow: 0 0 0 2px var(--cyan); }
        .filter-icon { color: var(--cyan); font-size: 1rem; }
        .filter-dropdown select {
          border: none; background: transparent;
          font-family: 'Poppins', sans-serif; font-size: 0.85rem;
          color: var(--gray-dark); cursor: pointer; outline: none; flex: 1;
        }
        .search-btn {
          background: var(--cyan); color: var(--white); border: none;
          padding: 12px 36px; border-radius: 8px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.9rem;
          transition: background 0.2s, transform 0.2s; white-space: nowrap;
        }
        .search-btn:hover { background: var(--cyan-dark); transform: scale(1.04); }

        .filters-sort-row {
          background: var(--white); padding: 16px 60px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid #e5e7eb; flex-wrap: wrap; gap: 12px;
        }
        .filter-tags { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .filter-tag {
          background: var(--gray-light); border: 1px solid #e5e7eb;
          padding: 6px 16px; border-radius: 50px; font-size: 0.8rem;
          font-family: 'Poppins', sans-serif; color: var(--gray-mid); cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tag:hover, .filter-tag.active {
          background: var(--blue); color: var(--white); border-color: var(--blue);
        }
        .filter-tag.active-cyan {
          background: var(--cyan); color: var(--white); border-color: var(--cyan);
        }
        .results-sort { display: flex; align-items: center; gap: 16px; }
        .results-count { font-family: 'Poppins', sans-serif; font-size: 0.85rem; color: var(--gray-mid); }
        .results-count strong { color: var(--blue); }
        .sort-select {
          border: 1px solid #e5e7eb; background: var(--gray-light);
          padding: 8px 14px; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          color: var(--gray-dark); cursor: pointer; outline: none;
        }

        .main-content { padding: 40px 60px 80px; }

        .projects-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .project-card {
          background: var(--white); border-radius: 14px; overflow: hidden;
          box-shadow: var(--shadow); transition: transform 0.25s, box-shadow 0.25s;
          animation: fadeInUp 0.5s ease both;
        }
        .project-card:nth-child(1) { animation-delay: 0.05s; }
        .project-card:nth-child(2) { animation-delay: 0.1s; }
        .project-card:nth-child(3) { animation-delay: 0.15s; }
        .project-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

        .project-card-img {
          position: relative; height: 190px; overflow: hidden;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .project-card:nth-child(3n+2) .project-card-img {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        }
        .project-card:nth-child(3n+3) .project-card-img {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
        }
        .project-card-img svg { opacity: 0.35; transition: transform 0.35s; }
        .project-card:hover .project-card-img svg { transform: scale(1.08); }

        .project-card-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--cyan); color: white;
          font-family: 'Poppins', sans-serif; font-size: 0.7rem; font-weight: 600;
          padding: 4px 12px; border-radius: 50px; letter-spacing: 0.5px;
        }
        .project-card-badge.orange { background: var(--orange); }
        .project-card-badge.blue { background: var(--blue); }

        .project-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(30,58,138,0.55) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s;
        }
        .project-card:hover .project-card-overlay { opacity: 1; }

        .project-card-body { padding: 18px 20px 20px; }
        .project-card-meta {
          display: flex; gap: 12px; margin-bottom: 8px; align-items: center;
        }
        .meta-tag {
          font-size: 0.72rem; font-family: 'Poppins', sans-serif; font-weight: 500;
          color: var(--cyan); background: rgba(6,182,212,0.1);
          padding: 3px 10px; border-radius: 50px;
        }
        .meta-location {
          font-size: 0.75rem; color: var(--gray-mid); display: flex; align-items: center; gap: 4px;
        }
        .project-card-body h4 {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 1rem; color: var(--gray-dark); margin-bottom: 6px;
          transition: color 0.2s;
        }
        .project-card:hover .project-card-body h4 { color: var(--blue); }
        .project-card-body p {
          font-size: 0.8rem; color: var(--gray-mid); line-height: 1.6; margin-bottom: 14px;
        }
        .project-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid var(--gray-light); padding-top: 12px;
        }
        .project-price {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          color: var(--blue); font-size: 0.95rem;
        }
        .project-link {
          color: var(--cyan); font-size: 0.8rem; font-family: 'Poppins', sans-serif;
          font-weight: 600; text-decoration: none; transition: color 0.2s;
        }
        .project-link:hover { color: var(--cyan-dark); }

        .pagination {
          display: flex; justify-content: center; align-items: center;
          gap: 8px; margin-top: 48px;
        }
        .page-btn {
          width: 40px; height: 40px; border-radius: 8px; border: 1px solid #e5e7eb;
          background: var(--white); color: var(--gray-dark); font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .page-btn:hover { border-color: var(--cyan); color: var(--cyan); }
        .page-btn.active { background: var(--blue); color: white; border-color: var(--blue); }
        .page-btn.arrow { color: var(--gray-mid); font-size: 1rem; }
        .page-btn.arrow:hover { color: var(--cyan); border-color: var(--cyan); }

        footer {
          background: var(--blue); color: var(--white); padding: 50px 60px 24px;
        }
        .footer-main {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px;
          padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.15);
          align-items: start;
        }
        .footer-logo-txt {
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 1.5rem;
          color: white; margin-bottom: 12px;
        }
        .footer-logo-txt span { color: var(--cyan); }
        .footer-logo-block p { color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.7; }
        .footer-links-col h5, .footer-contact-col h5 {
          font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
          color: var(--cyan); margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
        }
        .footer-links-col a, .footer-links-col Link {
          display: block; color: rgba(255,255,255,0.7); text-decoration: none;
          font-size: 0.85rem; line-height: 2.4; transition: color 0.2s;
        }
        .footer-links-col a:hover, .footer-links-col Link:hover { color: white; text-decoration: underline; }
        .footer-contact-bar {
          background: rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .footer-contact-bar p { color: rgba(255,255,255,0.7); font-size: 0.83rem; line-height: 2; }
        .footer-bottom {
          margin-top: 24px; text-align: center;
          color: rgba(255,255,255,0.4); font-size: 0.78rem;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          nav, .search-section, .filters-sort-row, .main-content, footer { padding-left: 30px; padding-right: 30px; }
          .hero-banner-content h1 { font-size: 2.2rem; }
          .projects-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          nav { padding: 0 20px; }
          .nav-links, .nav-contact-btn { display: none; }
          .nav-hamburger { display: flex; }
          .hero-banner { height: 280px; }
          .hero-banner-content h1 { font-size: 1.6rem; }
          .search-section, .filters-sort-row, .main-content { padding-left: 16px; padding-right: 16px; }
          .search-bar { flex-direction: column; }
          .filter-dropdown { width: 100%; min-width: unset; }
          .projects-grid { grid-template-columns: 1fr; }
          .filters-sort-row { flex-direction: column; align-items: flex-start; }
          footer { padding: 40px 20px 20px; }
          .footer-main { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </>
  );
}

export default Projects;
