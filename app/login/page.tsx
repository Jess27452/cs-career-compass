import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import "../auth.css";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default function Page() { return <section className="auth-page"><div className="card auth-card"><span className="eyebrow">Welcome to CSRecruit</span><h1>Sign in to contribute.</h1><p>Submit resources, upvote useful finds, and manage everything you’ve shared.</p><AuthForm mode="login" /></div></section>; }
