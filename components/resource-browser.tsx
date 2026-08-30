"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, seedResources, slugify, type Resource } from "@/lib/resource-data";
import { ResourceCard } from "@/components/resource-card";

export function ResourceBrowser({ initialCategory = "", initialSubcategory = "", resources = seedResources }: { initialCategory?: string; initialSubcategory?: string; resources?: Resource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("upvotes");
  const subcategories = categories.find((item) => item.name === category)?.subcategories ?? [];
  const tags = [...new Set(resources.flatMap((resource) => resource.tags))].sort();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources
      .filter((resource) => resource.status === "approved")
      .filter((resource) => !category || resource.category === category)
      .filter((resource) => !subcategory || slugify(resource.subcategory) === slugify(subcategory))
      .filter((resource) => !tag || resource.tags.includes(tag))
      .filter((resource) => !normalized || `${resource.title} ${resource.description} ${resource.tags.join(" ")} ${resource.category} ${resource.subcategory}`.toLowerCase().includes(normalized))
      .sort((a, b) => sort === "newest" ? +new Date(b.createdAt) - +new Date(a.createdAt) : sort === "popular" ? (b.upvotes / Math.max(1, (Date.now() - +new Date(b.createdAt)) / 86400000)) - (a.upvotes / Math.max(1, (Date.now() - +new Date(a.createdAt)) / 86400000)) : b.upvotes - a.upvotes);
  }, [category, query, resources, sort, subcategory, tag]);

  return (
    <>
      <div className="resource-filters card">
        <label className="resource-search"><Search size={19} /><span className="sr-only">Search resources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources, tags, or categories…" /></label>
        <label><SlidersHorizontal size={16} /><span className="sr-only">Category</span><select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory(""); }}><option value="">All categories</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label>
        <label><span className="sr-only">Subcategory</span><select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} disabled={!category}><option value="">All subcategories</option>{subcategories.map((item) => <option key={item} value={slugify(item)}>{item}</option>)}</select></label>
        <label><span className="sr-only">Tag</span><select value={tag} onChange={(event) => setTag(event.target.value)}><option value="">All tags</option>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="upvotes">Most Upvoted</option><option value="newest">Newest</option><option value="popular">Popular</option></select></label>
      </div>
      <div className="results-heading"><span>{filtered.length} resource{filtered.length === 1 ? "" : "s"}</span><span>Community reviewed</span></div>
      <div className="resource-list">{filtered.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}</div>
      {!filtered.length && <div className="empty">No resources match those filters. Try a broader search.</div>}
    </>
  );
}
