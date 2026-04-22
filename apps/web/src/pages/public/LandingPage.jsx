import heroBg from '../../assets/Background.svg';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
      }}
    >
      {/* GLOBAL CONTAINER */}
      <div className="w-full max-w-[1920px] mx-auto px-[clamp(16px,3.3vw,64px)]">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}