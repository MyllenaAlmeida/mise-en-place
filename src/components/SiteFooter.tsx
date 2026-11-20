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
    <footer className={`border-t px-4 py-6 text-center ${palette}`}>
      <p className="text-xs">Leia também em</p>
      <nav aria-label="Outras plataformas para ler Mise en Place" className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <a href="https://archiveofourown.org/works/92977366/chapters/248014561" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-sm font-semibold transition hover:bg-current/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current" aria-label="Ler Mise en Place no Archive of Our Own, abre em nova aba">
          <svg viewBox="0 0 40 24" className="h-5 w-8" role="img" aria-label="AO3"><rect x=".5" y=".5" width="39" height="23" rx="5" fill="#990000"/><text x="20" y="17" textAnchor="middle" fill="white" fontFamily="Georgia,serif" fontSize="15" fontWeight="700">AO3</text></svg>
          Archive of Our Own
        </a>
        <a href="https://www.wattpad.com/story/420016999-mise-en-place?utm_source=ios&amp;utm_medium=whatsapp&amp;utm_content=share_writing&amp;wp_page=create&amp;wp_uname=littleslightlymad2" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-sm font-semibold transition hover:bg-current/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current" aria-label="Ler Mise en Place no Wattpad, abre em nova aba">
          <svg viewBox="0 0 24 24" className="h-5 w-5" role="img" aria-label="Wattpad"><path fill="#ff500a" d="M4.1 2.2c.7 0 1.2.4 1.5 1.1l2.1 5.1 2.2-3.9c.3-.6.8-.9 1.4-.9.7 0 1.1.4 1.4 1l2 4.1 2.1-5.2c.3-.7.8-1.1 1.5-1.1 1.1 0 1.8 1 1.3 2.1l-4 9.3c-.3.7-.8 1-1.5 1-.7 0-1.2-.4-1.5-1.1l-2-4.2-2.2 4.2c-.3.7-.8 1-1.5 1s-1.2-.4-1.5-1.1L2.8 4.3c-.5-1.1.2-2.1 1.3-2.1ZM6.2 16.8c.6 0 1 .3 1.3.9l1.1 2.1 1.1-2.1c.3-.5.7-.9 1.3-.9s1 .3 1.3.9l1.1 2.1 1.1-2.1c.3-.5.7-.9 1.3-.9 1 0 1.5.9 1 1.8l-2.2 4.1c-.3.6-.7.9-1.3.9s-1-.3-1.3-.9l-1.1-2-1.1 2c-.3.6-.7.9-1.3.9s-1-.3-1.3-.9l-2.2-4.1c-.5-.9 0-1.8 1-1.8Z"/></svg>
          Wattpad
        </a>
      </nav>
      <p className="mt-4 text-[0.7rem] opacity-70">Mise en Place · 2026</p>
    </footer>
  );
}
