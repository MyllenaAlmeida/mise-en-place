import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ReaderSettings } from '../types';

interface ChapterViewerProps {
  chapterUrl: string;
  showNavigation: boolean;
  sidebarVisible: boolean;
  chapterIndex: number;
  chapterCount: number;
  previousChapterTitle?: string;
  nextChapterTitle?: string;
  settings: ReaderSettings;
  onChapterRead: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ChapterViewer({ 
  chapterUrl, 
  showNavigation,
  sidebarVisible,
  chapterIndex,
  chapterCount,
  previousChapterTitle,
  nextChapterTitle,
  settings, 
  onChapterRead,
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev 
}: ChapterViewerProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [floatingNavigationOpen, setFloatingNavigationOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onChapterReadRef = useRef(onChapterRead);
  onChapterReadRef.current = onChapterRead;
  const readingMinutes = useMemo(() => {
    if (!content) return 1;
    const chapterDocument = new DOMParser().parseFromString(content, 'text/html');
    chapterDocument.querySelectorAll('script, style, template').forEach((element) => element.remove());
    const wordCount = chapterDocument.body.textContent?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [content]);

  useEffect(() => {
    async function loadChapter() {
      setIsLoading(true);
      try {
        const response = await fetch(chapterUrl);
        const html = await response.text();
        setContent(html);
      } catch (error) {
        console.error('Error loading chapter:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadChapter();
  }, [chapterUrl]);

  useEffect(() => {
    let cleanupReadTracking: (() => void) | undefined;
    if (iframeRef.current && content) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(content);
        doc.close();

        doc.querySelectorAll<HTMLParagraphElement>('p').forEach((heading) => {
          if (heading.textContent?.trim().toLowerCase() !== 'chapter summary') return;
          const summaryText = heading.nextElementSibling;
          if (!summaryText?.matches('blockquote.userstuff')) return;

          const summarySection = doc.createElement('section');
          summarySection.className = 'chapter-summary-section';
          summarySection.setAttribute('aria-label', 'Resumo do capítulo');
          heading.before(summarySection);
          summarySection.append(heading, summaryText);
          heading.textContent = 'Resumo do capítulo';
        });

        doc.querySelectorAll<HTMLParagraphElement>('p').forEach((heading) => {
          if (heading.textContent?.trim().toLowerCase() !== 'chapter notes') return;
          const authorNotes = heading.nextElementSibling;
          heading.remove();
          if (authorNotes?.matches('blockquote.userstuff')) authorNotes.remove();
        });
        doc.querySelectorAll('.endnote-link').forEach((endnoteLink) => endnoteLink.remove());

        doc.querySelectorAll<HTMLElement>('[id^="endnotes"]').forEach((notesSection) => {
          const heading = notesSection.querySelector('p');
          if (heading?.textContent?.trim().toLowerCase() === 'chapter end notes') {
            heading.textContent = 'Notas finais do capítulo';
          }
        });

        // Apply custom styles
        const style = doc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
          
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Cormorant Garamond', Georgia, serif !important;
            font-size: ${settings.fontSize}px !important;
            font-weight: 500 !important;
            line-height: 1.8 !important;
            max-width: ${sidebarVisible ? 750 : 960}px !important;
            margin: 0 auto !important;
            padding: 40px 20px !important;
            color: ${settings.theme === 'dark' ? '#f0e5d3' : '#45372a'} !important;
            background: transparent !important;
          }

          @media (min-width: 640px) {
            body {
              padding: 60px 40px !important;
            }
          }
          
          h1, h2, h3 {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-weight: 600 !important;
          }

          /* The exported chapters repeat the title inside the reading content. */
          .chapter-title + #chapters .heading {
            display: none !important;
          }
          
          p {
            margin-bottom: 1.5em !important;
            text-align: justify !important;
            text-indent: 2em !important;
            font-weight: 500 !important;
            line-height: 1.8 !important;
          }
          
          p:first-of-type {
            text-indent: 0 !important;
          }
          
          .chapter-title {
            text-align: center !important;
            font-size: 2.5em !important;
            margin-bottom: 2.5em !important;
            padding-bottom: 1.5em !important;
            border-bottom: 3px solid ${settings.theme === 'dark' ? '#80683d' : '#de4f4f'} !important;
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-weight: 600 !important;
          }
          
          .calibre7, .userstuff1, .userstuff2, .calibre1 {
            font-family: 'Cormorant Garamond', Georgia, serif !important;
          }
          
          .heading {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-size: 2em !important;
            text-align: center !important;
            margin: 2em 0 !important;
          }

          .chapter-summary-section,
          [id^="endnotes"] {
            margin: 4em 0 2em !important;
            padding: 1.5em !important;
            border: 1px solid ${settings.theme === 'dark' ? '#6b5638' : settings.theme === 'sepia' ? '#d3b98d' : '#d9c4a7'} !important;
            border-top: 3px solid ${settings.theme === 'dark' ? '#b58b4a' : '#c6a62e'} !important;
            border-radius: 14px !important;
          }

          .chapter-summary-section {
            background: transparent !important;
          }

          [id^="endnotes"] {
            background: ${settings.theme === 'dark' ? '#3a3129' : settings.theme === 'sepia' ? '#f3eadb' : '#fbf8f2'} !important;
          }

          .chapter-summary-section > p:first-child,
          [id^="endnotes"] > p:first-child {
            margin: 0 0 1em !important;
            padding: 0 0 0.65em !important;
            border-bottom: 1px solid ${settings.theme === 'dark' ? '#6b5638' : settings.theme === 'sepia' ? '#d3b98d' : '#d9c4a7'} !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: 1.4em !important;
            font-weight: 600 !important;
            text-align: left !important;
            text-indent: 0 !important;
          }

          .chapter-summary-section blockquote.userstuff,
          [id^="endnotes"] blockquote.userstuff {
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            background: transparent !important;
          }

          .chapter-summary-section blockquote p,
          [id^="endnotes"] blockquote p {
            margin-bottom: 0.8em !important;
            text-align: left !important;
            text-indent: 0 !important;
          }
        `;
        doc.head.appendChild(style);

        const readingWindow = doc.defaultView;
        if (readingWindow) {
          let markedAsRead = false;
          let checkFrame = 0;
          const markWhenAtEnd = () => {
            if (markedAsRead) return;
            const scrollRoot = doc.scrollingElement || doc.documentElement;
            if (readingWindow.scrollY + readingWindow.innerHeight >= scrollRoot.scrollHeight - 96) {
              markedAsRead = true;
              onChapterReadRef.current();
            }
          };
          readingWindow.addEventListener('scroll', markWhenAtEnd, { passive: true });
          checkFrame = readingWindow.requestAnimationFrame(markWhenAtEnd);
          cleanupReadTracking = () => {
            readingWindow.removeEventListener('scroll', markWhenAtEnd);
            readingWindow.cancelAnimationFrame(checkFrame);
          };
        }

      }
    }
    return () => cleanupReadTracking?.();
  }, [content, settings]);

  useEffect(() => {
    setFloatingNavigationOpen(false);
  }, [chapterUrl, showNavigation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      if (hasNext) onNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hasPrev) onPrev();
    }
  };

  return (
    <div className={`flex h-full flex-col ${settings.theme === 'dark' ? 'bg-[#352c25]' : settings.theme === 'sepia' ? 'bg-amber-100' : 'bg-ivory-50'}`} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Chapter Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className={`sticky top-0 z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b px-3 py-2 text-center text-[0.68rem] font-medium shadow-sm backdrop-blur sm:text-xs ${settings.theme === 'dark' ? 'border-[#5b4e40] bg-[#302821]/95 text-[#d8c9b4]' : settings.theme === 'sepia' ? 'border-amber-300 bg-amber-50/95 text-amber-900/80' : 'border-ivory-300 bg-ivory-50/95 text-charcoal-600'}`} role="status" aria-label={`Leitura estimada: ${readingMinutes} minutos; tempo de cocção estimado: ${readingMinutes} minutos`}>
          <span aria-hidden="true">⏳</span>
          <span>Leitura: ~{readingMinutes} min</span>
          <span className="text-charcoal-400" aria-hidden="true">·</span>
          <span><span aria-hidden="true">🍲 </span>Tempo de cocção: ~{readingMinutes} min</span>
        </div>
        {isLoading ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center animate-fade-in">
            <div className="text-3xl sm:text-4xl mb-4 animate-bounce">📖</div>
            <div className={`text-base font-serif italic sm:text-lg ${settings.theme === 'dark' ? 'text-gold-300' : 'text-burgundy-600'}`}>Carregando capítulo...</div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Chapter Content"
            className="w-full min-h-0 flex-1 border-0"
            sandbox="allow-same-origin"
          />
        )}
      </div>
      
      {/* Navigation Controls */}
      {showNavigation && <div className={`flex items-center gap-2 border-t px-3 py-2 shadow-soft sm:gap-3 sm:px-6 sm:py-2.5 ${settings.theme === 'dark' ? 'border-[#5b4e40] bg-[#302821]' : settings.theme === 'sepia' ? 'border-amber-300 bg-amber-50' : 'border-ivory-300 bg-ivory-50'}`}>
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`group flex min-h-10 min-w-0 flex-1 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors disabled:cursor-not-allowed sm:min-h-12 sm:gap-2.5 sm:px-4 sm:py-2 ${settings.theme === 'dark' ? 'border-[#5b4e40] bg-[#3a3129] text-[#f0e5d3] hover:bg-[#493e33] disabled:bg-[#3a3129] disabled:text-[#a89985]' : settings.theme === 'sepia' ? 'border-amber-300 bg-amber-50 text-burgundy-800 hover:bg-amber-100 disabled:bg-amber-100 disabled:text-amber-700/50' : 'border-ivory-300 bg-white text-burgundy-800 hover:border-burgundy-300 hover:bg-ivory-100 disabled:bg-ivory-100 disabled:text-charcoal-400'}`}
          aria-label={previousChapterTitle ? `Capítulo anterior: ${previousChapterTitle}` : 'Capítulo anterior'}
        >
          <svg className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="flex min-w-0 flex-col items-start text-left">
            <span className="text-[0.82rem] font-semibold sm:text-sm">Anterior</span>
            {previousChapterTitle && <span className={`hidden max-w-40 truncate text-xs font-normal sm:block ${settings.theme === 'dark' ? 'text-ivory-400' : 'text-charcoal-500'}`}>{previousChapterTitle}</span>}
          </span>
        </button>

        <div className={`shrink-0 px-1 text-center ${settings.theme === 'dark' ? 'text-ivory-300' : settings.theme === 'sepia' ? 'text-amber-900/70' : 'text-charcoal-600'}`} aria-label={`Capítulo ${chapterIndex + 1} de ${chapterCount}`}>
          <span className="block whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-wide sm:text-[0.68rem]">Capítulo {chapterIndex + 1} de {chapterCount}</span>
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="group flex min-h-10 min-w-0 flex-1 items-center justify-end gap-1.5 rounded-lg border border-burgundy-700 bg-burgundy-700 px-2.5 py-1.5 text-ivory-50 transition-colors hover:bg-burgundy-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:gap-2.5 sm:px-4 sm:py-2"
          aria-label={nextChapterTitle ? `Próximo capítulo: ${nextChapterTitle}` : 'Próximo capítulo'}
        >
          <span className="flex min-w-0 flex-col items-end text-right">
            <span className="text-[0.82rem] font-semibold sm:text-sm">Próximo</span>
            {nextChapterTitle && <span className="hidden max-w-40 truncate text-xs font-normal text-ivory-100/80 sm:block">{nextChapterTitle}</span>}
          </span>
          <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>}
      {!showNavigation && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
          {floatingNavigationOpen && (
            <section id="floating-chapter-navigation" className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-ivory-300 bg-ivory-50 p-4 shadow-elegant" aria-label="Navegação entre capítulos">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Navegar capítulos</p>
                  <p className="mt-1 text-sm font-semibold text-burgundy-800">Capítulo {chapterIndex + 1} de {chapterCount}</p>
                </div>
                <button onClick={() => setFloatingNavigationOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-600 transition hover:bg-ivory-200" aria-label="Fechar navegação">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onPrev} disabled={!hasPrev} className="flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-ivory-300 bg-white px-3 py-2 text-left text-xs font-semibold text-burgundy-800 transition hover:border-burgundy-300 hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-45" aria-label={previousChapterTitle ? `Capítulo anterior: ${previousChapterTitle}` : 'Capítulo anterior'}>
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <span className="min-w-0"><span className="block">Anterior</span>{previousChapterTitle && <span className="mt-0.5 block truncate font-normal text-charcoal-500">{previousChapterTitle}</span>}</span>
                </button>
                <button onClick={onNext} disabled={!hasNext} className="flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-xl border border-burgundy-700 bg-burgundy-700 px-3 py-2 text-right text-xs font-semibold text-ivory-50 transition hover:bg-burgundy-800 disabled:cursor-not-allowed disabled:opacity-45" aria-label={nextChapterTitle ? `Próximo capítulo: ${nextChapterTitle}` : 'Próximo capítulo'}>
                  <span className="min-w-0"><span className="block">Próximo</span>{nextChapterTitle && <span className="mt-0.5 block truncate font-normal text-ivory-100/80">{nextChapterTitle}</span>}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </section>
          )}
          <button
            onClick={() => setFloatingNavigationOpen((open) => !open)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-burgundy-800 bg-burgundy-700 px-4 text-sm font-semibold text-ivory-50 shadow-elegant transition hover:-translate-y-0.5 hover:bg-burgundy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600"
            aria-expanded={floatingNavigationOpen}
            aria-controls="floating-chapter-navigation"
            aria-label={floatingNavigationOpen ? 'Fechar navegação de capítulos' : 'Abrir navegação de capítulos'}
          >
            <BookOpen className="h-4 w-4" />
            <span>Capítulo {chapterIndex + 1}/{chapterCount}</span>
          </button>
        </div>
      )}
    </div>
  );
}
