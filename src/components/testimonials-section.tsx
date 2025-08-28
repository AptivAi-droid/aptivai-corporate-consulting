import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "Operations Manager",
      company: "Financial Services",
      content: "AptivAI transformed our team's understanding of AI. What seemed intimidating became accessible and practical. Our productivity has increased significantly since the training.",
      rating: 5,
      logo: "🏦"
    },
    {
      name: "Michael M.", 
      role: "Call Center Director",
      company: "Customer Service",
      content: "The hands-on approach was exactly what we needed. Our agents now confidently use AI tools to enhance customer interactions while maintaining the personal touch.",
      rating: 5,
      logo: "📞"
    },
    {
      name: "Priya P.",
      role: "HR Director", 
      company: "Retail Industry",
      content: "The future skills consulting helped us prepare our workforce strategically. We now have a clear roadmap for AI adoption across all departments.",
      rating: 5,
      logo: "🛒"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our <span className="text-accent">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Trusted by leading South African companies to bridge the AI skills gap 
            and empower their teams with practical AI knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-accent/30 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4 text-xl">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-accent font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Focus */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Empowering Teams Across Industries
          </h3>
          <p className="text-muted-foreground">
            Ready to transform your team's AI capabilities? Let's discuss your specific needs.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <p className="text-muted-foreground">Professionals Trained</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <p className="text-muted-foreground">Companies Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">2+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;