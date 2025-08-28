import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Brain, Shield, Zap } from "lucide-react";

const TrainingSection = () => {
  const modules = [
    {
      number: "01",
      icon: BookOpen,
      title: "AI Fundamentals",
      description: "Understanding AI basics, terminology, and core concepts that every professional should know.",
      duration: "2 hours",
      format: "Interactive Workshop"
    },
    {
      number: "02", 
      icon: Users,
      title: "AI in the Workplace",
      description: "Practical applications of AI tools in daily work tasks, productivity enhancement, and collaboration.", 
      duration: "3 hours",
      format: "Hands-on Training"
    },
    {
      number: "03",
      icon: Brain,
      title: "Prompt Engineering",
      description: "Mastering the art of communicating with AI systems to get the best results for your specific needs.",
      duration: "2.5 hours", 
      format: "Practical Session"
    },
    {
      number: "04",
      icon: Shield,
      title: "AI Ethics & Security",
      description: "Understanding responsible AI use, data privacy, security considerations, and ethical guidelines.",
      duration: "2 hours",
      format: "Discussion & Case Studies"
    },
    {
      number: "05",
      icon: Zap,
      title: "Future-Ready Skills",
      description: "Preparing for the evolving workplace, adapting to AI-augmented roles, and continuous learning strategies.",
      duration: "2.5 hours",
      format: "Strategic Planning"
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="training" className="py-20 bg-corporate-black text-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Training <span className="text-accent">Modules</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Comprehensive, modular training program designed to take your team from AI novice 
            to confident AI-augmented professionals. Each module builds on the previous one, 
            creating a complete learning journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => (
            <Card key={index} className="bg-corporate-grey/50 border-corporate-grey hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl font-bold text-accent/70">
                    {module.number}
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <module.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white mb-2">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {module.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-accent font-medium">
                    {module.duration}
                  </span>
                  <span className="text-gray-400">
                    {module.format}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Call to Action Card */}
          <Card className="bg-gradient-gold border-accent md:col-span-2 lg:col-span-1 flex items-center justify-center">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-accent-foreground mb-4">
                Custom Programs Available
              </h3>
              <p className="text-accent-foreground/80 mb-6 text-sm leading-relaxed">
                Need a tailored approach? We can customize modules to fit your team's specific requirements and industry needs.
              </p>
              <Button 
                variant="outline"
                onClick={scrollToContact}
                className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              >
                Discuss Custom Training
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-corporate-grey/30 rounded-2xl p-8 md:p-12 border border-corporate-grey">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Complete Training Package
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-accent mb-2">12</div>
                <p className="text-gray-300">Total Hours</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">5</div>
                <p className="text-gray-300">Core Modules</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">∞</div>
                <p className="text-gray-300">Future Support</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Our comprehensive program can be delivered over several weeks or condensed into 
              intensive sessions based on your team's schedule and preferences.
            </p>
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 shadow-gold"
            >
              Start Your Training Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;