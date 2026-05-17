import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const v = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setPct(Math.max(0, Math.min(100, v)));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-14 z-40 h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
