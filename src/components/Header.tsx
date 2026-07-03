import React from 'react';
import { ShieldCheck, User, Home } from 'lucide-react';
import { OBEALogo } from './OBEALogo';

interface HeaderProps {
  currentView: 'home' | 'gallery' | 'admin';
  setCurrentView: (view: 'home' | 'gallery' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const handleScroll = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      // Delay slightly to let the home screen render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo OBEA */}
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center cursor-pointer group"
          title="Ir para o início"
        >
          <OBEALogo variant="horizontal" />
        </button>

        {/* Navigation Link Items */}
        <div className="flex items-center gap-6">
          {currentView === 'home' && (
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              <button 
                onClick={() => handleScroll('manifesto')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Manifesto
              </button>
              <button 
                onClick={() => handleScroll('missao')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Missão
              </button>
              <button 
                onClick={() => handleScroll('programa-guardiao')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Programa Guardião
              </button>
              <button 
                onClick={() => handleScroll('contactos')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Contactos
              </button>
            </nav>
          )}

          {/* Action button Switcher */}
          <div className="flex items-center gap-3">
            {currentView !== 'home' && (
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Início
              </button>
            )}

            {currentView === 'home' || currentView === 'admin' ? (
              <button
                onClick={() => setCurrentView('gallery')}
                style={{ backgroundColor: '#0E3B2E' }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 rounded-xl transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
              >
                <User className="h-4 w-4" />
                Cães para Apadrinhar
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg transition-all shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Painel de Gestão
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
