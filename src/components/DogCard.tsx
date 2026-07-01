import React from 'react';
import type { Dog } from '../types';
import { Heart, Activity, Calendar } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  onSelect: (dog: Dog) => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onSelect }) => {
  const percentSponsored = Math.min(
    Math.round((dog.currentMonthlySponsorship / dog.targetMonthlySponsorship) * 100),
    100
  );

  const getStatusBadge = () => {
    switch (dog.status) {
      case 'fully_sponsored':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Apadrinhado
          </span>
        );
      case 'partially_sponsored':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            {percentSponsored}% Coberto
          </span>
        );
      case 'needs_sponsor':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
            Sem Padrinho
          </span>
        );
    }
  };

  const translatedGender = dog.gender === 'male' ? 'Macho' : 'Fêmea';

  return (
    <div 
      className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect(dog)}
    >
      {/* Dog Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={dog.mainImageUrl} 
          alt={dog.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gender Indicator overlay */}
        <div className="absolute top-3 right-3 flex items-center justify-center h-8 px-2.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold gap-1">
          <span>{dog.gender === 'male' ? '♂' : '♀'}</span>
          <span>{translatedGender}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
              {dog.name}
            </h3>
            {getStatusBadge()}
          </div>

          {/* Details list */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dog.age}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              {dog.breed}
            </span>
          </div>

          {/* Description Excerpt */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
            {dog.description}
          </p>
        </div>

        {/* Progress & Actions Section */}
        <div>
          {/* Sponsorship Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400">
              <span>Objetivo: €{dog.targetMonthlySponsorship}/mês</span>
              <span className="text-amber-500">€{dog.currentMonthlySponsorship} angariados</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentSponsored}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer group-hover:bg-amber-500 group-hover:text-white"
          >
            <Heart className="h-4 w-4 fill-current group-hover:animate-pulse" />
            Conhecer {dog.name}
          </button>
        </div>
      </div>
    </div>
  );
};
