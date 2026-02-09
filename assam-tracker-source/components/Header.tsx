'use client';

import { Bell, Menu, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button className="p-2 -ml-2 mr-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                POLITICO<span className="text-slate-800">INDIA</span>
                            </h1>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Consultant Intelligence</span>
                        </div>
                    </div>

                    <div className="flex-1 max-w-lg mx-8 hidden md:block">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
                                placeholder="Search headlines, states, topics..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                            <User size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
