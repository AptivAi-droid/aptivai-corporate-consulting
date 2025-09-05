import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Search, Filter, Shield, AlertCircle } from "lucide-react";

interface ComplianceLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  userConsent: boolean;
  dataCollected: string[];
  purpose: string;
  retention: string;
  status: 'compliant' | 'review-required' | 'non-compliant';
  notes: string;
}

// Mock compliance log data
const complianceLog: ComplianceLogEntry[] = [
  {
    id: "LOG-001",
    timestamp: "2024-01-15T14:30:00Z",
    agent: "AI Consultation Scheduler",
    action: "Collected contact information for consultation booking",
    userConsent: true,
    dataCollected: ["name", "email", "phone", "company name", "preferred meeting time"],
    purpose: "Scheduling business consultation as requested by user",
    retention: "24 months or until consultation completed",
    status: "compliant",
    notes: "User provided explicit consent before data collection. POPIA notice displayed."
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-15T13:45:00Z", 
    agent: "Lead Intelligence Assistant",
    action: "Analyzed visitor behavior patterns",
    userConsent: false,
    dataCollected: ["page views", "time on site", "click patterns", "referral source"],
    purpose: "Lead scoring and sales intelligence (behavioral data only)",
    retention: "6 months",
    status: "compliant",
    notes: "Only behavioral data analyzed, no personal identifiers collected without consent."
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-15T12:20:00Z",
    agent: "Content Personalization Agent", 
    action: "Attempted LinkedIn profile integration",
    userConsent: false,
    dataCollected: [],
    purpose: "Personalizing website content based on professional profile",
    retention: "N/A - action blocked",
    status: "review-required",
    notes: "BLOCKED: Attempted to access LinkedIn data without explicit user consent. Human oversight required."
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-15T11:15:00Z",
    agent: "AI Readiness Assessment Bot",
    action: "Collected assessment responses",
    userConsent: true,
    dataCollected: ["company size", "industry", "technology stack", "email for report delivery"],
    purpose: "Generating AI readiness assessment report",
    retention: "12 months for report delivery and follow-up",
    status: "compliant", 
    notes: "User consented to data collection for assessment purposes. Report flagged for human review."
  },
  {
    id: "LOG-005",
    timestamp: "2024-01-15T10:30:00Z",
    agent: "Course Recommendation Engine",
    action: "Stored learning preferences",
    userConsent: true,
    dataCollected: ["learning goals", "skill level", "time availability", "email"],
    purpose: "Providing personalized course recommendations",
    retention: "Duration of course enrollment plus 6 months",
    status: "compliant",
    notes: "Consent obtained for educational recommendations. Data minimization applied."
  },
  {
    id: "LOG-006",
    timestamp: "2024-01-14T16:45:00Z",
    agent: "Lead Intelligence Assistant",
    action: "IP geolocation lookup",
    userConsent: false,
    dataCollected: ["approximate location (city level)", "timezone"],
    purpose: "Scheduling optimization and regional content display",
    retention: "Session only",
    status: "compliant",
    notes: "City-level geolocation for scheduling purposes. No precise location stored."
  }
];

const ComplianceLog = () => {
  const [logs, setLogs] = useState(complianceLog);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'default';
      case 'review-required': return 'secondary';
      case 'non-compliant': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesAgent = agentFilter === "all" || log.agent === agentFilter;
    
    return matchesSearch && matchesStatus && matchesAgent;
  });

  const uniqueAgents = [...new Set(logs.map(log => log.agent))];
  const complianceStats = {
    total: logs.length,
    compliant: logs.filter(log => log.status === 'compliant').length,
    reviewRequired: logs.filter(log => log.status === 'review-required').length,
    nonCompliant: logs.filter(log => log.status === 'non-compliant').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            POPIA Compliance Log
          </h2>
          <p className="text-muted-foreground">
            Complete audit trail of AI agent data collection and processing activities
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Compliance Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{complianceStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{complianceStats.compliant}</div>
            <div className="text-sm text-muted-foreground">Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{complianceStats.reviewRequired}</div>
            <div className="text-sm text-muted-foreground">Review Required</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{complianceStats.nonCompliant}</div>
            <div className="text-sm text-muted-foreground">Non-Compliant</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="review-required">Review Required</SelectItem>
                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {uniqueAgents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <CardTitle className="text-lg">{log.id}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(log.status)}>
                      {log.status.replace('-', ' ')}
                    </Badge>
                    {log.status === 'review-required' && (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
                <CardDescription>
                  {log.agent} • {new Date(log.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Action Performed:</h5>
                  <p className="text-sm">{log.action}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">User Consent:</h5>
                    <Badge variant={log.userConsent ? "default" : "secondary"}>
                      {log.userConsent ? "✓ Obtained" : "Not required"}
                    </Badge>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Purpose:</h5>
                    <p className="text-sm">{log.purpose}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Data Collected:</h5>
                  <div className="flex flex-wrap gap-1">
                    {log.dataCollected.length > 0 ? (
                      log.dataCollected.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No personal data collected</span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Retention Period:</h5>
                  <p className="text-sm">{log.retention}</p>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Compliance Notes:</h5>
                  <p className="text-sm bg-muted p-3 rounded-lg">{log.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComplianceLog;