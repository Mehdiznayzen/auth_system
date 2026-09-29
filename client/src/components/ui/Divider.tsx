interface DividerProps {
  label?: string;
}

export default function Divider({ label = 'OR' }: DividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
