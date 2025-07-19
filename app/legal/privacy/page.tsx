import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              The Magical Knowledge Tree - Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                COPPA Compliance Notice
              </h3>
              <p className="text-blue-800 text-sm">
                This service is designed for children under 13 and complies with
                the Children's Online Privacy Protection Act (COPPA). We
                prioritize child safety and require verifiable parental consent
                for all data collection.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Parent Information
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Name and email address for account creation</li>
                <li>Password (encrypted and never stored in plain text)</li>
                <li>Account preferences and settings</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Child Information (with Parental Consent)
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Display name (first name or nickname only, never full name)
                </li>
                <li>Age (for age-appropriate content delivery)</li>
                <li>Selected learning domains</li>
                <li>
                  Educational questions and interactions (for improvement
                  purposes only)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. How We Use Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use collected information solely to provide and improve our
                educational service:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Deliver age-appropriate educational content</li>
                <li>Customize learning experiences for each child</li>
                <li>Maintain account security and functionality</li>
                <li>Improve our AI responses and safety measures</li>
                <li>Communicate with parents about their account</li>
                <li>Ensure compliance with safety and educational standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do NOT sell, rent, or share personal information with third
                parties, except in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>With Parental Consent:</strong> Only when explicitly
                  authorized by parents
                </li>
                <li>
                  <strong>Safety Concerns:</strong> To protect the safety of
                  children or others when required by law
                </li>
                <li>
                  <strong>Legal Compliance:</strong> When required by court
                  order or legal process
                </li>
                <li>
                  <strong>Service Providers:</strong> With trusted partners who
                  help operate our service (under strict confidentiality
                  agreements)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement industry-standard security measures to protect your
                family's information:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Encryption of all data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>
                  Restricted access to personal information on a need-to-know
                  basis
                </li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Regular backups with encrypted storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Parental Rights and Control
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Parents have full control over their child's information and
                can:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Review all information collected about their child</li>
                <li>
                  Request deletion of their child's information at any time
                </li>
                <li>Modify or update their child's profile</li>
                <li>Control which learning domains their child can access</li>
                <li>Revoke consent and close their child's account</li>
                <li>
                  Receive copies of all data associated with their child's
                  account
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use minimal, essential cookies to provide our service:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>Authentication cookies:</strong> To keep users logged
                  in securely
                </li>
                <li>
                  <strong>Preference cookies:</strong> To remember user settings
                </li>
                <li>
                  <strong>Security cookies:</strong> To prevent fraud and abuse
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We do NOT use advertising cookies or track users across other
                websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain personal information only as long as necessary to
                provide our service or as required by law. When an account is
                deleted, all associated personal information is permanently
                removed from our systems within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure that
                all international transfers comply with applicable privacy laws
                and include appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify parents of any material changes via email and require
                re-consent when necessary. Continued use of the service after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about this Privacy Policy or want to
                exercise your parental rights, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@magicalknowledgetree.com"
                    className="text-primary underline"
                  >
                    privacy@magicalknowledgetree.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Data Protection Officer:</strong>{" "}
                  <a
                    href="mailto:dpo@magicalknowledgetree.com"
                    className="text-primary underline"
                  >
                    dpo@magicalknowledgetree.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We respond to all privacy
                  requests within 72 hours
                </p>
              </div>
            </section>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mt-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    Our Commitment to Child Safety
                  </h3>
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    The safety and privacy of children is our highest priority.
                    We go beyond COPPA requirements to ensure a safe learning
                    environment. Our AI systems are designed with child safety
                    as the primary consideration, and we continuously monitor
                    and improve our safety measures.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
