import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/lib/types';
import { detectDistrict, isPolitical } from '@/lib/utils';
import crypto from 'crypto';

const URL = 'https://www.indiatodayne.in/assam';

export async function scrapeIndiaTodayNE(): Promise<NewsItem[]> {
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
                link = `https://www.indiatodayne.in${link}`;
            }

            if (link && headline && !seenLinks.has(link)) {
                // Basic Validation
                if (headline.length < 15) return;

                // POLITICAL FILTER
                if (!isPolitical(headline)) return;

                seenLinks.add(link);
                items.push({
                    id: crypto.createHash('md5').update(link).digest('hex'),
                    headline,
                    link,
                    source: 'India Today NE',
                    district: detectDistrict(headline)
                });
            }
        };

        // Inspecting ITNE structure (usually generic selectors work)
        $('.story-card, .news-obj, .story').each((i, el) => processElement(el));
        // Fallback for H tags
        $('h2, h3, h4').each((i, el) => processElement(el));

        return items;
    } catch (err) {
        console.error('Error scraping India Today NE:', err);
        return [];
    }
}
