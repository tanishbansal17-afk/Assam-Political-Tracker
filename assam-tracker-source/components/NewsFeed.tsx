'use client';

import { NewsItem } from '@/lib/types';
import { CategorySection } from './CategorySection';
import { Sidebar } from './Sidebar';
import { ASSAM_DISTRICTS } from '@/lib/utils';
import { motion } from 'framer-motion';

export function NewsFeed({ news }: { news: NewsItem[] }) {
    // Group by District
    const districtNews: Record<string, NewsItem[]> = {};
    const generalNews: NewsItem[] = [];

    news.forEach(item => {
        if (item.district) {
            if (!districtNews[item.district]) districtNews[item.district] = [];
            districtNews[item.district].push(item);
        } else {
            generalNews.push(item);
        }
    });

    return (
        <div className="flex pt-16">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 sm:p-8 space-y-12 bg-slate-50 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                        Assam Political Tracker
                    </h2>
                    <p className="text-slate-500">District-wise intelligence directly from the ground.</p>
                </motion.div>

                {/* Render District Sections */}
                {ASSAM_DISTRICTS.map(district => {
                    const items = districtNews[district] || [];
                    if (items.length === 0) return null;

                    return (
                        <div id={district} key={district} className="scroll-mt-24">
                            <CategorySection
                                title={district}
                                items={items}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                            />
                        </div>
                    );
                })}

                {/* General Section */}
                {generalNews.length > 0 && (
                    <div id="General" className="scroll-mt-24">
                        <CategorySection
                            title="Assam General"
                            items={generalNews}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
