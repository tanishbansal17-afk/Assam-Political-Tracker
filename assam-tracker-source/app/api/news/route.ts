import { NextResponse } from 'next/server';
import { scrapeIndiaTodayNE } from '@/lib/scrapers/indiaTodayNE';
import { scrapeTheSentinel } from '@/lib/scrapers/theSentinel';
import { scrapeAssamTribune } from '@/lib/scrapers/assamTribune';
import { NewsItem } from '@/lib/types';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const [itne, sentinel, at] = await Promise.allSettled([
            scrapeIndiaTodayNE(),
            scrapeTheSentinel(),
            scrapeAssamTribune()
        ]);

        let allNews: NewsItem[] = [];

        if (itne.status === 'fulfilled') allNews = [...allNews, ...itne.value];
        else console.error('India Today NE Scraper Failed:', itne.reason);

        if (sentinel.status === 'fulfilled') allNews = [...allNews, ...sentinel.value];
        else console.error('The Sentinel Scraper Failed:', sentinel.reason);

        if (at.status === 'fulfilled') allNews = [...allNews, ...at.value];
        else console.error('Assam Tribune Scraper Failed:', at.reason);

        return NextResponse.json({ success: true, count: allNews.length, data: allNews });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
    }
}
