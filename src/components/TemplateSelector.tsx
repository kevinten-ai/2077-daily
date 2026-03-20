"use client";

import type { Template } from "@/lib/types";

const TEMPLATES: { id: Template; icon: string; name: string; hint: string }[] = [
  { id: "headline", icon: "📰", name: "头条新闻", hint: "输入：核心事件 + 时间 + 地点" },
  { id: "flash", icon: "⚡", name: "突发快讯", hint: "输入：发生了什么（一句话）" },
  { id: "obituary", icon: "🪦", name: "讣告", hint: '输入：什么东西"死了"' },
  { id: "ad", icon: "📢", name: "2077广告", hint: "输入：产品名称 + 一句话描述" },
];

export default function TemplateSelector({
  selected,
  onSelect,
}: {
  selected: Template | null;
  onSelect: (t: Template) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`p-4 rounded-lg border text-left transition-all ${
            selected === t.id
              ? "border-neon-cyan bg-neon-cyan/10"
              : "border-white/10 hover:border-white/20 bg-white/[0.02]"
          }`}
        >
          <div className="text-2xl mb-2">{t.icon}</div>
          <div className="text-sm font-bold">{t.name}</div>
          <div className="text-xs text-white/40 mt-1">{t.hint}</div>
        </button>
      ))}
    </div>
  );
}
