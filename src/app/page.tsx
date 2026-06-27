import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import HeroSection from "@/components/marketing/HeroSection";
import TrustBar from "@/components/marketing/TrustBar";
import RouteMotionSection from "@/components/marketing/RouteMotionSection";
import StorySection from "@/components/marketing/StorySection";
import ServicesSection from "@/components/marketing/ServicesSection";
import WhyChooseSection from "@/components/marketing/WhyChooseSection";
import TrackingExperienceSection from "@/components/marketing/TrackingExperienceSection";
import LinkOrderSection from "@/components/marketing/LinkOrderSection";
import BusinessSection from "@/components/marketing/BusinessSection";
import ProcessSection from "@/components/marketing/ProcessSection";
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
      <Header />
      <main className="flex-1">
        <HeroSection content={hero} />
        {/* gradient bridge: dark hero → light sections */}
        <div
          className="h-16 bg-gradient-to-b from-[#060e0e] to-[#f7f7f7]"
          aria-hidden="true"
        />
        <TrustBar />
        <MotionReveal>
          <RouteMotionSection />
        </MotionReveal>
        <StorySection />
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
          <BusinessSection />
        </MotionReveal>
        <MotionReveal>
          <ProcessSection />
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
