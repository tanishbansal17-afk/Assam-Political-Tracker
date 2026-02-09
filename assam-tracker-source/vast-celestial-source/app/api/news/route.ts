import { NextResponse } from 'next/server';
import { scrapeTheHindu } from '@/lib/scrapers/theHindu';
import { scrapeEconomicTimes } from '@/lib/scrapers/economictimes';
import { scrapeIndianExpress } from '@/lib/scrapers/indianExpress';
import { NewsItem } from '@/lib/types';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const [hindu, et, ie] = await Promise.allSettled([
            scrapeTheHindu(),
            scrapeEconomicTimes(),
            scrapeIndianExpress()
        ]);

        let allNews: NewsItem[] = [];

        if (hindu.status === 'fulfilled') allNews = [...allNews, ...hindu.value];
        else console.error('The Hindu Scraper Failed:', hindu.reason);

        if (et.status === 'fulfilled') allNews = [...allNews, ...et.value];
        else console.error('Economic Times Scraper Failed:', et.reason);

        if (ie.status === 'fulfilled') allNews = [...allNews, ...ie.value];
        else console.error('Indian Express Scraper Failed:', ie.reason);

        // Sort by source or just return mixed? 
        // Usually aggregated means mixed, but user might want them grouped.
        // We will return flat list, allow frontend to group.

        return NextResponse.json({ success: true, count: allNews.length, data: allNews });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
    }
}
