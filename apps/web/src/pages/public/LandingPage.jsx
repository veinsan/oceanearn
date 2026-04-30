import heroBg from '../../assets/icons/Background.svg';
import Navbar       from '../../components/common/Navbar';
import Hero         from '../../components/landing/Hero';
import StatsSection from '../../components/landing/StatsSection';
import HowItWorks   from '../../components/landing/HowItWorks';
import DataSection  from '../../components/landing/DataSection';
import CTASection   from '../../components/landing/CTASection';
import Footer       from '../../components/common/Footer';
import { useScrollReveal } from '../../hooks/useScrollReveal';

function RevealSection({ children, delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}${delay ? ` reveal-delay-${delay}` : ''}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full">
      <section className="relative w-full overflow-hidden" style={{ background: 'var(--navy-dark)' }}>
        <img src={heroBg} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"/>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)',
        }}/>
        <div className="relative mx-auto" style={{ maxWidth: '1920px', padding: '0 64px 120px' }}>
          <Navbar />
          <Hero />
        </div>
      </section>

      <RevealSection><StatsSection /></RevealSection>
      <RevealSection><HowItWorks /></RevealSection>
      <RevealSection><DataSection /></RevealSection>
      <RevealSection><CTASection /></RevealSection>
      <RevealSection><Footer /></RevealSection>
    </div>
  );
}