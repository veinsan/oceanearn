import heroBg from '../../assets/Background.svg';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(0,0,0,0.65) 0%,
            rgba(0,0,0,0.55) 25%,
            rgba(0,0,0,0.35) 55%,
            rgba(0,0,0,0.1) 80%,
            rgba(0,0,0,0) 100%
          )`,
        }}
      />

      <div className="relative max-w-[1920px] mx-auto px-[64px]">
        <Navbar />
        <Hero />
      </div>

    </div>
  );
}