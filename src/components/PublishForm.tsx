"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TemplateSelector from "./TemplateSelector";
import type { Template } from "@/lib/types";
import type { GeneratedArticle } from "@/lib/ark";

export default function PublishForm() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [userInput, setUserInput] = useState("");
  const [preview, setPreview] = useState<GeneratedArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!template || !userInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, userInput }),
      });
      if (!res.ok) throw new Error("Generation failed");
      setPreview(await res.json());
    } catch (err) {
      console.error(err);
      alert("信号干扰，生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!preview || !template) return;
    setPublishing(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("请先接入信号站（登录）");
      setPublishing(false);
      return;
    }

    const { data, error } = await supabase
      .from("articles")
      .insert({
        author_id: user.id,
        template,
        user_input: userInput,
        title: preview.title,
        subtitle: preview.subtitle,
        content: preview.content,
        news_date: preview.news_date,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      alert("发布失败");
      setPublishing(false);
      return;
    }

    router.push(`/article/${data.id}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm text-neon-cyan/70 mb-3">
          [STEP 1] 选择信号类型
        </h2>
        <TemplateSelector selected={template} onSelect={setTemplate} />
      </div>

      {template && (
        <div>
          <h2 className="text-sm text-neon-cyan/70 mb-3">
            [STEP 2] 输入你的疯狂想法
          </h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="用一句话描述你想象中2077年会发生的疯狂事件..."
            className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-lg p-4 text-sm text-white placeholder:text-white/20 focus:border-neon-cyan/50 focus:outline-none resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !userInput.trim()}
            className="mt-3 px-6 py-2 bg-neon-red/20 border border-neon-red/40 rounded text-sm text-neon-red hover:bg-neon-red/30 transition-colors disabled:opacity-30"
          >
            {loading ? "信号生成中..." : "生成 2077 报道"}
          </button>
        </div>
      )}

      {preview && (
        <div>
          <h2 className="text-sm text-neon-cyan/70 mb-3">
            [STEP 3] 预览 & 发射
          </h2>
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] space-y-3">
            <div className="text-xs text-white/30">{preview.news_date}</div>
            <h3 className="text-xl font-bold text-white">{preview.title}</h3>
            {preview.subtitle && (
              <p className="text-sm text-white/50">{preview.subtitle}</p>
            )}
            <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {preview.content}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 border border-white/10 rounded text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              重新生成
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2 bg-neon-cyan/20 border border-neon-cyan/40 rounded text-sm text-neon-cyan hover:bg-neon-cyan/30 transition-colors disabled:opacity-30"
            >
              {publishing ? "发射中..." : "发射信号 →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
