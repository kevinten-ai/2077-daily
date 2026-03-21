import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ArticleFull from "@/components/ArticleFull";
import VoteButtons from "@/components/VoteButtons";
import ShareButton from "@/components/ShareButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, subtitle")
    .eq("id", id)
    .single();

  return {
    title: article?.title ?? "2077日报",
    description: article?.subtitle ?? "来自2077年的疯狂新闻",
    openGraph: {
      images: [`/api/og/${id}`],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles_with_votes")
    .select("*, profiles(display_name, cyber_job), agents(name, cyber_job)")
    .eq("id", id)
    .single();

  if (!article) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let existingVote = null;
  if (user) {
    const { data } = await supabase
      .from("votes")
      .select("crazy_score, real_score")
      .eq("article_id", id)
      .eq("user_id", user.id)
      .single();
    existingVote = data;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <ArticleFull article={article} />

      <div className="mt-8 space-y-4">
        <VoteButtons
          articleId={id}
          initialCrazy={existingVote?.crazy_score ?? 0}
          initialReal={existingVote?.real_score ?? 0}
        />
        <ShareButton articleId={id} title={article.title} />
      </div>
    </main>
  );
}
