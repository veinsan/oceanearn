import { UserCheck, Recycle, Camera, CheckCircle, Gift } from 'lucide-react';

const STEPS = [
  { step: '01', Icon: UserCheck, title: 'Daftar & Verifikasi',  description: 'Buat akun sebagai Nelayan atau TPS dan lengkapi dokumen verifikasi identitasmu.' },
  { step: '02', Icon: Recycle,   title: 'Kumpulkan Sampah',     description: 'Kumpulkan sampah laut atau pesisir dan bawa ke titik TPS terdekat di lokasimu.' },
  { step: '03', Icon: Camera,    title: 'Foto & Upload',        description: 'Ambil foto sampah yang dikumpulkan. AI kami langsung mengestimasi jenis dan bobotnya.' },
  { step: '04', Icon: CheckCircle, title: 'Validasi TPS',       description: 'Petugas TPS menimbang dan memvalidasi, poin langsung dikreditkan ke akunmu.' },
  { step: '05', Icon: Gift,      title: 'Tukar Reward',         description: 'Gunakan poin untuk menukar berbagai hadiah menarik di marketplace OceanEarn.' },
];

function StepCard({ step, Icon: StepIcon, title, description, wide = false, light = false }) {
  return (
    <div
      className={`rounded-[20px] flex ${wide ? 'flex-row items-center gap-[40px]' : 'flex-col gap-[16px]'}`}
      style={{
        background: light ? 'rgba(243,213,187,0.80)' : 'rgba(243,213,187,0.20)',
        boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
        padding: '32px',
        minHeight: '251px',
      }}
    >
      <div className="flex items-center gap-[10px] shrink-0">
        <span className={`font-ui font-bold text-[13px] leading-none ${light ? 'text-orange-500' : 'text-orange-200'}`}>
          {step}
        </span>
        <StepIcon
          strokeWidth={1.5}
          size={22}
          className={light ? 'text-orange-500' : 'text-white'}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <h3 className={`font-ui font-bold text-[20px] leading-[1.3] m-0 ${light ? 'text-darkBlue-800' : 'text-white'}`}>
          {title}
        </h3>
        <p className={`font-body text-[15px] leading-[1.6] m-0 ${light ? 'text-darkBlue-800/70' : 'text-white/75'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      className="w-full py-[80px]"
      style={{ background: 'linear-gradient(100deg, #D97925 0%, #734014 100%)' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: '1920px', paddingLeft: '64px', paddingRight: '64px' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-[12px] mb-[56px]">
          <h2 className="font-body font-semibold text-darkBlue-800 m-0 text-center text-[40px]">
            Cara Kerja Ocean Earn
          </h2>
          <p className="font-ui text-white text-center m-0 text-[20px] leading-[30px] max-w-[1254px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </div>

        {/* Row 1: 3 equal cards */}
        <div className="grid grid-cols-3 gap-[24px] mb-[24px]">
          {STEPS.slice(0, 3).map(s => <StepCard key={s.step} {...s} />)}
        </div>

        {/* Row 2: wide (2/3) + normal (1/3) */}
        <div className="grid grid-cols-3 gap-[24px]">
          <div className="col-span-2">
            <StepCard {...STEPS[3]} wide />
          </div>
          <StepCard {...STEPS[4]} light />
        </div>
      </div>
    </section>
  );
}