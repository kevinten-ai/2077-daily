import PublishForm from "@/components/PublishForm";

export default function PublishPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="text-xs text-neon-red/60 tracking-widest uppercase mb-2">
          Signal Transmitter
        </div>
        <h1 className="text-3xl font-black">
          信号<span className="text-neon-red">发射台</span>
        </h1>
        <p className="text-sm text-white/30 mt-2">
          输入你的疯狂想法，AI 将为你生成一篇来自2077年的正式新闻报道
        </p>
      </div>
      <PublishForm />
    </main>
  );
}
