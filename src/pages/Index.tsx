import { useState } from "react";
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
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-transparent">
      {showSplash && (
        <SplashScreen 
          isLoading={isVideoLoading} 
          onAnimationComplete={() => setShowSplash(false)} 
        />
      )}
      
      <div className={`transition-opacity duration-1000 ${showSplash ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
        <main>
          <HeroSection onVideoLoaded={() => setIsVideoLoading(false)} />
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
    </div>
  );
};

export default Index;
