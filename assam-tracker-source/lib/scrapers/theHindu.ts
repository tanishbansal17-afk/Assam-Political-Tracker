import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectState } from '@/lib/utils';
import crypto from 'crypto';

const BASE_URL = 'https://www.thehindu.com';

async function fetchFromUrl(url: string, category: NewsItem['category']): Promise<NewsItem[]> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const items: NewsItem[] = [];

        // Selectors found via analysis: h1 (main), h3 (others)
        // We aggregate unique links to avoid duplicates
        const seenLinks = new Set<string>();

        const scrapeElement = (el: any) => {
            const $el = $(el);
            const linkTag = $el.find('a');
            const link = linkTag.attr('href');
            const headline = $el.text().trim();

            if (link && headline && !seenLinks.has(link) && link.startsWith('http')) {
                seenLinks.add(link);

                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'The Hindu',
                    category,
                    state: detectState(headline) // We only detect state, but don't force 'Political' category if scraped from Sports etc, unless we want to.
                });
            }
        };

        $('h1').each((i, el) => scrapeElement(el));
        $('h3.title').each((i, el) => scrapeElement(el));
        $('h3 a').each((i, el) => {
            // Fallback for h3s that wrap anchors directly or are inside
            const link = $(el).attr('href');
            const headline = $(el).text().trim();
            if (link && headline && !seenLinks.has(link) && link.startsWith('http')) {
                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'The Hindu',
                    category,
                    state: detectState(headline)
                });
            }
        });

        return items;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];
    }
}

export async function scrapeTheHindu(): Promise<NewsItem[]> {
    const [political, editorial] = await Promise.all([
        fetchFromUrl(`${BASE_URL}/news/national/`, 'Political'),
        fetchFromUrl(`${BASE_URL}/opinion/`, 'Editorial'),
    ]);

    // Combine and deduplicate by ID
    const allMap = new Map<string, NewsItem>();
    [...political, ...editorial].forEach(item => {
        if (!allMap.has(item.id)) {
            allMap.set(item.id, item);
        }
    });

    return Array.from(allMap.values());
}
