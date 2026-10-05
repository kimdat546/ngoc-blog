-- Comments for blog posts (Cloudflare D1 / SQLite)
create table if not exists comments (
  id text primary key,
  post_slug text not null,
  post_id text,
  name text,
  email text,
  content text not null,
  ip_hash text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create index if not exists comments_post_slug_created_idx
  on comments (post_slug, created_at desc);
