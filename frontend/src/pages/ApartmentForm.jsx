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

const ApartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    description: '',
    location: '',
    floor_area_sqft: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    status: 'available',
    is_approved: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      // Load projects list for the dropdown
      try {
        const projectsData = await apiProxy.get('/projects/');
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (e) {
        console.warn('Could not load projects list:', e.message);
        // Don't show error - just leave dropdown empty
      }

      // Load existing apartment data only when editing
      if (!isNew) {
        try {
          const apt = await apiProxy.get("/admin/apartments/" + id + "/");
          setFormData({
            title: apt.title || '',
            project: apt.project || '',
            description: apt.description || '',
            location: apt.location || '',
            floor_area_sqft: apt.floor_area_sqft || '',
            price: apt.price || '',
            bedrooms: apt.bedrooms || '',
            bathrooms: apt.bathrooms || '',
            status: apt.status || 'available',
            is_approved: apt.is_approved || false,
          });
          if (apt.image) {
            setImagePreview(apt.image);
          }
        } catch (e) {
          setError('Could not load apartment details: ' + e.message);
        }
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      const val = type === 'checkbox' ? checked : value;
      setFormData({ ...formData, [name]: val });
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      // Override with parsed values for backend satisfaction
      data.set('project', formData.project || '');
      data.set('price', parseFloat(formData.price) || 0);
      data.set('floor_area_sqft', parseFloat(formData.floor_area_sqft) || 0);
      data.set('bedrooms', parseInt(formData.bedrooms) || 0);
      data.set('bathrooms', parseInt(formData.bathrooms) || 0);

      // Append image file if selected
      if (imageFile) {
        data.append('image_file', imageFile);
      }

      if (isNew) {
        await apiProxy.post('/admin/apartments/', data);
      } else {
        await apiProxy.patch("/admin/apartments/" + id + "/", data);
      }
      setSuccess('Apartment saved successfully!');
      setTimeout(() => navigate('/admin/apartments'), 1000);
    } catch (e) {
      setError('Save failed: ' + e.message);
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
            {isNew ? 'Add New Apartment' : 'Edit Apartment'}
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Fill in all apartment details below</p>
        </div>
        <button
          onClick={() => navigate('/admin/apartments')}
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
          <Field label="Apartment Title *" hint="e.g. Mahim Tower - Unit 4B, Floor 8">
            <input style={inputStyle} name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Mahim Palace - Type A, Floor 5" required />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Project" hint="Which project does this apartment belong to?">
              <select style={inputStyle} name="project" value={formData.project} onChange={handleChange}>
                <option value="">-- No Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Location *" hint="Building address or area">
              <input style={inputStyle} name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bashundhara R/A, Dhaka" required />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Status *">
              <select style={inputStyle} name="status" value={formData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="sold">Sold</option>
              </select>
            </Field>
            <Field label="Approved for Public Listing">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <input
                  type="checkbox"
                  name="is_approved"
                  checked={formData.is_approved}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>
                  {formData.is_approved ? 'Yes — visible on public site' : 'No — hidden from public'}
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* Section: Specifications */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Specifications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Price (BDT) *">
              <input style={inputStyle} type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 8500000" required />
            </Field>
            <Field label="Floor Area (sqft) *">
              <input style={inputStyle} type="number" name="floor_area_sqft" value={formData.floor_area_sqft} onChange={handleChange} placeholder="e.g. 1250" required />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Bedrooms *">
              <input style={inputStyle} type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="e.g. 3" required />
            </Field>
            <Field label="Bathrooms *">
              <input style={inputStyle} type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g. 2" required />
            </Field>
          </div>
        </div>

        {/* Section: Description */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Description
          </h3>
          <Field label="Apartment Description *" hint="Describe the apartment — layout, finishes, view, floor, special features">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Spacious 3-bedroom apartment on the 8th floor with south-facing balcony. Features Italian marble flooring, modular kitchen, and panoramic city views..."
              required
            />
          </Field>
        </div>

        {/* Section: Image */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            Apartment Image
          </h3>
          <Field label="Upload Image" hint="Select a high-quality photo of the apartment">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="file"
                name="image_file"
                accept="image/*"
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  padding: '8px',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}
              />
              
              {imagePreview && (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e2e8f0' }}
                  />
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                    PREVIEW
                  </div>
                </div>
              )}
            </div>
          </Field>
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
            onClick={() => navigate('/admin/apartments')}
            style={{ padding: '14px 28px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#334155' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default ApartmentForm;
