import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ApartmentListing = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await apiProxy.get('/apartments/');
        setApartments(data.map(DataAdapter.adaptApartment));
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div>
      <section className="apt-hero">
        <h1>Available Apartments</h1>
        <p>Find the perfect apartment within this project.</p>
      </section>
      <section className="apt-intro">
        <h2>Your dream space is waiting</h2>
        <p>
          Browse through beautifully designed apartments built with comfort,
          modern architecture, and quality living in mind.
        </p>
      </section>
      <section className="apt-filter-section">
        <div className="apt-filters">
          <select>
            <option>Bedrooms</option>
            <option>1 Bedroom</option>
            <option>2 Bedrooms</option>
            <option>3 Bedrooms</option>
          </select>
          <select>
            <option>Size</option>
            <option>800 - 1000 sqft</option>
            <option>1000 - 1400 sqft</option>
            <option>1400+ sqft</option>
          </select>
          <select>
            <option>Price Range (BDT)</option>
            <option>5,000,000 - 10,000,000</option>
            <option>10,000,000 - 15,000,000</option>
            <option>15,000,000+</option>
          </select>
          <button className="apt-search-btn">Search</button>
        </div>
      </section>
      <section className="apt-gallery">
        <div className="apt-grid">
          {loading ? <p>Loading apartments...</p> : apartments.map(apt => (
            <div key={apt.id} className="apt-card">
              <div className="apt-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover' }}></div>
              <div className="apt-card-body">
                <h3>{apt.title}</h3>
                <div className="apt-meta">
                  <span>{apt.size}</span>
                  <span>{apt.bedrooms} Bed</span>
                </div>
                <div className="apt-card-footer">
                  <span className="apt-price">{apt.price}</span>
                  <Link to={`/apartments/${apt.id}`} className="apt-link">View Details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApartmentListing;
