import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.id === id);

  useEffect(() => {
    // If project not found in our data, we could redirect or show 404
    // For now, if it's one of the legacy ones not in data, just handle it gracefully
    if (!project && (id === 'mahim-tower-1' || id === 'mahim-tower-2')) {
       // This shouldn't happen with the data file present
    }
    window.scrollTo(0, 0);
  }, [project, id]);

  if (!project) {
    return (
      <div style={{ padding: '150px 0', textAlign: 'center' }}>
        <div className="container">
          <h1>Project Not Found</h1>
          <p>The project you are looking for does not exist in our featured list.</p>
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
              {project.description.map((para, idx) => (
                <p key={idx} className="spotlight-desc">{para}</p>
              ))}

              <div className="project-highlights-box">
                <h4 className="highlights-title">Project Highlights</h4>
                <div className="highlights-grid">
                  {Object.entries(project.highlights).map(([label, value]) => (
                    <div key={label} className="highlight-item">
                      <span className="highlight-label">{label}</span>
                      <span className="highlight-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.features && project.features.length > 0 && (
                <div className="project-features-box">
                  <h4 className="features-title">Project Features</h4>
                  <ul className="features-list">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {project.incredibleResult && (
            <div className="incredible-result-box">
              <h3 className="incredible-title">Incredible Result</h3>
              <p className="incredible-desc">{project.incredibleResult}</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
