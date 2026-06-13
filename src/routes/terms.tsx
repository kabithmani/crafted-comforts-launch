import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Crafted Comforts" },
      { name: "description", content: "Terms governing the use of Crafted Comforts' website and services." },
      { property: "og:title", content: "Terms & Conditions — Crafted Comforts" },
      { property: "og:description", content: "Terms governing the use of Crafted Comforts' website and services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>Welcome to Crafted Comforts, your premier destination for interior design, manufacturing and renovation services. By accessing our website and using our services, you agree to comply with the following terms and conditions.</p>
      <h2>Website Use</h2>
      <p>The content of this website is for general information and use only. It is subject to change without notice.</p>
      <h2>Service Agreement</h2>
      <p>By engaging Crafted Comforts for design, renovation or interior services, you enter into a binding service agreement governed by the terms outlined in our contracts and proposals.</p>
      <h2>Intellectual Property</h2>
      <p>All content on this website — text, graphics, logos, images, video and software — is the property of Crafted Comforts or its licensors and is protected by copyright laws. Unauthorised use may give rise to a claim for damages and/or be a criminal offence.</p>
      <h2>Client Responsibilities</h2>
      <p>Clients are responsible for providing accurate project requirements and access to premises. Delays or changes may impact project timelines and costs.</p>
      <h2>Privacy</h2>
      <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use and protect your personal information. By using our services you consent to the collection and use of your information as described there.</p>
      <h2>Payment Terms</h2>
      <p>Payment terms are specified in our agreements and invoices. Clients are responsible for timely payments according to the terms agreed upon.</p>
      <h2>Project Changes and Cancellations</h2>
      <p>Changes to projects must be communicated in writing and may incur additional costs. Cancellation terms are outlined in our agreements and in our Cancellation Policy.</p>
      <h2>Dispute Resolution</h2>
      <p>Any disputes arising from our services will be resolved through negotiation and mediation. If resolution is not achieved, disputes may be escalated to arbitration or legal proceedings as per applicable laws.</p>
      <h2>Limitation of Liability</h2>
      <p>Crafted Comforts is not liable for any indirect, incidental, special or consequential damages arising from the use of our services or website.</p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of Bangalore, Karnataka, India, without regard to its conflict of laws principles.</p>
      <h2>Updates to Terms</h2>
      <p>Crafted Comforts reserves the right to update or modify these terms at any time. Updated terms will be posted on our website, and continued use of our services constitutes acceptance of these changes.</p>
      <p>By using our website and engaging our services, you acknowledge that you have read, understood and agreed to these Terms and Conditions. Questions? Contact us at <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">{SITE.email}</a>.</p>
    </LegalLayout>
  );
}