import { createFileRoute } from "@tanstack/react-router";
import { publicServerClient } from "@/lib/supabase-public.server";

/**
 * Stable, cacheable public URL for images stored in the private `portfolio`
 * bucket. Crawlers and <img> tags get a permanent path; the signed URL is an
 * internal detail refreshed on each origin fetch.
 */
export const Route = createFileRoute("/api/public/portfolio-media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const supabase = publicServerClient();
        const { data, error } = await supabase.storage
          .from("portfolio")
          .createSignedUrl(path, 60 * 10);

        if (error || !data?.signedUrl) return new Response("Not found", { status: 404 });

        const upstream = await fetch(data.signedUrl);
        if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
