import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description } = body;

  if (!name || typeof name !== "string" || name.length < 2) {
    return NextResponse.json(
      { error: "name is required (min 2 characters)" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("register_agent", {
    p_name: name.slice(0, 50),
    p_description: (description ?? "").slice(0, 200),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Agent registered successfully. Save your api_key - it cannot be retrieved later.",
    agent: data,
  });
}
