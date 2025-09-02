import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2, UserX, Shield, FileText, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const DataRightsManager = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDataExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      // Fetch user data from all relevant tables
      const [profileData, enrollmentsData, rolesData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id),
        supabase.from('course_enrollments').select('*, courses(title)').eq('student_id', user.id),
        supabase.from('user_roles').select('*').eq('user_id', user.id)
      ]);

      const userData = {
        profile: profileData.data?.[0] || null,
        enrollments: enrollmentsData.data || [],
        roles: rolesData.data || [],
        auth_metadata: {
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        },
        export_timestamp: new Date().toISOString(),
        note: "This export contains all personal data we have on file for your account in compliance with POPIA data portability rights."
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aptivai-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your personal data has been downloaded to your device.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Call edge function to handle account deletion
      const { error } = await supabase.functions.invoke('delete-user-account', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      toast({
        title: "Account deletion initiated",
        description: "Your account and all associated data will be permanently deleted within 30 days as required by POPIA.",
      });

      // Sign out the user
      await signOut();
    } catch (error) {
      console.error('Deletion error:', error);
      toast({
        title: "Deletion failed",
        description: "There was an error processing your account deletion. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConsentWithdrawal = () => {
    // Clear marketing consent
    localStorage.removeItem('marketingConsent');
    localStorage.removeItem('cookieConsent');
    
    toast({
      title: "Consent withdrawn",
      description: "Your marketing consent has been withdrawn. Cookie preferences have been reset.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-corporate-black mb-2">Data Rights & Privacy</h2>
        <p className="text-gray-600">
          Manage your personal data and privacy preferences in accordance with POPIA (Protection of Personal Information Act).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-accent" />
              Data Portability
            </CardTitle>
            <CardDescription>
              Download all your personal data we have on file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Exercise your right to data portability under POPIA. This will include your profile, 
              course enrollments, and account information in a structured format.
            </p>
            <Button 
              onClick={handleDataExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Exporting..." : "Export My Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Consent Management
            </CardTitle>
            <CardDescription>
              Withdraw consent for data processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Withdraw your consent for marketing communications and non-essential data processing. 
              This will not affect services you've already purchased.
            </p>
            <Button 
              onClick={handleConsentWithdrawal}
              variant="outline"
              className="w-full"
            >
              Withdraw Marketing Consent
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Correction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Data Correction
          </CardTitle>
          <CardDescription>
            Update or correct your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            You can update your profile information directly in your account settings. 
            For other corrections or if you believe we have inaccurate information, please contact us.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href="/profile">Update Profile</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:privacy@aptivai.co.za">Report Inaccuracy</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Account Deletion - Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-red-800 mb-2">Before you delete your account:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All your course progress and certificates will be permanently lost</li>
              <li>• You will lose access to any paid courses</li>
              <li>• This action cannot be undone</li>
              <li>• Deletion will be completed within 30 days as required by POPIA</li>
              <li>• Some data may be retained for legal compliance (e.g., financial records for tax purposes)</li>
            </ul>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <UserX className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Account Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Are you absolutely sure? This action cannot be undone and will permanently delete:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Your account and profile information</li>
                    <li>All course enrollments and progress</li>
                    <li>Certificates and achievements</li>
                    <li>Communication history</li>
                  </ul>
                  <p className="text-red-600 font-medium">
                    Deletion will be completed within 30 days in compliance with POPIA requirements.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAccountDeletion}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Processing..." : "Yes, Delete My Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-corporate-black">Data Protection Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-3">
            For any questions about your data rights, privacy concerns, or to file a complaint:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Data Protection Officer:</strong> <a href="mailto:privacy@aptivai.co.za" className="text-accent hover:underline">privacy@aptivai.co.za</a></p>
            <p><strong>Phone:</strong> +27 (0) 11 123 4567</p>
            <p><strong>Information Regulator:</strong> <a href="mailto:inforeg@justice.gov.za" className="text-accent hover:underline">inforeg@justice.gov.za</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};