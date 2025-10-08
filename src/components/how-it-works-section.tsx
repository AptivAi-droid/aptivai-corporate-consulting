import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, BookOpen, Award } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Assess Your Readiness",
      description: "Take our 5-minute AI readiness assessment to understand where your team stands"
    },
    {
      icon: BookOpen,
      title: "Complete 5 Self-Paced Modules",
      description: "Learn at your own pace through our comprehensive training program designed for non-technical teams"
    },
    {
      icon: Award,
      title: "Get Certified & Future-Ready",
      description: "Earn your certificate and gain the confidence to leverage AI in your daily work"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your journey to AI confidence in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-border/50 hover:shadow-elegant transition-all duration-300 relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                  <step.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-card border border-border/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-2">
              Meet your AI-powered learning assistants
            </p>
            <p className="text-lg font-semibold text-foreground">
              Available 24/7 to guide you through your learning journey
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
