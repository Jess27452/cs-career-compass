import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import "./admin.css";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="section container">
      <div className="card admin-denied">
        <ShieldCheck />
        <h1>Administrator access required</h1>
        <p>Administration is unavailable in the public static preview.</p>
        <Link className="btn btn-primary" href="/login">Sign in</Link>
      </div>
    </section>
  );
}
