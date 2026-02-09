'use client';

import { NewsItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { ExternalLink, Hash } from 'lucide-react';

interface NewsCardProps {
    news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
    const getSourceColor = (source: string) => {
        switch (source) {
            case 'The Hindu': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Economic Times': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Indian Express': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between group"
        >
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getSourceColor(news.source)}`}>
                        {news.source}
                    </span>
                    {news.state && (
                        <span className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            <Hash size={12} className="mr-1" />
                            {news.state}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text mb-2 line-clamp-3 group-hover:text-blue-600 transition-colors">
                    {news.headline}
                </h3>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
                >
                    Read Article <ExternalLink size={14} className="ml-1" />
                </a>
            </div>
        </motion.div>
    );
}
