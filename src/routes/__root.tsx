import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAnalytics } from "../lib/analytics";
import { SITE } from "../lib/site-config";
import { Merkaba } from "../components/site/Merkaba";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--ink)] text-[color:var(--ivory)] px-6 text-center">
      <span className="text-[color:var(--brass)] mb-6"><Merkaba size={56} /></span>
      <h1 className="font-display text-5xl md:text-6xl">This room doesn't exist.</h1>
      <p className="mt-4 text-ivory/70">But fifty others do.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/portfolio" className="btn-brass">View Portfolio</Link>
        <Link to="/" className="btn-outline-ivory">Back Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Crafted Comforts — Luxury Interiors, Designed & Built In-House | Bengaluru" },
      { name: "description", content: "Crafted Comforts designs, manufactures, renovates and styles luxury interiors in Bengaluru — end-to-end, in-house, with factory-direct value. Complete interiors from ₹25 lakhs." },
      { name: "author", content: "Crafted Comforts" },
      { property: "og:site_name", content: "Crafted Comforts" },
      { property: "og:title", content: "Crafted Comforts — Luxury Interiors, Designed & Built In-House" },
      { property: "og:description", content: "Designed, manufactured, renovated and styled end-to-end by our own studios and factories in Bengaluru." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/media/brand/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crafted Comforts — Spaces to Sanctuaries" },
      { name: "twitter:description", content: "Luxury interiors designed and built in-house. Bengaluru." },
      { name: "twitter:image", content: "/media/brand/og-image.png" },
      { name: "theme-color", content: "#1b1a17" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/media/brand/favicon-32.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Crafted Comforts",
          image: `${SITE.websiteUrl}/media/brand/og-image.png`,
          url: SITE.websiteUrl,
          telephone: SITE.phoneDisplay,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "3092, Paramahansa Yogananda Rd, HAL 2nd Stage, Eshwara Layout, Indiranagar",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            postalCode: "560008",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 12.9698, longitude: 77.6469 },
          priceRange: "₹₹₹",
          sameAs: [SITE.instagram, SITE.facebook],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => { initAnalytics(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
