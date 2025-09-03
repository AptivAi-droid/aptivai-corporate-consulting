import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, Lock, Sparkles, Users } from "lucide-react";
import { AIAgentHub } from "@/components/AIAgentHub";
import Navigation from "@/components/navigation";

const AIAgents = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Sign In Required</h2>
                <p className="text-muted-foreground">
                  Please sign in to access our AI agents and get personalized assistance.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to="/auth">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background to-primary/5 py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center space-y-4 mb-12">
              <div className="flex items-center justify-center space-x-2">
                <Bot className="w-12 h-12 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Assistant Hub
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Access our suite of specialized AI agents designed to accelerate your AI journey. 
                Get personalized assistance, insights, and recommendations tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* AI Agents Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <AIAgentHub />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Our AI Agents?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI agents are powered by advanced machine learning and designed 
                to provide intelligent, contextual assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Intelligent Responses</h3>
                  <p className="text-muted-foreground">
                    Get contextual, intelligent responses powered by advanced AI technology.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Personalized Experience</h3>
                  <p className="text-muted-foreground">
                    Each agent learns from your interactions to provide increasingly personalized assistance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Expert Knowledge</h3>
                  <p className="text-muted-foreground">
                    Access specialized knowledge and insights from AI industry experts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIAgents;