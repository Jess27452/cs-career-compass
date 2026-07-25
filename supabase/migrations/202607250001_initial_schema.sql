create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.app_role as enum ('user','admin');
create type public.visibility_status as enum ('visible','hidden');
create type public.progress_status as enum ('not_started','in_progress','completed','skipped');
create type public.application_stage as enum ('interested','preparing','applied','online_assessment','recruiter_screen','technical_interview','behavioral_interview','final_round','offer','rejected','withdrawn','closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username is null or username ~ '^[a-zA-Z0-9_]{3,30}$'),
  display_name text check (char_length(display_name) <= 80),
  bio text check (char_length(bio) <= 500),
  avatar_url text,
  school_year text,
  experience_level text,
  role public.app_role not null default 'user',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'display_name',split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin')
$$;

create table public.career_paths (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  short_description text not null, full_description text, icon text, category text not null,
  math_intensity text not null default 'medium', algorithm_importance text not null default 'medium',
  project_importance text not null default 'high', published boolean not null default true,
  sort_order int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.career_skills (
  id uuid primary key default gen_random_uuid(), career_path_id uuid not null references public.career_paths on delete cascade,
  name text not null, description text, skill_type text, importance text, sort_order int not null default 0
);
create table public.profile_career_interests (
  user_id uuid not null references public.profiles on delete cascade,
  career_path_id uuid not null references public.career_paths on delete cascade,
  primary key(user_id,career_path_id)
);
create table public.roadmap_phases (
  id uuid primary key default gen_random_uuid(), career_path_id uuid not null references public.career_paths on delete cascade,
  title text not null, description text, sort_order int not null default 0
);
create table public.roadmap_steps (
  id uuid primary key default gen_random_uuid(), roadmap_phase_id uuid not null references public.roadmap_phases on delete cascade,
  title text not null, description text not null, why_it_matters text, difficulty text, estimated_effort text,
  required boolean not null default true, sort_order int not null default 0
);
create table public.roadmap_step_prerequisites (
  roadmap_step_id uuid references public.roadmap_steps on delete cascade,
  prerequisite_step_id uuid references public.roadmap_steps on delete cascade,
  primary key(roadmap_step_id,prerequisite_step_id), check(roadmap_step_id<>prerequisite_step_id)
);
create table public.user_roadmap_progress (
  user_id uuid not null references public.profiles on delete cascade,
  roadmap_step_id uuid not null references public.roadmap_steps on delete cascade,
  status public.progress_status not null default 'not_started', completed_at timestamptz, notes text check(char_length(notes)<=2000),
  primary key(user_id,roadmap_step_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  short_description text not null, full_description text, difficulty text not null, estimated_duration text,
  project_type text, team_type text, technologies text[] not null default '{}', published boolean not null default true,
  featured boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.project_career_paths (
  project_id uuid references public.projects on delete cascade, career_path_id uuid references public.career_paths on delete cascade,
  primary key(project_id,career_path_id)
);
create table public.project_bookmarks (
  user_id uuid references public.profiles on delete cascade, project_id uuid references public.projects on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id,project_id)
);

create table public.resource_categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null unique,
  description text, sort_order int not null default 0
);
create table public.resources (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null check(char_length(title)<=120),
  url text not null check(url ~* '^https?://'), normalized_url text not null check(normalized_url ~* '^https?://'),
  short_description text not null check(char_length(short_description)<=280), detailed_description text check(char_length(detailed_description)<=5000),
  useful_for text check(char_length(useful_for)<=500), category_id uuid references public.resource_categories,
  difficulty text, pricing_type text not null default 'free' check(pricing_type in('free','paid','freemium')),
  resource_format text not null, estimated_time text, submitted_by uuid references public.profiles on delete set null,
  is_community_submitted boolean not null default true, is_verified boolean not null default false,
  is_featured boolean not null default false, is_pinned boolean not null default false,
  visibility_status public.visibility_status not null default 'visible', administrator_note text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create unique index resources_normalized_url_active_idx on public.resources(normalized_url) where deleted_at is null;
create index resources_search_idx on public.resources using gin((title||' '||short_description) gin_trgm_ops);
create index resources_visibility_idx on public.resources(visibility_status,created_at desc) where deleted_at is null;
create table public.tags (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique);
create table public.resource_tags (resource_id uuid references public.resources on delete cascade,tag_id uuid references public.tags on delete cascade,primary key(resource_id,tag_id));
create table public.resource_career_paths (resource_id uuid references public.resources on delete cascade,career_path_id uuid references public.career_paths on delete cascade,primary key(resource_id,career_path_id));
create table public.resource_votes (user_id uuid references public.profiles on delete cascade,resource_id uuid references public.resources on delete cascade,created_at timestamptz not null default now(),primary key(user_id,resource_id));
create table public.resource_bookmarks (user_id uuid references public.profiles on delete cascade,resource_id uuid references public.resources on delete cascade,created_at timestamptz not null default now(),primary key(user_id,resource_id));
create table public.resource_comments (
  id uuid primary key default gen_random_uuid(),resource_id uuid not null references public.resources on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,parent_comment_id uuid references public.resource_comments on delete cascade,
  content text not null check(char_length(content) between 1 and 3000),visibility_status public.visibility_status not null default 'visible',
  created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz
);

create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),slug text not null unique,name text not null unique,description text,sort_order int not null default 0
);
create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),slug text not null unique,author_id uuid references public.profiles on delete set null,
  category_id uuid references public.forum_categories,title text not null check(char_length(title) between 5 and 160),
  content text not null check(char_length(content) between 10 and 10000),tags text[] not null default '{}',
  is_pinned boolean not null default false,is_locked boolean not null default false,visibility_status public.visibility_status not null default 'visible',
  view_count int not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz
);
create index forum_posts_search_idx on public.forum_posts using gin((title||' '||content) gin_trgm_ops);
create table public.forum_comments (
  id uuid primary key default gen_random_uuid(),post_id uuid references public.forum_posts on delete cascade,author_id uuid references public.profiles on delete cascade,
  parent_comment_id uuid references public.forum_comments on delete cascade,content text not null check(char_length(content) between 1 and 5000),
  visibility_status public.visibility_status not null default 'visible',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),deleted_at timestamptz
);
create table public.forum_post_votes (user_id uuid references public.profiles on delete cascade,post_id uuid references public.forum_posts on delete cascade,created_at timestamptz not null default now(),primary key(user_id,post_id));
create table public.forum_comment_votes (user_id uuid references public.profiles on delete cascade,comment_id uuid references public.forum_comments on delete cascade,created_at timestamptz not null default now(),primary key(user_id,comment_id));
create table public.forum_bookmarks (user_id uuid references public.profiles on delete cascade,post_id uuid references public.forum_posts on delete cascade,created_at timestamptz not null default now(),primary key(user_id,post_id));

create table public.reports (
  id uuid primary key default gen_random_uuid(),reporter_id uuid references public.profiles on delete set null,
  content_type text not null,content_id uuid not null,reason text not null,details text check(char_length(details)<=2000),
  status text not null default 'open' check(status in('open','reviewing','resolved','dismissed')),
  reviewed_by uuid references public.profiles,reviewed_at timestamptz,created_at timestamptz not null default now()
);
create table public.moderation_logs (
  id uuid primary key default gen_random_uuid(),administrator_id uuid references public.profiles on delete set null,
  action text not null,content_type text not null,content_id uuid not null,reason text,created_at timestamptz not null default now()
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),category text not null,title text not null,description text,sort_order int not null default 0
);
create table public.user_checklist_progress (
  user_id uuid references public.profiles on delete cascade,checklist_item_id uuid references public.checklist_items on delete cascade,
  status text not null default 'not_started' check(status in('not_started','in_progress','completed','not_applicable')),
  completed_at timestamptz,primary key(user_id,checklist_item_id)
);
create table public.applications (
  id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
  company text not null check(char_length(company)<=100),position text not null check(char_length(position)<=120),
  job_url text check(job_url is null or job_url ~* '^https?://'),location text,work_arrangement text,opportunity_type text,
  application_date date,deadline date,referral_status text,contact_name text,contact_information text,
  stage public.application_stage not null default 'interested',next_action text,next_action_date date,notes text,result text,
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index applications_owner_stage_idx on public.applications(user_id,stage);
create table public.behavioral_stories (
  id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,title text not null,
  situation text,task text,action text,result text,lessons text,skills text[],created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.career_paths enable row level security; alter table public.career_skills enable row level security;
alter table public.profile_career_interests enable row level security; alter table public.roadmap_phases enable row level security;
alter table public.roadmap_steps enable row level security; alter table public.user_roadmap_progress enable row level security;
alter table public.projects enable row level security; alter table public.project_career_paths enable row level security; alter table public.project_bookmarks enable row level security;
alter table public.resource_categories enable row level security; alter table public.resources enable row level security; alter table public.tags enable row level security;
alter table public.resource_tags enable row level security; alter table public.resource_career_paths enable row level security; alter table public.resource_votes enable row level security;
alter table public.resource_bookmarks enable row level security; alter table public.resource_comments enable row level security;
alter table public.forum_categories enable row level security; alter table public.forum_posts enable row level security; alter table public.forum_comments enable row level security;
alter table public.forum_post_votes enable row level security; alter table public.forum_comment_votes enable row level security; alter table public.forum_bookmarks enable row level security;
alter table public.reports enable row level security; alter table public.moderation_logs enable row level security;
alter table public.checklist_items enable row level security; alter table public.user_checklist_progress enable row level security;
alter table public.applications enable row level security; alter table public.behavioral_stories enable row level security;

create policy "profiles public read" on public.profiles for select using(true);
create policy "profiles own update" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid() and role=(select role from public.profiles where id=auth.uid()));
create policy "admins manage profiles" on public.profiles for update using(public.is_admin()) with check(public.is_admin());
create policy "public careers" on public.career_paths for select using(published or public.is_admin());
create policy "public skills" on public.career_skills for select using(exists(select 1 from public.career_paths c where c.id=career_path_id and c.published));
create policy "public roadmap phases" on public.roadmap_phases for select using(exists(select 1 from public.career_paths c where c.id=career_path_id and c.published));
create policy "public roadmap steps" on public.roadmap_steps for select using(exists(select 1 from public.roadmap_phases p join public.career_paths c on c.id=p.career_path_id where p.id=roadmap_phase_id and c.published));
create policy "own interests" on public.profile_career_interests for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own roadmap progress" on public.user_roadmap_progress for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "public projects" on public.projects for select using(published or public.is_admin());
create policy "public project careers" on public.project_career_paths for select using(true);
create policy "own project bookmarks" on public.project_bookmarks for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "public categories" on public.resource_categories for select using(true);
create policy "public tags" on public.tags for select using(true);
create policy "public resource joins tags" on public.resource_tags for select using(true);
create policy "public resource joins careers" on public.resource_career_paths for select using(true);
create policy "visible resources" on public.resources for select using((visibility_status='visible' and deleted_at is null) or public.is_admin() or submitted_by=auth.uid());
create policy "users submit resources" on public.resources for insert to authenticated with check(submitted_by=auth.uid() and is_community_submitted and visibility_status='visible' and deleted_at is null and not is_verified and not is_featured and not is_pinned);
create policy "owners edit resources" on public.resources for update to authenticated using(submitted_by=auth.uid() and deleted_at is null) with check(submitted_by=auth.uid() and not is_verified and not is_featured and not is_pinned);
create policy "admins manage resources" on public.resources for all using(public.is_admin()) with check(public.is_admin());
create policy "own resource votes" on public.resource_votes for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own resource bookmarks" on public.resource_bookmarks for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "visible resource comments" on public.resource_comments for select using((visibility_status='visible' and deleted_at is null) or author_id=auth.uid() or public.is_admin());
create policy "users create resource comments" on public.resource_comments for insert to authenticated with check(author_id=auth.uid());
create policy "owners edit resource comments" on public.resource_comments for update using(author_id=auth.uid()) with check(author_id=auth.uid());
create policy "public forum categories" on public.forum_categories for select using(true);
create policy "visible forum posts" on public.forum_posts for select using((visibility_status='visible' and deleted_at is null) or author_id=auth.uid() or public.is_admin());
create policy "users create forum posts" on public.forum_posts for insert to authenticated with check(author_id=auth.uid() and not is_pinned and not is_locked);
create policy "owners edit forum posts" on public.forum_posts for update using(author_id=auth.uid()) with check(author_id=auth.uid() and not is_pinned);
create policy "visible forum comments" on public.forum_comments for select using((visibility_status='visible' and deleted_at is null) or author_id=auth.uid() or public.is_admin());
create policy "users create forum comments" on public.forum_comments for insert to authenticated with check(author_id=auth.uid() and exists(select 1 from public.forum_posts p where p.id=post_id and not p.is_locked and p.visibility_status='visible'));
create policy "owners edit forum comments" on public.forum_comments for update using(author_id=auth.uid()) with check(author_id=auth.uid());
create policy "own forum votes" on public.forum_post_votes for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own comment votes" on public.forum_comment_votes for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own forum bookmarks" on public.forum_bookmarks for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "users create reports" on public.reports for insert to authenticated with check(reporter_id=auth.uid() and status='open');
create policy "users see own reports" on public.reports for select using(reporter_id=auth.uid() or public.is_admin());
create policy "admins manage reports" on public.reports for update using(public.is_admin()) with check(public.is_admin());
create policy "admins see moderation logs" on public.moderation_logs for select using(public.is_admin());
create policy "admins create moderation logs" on public.moderation_logs for insert with check(public.is_admin() and administrator_id=auth.uid());
create policy "public checklist" on public.checklist_items for select using(true);
create policy "own checklist progress" on public.user_checklist_progress for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own applications only" on public.applications for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own behavioral stories only" on public.behavioral_stories for all using(user_id=auth.uid()) with check(user_id=auth.uid());

create policy "admins manage careers" on public.career_paths for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage skills" on public.career_skills for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage roadmap phases" on public.roadmap_phases for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage roadmap steps" on public.roadmap_steps for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage projects" on public.projects for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage resource categories" on public.resource_categories for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage forum" on public.forum_posts for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage forum comments" on public.forum_comments for all using(public.is_admin()) with check(public.is_admin());
