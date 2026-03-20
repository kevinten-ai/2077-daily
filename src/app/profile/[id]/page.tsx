import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import CyberJobBadge from "@/components/CyberJobBadge";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: articles } = await supabase
    .from("articles_with_votes")
    .select("*, profiles(display_name, cyber_job)")
    .eq("author_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-8">
        <div className="text-xs text-neon-cyan/40 tracking-widest uppercase mb-2">
          Reporter Dossier
        </div>
        <h1 className="text-2xl font-black text-white">
          {profile.display_name}
        </h1>
        <div className="mt-2">
          <CyberJobBadge job={profile.cyber_job} />
        </div>
        <div className="text-xs text-white/20 mt-3">
          已发射 {articles?.length ?? 0} 条信号
        </div>
      </div>

      {articles && articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white/20 text-sm">
          该记者尚未发射任何信号
        </div>
      )}
    </main>
  );
}
