import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, Code2, FileText, FolderKanban, Plus, Search, Sparkles } from "lucide-react";
import { categories, seedResources } from "@/lib/resource-data";
import { ResourceCard } from "@/components/resource-card";
import "./home.css";

const icons = [Code2, BriefcaseBusiness, FolderKanban, FileText, Sparkles];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow"><span className="live-dot" /> Built by students, for students</span>
          <h1>Everything you need for <span>CS recruiting.</span></h1>
          <p>Discover and share the best resources for coding interviews, OAs, projects, resumes, and internships.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/resources">Browse Resources <ArrowRight size={17} /></Link>
            <Link className="btn btn-secondary" href="/resources/submit"><Plus size={17} /> Add Resource</Link>
          </div>
          <form className="hero-search" action="/resources">
            <Search size={20} /><label className="sr-only" htmlFor="home-search">Search resources</label><input id="home-search" name="q" placeholder="Search LeetCode, resume templates, internship lists…" /><button type="submit">Search</button>
          </form>
          <div className="hero-proof"><span><strong>{seedResources.length}+</strong> curated resources</span><span><strong>5</strong> focused categories</span><span><strong>100%</strong> free to browse</span></div>
        </div>
      </section>

      <section className="section container" id="categories">
        <div className="section-head"><div><span className="eyebrow">Browse by topic</span><h2>Start where you need help.</h2></div><p>Skip the endless bookmarks. Find practical, community-reviewed resources organized around your next recruiting step.</p></div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const Icon = icons[index];
            const count = seedResources.filter((resource) => resource.category === category.name).length;
            return <Link className="category-card card" href={`/${category.slug}`} key={category.slug}><span className="category-icon"><Icon size={21} /></span><h3>{category.name}</h3><p>{category.description}</p><div><span>{count} resource{count === 1 ? "" : "s"}</span><ArrowRight size={17} /></div></Link>;
          })}
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">Top this week</span><h2>Resources students keep recommending.</h2></div><Link className="text-link" href="/resources">View all resources <ArrowRight size={16} /></Link></div>
          <div className="resource-list featured-list">{seedResources.slice(0, 3).map((resource) => <ResourceCard resource={resource} key={resource.id} />)}</div>
        </div>
      </section>

      <section className="section container community-cta">
        <div><span className="cta-icon"><BookOpen /></span><span className="eyebrow">Know something useful?</span><h2>Help the next student find it faster.</h2><p>Share a resource that made recruiting clearer. Every submission is reviewed before it appears publicly.</p></div>
        <Link className="btn btn-primary" href="/resources/submit"><Plus size={17} /> Add a Resource</Link>
      </section>
    </>
  );
}
