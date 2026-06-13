import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          { p: "/", priority: "1.0", changefreq: "weekly" },
          { p: "/about", priority: "0.8", changefreq: "monthly" },
          { p: "/manufacturing", priority: "0.8", changefreq: "monthly" },
          { p: "/portfolio", priority: "0.9", changefreq: "weekly" },
          { p: "/terms", priority: "0.3", changefreq: "yearly" },
          { p: "/privacy", priority: "0.3", changefreq: "yearly" },
          { p: "/cancellation", priority: "0.3", changefreq: "yearly" },
        ];
        const urls = paths.map((e) =>
          `  <url>\n    <loc>${BASE_URL}${e.p}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});