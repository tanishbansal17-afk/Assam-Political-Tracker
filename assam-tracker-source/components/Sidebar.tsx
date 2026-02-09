'use client';

import { ASSAM_DISTRICTS } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Sidebar() {
    const scrollToDistrict = (district: string) => {
        const element = document.getElementById(district);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 overflow-y-auto bg-white border-r border-slate-200 p-4 scrollbar-thin scrollbar-thumb-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Districts</h3>
            <nav className="space-y-1">
                {ASSAM_DISTRICTS.map((district) => (
                    <button
                        key={district}
                        onClick={() => scrollToDistrict(district)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    >
                        {district}
                    </button>
                ))}
                <button
                    onClick={() => scrollToDistrict('General')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors font-medium"
                >
                    Assam General
                </button>
            </nav>
        </aside>
    );
}
