import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Brain, 
  BookOpen, 
  Users, 
  Sparkles,
  ArrowRight,
  Bot,
  Briefcase
} from "lucide-react";
import { AIChat } from "./AIChat";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  features: string[];
  color: string;
}

const aiAgents: AIAgent[] = [
  {
    id: "consultation-scheduler",
    name: "Consultation Scheduler",
    description: "Schedule personalized AI strategy consultations",
    detailedDescription: "I help you schedule and prepare for personalized AI strategy consultations. I can find the best time slots, understand your business needs, and ensure you get the most out of your consultation.",
    icon: Calendar,
    category: "Scheduling",
    features: ["Smart scheduling", "Business needs analysis", "Consultation prep"],
    color: "bg-blue-500/10 text-blue-700 border-blue-200"
  },
  {
    id: "ai-readiness-assessment",
    name: "AI Readiness Assessment",
    description: "Evaluate your organization's AI readiness",
    detailedDescription: "I conduct comprehensive assessments to evaluate your organization's readiness for AI implementation. I analyze your current infrastructure, team capabilities, and business processes to provide actionable recommendations.",
    icon: Brain,
    category: "Assessment",
    features: ["Infrastructure analysis", "Team evaluation", "Readiness scoring"],
    color: "bg-purple-500/10 text-purple-700 border-purple-200"
  },
  {
    id: "course-recommendation-engine",
    name: "Course Recommendation Engine",
    description: "Get personalized course recommendations",
    detailedDescription: "I analyze your learning goals, current skill level, and career objectives to recommend the most suitable courses. I provide personalized learning paths and help you achieve your AI education goals.",
    icon: BookOpen,
    category: "Education",
    features: ["Personalized recommendations", "Learning path creation", "Skill gap analysis"],
    color: "bg-green-500/10 text-green-700 border-green-200"
  },
  {
    id: "lead-intelligence-assistant",
    name: "Lead Intelligence Assistant",
    description: "Intelligent lead qualification and insights",
    detailedDescription: "I help qualify leads by understanding their business needs, challenges, and AI readiness. I provide intelligent insights to help convert prospects into customers with personalized recommendations.",
    icon: Users,
    category: "Sales",
    features: ["Lead qualification", "Business analysis", "Conversion optimization"],
    color: "bg-orange-500/10 text-orange-700 border-orange-200"
  },
  {
    id: "content-personalization-agent",
    name: "Content Personalization Agent",
    description: "Personalized content and learning experiences",
    detailedDescription: "I create personalized content recommendations and learning experiences based on your preferences, learning style, and progress. I adapt content to match your pace and interests.",
    icon: Sparkles,
    category: "Personalization",
    features: ["Content adaptation", "Learning style matching", "Progress tracking"],
    color: "bg-pink-500/10 text-pink-700 border-pink-200"
  },
  {
    id: "business-consultant",
    name: "Business Consultant",
    description: "Expert strategic guidance for growth and operations",
    detailedDescription: "I provide expert guidance on business strategy, operations, and growth. I help identify challenges, design solutions, and implement improvements while ensuring measurable results. I conduct strategic analysis, provide actionable recommendations, support implementation, and track performance with clear KPIs.",
    icon: Briefcase,
    category: "Consulting",
    features: ["Strategic analysis", "Growth recommendations", "KPI tracking", "Implementation roadmaps"],
    color: "bg-indigo-500/10 text-indigo-700 border-indigo-200"
  }
];

export const AIAgentHub = () => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  if (selectedAgent) {
    return (
      <div className="h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            onClick={() => setSelectedAgent(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to AI Agents
          </Button>
        </div>
        <div className="flex-1">
          <AIChat
            agentType={selectedAgent.id}
            agentName={selectedAgent.name}
            agentDescription={selectedAgent.detailedDescription}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Bot className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">AI Agent Hub</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our specialized AI agents to get personalized assistance with your AI journey. 
          Each agent is designed to help you with specific aspects of AI implementation and learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiAgents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <Card 
              key={agent.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-muted hover:border-primary/20"
              onClick={() => setSelectedAgent(agent)}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${agent.color} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {agent.category}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {agent.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Key Features:</h4>
                  <ul className="space-y-1">
                    {agent.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  Start Conversation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Need Help Choosing?</h3>
            <p className="text-muted-foreground mb-4">
              Not sure which AI agent to start with? Our agents can work together to provide comprehensive support.
            </p>
            <Button variant="outline">
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};