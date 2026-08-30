import type { Metadata } from "next";
import Link from "next/link";
import { Plus, UserRound } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { ProfileResources, type OwnedResource } from "@/components/profile-resources";
import { SignOutButton } from "@/components/sign-out-button";
import "./profile.css";
export const metadata: Metadata = { title: "Profile", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page() {
  const { supabase, user } = await requireUser();
  if (!user || !supabase) return <section className="section container profile-signin"><div className="card"><UserRound /><h1>Your CSRecruit profile</h1><p>Sign in to submit resources, upvote useful finds, and manage your contributions.</p><Link className="btn btn-primary" href="/login">Sign in</Link></div></section>;
  const [{ data: profile }, { data: resources }] = await Promise.all([supabase.from("profiles").select("username,avatar_url").eq("id", user.id).maybeSingle(), supabase.from("resources").select("id,title,description,url,status,created_at,category,subcategory").eq("submitted_by", user.id).order("created_at", { ascending: false })]);
  const owned = (resources ?? []) as OwnedResource[];
  const approved = owned.filter((item) => item.status === "approved").length;
  const resourceIds = owned.map((item) => item.id);
  const { count: totalUpvotes } = resourceIds.length ? await supabase.from("upvotes").select("id", { count: "exact", head: true }).in("resource_id", resourceIds) : { count: 0 };
  return <section className="section container profile-page"><header className="profile-header card"><span className="profile-avatar">{(profile?.username || user.email || "U").slice(0, 1).toUpperCase()}</span><div><span className="eyebrow">Your profile</span><h1>{profile?.username || user.user_metadata?.user_name || user.email?.split("@")[0]}</h1><p>{user.email}</p></div><Link className="btn btn-primary" href="/resources/submit"><Plus size={16} /> Add Resource</Link></header><div className="profile-stats"><div className="card"><strong>{owned.length}</strong><span>Resources submitted</span></div><div className="card"><strong>{approved}</strong><span>Approved</span></div><div className="card"><strong>{totalUpvotes ?? 0}</strong><span>Total upvotes received</span></div></div><div className="profile-section-head"><div><span className="eyebrow">Your submissions</span><h2>Resources you’ve shared</h2></div><SignOutButton /></div><ProfileResources initialResources={owned} /></section>;
}
