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
    const fetchProject = async () => {
      try {
        const data = await apiProxy.get(`/projects/${id}/`);
        setFormData({
          name: data.name,
          location: data.location,
          total_floors: data.total_floors,
          total_units: data.total_units,
          launch_date: data.launch_date,
          status: data.status,
          description: data.description,
          image_url: data.image || ''
        });
      } catch (error) {
        console.error("Fetch project failed:", error);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (id === 'new') {
        await apiProxy.post('/admin/projects/', payload);
      } else {
        await apiProxy.put(`/admin/projects/${id}/`, payload);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error("Save project failed:", error);
    } finally {
      setLoading(false);
    }
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
              <label>Total Floors</label>
              <input type="number" name="total_floors" value={formData.total_floors} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total Units</label>
              <input type="number" name="total_units" value={formData.total_units} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Launch Date</label>
              <input type="date" name="launch_date" value={formData.launch_date} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Project Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Project Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://unsplash.com/..." required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
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

