import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import aptivaiLogo from "@/assets/aptivai-logo.png";

interface PageHeaderProps {
  showBackButton?: boolean;
}

const PageHeader = ({ showBackButton = true }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center h-16 gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={aptivaiLogo} 
              alt="AptivAI Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-foreground">AptivAI</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
