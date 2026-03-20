import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles_with_votes")
    .select("*, profiles(display_name, cyber_job)")
    .eq("id", id)
    .single();

  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a0a0a, #1a0a2e)",
          padding: "48px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #ff0050, #00f0ff, transparent)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff" }}>
            2077 日报
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            DISPATCH FROM THE FUTURE
          </span>
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.3,
            marginBottom: "16px",
            maxWidth: "90%",
          }}
        >
          {article.title}
        </div>
        <div
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.6,
            maxWidth: "85%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {article.subtitle ?? article.content.slice(0, 100) + "..."}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,0,80,0.2)",
          }}
        >
          <span style={{ fontSize: "14px", color: "rgba(0,240,255,0.5)" }}>
            {article.profiles?.display_name ?? "匿名"} ·{" "}
            {article.profiles?.cyber_job ?? "时空流浪者"}
          </span>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {article.vote_count > 0 && (
              <span>🔥 {article.avg_crazy} 🎯 {article.avg_real}</span>
            )}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "48px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          SIGNAL DETECTED · YEAR 2077
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
