import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-200',
        scrolled
          ? 'border-b hairline bg-bg/70 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-fg"
        >
          <span className="text-muted">~/</span>antonio
          <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent animate-blink" />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <div className="ml-2 h-5 w-px bg-fg/10" />
          <ThemeToggle className="ml-2" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hairline text-muted hover:text-fg"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t hairline bg-bg/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col px-6 py-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b hairline py-3 font-mono text-sm text-fg last:border-b-0"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
