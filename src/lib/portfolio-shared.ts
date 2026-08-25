/** Browser-safe types & helpers shared by the portfolio page and the admin UI. */

export const PROJECT_CATEGORIES = ["Residential", "Hospitality", "Commercial", "Films"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface DbProjectImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  storage_path: string;
}

export interface DbProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  description: string;
  sort_order: number;
  published: boolean;
  images: DbProjectImage[];
}

export const mediaUrl = (storagePath: string) =>
  `/api/public/portfolio-media/${storagePath.split("/").map(encodeURIComponent).join("/")}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
