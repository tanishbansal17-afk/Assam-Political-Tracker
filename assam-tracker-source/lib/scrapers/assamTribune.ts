import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectDistrict, isPolitical } from '@/lib/utils';
import crypto from 'crypto';

const URL = 'https://assamtribune.com/assam';

export async function scrapeAssamTribune(): Promise<NewsItem[]> {
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

            // AT sometimes has incomplete links
            if (link && !link.startsWith('http')) {
                link = `https://assamtribune.com${link}`;
            }

            // Clean headline logic if needed (sometimes AT has dates in h tags)

            if (link && headline && !seenLinks.has(link)) {
                if (headline.length < 15) return;

                // POLITICAL FILTER
                if (!isPolitical(headline)) return;

                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'Assam Tribune',
                    district: detectDistrict(headline)
                });
            }
        };

        $('.cat-article-list, .story-listing').each((i, el) => processElement(el));
        $('h2, h4').each((i, el) => processElement(el));

        return items;
    } catch (err) {
        console.error('Error scraping Assam Tribune:', err);
        return [];
    }
}
