import logo from '../assets/Logo.svg';

export default function Navbar() {
  return (
    <div className="mt-[32px] h-[64px] w-full bg-white/10 backdrop-blur-sm border border-orange-500 rounded-[20px] flex items-center px-[48px] justify-between">

      <img src={logo} className="h-[32px] shrink-0" />

      <div className="flex items-center gap-[77px] text-white text-[20px] font-ui font-bold leading-[40px]">
        <span>Beranda</span>
        <span>Marketplace</span>
        <span>TPS</span>
        <span>Tentang Kami</span>
        <span>Edukasi</span>
      </div>

      <div className="flex items-center gap-[11px]">
        <div className="px-[20px] bg-darkBlue-500 rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px]">
          Masuk
        </div>
        <div className="px-[20px] bg-orange-500 rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px]">
          Daftar
        </div>
      </div>

    </div>
  );
}