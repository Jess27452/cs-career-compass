import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, ChevronRight, Code2, FolderKanban, MessageCircle, Route, Sparkles } from "lucide-react";
import { careers, discussions, projects, resources, roadmapPhases } from "@/lib/content";
import "./home.css";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14}/> Your path, made practical</span>
            <h1>Turn your CS goals into a <span>clear career plan.</span></h1>
            <p>Explore career paths, follow practical roadmaps, build stronger projects, prepare for interviews, and learn from a community of students.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/careers">Explore Career Paths <ArrowRight size={17}/></Link>
              <Link className="btn btn-secondary" href="/roadmaps">Build My Roadmap</Link>
            </div>
            <div className="hero-proof">
              <div><strong>14</strong><span>career paths</span></div>
              <div><strong>24</strong><span>project briefs</span></div>
              <div><strong>30+</strong><span>trusted resources</span></div>
            </div>
          </div>
          <RoadmapIllustration />
        </div>
      </section>

      <section className="container trust-strip" aria-label="Platform capabilities">
        <span><Route size={17}/> Structured roadmaps</span><span><FolderKanban size={17}/> Portfolio projects</span><span><BriefcaseBusiness size={17}/> Recruiting tracker</span><span><MessageCircle size={17}/> Student community</span>
      </section>

      <section className="section container">
        <div className="section-head"><div><span className="eyebrow">Start with direction</span><h2>Find a path that fits how you think.</h2></div><p>Compare the work, tools, math, and interview expectations behind different CS careers—without pretending every company is the same.</p></div>
        <div className="career-preview">
          {careers.slice(0,6).map((career, i) => <Link className="career-card card" href={`/careers/${career.slug}`} key={career.slug}>
            <div className={`career-icon tone-${i%4}`}><Code2 size={20}/></div><span className="pill">{career.category}</span>
            <h3>{career.name}</h3><p>{career.description}</p>
            <div className="tag-row">{career.tools.slice(0,3).map(t=><span key={t}>{t}</span>)}</div>
            <div className="card-link">Explore path <ChevronRight size={16}/></div>
          </Link>)}
        </div>
        <div className="center-action"><Link className="btn btn-secondary" href="/careers">Compare all 14 paths <ArrowRight size={16}/></Link></div>
      </section>

      <section className="section roadmap-section">
        <div className="container roadmap-layout">
          <div><span className="eyebrow">A plan that moves</span><h2>Know what to work on next.</h2><p className="muted">Follow connected milestones, save progress, and get the next three actions based on your goal. Every step explains why it matters.</p><Link className="btn btn-primary" href="/roadmaps">Preview the roadmap <ArrowRight size={16}/></Link></div>
          <div className="roadmap-mini card">{roadmapPhases.slice(0,5).map((p,i)=><div className={i===2?"active":""} key={p[0]}><span>{i<2?<Check size={15}/>:p[0]}</span><div><strong>{p[1]}</strong><small>{p[3]}</small></div>{i===2&&<em>Up next</em>}</div>)}</div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><div><span className="eyebrow">Build evidence</span><h2>Projects with something to prove.</h2></div><Link className="btn btn-ghost" href="/projects">Browse all projects <ArrowRight size={16}/></Link></div>
        <div className="project-preview">{projects.slice(0,3).map((p,i)=><Link className="project-card card" href={`/projects/${p.slug}`} key={p.slug}><div className={`project-number n${i}`}>0{i+1}</div><span className="pill">{p.difficulty}</span><h3>{p.title}</h3><p>{p.description}</p><strong>{p.tech}</strong><span className="card-link">Open project brief <ArrowRight size={16}/></span></Link>)}</div>
      </section>

      <section className="section warm-panel">
        <div className="container split-preview">
          <div><span className="eyebrow">Recruit with a system</span><h2>The semester changes. Your plan should too.</h2><p>See typical recruiting windows by academic year, then track every application and next action privately.</p><div className="timeline-chips"><span className="selected">Aug–Oct</span><span>Nov–Dec</span><span>Jan–Apr</span><span>May–Jul</span></div><div className="timeline-note"><BriefcaseBusiness/><div><strong>Apply while you keep preparing</strong><p>Many large-company internship and new-grad roles open early. Startups, research, and local teams often hire later.</p></div></div><Link className="btn btn-secondary" href="/recruiting">See the recruiting timeline</Link></div>
          <div className="dashboard-peek card"><div className="peek-head"><div><span className="eyebrow">Your week</span><h3>Keep the momentum.</h3></div><span className="progress-ring">68%</span></div><div className="next-list"><label><input type="checkbox" defaultChecked/> Polish project README</label><label><input type="checkbox"/> Practice two-pointer patterns</label><label><input type="checkbox"/> Follow up with campus recruiter</label></div><div className="applications-row"><div><strong>24</strong><span>applications</span></div><div><strong>5</strong><span>interviews</span></div><div><strong>3</strong><span>next actions</span></div></div></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><div><span className="eyebrow">Learn from signal</span><h2>Trusted starting points.</h2></div><Link className="btn btn-ghost" href="/resources">Open resource library <ArrowRight size={16}/></Link></div>
        <div className="resource-preview">{resources.filter(r=>r.featured).slice(0,4).map(r=><a className="resource-row card" href={r.url} target="_blank" rel="noopener noreferrer" key={r.url}><span className="resource-logo"><BookOpen size={19}/></span><div><strong>{r.title}</strong><p>{r.description}</p></div><span className="pill">{r.format}</span><ArrowRight size={17}/></a>)}</div>
      </section>

      <section className="section community-section">
        <div className="container"><div className="section-head"><div><span className="eyebrow">Better together</span><h2>Ask the question you wish someone had answered.</h2></div><Link className="btn btn-secondary" href="/community">Join the conversation</Link></div>
        <div className="discussion-list card">{discussions.map(d=><Link href="/community" className="discussion-row" key={d.title}><div className="vote-box"><strong>{d.votes}</strong><span>votes</span></div><div><span className="pill">{d.category}</span><h3>{d.title}</h3><p>Started by {d.author} · {d.last}</p></div><span className="reply-count"><MessageCircle size={16}/>{d.replies}</span></Link>)}</div></div>
      </section>

      <section className="section container cta">
        <div><span className="eyebrow">Your next step is enough</span><h2>Make your career plan feel doable.</h2><p>Choose a direction today. You can refine it as you learn.</p></div><div><Link className="btn btn-primary" href="/signup">Create my free plan <ArrowRight size={16}/></Link><Link className="btn btn-secondary" href="/careers">Browse as a visitor</Link></div>
      </section>
    </>
  );
}

function RoadmapIllustration() {
  return <div className="hero-visual" aria-label="Illustration of a career roadmap with connected milestones">
    <div className="visual-top"><span className="pill">Software Engineering</span><span className="visual-progress">Roadmap · 32%</span></div>
    <div className="journey-line"/>
    <div className="milestone m1 done"><span><Check/></span><div><small>FOUNDATION</small><strong>Programming fluency</strong><em>Completed</em></div></div>
    <div className="milestone m2 current"><span><Code2/></span><div><small>BUILD</small><strong>Ship a useful API</strong><em>Up next · 2 weeks</em></div></div>
    <div className="milestone m3"><span><BriefcaseBusiness/></span><div><small>PREPARE</small><strong>Tell your project story</strong><em>Locked</em></div></div>
    <div className="floating-card"><Sparkles size={16}/><div><small>Compass suggestion</small><strong>Start with one endpoint.</strong></div></div>
  </div>
}
