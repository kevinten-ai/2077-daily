"use client";

import { useState } from "react";

interface Props {
  articleId: string;
  initialCrazy?: number;
  initialReal?: number;
}

function ScoreSelector({
  label,
  icon,
  color,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] text-white/40">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded text-xs font-bold transition-all ${
              n <= value
                ? `${color} scale-105`
                : "bg-white/5 text-white/30 hover:bg-white/10"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VoteButtons({ articleId, initialCrazy = 0, initialReal = 0 }: Props) {
  const [crazy, setCrazy] = useState(initialCrazy);
  const [real, setReal] = useState(initialReal);
  const [submitted, setSubmitted] = useState(initialCrazy > 0);

  const handleSubmit = async () => {
    if (crazy === 0 || real === 0) return;
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId,
        crazyScore: crazy,
        realScore: real,
      }),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
      <div className="flex justify-center gap-12">
        <ScoreSelector
          label="疯狂指数"
          icon="🔥"
          color="bg-neon-red/30 text-neon-red"
          value={crazy}
          onChange={setCrazy}
        />
        <ScoreSelector
          label="成真概率"
          icon="🎯"
          color="bg-neon-cyan/30 text-neon-cyan"
          value={real}
          onChange={setReal}
        />
      </div>
      <div className="text-center mt-4">
        {submitted ? (
          <span className="text-xs text-white/30">已评估 ✓</span>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={crazy === 0 || real === 0}
            className="px-6 py-2 text-xs border border-white/10 rounded hover:border-neon-cyan/30 transition-colors disabled:opacity-20"
          >
            提交评估
          </button>
        )}
      </div>
    </div>
  );
}
