import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { scrapeTheHindu } from '@/lib/scrapers/theHindu';
import { scrapeEconomicTimes } from '@/lib/scrapers/economictimes';
import { scrapeIndianExpress } from '@/lib/scrapers/indianExpress';
import { NewsItem } from '@/lib/types';

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  console.log('Fetching news...');
  const [hindu, et, ie] = await Promise.allSettled([
    scrapeTheHindu(),
    scrapeEconomicTimes(),
    scrapeIndianExpress()
  ]);

  let allNews: NewsItem[] = [];

  if (hindu.status === 'fulfilled') allNews = [...allNews, ...hindu.value];
  if (et.status === 'fulfilled') allNews = [...allNews, ...et.value];
  if (ie.status === 'fulfilled') allNews = [...allNews, ...ie.value];

  console.log(`Fetched ${allNews.length} articles.`);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NewsFeed news={allNews} />
    </div>
  );
}
