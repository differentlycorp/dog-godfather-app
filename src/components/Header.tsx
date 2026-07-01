import React from 'react';
import { Heart, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  currentView: 'gallery' | 'admin';
  setCurrentView: (view: 'gallery' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => setCurrentView('gallery')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 bg-amber-500 rounded-xl text-white group-hover:bg-amber-600 transition-colors shadow-sm">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Padrinhos <span className="text-amber-500">OBEA</span>
          </span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {currentView === 'gallery' ? (
            <>
              <a 
                href="#dogs-list" 
                className="hidden sm:inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Conhecer os Cães
              </a>
              <a 
                href="#how-it-works" 
                className="hidden sm:inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Como Funciona
              </a>
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg transition-all shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Painel de Gestão
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentView('gallery')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <User className="h-4 w-4" />
              Ver os Cães
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
