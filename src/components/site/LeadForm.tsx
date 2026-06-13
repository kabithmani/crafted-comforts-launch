import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SITE, waPrefill, telHref } from "@/lib/site-config";
import { trackLead, trackWhatsApp, trackCall } from "@/lib/analytics";
import { Merkaba } from "./Merkaba";
import { WhatsAppGlyph, PhoneGlyph } from "./Header";

type State = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [state, setState] = useState<State>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("botcheck")) return;
    fd.set("access_key", SITE.web3formsKey);
    fd.set("subject", "New consultation request — Crafted Comforts");
    fd.set("from_name", "craftedcomforts.life");
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => { payload[k] = String(v); });
    setState("loading");
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("network");
      setState("success");
      trackLead();
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="bg-[color:var(--paper)] text-ink p-8 md:p-12 text-center">
        <div className="flex justify-center text-[color:var(--brass)] mb-4"><Merkaba size={36} /></div>
        <h3 className="font-display text-3xl">Thank you.</h3>
        <p className="mt-3 text-ink-soft max-w-md mx-auto">
          Your details are with us — expect a call or message within one business day. If it's urgent, WhatsApp us anytime.
        </p>
        <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp} className="btn-brass mt-7 inline-flex">
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-[color:var(--paper)] text-ink p-8 md:p-12 text-center">
        <h3 className="font-display text-2xl">Something interrupted that.</h3>
        <p className="mt-2 text-ink-soft">Please try again — or reach us directly:</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp} className="btn-brass">WhatsApp</a>
          <a href={telHref} onClick={trackCall} className="btn-outline-ink">Call Now</a>
          <button onClick={() => setState("idle")} className="btn-outline-ink">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-[color:var(--paper)] text-ink p-7 md:p-10">
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Full name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Property location" name="location" placeholder="e.g. Indiranagar, Bengaluru" />
        <div>
          <label htmlFor="project_type" className="cc-label">Project type</label>
          <select id="project_type" name="project_type" className="cc-input">
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </div>
        <Field label="Approx. size (sqft)" name="size" type="number" inputMode="numeric" />
        <div className="md:col-span-2">
          <label htmlFor="message" className="cc-label">Brief message</label>
          <textarea id="message" name="message" rows={4} className="cc-input resize-none" placeholder="Tell us a little about your space and timeline." />
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <button type="submit" disabled={state === "loading"} className="btn-brass disabled:opacity-60">
          {state === "loading" ? "Sending…" : "Request Consultation"}
        </button>
        <p className="text-xs text-ink-soft/80">
          By submitting, you agree to our{" "}
          <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", required = false, placeholder, inputMode,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; inputMode?: "text" | "numeric" | "tel" | "email" | "url" | "search" | "decimal" | "none"; }) {
  return (
    <div>
      <label htmlFor={name} className="cc-label">{label}{required && <span className="text-[color:var(--brass)]"> *</span>}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} inputMode={inputMode} className="cc-input" />
    </div>
  );
}

export function ContactCallout() {
  return (
    <div className="flex flex-col gap-3 text-ivory">
      <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp} className="btn-brass">
        <WhatsAppGlyph size={18} /><span className="ml-2">Chat on WhatsApp</span>
      </a>
      <a href={telHref} onClick={trackCall} className="btn-outline-ivory">
        <PhoneGlyph size={18} /><span className="ml-2">Call {SITE.phoneDisplay}</span>
      </a>
      <p className="mt-2 text-xs text-ivory/65 leading-relaxed">{SITE.studioAddress}</p>
    </div>
  );
}