import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wrench, TrendingUp, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Lightbulb,
      title: "AI Awareness Workshops",
      description: "Comprehensive sessions designed to demystify AI for non-technical teams. Learn about AI fundamentals, potential applications in your industry, and ethical considerations.",
      features: [
        "Interactive presentations and demonstrations",
        "Industry-specific use cases and examples",
        "Q&A sessions tailored to your team's concerns",
        "Takeaway resources for continued learning"
      ]
    },
    {
      icon: Wrench,
      title: "Hands-on AI Tool Training",
      description: "Practical training sessions where your team learns to use AI tools effectively in their daily work. From ChatGPT to industry-specific solutions.",
      features: [
        "Live demonstrations of popular AI tools",
        "Guided practice sessions with real scenarios",
        "Best practices for prompt engineering",
        "Safety and security guidelines"
      ]
    },
    {
      icon: TrendingUp,
      title: "Future Skills Consulting",
      description: "Strategic guidance on preparing your workforce for an AI-augmented future. Identify skill gaps and create development roadmaps.",
      features: [
        "Skills gap analysis and assessment",
        "Future-ready competency frameworks",
        "Change management strategies",
        "Long-term learning and development plans"
      ]
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-accent">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Tailored AI consulting services designed specifically for South African businesses 
            looking to empower their non-technical teams with practical AI knowledge.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  onClick={scrollToContact}
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground group"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block border-accent/20 bg-accent/5 p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Book a consultation to discuss your team's specific AI training needs 
                and create a customized learning journey.
              </p>
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 shadow-gold"
              >
                Book Your Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;