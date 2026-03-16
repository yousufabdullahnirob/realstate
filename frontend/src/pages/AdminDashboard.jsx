import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../admin.css";

const API_BASE = "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      const tokenHeaders = { headers: getAuthHeader() };

      try {
        const [projectsRes, apartmentsRes, bookingsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/projects/`, tokenHeaders),
          axios.get(`${API_BASE}/api/apartments/`),
          axios.get(`${API_BASE}/api/admin/bookings/`, tokenHeaders),
        ]);

        if (!isMounted) {
          return;
        }

        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setApartments(Array.isArray(apartmentsRes.data) ? apartmentsRes.data : []);
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      } catch {
        if (!isMounted) {
          return;
        }

        setProjects([
          { id: 1, name: "Green Valley Residence", location: "Dhaka" },
          { id: 2, name: "Lake View Towers", location: "Gulshan" },
          { id: 3, name: "Skyline Heights", location: "Banani" },
        ]);
        setApartments([
          { id: 1, title: "Green Valley Unit 101" },
          { id: 2, title: "Lake View Unit 203" },
        ]);
        setBookings([
          { id: 1, apartment_title: "Apt 5A", status: "confirmed", tenant_name: "Rahim Khan" },
          { id: 2, apartment_title: "Apt 9C", status: "pending", tenant_name: "Nusrat Jahan" },
        ]);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const bookedCount = bookings.filter((booking) => booking.status !== "cancelled").length;
    const availableCount = Math.max(apartments.length - bookedCount, 0);

    return [
      { label: "Total Projects", value: String(projects.length) },
      { label: "Total Apartments", value: String(apartments.length) },
      { label: "Available Units", value: String(availableCount) },
      { label: "Booked Units", value: String(bookedCount) },
    ];
  }, [apartments.length, bookings, projects.length]);

  const recentProjects = useMemo(() => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ];

    return projects.slice(0, 3).map((project, index) => ({
      name: project.name,
      location: project.location,
      img: fallbackImages[index % fallbackImages.length],
    }));
  }, [projects]);

  const bookingPreviewItems = useMemo(() => (
    bookings.slice(0, 2).map((booking) => ({
      name: booking.apartment_title || booking.apartment || "Booking",
      status: (booking.status || "pending").toUpperCase(),
      statusClass: booking.status === "confirmed" ? "completed" : booking.status === "cancelled" ? "booked" : "ongoing",
    }))
  ), [bookings]);

  const apartmentPreviewItems = useMemo(() => (
    apartments.slice(0, 2).map((apartment) => ({
      name: apartment.title,
      status: "AVAILABLE",
      statusClass: "available",
    }))
  ), [apartments]);

  const previewCards = [
    {
      title: "Booking Preview",
      link: "/admin/bookings",
      items: bookingPreviewItems.length > 0 ? bookingPreviewItems : [
        { name: "No bookings", status: "--", statusClass: "ongoing" },
      ],
      cardClass: "booking-preview",
    },
    {
      title: "Inquiry Preview",
      link: "/admin/inquiries",
      items: [
        { name: "Rahim Khan", status: "NEW", statusClass: "available" },
        { name: "Nusrat Jahan", status: "FOLLOW UP", statusClass: "ongoing" },
      ],
      cardClass: "inquiry-preview",
    },
    {
      title: "Apartment Preview",
      link: "/admin/apartments",
      items: apartmentPreviewItems.length > 0 ? apartmentPreviewItems : [
        { name: "No apartments", status: "--", statusClass: "available" },
      ],
      cardClass: "apartment-preview",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* KPI STATS */}
      <section className="stats">
        {stats.map((item, index) => (
          <div className={`stat-card stat-card-${index + 1}`} key={item.label}>
            <span className="stat-tag">OVERVIEW</span>
            <h4>{item.label}</h4>
            <p>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="preview-section">
        <div className="section-header">
          <h3>Recent Projects</h3>
          <a href="/admin/projects" className="manage-btn">Manage</a>
        </div>

        <div className="preview-gallery">
          {recentProjects.map((project, index) => (
            <div className="gallery-tile" key={index}>
              <div className="gallery-img" style={{ backgroundImage: `url(${project.img})` }}></div>
              <div className="gallery-info">
                <h4>{project.name}</h4>
                <p>{project.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mini-preview-grid">
        {previewCards.map((card) => (
          <div className={`mini-preview-card ${card.cardClass}`} key={card.title}>
            <div className="mini-preview-head">
              <span className="mini-tag">PREVIEW</span>
              <a href={card.link} className="manage-btn">Manage</a>
            </div>
            <h3>{card.title}</h3>

            <div className="mini-preview-list">
              {card.items.map((item) => (
                <div className="mini-preview-item" key={`${card.title}-${item.name}`}>
                  <span className="item-name">{item.name}</span>
                  <span className={`status ${item.statusClass.toLowerCase()}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;