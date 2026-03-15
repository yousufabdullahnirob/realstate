import React from 'react';

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
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">X</a>
            <a href="#">LinkedIn</a>
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
            <li>Mahim Palace 2: Bashundhara Royal Ascent</li>
            <li>Mahim Tower 2: Wari Signature Residence</li>
            <li>Mahim Shopping Mall: The Mugda Galleria</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Mahim Builders. All rights reserved.</div>
    </footer>
  );
};

export default Footer;

