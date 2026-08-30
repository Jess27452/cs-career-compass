import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/server";
import { AdminResourceList } from "@/components/admin-resource-list";
import type { OwnedResource } from "@/components/profile-resources";
import "./admin.css";
export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page() { const { supabase, user, isAdmin } = await requireAdmin(); if (!user || !supabase || !isAdmin) return <section className="section container"><div className="card admin-denied"><ShieldCheck /><h1>Administrator access required</h1><p>Sign in with an administrator account to review community submissions.</p><Link className="btn btn-primary" href="/login">Sign in</Link></div></section>; const { data } = await supabase.from("resources").select("id,title,description,url,status,created_at,category,subcategory,submitted_by,profiles(username)").eq("status", "pending").order("created_at", { ascending: true }); return <section className="section container admin-page"><header><div><span className="eyebrow">Moderation</span><h1>Pending submissions</h1><p>Review each resource before it becomes visible in the public library.</p></div><span>{data?.length ?? 0} waiting</span></header><AdminResourceList initialResources={(data ?? []) as unknown as (OwnedResource & { submitted_by?: string; profiles?: { username?: string | null } | null })[]} /></section>; }
