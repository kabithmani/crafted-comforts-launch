import { createServerFn } from "@tanstack/react-start";
import { publicServerClient } from "./supabase-public.server";
import { mediaUrl, type DbProject } from "./portfolio-shared";

/** Public read of admin-managed portfolio projects (published only, RLS as anon). */
export const getPortfolioProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<DbProject[]> => {
    const supabase = publicServerClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("id,title,slug,location,category,description,sort_order,published,portfolio_images(id,storage_path,alt,position)")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[portfolio] read failed", error.message);
      return [];
    }

    return (data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      location: p.location,
      category: p.category,
      description: p.description,
      sort_order: p.sort_order,
      published: p.published,
      images: [...(p.portfolio_images ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((img) => ({
          id: img.id,
          storage_path: img.storage_path,
          url: mediaUrl(img.storage_path),
          alt: img.alt,
          position: img.position,
        })),
    }));
  },
);
