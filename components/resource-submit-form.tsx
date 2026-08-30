"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { categories } from "@/lib/resource-data";
import { resourceSubmissionSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

type FormData = z.input<typeof resourceSubmissionSchema>;

export function ResourceSubmitForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(resourceSubmissionSchema) });
  const selectedCategory = watch("category");
  const subcategories = useMemo(() => categories.find((item) => item.name === selectedCategory)?.subcategories ?? [], [selectedCategory]);

  async function submit(values: FormData) {
    setMessage("");
    const supabase = createClient();
    if (!supabase) { setMessage("Connect Supabase to submit resources. The public library remains available in preview mode."); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("Please sign in before submitting a resource."); return; }
    const normalizedUrl = new URL(values.url).toString();
    const { data: duplicate } = await supabase.from("resources").select("id").eq("normalized_url", normalizedUrl).maybeSingle();
    if (duplicate) { setMessage("This resource has already been submitted."); return; }
    const { error } = await supabase.from("resources").insert({ slug: `${values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 6)}`, title: values.title, description: values.description, short_description: values.description, url: values.url, normalized_url: normalizedUrl, category: values.category, subcategory: values.subcategory, tags: values.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [], notes: values.notes || null, resource_format: "Website", visibility_status: "hidden", submitted_by: user.id, status: "pending" });
    if (error) { setMessage(error.code === "23505" ? "This resource has already been submitted." : "We couldn’t submit this resource. Please try again."); return; }
    setSuccess(true); reset();
  }

  if (success) return <div className="submission-success card"><span>✓</span><h2>Thanks! Your resource was submitted for review.</h2><p>You can track its approval status from your profile.</p><div><Link className="btn btn-primary" href="/profile">View Profile</Link><button className="btn btn-secondary" onClick={() => setSuccess(false)}>Add Another</button></div></div>;

  return <form className="submission-form card" onSubmit={handleSubmit(submit)}>
    <div className="form-grid"><Field label="Resource Name" error={errors.title?.message}><input className="field" placeholder="e.g. NeetCode 150" {...register("title")} /></Field><Field label="URL" error={errors.url?.message}><input className="field" type="url" placeholder="https://" {...register("url")} /></Field><Field label="Category" error={errors.category?.message}><select className="field" {...register("category")}><option value="">Choose a category</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></Field><Field label="Subcategory" error={errors.subcategory?.message}><select className="field" {...register("subcategory")} disabled={!selectedCategory}><option value="">Choose a subcategory</option>{subcategories.map((item) => <option key={item}>{item}</option>)}</select></Field></div>
    <Field label="One-sentence Description" error={errors.description?.message}><textarea className="field" placeholder="What is this resource and why is it useful?" {...register("description")} /></Field>
    <Field label="Tags" error={errors.tags?.message}><input className="field" placeholder="Algorithms, LeetCode, Chinese (comma-separated)" {...register("tags")} /></Field>
    <Field label="Optional Notes" error={errors.notes?.message}><textarea className="field" placeholder="Anything reviewers should know?" {...register("notes")} /></Field>
    <div className="submission-note"><strong>Reviewed before publishing</strong><p>Your submission will stay pending until an admin approves it. Only you and admins can see it in the meantime.</p></div>
    {message && <p role="alert" className="form-message">{message}{message.startsWith("Please sign in") && <> <Link href="/login">Go to sign in →</Link></>}</p>}
    <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit Resource"}</button>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="field-label">{label}{children}{error && <span className="error">{error}</span>}</label>; }
