"use client";

export default function ShareButton({
  articleId,
  title,
}: {
  articleId: string;
  title: string;
}) {
  const posterUrl = `/api/og/${articleId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/article/${articleId}`);
    alert("链接已复制");
  };

  const handleDownloadPoster = async () => {
    const res = await fetch(posterUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `2077-daily-${articleId}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyLink}
        className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
      >
        复制链接
      </button>
      <button
        onClick={handleDownloadPoster}
        className="flex-1 px-4 py-3 border border-neon-red/30 rounded-lg text-xs text-neon-red/70 hover:text-neon-red hover:border-neon-red/50 transition-colors"
      >
        下载海报
      </button>
    </div>
  );
}
