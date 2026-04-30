import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import logo from '../../assets/images/Logo.svg';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 36.2 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C41.3 35.5 44 30.1 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

const ROLES = [
  { value: 'umum',    label: 'Masyarakat Umum',  desc: 'Pantau dampak dan edukasi lingkungan' },
  { value: 'nelayan', label: 'Nelayan',           desc: 'Kumpulkan sampah dan dapatkan koin' },
  { value: 'tps',     label: 'Pengelola TPS',     desc: 'Validasi setoran dan kelola fasilitas' },
];

export default function RegisterPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = pilih role (khusus OAuth)
  const [form, setForm] = useState({ username: '', email: '', no_hp: '', password: '', password2: '' });
  const [selectedRole, setSelectedRole] = useState('umum');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password !== form.password2) { setError('Password tidak cocok.'); return; }
  setError(''); setLoading(true);
  try {
    await api.post('/users/register/', { ...form, role: selectedRole });
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    const d = err.response?.data;
    const msg = d?.username?.[0] ?? d?.email?.[0] ?? d?.password?.[0] ?? d?.non_field_errors?.[0] ?? d?.detail ?? 'Registrasi gagal. Coba lagi.';
    setError(msg);
  } finally { setLoading(false); }
};

  const handleGoogle = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setLoading(true);
      try {
        const user = await loginWithGoogle(access_token);
        if (user.is_new_oauth_user) { navigate('/role-setup'); return; }
        navigate('/');
      } catch { setError('Registrasi Google gagal.'); }
      finally { setLoading(false); }
    },
    onError: () => setError('Google dibatalkan.'),
  });

  const inputStyle = {
    borderRadius: '12px', padding: '11px 14px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white', fontSize: '15px', outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center py-[40px]"
      style={{ background: 'linear-gradient(135deg, #011631 0%, #033E8C 55%, #01224C 100%)' }}
    >
      <div style={{ position: 'fixed', top: '10%', right: '8%',  width: 380, height: 380, borderRadius: '50%', background: 'rgba(217,121,37,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '8%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(4,96,217,0.14)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '520px', margin: '0 24px',
          borderRadius: '24px',
          border: '1px solid rgba(217,121,37,0.4)',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          padding: '44px 40px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-[28px]">
          <img src={logo} alt="OceanEarn" style={{ height: '48px', marginBottom: '12px', filter: 'drop-shadow(-3px 0 8px rgba(4,96,217,0.8)) drop-shadow(3px 0 8px rgba(217,121,37,0.8))' }} />
          <h1 className="font-title font-bold m-0" style={{ fontSize: '28px' }}>
            <span style={{ color: '#b1cef3' }}>Ocean</span>{' '}
            <span className="text-orange-500">Earn</span>
          </h1>
          <p className="font-ui mt-1 m-0" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            Buat akun baru
          </p>
        </div>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ borderRadius: '12px', padding: '14px', marginBottom: '16px', background: 'rgba(40,167,69,0.15)', border: '1px solid rgba(40,167,69,0.4)', textAlign: 'center' }}>
              <p className="font-ui font-bold m-0" style={{ color: '#4ade80', fontSize: '15px' }}>✓ Registrasi berhasil! Mengalihkan...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google */}
        <button
          onClick={() => handleGoogle()} disabled={loading}
          style={{
            width: '100%', borderRadius: '12px', padding: '11px',
            background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)',
            color: 'white', fontSize: '15px', fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '18px', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
        >
          <GoogleIcon /> Daftar dengan Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>atau daftar manual</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {error && (
          <div style={{ borderRadius: '12px', padding: '10px 14px', marginBottom: '14px', background: 'rgba(242,25,5,0.12)', border: '1px solid rgba(242,25,5,0.35)' }}>
            <p className="font-ui text-sm m-0" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Row: username + email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="username123" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#D97925'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@contoh.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#D97925'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>No. HP</label>
            <input name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="08xxxxxxxxxx" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#D97925'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#D97925'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Konfirmasi</label>
              <input name="password2" type="password" value={form.password2} onChange={handleChange} placeholder="••••••••" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#D97925'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
          </div>

          {/* Role selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="font-ui" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Daftar sebagai</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {ROLES.map(r => (
                <button
                  key={r.value} type="button"
                  onClick={() => setSelectedRole(r.value)}
                  style={{
                    flex: 1, borderRadius: '10px', padding: '8px 6px',
                    border: selectedRole === r.value ? '1.5px solid #D97925' : '1px solid rgba(255,255,255,0.12)',
                    background: selectedRole === r.value ? 'rgba(217,121,37,0.18)' : 'rgba(255,255,255,0.05)',
                    color: selectedRole === r.value ? '#D97925' : 'rgba(255,255,255,0.55)',
                    fontSize: '11px', fontWeight: 600, fontFamily: 'inherit',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                    boxShadow: selectedRole === r.value ? '0 0 10px rgba(217,121,37,0.3)' : 'none',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '2px 0 0' }}>
              {ROLES.find(r => r.value === selectedRole)?.desc}
            </p>
          </div>

          <input type="hidden" name="role" value={selectedRole} />

          <button
            type="submit" disabled={loading || success}
            style={{
              marginTop: '4px', borderRadius: '20px', height: '46px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(217,121,37,0.4)' : '#D97925',
              color: 'white', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
              transition: 'box-shadow 0.25s, transform 0.2s',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 20px rgba(217,121,37,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>
        </form>

        <p className="font-ui text-center mt-[20px] mb-0" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: '#D97925', fontWeight: 600, textDecoration: 'none' }}>
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}