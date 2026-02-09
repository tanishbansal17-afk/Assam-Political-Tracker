'use client';

import { NewsItem } from '@/lib/types';
import { CategorySection } from './CategorySection';
import { motion } from 'framer-motion';

export function NewsFeed({ news }: { news: NewsItem[] }) {
    // Filter news
    const political = news.filter(n => n.category === 'Political');
    const editorial = news.filter(n => n.category === 'Editorial');

    // Split political into National vs State
    const statePolitical = political.filter(n => !!n.state);
    const nationalPolitical = political.filter(n => !n.state);

    return (
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Daily Briefing
                </h2>
                <p className="text-slate-500">Curated political intelligence and editorials.</p>
            </motion.div>

            {/* National Political News */}
            <section>
                <CategorySection
                    title="National Political News"
                    items={nationalPolitical}
                    className="bg-white/50"
                />
            </section>

            {/* State Political - Grouped */}
            <section>
                <CategorySection
                    title="State Political Intelligence"
                    items={statePolitical}
                    groupByState={true}
                    className="bg-slate-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-10 rounded-3xl"
                />
            </section>

            {/* Editorials */}
            <CategorySection title="Editorials & Explained" items={editorial} />
        </main>
    );
}
