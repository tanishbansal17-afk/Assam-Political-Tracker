import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectDistrict, isPolitical } from '@/lib/utils';
import crypto from 'crypto';

const URL = 'https://www.sentinelassam.com/north-east-india-news/assam-news';

export async function scrapeTheSentinel(): Promise<NewsItem[]> {
    try {
        const { data } = await axios.get(URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const items: NewsItem[] = [];
        const seenLinks = new Set<string>();

        const processElement = (el: any) => {
            const $el = $(el);
            const linkTag = $el.find('a').first();
            let link = linkTag.attr('href');
            let headline = $el.text().trim();

            if (link && !link.startsWith('http')) {
                link = `https://www.sentinelassam.com${link}`;
            }

            if (link && headline && !seenLinks.has(link)) {
                if (headline.length < 15) return;

                // POLITICAL FILTER
                if (!isPolitical(headline)) return;

                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'The Sentinel',
                    district: detectDistrict(headline)
                });
            }
        };

        $('.os-segment, .story-card, .article-list-item').each((i, el) => processElement(el));
        $('h3, h2').each((i, el) => processElement(el));

        return items;
    } catch (err) {
        console.error('Error scraping The Sentinel:', err);
        return [];
    }
}
