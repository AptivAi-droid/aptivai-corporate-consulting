import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Cookie, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const saveConsent = (acceptAll = false) => {
    const finalPreferences = acceptAll
      ? { necessary: true, functional: true, analytics: true, marketing: true }
      : preferences;

    localStorage.setItem("cookieConsent", JSON.stringify(finalPreferences));
    setShowBanner(false);
    setShowSettings(false);

    // Apply cookie settings
    applyCookieSettings(finalPreferences);
  };

  const applyCookieSettings = (prefs: typeof preferences) => {
    // Remove non-essential cookies if not consented
    if (!prefs.analytics) {
      // Remove analytics cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes("_ga") || name.includes("_gid") || name.includes("_gtag")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    }

    if (!prefs.marketing) {
      // Remove marketing cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes("_fbp") || name.includes("_fbc")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    }
  };

  const handlePreferenceChange = (category: keyof typeof preferences) => {
    if (category === "necessary") return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <Card className="mx-auto max-w-4xl bg-white border-2 border-accent shadow-lg">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Cookie className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-corporate-black mb-2">
                    Cookie Consent - POPIA Compliance
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    We use cookies to enhance your experience, analyze website performance, and provide personalized content. 
                    In accordance with the Protection of Personal Information Act (POPIA), we need your consent for non-essential cookies. 
                    Essential cookies for security and functionality are always active.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => saveConsent(true)} className="bg-accent hover:bg-accent/90">
                      Accept All
                    </Button>
                    <Button variant="outline" onClick={() => saveConsent(false)}>
                      Accept Essential Only
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowSettings(true)}
                      className="text-accent hover:text-accent/90"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-accent" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="necessary"
                  checked={preferences.necessary}
                  disabled={true}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="necessary" className="font-semibold text-corporate-black">
                    Essential Cookies (Required)
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    These cookies are necessary for the website to function and cannot be disabled. 
                    They include authentication, security, and basic functionality cookies.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Examples:</strong> Session cookies, CSRF protection, load balancing
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={() => handlePreferenceChange('functional')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="functional" className="font-semibold text-corporate-black cursor-pointer">
                    Functional Cookies
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Examples:</strong> Language preferences, theme settings, course progress
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={() => handlePreferenceChange('analytics')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="analytics" className="font-semibold text-corporate-black cursor-pointer">
                    Analytics Cookies
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    These cookies help us understand how visitors interact with our website by collecting anonymous information.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Examples:</strong> Google Analytics, page views, user journey tracking
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={() => handlePreferenceChange('marketing')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="marketing" className="font-semibold text-corporate-black cursor-pointer">
                    Marketing Cookies
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    These cookies are used to deliver personalized advertisements and track the effectiveness of marketing campaigns.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting cookies
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-corporate-black mb-2">Your Rights Under POPIA</h4>
              <p className="text-sm text-gray-700">
                You have the right to withdraw your consent at any time. You can also request access to, 
                correction of, or deletion of your personal information. Contact us at{" "}
                <a href="mailto:privacy@aptivai.co.za" className="text-accent hover:underline">
                  privacy@aptivai.co.za
                </a>{" "}
                to exercise these rights.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => saveConsent(false)} className="bg-accent hover:bg-accent/90">
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};