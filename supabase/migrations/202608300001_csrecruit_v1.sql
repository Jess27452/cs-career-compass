do $$ begin
  create type public.resource_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

alter table public.profiles add column if not exists email text;
alter table public.resources add column if not exists description text;
alter table public.resources add column if not exists category text;
alter table public.resources add column if not exists subcategory text;
alter table public.resources add column if not exists tags text[] not null default '{}';
alter table public.resources add column if not exists notes text;
alter table public.resources add column if not exists status public.resource_status not null default 'pending';

update public.resources set
  description = coalesce(description, short_description),
  category = coalesce(category, 'Recruiting'),
  subcategory = coalesce(subcategory, 'Technical Interview Questions'),
  status = case when visibility_status = 'visible' then 'approved'::public.resource_status else 'pending'::public.resource_status end
where description is null or category is null or subcategory is null;

alter table public.resources alter column description set not null;
alter table public.resources alter column category set not null;
alter table public.resources alter column subcategory set not null;
create index if not exists resources_public_sort_idx on public.resources(status, created_at desc);

create table if not exists public.upvotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, resource_id)
);
alter table public.upvotes enable row level security;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, username, display_name, avatar_url, email)
  values (
    new.id,
    null,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  ) on conflict(id) do update set email=excluded.email, avatar_url=coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end $$;

create or replace function public.protect_resource_fields() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.status is distinct from old.status or new.submitted_by is distinct from old.submitted_by then
      raise exception 'Only administrators may change resource status or ownership';
    end if;
  end if;
  new.updated_at = now();
  return new;
end $$;
drop trigger if exists protect_resource_fields_trigger on public.resources;
create trigger protect_resource_fields_trigger before update on public.resources for each row execute function public.protect_resource_fields();

drop policy if exists "visible resources" on public.resources;
drop policy if exists "users submit resources" on public.resources;
drop policy if exists "owners edit resources" on public.resources;
drop policy if exists "admins manage resources" on public.resources;
create policy "approved resources are public" on public.resources for select using(status='approved' or submitted_by=auth.uid() or public.is_admin());
create policy "users submit pending resources" on public.resources for insert to authenticated with check(submitted_by=auth.uid() and status='pending');
create policy "owners edit own resources" on public.resources for update to authenticated using(submitted_by=auth.uid()) with check(submitted_by=auth.uid());
create policy "owners delete own resources" on public.resources for delete to authenticated using(submitted_by=auth.uid());
create policy "admins manage all resources" on public.resources for all using(public.is_admin()) with check(public.is_admin());

drop policy if exists "upvotes public read" on public.upvotes;
drop policy if exists "users add own upvotes" on public.upvotes;
drop policy if exists "users remove own upvotes" on public.upvotes;
create policy "upvotes public read" on public.upvotes for select using(true);
create policy "users add own upvotes" on public.upvotes for insert to authenticated with check(user_id=auth.uid());
create policy "users remove own upvotes" on public.upvotes for delete to authenticated using(user_id=auth.uid());

revoke update(role) on public.profiles from authenticated;
revoke update(status, submitted_by) on public.resources from authenticated;
revoke select on public.profiles from anon, authenticated;
grant select (id, username, display_name, avatar_url, role, created_at) on public.profiles to anon, authenticated;
