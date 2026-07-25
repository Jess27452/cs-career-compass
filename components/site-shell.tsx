"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, Menu, Moon, Search, Sun, X } from "lucide-react";
import { appConfig } from "@/lib/config";
import "./site-shell.css";

const nav = [
  ["Home", "/"],
  ["Career Paths", "/careers"],
  ["Roadmaps", "/roadmaps"],
  ["Projects", "/projects"],
  ["Recruiting", "/recruiting"],
  ["Interview Prep", "/interview-prep"],
  ["Resources", "/resources"],
  ["Community", "/community"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme") === "dark";
    // Hydrate the persisted device preference after the server-rendered shell mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(stored);
    document.documentElement.dataset.theme = stored ? "dark" : "light";
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${appConfig.name} home`}>
          <span className="brand-mark"><Compass size={22} /></span>
          <span>{appConfig.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Search"><Search size={19} /></Link>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme">
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link className="btn btn-primary sign-in" href="/login">Sign in</Link>
          <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Open menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/applications">Application tracker</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand" href="/"><span className="brand-mark"><Compass size={22}/></span>{appConfig.name}</Link>
          <p>{appConfig.description}</p>
        </div>
        <div><h3>Explore</h3><Link href="/careers">Career paths</Link><Link href="/projects">Projects</Link><Link href="/resources">Resources</Link><Link href="/community">Community</Link></div>
        <div><h3>Plan</h3><Link href="/roadmaps">Roadmaps</Link><Link href="/recruiting">Recruiting</Link><Link href="/interview-prep">Interview prep</Link><Link href="/applications">Application tracker</Link></div>
        <div><h3>About</h3><Link href="/community-guidelines">Community guidelines</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href={`mailto:${appConfig.contactEmail}`}>Feedback</a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {appConfig.name}</span><span>Built to make the next step clearer.</span></div>
    </footer>
  );
}
