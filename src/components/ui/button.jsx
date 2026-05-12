import { cn } from '@/lib/utils';

const variants = {
  default:
    'bg-fg text-bg hover:bg-fg/90',
  outline:
    'border hairline bg-transparent text-fg hover:bg-surface',
  ghost:
    'bg-transparent text-muted hover:text-fg hover:bg-surface',
  accent:
    'bg-accent text-bg hover:bg-accent/90',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
};

export function Button({
  variant = 'default',
  size = 'md',
  className,
  href,
  ...props
}) {
  const Comp = href ? 'a' : 'button';
  return (
    <Comp
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/40 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
