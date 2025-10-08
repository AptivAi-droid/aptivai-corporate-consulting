// AptivAI - Professional Corporate AI Consulting Website

import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
