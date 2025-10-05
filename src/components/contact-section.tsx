import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Linkedin, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours to discuss your AI training needs.",
    });

    setFormData({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const teamMembers = [
    {
      name: "Neal Titus",
      role: "Founder/AI Coach",
      phone: "+27 71 156 6605",
      email: "Titus@aptivai.com"
    },
    {
      name: "Delano Duplessis", 
      role: "CEO/Operations Specialist",
      phone: "+27 62 252 5618",
      email: "Duplessis@aptivai.com"
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "General Phone",
      value: "+27 (0) 11 123 4567",
      link: "tel:+27111234567"
    },
    {
      icon: Mail,
      label: "General Email", 
      value: "info@aptivai.co.za",
      link: "mailto:info@aptivai.co.za"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect with us",
      link: "https://linkedin.com/company/aptivai"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Johannesburg, South Africa",
      link: "#"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Get <span className="bg-gradient-gold bg-clip-text text-transparent">Started?</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Let's discuss how we can help your team bridge the AI skills gap. 
            Book a consultation or send us a message to learn more about our services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                <Send className="h-6 w-6 text-accent mr-3" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:border-accent focus:ring-accent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:border-accent focus:ring-accent"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="border-border focus:border-accent focus:ring-accent"
                    placeholder="Your Company Ltd."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="border-border focus:border-accent focus:ring-accent resize-none"
                    placeholder="Tell us about your team's AI training needs, company size, industry, and any specific challenges you're facing..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent text-accent-foreground shadow-gold transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? "Sending..." : "Send Inquiry"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Team Members */}
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Our Leadership Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border-b border-border/30 last:border-b-0 pb-6 last:pb-0">
                    <h4 className="text-lg font-semibold text-foreground mb-1">{member.name}</h4>
                    <p className="text-accent font-medium mb-3">{member.role}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-accent" />
                        <a
                          href={`tel:${member.phone.replace(/\s/g, '')}`}
                          className="text-foreground hover:text-accent transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-accent" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-foreground hover:text-accent transition-colors"
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* General Contact */}
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  General Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <info.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {info.label}
                      </div>
                      <a
                        href={info.link}
                        className="text-foreground hover:text-accent transition-colors font-medium"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Why Choose AptivAI?
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Extensive South African corporate experience</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Practical, hands-on training approach</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Customized programs for your industry</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Ongoing support and resources</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;