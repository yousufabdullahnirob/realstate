import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/mahim_logo.png';
import mahim_bg from './assets/mahim_bg.png';

const Dashboard = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/apartments/')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch apartments');
                return res.json();
            })
            .then(data => {
                setApartments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching apartments:", err);
                setError("Failed to load apartments. Please try again later.");
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
            {/* ===== NAVBAR ===== */}
            <nav>
                <div className="nav-logo">
                <img src={logo} alt="Mahim Builders" style={{ height: '40px', marginRight: '10px' }} />
                Mahim <span>Builders</span>
                </div>
                <ul className="nav-links">
                <li><Link to="/" className="active">Home</Link></li>
                <li><Link to="/#search" >Search</Link></li>
                <li><Link to="/#about">About Us</Link></li>
                <li><Link to="/#projects">Projects</Link></li>
                <li><Link to="/#services">Services</Link></li>
                <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Poppins", sans-serif', fontSize: '0.88rem', color: 'var(--cyan)', fontWeight: '600', marginLeft: '20px' }}>Logout</button></li>
                </ul>
                <button className="nav-contact-btn">Contact Us</button>
                <div className="nav-hamburger"><span></span><span></span><span></span></div>
            </nav>

            {/* ===== HERO BANNER ===== */}
            <section className="hero-banner">
                <div className="hero-bg-pattern"></div>
                <div className="hero-banner-img">
                <img src={mahim_bg} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.4' }} />
                </div>
                <div className="hero-gradient"></div>
                <div className="hero-content" style={{ paddingBottom: '30px' }}>
                <div className="hero-content-left">
                    <h1>Find Your <span>Dream Home</span></h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '20px', fontFamily: '"Roboto", sans-serif' }}>
                        Discover the most luxurious and comfortable apartments built with the highest standards of quality and design in Cox's Bazar and beyond.
                    </p>
                    <div className="hero-badges">
                    <span className="hero-badge badge-status" style={{background: 'var(--cyan)'}}>Premium Quality</span>
                    <span className="hero-badge badge-year">Prime Locations</span>
                    </div>
                </div>
                </div>
            </section>

             {/* ===== MAIN CONTENT - APARTMENTS LIST ===== */}
             <section className="similar-section" id="projects" style={{ minHeight: '50vh' }}>
                <div className="sec-title">Available Residential Projects</div>
                
                {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Loading projects...</div>}
                {error && <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>}

                <div className="similar-grid">
                    {apartments.map((apt, index) => (
                        <div key={apt.id} className="sim-card">
                            <div className="sim-card-img" style={{ padding: 0 }}>
                                <span className="sim-badge" style={{background: index % 2 === 0 ? 'var(--cyan)' : 'var(--orange)'}}>
                                    {index % 2 === 0 ? 'Completed' : 'Under Progress'}
                                </span>
                                <img src={apt.image} alt={apt.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
                            </div>
                            <div className="sim-card-body">
                                <div className="sim-meta">📍 Cox Bazar &nbsp;·&nbsp; Apartment</div>
                                <h4>{apt.title}</h4>
                                <p style={{ height: '45px', overflow: 'hidden' }}>{apt.description.length > 80 ? apt.description.substring(0, 80) + '...' : apt.description}</p>
                                <div className="sim-footer">
                                    <span className="sim-price">${parseFloat(apt.price).toLocaleString()}</span>
                                    <Link to={`/project-details/${apt.id}`} className="sim-link">View Details →</Link>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    <Link to="/#about">About Us</Link>
                    <Link to="/#projects">Projects</Link>
                    <Link to="/#services">Services</Link>
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
                background: linear-gradient(135deg, rgba(15, 36, 96, 0.95) 0%, rgba(30, 58, 138, 0.8) 50%, rgba(26, 79, 160, 0.7) 100%), url(${mahim_bg});
                background-size: cover; background-position: center;
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
                .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,36,96,0.92) 0%, rgba(15,36,96,0.3) 55%, transparent 100%); }
                .hero-content {
                position: relative; z-index: 2; padding: 0 60px 50px;
                display: flex; justify-content: space-between; align-items: flex-end; width: 100%;
                }
                .hero-content h1 {
                font-family: 'Poppins', sans-serif; font-weight: 800;
                color: var(--white); font-size: 3.5rem; line-height: 1.15; margin-bottom: 14px;
                }
                .hero-content h1 span { color: var(--cyan); }
                .hero-badges { display: flex; gap: 10px; flex-wrap: wrap; }
                .hero-badge {
                padding: 6px 18px; border-radius: 50px; font-family: 'Poppins', sans-serif;
                font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px;
                }
                .badge-status { background: #22c55e; color: white; }
                .badge-year { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); }
                
                .similar-section { background: var(--white); padding: 70px 60px; }
                .similar-section .sec-title {
                font-family: 'Poppins', sans-serif; font-weight: 700;
                font-size: 1.6rem; color: var(--blue); margin-bottom: 30px;
                }
                .similar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
                .sim-card {
                background: var(--gray-light); border-radius: 12px; overflow: hidden;
                box-shadow: var(--shadow); transition: transform 0.25s, box-shadow 0.25s;
                }
                .sim-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
                .sim-card-img {
                height: 200px; display: flex; align-items: center; justify-content: center;
                position: relative;
                }
                .sim-badge {
                position: absolute; top: 10px; left: 10px;
                background: var(--cyan); color: white; font-family: 'Poppins', sans-serif;
                font-size: 0.68rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; z-index:10;
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

                @media (max-width: 768px) {
                nav { padding: 0 20px; }
                .nav-links, .nav-contact-btn { display: none; }
                .nav-hamburger { display: flex; }
                .hero-banner { height: 380px; }
                .hero-content { padding: 0 24px 36px; flex-direction: column; align-items: flex-start; gap: 20px; }
                .hero-content h1 { font-size: 2rem; }
                .similar-section { padding: 50px 20px; }
                footer { padding: 40px 20px 20px; }
                .footer-main { grid-template-columns: 1fr; gap: 28px; }
                }
            `}</style>
        </>
    );
};

export default Dashboard;
