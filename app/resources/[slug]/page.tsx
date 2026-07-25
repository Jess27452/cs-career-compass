import Link from "next/link";
import { ExternalLink, Bookmark, Flag, ThumbsUp, BadgeCheck } from "lucide-react";
import { resources } from "@/lib/content";
import "../../detail.css";

export function generateStaticParams() {
  return resources.map(({ slug }) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = resources.find((item) => item.slug === slug);

  if (!resource) {
    return (
      <section className="section container">
        <div className="empty">
          <h1>Resource not found</h1>
          <p>It may be hidden, removed, or the link may be incorrect.</p>
          <Link className="btn btn-secondary" href="/resources">Back to resources</Link>
        </div>
      </section>
    );
  }

  const domain = new URL(resource.url).hostname.replace(/^www\./, "");
  return (
    <>
      <section className="detail-hero">
        <div className="container">
          <Link href="/resources">← Resource library</Link>
          <div className="detail-title">
            <span className="detail-icon"><BadgeCheck /></span>
            <div>
              <div className="tag-row">
                <span className="pill">Administrator verified</span>
                <span className="pill">free</span>
              </div>
              <h1>{resource.title}</h1>
              <p>{resource.description}</p>
            </div>
          </div>
          <a className="btn btn-primary" href={resource.url} target="_blank" rel="noopener noreferrer">
            Visit {domain} <ExternalLink size={16} />
          </a>
        </div>
      </section>
      <div className="container detail-layout">
        <article className="detail-main">
          <section>
            <span className="eyebrow">About this resource</span>
            <h2>What you’ll find</h2>
            <p>{resource.description}</p>
            <p>This external resource opens in a new tab. A well-formatted URL is not a guarantee of safety; report anything broken, misleading, or inappropriate.</p>
          </section>
          <section>
            <span className="eyebrow">Community</span>
            <h2>Discussion</h2>
            <div className="empty">Sign in to ask a focused question or share how you used this resource.</div>
          </section>
        </article>
        <aside className="detail-aside">
          <div className="card">
            <h2>Resource details</h2>
            <dl>
              <div><dt>Format</dt><dd>{resource.format}</dd></div>
              <div><dt>Category</dt><dd>{resource.category}</dd></div>
              <div><dt>Pricing</dt><dd>Free</dd></div>
              <div><dt>Destination</dt><dd>{domain}</dd></div>
            </dl>
          </div>
          <div className="card">
            <button className="aside-item"><ThumbsUp size={15} /> Upvote</button>
            <button className="aside-item"><Bookmark size={15} /> Bookmark</button>
            <button className="aside-item"><Flag size={15} /> Report</button>
          </div>
        </aside>
      </div>
    </>
  );
}
