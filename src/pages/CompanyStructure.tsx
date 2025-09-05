import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyStructure from "@/components/CompanyStructure";
import OversightDashboard from "@/components/OversightDashboard";
import ComplianceLog from "@/components/ComplianceLog";
import Navigation from "@/components/navigation";

const CompanyStructurePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Tabs defaultValue="structure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">Company Structure</TabsTrigger>
              <TabsTrigger value="oversight">Oversight Dashboard</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Log</TabsTrigger>
            </TabsList>

            <TabsContent value="structure">
              <CompanyStructure />
            </TabsContent>

            <TabsContent value="oversight">
              <OversightDashboard />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceLog />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyStructurePage;