import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer style={{
      background: '#0c0f14',
      color: '#e2e8f0',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle top accent line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #b8973a, #d4af5a, #b8973a, transparent)',
      }} />

      {/* Decorative background orbs */}
      <div style={{
        position: 'absolute', top: 0, left: '10%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(184,151,58,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: '5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main footer body */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 40px 48px', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1.4fr 1.2fr',
          gap: 60,
        }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontSize: 26, fontWeight: 800, color: '#ffffff',
                letterSpacing: -0.5,
              }}>Mahim Builders</span>
              <div style={{ width: 32, height: 2, background: '#b8973a', marginTop: 8, borderRadius: 2 }} />
            </div>
            <p style={{
              color: '#8b949e', fontSize: 14, lineHeight: 1.8,
              marginBottom: 28, maxWidth: 280,
            }}>
              Premium properties with integrated interior and architectural design — crafted for Bangladesh's discerning homeowners since 2010.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'f', href: 'https://facebook.com', title: 'Facebook' },
                { label: 'in', href: 'https://instagram.com', title: 'Instagram' },
                { label: 'X', href: 'https://twitter.com', title: 'X / Twitter' },
                { label: 'li', href: 'https://linkedin.com', title: 'LinkedIn' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8b949e', fontSize: 11, fontWeight: 800,
                    textDecoration: 'none', letterSpacing: 0,
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#b8973a';
                    e.currentTarget.style.borderColor = '#b8973a';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#8b949e';
                  }}
                >{s.label}</a>
              ))}
            </div>
          </div>

          {/* Col 2 — Credentials */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase', color: '#b8973a',
              marginBottom: 20,
            }}>Credentials</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ fontSize: 10, color: '#b8973a', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>RAJUK Reg.</p>
                <p style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, lineHeight: 1.5 }}>RAJUK/DC/REDMR-001330/25</p>
              </div>
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ fontSize: 10, color: '#b8973a', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>REHAB Member</p>
                <p style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>No. 1649/2022</p>
              </div>
            </div>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase', color: '#b8973a',
              marginBottom: 20,
            }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📍', label: 'Head Office', value: 'Mahim Shopping Mall, 4 East Maniknagor, Mugdapara, Dhaka-1203' },
                { icon: '🏢', label: 'Operations', value: 'House 1015–1024, Road 7th Sarani & 47, Block-L, Bashundhara R/A, Dhaka-1229' },
                { icon: '✉️', label: 'Email', value: 'info@mahimbuilders.com' },
                { icon: '📞', label: 'Phone', value: '+880 1778 117 118' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4 — Projects + Nav */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase', color: '#b8973a',
              marginBottom: 20,
            }}>Ongoing Projects</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {[
                'Mahim Palace 2: Bashundhara Royal Ascent',
                'Mahim Tower 2: Wari Signature Residence',
                'Mahim Shopping Mall: The Mugda Galleria',
              ].map(project => (
                <Link
                  key={project}
                  to="/projects"
                  style={{
                    fontSize: 13, color: '#64748b', textDecoration: 'none',
                    lineHeight: 1.5, fontWeight: 500,
                    paddingLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.2s ease',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#b8973a';
                    e.currentTarget.style.borderLeftColor = '#b8973a';
                    e.currentTarget.style.paddingLeft = '16px';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.paddingLeft = '12px';
                  }}
                >{project}</Link>
              ))}
            </div>

            <h4 style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase', color: '#b8973a',
              marginBottom: 14,
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                ['Home', '/'], ['Projects', '/projects'],
                ['Apartments', '/apartments'], ['Services', '/services'],
                ['About', '/about'], ['Contact', '/contact'],
              ].map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    fontSize: 12, color: '#64748b', textDecoration: 'none',
                    padding: '4px 10px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontWeight: 600, transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(184,151,58,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(184,151,58,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
          © 2026 Mahim Builders Ltd. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#" style={{
              fontSize: 12, color: '#475569', textDecoration: 'none',
              fontWeight: 500, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#b8973a'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
