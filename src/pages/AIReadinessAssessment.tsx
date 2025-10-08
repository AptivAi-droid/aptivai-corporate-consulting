import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "How familiar is your team with AI tools?",
    type: "radio",
    options: ["Beginner - We're just starting", "Some experience - We've tried a few things", "Advanced - We use AI regularly"]
  },
  {
    id: 2,
    question: "What's your biggest challenge with AI?",
    type: "radio",
    options: ["Don't know where to start", "Too technical for our team", "Implementation concerns", "Budget constraints"]
  },
  {
    id: 3,
    question: "What's your role?",
    type: "radio",
    options: ["HR / People Operations", "Manager / Team Lead", "Operations / Admin", "Individual Contributor"]
  },
  {
    id: 4,
    question: "How many people will be using AI training?",
    type: "radio",
    options: ["Just me", "2-10 people", "11-50 people", "50+ people"]
  },
  {
    id: 5,
    question: "What industry are you in?",
    type: "radio",
    options: ["Banking / Finance", "Call Center / Customer Service", "Healthcare", "Retail", "Tech / Software", "Other"]
  },
  {
    id: 6,
    question: "Finally, what's your email? We'll send your personalized report.",
    type: "email",
    placeholder: "your.email@company.com"
  },
];

const AIReadinessAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [agentMessage, setAgentMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Agent greeting message on mount
    setTimeout(() => {
      setAgentMessage("Hi! I'm your AI Readiness Agent. I'll guide you through a quick assessment to understand your team's AI readiness. Ready to start?");
    }, 500);
  }, []);

  const currentQuestion = questions[currentStep];

  const handleResponse = (value: string) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!responses[currentQuestion.id]) {
      toast({
        title: "Response required",
        description: "Please provide an answer before continuing.",
        variant: "destructive"
      });
      return;
    }

    // Agent provides feedback
    if (currentStep < questions.length - 1) {
      setAgentMessage("Got it! Let me ask you another quick question...");
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAgentMessage("Perfect! Let me analyze your responses and create your personalized learning path...");
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-readiness-assessment', {
        body: { responses }
      });

      if (error) throw error;

      // Calculate basic readiness level
      const level = calculateReadinessLevel(responses);
      setResults({ ...data, level });
      
      toast({
        title: "Assessment Complete!",
        description: "Your AI readiness results are ready.",
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to process your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateReadinessLevel = (responses: Record<number, string>) => {
    // Simple logic to determine level
    const familiarity = responses[1];
    if (familiarity?.includes("Advanced")) return "Advanced";
    if (familiarity?.includes("Some experience")) return "Intermediate";
    return "Beginner";
  };

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-4xl mx-auto border-accent/20 shadow-elegant">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Your Readiness Level: {results.level}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="text-center p-6 bg-accent/5 rounded-lg border border-accent/10">
                <p className="text-lg text-muted-foreground mb-4">
                  Based on your responses, here's your personalized learning path:
                </p>
                <p className="text-base text-muted-foreground">
                  {results.level === "Beginner" && "Start with Module 1: AI Basics for Non-Technical Teams"}
                  {results.level === "Intermediate" && "Jump to Module 2: Practical AI Tools You Can Use Today"}
                  {results.level === "Advanced" && "Begin with Module 3: Implementing AI in Your Workflow"}
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  Your Full Report
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm text-muted-foreground">
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      value={responses[6] || ""}
                      disabled
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We've sent your detailed assessment report and next steps to your email.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => window.location.href = '/courses'}
                >
                  Start Module 1 Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.location.href = '#contact'}
                >
                  Book a Strategy Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Card className="border-accent/20 shadow-elegant">
            {/* Agent Avatar & Message */}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold mb-2">
                AI Readiness Agent
              </CardTitle>
              {agentMessage && (
                <div className="bg-card border border-border/50 rounded-lg p-4 mt-4 text-left">
                  <p className="text-muted-foreground italic">{agentMessage}</p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-accent">
                    {Math.round(((currentStep + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>
                <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
              </div>

              {/* Question */}
              <div className="min-h-[300px] pt-4">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.type === "radio" && (
                  <RadioGroup
                    value={responses[currentQuestion.id] || ""}
                    onValueChange={(value) => handleResponse(value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option) => (
                        <div 
                          key={option} 
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label 
                            htmlFor={option} 
                            className="flex-1 cursor-pointer text-base"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "email" && (
                  <Input
                    type="email"
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleResponse(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="text-base"
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-6 border-t">
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
                >
                  {isSubmitting ? (
                    "Analyzing..."
                  ) : currentStep === questions.length - 1 ? (
                    <>
                      Get My Results
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIReadinessAssessment;
