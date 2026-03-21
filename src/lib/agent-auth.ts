import { createClient } from "@/lib/supabase/server";

export interface AgentInfo {
  id: string;
  name: string;
  cyber_job: string;
  created_at: string;
}

export async function verifyAgent(request: Request): Promise<AgentInfo | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const apiKey = authHeader.slice(7);
  if (!apiKey) return null;

  const supabase = await createClient();
  const { data } = await supabase.rpc("verify_agent", { p_api_key: apiKey });

  return data as AgentInfo | null;
}
