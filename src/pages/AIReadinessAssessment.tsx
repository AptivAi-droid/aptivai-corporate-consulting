import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/page-header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const questions = [
  {
    id: 'current_ai_usage',
    question: 'How would you describe your organization\'s current AI usage?',
    type: 'radio',
    options: [
      'No AI usage - exploring possibilities',
      'Basic AI tools (ChatGPT, etc.)',
      'Some integrated AI solutions',
      'Advanced AI implementation',
    ]
  },
  {
    id: 'team_ai_literacy',
    question: 'What is your team\'s AI literacy level?',
    type: 'radio',
    options: [
      'Little to no AI knowledge',
      'Basic understanding of AI concepts',
      'Comfortable using AI tools',
      'Advanced AI practitioners',
    ]
  },
  {
    id: 'primary_goals',
    question: 'What are your primary goals for AI adoption?',
    type: 'textarea',
    placeholder: 'E.g., improve efficiency, reduce costs, enhance customer experience...'
  },
  {
    id: 'biggest_challenges',
    question: 'What are your biggest challenges or concerns about AI?',
    type: 'textarea',
    placeholder: 'E.g., lack of expertise, cost, data privacy, implementation complexity...'
  },
  {
    id: 'industry',
    question: 'What industry are you in?',
    type: 'radio',
    options: [
      'Technology',
      'Healthcare',
      'Finance',
      'Retail',
      'Manufacturing',
      'Education',
      'Other',
    ]
  },
  {
    id: 'company_size',
    question: 'What is your organization size?',
    type: 'radio',
    options: [
      'Solo / Freelancer',
      'Small (2-20 employees)',
      'Medium (21-100 employees)',
      'Large (100+ employees)',
    ]
  },
];

const AIReadinessAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleResponse = (value: string) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!responses[currentQuestion.id]) {
      toast({
        title: "Response required",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-readiness-assessment', {
        body: {
          responses,
          userId: user?.id || null,
        }
      });

      if (error) throw error;

      setResults(data);
      
      toast({
        title: "Assessment Complete!",
        description: "Your AI readiness report is ready.",
      });
    } catch (error: any) {
      console.error('Assessment error:', error);
      toast({
        title: "Assessment Failed",
        description: error.message || "Failed to complete assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    const { analysis } = results;
    
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader />
        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-accent">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-3xl">Your AI Readiness Score</CardTitle>
                <div className="text-6xl font-bold text-accent my-6">
                  {analysis.score}/100
                </div>
                <CardDescription className="text-lg">
                  {analysis.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths?.map((strength: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements?.map((improvement: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Recommended Next Steps</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-1">{i + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button 
                    onClick={() => navigate('/courses')}
                    className="flex-1"
                  >
                    Browse Courses
                  </Button>
                  <Button 
                    onClick={() => {
                      const element = document.querySelector("#contact");
                      if (element) {
                        navigate('/');
                        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Readiness Assessment</h1>
            <p className="text-xl text-muted-foreground">
              Discover where you stand and get personalized recommendations
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle>Question {currentStep + 1} of {questions.length}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-accent rounded-full h-2 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  {currentQuestion.question}
                </Label>

                {currentQuestion.type === 'radio' ? (
                  <RadioGroup 
                    value={responses[currentQuestion.id] || ''}
                    onValueChange={handleResponse}
                  >
                    {currentQuestion.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/5 cursor-pointer">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={responses[currentQuestion.id] || ''}
                    onChange={(e) => handleResponse(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="min-h-32"
                  />
                )}
              </div>

              <div className="flex gap-4">
                {currentStep > 0 && (
                  <Button 
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : isLastQuestion ? (
                    'Get Results'
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIReadinessAssessment;
