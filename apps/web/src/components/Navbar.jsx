import { useState } from 'react';
import logo from '../assets/logo.svg';

const NAV_LINKS = ['Beranda', 'Marketplace', 'TPS', 'Tentang Kami', 'Edukasi'];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-[32px]">
      <nav className="w-full h-[64px] bg-white/10 backdrop-blur-sm border border-orange-500 rounded-xl2 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        
        <div className="h-full flex items-center justify-between px-[48px]">
          
          {/* LOGO */}
          <img src={logo} alt="OceanEarn" className="h-[40px]" />

          {/* MENU */}
          <ul className="hidden lg:flex items-center gap-[40px]">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a className="font-ui font-bold text-white text-body hover:text-orange-500">
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* BUTTON */}
          <div className="hidden lg:flex items-center gap-[11px]">
            <button className="w-[104px] h-[40px] bg-darkBlue-500 text-white font-ui font-bold rounded-xl2 hover:bg-darkBlue-600">
              Masuk
            </button>
            <button className="w-[103px] h-[40px] bg-orange-500 text-white font-ui font-bold rounded-xl2 hover:bg-orange-600">
              Daftar
            </button>
          </div>

          {/* MOBILE */}
          <button
            className="lg:hidden flex flex-col gap-1.5"
            onClick={() => setOpen(!open)}
          >
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
          </button>
        </div>

        {open && (
          <div className="lg:hidden px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link} className="text-white font-ui font-bold">
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}