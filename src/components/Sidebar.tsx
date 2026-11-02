import type { Chapter } from '../types';
import type { ReaderSettings } from '../types';
import { Check, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

export type AppPage = 'home' | 'reader' | 'characters' | 'kitchen';

function getChapterTitle(label: string) {
  return label.replace(/^(?:chapter|capítulo)\s+\d+\s*[:.\-–—]\s*/i, '').trim();
}

interface SidebarProps {
  chapters: Chapter[];
  currentChapter: string;
  readChapterIds: string[];
  activePage: AppPage;
  theme: ReaderSettings['theme'];
  onChapterSelect: (href: string) => void;
  showOnDesktop: boolean;
  desktopVisible: boolean;
  mobileOpen: boolean;
  onToggleDesktop: () => void;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({ chapters, currentChapter, readChapterIds, activePage, theme, onChapterSelect, showOnDesktop, desktopVisible, mobileOpen, onToggleDesktop, onOpenMobile, onCloseMobile }: SidebarProps) {
  if (!showOnDesktop) return null;

  const chapterItems = chapters.map((chapter, index) => {
    const active = activePage === 'reader' && currentChapter === chapter.href;
    const isRead = readChapterIds.includes(chapter.id);
    const numberStyle = theme === 'dark'
      ? active ? 'bg-[#592227] text-white' : 'bg-[#68434a] text-[#f0e5d3] group-hover:bg-[#592227]'
      : active ? 'bg-burgundy-50 text-burgundy-700' : 'bg-ivory-200/80 text-charcoal-500 group-hover:bg-burgundy-50 group-hover:text-burgundy-700';

    return (
      <button key={chapter.id} aria-current={active ? 'page' : undefined} onClick={() => { onChapterSelect(chapter.href); onCloseMobile(); }} className={`group relative w-full rounded-lg border px-2.5 py-2 text-left transition-colors ${active ? 'border-burgundy-200 bg-white text-burgundy-900 shadow-soft' : 'border-transparent text-charcoal-700 hover:border-ivory-300 hover:bg-white/70'}`}>
        {active && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-burgundy-600" aria-hidden="true" />}
        <span className="flex items-center gap-2.5">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold tabular-nums ${numberStyle}`}>{String(index + 1).padStart(2, '0')}</span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate font-serif text-sm leading-snug ${active ? 'font-semibold' : 'font-medium'}`}>{getChapterTitle(chapter.label)}</span>
            {active && <span className="mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-wider text-burgundy-500">Lendo agora</span>}
          </span>
          {isRead && <Check className={`h-4 w-4 shrink-0 ${theme === 'dark' ? 'text-[#e8c986]' : theme === 'sepia' ? 'text-amber-800' : 'text-burgundy-700'}`} strokeWidth={2.5} aria-label="Capítulo lido" />}
        </span>
      </button>
    );
  });

  const surface = theme === 'dark' ? 'bg-[#332126]' : theme === 'sepia' ? 'bg-[#f3e5cc]' : 'bg-[#f5ecdf]';

  return (
    <>
      <button onClick={onOpenMobile} className="fixed left-0 top-24 z-30 flex h-12 w-8 items-center justify-center rounded-r-xl border border-l-0 border-ivory-300 bg-ivory-50 text-burgundy-700 shadow-soft sm:hidden" aria-label="Abrir lista de capítulos" title="Capítulos" aria-expanded={mobileOpen}>
        <PanelLeftOpen className="h-4 w-4" />
      </button>

      {mobileOpen && <>
        <button onClick={onCloseMobile} className="fixed inset-0 z-40 bg-charcoal-900/60 backdrop-blur-sm sm:hidden" aria-label="Fechar lista de capítulos" />
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col overflow-hidden shadow-elegant sm:hidden ${surface}`} aria-label="Lista de capítulos">
          <div className="flex items-center justify-between border-b border-ivory-300 bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-wide text-ivory-50">Capítulos</h2>
              <p className="mt-1 font-sans text-xs font-light text-ivory-200">Navegue pela história</p>
            </div>
            <button onClick={onCloseMobile} className="rounded-lg p-2 text-ivory-50 transition-colors hover:bg-burgundy-500" aria-label="Fechar lista de capítulos">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-3" aria-label="Capítulos">
            {chapterItems}
          </nav>
        </aside>
      </>}

      {desktopVisible ? (
        <aside className={`hidden h-full w-72 shrink-0 flex-col overflow-hidden shadow-elegant sm:flex ${surface}`}>
          <div className="flex items-center justify-between border-b border-ivory-300 bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 sm:p-5">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-wide text-ivory-50">Capítulos</h2>
              <p className="mt-1 font-sans text-xs font-light text-ivory-200 sm:text-sm">Navegue pela história</p>
            </div>
            <button onClick={onToggleDesktop} className="rounded-lg p-2 text-ivory-50 transition-colors hover:bg-burgundy-500" aria-label="Recolher lista de capítulos" title="Recolher capítulos">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 sm:p-4" aria-label="Capítulos">
            {chapterItems}
          </nav>
        </aside>
      ) : (
        <button onClick={onToggleDesktop} className="fixed left-0 top-24 z-30 hidden h-12 w-8 items-center justify-center rounded-r-xl border border-l-0 border-ivory-300 bg-ivory-50 text-burgundy-700 shadow-soft transition-colors hover:bg-ivory-100 sm:flex" aria-label="Reabrir lista de capítulos" title="Reabrir capítulos">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
