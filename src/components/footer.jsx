export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 font-mono text-xs text-muted sm:flex-row sm:items-center">
        <div>
          © {year} Antonio Balanzategui · Built with Next.js + Tailwind
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>system online</span>
        </div>
      </div>
    </footer>
  );
}
