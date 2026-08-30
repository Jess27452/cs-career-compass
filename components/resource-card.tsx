"use client";

import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/lib/resource-data";

export function ResourceCard({ resource }: { resource: Resource }) {
  const [votes, setVotes] = useState(resource.upvotes);
  const [voted, setVoted] = useState(false);
  const [notice, setNotice] = useState("");

  async function toggleVote() {
    const supabase = createClient();
    if (!supabase) {
      setNotice("Sign in to upvote");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setNotice("Sign in to upvote");
      return;
    }
    const next = !voted;
    setVoted(next);
    setVotes((count) => count + (next ? 1 : -1));
    const result = next
      ? await supabase.from("upvotes").insert({ user_id: user.id, resource_id: resource.id })
      : await supabase.from("upvotes").delete().eq("user_id", user.id).eq("resource_id", resource.id);
    if (result.error) {
      setVoted(!next);
      setVotes((count) => count + (next ? -1 : 1));
      setNotice("Could not update your vote");
    } else setNotice("");
  }

  return (
    <article className="resource-card card">
      <div className="resource-card-top">
        <div className="resource-path">
          <Link href={`/${resource.category.toLowerCase()}`}>{resource.category}</Link>
          <span>/</span>
          <span>{resource.subcategory}</span>
        </div>
        <button className={`vote-button ${voted ? "voted" : ""}`} onClick={toggleVote} aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${resource.title}`} aria-pressed={voted}>
          <ArrowUp size={16} /> {votes}
        </button>
      </div>
      <h2>{resource.title}</h2>
      <p>{resource.description}</p>
      <div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      <div className="resource-card-bottom">
        <div className="submitted-by">
          <span className="avatar" aria-hidden="true">{resource.submittedBy.slice(0, 1).toUpperCase()}</span>
          <span>Added by <strong>{resource.submittedBy}</strong><small>{new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</small></span>
        </div>
        <a className="resource-link" href={resource.url} target="_blank" rel="noopener noreferrer">View Resource <ExternalLink size={15} /></a>
      </div>
      {notice && <p className="card-notice" role="status">{notice === "Sign in to upvote" ? <><Link href="/login">Sign in</Link> to upvote.</> : notice}</p>}
    </article>
  );
}
