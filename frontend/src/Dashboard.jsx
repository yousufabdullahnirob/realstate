import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/apartments/')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch apartments');
                return res.json();
            })
            .then(data => {
                setApartments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching apartments:", err);
                setError("Failed to load apartments. Please try again later.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading apartments...</div>;
    if (error) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#fff', padding: '15px 30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Mahim Builders</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {apartments.map(apt => (
                    <div key={apt.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <img src={apt.image} alt={apt.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 5px', color: '#2c3e50', fontSize: '20px' }}>{apt.title}</h3>
                            <p style={{ fontWeight: '700', color: '#27ae60', margin: '0 0 15px', fontSize: '18px' }}>${parseFloat(apt.price).toLocaleString()}/mo</p>
                            <p style={{ color: '#7f8c8d', fontSize: '15px', lineHeight: '1.5', margin: '0 0 20px' }}>{apt.description}</p>
                            <button style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseOver={e => e.target.style.background = '#2980b9'}
                                    onMouseOut={e => e.target.style.background = '#3498db'}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
