import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { categories, slugify } from "@/lib/resource-data";
import { ResourceBrowser } from "@/components/resource-browser";
import { getApprovedResources } from "@/lib/resource-server";
import "@/app/resources/resources.css";
import "./category-page.css";

export async function CategoryPage({ slug, subcategory = "" }: { slug: string; subcategory?: string }) {
  const category = categories.find((item) => item.slug === slug)!;
  const activeSubcategory = category.subcategories.find((item) => slugify(item) === subcategory) ?? "";
  const resources = await getApprovedResources({ category: category.name });
  return <><section className="category-hero"><div className="container"><Link className="back-link" href="/resources"><ArrowLeft size={15} /> All resources</Link><div className="category-hero-row"><div><span className="eyebrow">Resource category</span><h1>{activeSubcategory || category.name}</h1><p>{activeSubcategory ? `${activeSubcategory} resources curated by the CSRecruit community.` : category.description}</p></div><Link className="btn btn-primary" href="/resources/submit"><Plus size={16} /> Add Resource</Link></div><nav className="subcategory-tabs" aria-label={`${category.name} subcategories`}><Link className={!activeSubcategory ? "active" : ""} href={`/${slug}`}>All</Link>{category.subcategories.map((item) => <Link className={item === activeSubcategory ? "active" : ""} href={`/${slug}/${slugify(item)}`} key={item}>{item}</Link>)}</nav></div></section><section className="container library-body"><ResourceBrowser initialCategory={category.name} initialSubcategory={activeSubcategory} resources={resources} /></section></>;
}
