import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aptivaiLogo from "@/assets/aptivai-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={aptivaiLogo} 
              alt="AptivAI - Corporate AI Consulting" 
              className="h-20 w-auto mb-6 drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            AI Training for Non-Technical Teams —{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Made Simple, Practical, and Ethical
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover your team's AI readiness in 5 minutes and get a personalized training roadmap
          </p>
          
          <div className="flex justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/ai-readiness')}
              className="bg-accent hover:bg-accent text-accent-foreground px-8 py-6 text-lg font-semibold shadow-gold group transition-all duration-300 hover:scale-105"
            >
              Take the Free Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-300 mt-4">
            Trusted by 500+ professionals
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;