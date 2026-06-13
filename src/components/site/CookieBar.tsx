import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "cc_cookie_ack_v1";

export function CookieBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setShow(true); } catch { /* noop */ }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed left-3 right-3 md:left-6 md:right-auto md:max-w-md bottom-20 md:bottom-6 z-[80] bg-ink text-ivory border border-[color:var(--brass)]/40 px-5 py-4 text-xs flex flex-wrap items-center gap-3 shadow-2xl">
      <span className="flex-1 leading-relaxed">
        We use cookies and analytics to improve your experience. Read our{" "}
        <Link to="/privacy" className="underline underline-offset-2 text-[color:var(--brass-light)]">Privacy Policy</Link>.
      </span>
      <button
        onClick={() => { try { localStorage.setItem(KEY, "1"); } catch { /* */ } setShow(false); }}
        className="btn-brass !py-2 !px-4 !text-[10px]"
      >
        Okay
      </button>
    </div>
  );
}