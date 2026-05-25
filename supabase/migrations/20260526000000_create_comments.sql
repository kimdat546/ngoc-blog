-- Comments for blog posts
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  post_id text,
  name text,
  email text,
  content text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_slug_created_idx
  on public.comments (post_slug, created_at desc);

-- Enable RLS. All access happens server-side with the service role,
-- which bypasses RLS, so no anon policies are needed.
alter table public.comments enable row level security;
