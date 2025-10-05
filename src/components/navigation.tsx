import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import aptivaiLogo from "@/assets/aptivai-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "#hero", type: "scroll" },
    { label: "About", href: "#about", type: "scroll" },
    { label: "Services", href: "#services", type: "scroll" },
    { label: "Training", href: "#training", type: "scroll" },
    { label: "Courses", href: "/courses", type: "link" },
    { label: "AI Agents", href: "/ai-agents", type: "link" },
    { label: "AI Readiness", href: "/ai-readiness", type: "link" },
    { label: "Contact", href: "#contact", type: "scroll" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === "scroll") {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.href);
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={aptivaiLogo} 
              alt="AptivAI Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-foreground">AptivAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/courses')}>
                      <User className="h-4 w-4 mr-2" />
                      My Courses
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleNavClick({ label: "Contact", href: "#contact", type: "scroll" })}
                  className="border-accent/30 text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  Book Consultation
                </Button>
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="text-left text-muted-foreground hover:text-accent transition-colors"
                >
                  {item.label}
                </button>
              ))}
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {isAdmin && (
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleNavClick({ label: "Contact", href: "#contact", type: "scroll" })}
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground w-full"
                  >
                    Book Consultation
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;