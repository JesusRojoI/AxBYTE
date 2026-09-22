import Hero from '@/components/home/Hero';
import ServicesIntro from '@/components/home/ServicesIntro';
import ServicesGrid from '@/components/home/ServicesGrid';
import Digitalize from '@/components/home/Digitalize';
import Creative from '@/components/home/Creative';
import Portfolio from '@/components/home/Portfolio';
import Trust from '@/components/home/Trust';
import Process from '@/components/home/Process';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <ServicesGrid />
      <Digitalize />
      <Creative />
      <Portfolio />
      <Trust />
      <Process />
      <CTASection />
    </>
  );
}