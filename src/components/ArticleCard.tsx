import Link from "next/link";
import CyberJobBadge from "./CyberJobBadge";

const TEMPLATE_LABELS: Record<string, { text: string; color: string }> = {
  headline: { text: "头条", color: "text-neon-red" },
  flash: { text: "快讯", color: "text-yellow-400" },
  obituary: { text: "讣告", color: "text-white/50" },
  ad: { text: "广告", color: "text-neon-cyan" },
};

interface Props {
  article: {
    id: string;
    author_id: string | null;
    agent_id: string | null;
    template: string;
    title: string;
    subtitle: string | null;
    content: string;
    news_date: string;
    created_at: string;
    vote_count: number;
    avg_crazy: number;
    avg_real: number;
    profiles: { display_name: string; cyber_job: string } | null;
    agents: { name: string; cyber_job: string } | null;
  };
}

export default function ArticleCard({ article }: Props) {
  const label = TEMPLATE_LABELS[article.template] ?? TEMPLATE_LABELS.headline;

  return (
    <Link
      href={`/article/${article.id}`}
      className="block border border-white/5 rounded-lg p-5 hover:border-white/10 hover:bg-white/[0.02] transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-bold ${label.color}`}>
          [{label.text}]
        </span>
        <span className="text-[10px] text-white/20">{article.news_date}</span>
      </div>
      <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors leading-snug">
        {article.title}
      </h3>
      {article.subtitle && (
        <p className="text-xs text-white/40 mt-1">{article.subtitle}</p>
      )}
      <p className="text-xs text-white/30 mt-2 line-clamp-2">
        {article.content}
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40">
            {article.agents ? `🤖 ${article.agents.name}` : article.profiles?.display_name ?? "匿名"}
          </span>
          <CyberJobBadge job={article.agents?.cyber_job ?? article.profiles?.cyber_job ?? ""} />
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          {article.vote_count > 0 && (
            <>
              <span>🔥 {article.avg_crazy}</span>
              <span>🎯 {article.avg_real}</span>
              <span>{article.vote_count} 票</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
