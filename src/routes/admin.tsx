import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/site/Logo";
import {
  PROJECT_CATEGORIES,
  mediaUrl,
  slugify,
  type DbProject,
  type DbProjectImage,
} from "@/lib/portfolio-shared";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portfolio Editor — Crafted Comforts Studio" },
      { name: "description", content: "Private portfolio editor for the Crafted Comforts studio team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Portfolio Editor — Crafted Comforts Studio" },
      { property: "og:description", content: "Private portfolio editor for the Crafted Comforts studio team." },
      { property: "og:url", content: "/admin" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

type Draft = {
  id?: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  description: string;
  sort_order: number;
  published: boolean;
};

const emptyDraft = (): Draft => ({
  title: "",
  slug: "",
  location: "",
  category: "Residential",
  description: "",
  sort_order: 0,
  published: true,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("portfolio_projects")
      .select("id,title,slug,location,category,description,sort_order,published,portfolio_images(id,storage_path,alt,position)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (err) { setError(err.message); return; }
    setProjects(
      (data ?? []).map((p) => ({
        ...p,
        images: [...(p.portfolio_images ?? [])]
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            id: img.id,
            storage_path: img.storage_path,
            url: mediaUrl(img.storage_path),
            alt: img.alt,
            position: img.position,
          })),
      })),
    );
  }, []);

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);

  if (loading) {
    return <Gate><p className="text-ink-soft/70 text-sm">Checking your access…</p></Gate>;
  }

  if (!user) {
    return (
      <Gate>
        <h1 className="font-display text-3xl">Studio access required</h1>
        <p className="mt-3 text-sm text-ink-soft/75">Sign in to manage the portfolio.</p>
        <Link to="/auth" className="btn-brass inline-block mt-7">Sign In</Link>
      </Gate>
    );
  }

  if (!isAdmin) {
    return (
      <Gate>
        <h1 className="font-display text-3xl">Awaiting access</h1>
        <p className="mt-3 text-sm text-ink-soft/75 leading-relaxed">
          You are signed in as <span className="text-ink">{user.email}</span>, but this account has not
          been granted the administrator role yet. Ask a studio administrator to grant it, then reload
          this page.
        </p>
        <button
          onClick={() => void supabase.auth.signOut()}
          className="btn-outline mt-7"
        >
          Sign out
        </button>
      </Gate>
    );
  }

  const saveDraft = async () => {
    if (!draft) return;
    setBusy(true); setError(null); setStatus(null);
    try {
      const slug = draft.slug.trim() || slugify(draft.title);
      if (!draft.title.trim()) throw new Error("A project name is required.");
      if (!slug) throw new Error("A project name with letters or numbers is required.");

      const payload = {
        title: draft.title.trim(),
        slug,
        location: draft.location.trim(),
        category: draft.category,
        description: draft.description.trim(),
        sort_order: Number.isFinite(draft.sort_order) ? draft.sort_order : 0,
        published: draft.published,
      };

      if (draft.id) {
        const { error: err } = await supabase.from("portfolio_projects").update(payload).eq("id", draft.id);
        if (err) throw err;
        setStatus("Project updated.");
        setDraft({ ...draft, slug });
      } else {
        const { data, error: err } = await supabase
          .from("portfolio_projects")
          .insert(payload)
          .select("id")
          .single();
        if (err) throw err;
        setStatus("Project created — now add 3–4 collage images below.");
        setDraft({ ...draft, id: data.id, slug });
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the project.");
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (project: DbProject) => {
    if (!window.confirm(`Delete “${project.title}” and its images?`)) return;
    setBusy(true); setError(null); setStatus(null);
    try {
      const paths = project.images.map((i) => i.storage_path).filter(Boolean);
      if (paths.length) await supabase.storage.from("portfolio").remove(paths);
      const { error: err } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
      if (err) throw err;
      if (draft?.id === project.id) setDraft(null);
      setStatus("Project deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the project.");
    } finally {
      setBusy(false);
    }
  };

  const activeProject = draft?.id ? projects.find((p) => p.id === draft.id) ?? null : null;

  return (
    <main className="min-h-screen bg-[color:var(--paper)]">
      <header className="border-b border-[color:var(--brass)]/30">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-5 flex items-center justify-between gap-4">
          <Link to="/"><Logo size={30} showTagline={false} /></Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[11px] tracking-[0.18em] uppercase text-ink-soft/60">
              {user.email}
            </span>
            <button
              onClick={() => void supabase.auth.signOut()}
              className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--brass)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="overline">Portfolio editor</p>
            <h1 className="font-display text-4xl md:text-5xl mt-3">Projects</h1>
            <p className="mt-3 text-sm text-ink-soft/75 max-w-xl">
              Add a project, then upload 3–4 images for its collage. Published projects appear at the
              top of the public portfolio.
            </p>
          </div>
          <button onClick={() => { setDraft(emptyDraft()); setStatus(null); setError(null); }} className="btn-brass">
            New project
          </button>
        </div>

        {(status || error) && (
          <p className={`mt-6 text-sm ${error ? "text-[color:var(--brass-deep)]" : "text-ink-soft/80"}`}>
            {error ?? status}
          </p>
        )}

        {draft && (
          <section className="mt-10 border border-[color:var(--brass)]/30 bg-[color:var(--ivory)] p-5 md:p-8">
            <h2 className="font-display text-2xl">{draft.id ? "Edit project" : "New project"}</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Project name">
                <input className="cc-input" value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} />
              </Field>
              <Field label="Location">
                <input className="cc-input" placeholder="Indiranagar, Bengaluru" value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </Field>
              <Field label="Category">
                <select className="cc-input" value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Display order (lower shows first)">
                <input className="cc-input" type="number" value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea className="cc-input min-h-[96px]" value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                </Field>
              </div>
            </div>

            <label className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
              <input type="checkbox" checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
              Published on the public portfolio
            </label>

            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => void saveDraft()} disabled={busy} className="btn-brass disabled:opacity-60">
                {busy ? "Saving…" : draft.id ? "Save changes" : "Create project"}
              </button>
              <button onClick={() => setDraft(null)} className="btn-outline">Close</button>
            </div>

            {activeProject ? (
              <ImageManager
                project={activeProject}
                onChanged={load}
                onError={setError}
                onStatus={setStatus}
              />
            ) : (
              <p className="mt-8 text-sm text-ink-soft/70">
                Create the project first — the image uploader appears once it exists.
              </p>
            )}
          </section>
        )}

        <div className="mt-12 space-y-4">
          {projects.length === 0 && (
            <p className="text-sm text-ink-soft/70">No projects yet. Create your first one above.</p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="border border-[color:var(--brass)]/25 bg-[color:var(--ivory)] p-4 flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {(p.images.length ? p.images.slice(0, 4) : []).map((img) => (
                  <img key={img.id} src={img.url} alt="" className="w-12 h-12 object-cover" loading="lazy" />
                ))}
                {!p.images.length && <span className="w-12 h-12 bg-[color:var(--brass)]/10" />}
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="font-display text-lg">{p.title}</p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-ink-soft/60 mt-1">
                  {p.category} · {p.location || "No location"} · {p.images.length} image
                  {p.images.length === 1 ? "" : "s"} · {p.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--brass)]"
                  onClick={() => { setDraft({ ...p }); setStatus(null); setError(null); }}
                >
                  Edit
                </button>
                <button
                  className="text-[11px] tracking-[0.2em] uppercase text-ink-soft/60 hover:text-ink"
                  onClick={() => void removeProject(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ImageManager({
  project, onChanged, onError, onStatus,
}: {
  project: DbProject;
  onChanged: () => Promise<void>;
  onError: (m: string | null) => void;
  onStatus: (m: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (files: FileList) => {
    setUploading(true); onError(null); onStatus(null);
    try {
      let position = project.images.length;
      for (const file of Array.from(files).slice(0, 8)) {
        const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const path = `${project.slug}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file, {
          cacheControl: "31536000",
          contentType: file.type || undefined,
        });
        if (upErr) throw upErr;
        const { error: rowErr } = await supabase.from("portfolio_images").insert({
          project_id: project.id,
          storage_path: path,
          alt: `${project.title}${project.location ? ` — ${project.location}` : ""}`,
          position,
        });
        if (rowErr) throw rowErr;
        position += 1;
      }
      onStatus("Images uploaded.");
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = async (img: DbProjectImage) => {
    onError(null); onStatus(null);
    const { error: err } = await supabase.from("portfolio_images").delete().eq("id", img.id);
    if (err) { onError(err.message); return; }
    if (img.storage_path) await supabase.storage.from("portfolio").remove([img.storage_path]);
    onStatus("Image removed.");
    await onChanged();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= project.images.length) return;
    const a = project.images[index];
    const b = project.images[target];
    await supabase.from("portfolio_images").update({ position: b.position }).eq("id", a.id);
    await supabase.from("portfolio_images").update({ position: a.position }).eq("id", b.id);
    await onChanged();
  };

  const saveAlt = async (img: DbProjectImage, alt: string) => {
    if (alt === img.alt) return;
    const { error: err } = await supabase.from("portfolio_images").update({ alt }).eq("id", img.id);
    if (err) { onError(err.message); return; }
    await onChanged();
  };

  return (
    <div className="mt-9 border-t border-[color:var(--brass)]/25 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl">Collage images</h3>
        <span className={`text-[11px] tracking-[0.18em] uppercase ${
          project.images.length >= 3 && project.images.length <= 4
            ? "text-[color:var(--brass)]"
            : "text-ink-soft/60"
        }`}>
          {project.images.length} of 3–4 recommended
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {project.images.map((img, index) => (
          <div key={img.id} className="border border-[color:var(--brass)]/20 p-2">
            <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover" />
            <input
              className="cc-input mt-2 !py-2 !text-[12px]"
              defaultValue={img.alt}
              aria-label="Image description"
              onBlur={(e) => void saveAlt(img, e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between text-[11px] tracking-[0.16em] uppercase">
              <span className="flex gap-2">
                <button onClick={() => void move(index, -1)} aria-label="Move earlier" className="text-[color:var(--brass)]">←</button>
                <button onClick={() => void move(index, 1)} aria-label="Move later" className="text-[color:var(--brass)]">→</button>
              </span>
              <button onClick={() => void removeImage(img)} className="text-ink-soft/60 hover:text-ink">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => { if (e.target.files?.length) void upload(e.target.files); }}
          className="block text-sm text-ink-soft"
        />
        <p className="mt-2 text-[12px] text-ink-soft/60">
          {uploading ? "Uploading…" : "JPEG, PNG or WebP up to 25 MB each. Select 3–4 images at once."}
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="cc-label">{label}</span>
      {children}
    </label>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[color:var(--paper)] flex items-center justify-center px-5 text-center">
      <div className="max-w-[440px]">{children}</div>
    </main>
  );
}
