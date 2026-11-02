import { ArrowLeft, BookOpen, ChefHat, Moon, Sun, UtensilsCrossed, UsersRound } from 'lucide-react';
import type { ReaderSettings } from '../types';

interface SiteHeaderProps {
  title: string;
  theme: ReaderSettings['theme'];
  activePage?: 'home' | 'reader' | 'characters' | 'kitchen';
  brandLabel: string;
  onBackHome?: () => void;
  backHomeLabel?: string;
  onBrandClick: () => void;
  onGoToChapters?: () => void;
  onOpenCharacters?: () => void;
  onOpenKitchen?: () => void;
  onToggleTheme?: () => void;
}

export default function SiteHeader({ title, theme, activePage, brandLabel, onBrandClick, onGoToChapters, onOpenCharacters, onBackHome, backHomeLabel, onOpenKitchen, onToggleTheme }: SiteHeaderProps) {
  const palette = {
    light: {
      header: 'bg-ivory-50/90 border-ivory-300',
      brand: 'text-burgundy-700',
      muted: 'text-charcoal-600',
      control: 'text-charcoal-700 hover:bg-ivory-200 hover:text-burgundy-800',
      active: 'bg-burgundy-50 text-burgundy-800',
    },
    sepia: {
      header: 'bg-ivory-50/90 border-ivory-300',
      brand: 'text-burgundy-700',
      muted: 'text-charcoal-600',
      control: 'text-charcoal-700 hover:bg-ivory-200 hover:text-burgundy-800',
      active: 'bg-burgundy-50 text-burgundy-800',
    },
    dark: {
      header: 'bg-charcoal-900/90 border-charcoal-700',
      brand: 'text-ivory-100',
      muted: 'text-ivory-300',
      control: 'text-ivory-200 hover:bg-charcoal-700 hover:text-white',
      active: 'bg-[#592227] text-[#f0e5d3]',
    },
  }[theme];

  return (
    <header className={`sticky top-0 z-30 border-b ${palette.header} shadow-soft backdrop-blur-md`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
        <button onClick={onBrandClick} className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-xl py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600" aria-label={brandLabel} title="Voltar para a página inicial">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy-700 text-ivory-50 shadow-soft transition-transform group-hover:scale-105 group-active:scale-95"><UtensilsCrossed className="h-5 w-5" /></span>
          <span className={`hidden min-w-0 truncate font-display text-base font-semibold leading-tight decoration-1 underline-offset-4 group-hover:underline sm:block sm:text-xl ${palette.brand}`}>{title}</span>
        </button>
        <nav aria-label="Navegação principal" className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {onBackHome && (
            <button onClick={onBackHome} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${palette.control}`} aria-label={backHomeLabel || 'Voltar à home'} title={backHomeLabel || 'Voltar à home'}>
              <ArrowLeft className="h-[18px] w-[18px]" />
            </button>
          )}
          {onGoToChapters && (
            <button onClick={onGoToChapters} aria-current={activePage === 'reader' ? 'page' : undefined} className={`flex h-9 w-9 items-center justify-center gap-2 rounded-lg px-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 sm:w-auto ${activePage === 'reader' ? palette.active : palette.control}`} aria-label="Ir para os capítulos" title="Capítulos">
              <BookOpen className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden text-sm font-medium md:inline">Capítulos</span>
            </button>
          )}
          {onOpenCharacters && (
            <button onClick={onOpenCharacters} aria-current={activePage === 'characters' ? 'page' : undefined} className={`flex h-9 w-9 items-center justify-center gap-2 rounded-lg px-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 sm:w-auto ${activePage === 'characters' ? palette.active : palette.control}`} aria-label="Conhecer personagens" title="Personagens">
              <UsersRound className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden text-sm font-medium md:inline">Personagens</span>
            </button>
          )}
          {onOpenKitchen && <button onClick={onOpenKitchen} aria-current={activePage === 'kitchen' ? 'page' : undefined} className={`flex h-9 w-9 items-center justify-center gap-2 rounded-lg px-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 sm:w-auto ${activePage === 'kitchen' ? palette.active : palette.control}`} aria-label="Abrir Espaço interativo Racine" title="Espaço interativo Racine">
            <ChefHat className="h-4 w-4 shrink-0" />
            <span className="hidden text-sm font-medium md:inline">Espaço interativo</span>
          </button>}
          {onToggleTheme && <button onClick={onToggleTheme} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-burgundy-600 ${palette.control}`} role="switch" aria-checked={theme === 'dark'} aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo noturno'} title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo noturno'}>
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>}
        </nav>
      </div>
    </header>
  );
}
