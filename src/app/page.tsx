import Header from '@/components/Header/Header';
import HeroSection from '@/components/HeroSection/HeroSection';
import MiningCalculator from '@/components/MiningCalculator/MiningCalculator';
import StakingCalculator from '@/components/StakingCalculator/StakingCalculator';
import ROICalculator from '@/components/ROICalculator/ROICalculator';
import Footer from '@/components/Footer/Footer';
import './globals.css'

export default function HomePage() {
  return (
    <div className="bg-background text-text">
      <Header />
      <HeroSection />      
      <section id="mining">
        <MiningCalculator />
      </section>
      <section id="staking">
        <StakingCalculator />
      </section>
      <section id="roi">
        <ROICalculator />
      </section>
      <Footer />
    </div>
  );
}
