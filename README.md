# CS Career Compass

[![Deploy to GitHub Pages](https://github.com/Jess27452/cs-career-compass/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Jess27452/cs-career-compass/actions/workflows/deploy-pages.yml)

CS Career Compass turns broad computer-science career advice into concrete next steps. Visitors can compare career paths, browse milestone roadmaps, explore substantial project briefs, understand recruiting cycles, prepare for interviews, search trusted resources, and read community discussions. Accounts add private progress, bookmarks, behavioral stories, and application tracking. Community resources publish immediately after validation and remain subject to reporting and administrator moderation.

**Live site:** [jess27452.github.io/cs-career-compass](https://jess27452.github.io/cs-career-compass/)

## Product areas

- Fourteen career paths with tools, learning curve, math, algorithm, project, title, and roadmap guidance
- Nine-phase roadmaps with persistent per-user status and notes
- Twenty-four career-specific project briefs with milestones, testing, security, and interview framing
- Recruiting timelines, opportunity guidance, and scam-awareness guidance
- Twenty-one interview topics plus a private STAR story organizer
- Thirty seeded durable external resources, searchable filters, submissions, votes, bookmarks, comments, and reports
- Forum categories, posts, replies, votes, bookmarks, locks, pinning, and moderation
- Personalized dashboard, checklist, onboarding, bookmarks, and private application tracker
- Protected administrator area with database-enforced role checks and moderation logging
- Responsive light/dark design, keyboard focus, reduced-motion support, semantic structure, metadata, sitemap, and robots controls

## Screenshots

Add deployment screenshots here after the production domain and final content review are complete. The repository includes `public/og.png`, a product-specific social card.

## Stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4 with CSS variables and reusable product components
- Supabase Auth and PostgreSQL with Row Level Security
- Zod, React Hook Form, and server-side revalidation
- Lucide icons
- Node test runner for unit, authorization, and rendered-route checks
- Vercel production target; the repository can also build a Cloudflare-compatible preview with Vinext

## Architecture

Public educational content is server-rendered or statically seeded. Interactive explorers are small Client Components. Supabase browser clients use only the public anon key. Server routes revalidate the authenticated user with `auth.getUser()` and rely on PostgreSQL RLS as the final authorization boundary. The service-role key is optional and must never be imported into browser code.

Important paths:

```text
app/                 App Router pages, metadata, and API routes
components/          Reusable interactive product components
lib/                 Configuration, content, Supabase clients, validation
supabase/migrations/ Database schema, constraints, indexes, and RLS
supabase/seed.sql     Replaceable educational seed content
tests/               Validation, authorization, and rendered-route checks
public/              Static brand assets and social preview
```

## Local setup

Prerequisites: Node.js 22+, pnpm, a Supabase project, and the Supabase CLI.

```bash
git clone <your-repository-url>
cd cs-career-compass
pnpm install
cp .env.example .env.local
pnpm dev
```

Fill `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is included in the example only for future tightly scoped server administration. The current browser bundle does not use it. Never prefix it with `NEXT_PUBLIC_`.

## Supabase database and authentication

Create a project in the [Supabase dashboard](https://supabase.com/dashboard), then:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db reset --linked
```

`supabase db push` applies migrations. To seed a clean linked development database, use:

```bash
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

In Supabase Authentication:

1. Enable email/password.
2. Set the Site URL to `NEXT_PUBLIC_SITE_URL`.
3. Add local and production callback URLs.
4. Configure email confirmation and password-reset templates.
5. Optionally enable GitHub or Google OAuth and add their provider secrets in Supabase.

The `handle_new_user` trigger creates a profile after signup.

## Assign the first administrator

There is intentionally no public administrator signup. After creating the first normal account, run this in the Supabase SQL editor using the account email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');
```

Subsequent role changes should be made by a trusted administrator workflow. Profile self-update RLS prevents a user from promoting their own role.

## Permission model

- Anonymous: published careers, roadmap content, projects, visible resources, visible posts, and visible comments
- Authenticated: own profile, interests, progress, tracker, stories, submissions, comments, votes, bookmarks, and reports
- Resource submitter: own community submission only; cannot set verified, featured, or pinned fields
- Forum author: own content only, subject to lock and visibility rules
- Administrator: public content, moderation, reports, and content management
- Applications and behavioral stories: owner-only, including against administrators in normal product access

Composite primary keys prevent duplicate votes and bookmarks. Partial unique indexes prevent duplicate active normalized resource URLs. Hidden or soft-deleted content is excluded from public reads.

## Commands

```bash
pnpm dev              # local Cloudflare-compatible preview
pnpm build            # validated preview deployment build
pnpm build:pages      # static GitHub Pages export
pnpm build:vercel     # native Next.js production build
pnpm lint
pnpm test             # validation and RLS contract tests
pnpm test:e2e         # rendered public-route tests after pnpm build
```

## Deploy to Vercel

1. Push this directory to GitHub.
2. Import the repository in Vercel and choose Next.js.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`.
4. Use `pnpm build:vercel` as the build command (also specified in `vercel.json`).
5. Add the production URL to Supabase Auth redirect URLs.
6. Apply migrations and seed production before opening signups.
7. Run a smoke test with two normal users and one administrator.

## Deploy to GitHub Pages

Every push to `main` runs `.github/workflows/deploy-pages.yml` and publishes the
static export to [the live GitHub Pages site](https://jess27452.github.io/cs-career-compass/).
GitHub Pages does not run server-side Next.js routes, so Supabase-backed account
features require the public browser credentials to be configured as repository
secrets. Use Vercel or another server-capable host when server routes are required.

## Security notes

- User text is rendered as text; raw HTML is never accepted.
- URLs are limited to normalized HTTP(S) values. The server does not fetch submitted sites.
- All writes validate authenticated identity and database RLS.
- Private user tables have owner-only policies.
- Destructive moderation should use confirmation and write to `moderation_logs`.
- Production should add edge rate limiting, abuse monitoring, backup verification, and email deliverability monitoring.
- A formatted URL is not automatically safe; community reporting and administrator removal remain necessary.

## Testing checklist

Before release, verify signup/onboarding, progress, immediate resource publication, cross-user edit denial, administrator moderation, forum participation, tracker privacy, hidden-content filtering, mobile navigation, keyboard focus, and auth recovery. The SQL contract tests assert the core RLS invariants; a real Supabase test project should run the full multi-user end-to-end suite.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes focused, test authorization at both server and database layers, and do not add copyrighted problem statements or employment guarantees.

## Future improvements

- Postgres full-text ranking and typo dictionaries for large-scale global search
- Resumable avatar uploads through Supabase Storage
- Queued email reminders for user-created deadlines
- Audited bulk moderation and duplicate merge tooling
- Analytics that preserve student privacy
- Playwright multi-user tests against an ephemeral Supabase branch

## License

MIT
