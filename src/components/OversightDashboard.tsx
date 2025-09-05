import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, User, Bot, FileText } from "lucide-react";

interface OversightItem {
  id: string;
  type: 'consultation' | 'assessment' | 'enrollment' | 'lead' | 'personalization';
  title: string;
  description: string;
  agent: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  data: any;
}

// Mock data for demonstration
const oversightItems: OversightItem[] = [
  {
    id: "1",
    type: "consultation",
    title: "High-Value Consultation Booking",
    description: "CEO from TechCorp (500+ employees) requesting AI transformation consultation",
    agent: "AI Consultation Scheduler",
    priority: "high",
    status: "pending",
    timestamp: "2024-01-15T14:30:00Z",
    data: { company: "TechCorp", size: "500+", budget: "R50k+" }
  },
  {
    id: "2", 
    type: "assessment",
    title: "AI Readiness Report - Manufacturing Co",
    description: "Complete readiness assessment for medium-scale manufacturing company",
    agent: "AI Readiness Assessment Bot",
    priority: "medium",
    status: "pending",
    timestamp: "2024-01-15T13:15:00Z",
    data: { industry: "Manufacturing", employees: 150, techLevel: "Basic" }
  },
  {
    id: "3",
    type: "enrollment",
    title: "Corporate Training Package - FinanceCorp",
    description: "Enterprise training enrollment for 25 staff members (R75k value)",
    agent: "Course Recommendation Engine", 
    priority: "high",
    status: "approved",
    timestamp: "2024-01-15T11:45:00Z",
    data: { company: "FinanceCorp", participants: 25, value: "R75000" }
  },
  {
    id: "4",
    type: "lead",
    title: "High-Score Lead Analysis",
    description: "Lead scored 9/10 - Multiple return visits, downloaded resources",
    agent: "Lead Intelligence Assistant",
    priority: "medium", 
    status: "pending",
    timestamp: "2024-01-15T10:20:00Z",
    data: { score: 9, visits: 5, downloads: 3, role: "CTO" }
  },
  {
    id: "5",
    type: "personalization",
    title: "Executive Content Personalization",
    description: "Request to personalize content using LinkedIn profile data",
    agent: "Content Personalization Agent",
    priority: "medium",
    status: "rejected",
    timestamp: "2024-01-15T09:30:00Z",
    data: { profileType: "Executive", dataSource: "LinkedIn", consentStatus: "Not obtained" }
  }
];

const OversightDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [items, setItems] = useState(oversightItems);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-4 w-4" />;
      case 'assessment': return <FileText className="h-4 w-4" />;
      case 'enrollment': return <CheckCircle className="h-4 w-4" />;
      case 'lead': return <AlertTriangle className="h-4 w-4" />;
      case 'personalization': return <Bot className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
  };

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
  };

  const filterItemsByStatus = (status: string) => {
    if (status === 'all') return items;
    return items.filter(item => item.status === status);
  };

  const pendingCount = items.filter(item => item.status === 'pending').length;
  const highPriorityCount = items.filter(item => item.priority === 'high' && item.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Human Oversight Dashboard</h2>
          <p className="text-muted-foreground">
            Review and approve AI agent actions requiring human oversight
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {pendingCount} Pending
          </Badge>
          {highPriorityCount > 0 && (
            <Badge variant="destructive">
              {highPriorityCount} High Priority
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
          </TabsTrigger>
          <TabsTrigger value="all">
            All Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filterItemsByStatus('pending').map((item) => (
            <Card key={item.id} className="border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{item.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  Agent: {item.agent} • {new Date(item.timestamp).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <h5 className="font-medium mb-2">Request Details:</h5>
                  <pre className="text-sm text-muted-foreground">
                    {JSON.stringify(item.data, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(item.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {['approved', 'rejected', 'all'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterItemsByStatus(status).map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority} priority
                      </Badge>
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                  <p className="text-sm text-muted-foreground">
                    Agent: {item.agent} • {new Date(item.timestamp).toLocaleString()}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OversightDashboard;