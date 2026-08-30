import "server-only";
import { createClient } from "@/lib/supabase/server";
import { seedResources, type Resource } from "@/lib/resource-data";

export async function getApprovedResources(options: { category?: string; limit?: number } = {}): Promise<Resource[]> {
  const supabase = await createClient();
  if (!supabase) return options.category ? seedResources.filter((item) => item.category === options.category) : seedResources;
  let query = supabase.from("resources").select("id,title,description,url,category,subcategory,tags,submitted_by,status,created_at,profiles(username,avatar_url),upvotes(count)").eq("status", "approved").order("created_at", { ascending: false });
  if (options.category) query = query.eq("category", options.category);
  if (options.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error || !data?.length) return options.category ? seedResources.filter((item) => item.category === options.category) : seedResources;
  return data.map((row: Record<string, unknown>) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const votes = Array.isArray(row.upvotes) ? row.upvotes[0] : undefined;
    return { id: String(row.id), title: String(row.title), description: String(row.description), url: String(row.url), category: String(row.category), subcategory: String(row.subcategory), tags: Array.isArray(row.tags) ? row.tags.map(String) : [], submittedBy: (profile as { username?: string } | null)?.username || "Community member", submittedById: String(row.submitted_by || ""), avatarUrl: (profile as { avatar_url?: string } | null)?.avatar_url, createdAt: String(row.created_at), upvotes: Number((votes as { count?: number } | undefined)?.count ?? 0), status: "approved" };
  });
}
