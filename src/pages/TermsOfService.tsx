import PageHeader from "@/components/page-header";
import Footer from "@/components/footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      <main className="container mx-auto px-4 lg:px-6 py-12 mt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-corporate-black mb-8">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">1. Agreement and Acceptance</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and AptivAI (Pty) Ltd, a company incorporated under the laws of South Africa, registration number [XXXX/XXXX/XX] ("AptivAI", "we", "our", or "us").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our website, services, or training programs, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">2. Services Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">AptivAI provides:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>AI awareness workshops and training programs</li>
                <li>Online courses and educational content</li>
                <li>Digital certificates and credentials</li>
                <li>Consulting services related to AI implementation</li>
                <li>Access to learning management systems and platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">3. User Eligibility and Accounts</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">3.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old and have the legal capacity to enter into contracts under South African law. By using our services, you represent and warrant that you meet these requirements.
              </p>

              <h3 className="text-xl font-medium text-corporate-black mb-3">3.2 Account Registration</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to notify us immediately of any unauthorized access to your account</li>
                <li>You are liable for all activities that occur under your account</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">3.3 Account Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account for violation of these Terms, illegal activities, or other reasons we deem necessary for the protection of our services or other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">4. Course Enrollment and Payment</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">4.1 Course Access</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Paid courses require full payment before access is granted</li>
                <li>Course materials are licensed to you for personal, non-commercial use</li>
                <li>Course access is non-transferable and non-refundable unless otherwise specified</li>
                <li>We reserve the right to modify course content and structure</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">4.2 Pricing and Payment</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>All prices are displayed in South African Rand (ZAR) and include applicable VAT</li>
                <li>Payment is due immediately upon enrollment</li>
                <li>We accept major credit cards and electronic fund transfers</li>
                <li>You authorize us to charge your selected payment method</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">4.3 Refund Policy</h3>
              <div className="bg-yellow-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold text-corporate-black mb-3">Cooling-off Period (Consumer Protection Act)</h4>
                <p className="text-gray-700 text-sm mb-3">
                  In accordance with the Consumer Protection Act 68 of 2008, you have the right to cancel your purchase within 7 (seven) business days without reason, provided:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>You have not accessed more than 25% of the course content</li>
                  <li>You notify us in writing of your intention to cancel</li>
                  <li>The course was not purchased at a promotional price</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Refunds will be processed within 14 business days to the original payment method. Refund requests after the cooling-off period will be considered on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">5. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">5.1 Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All course materials, content, trademarks, and intellectual property remain the exclusive property of AptivAI. You receive a limited, non-exclusive, non-transferable license to access and use the content for personal educational purposes only.
              </p>

              <h3 className="text-xl font-medium text-corporate-black mb-3">5.2 Prohibited Use</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Reproducing, distributing, or sharing course content without permission</li>
                <li>Creating derivative works based on our content</li>
                <li>Using our content for commercial purposes</li>
                <li>Reverse engineering or attempting to extract our proprietary methods</li>
                <li>Recording, copying, or capturing course content</li>
              </ul>

              <h3 className="text-xl font-medium text-corporate-black mb-3">5.3 User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed">
                Any content you submit (comments, assignments, feedback) grants us a non-exclusive right to use, modify, and display such content for educational and promotional purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">6. User Conduct and Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Violate any applicable South African laws or regulations</li>
                <li>Interfere with the security or integrity of our systems</li>
                <li>Use our services for fraudulent or illegal activities</li>
                <li>Harass, abuse, or harm other users or our staff</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload malicious software or content</li>
                <li>Impersonate another person or entity</li>
                <li>Spam or send unsolicited communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">7. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">7.1 Service Availability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive for high availability, we do not guarantee uninterrupted access to our services. We may suspend services for maintenance, updates, or technical issues.
              </p>

              <h3 className="text-xl font-medium text-corporate-black mb-3">7.2 Educational Outcomes</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not guarantee specific learning outcomes, career advancement, or employment opportunities. The effectiveness of our training depends on individual effort and application.
              </p>

              <h3 className="text-xl font-medium text-corporate-black mb-3">7.3 Limitation of Liability</h3>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-700 text-sm">
                  To the fullest extent permitted by South African law, AptivAI's total liability for any claim arising from or relating to these Terms or our services shall not exceed the amount you paid for the specific service giving rise to the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">8. Data Protection and Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which forms an integral part of these Terms and complies with the Protection of Personal Information Act (POPIA).
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the processing of your personal information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">9. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium text-corporate-black mb-3">9.1 Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by the laws of the Republic of South Africa. Any disputes will be subject to the exclusive jurisdiction of the South African courts.
              </p>

              <h3 className="text-xl font-medium text-corporate-black mb-3">9.2 Dispute Resolution</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 text-sm mb-3">
                  Before initiating legal proceedings, we encourage resolution through:
                </p>
                <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1">
                  <li>Direct negotiation between the parties</li>
                  <li>Mediation through a mutually agreed mediator</li>
                  <li>Arbitration under the Arbitration Act 42 of 1965</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">10. Consumer Protection Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nothing in these Terms limits your rights under the Consumer Protection Act 68 of 2008, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Right to fair and responsible marketing</li>
                <li>Right to equality in the consumer market</li>
                <li>Right to privacy and information</li>
                <li>Right to choose suppliers and select goods</li>
                <li>Right to fair and honest dealing</li>
                <li>Right to fair, just and reasonable terms and conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">11. Modifications and Updates</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. Material changes will be communicated via email or prominent website notice at least 30 days before implementation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Continued use of our services after the effective date constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-corporate-black mb-4">12. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>AptivAI (Pty) Ltd</strong></p>
                <p className="text-gray-700 mb-2">Registration Number: [To be completed]</p>
                <p className="text-gray-700 mb-2">Physical Address: Johannesburg, South Africa</p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:legal@aptivai.co.za" className="text-accent hover:underline">legal@aptivai.co.za</a></p>
                <p className="text-gray-700 mb-4">Phone: +27 (0) 11 123 4567</p>
                
                <p className="text-gray-700 text-sm">
                  For consumer complaints, you may also contact the National Consumer Commission at <a href="mailto:complaints@nccsa.org.za" className="text-accent hover:underline">complaints@nccsa.org.za</a>
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <p className="text-sm text-gray-600 italic">
                These Terms of Service comply with South African law including the Consumer Protection Act 68 of 2008, Electronic Communications and Transactions Act 25 of 2002, and the Protection of Personal Information Act 4 of 2013.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;