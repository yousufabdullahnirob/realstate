import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProjects, saveProjects } from './projectData';

function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState(loadProjects);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortOption, setSortOption] = useState('A to Z');
    const [searchText, setSearchText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    const handleViewDetails = (project) => {
        navigate('/project-details', { state: { project } });
    };

    const handleSearch = () => {
        setSearchTerm(searchText.trim());
    };

    const getProjectName = (project) => (project?.name || '').toString().toLowerCase();

    const getProjectDateValue = (project) => {
        const parsedDate = Date.parse(project?.createdDate || '');
        return Number.isNaN(parsedDate) ? 0 : parsedDate;
    };

    const filteredProjects = projects
        .filter((project) => {
            const areaMatch = !selectedArea || project.area === selectedArea;
            const statusMatch = selectedStatus === 'All' || project.status === selectedStatus;
            const text = `${project.name} ${project.shortDescription} ${project.area} ${project.status} ${project.createdDate}`.toLowerCase();
            const searchMatch = !searchTerm || text.includes(searchTerm.toLowerCase());
            return areaMatch && statusMatch && searchMatch;
        })
        .sort((firstProject, secondProject) => {
            if (sortOption === 'A to Z') {
                return getProjectName(firstProject).localeCompare(getProjectName(secondProject));
            }
            if (sortOption === 'Newest') {
                return getProjectDateValue(secondProject) - getProjectDateValue(firstProject);
            }
            if (sortOption === 'Oldest') {
                return getProjectDateValue(firstProject) - getProjectDateValue(secondProject);
            }
            return 0;
        });

    return (
        <div style={{ padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '15px 30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Project Listing</h1>
            </header>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '22px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {['All', 'Completed', 'Under Progress', 'Future Project'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: selectedStatus === status ? '1px solid #2563eb' : '1px solid #d1d5db',
                                background: selectedStatus === status ? '#2563eb' : '#fff',
                                color: selectedStatus === status ? '#fff' : '#111827',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <select
                        value={selectedArea}
                        onChange={(event) => setSelectedArea(event.target.value)}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minWidth: '210px', background: '#fff' }}
                    >
                        <option value="">Area</option>
                        <option value="Garden">Garden</option>
                        <option value="Coastal">Coastal</option>
                        <option value="Urban">Urban</option>
                        <option value="Suburban">Suburban</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minWidth: '170px', background: '#fff' }}
                    >
                        <option value="A to Z">Filter: A to Z</option>
                        <option value="Newest">Filter: Newest</option>
                        <option value="Oldest">Filter: Oldest</option>
                    </select>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                        placeholder="Search projects..."
                        style={{ flex: '1 1 260px', minWidth: '240px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#111827', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {filteredProjects.map(project => (
                    <div key={project.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <img src={project.image} alt={project.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 6px', color: '#2c3e50', fontSize: '20px' }}>{project.name}</h3>
                            <p style={{ color: '#7f8c8d', fontSize: '15px', lineHeight: '1.5', margin: '0 0 12px' }}>{project.shortDescription}</p>
                            <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#4b5563' }}><strong>Area:</strong> {project.area}</p>
                            <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#4b5563' }}><strong>Status:</strong> {project.status}</p>
                            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#4b5563' }}><strong>Created:</strong> {project.createdDate}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                <button style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                        onClick={() => handleViewDetails(project)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ marginTop: '20px', background: '#fff', borderRadius: '12px', padding: '18px', textAlign: 'center', color: '#6b7280', fontWeight: '500' }}>
                    No projects found for this filter/search.
                </div>
            )}
        </div>
    );
}

export default Projects;
