import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: 'calc(100vh - 96px)', display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 2.5vw, 48px)', maxWidth: 'clamp(600px, 65vw, 1254px)' }}>

        <motion.h1 className="font-title font-bold m-0 text-darkBlue-500"
          style={{ fontSize: 'clamp(64px, 7.5vw, 144px)', lineHeight: 1 }}
          {...fadeUp(0)}>
          <span className="text-darkBlue-500">Ocean</span>{' '}
          <span className="text-orange-500">Earn</span>
        </motion.h1>

        <motion.p className="font-body font-medium text-white m-0"
          style={{ fontSize: 'clamp(28px, 2.5vw, 48px)', lineHeight: 1.2 }}
          {...fadeUp(0.1)}>
          Bersihkan Laut, Hasilkan Nilai
        </motion.p>

        <motion.p className="font-body text-white/85 m-0"
          style={{ fontSize: 'clamp(16px, 1.46vw, 28px)', lineHeight: 1.6, maxWidth: '881px' }}
          {...fadeUp(0.2)}>
          Platform digital yang mengubah sampah laut menjadi nilai ekonomi secara
          real-time, transparan, dan tervalidasi. Didukung teknologi AI untuk
          estimasi sampah, sistem verifikasi berlapis, dan pelacakan transaksi yang jelas.
        </motion.p>

        <motion.div style={{ display: 'flex', gap: 'clamp(8px, 0.573vw, 11px)', flexWrap: 'wrap' }} {...fadeUp(0.3)}>
          <button onClick={() => navigate('/register')}
            className="cursor-pointer font-ui font-bold whitespace-nowrap"
            style={{
              fontSize: 'clamp(14px, 1.042vw, 20px)', lineHeight: 'clamp(32px, 2.083vw, 40px)',
              padding: '0 clamp(14px, 1.042vw, 20px)', borderRadius: '20px', border: 'none',
              background: 'var(--orange-200)', color: 'var(--blue-800)',
              transition: 'box-shadow 0.25s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 18px color-mix(in srgb, var(--orange-500) 70%, transparent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Daftar Menjadi Nelayan
          </button>
          <button onClick={() => navigate('/signin')}
            className="cursor-pointer font-ui font-bold whitespace-nowrap"
            style={{
              fontSize: 'clamp(14px, 1.042vw, 20px)', lineHeight: 'clamp(32px, 2.083vw, 40px)',
              padding: '0 clamp(14px, 1.042vw, 20px)', borderRadius: '20px', border: 'none',
              background: 'var(--darkBlue-500)', color: 'white',
              transition: 'box-shadow 0.25s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 18px color-mix(in srgb, var(--blue-500) 70%, transparent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Lihat Selengkapnya
          </button>
        </motion.div>
      </div>
    </div>
  );
}