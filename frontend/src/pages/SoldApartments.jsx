import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";

const SoldApartments = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSold = async () => {
            try {
                const data = await apiProxy.get("/apartments/");
                // Filter for both booked and sold as per card requirements
                setUnits(data.filter(u => u.status === 'booked' || u.status === 'sold'));
            } catch (err) {
                console.error("Failed to fetch sold apartments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSold();
    }, []);

    if (loading) return <div style={{ padding: 40, color: "var(--text-muted)" }}>Loading units...</div>;

    return (
        <div style={{ padding: "32px 40px" }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.5 }}>Booked & Sold Units</h1>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Detailed list of all non-available transactions.</p>
            </div>

            <div className="preview-section glass">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Property Title</th>
                                <th>Project</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No booked or sold units found.</td></tr>
                            ) : (
                                units.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <span style={{ 
                                                padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                                                background: u.status === 'booked' ? '#fef3c7' : '#fee2e2',
                                                color: u.status === 'booked' ? '#92400e' : '#991b1b',
                                                border: `1.px solid ${u.status === 'booked' ? '#f59e0b' : '#fca5a5'}`
                                            }}>{u.status}</span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>{u.title}</td>
                                        <td>{u.project_name || '—'}</td>
                                        <td>{u.location}</td>
                                        <td style={{ fontWeight: 700, color: "var(--accent)" }}>{formatBDT(u.price)}</td>
                                        <td>{u.floor_area_sqft} sqft</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SoldApartments;
