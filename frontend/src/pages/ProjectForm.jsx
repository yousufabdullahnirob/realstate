import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </label>
    {hint && <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{hint}</p>}
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1.5px solid #e2e8f0',
  fontSize: 14,
  color: '#0f172a',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
};

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // isNew is true when on /admin/projects/new (id will be undefined)
  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    land_area: '',
    orientation: '',
    parking: '',
    handover_date: '',
    features: '',
    extra_description: '',
    total_floors: '',
    total_units: '',
    launch_date: '',
    status: 'upcoming',
    image_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isNew) return;
    const fetch = async () => {
      try {
        const data = await apiProxy.get("/admin/projects/" + id + "/");
        if (!data) return;
        setFormData({
          name: data.name || '',
          location: data.location || '',
          description: data.description || '',
          land_area: data.land_area || '',
          orientation: data.orientation || '',
          parking: data.parking || '',
          handover_date: data.handover_date || '',
          features: data.features || '',
          extra_description: data.extra_description || '',
          total_floors: data.total_floors || '',
          total_units: data.total_units || '',
          launch_date: data.launch_date || '',
          status: data.status || 'upcoming',
          image_url: data.image || '',
        });
      } catch (e) {
        setError('Failed to load project: ' + e.message);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Make sure numbers are actually numbers not strings
      const payload = {
        ...formData,
        total_floors: parseInt(formData.total_floors) || 0,
        total_units: parseInt(formData.total_units) || 0,
      };
      if (isNew) {
        await apiProxy.post('/admin/projects/', payload);
      } else {
        await apiProxy.patch("/admin/projects/" + id + "/", payload);
      }
      setSuccess('Project saved! Redirecting...');
      setTimeout(() => navigate('/admin/projects'), 1200);
    } catch (e) {
      setError('Could not save project: ' + e.message + '. Please check all required fields are filled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            {isNew ? 'Add New Project' : 'Edit Project'}
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Fill in all project details below</p>
        </div>
        <button
          onClick={() => navigate('/admin/projects')}
          style={{ padding: '9px 18px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#334155' }}
        >
          ← Back
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#991b1b', fontWeight: 600, fontSize: 13 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#166534', fontWeight: 600, fontSize: 13 }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Section: Basic Info */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Basic Information
          </h3>
          <Field label="Project Name *">
            <input style={inputStyle} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Mahim Tower 3" required />
          </Field>
          <Field label="Location *">
            <input style={inputStyle} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bashundhara R/A, Dhaka" required />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Status *">
              <select style={inputStyle} name="status" value={formData.status} onChange={handleChange}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
            <Field label="Launch Date *">
              <input style={inputStyle} type="date" name="launch_date" value={formData.launch_date} onChange={handleChange} required />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Total Floors *">
              <input style={inputStyle} type="number" name="total_floors" value={formData.total_floors} onChange={handleChange} placeholder="e.g. 12" required />
            </Field>
            <Field label="Total Units *">
              <input style={inputStyle} type="number" name="total_units" value={formData.total_units} onChange={handleChange} placeholder="e.g. 48" required />
            </Field>
          </div>
        </div>

        {/* Section: Project Details */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Project Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Land Area" hint="e.g. 5 katha, 3600 sqft">
              <input style={inputStyle} name="land_area" value={formData.land_area} onChange={handleChange} placeholder="e.g. 5 Katha" />
            </Field>
            <Field label="Orientation" hint="e.g. South facing, Corner plot">
              <input style={inputStyle} name="orientation" value={formData.orientation} onChange={handleChange} placeholder="e.g. South Facing" />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Parking" hint="e.g. 2 covered car spaces per unit">
              <input style={inputStyle} name="parking" value={formData.parking} onChange={handleChange} placeholder="e.g. 2 Car Spaces" />
            </Field>
            <Field label="Handover Date" hint="e.g. December 2026">
              <input style={inputStyle} name="handover_date" value={formData.handover_date} onChange={handleChange} placeholder="e.g. December 2026" />
            </Field>
          </div>
          <Field label="Features" hint="Enter comma-separated features, e.g: Swimming Pool, Gym, Generator, CCTV, Lift">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Swimming Pool, Gym, Generator Backup, CCTV, High-Speed Lift, Rooftop Garden"
            />
          </Field>
        </div>

        {/* Section: Descriptions */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Descriptions
          </h3>
          <Field label="Main Description *" hint="Shown on the project page — describe the project overview">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A premium residential project located in the heart of Dhaka..."
              required
            />
          </Field>
          <Field label="Extra Description" hint="Additional section shown below main description — e.g. highlights, selling points">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
              name="extra_description"
              value={formData.extra_description}
              onChange={handleChange}
              placeholder="Experience an incredible lifestyle with world-class amenities..."
            />
          </Field>
        </div>

        {/* Section: Image */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Project Image
          </h3>
          <Field label="Image URL" hint="Paste a direct image link (from Imgur, Google Drive, or any image host)">
            <input style={inputStyle} name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://i.imgur.com/yourimage.jpg" />
          </Field>
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              style={{ marginTop: 12, width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e2e8f0' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? '#94a3b8' : '#0f172a',
              color: 'white', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Done'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            style={{ padding: '14px 28px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#334155' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProjectForm;
