import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResourceSubmitForm } from "@/components/resource-submit-form";
import "./submit.css";
export const metadata: Metadata = { title: "Submit a resource", robots: { index: false, follow: false } };
export default function Page() { return <section className="section container submit-page"><div className="submit-intro"><Link href="/resources"><ArrowLeft size={15} /> Back to resources</Link><span className="eyebrow">Community contribution</span><h1>Share a resource that helped.</h1><p>Keep it focused and useful. We validate links, prevent duplicate URLs, and review every submission before it becomes public.</p></div><ResourceSubmitForm /></section>; }
