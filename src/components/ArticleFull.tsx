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
    template: string;
    title: string;
    subtitle: string | null;
    content: string;
    news_date: string;
    vote_count: number;
    avg_crazy: number;
    avg_real: number;
    profiles: { display_name: string; cyber_job: string } | null;
  };
}

export default function ArticleFull({ article }: Props) {
  const label = TEMPLATE_LABELS[article.template] ?? TEMPLATE_LABELS.headline;

  return (
    <article className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-bold ${label.color}`}>
            [{label.text}]
          </span>
          <span className="text-xs text-white/20">{article.news_date}</span>
        </div>
        <h1 className="text-2xl font-black text-white leading-tight">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="text-sm text-white/40 mt-2">{article.subtitle}</p>
        )}
      </div>

      <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap border-l-2 border-neon-red/20 pl-4">
        {article.content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">
            {article.profiles?.display_name ?? "匿名"}
          </span>
          {article.profiles?.cyber_job && (
            <CyberJobBadge job={article.profiles.cyber_job} />
          )}
        </div>
        {article.vote_count > 0 && (
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>🔥 {article.avg_crazy}</span>
            <span>🎯 {article.avg_real}</span>
            <span>{article.vote_count} 人评估</span>
          </div>
        )}
      </div>
    </article>
  );
}
