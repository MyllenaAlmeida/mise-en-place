import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Clock3, CookingPot, MessageCircle } from 'lucide-react';
import type { ReaderSettings } from '../types';
import ChapterComments from './ChapterComments';

interface ChapterViewerProps {
  chapterId: string;
  chapterUrl: string;
  sidebarVisible: boolean;
  chapterIndex: number;
  settings: ReaderSettings;
  onFontSizeChange: (fontSize: number) => void;
  onChapterRead: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ChapterViewer({
  chapterId,
  chapterUrl,
  sidebarVisible,
  chapterIndex,
  settings,
  onFontSizeChange,
  onChapterRead,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: ChapterViewerProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const commentsRef = useRef<HTMLElement>(null);
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
        const chapterDocument = new DOMParser().parseFromString(html, 'text/html');
        chapterDocument.querySelectorAll('script').forEach((script) => script.remove());
        chapterDocument.querySelectorAll<HTMLElement>('*').forEach((element) => {
          Array.from(element.attributes).forEach((attribute) => {
            if (/^on/i.test(attribute.name) || (/^(href|src|xlink:href)$/i.test(attribute.name) && /^\s*javascript:/i.test(attribute.value))) {
              element.removeAttribute(attribute.name);
            }
          });
        });
        setContent(`<!DOCTYPE html>${chapterDocument.documentElement.outerHTML}`);
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
    let resizeObserver: ResizeObserver | undefined;
    if (iframeRef.current && content) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        const previousScrollY = window.scrollY;
        iframe.style.height = '1px';
        iframe.style.backgroundColor = settings.theme === 'dark' ? '#211719' : settings.theme === 'sepia' ? '#fffbeb' : '#faf8f2';
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

        doc.querySelectorAll<HTMLParagraphElement>('p').forEach((paragraph) => {
          if (paragraph.textContent?.trim() === '◆ ◆ ◆') {
            paragraph.classList.add('chapter-divider');
          }
        });

        doc.querySelectorAll<HTMLElement>('[id^="endnotes"]').forEach((notesSection) => {
          const heading = notesSection.querySelector('p');
          if (heading?.textContent?.trim().toLowerCase() === 'chapter end notes') {
            heading.textContent = 'Notas finais do capítulo';
          }
        });

        document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((asset) => {
          doc.head.appendChild(asset.cloneNode(true));
        });

        // Apply custom styles
        const style = doc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            font-family: 'Lora', Georgia, serif !important;
            font-size: ${settings.fontSize}px !important;
            font-weight: 400 !important;
            line-height: 1.75 !important;
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

          @media (max-width: 639px) {
            body {
              font-size: ${Math.max(settings.fontSize, 18)}px !important;
              padding: 28px 18px !important;
              line-height: 1.75 !important;
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
            font-weight: 400 !important;
            line-height: 1.75 !important;
          }

          p:first-of-type {
            text-indent: 0 !important;
          }

          p.chapter-divider {
            text-align: center !important;
            text-indent: 0 !important;
            letter-spacing: 0.35em !important;
            margin: 2.5em 0 !important;
          }

          .chat-message {
            display: flex !important;
            flex-direction: column !important;
            width: min(88%, 36rem) !important;
            margin: 1.2em 0 !important;
            text-indent: 0 !important;
          }

          .chat-message--incoming {
            margin-right: auto !important;
            align-items: flex-start !important;
          }

          .chat-message--outgoing {
            margin-left: auto !important;
            align-items: flex-end !important;
          }

          p.chat-sender {
            margin: 0 0 0.25em !important;
            padding: 0 0.7em !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 0.72em !important;
            font-weight: 700 !important;
            text-align: left !important;
            text-indent: 0 !important;
          }

          p.chat-bubble {
            width: fit-content !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0.75em 1em !important;
            border-radius: 1.15em !important;
            text-align: left !important;
            text-indent: 0 !important;
            overflow-wrap: anywhere !important;
          }

          .chat-message--incoming p.chat-bubble {
            border-top-left-radius: 0.35em !important;
            background: ${settings.theme === 'dark' ? '#382b2e' : '#f0e9df'} !important;
            color: ${settings.theme === 'dark' ? '#f0e5d3' : '#45372a'} !important;
          }

          .chat-message--outgoing p.chat-bubble {
            border-top-right-radius: 0.35em !important;
            background: ${settings.theme === 'dark' ? '#3b493f' : '#e4eee3'} !important;
            color: ${settings.theme === 'dark' ? '#f0e5d3' : '#334536'} !important;
          }

          .chapter-title {
            text-align: center !important;
            font-size: 2.5rem !important;
            margin-bottom: 2.5em !important;
            padding-bottom: 1.5em !important;
            border-bottom: 3px solid ${settings.theme === 'dark' ? '#805560' : '#de4f4f'} !important;
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${settings.theme === 'dark' ? '#e5c27b' : '#8c2727'} !important;
            font-weight: 600 !important;
          }

          @media (max-width: 639px) {
            .chapter-title {
              font-size: 1.8rem !important;
              line-height: 1.2 !important;
              margin: 0 0 1.35em !important;
              padding-bottom: 0.8em !important;
              border-bottom-width: 2px !important;
              overflow-wrap: anywhere !important;
            }

            p {
              font-weight: 400 !important;
              line-height: 1.75 !important;
            }
          }

          .calibre7, .userstuff1, .userstuff2, .calibre1 {
            font-family: 'Lora', Georgia, serif !important;
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
            border: 1px solid ${settings.theme === 'dark' ? '#68434a' : settings.theme === 'sepia' ? '#d3b98d' : '#d9c4a7'} !important;
            border-top: 3px solid ${settings.theme === 'dark' ? '#b58b4a' : '#c6a62e'} !important;
            border-radius: 14px !important;
          }

          .chapter-summary-section {
            background: transparent !important;
          }

          [id^="endnotes"] {
            background: ${settings.theme === 'dark' ? '#332126' : settings.theme === 'sepia' ? '#f3eadb' : '#fbf8f2'} !important;
          }

          .chapter-summary-section > p:first-child,
          [id^="endnotes"] > p:first-child {
            margin: 0 0 1em !important;
            padding: 0 0 0.65em !important;
            border-bottom: 1px solid ${settings.theme === 'dark' ? '#68434a' : settings.theme === 'sepia' ? '#d3b98d' : '#d9c4a7'} !important;
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

        const chapterTop = doc.createElement('div');
        chapterTop.id = 'chapter-top';
        chapterTop.setAttribute('aria-hidden', 'true');
        chapterTop.style.height = '0';
        doc.body.prepend(chapterTop);

        const syncFrameHeight = () => {
          iframe.style.height = `${Math.ceil(doc.body.scrollHeight)}px`;
        };
        syncFrameHeight();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(syncFrameHeight);
          resizeObserver.observe(doc.documentElement);
          resizeObserver.observe(doc.body);
        }
        doc.querySelectorAll('img').forEach((image) => image.addEventListener('load', syncFrameHeight, { once: true }));
        const readingWindow = doc.defaultView;
        if (readingWindow) {
          let markedAsRead = false;
          const markWhenAtEnd = () => {
            if (markedAsRead) return;
            const frameBottom = iframe.getBoundingClientRect().bottom;
            if (frameBottom <= window.innerHeight + 96) {
              markedAsRead = true;
              onChapterReadRef.current();
            }
          };
          readingWindow.requestAnimationFrame(() => window.scrollTo(0, previousScrollY));
          window.addEventListener('scroll', markWhenAtEnd, { passive: true });
          window.addEventListener('resize', syncFrameHeight);
          const checkFrame = requestAnimationFrame(markWhenAtEnd);
          cleanupReadTracking = () => {
            window.removeEventListener('scroll', markWhenAtEnd);
            window.removeEventListener('resize', syncFrameHeight);
            cancelAnimationFrame(checkFrame);
          };
        }

      }
    }
    return () => {
      cleanupReadTracking?.();
      resizeObserver?.disconnect();
    };
  }, [content, settings, chapterId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target?.tagName ?? '')) return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      if (hasNext) onNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hasPrev) onPrev();
    }
  };

  return (
    <div className={`flex min-h-full flex-col ${settings.theme === 'dark' ? 'bg-[#211719]' : settings.theme === 'sepia' ? 'bg-amber-100' : 'bg-ivory-50'}`} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Chapter Content */}
      <div className="flex flex-col">
        <div className={`sticky top-0 z-10 grid grid-cols-1 items-center gap-2 border-b px-3 py-2 text-[0.68rem] font-medium shadow-sm backdrop-blur sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-5 sm:text-xs ${settings.theme === 'dark' ? 'border-[#68434a] bg-[#2a1b1f]/95 text-[#e0cfd1]' : settings.theme === 'sepia' ? 'border-amber-300 bg-amber-50/95 text-amber-900/80' : 'border-ivory-300 bg-ivory-50/95 text-charcoal-600'}`} aria-label="Controles e informações do capítulo">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:col-start-2" role="status" aria-label={`Leitura estimada: ${readingMinutes} minutos; tempo de cocção estimado: ${readingMinutes} minutos`}>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Leitura: ~{readingMinutes} min</span>
            <span className="inline-flex items-center gap-1.5"><CookingPot className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Tempo de cocção: ~{readingMinutes} min</span>
          </div>
          <button type="button" onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="col-span-full inline-flex items-center justify-center gap-1.5 text-[0.65rem] opacity-70 transition hover:opacity-100 sm:col-start-1 sm:col-span-1 sm:row-start-1 sm:justify-start sm:text-[0.68rem]" aria-label="Ir para os comentários no final do capítulo"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /><span>Ir para os comentários</span></button>
          <div className="ml-auto inline-flex shrink-0 items-center gap-1 sm:col-start-3 sm:row-start-1" role="group" aria-label="Tamanho do texto">
            <button type="button" onClick={() => onFontSizeChange(Math.max(12, settings.fontSize - 1))} disabled={settings.fontSize <= 12} className="flex h-8 min-w-9 items-center justify-center rounded-lg border border-current/20 px-2 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Diminuir tamanho da fonte" title="Diminuir fonte">A−</button>
            <button type="button" onClick={() => onFontSizeChange(Math.min(24, settings.fontSize + 1))} disabled={settings.fontSize >= 24} className="flex h-8 min-w-9 items-center justify-center rounded-lg border border-current/20 px-2 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Aumentar tamanho da fonte" title="Aumentar fonte">A+</button>
          </div>
        </div>
        {isLoading ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
            <div className="text-3xl sm:text-4xl mb-4 animate-bounce">📖</div>
            <div className={`text-base font-serif italic sm:text-lg ${settings.theme === 'dark' ? 'text-gold-300' : 'text-burgundy-600'}`}>Carregando capítulo...</div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Chapter Content"
            className="block w-full border-0"
            style={{ height: 'calc(100dvh - 140px)' }}
            sandbox="allow-same-origin"
          />
        )}
      </div>

      <section ref={commentsRef} className="scroll-mt-16 border-t border-current/10 px-3 py-6 sm:px-6" aria-label="Comentários do capítulo">
        <div className="mx-auto mb-6 flex w-full max-w-3xl justify-center">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-sm font-semibold opacity-75 transition hover:bg-current/5 hover:opacity-100" aria-label="Voltar ao topo do capítulo"><ArrowUp className="h-4 w-4" />Voltar ao topo</button>
        </div>
        <ChapterComments chapterId={chapterId} chapterNumber={chapterIndex + 1} theme={settings.theme} layout="section" />
      </section>


    </div>
  );
}
