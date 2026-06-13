import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crafted Comforts — Spaces to Sanctuaries" },
      { name: "description", content: "Crafted Comforts — luxury interior design-and-build studio in Bengaluru." },
      { property: "og:title", content: "Crafted Comforts — Spaces to Sanctuaries" },
      { property: "og:description", content: "Crafted Comforts — luxury interior design-and-build studio in Bengaluru." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1 className="text-center text-3xl font-medium tracking-tight text-foreground md:text-5xl">
        Crafted Comforts — Spaces to Sanctuaries
      </h1>
    </main>
  );
}
