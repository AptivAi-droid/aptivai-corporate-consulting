import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Phone, Cpu } from "lucide-react";

const About = () => {
  const experiences = [
    {
      icon: Building2,
      title: "Banking Expertise",
      description: "Deep experience in financial services and corporate environments"
    },
    {
      icon: Phone,
      title: "Call Center Solutions",
      description: "Transforming customer service operations with AI-powered tools"
    },
    {
      icon: Cpu,
      title: "Tech Innovation",
      description: "Cutting-edge AI knowledge applied to practical business solutions"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About <span className="text-accent">AptivAI</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                With extensive experience in South African corporate environments, particularly in banking and 
                call center operations, we understand the unique challenges non-technical teams face when 
                adopting AI technologies. Our approach combines deep industry knowledge with practical, 
                ethical AI implementation strategies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {experiences.map((experience, index) => (
                <Card key={index} className="border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <experience.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {experience.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-elegant">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-center mb-6">
                  To empower South African businesses by making AI accessible, understandable, and practical 
                  for non-technical teams. We believe that successful AI adoption requires more than just 
                  technology—it requires the right knowledge, ethical framework, and change management approach.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent mb-2">Practical</div>
                    <p className="text-sm text-muted-foreground">Real-world applications</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-2">Ethical</div>
                    <p className="text-sm text-muted-foreground">Responsible AI practices</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-2">Simple</div>
                    <p className="text-sm text-muted-foreground">Easy to understand</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
