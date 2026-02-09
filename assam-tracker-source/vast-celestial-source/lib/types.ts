export type NewsCategory = 'Front Page' | 'Political' | 'Editorial' | 'Sports';

export interface NewsItem {
  id: string; // Unique ID (url hash or derived)
  headline: string;
  link: string;
  source: 'The Hindu' | 'Economic Times' | 'Indian Express';
  category: NewsCategory;
  state?: string; // For categorization by State (specifically for Political news)
  timestamp?: string;
}

export interface ScraperResult {
  success: boolean;
  data: NewsItem[];
  error?: string;
}
