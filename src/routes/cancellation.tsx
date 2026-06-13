import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/cancellation")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy — Crafted Comforts" },
      { name: "description", content: "Transparent terms for managing project changes and cancellations at Crafted Comforts." },
      { property: "og:title", content: "Cancellation Policy — Crafted Comforts" },
      { property: "og:description", content: "Transparent terms for managing project changes and cancellations." },
      { property: "og:url", content: "/cancellation" },
    ],
    links: [{ rel: "canonical", href: "/cancellation" }],
  }),
  component: Cancellation,
});

function Cancellation() {
  return (
    <LegalLayout title="Cancellation Policy">
      <p>At Crafted Comforts, we strive to provide exceptional interior design and renovation services tailored to your needs. Our cancellation policy ensures transparency and fairness in managing project changes and cancellations.</p>
      <h2>Notification</h2>
      <p>Any request for cancellation must be communicated in writing. Verbal requests will not be considered valid.</p>
      <h2>Cancellation Fees</h2>
      <p>Depending on the stage of the project and costs already incurred, cancellation may result in fees to compensate for time, resources and materials already invested — including administrative costs; costs of design and planning phases completed; costs of materials already purchased or ordered; and labour costs for work already completed or scheduled.</p>
      <h2>Refund Policy</h2>
      <p>Upon cancellation, refunds or credits will be determined based on expenses and work completed up to the cancellation date, and processed within a reasonable timeframe.</p>
      <h2>Advance Payments</h2>
      <p>Advance payments may be used to offset cancellation fees and expenses incurred; the remaining balance, if any, will be refunded as per our refund policy.</p>
      <h2>Project Suspension</h2>
      <p>Clients may request a temporary suspension instead of cancellation; suspension terms will be agreed separately.</p>
      <h2>Force Majeure</h2>
      <p>Crafted Comforts reserves the right to cancel or delay projects due to unforeseen circumstances beyond our control (natural disasters, government regulations or other force majeure events), making reasonable efforts to mitigate the impact.</p>
      <h2>Client Responsibilities</h2>
      <p>Clients are responsible for providing timely and accurate information; delays caused by incomplete or inaccurate information may impact timelines and costs.</p>
      <h2>Amendment of Terms</h2>
      <p>Crafted Comforts reserves the right to amend this cancellation policy at any time; updated terms will be communicated and posted on our website.</p>
      <p>If you have any questions about our cancellation policy, write to <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">{SITE.email}</a>.</p>
    </LegalLayout>
  );
}