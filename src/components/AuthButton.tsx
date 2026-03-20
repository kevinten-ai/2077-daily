"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="text-xs text-white/40 hover:text-neon-cyan transition-colors"
      >
        [退出信号站]
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="text-xs text-neon-cyan/70 hover:text-neon-cyan transition-colors"
    >
      [接入信号站]
    </button>
  );
}
