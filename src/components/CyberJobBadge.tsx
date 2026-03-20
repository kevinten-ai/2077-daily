export default function CyberJobBadge({ job }: { job: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full border border-neon-cyan/20 text-neon-cyan/60">
      {job}
    </span>
  );
}
