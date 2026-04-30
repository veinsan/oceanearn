import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/Logo.svg';

const NAV_LINKS = [
  { label: 'Beranda',      path: '/' },
  { label: 'Kios Nelayan', path: '/kios' },
  { label: 'TPS',          path: '/tps' },
  { label: 'Edukasi',      path: '/edukasi' },
  { label: 'Tentang Kami', path: '/tentang' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mt-[32px] h-[64px] w-full backdrop-blur-sm border border-orange-500 rounded-[20px] flex items-center px-[48px] justify-between"
      style={{
        background: scrolled ? 'rgba(1,22,49,0.85)' : 'rgba(255,255,255,0.10)',
        boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
        transition: 'background 0.3s',
      }}>

      <img src={logo} className="h-[32px] shrink-0 cursor-pointer" alt="OceanEarn"
        onClick={() => navigate('/')}
        style={{
          filter: 'drop-shadow(-4px 0 8px color-mix(in srgb, var(--blue-500) 80%, transparent)) drop-shadow(4px 0 8px color-mix(in srgb, var(--orange-500) 80%, transparent))',
          transition: 'filter 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'drop-shadow(-6px 0 14px var(--blue-500)) drop-shadow(6px 0 14px var(--orange-500))'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'drop-shadow(-4px 0 8px color-mix(in srgb, var(--blue-500) 80%, transparent)) drop-shadow(4px 0 8px color-mix(in srgb, var(--orange-500) 80%, transparent))'; }}
      />

      <div className="flex items-center gap-[77px] text-[20px] font-ui font-bold leading-[40px]">
        {NAV_LINKS.map(({ label, path }) => {
          const active = location.pathname === path;
          return (
            <span key={path} onClick={() => navigate(path)} className="cursor-pointer select-none"
              style={{
                color: active ? 'var(--orange-500)' : 'white',
                textShadow: active ? '0 0 12px color-mix(in srgb, var(--orange-500) 80%, transparent)' : 'none',
                transition: 'color 0.2s, text-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--orange-500)'; e.currentTarget.style.textShadow = '0 0 12px color-mix(in srgb, var(--orange-500) 80%, transparent)'; }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.textShadow = 'none'; } }}
            >
              {label}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-[11px]">
        {user ? (
          <>
            <span className="font-ui text-white text-[16px]">
              Hi, <span className="text-orange-500 font-bold">{user.username}</span>
            </span>
            <button onClick={logout}
              className="cursor-pointer px-[20px] rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px] border-none bg-danger-500"
              style={{ transition: 'box-shadow 0.25s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px color-mix(in srgb, var(--danger-500) 75%, transparent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Keluar
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}
              className="cursor-pointer px-[20px] rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px] border-none bg-darkBlue-500"
              style={{ transition: 'box-shadow 0.25s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px color-mix(in srgb, var(--blue-500) 75%, transparent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Masuk
            </button>
            <button onClick={() => navigate('/register')}
              className="cursor-pointer px-[20px] rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px] border-none bg-orange-500"
              style={{ transition: 'box-shadow 0.25s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px color-mix(in srgb, var(--orange-500) 75%, transparent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Daftar
            </button>
          </>
        )}
      </div>
    </div>
  );
}