import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/Logo.svg';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Beranda',      path: '/' },
    { label: 'Kios Nelayan', path: '/kios' },
    { label: 'Lokasi TPS',   path: '/tps' },
    { label: 'Edukasi',      path: '/edukasi' },
    { label: 'Tentang Kami', path: '/tentang' },
  ],
  Akun: [
    { label: 'Daftar Nelayan', path: '/register' },
    { label: 'Daftarkan TPS',  path: '/register' },
    { label: 'Masuk',          path: '/login' },
  ],
  Legal: [
    { label: 'Kebijakan Privasi',  path: '/privacy' },
    { label: 'Syarat & Ketentuan', path: '/terms' },
    { label: 'Kebijakan Cookie',   path: '/cookies' },
  ],
};

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconWhatsapp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function IconEmail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}
function IconLocation() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );
}

const SOCIAL = [
  { Icon: IconInstagram, href: '#', label: 'Instagram', hoverColor: '#E1306C' },
  { Icon: IconWhatsapp,  href: '#', label: 'WhatsApp',  hoverColor: '#25D366' },
  { Icon: IconFacebook,  href: '#', label: 'Facebook',  hoverColor: '#1877F2' },
];

const CONTACT = [
  { Icon: IconEmail,    label: 'Email',   value: 'halo@oceanearn.id' },
  { Icon: IconLocation, label: 'Kantor',  value: 'Bandung, Jawa Barat' },
  { Icon: IconClock,    label: 'Support', value: 'Senin–Jumat, 08.00–17.00 WIB' },
];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <section className="w-full" style={{
      background: 'linear-gradient(0deg, var(--darkBlue-800) 0%, var(--grey-blue) 50%, #FFF 100%)',
      padding: '80px 62px 60px',
    }}>
      <div style={{
        maxWidth: '1796px', margin: '0 auto',
        borderRadius: '20px', border: '1px solid var(--orange-500)',
        background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: '64px 80px',
      }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '56px', marginBottom: '56px' }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={logo} alt="OceanEarn" style={{
                height: '38px',
                filter: 'drop-shadow(-3px 0 6px rgba(4,96,217,0.65)) drop-shadow(3px 0 6px rgba(217,121,37,0.65))',
              }}/>
              <span className="font-title font-bold" style={{ fontSize: '26px', lineHeight: 1 }}>
                <span className="text-darkBlue-800">Ocean</span>{' '}
                <span className="text-orange-500">Earn</span>
              </span>
            </div>

            <p className="font-body m-0" style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(0,0,0,0.60)', maxWidth: '270px' }}>
              Platform digital yang mengubah sampah laut menjadi nilai ekonomi nyata. Bersama nelayan pesisir Indonesia menuju laut lebih bersih dan kehidupan lebih sejahtera.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              {SOCIAL.map(({ Icon, href, label, hoverColor }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    border: '1px solid rgba(217,121,37,0.30)',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--orange-500)', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.borderColor = hoverColor;
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.boxShadow = `0 0 10px ${hoverColor}44`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--orange-500)';
                    e.currentTarget.style.borderColor = 'rgba(217,121,37,0.30)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                  <Icon/>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="font-ui font-bold text-darkBlue-800 m-0" style={{ fontSize: '15px', letterSpacing: '0.02em' }}>
                {title}
              </h4>
              <div style={{ width: '24px', height: '2px', background: 'var(--orange-500)', borderRadius: '2px', marginTop: '-4px', marginBottom: '4px' }}/>
              {links.map(({ label, path }) => (
                <span key={label} onClick={() => navigate(path)}
                  className="font-ui cursor-pointer"
                  style={{ fontSize: '14px', color: 'rgba(0,0,0,0.55)', transition: 'color 0.2s, padding-left 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--orange-500)'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.55)'; e.currentTarget.style.paddingLeft = '0'; }}>
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div style={{
          borderRadius: '12px', padding: '20px 28px', marginBottom: '32px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(217,121,37,0.18)',
          display: 'flex', gap: '0', flexWrap: 'wrap',
        }}>
          {CONTACT.map(({ Icon, label, value }, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              flex: 1, minWidth: '220px',
              paddingRight: i < CONTACT.length - 1 ? '32px' : 0,
              borderRight: i < CONTACT.length - 1 ? '1px solid rgba(0,0,0,0.10)' : 'none',
              marginRight: i < CONTACT.length - 1 ? '32px' : 0,
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(217,121,37,0.12)', border: '1px solid rgba(217,121,37,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--orange-500)',
              }}>
                <Icon/>
              </div>
              <div>
                <p className="font-ui font-bold m-0" style={{ fontSize: '10px', color: 'var(--orange-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                <p className="font-ui m-0" style={{ fontSize: '13px', color: 'rgba(0,0,0,0.62)', marginTop: '2px' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ height: '1px', background: 'rgba(2,47,105,0.18)', marginBottom: '20px' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p className="font-ui m-0" style={{ fontSize: '13px', color: 'var(--orange-500)', opacity: 0.8 }}>
            &copy; 2026 OceanEarn. Hak Cipta Dilindungi.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Kebijakan Privasi', 'Syarat & Ketentuan'].map(t => (
              <span key={t} className="font-ui cursor-pointer"
                style={{ fontSize: '12px', color: 'rgba(0,0,0,0.40)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--orange-500)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.40)'}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}