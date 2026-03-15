import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const apartments = [
  { id: 1, title: '3 Bedroom Apartment', size: '1450 sqft', floor: 'Floor 5', price: '$120,000' },
  { id: 2, title: '2 Bedroom Apartment', size: '1100 sqft', floor: 'Floor 3', price: '$95,000' }
];

const ApartmentListing = () => {
  return (
    <div>
      <Header />
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
            <option>Price Range</option>
            <option>$50k - $80k</option>
            <option>$80k - $120k</option>
            <option>$120k+</option>
          </select>
          <button className="apt-search-btn">Search</button>
        </div>
      </section>
      <section className="apt-gallery">
        <div className="apt-grid">
          {apartments.map(apt => (
            <div key={apt.id} className="apt-card">
              <div className="apt-img"></div>
              <div className="apt-card-body">
                <h3>{apt.title}</h3>
                <div className="apt-meta">
                  <span>{apt.size}</span>
                  <span>{apt.floor}</span>
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
      <Footer />
    </div>
  );
};

export default ApartmentListing;

