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
              {project.description && project.description.map((para, idx) => (
                <p key={idx} className="spotlight-desc">{para}</p>
              ))}

              <div className="project-highlights-box">
                <h4 className="highlights-title">Project Highlights</h4>
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <span className="highlight-label">Floors</span>
                    <span className="highlight-value">{project.total_floors || 'N/A'}</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-label">Units</span>
                    <span className="highlight-value">{project.total_units || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
