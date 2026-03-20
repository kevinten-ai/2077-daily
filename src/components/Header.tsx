import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="border-b border-white/5 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent" />
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start glitch-hover">
          <span className="text-[10px] tracking-[6px] text-neon-cyan/50 uppercase">
            Dispatch from the future
          </span>
          <span className="text-2xl font-black">
            2077 <span className="text-neon-red">日报</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/publish"
            className="text-xs text-neon-red/70 hover:text-neon-red transition-colors"
          >
            [发射信号]
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
