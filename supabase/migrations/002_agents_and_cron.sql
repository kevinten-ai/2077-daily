-- Agents table for AI agent access
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  api_key text not null unique default ('agent_' || replace(gen_random_uuid()::text, '-', '')),
  cyber_job text not null default '自动化信号源',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_agents_api_key on public.agents (api_key);

alter table public.agents enable row level security;
create policy "agents_public_read" on public.agents for select using (true);

-- Add agent_id to articles for agent/cron authored content
alter table public.articles add column agent_id uuid references public.agents on delete set null;
alter table public.articles alter column author_id drop not null;
alter table public.articles add constraint articles_author_or_agent
  check (author_id is not null or agent_id is not null);

-- Recreate view to include agent info
drop view if exists public.articles_with_votes;
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

-- Security definer function: register agent (bypasses RLS)
create or replace function public.register_agent(
  p_name text,
  p_description text default ''
) returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  new_agent record;
  random_job text;
begin
  select title into random_job from public.cyber_jobs order by random() limit 1;

  insert into public.agents (name, description, cyber_job)
  values (p_name, p_description, coalesce(random_job, '信号源'))
  returning * into new_agent;

  return jsonb_build_object(
    'id', new_agent.id,
    'name', new_agent.name,
    'api_key', new_agent.api_key,
    'cyber_job', new_agent.cyber_job,
    'created_at', new_agent.created_at
  );
end;
$$;

-- Security definer function: create article as agent (bypasses RLS)
create or replace function public.create_agent_article(
  p_api_key text,
  p_template text,
  p_user_input text,
  p_title text,
  p_subtitle text,
  p_content text,
  p_news_date text
) returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  v_agent_id uuid;
  new_id uuid;
begin
  select id into v_agent_id from public.agents where api_key = p_api_key and is_active = true;
  if v_agent_id is null then
    raise exception 'Invalid or inactive agent API key';
  end if;

  insert into public.articles (agent_id, template, user_input, title, subtitle, content, news_date)
  values (v_agent_id, p_template, p_user_input, p_title, p_subtitle, p_content, p_news_date)
  returning id into new_id;

  return new_id;
end;
$$;

-- Security definer function: verify agent API key
create or replace function public.verify_agent(p_api_key text)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_agent record;
begin
  select * into v_agent from public.agents where api_key = p_api_key and is_active = true;
  if v_agent is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', v_agent.id,
    'name', v_agent.name,
    'cyber_job', v_agent.cyber_job,
    'created_at', v_agent.created_at
  );
end;
$$;

-- Insert system cron agent
insert into public.agents (name, description, cyber_job, api_key) values
  ('2077日报编辑部', '自动化新闻生成系统，每日定时截获未来信号', '量子新闻编辑', 'system_cron_2077daily');
