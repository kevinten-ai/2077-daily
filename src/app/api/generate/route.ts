import { NextResponse } from "next/server";
import { generateArticle } from "@/lib/ark";

export async function POST(request: Request) {
  const body = await request.json();
  const { template, userInput } = body;

  if (!template || !userInput) {
    return NextResponse.json(
      { error: "template and userInput are required" },
      { status: 400 }
    );
  }

  if (!["headline", "flash", "obituary", "ad"].includes(template)) {
    return NextResponse.json(
      { error: "Invalid template type" },
      { status: 400 }
    );
  }

  try {
    const article = await generateArticle(template, userInput);
    return NextResponse.json(article);
  } catch (error) {
    console.error("Ark generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate article" },
      { status: 500 }
    );
  }
}
