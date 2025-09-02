import { Linkedin, Mail, Phone } from "lucide-react";
import aptivaiLogo from "@/assets/aptivai-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-corporate-black text-white py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={aptivaiLogo} 
                alt="AptivAI Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">AptivAI</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Bridging the AI Skills Gap for Non-Technical Teams. 
              AI Made Practical, Ethical, and Simple.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/company/aptivai" 
                className="w-10 h-10 bg-corporate-grey rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@aptivai.co.za" 
                className="w-10 h-10 bg-corporate-grey rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="tel:+27111234567" 
                className="w-10 h-10 bg-corporate-grey rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#services" className="hover:text-accent transition-colors">
                  AI Awareness Workshops
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition-colors">
                  Hands-on AI Tool Training
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition-colors">
                  Future Skills Consulting
                </a>
              </li>
              <li>
                <a href="#training" className="hover:text-accent transition-colors">
                  Custom Training Programs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-accent" />
                <a href="tel:+27111234567" className="hover:text-accent transition-colors">
                  +27 (0) 11 123 4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-accent" />
                <a href="mailto:info@aptivai.co.za" className="hover:text-accent transition-colors">
                  info@aptivai.co.za
                </a>
              </li>
              <li className="text-gray-300">
                Johannesburg, South Africa
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-corporate-grey pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AptivAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;