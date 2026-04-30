import { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

function TrashIcon() {
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
      <path d="M28 2H21L19 0H9L7 2H0V6H28M2 32C2 33.0609 2.42143 34.0783 3.17157 34.8284C3.92172 35.5786 4.93913 36 6 36H22C23.0609 36 24.0783 35.5786 24.8284 34.8284C25.5786 34.0783 26 33.0609 26 32V8H2V32Z" fill="var(--orange-500)"/>
    </svg>
  );
}

function CO2Icon() {
  return (
    <svg width="74" height="36" viewBox="0 0 74 36" fill="none">
      <path d="M32 24C30.8667 24 29.9173 23.616 29.152 22.848C28.3867 22.08 28.0027 21.1307 28 20V4C28 2.86667 28.384 1.91733 29.152 1.152C29.92 0.386667 30.8693 0.00266667 32 0H44C45.1333 0 46.084 0.384 46.852 1.152C47.62 1.92 48.0027 2.86933 48 4V20C48 21.1333 47.616 22.084 46.848 22.852C46.08 23.62 45.1307 24.0027 44 24H32ZM34 18H42V6H34V18ZM56 33V26C56 24.8667 56.384 23.9173 57.152 23.152C57.92 22.3867 58.8693 22.0027 60 22H68V18H58.9C58.1 18 57.416 17.716 56.848 17.148C56.28 16.58 55.9973 15.864 56 15C56 14.2 56.284 13.5 56.852 12.9C57.42 12.3 58.136 12 59 12H70C71.1333 12 72.084 12.384 72.852 13.152C73.62 13.92 74.0027 14.8693 74 16V22C74 23.1333 73.616 24.084 72.848 24.852C72.08 25.62 71.1307 26.0027 70 26H62V30H71C71.8 30 72.5 30.3 73.1 30.9C73.7 31.5 74 32.2 74 33C74 33.8666 73.7 34.584 73.1 35.152C72.5 35.72 71.8 36.0026 71 36H59C58.1333 36 57.4173 35.716 56.852 35.148C56.2867 34.58 56.0027 33.864 56 33ZM4 24C2.86667 24 1.91733 23.616 1.152 22.848C0.386667 22.08 0.00266667 21.1307 0 20V4C0 2.86667 0.384 1.91733 1.152 1.152C1.92 0.386667 2.86933 0.00266667 4 0H16C17.1333 0 18.084 0.384 18.852 1.152C19.62 1.92 20.0027 2.86933 20 4V6.1C20 6.89999 19.7 7.584 19.1 8.152C18.5 8.72 17.8 9.00266 17 9C16.1333 9 15.4173 8.71599 14.852 8.14799C14.2867 7.57999 14.0027 6.864 14 6H6V18H14C14 17.2 14.284 16.5 14.852 15.9C15.42 15.3 16.136 15 17 15C17.8 15 18.5 15.3 19.1 15.9C19.7 16.5 20 17.2 20 18V20C20 21.1333 19.616 22.084 18.848 22.852C18.08 23.62 17.1307 24.0027 16 24H4Z" fill="var(--orange-500)"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="50" height="36" viewBox="0 0 50 36" fill="none">
      <path d="M25 0C29.4844 0 33.125 3.61552 33.125 8.06896C33.125 12.5224 29.4844 16.1379 25 16.1379C20.5156 16.1379 16.875 12.5224 16.875 8.06896C16.875 3.61552 20.5156 0 25 0ZM7.5 5.58621C10.6094 5.58621 13.125 8.08448 13.125 11.1724C13.125 14.2603 10.6094 16.7586 7.5 16.7586C4.39062 16.7586 1.875 14.2603 1.875 11.1724C1.875 8.08448 4.39062 5.58621 7.5 5.58621ZM0 31.0345C0 25.5491 4.47656 21.1034 10 21.1034C11 21.1034 11.9688 21.2509 12.8828 21.5224C10.3125 24.3776 8.75 28.1483 8.75 32.2759V33.5172C8.75 34.4017 8.9375 35.2397 9.27344 36H2.5C1.11719 36 0 34.8905 0 33.5172V31.0345ZM40.7266 36C41.0625 35.2397 41.25 34.4017 41.25 33.5172V32.2759C41.25 28.1483 39.6875 24.3776 37.1172 21.5224C38.0313 21.2509 39 21.1034 40 21.1034C45.5234 21.1034 50 25.5491 50 31.0345V33.5172C50 34.8905 48.8828 36 47.5 36H40.7266ZM36.875 11.1724C36.875 8.08448 39.3906 5.58621 42.5 5.58621C45.6094 5.58621 48.125 8.08448 48.125 11.1724C48.125 14.2603 45.6094 16.7586 42.5 16.7586C39.3906 16.7586 36.875 14.2603 36.875 11.1724ZM12.5 32.2759C12.5 25.4172 18.0937 19.8621 25 19.8621C31.9062 19.8621 37.5 25.4172 37.5 32.2759V33.5172C37.5 34.8905 36.3828 36 35 36H15C13.6172 36 12.5 34.8905 12.5 33.5172V32.2759Z" fill="var(--orange-500)"/>
    </svg>
  );
}

// Count-up hook
function useCountUp(target, duration = 2000, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started || target === 0) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, started, duration]);
  return val;
}

function StatCard({ Icon: StatIcon, label, value, started }) {
  const count = useCountUp(value, 2000, started);
  const display = count.toLocaleString('id-ID');
  return (
    <div className="flex flex-col items-center gap-[14px]">
      <StatIcon />
      <span className="font-body font-medium text-[24px] leading-[40px] text-black text-center">{label}</span>
      <span className="font-title font-bold text-darkBlue-800 text-center"
        style={{ fontSize: '64px', lineHeight: 1 }}>
        {display}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [stats, setStats] = useState({ sampah_ton: 1200, co2_dicegah_ton: 4200, nelayan_aktif: 876 });

  // Fetch realtime stats
  useEffect(() => {
    api.get('/submissions/stats/')
      .then(({ data }) => setStats({
        sampah_ton:      Math.round(data.sampah_ton),
        co2_dicegah_ton: Math.round(data.co2_dicegah_ton),
        nelayan_aktif:   data.nelayan_aktif,
      }))
      .catch(() => {}); // fallback ke hardcode kalau API belum ready
  }, []);

  // Intersection Observer untuk trigger count-up
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const STATS = [
    { Icon: TrashIcon, label: 'SAMPAH TERKUMPUL (TON)', value: stats.sampah_ton },
    { Icon: CO2Icon,   label: 'EMISI CO2 DICEGAH',      value: stats.co2_dicegah_ton },
    { Icon: UsersIcon, label: 'NELAYAN AKTIF',           value: stats.nelayan_aktif },
  ];

  return (
    <section ref={ref} className="w-full py-[80px]" style={{ background: 'var(--grey-bg)' }}>
      <div className="mx-auto flex justify-between items-start"
        style={{ maxWidth: '1920px', paddingLeft: '64px', paddingRight: '64px' }}>
        {STATS.map(({ Icon, label, value }) => (
          <StatCard key={label} Icon={Icon} label={label} value={value} started={started} />
        ))}
      </div>
    </section>
  );
}