import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ApartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    price: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === 'new') return;
    // Load apartment data
    setFormData({
      name: '3 Bedroom Luxury Apt',
      project: 'Skyline Residency',
      price: '$120,000',
      size: '1450 sqft',
      bedrooms: '3',
      bathrooms: '2',
      floor: '5',
      status: 'available'
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/admin/apartments');
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-header">
          <h2>{id === 'new' ? 'Add New Apartment' : 'Edit Apartment'}</h2>
          <button className="back-btn" onClick={() => navigate('/admin/apartments')}>
            ← Back to Apartments
          </button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Apartment Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Project</label>
              <select name="project" value={formData.project} onChange={handleChange} required>
                <option>Skyline Residency</option>
                <option>Mahim Heights</option>
                <option>Green Valley Homes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="text" name="price" value={formData.price} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Size</label>
              <input type="text" name="size" value={formData.size} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Floor</label>
              <input type="number" name="floor" value={formData.floor} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Apartment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApartmentForm;

