import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="container" style={{ paddingTop: '100px' }}>
          <h1>Project Not Found</h1>
          <p>The project you are looking for does not exist.</p>
          <button className="about-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="project-detail-wrapper"
    >
      <section className="project-detail-hero" style={{ paddingTop: '120px', backgroundColor: '#fff' }}>
        <div className="container">

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="featured-project-spotlight"
          >
            <div className="spotlight-image-wrap">
              <motion.img 
                src={project.image} 
                alt={project.name} 
                className="spotlight-img"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <span className="spotlight-badge">{project.status}</span>
            </div>
            <div className="spotlight-content">
              <motion.h3 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="spotlight-title"
              >{project.name}</motion.h3>
              <p className="spotlight-location">📍 {project.location}</p>
              
              <div className="description-section">
                {project.description && project.description.map((para, idx) => (
                  <p key={idx} className="spotlight-desc">{para}</p>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="project-highlights-box"
              >
                <h4 className="highlights-title">Project Highlights</h4>
                <div className="highlights-grid">
                  {[
                    { label: 'Project Name', value: project.name.split(':')[0] },
                    { label: 'Land Area', value: project.land_area || 'N/A' },
                    { label: 'Building Height', value: `G + ${project.total_floors - 1} (${project.total_floors}-storied)` },
                    { label: 'Total Apartments', value: `${project.total_units} Units` },
                    { label: 'Orientation', value: project.orientation },
                    { label: 'Parking', value: project.parking },
                    { label: 'Handover', value: project.handover_date }
                  ].filter(h => h.value).map((h, i) => (
                    <motion.div 
                      key={h.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.05) }}
                      className="highlight-item"
                    >
                      <span className="highlight-label">{h.label}</span>
                      <span className="highlight-value" style={{ textTransform: 'uppercase' }}>{h.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {project.features && project.features.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="project-features-box" 
                  style={{ marginTop: '30px' }}
                >
                  <h4 className="highlights-title">Project Features</h4>
                  <ul className="features-list" style={{ columns: 2, listStyle: 'none', padding: 0 }}>
                    {project.features.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                        className="feature-item" 
                        style={{ marginBottom: '10px', color: '#555', fontSize: '0.95rem' }}
                      >
                        ✅ {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>

          {project.extra_description && project.extra_description.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="incredible-result-section" 
              style={{ marginTop: '80px', padding: '60px', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.05)', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
            >
              <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800', color: '#1a1a1a' }}>Incredible Result</h2>
              <div className="extra-desc-content">
                {project.extra_description.map((para, idx) => (
                  <p key={idx} style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>{para}</p>
                ))}
              </div>
            </motion.div>
          )}

          <div className="apartments-under-project" style={{ marginTop: '60px' }}>
            <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Available Apartments in this Project</h2>
            {apartments.length > 0 ? (
              <motion.div 
                className="apartment-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
              >
                {apartments.map((apt) => (
                  <motion.div 
                    key={apt.id} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="apartment-card"
                  >
                    <div className="apartment-img" style={{ backgroundImage: `url(${apt.image})`, backgroundSize: 'cover' }}></div>
                    <div className="apartment-body">
                      <h3>{apt.price}</h3>
                      <p>{apt.bedrooms} Bed • {apt.bathrooms} Bath • {apt.size}</p>
                      <span className="location">📍 {apt.location}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p>No apartments currently listed for this project.</p>
            )}
          </div>

        </div>
      </section>
    </motion.div>
  );
};

export default ProjectDetails;
