import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { scrapeIndiaTodayNE } from '@/lib/scrapers/indiaTodayNE';
import { scrapeTheSentinel } from '@/lib/scrapers/theSentinel';
import { scrapeAssamTribune } from '@/lib/scrapers/assamTribune';
import { NewsItem } from '@/lib/types';

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  console.log('Fetching Assam news...');
  const [itne, sentinel, at] = await Promise.allSettled([
    scrapeIndiaTodayNE(),
    scrapeTheSentinel(),
    scrapeAssamTribune()
  ]);

  let allNews: NewsItem[] = [];

  if (itne.status === 'fulfilled') allNews = [...allNews, ...itne.value];
  if (sentinel.status === 'fulfilled') allNews = [...allNews, ...sentinel.value];
  if (at.status === 'fulfilled') allNews = [...allNews, ...at.value];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NewsFeed news={allNews} />
    </div>
  );
}
