import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateArticle } from "@/lib/glm";
import { getRandomTopics } from "@/lib/cron-topics";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topics = getRandomTopics(3);
  const supabase = await createClient();
  const results: { id: string; title: string }[] = [];
  const errors: string[] = [];

  for (const topic of topics) {
    try {
      const article = await generateArticle(topic.template, topic.input);

      const { data } = await supabase.rpc("create_agent_article", {
        p_api_key: "system_cron_2077daily",
        p_template: topic.template,
        p_user_input: topic.input,
        p_title: article.title,
        p_subtitle: article.subtitle,
        p_content: article.content,
        p_news_date: article.news_date,
      });

      if (data) {
        results.push({ id: data, title: article.title });
      }
    } catch (err) {
      errors.push(`${topic.template}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({
    generated: results.length,
    articles: results,
    errors: errors.length > 0 ? errors : undefined,
  });
}
