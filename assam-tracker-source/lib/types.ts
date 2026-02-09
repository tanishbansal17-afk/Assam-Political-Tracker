export type NewsSource = 'India Today NE' | 'The Sentinel' | 'Assam Tribune';

export interface NewsItem {
  id: string;
  headline: string;
  link: string;
  source: NewsSource;
  district?: string; // One of the 35 districts or undefined (General)
  timestamp?: string;
  shiny?: boolean; // For highlighted news if needed
}

export interface ScraperResult {
  success: boolean;
  data: NewsItem[];
  error?: string;
}
