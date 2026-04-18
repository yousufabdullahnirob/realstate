import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const fetchApartment = async () => {
    try {
      const data = await apiProxy.get(`/apartments/${id}/`);
      setApartment(DataAdapter.adaptApartment(data));
    } catch (error) {
      console.error("Error fetching apartment details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartment();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('access')) {
        alert("Please login to send inquiries.");
        navigate('/login');
        return;
    }
    setInquiryLoading(true);
    try {
        await apiProxy.post('/inquiries/submit/', {
            apartment: id,
            message: inquiryMessage
        });
        setInquirySuccess(true);
        setInquiryMessage("");
        setTimeout(() => {
            setShowInquiryModal(false);
            setInquirySuccess(false);
        }, 3000);
    } catch (err) {
        alert("Failed to send inquiry.");
    } finally {
        setInquiryLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!localStorage.getItem('access')) {
        alert("Please login to request a booking.");
        navigate('/login');
        return;
    }
    setBookingLoading(true);
    try {
        await apiProxy.post('/bookings/create/', {
            apartment: id,
            advance_amount: (apartment.price_raw * 0.1).toFixed(2) // Deposit 10% rounded to 2 decimals
        });
        alert("Booking request submitted! Check your dashboard for status.");
        navigate('/dashboard');
    } catch (err) {
        alert("Failed to create booking.");
    } finally {
        setBookingLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!localStorage.getItem('access')) {
        alert("Please login to use wishlist.");
        return;
    }
    try {
        await apiProxy.post('/favorites/toggle/', { apartment_id: id });
        alert("Wishlist updated!");
    } catch (err) {
        console.error("Favorite toggle error:", err);
    }
  };

  if (loading) return <div style={{ padding: '150px 0', textAlign: 'center' }}>Loading...</div>;

  if (!apartment) {
    return (
      <div style={{ padding: '150px 0', textAlign: 'center' }}>
        <h1>Apartment Not Found</h1>
        <button className="about-btn" onClick={() => navigate('/apartments')}>Back to Listings</button>
      </div>
    );
  }

  const specItems = [
    { label: 'Size', value: apartment.size },
    { label: 'Bedrooms', value: apartment.bedrooms },
    { label: 'Bathrooms', value: apartment.bathrooms },
    { label: 'Location', value: apartment.location },
  ];

  return (
    <div>
      <section className="apt-detail-main">
        <div className="apt-detail-container">
          <div className="apt-detail-left">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               whileHover="hover"
               className="apt-main-img" 
               style={{ 
                 backgroundImage: `url(${apartment.image})`, 
                 backgroundSize: 'cover', 
                 height: '400px', 
                 borderRadius: '24px',
                 position: 'relative',
                 overflow: 'hidden'
               }}
            >
              {/* Wallpaper overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))' }} />
              
              <div className="glass-premium" style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '10px 20px', borderRadius: '12px', zIndex: 10 }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Scale 1:100</span>
              </div>

              <button 
                onClick={handleToggleFavorite}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </motion.div>
          </div>
          <div className="apt-detail-right">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {apartment.title}
            </motion.h1>
            <motion.div 
              className="apt-price"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '2.5rem', color: 'var(--accent)', fontWeight: 800, margin: '20px 0' }}
            >
              {apartment.price}
            </motion.div>
            <div className="apt-specs">
              {specItems.map((spec, index) => (
                <motion.div 
                   key={spec.label} 
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 + (index * 0.1) }}
                   className="apt-spec"
                >
                  <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                  <strong style={{ display: 'block', fontSize: '1.1rem' }}>{spec.value}</strong>
                </motion.div>
              ))}
            </div>
            <motion.p 
              className="apt-short-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ lineHeight: 1.8, color: '#444', margin: '30px 0' }}
            >
              {apartment.description || "A beautifully designed modern apartment located within a premium residential project, offering comfort, space and elegant architecture."}
            </motion.p>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setShowInquiryModal(true)}
                   className="apt-contact-btn"
                   style={{ padding: '15px 30px', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}
                >
                   Send Inquiry
                </motion.button>
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleBooking}
                   disabled={bookingLoading}
                   className="apt-contact-btn animate-pulse-glow"
                   style={{ padding: '15px 40px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}
                >
                   {bookingLoading ? "Requesting..." : "Book Now"}
                </motion.button>
                <button 
                  onClick={handleToggleFavorite}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
            </div>

            {/* Inquiry Modal */}
            <AnimatePresence>
                {showInquiryModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                        onClick={() => setShowInquiryModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '500px', padding: '30px', background: '#fff', borderRadius: '20px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>Inquiry for {apartment.title}</h3>
                            {inquirySuccess ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ padding: '40px 0', textAlign: 'center' }}
                                >
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                                    <p style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Success!</p>
                                    <p style={{ color: '#64748b', marginTop: '8px' }}>Your inquiry has been sent to Mahim Builders!</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleInquiry}>
                                    <div className="form-group" style={{ margin: '20px 0' }}>
                                        <label>Your Message</label>
                                        <textarea 
                                            required 
                                            rows="5"
                                            value={inquiryMessage}
                                            onChange={e => setInquiryMessage(e.target.value)}
                                            placeholder="I am interested in this apartment. Please provide more details."
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '8px' }}
                                        ></textarea>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            type="submit" 
                                            disabled={inquiryLoading}
                                            className="contact-btn" 
                                            style={{ flex: 1, background: inquiryLoading ? '#94a3b8' : 'var(--primary)', cursor: inquiryLoading ? 'not-allowed' : 'pointer' }}
                                        >
                                            {inquiryLoading ? "Sending..." : "Submit Inquiry"}
                                        </button>
                                        <button type="button" className="about-btn" onClick={() => setShowInquiryModal(false)} style={{ flex: 1, background: '#f1f5f9' }}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetails;
