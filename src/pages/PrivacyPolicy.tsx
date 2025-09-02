import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 lg:px-6 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-corporate-black mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                AptivAI (Pty) Ltd ("AptivAI", "we", "our", or "us") is committed to protecting your privacy and personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable South African laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website, services, and training programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">We collect the following categories of personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Identity information:</strong> Full name, email address</li>
                <li><strong>Contact information:</strong> Email address, phone number (if provided)</li>
                <li><strong>Account information:</strong> Username, password (encrypted), profile preferences</li>
                <li><strong>Educational information:</strong> Course enrollment data, progress tracking, certificates earned</li>
                <li><strong>Technical information:</strong> IP address, browser type, device information, usage patterns</li>
                <li><strong>Communication data:</strong> Messages, support requests, feedback</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">2.2 How We Collect Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Directly from you when you register, enroll in courses, or contact us</li>
                <li>Automatically through cookies and similar technologies</li>
                <li>From third-party payment processors (transaction data only)</li>
                <li>Through our learning management system during course participation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">3. Purpose and Lawful Basis for Processing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We process your personal information for the following purposes:</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold text-corporate-black mb-3">Educational Services (Contractual Performance)</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Providing access to courses and training materials</li>
                  <li>Tracking your learning progress and issuing certificates</li>
                  <li>Processing payments and managing enrollments</li>
                  <li>Providing customer support</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold text-corporate-black mb-3">Legitimate Business Interests</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Improving our services and course content</li>
                  <li>Website analytics and performance optimization</li>
                  <li>Fraud prevention and security</li>
                  <li>Business development and partnerships</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold text-corporate-black mb-3">Legal Compliance</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Tax and accounting requirements</li>
                  <li>Regulatory reporting</li>
                  <li>Law enforcement requests</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-corporate-black mb-3">With Your Consent</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Marketing communications</li>
                  <li>Optional data collection for research</li>
                  <li>Non-essential cookies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, cloud hosting providers, email services (under strict data processing agreements)</li>
                <li><strong>Legal Requirements:</strong> When required by South African law or court orders</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (with proper notice)</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">5. Your Rights Under POPIA</h2>
              <p className="text-gray-700 leading-relaxed mb-4">As a data subject under POPIA, you have the following rights:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Access</h4>
                  <p className="text-gray-700 text-sm">Request copies of your personal information</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Correction</h4>
                  <p className="text-gray-700 text-sm">Update inaccurate or incomplete information</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Deletion</h4>
                  <p className="text-gray-700 text-sm">Request deletion of your personal information</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Objection</h4>
                  <p className="text-gray-700 text-sm">Object to processing of your information</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Portability</h4>
                  <p className="text-gray-700 text-sm">Receive your data in a portable format</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-corporate-black mb-2">Withdraw Consent</h4>
                  <p className="text-gray-700 text-sm">Revoke consent for processing</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@aptivai.co.za" className="text-accent hover:underline">privacy@aptivai.co.za</a> or use the data management tools in your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">6. Data Security and Retention</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">6.1 Security Measures</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure cloud storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Multi-factor authentication for admin access</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">6.2 Data Retention</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Account Data:</strong> Retained while account is active, deleted within 30 days of account closure</li>
                <li><strong>Course Data:</strong> Retained for 7 years for certification purposes (legal requirement)</li>
                <li><strong>Financial Records:</strong> Retained for 5 years (tax compliance)</li>
                <li><strong>Marketing Data:</strong> Retained until consent is withdrawn</li>
                <li><strong>Technical Logs:</strong> Retained for 12 months for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Ensure website functionality and security</li>
                <li>Remember your preferences and login status</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized content (with consent)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can manage cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your data may be processed outside South Africa by our cloud service providers. We ensure adequate protection through standard contractual clauses and adequacy decisions recognized under South African law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under 18. We do not knowingly collect personal information from minors. If you believe we have collected information from a minor, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">10. Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes via email or prominent website notice at least 30 days before implementation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">11. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-corporate-black mb-3">Data Protection Officer</h4>
                <p className="text-gray-700 mb-2">AptivAI (Pty) Ltd</p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@aptivai.co.za" className="text-accent hover:underline">privacy@aptivai.co.za</a></p>
                <p className="text-gray-700 mb-4">Phone: +27 (0) 11 123 4567</p>
                
                <h4 className="font-semibold text-corporate-black mb-3">Information Regulator</h4>
                <p className="text-gray-700 mb-2">If you have concerns about our data processing, you may lodge a complaint with:</p>
                <p className="text-gray-700 mb-1">Information Regulator South Africa</p>
                <p className="text-gray-700 mb-1">Email: inforeg@justice.gov.za</p>
                <p className="text-gray-700">Phone: +27 (0) 12 406 4818</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;