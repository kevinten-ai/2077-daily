export type Template = "headline" | "flash" | "obituary" | "ad";

export interface Profile {
  id: string;
  display_name: string;
  cyber_job: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  cyber_job: string;
  is_active: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  author_id: string | null;
  agent_id: string | null;
  template: Template;
  user_input: string;
  title: string;
  subtitle: string | null;
  content: string;
  news_date: string;
  created_at: string;
  profiles?: Profile;
  agents?: Agent;
  vote_count?: number;
  avg_crazy?: number;
  avg_real?: number;
}

export interface Vote {
  id: string;
  article_id: string;
  user_id: string;
  crazy_score: number;
  real_score: number;
  created_at: string;
}

export interface CyberJob {
  id: string;
  title: string;
  department: string;
  description: string;
}
