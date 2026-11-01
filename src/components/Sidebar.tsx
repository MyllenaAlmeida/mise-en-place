import type { Chapter } from '../types';
import type { ReaderSettings } from '../types';
import { BookOpen, Check, ChefHat, CookingPot, Home, PanelLeftClose, PanelLeftOpen, UsersRound, X } from 'lucide-react';

export type AppPage = 'home' | 'reader' | 'characters' | 'kitchen' | 'recipes';

interface SidebarProps {
  chapters: Chapter[];
  currentChapter: string;
  readChapterIds: string[];
  activePage: AppPage;
  theme: ReaderSettings['theme'];
  onNavigate: (page: AppPage) => void;
  onChapterSelect: (href: string) => void;
  isOpen: boolean;
  showOnDesktop?: boolean;
  desktopVisible?: boolean;
  onToggleDesktop?: () => void;
  onOpen: () => void;
  onClose: () => void;
}

const destinations = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'reader', label: 'Leitura', icon: BookOpen },
  { id: 'characters', label: 'Personagens', icon: UsersRound },
  { id: 'kitchen', label: 'Espaço interativo', icon: ChefHat },
  { id: 'recipes', label: 'Receitas', icon: CookingPot },
] as const;

export default function Sidebar({ chapters, currentChapter, readChapterIds, activePage, theme, onNavigate, onChapterSelect, isOpen, showOnDesktop = false, desktopVisible = false, onToggleDesktop, onOpen, onClose }: SidebarProps) {
  const renderDestination = (destination: typeof destinations[number]) => {
    const Icon = destination.icon;
    const active = activePage === destination.id;

    return (
      <button
        key={destination.id}
        onClick={() => { onNavigate(destination.id); onClose(); }}
        aria-current={active ? 'page' : undefined}
        aria-label={destination.label}
        title={destination.label}
        className={`group flex min-h-10 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${active ? 'border-burgundy-200 bg-white font-semibold text-burgundy-800 shadow-soft' : 'border-transparent text-charcoal-700 hover:border-ivory-300 hover:bg-white/70'}`}
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-burgundy-700' : 'text-charcoal-500 group-hover:text-burgundy-700'}`} />
        <span className="truncate">{destination.label}</span>
        {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy-600" aria-hidden="true" />}
      </button>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-charcoal-900/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden" onClick={onClose} />}

      {!isOpen && (
        <button onClick={onOpen} className="fixed left-0 top-24 z-30 flex h-12 w-8 items-center justify-center rounded-r-xl border border-l-0 border-ivory-300 bg-ivory-50 text-burgundy-700 shadow-soft sm:hidden" aria-label="Abrir menu de navegação" title="Abrir menu de navegação">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {showOnDesktop && !desktopVisible && !isOpen && (
        <button onClick={onToggleDesktop} className="fixed left-0 top-24 z-30 hidden h-12 w-8 items-center justify-center rounded-r-xl border border-l-0 border-ivory-300 bg-ivory-50 text-burgundy-700 shadow-soft transition-colors hover:bg-ivory-100 sm:flex" aria-label="Reabrir lista de capítulos" title="Reabrir capítulos">
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <aside className={`fixed left-0 top-0 z-50 h-full w-72 transform shadow-elegant transition-transform duration-300 ${theme === 'dark' ? 'bg-[#3a3129]' : theme === 'sepia' ? 'bg-[#f3e5cc]' : 'bg-[#f5ecdf]'} ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${showOnDesktop ? desktopVisible ? 'sm:static sm:z-0 sm:h-full sm:shrink-0 sm:translate-x-0 sm:overflow-hidden sm:shadow-none sm:transition-[width]' : 'sm:hidden' : 'sm:hidden'}`}>
          <div className="flex h-full min-w-72 flex-col">
            <div className="border-b border-ivory-300 bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-wide text-ivory-50">{showOnDesktop ? 'Capítulos' : 'Navegação'}</h2>
                  <p className="mt-1 font-sans text-xs font-light text-ivory-200 sm:text-sm">{showOnDesktop ? 'Navegue pela história' : 'Mise en Place'}</p>
                </div>
                <button onClick={() => { if (showOnDesktop && window.matchMedia('(min-width: 640px)').matches) onToggleDesktop?.(); else onClose(); }} className="rounded-lg p-2 text-ivory-50 transition-colors hover:bg-burgundy-500" aria-label="Fechar menu lateral" title="Fechar menu lateral">
                  <X className="h-5 w-5 sm:hidden" />
                  {showOnDesktop && <PanelLeftClose className="hidden h-5 w-5 sm:block" />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <nav aria-label="Telas do site" className={`mb-5 space-y-1 ${showOnDesktop ? 'sm:hidden' : ''}`}>
                {destinations.map((destination) => renderDestination(destination))}
              </nav>
              <div className={`mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-charcoal-500 ${showOnDesktop ? 'sm:hidden' : ''}`}>Capítulos</div>
              <div className="space-y-1.5">
                {chapters.map((chapter, index) => {
                  const active = activePage === 'reader' && currentChapter === chapter.href;
                  const isRead = readChapterIds.includes(chapter.id);
                  return (
                    <button key={chapter.id} aria-current={active ? 'page' : undefined} onClick={() => { onChapterSelect(chapter.href); onClose(); }} className={`group relative w-full rounded-lg border px-2.5 py-2 text-left transition-colors ${active ? 'border-burgundy-200 bg-white text-burgundy-900 shadow-soft' : 'border-transparent text-charcoal-700 hover:border-ivory-300 hover:bg-white/70'}`}>
                      {active && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-burgundy-600" aria-hidden="true" />}
                      <span className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold tabular-nums ${active ? 'bg-burgundy-50 text-burgundy-700' : 'bg-ivory-200/80 text-charcoal-500 group-hover:bg-burgundy-50 group-hover:text-burgundy-700'}`}>{String(index + 1).padStart(2, '0')}</span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate font-serif text-sm leading-snug ${active ? 'font-semibold' : 'font-medium'}`}>{chapter.label}</span>
                          {active && <span className="mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-wider text-burgundy-500">Lendo agora</span>}
                        </span>
                        {isRead && <Check className={`h-4 w-4 shrink-0 ${theme === 'dark' ? 'text-[#e8c986]' : theme === 'sepia' ? 'text-amber-800' : 'text-burgundy-700'}`} strokeWidth={2.5} aria-label="Capítulo lido" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
      </aside>
    </>
  );
}
