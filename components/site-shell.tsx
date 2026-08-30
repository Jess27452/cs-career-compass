"use client";

import Link from "next/link";
import { Braces, Menu, Plus, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { appConfig } from "@/lib/config";
import "./site-shell.css";

const nav = [["Home", "/"], ["Resources", "/resources"], ["Categories", "/#categories"]];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="CSRecruit home"><span className="brand-mark"><Braces size={20} /></span><span><strong>{appConfig.name}</strong><small>{appConfig.description}</small></span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <div className="header-actions"><Link className="icon-button" href="/resources" aria-label="Search"><Search size={18} /></Link><Link className="btn add-button" href="/resources/submit"><Plus size={16} /> Add Resource</Link><Link className="profile-link" href="/profile"><UserRound size={17} /><span>Login</span></Link><button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Open menu">{open ? <X /> : <Menu />}</button></div>
  </div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{nav.map(([label, href]) => <Link href={href} onClick={() => setOpen(false)} key={href}>{label}</Link>)}<Link href="/resources/submit" onClick={() => setOpen(false)}>Add Resource</Link><Link href="/profile" onClick={() => setOpen(false)}>Login / Profile</Link></nav>}</header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><Braces size={20} /></span><span><strong>{appConfig.name}</strong><small>{appConfig.description}</small></span></Link></div><nav aria-label="Footer navigation"><Link href="/resources">Resources</Link><Link href="/resources/submit">Submit</Link><Link href="/profile">Profile</Link><Link href="/admin">Admin</Link></nav><p>Made for the CS community.</p></div></footer>;
}
