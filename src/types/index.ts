export interface Chapter {
  id: string;
  label: string;
  href: string;
  subitems?: Chapter[];
}

export interface ReadingProgress {
  currentChapter: string;
  totalPages: number;
  currentPage: number;
  percentage: number;
}

export interface Bookmark {
  id: string;
  chapterId: string;
  chapterTitle: string;
  cfi: string;
  text: string;
  timestamp: number;
}

export interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'sepia' | 'dark';
}

export interface EpubBook {
  title: string;
  author: string;
  coverUrl?: string;
  chapters: Chapter[];
}
