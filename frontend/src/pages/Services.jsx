import React, { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const services = [
  {
    id: "design",
    title: "Design & Planning",
    tagline: "We will help you to get the result you dreamed of.",
    icon: "📐",
    color: "#0ea5e9",
    description: "Our design and planning team brings together architects, urban planners, and interior designers to craft living spaces that perfectly balance aesthetics with functionality. From the very first sketch to final approval, we ensure every square foot is intentional.",
    features: [
      "Custom architectural blueprints tailored to Dhaka urban landscape",
      "Full 3D visualization before construction begins",
      "Space optimization for maximum livability",
      "Regulatory compliance with RAJUK and local authorities",
      "Sustainable design practices and eco-friendly materials",
    ],
    process: ["Initial Consultation", "Concept Design", "3D Visualization", "Final Blueprint Approval"],
  },
  {
    id: "solutions",
    title: "Custom Solutions",
    tagline: "Individual, aesthetically stunning solutions for every customer.",
    icon: "🏗️",
    color: "#8b5cf6",
    description: "No two families are alike — and neither should their homes be. Our custom solutions service lets you shape your apartment from the ground up, choosing layouts, finishes, and configurations that match your lifestyle perfectly.",
    features: [
      "Fully bespoke floor plan modifications",
      "Choice of premium finish packages (Standard, Premium, Luxury)",
      "Custom kitchen and bathroom configurations",
      "Smart home integration on request",
      "Dedicated personal consultant throughout the process",
    ],
    process: ["Needs Assessment", "Solution Design", "Material Selection", "Construction & Delivery"],
  },
  {
    id: "furniture",
    title: "Furniture & Decor",
    tagline: "We create and produce our own product design lines.",
    icon: "🛋️",
    color: "#10b981",
    description: "Move into a fully furnished, move-in-ready home. Our furniture and decor service partners with leading Bangladeshi and international brands to outfit your apartment with curated pieces that complement the architecture and your personal taste.",
    features: [
      "Full apartment furnishing packages available",
      "Collaboration with top Dhaka interior decor studios",
      "Custom furniture manufacturing for unique spaces",
      "Seasonal decor refresh programs for rental units",
      "Budget-conscious options without compromising style",
    ],
    process: ["Style Consultation", "Mood Board Creation", "Procurement", "Installation & Styling"],
  },
  {
    id: "exterior",
    title: "Exterior Design",
    tagline: "Facades that define the skyline and your property value.",
    icon: "🏢",
    color: "#f59e0b",
    description: "A building exterior is its first impression. Our exterior design team specializes in creating facades that are visually striking, weather-resistant, and suited to Bangladesh tropical climate — combining modern aesthetics with practical durability.",
    features: [
      "Climate-adaptive facade materials for Dhaka humidity and rain",
      "Landscape and garden design for ground-level spaces",
      "Rooftop terrace and common area design",
      "Exterior lighting plans for safety and ambiance",
      "Building signage and branding coordination",
    ],
    process: ["Site Analysis", "Facade Concept", "Material Sourcing", "Construction Supervision"],
  },
  {
    id: "concept",
    title: "Creating a Concept",
    tagline: "From vision to reality — we turn ideas into iconic spaces.",
    icon: "💡",
    color: "#ef4444",
    description: "Every great project starts with a bold idea. Our concept creation service works closely with developers and investors to turn raw land or an abstract vision into a fully realized residential project — with a clear identity, market positioning, and design direction.",
    features: [
      "Project identity and branding development",
      "Target demographic and market analysis",
      "Master planning for multi-building developments",
      "Investor presentation decks and feasibility reports",
      "Community amenity planning (gym, pool, mosque, parking)",
    ],
    process: ["Vision Workshop", "Market Research", "Concept Development", "Presentation & Sign-off"],
  },
  {
    id: "control",
    title: "Author Control",
    tagline: "We oversee every detail so nothing is left to chance.",
    icon: "🔍",
    color: "#06b6d4",
    description: "Quality does not happen by accident. Our author control service places a dedicated project supervisor on-site throughout construction, ensuring that every detail matches the approved design — from structural integrity to the finish on a door handle.",
    features: [
      "On-site project management and supervision",
      "Weekly progress reports with photo documentation",
      "Quality control at every construction milestone",
      "Vendor and contractor coordination",
      "Final punch-list walkthrough before handover",
    ],
    process: ["Project Kickoff", "On-Site Supervision", "Milestone Reviews", "Final Handover Inspection"],
  },
];

const ServiceCard = ({ service, index }) => {
  return (
    <motion.section
      id={service.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: 480,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      {/* Description panel */}
      <div style={{
        background: index % 2 === 0 ? service.color + "10" : "white",
        order: index % 2 === 0 ? 1 : 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px 56px",
        borderRight: index % 2 === 0 ? "1px solid #e2e8f0" : "none",
        borderLeft: index % 2 !== 0 ? "1px solid #e2e8f0" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: service.color + "18",
            border: "2px solid " + service.color + "30",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
          }}>{service.icon}</div>
          <span style={{
            fontSize: 13, fontWeight: 800, color: service.color,
            textTransform: "uppercase", letterSpacing: 2,
          }}>0{index + 1}</span>
        </div>

        <h2 style={{
          fontSize: 34, fontWeight: 800, color: "#0f172a",
          letterSpacing: -1, lineHeight: 1.15, marginBottom: 16,
        }}>{service.title}</h2>
        <p style={{ fontSize: 15, color: "#64748b", fontStyle: "italic", marginBottom: 20, fontWeight: 500 }}>
          {service.tagline}
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
          {service.description}
        </p>

        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Our Process
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {service.process.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  background: service.color, color: "white",
                  borderRadius: "50%", width: 20, height: 20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{step}</span>
                {i < service.process.length - 1 && (
                  <span style={{ color: "#cbd5e1", fontSize: 12 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features panel */}
      <div style={{
        background: index % 2 === 0 ? "white" : service.color + "10",
        order: index % 2 === 0 ? 2 : 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px 56px",
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 24 }}>
          What is Included
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {service.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 18px", borderRadius: 10,
                background: "white",
                border: "1.5px solid #e2e8f0",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: service.color + "18",
                border: "1.5px solid " + service.color + "30",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: service.color, fontSize: 11, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: "#334155", fontWeight: 500, lineHeight: 1.6 }}>{feature}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 28 }}>
          <Link
            to="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: service.color, color: "white",
              padding: "13px 26px", borderRadius: 10,
              fontWeight: 700, fontSize: 13, textDecoration: "none",
              boxShadow: "0 8px 24px " + service.color + "30",
            }}
          >
            Get a Quote for {service.title} →
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

const Services = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>

      {/* Hero Banner */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        padding: "100px 40px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 16 }}>
            What We Offer
          </p>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, marginBottom: 20, lineHeight: 1.1 }}>
            Our Services
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
            From concept to keys — every service you need to find, build, and move into your perfect home in Bangladesh.
          </p>

          {/* Quick nav pills */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", padding: "0 20px" }}>
            {services.map(s => (
              <a
                key={s.id}
                href={"#" + s.id}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  padding: "8px 18px", borderRadius: 50,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white", fontSize: 13, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s ease",
                }}
              >
                {s.icon} {s.title}
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Service Sections */}
      <div>
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <section style={{
        background: "#f8fafc", padding: "80px 40px",
        textAlign: "center", borderTop: "1px solid #e2e8f0",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 16, letterSpacing: -1 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Contact us today and let us discuss how we can bring your dream home to life.
          </p>
          <Link to="/contact" style={{
            background: "#0f172a", color: "white",
            padding: "16px 36px", borderRadius: 10,
            fontWeight: 700, fontSize: 15, textDecoration: "none",
            display: "inline-block",
          }}>
            Contact Us →
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Services;
