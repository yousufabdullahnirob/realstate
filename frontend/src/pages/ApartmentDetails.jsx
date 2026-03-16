import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const data = await apiProxy.get(`/apartments/`); // Fetching all for now and filtering to find the correct one or using a detail endpoint if exists
        const found = data.find(a => a.id === parseInt(id));
        if (found) {
          setApartment(DataAdapter.adaptApartment(found));
        }
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id]);

  if (loading) return <div style={{ padding: '150px 0', textAlign: 'center' }}>Loading...</div>;

  if (!apartment) {
    return (
      <div style={{ padding: '150px 0', textAlign: 'center' }}>
        <h1>Apartment Not Found</h1>
        <button className="about-btn" onClick={() => navigate('/apartments')}>Back to Listings</button>
      </div>
    );
  }

  return (
    <div>
      <section className="apt-detail-main">
        <div className="apt-detail-container">
          <div className="apt-detail-left">
            <div className="apt-main-img" style={{ backgroundImage: `url(${apartment.image})`, backgroundSize: 'cover', height: '400px' }}></div>
            <div className="apt-thumb-row">
              <div className="apt-thumb" style={{ backgroundImage: `url(${apartment.image})`, backgroundSize: 'cover' }}></div>
            </div>
          </div>
          <div className="apt-detail-right">
            <h1>{apartment.title}</h1>
            <div className="apt-price">{apartment.price}</div>
            <div className="apt-specs">
              <div className="apt-spec">
                <span>Size</span>
                <strong>{apartment.size}</strong>
              </div>
              <div className="apt-spec">
                <span>Bedrooms</span>
                <strong>{apartment.bedrooms}</strong>
              </div>
              <div className="apt-spec">
                <span>Bathrooms</span>
                <strong>{apartment.bathrooms}</strong>
              </div>
              <div className="apt-spec">
                <span>Location</span>
                <strong>{apartment.location}</strong>
              </div>
            </div>
            <p className="apt-short-desc">
              {apartment.description || "A beautifully designed modern apartment located within a premium residential project, offering comfort, space and elegant architecture."}
            </p>
            <button className="apt-contact-btn">Send Inquiry</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetails;
