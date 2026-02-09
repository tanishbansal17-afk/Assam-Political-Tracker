'use client';

import { NewsItem } from '@/lib/types';
import { NewsCard } from './NewsCard';
import { motion } from 'framer-motion';

interface CategorySectionProps {
    title: string;
    items: NewsItem[];
    className?: string;
    groupByState?: boolean;
}

export function CategorySection({ title, items, className, groupByState }: CategorySectionProps) {
    if (items.length === 0) return null;

    // Group items by state if enabled
    const renderContent = () => {
        if (groupByState) {
            // Group items
            const groups: Record<string, NewsItem[]> = {};
            const others: NewsItem[] = [];

            items.forEach(item => {
                if (item.state) {
                    if (!groups[item.state]) groups[item.state] = [];
                    groups[item.state].push(item);
                } else {
                    others.push(item);
                }
            });

            // Sort states alphabetically
            const sortedStates = Object.keys(groups).sort();

            return (
                <div className="space-y-8">
                    {sortedStates.map(state => (
                        <div key={state} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-md uppercase tracking-wider font-semibold text-slate-500 mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                {state}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groups[state].map(item => (
                                    <NewsCard key={item.id} news={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {others.length > 0 && (
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-md uppercase tracking-wider font-semibold text-slate-500 mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                                National / General
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {others.map(item => (
                                    <NewsCard key={item.id} news={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <NewsCard key={item.id} news={item} />
                ))}
            </div>
        );
    };

    return (
        <section className={`py-8 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-6 flex items-baseline"
            >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                    {title}
                </h2>
                <span className="ml-4 text-sm text-slate-400 font-medium">{items.length} Stories</span>
            </motion.div>

            {renderContent()}
        </section>
    );
}
