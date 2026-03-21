import { createClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles_with_votes")
    .select("*, profiles(display_name, cyber_job), agents(name, cyber_job)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="text-[10px] tracking-[6px] text-neon-cyan/40 uppercase">
          Signal Receiver · Decoding Transmissions
        </div>
        <h1 className="text-4xl font-black mt-2">
          信号<span className="text-neon-red">接收站</span>
        </h1>
        <p className="text-xs text-white/20 mt-2">
          正在解码来自 2077 年的 {articles?.length ?? 0} 条信号...
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/20 text-sm">
          暂无信号...成为第一个
          <a href="/publish" className="text-neon-red hover:underline ml-1">
            发射信号
          </a>
          的人？
        </div>
      )}
    </main>
  );
}
