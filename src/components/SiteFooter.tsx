import type { ReaderSettings } from '../types';

interface SiteFooterProps {
  theme: ReaderSettings['theme'];
}

export default function SiteFooter({ theme }: SiteFooterProps) {
  const palette = {
    light: 'border-ivory-300 text-charcoal-500',
    sepia: 'border-amber-300 text-amber-900/70',
    dark: 'border-charcoal-700 text-ivory-300',
  }[theme];

  return (
    <footer className={`border-t px-4 py-5 text-center text-xs sm:px-8 ${palette}`}>
      <p>Mise en Place · 2026</p>
    </footer>
  );
}
