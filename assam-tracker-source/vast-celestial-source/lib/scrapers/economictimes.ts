import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectState } from '@/lib/utils';
import crypto from 'crypto';

const BASE_URL = 'https://economictimes.indiatimes.com';

async function fetchFromUrl(url: string, category: NewsItem['category']): Promise<NewsItem[]> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const items: NewsItem[] = [];
        const seenLinks = new Set<string>();

        const scrapeElement = (el: any) => {
            const $el = $(el);
            // ET links can be nested or direct
            let linkTag = $el.find('a').first();
            // Sometimes the element itself is the link?
            if ($el.is('a')) linkTag = $el;

            let link = linkTag.attr('href');
            let headline = $el.text().trim();

            // Handle ET relative links
            if (link && !link.startsWith('http')) {
                if (link.startsWith('/')) {
                    link = `${BASE_URL}${link}`;
                } else {
                    // Ignore javascript: calls or other weird protocols
                    return;
                }
            }

            if (link && headline && !seenLinks.has(link) && headline.length > 20) {
                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'Economic Times',
                    category,
                    state: detectState(headline)
                });
            }
        };

        $('h1, h2, h3, .story-title, .heading').each((i, el) => scrapeElement(el));

        return items;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];
    }
}

export async function scrapeEconomicTimes(): Promise<NewsItem[]> {
    const [political, editorial] = await Promise.all([
        fetchFromUrl(`${BASE_URL}/news/politics`, 'Political'),
        fetchFromUrl(`${BASE_URL}/opinion`, 'Editorial'),
    ]);

    // Deduplicate
    const allMap = new Map<string, NewsItem>();
    [...political, ...editorial].forEach(item => {
        if (!allMap.has(item.id)) allMap.set(item.id, item);
    });

    return Array.from(allMap.values());
}
