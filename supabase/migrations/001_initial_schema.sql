-- Cyber jobs lookup table
create table public.cyber_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  description text not null default ''
);

-- User profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  cyber_job text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Articles (news from 2077)
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles on delete cascade,
  template text not null check (template in ('headline', 'flash', 'obituary', 'ad')),
  user_input text not null,
  title text not null,
  subtitle text,
  content text not null,
  news_date text not null default '2077-03-19',
  created_at timestamptz not null default now()
);

-- Votes (dual-axis)
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  crazy_score smallint not null check (crazy_score between 1 and 5),
  real_score smallint not null check (real_score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (article_id, user_id)
);

-- Indexes
create index idx_articles_created_at on public.articles (created_at desc);
create index idx_articles_author_id on public.articles (author_id);
create index idx_votes_article_id on public.votes (article_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.votes enable row level security;
alter table public.cyber_jobs enable row level security;

-- Profiles: anyone can read, users can update their own
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Articles: anyone can read, authenticated users can insert their own
create policy "articles_select" on public.articles for select using (true);
create policy "articles_insert" on public.articles for insert with check (auth.uid() = author_id);

-- Votes: anyone can read, authenticated users can manage their own
create policy "votes_select" on public.votes for select using (true);
create policy "votes_insert" on public.votes for insert with check (auth.uid() = user_id);
create policy "votes_update" on public.votes for update using (auth.uid() = user_id);

-- Cyber jobs: anyone can read
create policy "cyber_jobs_select" on public.cyber_jobs for select using (true);

-- Function: auto-create profile on signup with random cyber job
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  random_job text;
begin
  select title into random_job
  from public.cyber_jobs
  order by random()
  limit 1;

  insert into public.profiles (id, display_name, cyber_job)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Anonymous'),
    coalesce(random_job, '时空流浪者')
  );
  return new;
end;
$$;

-- Trigger: call on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- View: articles with vote aggregates
create or replace view public.articles_with_votes as
select
  a.*,
  coalesce(v.vote_count, 0) as vote_count,
  coalesce(v.avg_crazy, 0) as avg_crazy,
  coalesce(v.avg_real, 0) as avg_real
from public.articles a
left join (
  select
    article_id,
    count(*) as vote_count,
    round(avg(crazy_score)::numeric, 1) as avg_crazy,
    round(avg(real_score)::numeric, 1) as avg_real
  from public.votes
  group by article_id
) v on v.article_id = a.id;
