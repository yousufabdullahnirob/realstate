import React from 'react';

const ApartmentDetails = () => {
  const thumbnails = [1,2,3,4]; // Placeholder for 4 thumbs

  return (
    <div>
      <section className="apt-detail-main">
        <div className="apt-detail-container">
          <div className="apt-detail-left">
            <div className="apt-main-img"></div>
            <div className="apt-thumb-row">
              {thumbnails.map((thumb, index) => (
                <div key={index} className="apt-thumb"></div>
              ))}
            </div>
          </div>
          <div className="apt-detail-right">
            <h1>3 Bedroom Luxury Apartment</h1>
            <div className="apt-price">$120,000</div>
            <div className="apt-specs">
              <div className="apt-spec">
                <span>Size</span>
                <strong>1450 sqft</strong>
              </div>
              <div className="apt-spec">
                <span>Bedrooms</span>
                <strong>3</strong>
              </div>
              <div className="apt-spec">
                <span>Bathrooms</span>
                <strong>2</strong>
              </div>
              <div className="apt-spec">
                <span>Floor</span>
                <strong>5</strong>
              </div>
            </div>
            <p className="apt-short-desc">
              A beautifully designed modern apartment located within a premium residential project,
              offering comfort, space and elegant architecture.
            </p>
            <button className="apt-contact-btn">Send Inquiry</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApartmentDetails;

