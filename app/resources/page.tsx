import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ResourceBrowser } from "@/components/resource-browser";
import { getApprovedResources } from "@/lib/resource-server";
import "./resources.css";

export const metadata: Metadata = { title: "Resources", description: "Browse community-curated CS recruiting resources." };

export default async function Page() {
  const resources = await getApprovedResources();
  return <><section className="library-hero"><div className="container"><div><span className="eyebrow">Community library</span><h1>Resources</h1><p>Find practical guides, lists, templates, and repositories recommended by students.</p></div><Link className="btn btn-primary" href="/resources/submit"><Plus size={16} /> Add Resource</Link></div></section><section className="container library-body"><ResourceBrowser resources={resources} /></section></>;
}
