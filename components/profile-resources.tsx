"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type OwnedResource = { id: string; title: string; description: string; url: string; status: "pending" | "approved" | "rejected"; created_at: string; category: string; subcategory: string };

export function ProfileResources({ initialResources }: { initialResources: OwnedResource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  async function remove(id: string) { if (!confirm("Delete this submission? This cannot be undone.")) return; const supabase = createClient(); if (!supabase) return; const { error } = await supabase.from("resources").delete().eq("id", id); if (!error) setResources((items) => items.filter((item) => item.id !== id)); else setMessage("Could not delete that resource."); }
  async function save(event: React.FormEvent<HTMLFormElement>, resource: OwnedResource) { event.preventDefault(); const data = new FormData(event.currentTarget); const updates = { title: String(data.get("title")), description: String(data.get("description")) }; const supabase = createClient(); if (!supabase) return; const { error } = await supabase.from("resources").update(updates).eq("id", resource.id); if (!error) { setResources((items) => items.map((item) => item.id === resource.id ? { ...item, ...updates } : item)); setEditing(null); } else setMessage("Could not save your changes."); }
  if (!resources.length) return <div className="empty">You haven’t submitted any resources yet.</div>;
  return <div className="profile-resource-list">{message && <p className="error">{message}</p>}{resources.map((resource) => <article className="card profile-resource" key={resource.id}>{editing === resource.id ? <form onSubmit={(event) => save(event, resource)}><input className="field" name="title" defaultValue={resource.title} required /><textarea className="field" name="description" defaultValue={resource.description} required /><div><button className="btn btn-primary">Save</button><button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button></div></form> : <><div><span className={`status status-${resource.status}`}>{resource.status}</span><small>{resource.category} / {resource.subcategory}</small></div><h3>{resource.title}</h3><p>{resource.description}</p><footer><a href={resource.url} target="_blank" rel="noopener noreferrer">Open <ExternalLink size={13} /></a><span><button onClick={() => setEditing(resource.id)}><Pencil size={14} /> Edit</button><button className="danger" onClick={() => remove(resource.id)}><Trash2 size={14} /> Delete</button></span></footer></>}</article>)}</div>;
}
