import React from 'react';
import { motion } from 'framer-motion';

const DesignShowcase = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '100px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '50px', textAlign: 'center' }}>Design Showcase (Themes 5-10)</h1>
        
        {/* Theme 5: Futurist Bento */}
        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>05. Futurist Bento</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 200px)', gap: '20px' }}>
            <motion.div 
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(51, 87, 255, 0.2)' }}
              style={{ gridColumn: 'span 2', gridRow: 'span 2', background: 'linear-gradient(135deg, #3357ff, #60a5fa)', borderRadius: '32px', color: 'white', padding: '40px' }}
            >
              <h3 style={{ fontSize: '2rem', margin: 0 }}>The Bento<br/>Paradigm</h3>
              <p style={{ marginTop: '20px', opacity: 0.8 }}>Modular layouts for the modern real-estate market.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} style={{ background: '#ff5733', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Projects</motion.div>
            <motion.div whileHover={{ scale: 1.05 }} style={{ background: '#33ff57', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Social</motion.div>
            <motion.div whileHover={{ scale: 1.05 }} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Contact</motion.div>
            <motion.div whileHover={{ scale: 1.05 }} style={{ background: '#000', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Admin</motion.div>
          </div>
        </section>

        {/* Theme 6: Neo-Brutalist Pop */}
        <section style={{ marginBottom: '100px', padding: '60px', borderRadius: '40px', background: '#facc15', border: '4px solid black', boxShadow: '20px 20px 0 0 black' }}>
          <h2 style={{ opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: 'black' }}>06. Neo-Brutalist Pop</h2>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ background: 'white', border: '4px solid black', padding: '40px', boxShadow: '10px 10px 0 0 black', flex: 1 }}>
              <h3 style={{ fontSize: '3rem', fontWeight: '900', margin: 0 }}>BOLD UNITS</h3>
              <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>Breaking the rules of traditional aesthetics.</p>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                style={{ background: '#ec4899', color: 'white', border: '4px solid black', padding: '20px 40px', fontWeight: '900', marginTop: '30px', cursor: 'pointer', boxShadow: '5px 5px 0 0 black' }}
              >
                EXPLORE NOW
              </motion.button>
            </div>
            <div style={{ flex: 1, fontSize: '10rem', fontWeight: '900', color: 'black', opacity: 0.1 }}>POP!</div>
          </div>
        </section>

        {/* Theme 8: Cyberpunk Edge */}
        <section style={{ marginBottom: '100px', background: '#0f172a', padding: '60px', borderRadius: '40px', border: '1px solid #22d3ee', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #22d3ee, #f0abfc)', animation: 'glitch 2s infinite' }}></div>
          <h2 style={{ opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#22d3ee' }}>08. Cyberpunk Edge</h2>
          <div style={{ border: '1px solid #22d3ee', padding: '40px', background: 'rgba(34, 211, 238, 0.05)' }}>
            <motion.h3 
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ fontSize: '3.5rem', color: '#f0abfc', margin: 0, textShadow: '2px 0 #22d3ee, -2px 0 #22d3ee' }}
            >
              VILLA.v01
            </motion.h3>
            <p style={{ color: '#22d3ee', fontSize: '1.2rem', marginTop: '10px', fontFamily: 'monospace' }}>SCANNING SECTOR [7]... ACCESS_GRANTED</p>
          </div>
        </section>

        {/* Theme 10: Swiss Precision */}
        <section style={{ background: 'white', padding: '60px', borderRadius: '40px' }}>
          <h2 style={{ opacity: 0.3, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '40px' }}>10. Swiss Precision</h2>
          <div style={{ display: 'flex', gap: '80px' }}>
            <div style={{ fontSize: '10rem', fontWeight: '900', lineHeight: 1, color: '#ef4444' }}>01</div>
            <div>
              <h3 style={{ fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase' }}>Structural Integrity</h3>
              <p style={{ fontSize: '1.2rem', color: '#64748b', marginTop: '20px', maxWidth: '500px', lineHeight: 1.6 }}>Architecture is the scientific mapping of space. We prioritize clarity, function, and geometric perfection in every project.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignShowcase;
