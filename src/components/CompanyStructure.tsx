import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bot, Shield, AlertTriangle } from "lucide-react";

interface Role {
  title: string;
  name?: string;
  department: string;
  type: 'human' | 'ai';
  goals: string[];
  oversight: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const companyRoles: Role[] = [
  // Executive Leadership
  {
    title: "CEO (Human)",
    name: "Neal Titus",
    department: "Executive Leadership",
    type: "human",
    goals: ["Strategic leadership", "Company vision", "Partnership development"],
    oversight: ["All major business decisions", "AI agent performance monitoring"],
    riskLevel: "high"
  },

  // Finance Department
  {
    title: "Finance Manager",
    department: "Finance Department",
    type: "human",
    goals: ["Budget management", "Financial planning", "Reporting"],
    oversight: ["Reports to CEO/Directors for approval"],
    riskLevel: "high"
  },
  {
    title: "Accounts Assistant",
    department: "Finance Department",
    type: "human",
    goals: ["Invoice processing", "Payroll management", "Daily financial tasks"],
    oversight: ["All payroll releases require human approval"],
    riskLevel: "medium"
  },

  // Marketing Department
  {
    title: "Marketing Manager",
    department: "Marketing Department",
    type: "human",
    goals: ["Marketing strategy", "Campaign management", "Performance tracking"],
    oversight: ["Campaign budgets approved by CEO", "External communications review"],
    riskLevel: "medium"
  },
  {
    title: "Content Specialist",
    department: "Marketing Department",
    type: "human",
    goals: ["Content creation", "Social media management", "Newsletter management"],
    oversight: ["Sensitive content requires approval"],
    riskLevel: "low"
  },

  // Operations Department
  {
    title: "Operations Manager",
    department: "Operations Department",
    type: "human",
    goals: ["Process optimization", "Project implementation", "Resource management"],
    oversight: ["Major process changes require approval"],
    riskLevel: "medium"
  },
  {
    title: "Support Staff",
    department: "Operations Department",
    type: "human",
    goals: ["Daily operations", "Project coordination", "Administrative support"],
    oversight: ["Escalates risks to Operations Manager"],
    riskLevel: "low"
  },

  // AI Agents
  {
    title: "AI Consultation Scheduler",
    department: "AI Agents",
    type: "ai",
    goals: ["Lead qualification", "Consultation booking", "Requirements collection"],
    oversight: ["Personal data collection reviewed by humans", "Booking confirmations manual"],
    riskLevel: "medium"
  },
  {
    title: "AI Readiness Assessment Bot",
    department: "AI Agents",
    type: "ai",
    goals: ["Readiness questionnaires", "Report generation", "Recommendations"],
    oversight: ["Final reports verified before client delivery"],
    riskLevel: "medium"
  },
  {
    title: "Course Recommendation Engine",
    department: "AI Agents",
    type: "ai",
    goals: ["Training module recommendations", "Learning path guidance", "User enrollment"],
    oversight: ["Enrollment and payment processing reviewed manually"],
    riskLevel: "high"
  },
  {
    title: "Lead Intelligence Assistant",
    department: "AI Agents",
    type: "ai",
    goals: ["Visitor analysis", "Lead scoring", "Follow-up suggestions"],
    oversight: ["High-value leads flagged for human review"],
    riskLevel: "medium"
  },
  {
    title: "Content Personalization Agent",
    department: "AI Agents",
    type: "ai",
    goals: ["Content adaptation", "A/B testing", "User experience optimization"],
    oversight: ["Personal data personalization requires human approval"],
    riskLevel: "medium"
  }
];

const departments = [
  "Executive Leadership",
  "Finance Department", 
  "Marketing Department",
  "Operations Department",
  "AI Agents"
];

const CompanyStructure = () => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'ai' ? <Bot className="h-4 w-4" /> : <Users className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">AptivAI Virtual Company Structure</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A hybrid organizational structure combining human expertise with AI agents, 
          ensuring compliance with South African law and POPIA regulations.
        </p>
      </div>

      <div className="grid gap-6">
        {departments.map((dept) => (
          <Card key={dept} className="border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                {dept}
              </CardTitle>
              <CardDescription>
                {dept === "AI Agents" ? 
                  "Automated systems with human oversight for critical decisions" :
                  "Human-led department with defined oversight protocols"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {companyRoles
                  .filter(role => role.department === dept)
                  .map((role, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getTypeIcon(role.type)}
                            {role.title}
                          </CardTitle>
                          <Badge variant={getRiskColor(role.riskLevel)}>
                            {role.riskLevel} risk
                          </Badge>
                        </div>
                        {role.name && (
                          <p className="text-sm font-medium text-accent">{role.name}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2">Goals:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {role.goals.map((goal, i) => (
                              <li key={i}>• {goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Oversight Requirements:
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {role.oversight.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Shield className="h-5 w-5" />
            Compliance & Oversight Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">POPIA Compliance Requirements:</h5>
              <ul className="text-sm space-y-1">
                <li>• All personal data collection requires explicit consent</li>
                <li>• Data processing must have clear business purpose</li>
                <li>• Users can opt-out of personalization</li>
                <li>• Interaction logs maintained for transparency</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Human Oversight Triggers:</h5>
              <ul className="text-sm space-y-1">
                <li>• High-value leads (8+ score)</li>
                <li>• Contract negotiations and payments</li>
                <li>• Sensitive personalization using personal data</li>
                <li>• Final reports before client delivery</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm">
              View Oversight Dashboard
            </Button>
            <Button variant="outline" size="sm">
              Compliance Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyStructure;