import { useEffect, useRef, useState } from 'react';
import { ArrowDown, BookOpen, ChefHat, ChevronDown, ChevronRight } from 'lucide-react';
import type { Chapter } from '../types';
import type { ReaderSettings } from '../types';
import type { BookMetadata } from '../hooks/useChapters';
import SiteHeader from './SiteHeader';

interface HomePageProps {
  chapters: Chapter[];
  bookInfo: BookMetadata | null;
  settings: ReaderSettings;
  onStartReading: (chapterIndex: number) => void;
  onOpenCharacters: () => void;
  onOpenKitchen: () => void;
  onToggleTheme: () => void;
}

function getChapterTitle(label: string) {
  return label.replace(/^(?:chapter|capítulo)\s+\d+\s*[:.\-–—]\s*/i, '').trim();
}

export default function HomePage({ chapters, bookInfo, settings, onStartReading, onOpenCharacters, onOpenKitchen, onToggleTheme }: HomePageProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [clocheOpen, setClocheOpen] = useState(false);
  const clocheRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cloche = clocheRef.current;
    if (!cloche) return;

    const observer = new IntersectionObserver(([entry]) => {
      setClocheOpen(entry?.isIntersecting ?? false);
    }, { threshold: 0.35 });

    observer.observe(cloche);
    return () => observer.disconnect();
  }, []);
  const palette = {
    light: {
      page: 'from-ivory-100 via-ivory-50 to-ivory-100',
      header: 'bg-ivory-50/90 border-ivory-300',
      surface: 'bg-ivory-50 border-ivory-300 hover:border-burgundy-300',
      text: 'text-charcoal-900',
      muted: 'text-charcoal-600',
      brand: 'text-burgundy-700',
      accent: 'text-burgundy-600',
      control: 'border-ivory-300 bg-ivory-100 text-burgundy-700 hover:bg-ivory-200',
    },
    sepia: {
      page: 'from-amber-100 via-amber-50 to-amber-100',
      header: 'bg-amber-50/90 border-amber-300',
      surface: 'bg-amber-50 border-amber-300 hover:border-burgundy-300',
      text: 'text-amber-950',
      muted: 'text-amber-900/70',
      brand: 'text-burgundy-700',
      accent: 'text-burgundy-700',
      control: 'border-amber-300 bg-amber-100 text-burgundy-700 hover:bg-amber-200',
    },
    dark: {
      page: 'from-charcoal-900 via-charcoal-800 to-charcoal-900',
      header: 'bg-charcoal-900/90 border-charcoal-700',
      surface: 'bg-[#332126] border-[#68434a] hover:border-[#805560]',
      text: 'text-ivory-100',
      muted: 'text-ivory-300',
      brand: 'text-ivory-100',
      accent: 'text-gold-200',
      control: 'border-charcoal-600 bg-charcoal-800 text-ivory-200 hover:bg-charcoal-700',
    },
  }[settings.theme];
  const chapterDescription = bookInfo?.description || 'Uma cozinha de alta gastronomia, duas mulheres determinadas e uma história que se constrói entre aromas, escolhas e novos começos.';
  const summaryParagraphs = chapterDescription.split(/\n\s*\n/);

  return (
    <div className={`min-h-dvh bg-gradient-to-br ${palette.page}`}>
      <SiteHeader
        title={bookInfo?.title || 'Mise en Place'}
        theme={settings.theme}
        activePage="home"
        brandLabel="Mise en Place, início"
        onBrandClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
        onGoToChapters={() => {
          const chapterOneIndex = chapters.findIndex((chapter) => /(?:chapter|capítulo)\s+1\b/i.test(chapter.label));
          onStartReading(chapterOneIndex >= 0 ? chapterOneIndex : 0);
        }}
        onOpenCharacters={onOpenCharacters}
        onOpenKitchen={onOpenKitchen}
        onToggleTheme={onToggleTheme}
      />

      <main id="inicio" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
        <section aria-label="Boas-vindas">
          <div className="story-hero relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-[#68231f] p-6 text-ivory-50 shadow-elegant sm:min-h-[410px] sm:p-9 lg:p-11">
            <div ref={clocheRef} className="pointer-events-none absolute bottom-11 right-0 z-10 p-2 text-gold-200/35 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:text-gold-200/45 lg:right-5" aria-hidden="true">
              <svg className="h-auto w-40 sm:w-64 lg:w-80" viewBox="52 35 116 132" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8">
                  <g style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', transform: clocheOpen ? 'translate(-5px, -14px) rotate(-8deg)' : 'translate(0, 0) rotate(0deg)', transition: 'transform 800ms cubic-bezier(0.22, 0.61, 0.36, 1)' }}>
                    <path d="M74 117c1-21 16-37 36-37s35 16 36 37" />
                    <path d="M110 80v-8" />
                    <path d="M105 71c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Z" />
                    <path d="M72 117h76" />
                    <path d="M80 113c2-14 11-25 23-29" opacity="0.55" />
                  </g>
                  <path d="M67 123c10 7 76 7 86 0" />
                  <path d="M73 128c14 7 60 7 74 0" />
                  <path d="M91 136c9 4 29 4 38 0" />
                  <path d="M98 141h24" />
                  <g className={clocheOpen ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 650ms ease-in-out' }}>
                    <path d="M95 108c-5-5 5-7 0-12" strokeDasharray="1.5 2.5" />
                    <path d="M110 105c-5-5 5-7 0-12" strokeDasharray="1.5 2.5" />
                    <path d="M125 108c-5-5 5-7 0-12" strokeDasharray="1.5 2.5" />
                    <path d="M87 124c10-4 36-4 46 0" />
                  </g>
                  <path d="M56 91v9m-4.5-4.5h9" opacity="0.7" />
                  <path d="M164 83v8m-4-4h8" opacity="0.7" />
                  <path d="M156 145v6m-3-3h6" opacity="0.7" />
                </g>
              </svg>
            </div>
            <div className="relative z-20">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ivory-50/25 bg-ivory-50/10 px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-ivory-100 sm:w-auto sm:justify-start sm:text-[0.68rem] sm:tracking-[0.17em]">
                <BookOpen className="h-3.5 w-3.5" /> Romance · culinária · recomeços
              </span>
              <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
                Uma história que se serve <span className="text-gold-200">aos poucos.</span>
              </h1>
              <p className="mt-4 hidden max-w-3xl font-serif leading-relaxed text-ivory-100/90 sm:block" style={{ fontSize: `${settings.fontSize}px`, lineHeight: 1.55 }}>
                Lorena encontra na disciplina do Racine sua armadura; Eduarda, afastada da polícia, busca na gastronomia um recomeço.
              </p>
              <button
                type="button"
                onClick={() => setSummaryExpanded((expanded) => !expanded)}
                aria-expanded={summaryExpanded}
                aria-controls="home-full-summary"
                className="mt-2 inline-flex min-h-8 items-center gap-1 rounded-md text-xs font-semibold text-gold-200 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-200 sm:text-sm"
              >
                {summaryExpanded ? 'Fechar sinopse' : 'Ler sinopse completa'}
                <ChevronDown className={`h-4 w-4 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div id="home-full-summary" hidden={!summaryExpanded} className="mt-3 max-w-4xl space-y-3 border-l-2 border-gold-200/60 pl-4 font-serif text-ivory-100/90" style={{ fontSize: `${Math.min(settings.fontSize, 18)}px`, lineHeight: 1.6 }}>
                {summaryParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <div className="relative z-20 mt-8 flex flex-wrap items-center gap-3">
              <a href="#sumario" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-ivory-50/35 px-5 py-3 text-sm font-semibold text-ivory-50 transition hover:bg-ivory-50/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-200 sm:w-auto">
                Explorar capítulos <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="sumario" className="scroll-mt-24 pt-12 sm:pt-16" aria-labelledby="chapters-title">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${palette.accent}`}>Carte du jour</p>
              <h2 id="chapters-title" className={`mt-2 font-display text-2xl font-semibold sm:text-3xl ${palette.text}`}>Escolha seu próximo capítulo</h2>
            </div>
            <span className={`text-sm font-serif italic ${palette.muted}`}>{chapters.length} partes para saborear</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter, index) => {
              const isExtra = /preface|afterword/i.test(chapter.label);
              return (
                <button
                  key={chapter.id}
                  onClick={() => onStartReading(index)}
                  className={`group flex min-h-[118px] items-center gap-4 rounded-2xl border p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600 sm:p-5 ${palette.surface}`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-base font-semibold ${settings.theme === 'dark' ? 'bg-[#41252b] text-[#e8c986]' : isExtra ? 'bg-gold-100 text-gold-800' : 'bg-burgundy-100 text-burgundy-700'}`}>
                    {isExtra ? <ChefHat className="h-5 w-5" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-display font-semibold ${palette.text}`} style={{ fontSize: `${Math.max(14, settings.fontSize - 2)}px` }}>{getChapterTitle(chapter.label)}</span>
                    <span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${palette.accent}`}>
                      Abrir capítulo <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
