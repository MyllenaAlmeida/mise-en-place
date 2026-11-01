import { ChefHat } from 'lucide-react';
import type { BookMetadata } from '../hooks/useChapters';
import type { ReaderSettings } from '../types';
import KitchenGame from './KitchenGame';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

interface KitchenPageProps {
  bookInfo: BookMetadata | null;
  theme: ReaderSettings['theme'];
  onGoHome: () => void;
  onGoToChapters: () => void;
  onOpenCharacters: () => void;
  onOpenKitchen: () => void;
  onOpenRecipes: () => void;
  onOpenSettings: () => void;
}

export default function KitchenPage({ bookInfo, theme, onGoHome, onGoToChapters, onOpenCharacters, onOpenKitchen, onOpenRecipes, onOpenSettings }: KitchenPageProps) {
  const dark = theme === 'dark';
  const sepia = theme === 'sepia';
  const pageSurface = dark ? 'bg-[#2b2520]' : sepia ? 'bg-[#f3e5cc]' : 'bg-[#f6eee3]';
  const muted = dark ? 'text-[#c9baa5]' : sepia ? 'text-amber-900/75' : 'text-charcoal-600';

  return (
    <div className={`min-h-screen ${pageSurface}`}>
      <SiteHeader title={bookInfo?.title || 'Mise en Place'} theme={theme} activePage="kitchen" brandLabel="Voltar ao início" onBrandClick={onGoHome} onBackHome={onGoHome} backHomeLabel="Voltar à home" onGoToChapters={onGoToChapters} onOpenCharacters={onOpenCharacters} onOpenKitchen={onOpenKitchen} onOpenRecipes={onOpenRecipes} onOpenSettings={onOpenSettings} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-8 xl:px-10">
        <section className="story-hero relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-[#68231f] p-5 text-ivory-50 shadow-elegant sm:p-8 lg:flex lg:min-h-48 lg:items-end lg:justify-between lg:gap-10 lg:p-9" aria-labelledby="kitchen-page-title">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-ivory-50/15" aria-hidden="true" />
          <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-ivory-50/10" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory-100"><ChefHat className="h-3.5 w-3.5" /> Espaço interativo · Racine</span>
            <h1 id="kitchen-page-title" className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">Hora do teste de bancada</h1>
            <p className="mt-2 max-w-2xl font-serif text-sm leading-relaxed text-ivory-100/90 sm:text-base">Pratique os cortes de Eduarda ou responda à prova da chef na cozinha do Racine.</p>
          </div>
          <div className="relative mt-5 hidden items-center gap-2 text-ivory-100/85 lg:flex"><span className="h-px w-10 bg-ivory-50/35" aria-hidden="true" /><span className="font-serif text-sm italic">Escolha por onde começar</span></div>
        </section>

        <div className="mt-5 min-w-0"><KitchenGame theme={theme} /><p className={`mt-3 text-center text-xs leading-relaxed ${muted}`}>Use o mouse ou toque: arraste a faca sobre o ingrediente para cortar.</p></div>
      </main>
      <SiteFooter theme={theme} />
    </div>
  );
}
