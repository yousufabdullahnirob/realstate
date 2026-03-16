import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await apiProxy.get(`/projects/${id}/`);
        const allApartments = await apiProxy.get('/apartments/');
        
        setProject(DataAdapter.adaptProject(projectData));
        // Filter apartments that belong to this project
        const projectApartments = allApartments
          .filter(apt => apt.project === parseInt(id))
          .map(DataAdapter.adaptApartment);
        setApartments(projectApartments);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div style={{ padding: '150px 0', textAlign: 'center' }}>Loading...</div>;

  if (!project) {
    return (
      <div style={{ padding: '150px 0', textAlign: 'center' }}>
        <div className="container">
          <h1>Project Not Found</h1>
          <p>The project you are looking for does not exist.</p>
          <button className="about-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-wrapper">
      <section className="project-detail-hero" style={{ paddingTop: '120px', backgroundColor: '#fff' }}>
        <div className="container">

          <div className="featured-project-spotlight">
            <div className="spotlight-image-wrap">
              <img src={project.image} alt={project.name} className="spotlight-img" />
              <span className="spotlight-badge">{project.status}</span>
            </div>
            <div className="spotlight-content">
              <h3 className="spotlight-title">{project.name}</h3>
              <p className="spotlight-location">📍 {project.location}</p>
              
              <div className="description-section">
                {project.description && project.description.map((para, idx) => (
                  <p key={idx} className="spotlight-desc">{para}</p>
                ))}
              </div>

              <div className="project-highlights-box">
                <h4 className="highlights-title">Project Highlights</h4>
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <span className="highlight-label">Project Name</span>
                    <span className="highlight-value" style={{ textTransform: 'uppercase' }}>{project.name.split(':')[0]}</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">Land Area</span>
                    <span className="highlight-value">{project.land_area || 'N/A'}</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">Building Height</span>
                    <span className="highlight-value">G + {project.total_floors - 1} ({project.total_floors}-storied)</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">Total Apartments</span>
                    <span className="highlight-value">{project.total_units} Units</span>
                  </div>
                  {project.orientation && (
                    <div className="highlight-item">
                      <span className="highlight-label">Orientation</span>
                      <span className="highlight-value">{project.orientation}</span>
                    </div>
                  )}
                  {project.parking && (
                    <div className="highlight-item">
                      <span className="highlight-label">Parking</span>
                      <span className="highlight-value">{project.parking}</span>
                    </div>
                  )}
                  {project.handover_date && (
                    <div className="highlight-item">
                      <span className="highlight-label">Handover</span>
                      <span className="highlight-value">{project.handover_date}</span>
                    </div>
                  )}
                </div>
              </div>

              {project.features && project.features.length > 0 && (
                <div className="project-features-box" style={{ marginTop: '30px' }}>
                  <h4 className="highlights-title">Project Features</h4>
                  <ul className="features-list" style={{ columns: 2, listStyle: 'none', padding: 0 }}>
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="feature-item" style={{ marginBottom: '10px', color: '#555', fontSize: '0.95rem' }}>
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {project.extra_description && project.extra_description.length > 0 && (
            <div className="incredible-result-section" style={{ marginTop: '80px', padding: '60px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800', color: '#1a1a1a' }}>Incredible Result</h2>
              <div className="extra-desc-content">
                {project.extra_description.map((para, idx) => (
                  <p key={idx} style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>{para}</p>
                ))}
              </div>
            </div>
          )}

          <div className="apartments-under-project" style={{ marginTop: '60px' }}>
            <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Available Apartments in this Project</h2>
            {apartments.length > 0 ? (
              <div className="apartment-grid">
                {apartments.map((apt) => (
                  <div key={apt.id} className="apartment-card">
                    <div className="apartment-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover' }}></div>
                    <div className="apartment-body">
                      <h3>{apt.price}</h3>
                      <p>{apt.bedrooms} Bed • {apt.bathrooms} Bath • {apt.size}</p>
                      <span className="location">📍 {apt.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No apartments currently listed for this project.</p>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
