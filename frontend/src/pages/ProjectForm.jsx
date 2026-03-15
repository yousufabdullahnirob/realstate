import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    floors: '',
    units: '',
    sizeRange: '',
    completion: '',
    status: 'progress'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === 'new') return;
    // Load project data
    setFormData({
      name: 'Skyline Residency',
      location: 'Kaliganj, Dhaka',
      floors: '10',
      units: '40',
      sizeRange: '1200–1800 sqft',
      completion: '2027',
      status: 'progress'
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/admin/projects');
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-header">
          <h2>{id === 'new' ? 'Add New Project' : 'Edit Project'}</h2>
          <button className="back-btn" onClick={() => navigate('/admin/projects')}>
            ← Back to Projects
          </button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Floors</label>
              <input type="number" name="floors" value={formData.floors} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Units</label>
              <input type="number" name="units" value={formData.units} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Size Range</label>
              <input type="text" name="sizeRange" value={formData.sizeRange} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Completion Year</label>
              <input type="text" name="completion" value={formData.completion} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="future">Future</option>
              </select>
            </div>
          </div>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;

