import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Merkaba } from "@/components/site/Merkaba";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Studio Sign In — Crafted Comforts" },
      { name: "description", content: "Private sign-in for the Crafted Comforts studio team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Studio Sign In — Crafted Comforts" },
      { property: "og:description", content: "Private sign-in for the Crafted Comforts studio team." },
      { property: "og:url", content: "/auth" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null); setMessage(null);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        void navigate({ to: "/admin" });
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
        setMessage("Account created. If confirmation is required, check your inbox, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[color:var(--paper)] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center">
          <span className="inline-flex text-[color:var(--brass)]"><Merkaba size={40} /></span>
          <h1 className="font-display text-3xl mt-5">Studio Access</h1>
          <p className="mt-2 text-sm text-ink-soft/75">
            Portfolio management for the Crafted Comforts team.
          </p>
        </div>

        <form onSubmit={submit} className="mt-9 space-y-5">
          <div>
            <label className="cc-label" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" className="cc-input"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="cc-label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="cc-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-[color:var(--brass-deep)]">{error}</p>}
          {message && <p className="text-sm text-ink-soft/80">{message}</p>}

          <button type="submit" disabled={busy} className="btn-brass w-full disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
          className="mt-6 w-full text-center text-[11px] tracking-[0.2em] uppercase text-ink-soft/70 hover:text-ink transition-colors"
        >
          {mode === "signin" ? "Create the first studio account" : "I already have an account"}
        </button>

        <p className="mt-8 text-center text-[11px] text-ink-soft/55 leading-relaxed">
          Accounts are invite-only: an account alone grants no access — a studio administrator must
          be granted the admin role before the portfolio editor opens.
        </p>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--brass)]">
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
