import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h3 className="footer-logo">Mahim Builders</h3>
          <p className="footer-tagline">
            Premium properties with integrated interior and architectural design.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Registration & Membership</h4>
          <p><strong>RAJUK Reg. No:</strong><br />RAJUK/DC/REDMR-001330/25</p>
          <p><strong>REHAB Membership No:</strong><br />1649/2022</p>
        </div>
        <div className="footer-col">
          <h4>Contacts</h4>
          <p><strong>Head Office:</strong><br />Mahim Shopping Mall, 4 East Maniknagor, Mugdapara Dhaka-1203, Bangladesh</p>
          <p><strong>Center of Operations:</strong><br />House: 1015-1024, Road-7th Sarani & 47 Block-L, Bashundhara R/A, Dhaka-1229</p>
          <p>info@mahimbuilders.com<br />+880 1778 117 118</p>
        </div>
        <div className="footer-col">
          <h4>Ongoing Projects</h4>
          <ul className="footer-links">
            <li><Link to="/projects/4">Mahim Palace 2: Bashundhara Royal Ascent</Link></li>
            <li><Link to="/projects/2">Mahim Tower 2: Wari Signature Residence</Link></li>
            <li><Link to="/projects/3">Mahim Shopping Mall: The Mugda Galleria</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Mahim Builders. All rights reserved.</div>
    </footer>
  );
};

export default Footer;

