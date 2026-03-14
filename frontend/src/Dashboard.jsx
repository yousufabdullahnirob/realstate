import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadProjects, saveProjects } from './projectData';

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState(loadProjects);

    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    const handleViewDetails = (project) => {
        navigate('/project-details', { state: { project } });
    };

    const handleEditProject = (projectId) => {
        setProjects(current =>
            current.map(project =>
                project.id === projectId
                    ? {
                        ...project,
                        name: project.name.includes('(Edited)') ? project.name : `${project.name} (Edited)`
                    }
                    : project
            )
        );
    };

    const handleDeleteProject = (projectId) => {
        setProjects(current => current.filter(project => project.id !== projectId));
    };

    return (
        <div style={{ padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '15px 30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Mahim Builders</h1>
                <Link to="/projects" style={{ textDecoration: 'none', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', fontWeight: '600', color: '#374151', background: '#fff' }}>
                    Open Project Listing
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {projects.map(project => (
                    <div key={project.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <img src={project.image} alt={project.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 6px', color: '#2c3e50', fontSize: '20px' }}>{project.name}</h3>
                            <p style={{ color: '#7f8c8d', fontSize: '15px', lineHeight: '1.5', margin: '0 0 12px' }}>{project.shortDescription}</p>
                            <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#4b5563' }}><strong>Status:</strong> {project.status}</p>
                            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#4b5563' }}><strong>Created:</strong> {project.createdDate}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                                <button style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => handleViewDetails(project)}>
                                    View Details
                                </button>
                                <button style={{ padding: '10px', background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => handleEditProject(project.id)}>
                                    Edit
                                </button>
                                <button style={{ padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => handleDeleteProject(project.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
