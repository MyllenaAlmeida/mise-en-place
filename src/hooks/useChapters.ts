import { useState, useEffect } from 'react';
import type { Chapter } from '../types';
import metadataJson from '../chapters/metadata.json';

interface ChapterMetadata {
  id: string;
  title: string;
  file: string;
  order: number;
}

export interface BookMetadata {
  title: string;
  author: string;
  description: string;
  chapters: ChapterMetadata[];
}

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookInfo, setBookInfo] = useState<BookMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const metadata: BookMetadata = metadataJson as BookMetadata;
      
      setBookInfo(metadata);
      
      const chapterList: Chapter[] = metadata.chapters.map(ch => ({
        id: ch.id,
        label: ch.title,
        href: `/chapters/${ch.file}`,
      }));
      
      setChapters(chapterList);
    } catch (error) {
      console.error('Error loading chapter metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { chapters, bookInfo, isLoading };
}
