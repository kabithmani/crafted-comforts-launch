import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Crafted Comforts" },
      { name: "description", content: "How Crafted Comforts collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy Policy — Crafted Comforts" },
      { property: "og:description", content: "How Crafted Comforts collects, uses and protects your personal data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Crafted Comforts offers interior design, manufacturing and renovation services through our website and other platforms. If you have any questions about this Policy or how we handle your personal data, please contact us at <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">{SITE.email}</a>.</p>
      <h2>How This Policy Applies</h2>
      <p>This Policy applies to individuals ("Users") who access our website or avail our services. By using our Services, you consent to the collection, storage, use and disclosure of your personal data as described here.</p>
      <h2>Personal Data We Collect</h2>
      <p>Contact data (name, address, email, phone); identity and profile data (preferences, photographs); property and home data (property details, furniture preferences); technical data (IP address, browser type, device type, usage data); transaction data (services availed, payment information); marketing and communications data (preferences and interactions).</p>
      <h2>How We Use Your Personal Data</h2>
      <p>To provide and manage our Services, including processing requests; to communicate with you and provide support; to personalise and improve our Services; to send marketing communications subject to your preferences; to comply with legal obligations and enforce our Terms.</p>
      <h2>Cookies & Analytics</h2>
      <p>We use cookies and similar technologies to improve your experience. We also use third-party analytics and advertising tools — <strong>Google Analytics 4</strong>, <strong>Microsoft Clarity</strong> (which records anonymised usage, including heatmaps and session recordings to help us improve the site), and the <strong>Meta (Facebook) Pixel</strong> (to measure and optimise our advertising). These tools may set cookies and collect usage data as described in their own privacy policies. You can opt out via your browser settings or the relevant provider's opt-out tools.</p>
      <h2>Disclosure of Your Personal Data</h2>
      <p>We may share your personal data with service providers and partners who help deliver our Services, other entities within the Crafted Comforts group, and regulatory bodies or authorities as required by law.</p>
      <h2>Data Security</h2>
      <p>We implement appropriate security measures to protect your personal data from unauthorised access and use, in accordance with applicable laws and standards.</p>
      <h2>Data Retention</h2>
      <p>We retain your personal data for as long as necessary to fulfil the purposes outlined here and as required by law. Aggregated and anonymised data may be retained indefinitely for research and statistical purposes.</p>
      <h2>International Transfers</h2>
      <p>Your personal data may be transferred to and stored in countries outside your jurisdiction where Crafted Comforts or our service providers operate. By using our Services you consent to such transfers.</p>
      <h2>Updates to This Policy</h2>
      <p>We may update this Policy periodically and will notify you of significant updates through our website or other appropriate means.</p>
      <p>If you have any questions or concerns about this Privacy Policy or our data practices, contact us at <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">{SITE.email}</a>.</p>
    </LegalLayout>
  );
}