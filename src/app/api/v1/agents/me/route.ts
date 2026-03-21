import { NextResponse } from "next/server";
import { verifyAgent } from "@/lib/agent-auth";

export async function GET(request: Request) {
  const agent = await verifyAgent(request);

  if (!agent) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  return NextResponse.json({ agent });
}
