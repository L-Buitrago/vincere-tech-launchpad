import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import PricingSection from "@/components/PricingSection";
import PlatformDemoSection from "@/components/PlatformDemoSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <DifferentialsSection />
        <HowItWorksSection />
        <PlatformDemoSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
