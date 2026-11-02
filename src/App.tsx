import { useState, useEffect, useCallback } from 'react';
import { useChapters } from './hooks/useChapters';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import type { ReaderSettings } from './types';
import Sidebar, { type AppPage } from './components/Sidebar';
import ChapterViewer from './components/ChapterViewer';
import HomePage from './components/HomePage';
import KitchenPage from './components/KitchenPage';
import SiteHeader from './components/SiteHeader';
import CharactersPage from './components/CharactersPage';

function App() {
  const [isReading, setIsReading] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [isCharactersOpen, setIsCharactersOpen] = useState(false);
  const [returnToReaderAfterKitchen, setReturnToReaderAfterKitchen] = useState(false);
  const [returnToReaderAfterCharacters, setReturnToReaderAfterCharacters] = useState(false);
  const [readerSidebarVisible, setReaderSidebarVisible] = useState(true);
  const [mobileChapterSidebarOpen, setMobileChapterSidebarOpen] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    const saved = localStorage.getItem('miseEnPlaceProgress');
    const parsed = saved === null ? 0 : Number.parseInt(saved, 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  });
  const [readChapterIds, setReadChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('miseEnPlaceReadChapters');
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) && parsed.every((chapterId) => typeof chapterId === 'string') ? parsed : [];
    } catch {
      return [];
    }
  });
  
  const { changeTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [settings, setSettings] = useLocalStorage<ReaderSettings>('readerSettings', {
    fontSize: 18,
    theme: 'light',
  });

  const toggleTheme = () => setSettings((current) => ({
    ...current,
    theme: current.theme === 'dark' ? 'light' : 'dark',
  }));

  const { chapters, bookInfo, isLoading: chaptersLoading } = useChapters();

  const markChapterAsRead = useCallback((chapterId: string) => {
    setReadChapterIds((current) => {
      if (current.includes(chapterId)) return current;
      const updated = [...current, chapterId];
      localStorage.setItem('miseEnPlaceReadChapters', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Sync theme with settings
  useEffect(() => {
    if (settings.theme === 'sepia') {
      setSettings((current) => ({ ...current, theme: 'light' }));
      return;
    }
    changeTheme(settings.theme);
  }, [settings.theme, changeTheme]);

  useEffect(() => {
    if (chapters.length === 0) return;

    const savedChapterId = localStorage.getItem('miseEnPlaceProgressChapterId');
    const savedChapterIndex = savedChapterId
      ? chapters.findIndex((chapter) => chapter.id === savedChapterId)
      : -1;
    const previousIndex = Number.parseInt(localStorage.getItem('miseEnPlaceProgress') || '0', 10);
    const migratedIndex = Math.max(0, Number.isInteger(previousIndex) && previousIndex > 0 ? previousIndex - 1 : 0);
    const restoredIndex = Math.min(
      savedChapterIndex >= 0 ? savedChapterIndex : migratedIndex,
      chapters.length - 1,
    );

    setCurrentChapterIndex(restoredIndex);
    localStorage.setItem('miseEnPlaceProgress', restoredIndex.toString());
    localStorage.setItem('miseEnPlaceProgressChapterId', chapters[restoredIndex]!.id);
    setProgressReady(true);
  }, [chapters]);

  useEffect(() => {
    if (!progressReady || !chapters[currentChapterIndex]) return;
    localStorage.setItem('miseEnPlaceProgress', currentChapterIndex.toString());
    localStorage.setItem('miseEnPlaceProgressChapterId', chapters[currentChapterIndex]!.id);
  }, [chapters, currentChapterIndex, progressReady]);

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const currentChapter = chapters[currentChapterIndex];
      if (currentChapter) markChapterAsRead(currentChapter.id);
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  const handleChapterSelect = (href: string) => {
    setMobileChapterSidebarOpen(false);
    const index = chapters.findIndex(ch => ch.href === href);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      setIsKitchenOpen(false);
      setIsCharactersOpen(false);
      setIsReading(true);
    }
  };

  const navigateToPage = (page: AppPage) => {
    setMobileChapterSidebarOpen(false);
    if (page === 'home') {
      setIsReading(false);
      setIsKitchenOpen(false);
      setIsCharactersOpen(false);
      setReturnToReaderAfterKitchen(false);
      setReturnToReaderAfterCharacters(false);
      return;
    }
    if (page === 'reader') {
      setIsReading(true);
      setIsKitchenOpen(false);
      setIsCharactersOpen(false);
      setReturnToReaderAfterKitchen(false);
      setReturnToReaderAfterCharacters(false);
      return;
    }

    const returnToReader = isReading || returnToReaderAfterKitchen || returnToReaderAfterCharacters;
    setIsReading(false);
    setIsKitchenOpen(page === 'kitchen');
    setIsCharactersOpen(page === 'characters');
    setReturnToReaderAfterKitchen(page === 'kitchen' && returnToReader);
    setReturnToReaderAfterCharacters(page === 'characters' && returnToReader);
  };

  const goToChapters = () => {
    const chapterOneIndex = chapters.findIndex((chapter) => /(?:chapter|capítulo)\s+1\b/i.test(chapter.label));
    setCurrentChapterIndex(chapterOneIndex >= 0 ? chapterOneIndex : 0);
    navigateToPage('reader');
  };

  const renderSidebar = (activePage: AppPage) => (
    <Sidebar
      chapters={chapters}
      currentChapter={chapters[currentChapterIndex]?.href || ''}
      readChapterIds={readChapterIds}
      activePage={activePage}
      theme={settings.theme}
      onChapterSelect={handleChapterSelect}
      showOnDesktop={activePage === 'reader'}
      desktopVisible={activePage === 'reader' && readerSidebarVisible}
      mobileOpen={mobileChapterSidebarOpen}
      onToggleDesktop={() => setReaderSidebarVisible((visible) => !visible)}
      onOpenMobile={() => setMobileChapterSidebarOpen(true)}
      onCloseMobile={() => setMobileChapterSidebarOpen(false)}
    />
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileChapterSidebarOpen(false);
        setIsKitchenOpen(false);
        setIsCharactersOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show loading screen or home page
  if (chaptersLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce">📖</div>
          <div className="text-burgundy-600 text-2xl font-display font-semibold mb-2">
            Mise en Place
          </div>
          <div className="text-charcoal-500 font-serif italic text-lg">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  // Show home page if not reading
  if (!isReading) {
    if (isKitchenOpen) {
      return (
        <>
          <div className="flex h-dvh overflow-hidden">
            {renderSidebar('kitchen')}
            <div className="h-full min-w-0 flex-1 overflow-y-auto">
              <KitchenPage
                bookInfo={bookInfo}
                theme={settings.theme}
                onGoHome={() => navigateToPage('home')}
                onGoToChapters={goToChapters}
                onOpenCharacters={() => navigateToPage('characters')}
                onOpenKitchen={() => navigateToPage('kitchen')}
                onToggleTheme={toggleTheme}
                onOpenChapter={(chapterId) => {
                  const chapterPosition = chapters.findIndex((chapter) => chapter.id === chapterId);
                  if (chapterPosition >= 0) setCurrentChapterIndex(chapterPosition);
                  navigateToPage('reader');
                }}
              />
            </div>
          </div>
        </>
      );
    }

    if (isCharactersOpen) {
      return (
        <>
          <div className="flex h-dvh overflow-hidden">
            {renderSidebar('characters')}
            <div className="h-full min-w-0 flex-1 overflow-y-auto">
              <CharactersPage
                bookInfo={bookInfo}
                settings={settings}
                onGoHome={() => navigateToPage('home')}
                onGoToChapters={goToChapters}
                onOpenCharacters={() => navigateToPage('characters')}
                onOpenKitchen={() => navigateToPage('kitchen')}
                onToggleTheme={toggleTheme}
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex h-dvh overflow-hidden">
          {renderSidebar('home')}
          <div className="h-full min-w-0 flex-1 overflow-y-auto">
            <HomePage
              chapters={chapters}
              bookInfo={bookInfo}
              settings={settings}
              onStartReading={(chapterIndex) => {
                setCurrentChapterIndex(chapterIndex);
                setIsReading(true);
              }}
              onToggleTheme={toggleTheme}
              onOpenCharacters={() => {
                setReturnToReaderAfterCharacters(false);
                setIsCharactersOpen(true);
              }}
              onOpenKitchen={() => {
                setReturnToReaderAfterKitchen(false);
                setIsKitchenOpen(true);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  const currentChapter = chapters[currentChapterIndex];

  return (
    <div className={`min-h-dvh ${themeClasses.bg} ${themeClasses.text}`}>
      <SiteHeader
        title={bookInfo?.title || 'Mise en Place'}
        theme={settings.theme}
        activePage="reader"
        brandLabel="Voltar à página inicial"
        onBrandClick={() => navigateToPage('home')}
        onBackHome={() => navigateToPage('home')}
        onGoToChapters={goToChapters}
        onOpenKitchen={() => {
          setReturnToReaderAfterKitchen(true);
          setIsReading(false);
          setIsKitchenOpen(true);
        }}
        onOpenCharacters={() => {
          setReturnToReaderAfterCharacters(true);
          setIsReading(false);
          setIsCharactersOpen(true);
        }}
        onToggleTheme={toggleTheme}
      />

      {/* Progress Bar */}
      <div className={`h-1.5 shadow-inner ${settings.theme === 'dark' ? 'bg-[#592227]' : settings.theme === 'sepia' ? 'bg-amber-200' : 'bg-ivory-200'}`}>
        <div
          className={`h-full transition-all duration-500 ease-out shadow-glow ${settings.theme === 'dark' ? 'bg-gradient-to-r from-gold-700 to-gold-500' : 'bg-gradient-to-r from-burgundy-600 to-burgundy-700'}`}
          style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>

      <div className="sr-only" aria-live="polite">
        Capítulo {currentChapterIndex + 1} de {chapters.length}: {currentChapter?.label}
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100dvh-70px)] min-h-0 sm:h-[calc(100dvh-86px)]">
        {renderSidebar('reader')}
        
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {currentChapter && (
            <ChapterViewer
              chapterUrl={currentChapter.href}
              showNavigation={readerSidebarVisible}
              sidebarVisible={readerSidebarVisible}
              chapterIndex={currentChapterIndex}
              chapterCount={chapters.length}
              previousChapterTitle={chapters[currentChapterIndex - 1]?.label}
              nextChapterTitle={chapters[currentChapterIndex + 1]?.label}
              settings={settings}
              onFontSizeChange={(fontSize) => setSettings((current) => ({ ...current, fontSize }))}
              onChapterRead={() => markChapterAsRead(currentChapter.id)}
              onNext={handleNextChapter}
              onPrev={handlePrevChapter}
              hasNext={currentChapterIndex < chapters.length - 1}
              hasPrev={currentChapterIndex > 0}
            />
          )}
        </main>
      </div>

    </div>
  );
}

export default App;
