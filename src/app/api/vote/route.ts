import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { articleId, crazyScore, realScore } = await request.json();

  if (!articleId || !crazyScore || !realScore) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("votes")
    .upsert(
      {
        article_id: articleId,
        user_id: user.id,
        crazy_score: crazyScore,
        real_score: realScore,
      },
      { onConflict: "article_id,user_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
