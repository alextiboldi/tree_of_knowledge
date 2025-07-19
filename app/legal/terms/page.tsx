import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
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
            <TreePine className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>The Magical Knowledge Tree - Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using The Magical Knowledge Tree platform
                ("Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Description of Service
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Magical Knowledge Tree is an educational platform designed
                to provide safe, age-appropriate learning experiences for
                children aged 5-15. Our service includes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>AI-powered educational question and answer system</li>
                <li>Child-friendly explanations with visual illustrations</li>
                <li>Parental oversight and control features</li>
                <li>
                  Educational content across Science, Nature, and Math domains
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Parental Consent and Responsibility
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                This service is designed for children under 18 years of age and
                requires parental consent and supervision:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Parents must create and manage accounts for their children
                </li>
                <li>
                  Parents are responsible for monitoring their child's use of
                  the platform
                </li>
                <li>
                  Parents can control which educational domains their child can
                  access
                </li>
                <li>
                  Parents should review and discuss learning content with their
                  children
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Acceptable Use
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Users agree to use the Service only for educational purposes and
                in accordance with these guidelines:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Ask educational questions related to approved learning domains
                </li>
                <li>Use respectful and appropriate language</li>
                <li>Not attempt to bypass safety features or guardrails</li>
                <li>Not share inappropriate content or personal information</li>
                <li>Respect the learning environment for all users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Safety and Content Filtering
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement comprehensive safety measures to ensure appropriate
                content:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Advanced AI guardrails filter inappropriate questions and
                  responses
                </li>
                <li>
                  Content is automatically reviewed for age-appropriateness
                </li>
                <li>Educational domains are curated and supervised</li>
                <li>Parents can report any concerning content immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Account Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Account holders are responsible for maintaining the security of
                their accounts:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Keep login credentials secure and confidential</li>
                <li>Use strong, unique passwords</li>
                <li>Report any unauthorized access immediately</li>
                <li>Log out of shared devices after use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content, illustrations, and educational materials provided
                through the Service are protected by copyright and other
                intellectual property laws. Users may access and use these
                materials solely for personal, educational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices regarding the collection and use of
                your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and helpful educational
                content, the Service is provided "as is" without warranties of
                any kind. We are not liable for any indirect, incidental, or
                consequential damages arising from use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate or suspend accounts that
                violate these terms or engage in inappropriate behavior. Users
                may also terminate their accounts at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                11. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms of Service from time to time. Users
                will be notified of any significant changes, and continued use
                of the Service constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                12. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:support@magicalknowledgetree.com"
                  className="text-primary underline"
                >
                  support@magicalknowledgetree.com
                </a>
              </p>
            </section>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-8">
              <p className="text-sm text-gray-600 font-medium">
                By creating an account and using The Magical Knowledge Tree, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
