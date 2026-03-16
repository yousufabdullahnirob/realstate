import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate send
    setStatus('Thank you! Message sent successfully.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>Ready to discuss your project or have questions? We're here to help.</p>
        </div>
      </section>

      {/* Contact Container */}
      <section className="contact-container">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Info */}
            <div className="contact-info animate-slide-up">
              <h2>Contact Information</h2>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <p>Mahim Shopping Mall, 4 East Maniknagor, Mugdapara Dhaka-1203, Bangladesh</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <p>+880 1778 117 118</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <p>info@mahimbuilders.com</p>
              </div>
              <div className="contact-social">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrapper animate-slide-up">
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send Message</h2>
                {status && <div className="form-status">{status}</div>}
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="form-field animate-fade-in"
                  required 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="form-field animate-fade-in"
                  required 
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-field animate-fade-in"
                  required 
                />
                <textarea 
                  name="message" 
                  placeholder="Your Message" 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-field animate-fade-in"
                  required 
                ></textarea>
                <button type="submit" className="submit-btn animate-bounce-in">
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="contact-map">
        <div className="container">
          <h2>Our Location</h2>
          <div className="map-placeholder animate-scale-in">
            {/* Replace with Google Maps embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.123456789!2d90.123456789!3d23.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzI5LjIiTiA5MMKwMDcnMjkuMyJF!5e0!3m2!1sen!2sbd!4v1234567890" 
              width="100%" 
              height="400" 
              style={{border:0, borderRadius:'12px'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }
        .contact-hero h1 {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0;
          animation: fadeInUp 1s ease 0.2s forwards;
        }
        .contact-hero p {
          font-size: 20px;
          opacity: 0.95;
          animation: fadeInUp 1s ease 0.4s forwards;
        }
        .contact-container {
          padding: 100px 0;
          background: var(--bg-alt);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .contact-info h2 {
          font-size: 32px;
          margin-bottom: 30px;
          color: var(--primary);
        }
        .contact-item {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }
        .contact-item:hover {
          transform: translateY(-4px);
        }
        .contact-icon {
          font-size: 24px;
        }
        .contact-social {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .social-link {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        .social-link:hover {
          color: var(--primary);
        }
        .contact-form {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }
        .contact-form h2 {
          margin-bottom: 24px;
          color: var(--primary);
        }
        .form-field {
          width: 100%;
          padding: 16px;
          margin-bottom: 20px;
          border: 2px solid #e8f0f4;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }
        .form-field:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(95,148,179,0.1);
        }
        .form-field:hover {
          transform: translateY(-2px);
        }
        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .submit-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 32px rgba(29,65,83,0.4);
        }
        .form-status {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 8px;
          background: #d4edda;
          color: #155724;
          text-align: center;
        }
        .contact-map {
          padding: 100px 0;
          background: var(--bg-main);
        }
        .map-placeholder {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }
        .animate-slide-up:nth-child(1) { animation-delay: 0.2s; }
        .animate-slide-up:nth-child(2) { animation-delay: 0.4s; }
        .animate-fade-in { animation: fadeInUp 0.6s ease 0.6s forwards; }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

