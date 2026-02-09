import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectState } from '@/lib/utils';
import crypto from 'crypto';

const BASE_URL = 'https://indianexpress.com';

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
            const linkTag = $el.find('a').first();
            const link = linkTag.attr('href');
            const headline = $el.text().trim();

            if (link && headline && !seenLinks.has(link) && link.startsWith('http')) {
                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'Indian Express',
                    category,
                    state: detectState(headline)
                });
            }
        };

        $('h1, h2, h3, .title, .heading').each((i, el) => scrapeElement(el));

        return items;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];
    }
}

export async function scrapeIndianExpress(): Promise<NewsItem[]> {
    const [political, editorial] = await Promise.all([
        fetchFromUrl(`${BASE_URL}/section/india/`, 'Political'), // 'Political Pulse' is better but India section covers broad politics
        fetchFromUrl(`${BASE_URL}/section/opinion/editorials/`, 'Editorial'),
    ]);

    const allMap = new Map<string, NewsItem>();
    [...political, ...editorial].forEach(item => {
        if (!allMap.has(item.id)) allMap.set(item.id, item);
    });

    return Array.from(allMap.values());
}
