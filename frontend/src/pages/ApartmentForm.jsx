import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';

const ApartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    price: '',
    floor_area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    status: 'available',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const projectsData = await apiProxy.get('/projects/');
        setProjects(projectsData);

        if (id !== 'new') {
          const aptData = await apiProxy.get(`/apartments/${id}/`);
          setFormData({
            ...aptData,
            image_url: aptData.image || ''
          });
        }
      } catch (error) {
        console.error("Initial data fetch failed:", error);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id === 'new') {
        await apiProxy.post('/apartments/', formData);
      } else {
        // Assuming update via POST for now if PUT is not in proxy, but properly it should be PUT
        await apiProxy.post(`/apartments/${id}/`, formData);
      }
      navigate('/admin/apartments');
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <h2>{id === 'new' ? 'Add New Apartment' : 'Edit Apartment'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Project</label>
            <select name="project" value={formData.project} onChange={handleChange} required>
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (BDT)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Area (sqft)</label>
              <input type="number" name="floor_area_sqft" value={formData.floor_area_sqft} onChange={handleChange} required />
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
              <label>Location</label>
              <input name="location" value={formData.location} onChange={handleChange} required />
            </div>
          <div className="form-group">
            <label>Apartment Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://unsplash.com/..." required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          </div>
          <button type="submit" className="save-btn" disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Saving...' : 'Save Apartment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApartmentForm;

