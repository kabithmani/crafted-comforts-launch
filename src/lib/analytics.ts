import { SITE } from "./site-config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
    __ccAnalyticsLoaded?: boolean;
  }
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<void>((res) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = () => res();
    s.onerror = () => res();
    document.head.appendChild(s);
  });
}

export function initAnalytics() {
  if (typeof window === "undefined" || window.__ccAnalyticsLoaded) return;
  window.__ccAnalyticsLoaded = true;

  const boot = () => {
    // Meta Pixel
    (function (f: any, b: any, e: any, v: any) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e);
      t.async = true;
      t.defer = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq?.("init", SITE.metaPixelId);
    window.fbq?.("track", "PageView");

    // GA4
    window.dataLayer = window.dataLayer || [];
    const gtag: any = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", SITE.ga4Id, { anonymize_ip: true });
    void loadScript(`https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`);

    // Clarity
    (function (c: any, l: any, a: any, r: any, i: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      const t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", SITE.clarityId);
  };

  const ric: any = (window as any).requestIdleCallback;
  if (typeof ric === "function") ric(boot, { timeout: 2500 });
  else window.setTimeout(boot, 1800);
}

export function trackLead() {
  window.fbq?.("track", "Lead", { content_name: "consultation_form" });
  window.gtag?.("event", "generate_lead", { method: "consultation_form" });
  window.clarity?.("set", "conversion", "lead");
}
export function trackCall() {
  window.fbq?.("track", "Contact", { content_name: "call_now" });
  window.gtag?.("event", "contact_call", { method: "phone" });
  window.clarity?.("set", "intent", "call");
}
export function trackWhatsApp() {
  window.fbq?.("track", "Contact", { content_name: "whatsapp" });
  window.gtag?.("event", "contact_whatsapp", { method: "whatsapp" });
  window.clarity?.("set", "intent", "whatsapp");
}
export function trackViewProject(name: string) {
  window.fbq?.("track", "ViewContent", { content_type: "portfolio_project", content_name: name });
  window.gtag?.("event", "view_project", { project: name });
}
export function trackBookCTA(location: string) {
  window.fbq?.("track", "Schedule", { content_name: "consultation_cta" });
  window.gtag?.("event", "cta_book", { location });
}