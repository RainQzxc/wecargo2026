import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import CinematicHero from "@/components/marketing/CinematicHero";
import TrustBar from "@/components/marketing/TrustBar";
import JourneyCinema from "@/components/marketing/JourneyCinema";
import ServicesSection from "@/components/marketing/ServicesSection";
import WhyChooseSection from "@/components/marketing/WhyChooseSection";
import TrackingExperienceSection from "@/components/marketing/TrackingExperienceSection";
import LinkOrderSection from "@/components/marketing/LinkOrderSection";
import EreenAddressSection from "@/components/marketing/EreenAddressSection";
import BusinessSection from "@/components/marketing/BusinessSection";
import PricingTeaser from "@/components/marketing/PricingTeaser";
import TestimonialsMosaic from "@/components/marketing/TestimonialsMosaic";
import ContactSection from "@/components/marketing/ContactSection";
import FinalCTA from "@/components/marketing/FinalCTA";
import MotionReveal from "@/components/marketing/MotionReveal";
import ScrollToTop from "@/components/marketing/ScrollToTop";
import { getActiveTestimonials, getSiteContent } from "@/features/content/dal";
import { resolveSiteContent } from "@/features/content/site-content";

export default async function LandingPage() {
  const [testimonials, siteContentRaw] = await Promise.all([
    getActiveTestimonials(),
    getSiteContent(),
  ]);
  const c = resolveSiteContent(siteContentRaw);
  const hero = {
    badge: c["home.hero.badge"],
    titleLine1: c["home.hero.titleLine1"],
    titleHighlight: c["home.hero.titleHighlight"],
    titleLine3: c["home.hero.titleLine3"],
    description: c["home.hero.description"],
    ctaPrimary: c["home.hero.ctaPrimary"],
    ctaSecondary: c["home.hero.ctaSecondary"],
  };
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#1d1d1f] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Үндсэн агуулга руу шилжих
      </a>
      <Header />
      <main id="main" className="flex-1">
        <CinematicHero content={hero} />
        {/* gradient bridge: dark hero → light sections */}
        <div
          className="h-16 bg-gradient-to-b from-[#060e0e] to-[#f7f7f7]"
          aria-hidden="true"
        />
        <TrustBar />
        <JourneyCinema />
        <MotionReveal>
          <ServicesSection />
        </MotionReveal>
        <MotionReveal>
          <WhyChooseSection />
        </MotionReveal>
        <MotionReveal>
          <TrackingExperienceSection />
        </MotionReveal>
        <MotionReveal>
          <LinkOrderSection />
        </MotionReveal>
        <MotionReveal>
          <EreenAddressSection />
        </MotionReveal>
        <MotionReveal>
          <BusinessSection />
        </MotionReveal>
        <MotionReveal>
          <PricingTeaser />
        </MotionReveal>
        <MotionReveal>
          <TestimonialsMosaic items={testimonials} />
        </MotionReveal>
        <MotionReveal>
          <ContactSection />
        </MotionReveal>
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
