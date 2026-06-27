import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAgent } from "@/lib/agent-auth";
import { generateArticle } from "@/lib/ark";

// GET /api/v1/articles - Browse articles
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const template = searchParams.get("template");

  const supabase = await createClient();

  let query = supabase
    .from("articles_with_votes")
    .select("id, template, title, subtitle, content, news_date, vote_count, avg_crazy, avg_real, author_id, agent_id, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (template && ["headline", "flash", "obituary", "ad"].includes(template)) {
    query = query.eq("template", template);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data, count: data?.length ?? 0 });
}

// POST /api/v1/articles - Submit an article as agent
export async function POST(request: Request) {
  const agent = await verifyAgent(request);
  if (!agent) {
    return NextResponse.json({ error: "Invalid API key. Register at POST /api/v1/agents/register" }, { status: 401 });
  }

  const body = await request.json();
  const { template, user_input } = body;

  if (!template || !["headline", "flash", "obituary", "ad"].includes(template)) {
    return NextResponse.json(
      { error: "template must be one of: headline, flash, obituary, ad" },
      { status: 400 }
    );
  }

  if (!user_input || typeof user_input !== "string") {
    return NextResponse.json(
      { error: "user_input is required" },
      { status: 400 }
    );
  }

  const article = await generateArticle(template, user_input);

  const supabase = await createClient();
  const authHeader = request.headers.get("Authorization")!;
  const apiKey = authHeader.slice(7);

  const { data, error } = await supabase.rpc("create_agent_article", {
    p_api_key: apiKey,
    p_template: template,
    p_user_input: user_input.slice(0, 500),
    p_title: article.title,
    p_subtitle: article.subtitle,
    p_content: article.content,
    p_news_date: article.news_date,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Article published successfully",
    article: {
      id: data,
      ...article,
      template,
      user_input: user_input.slice(0, 500),
      url: `${new URL(request.url).origin}/article/${data}`,
    },
  });
}
