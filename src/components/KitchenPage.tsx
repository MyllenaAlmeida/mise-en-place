import { useState } from 'react';
import { BookOpen, ChefHat } from 'lucide-react';
import type { BookMetadata } from '../hooks/useChapters';
import type { ReaderSettings } from '../types';
import KitchenGame from './KitchenGame';
import VioletaNotebook from './VioletaNotebook';
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
  const [activeTab, setActiveTab] = useState<'notebook' | 'bench'>('bench');
  const dark = theme === 'dark';
  const sepia = theme === 'sepia';
  const pageSurface = dark ? 'bg-[#2b2520]' : sepia ? 'bg-[#f3e5cc]' : 'bg-[#f6eee3]';
  const muted = dark ? 'text-[#c9baa5]' : sepia ? 'text-amber-900/75' : 'text-charcoal-600';
  const tabActive = dark ? 'bg-[#493e33] text-[#e8c986] shadow-soft' : sepia ? 'bg-[#fbf4eb] text-burgundy-800 shadow-soft' : 'bg-[#fffaf3] text-burgundy-800 shadow-soft';
  const tabInactive = dark ? 'text-[#c9baa5] hover:bg-[#493e33]/70 hover:text-[#f0e5d3]' : sepia ? 'text-amber-900/75 hover:bg-amber-100 hover:text-burgundy-800' : 'text-charcoal-600 hover:bg-white/70 hover:text-burgundy-800';

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextTab = activeTab === 'notebook' ? 'bench' : 'notebook';
    setActiveTab(nextTab);
    document.getElementById(`kitchen-tab-${nextTab}`)?.focus();
  };

  return (
    <div className={`min-h-dvh ${pageSurface}`}>
      <SiteHeader title={bookInfo?.title || 'Mise en Place'} theme={theme} activePage="kitchen" brandLabel="Voltar ao início" onBrandClick={onGoHome} onBackHome={onGoHome} backHomeLabel="Voltar à home" onGoToChapters={onGoToChapters} onOpenCharacters={onOpenCharacters} onOpenKitchen={onOpenKitchen} onOpenRecipes={onOpenRecipes} onOpenSettings={onOpenSettings} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-8 xl:px-10">
        <section className="story-hero relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-[#68231f] p-5 text-ivory-50 shadow-elegant sm:p-8 lg:flex lg:min-h-48 lg:items-end lg:justify-between lg:gap-10 lg:p-9" aria-labelledby="kitchen-page-title">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-ivory-50/15" aria-hidden="true" />
          <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-ivory-50/10" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory-100"><ChefHat className="h-3.5 w-3.5" /> Espaço interativo · Racine</span>
            <h1 id="kitchen-page-title" className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">Entre o caderno e a bancada</h1>
            <p className="mt-2 max-w-2xl font-serif text-sm leading-relaxed text-ivory-100/90 sm:text-base">Abra as receitas de família de Violeta, pratique os cortes de Eduarda ou aceite a prova da chef.</p>
          </div>
          <div className="relative mt-5 hidden items-center gap-2 text-ivory-100/85 lg:flex"><span className="h-px w-10 bg-ivory-50/35" aria-hidden="true" /><span className="font-serif text-sm italic">Escolha por onde começar</span></div>
        </section>

        <div className={`mt-5 grid grid-cols-2 gap-1 rounded-2xl p-1 ${dark ? 'bg-[#312a23]' : sepia ? 'bg-[#eddfc9]' : 'bg-[#f1e6d9]'}`} role="tablist" aria-label="Espaços da cozinha" onKeyDown={handleTabKeyDown}>
          <button id="kitchen-tab-bench" type="button" role="tab" aria-selected={activeTab === 'bench'} aria-controls="kitchen-panel-bench" tabIndex={activeTab === 'bench' ? 0 : -1} onClick={() => setActiveTab('bench')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${activeTab === 'bench' ? tabActive : tabInactive}`}>
            <ChefHat className="h-4 w-4 shrink-0" /> Bancada Racine
          </button>
          <button id="kitchen-tab-notebook" type="button" role="tab" aria-selected={activeTab === 'notebook'} aria-controls="kitchen-panel-notebook" tabIndex={activeTab === 'notebook' ? 0 : -1} onClick={() => setActiveTab('notebook')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${activeTab === 'notebook' ? tabActive : tabInactive}`}>
            <BookOpen className="h-4 w-4 shrink-0" /> Caderno da Violeta
          </button>
        </div>

        <section id="kitchen-panel-notebook" className="mt-4" role="tabpanel" aria-labelledby="kitchen-tab-notebook" tabIndex={0} hidden={activeTab !== 'notebook'}>
          <VioletaNotebook theme={theme} />
        </section>
        <section id="kitchen-panel-bench" className="mt-4 min-w-0" role="tabpanel" aria-labelledby="kitchen-tab-bench" tabIndex={0} hidden={activeTab !== 'bench'}>
          <KitchenGame theme={theme} />
          <p className={`mt-3 text-center text-xs leading-relaxed ${muted}`}>Use o mouse ou toque: arraste sobre o ingrediente para cortar.</p>
        </section>
      </main>
      <SiteFooter theme={theme} />
    </div>
  );
}
