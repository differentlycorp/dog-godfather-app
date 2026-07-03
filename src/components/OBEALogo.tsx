import React from 'react';

interface OBEALogoProps {
  variant?: 'vertical' | 'horizontal' | 'symbol';
  className?: string;
  lightMode?: boolean; // true if rendering on dark background (white logo)
}

export const OBEALogo: React.FC<OBEALogoProps> = ({ 
  variant = 'vertical', 
  className = '', 
  lightMode = false 
}) => {
  const darkGreen = lightMode ? '#ffffff' : '#0E3B2E';
  const lightGreen = lightMode ? '#ffffff' : '#8CC63F';
  const subtextColor = lightMode ? '#e4e4e7' : '#27272a';

  // Customized organic heart representing the union of animals
  const renderSymbol = (sizeClass: string) => (
    <svg 
      className={`${sizeClass} shrink-0`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left side of the heart (Dog/Rabbit outline) in Forest Green */}
      <path 
        d="M50 85C38 78 12 55 12 35C12 22 22 12 35 12C42 12 47 16 50 20" 
        stroke={darkGreen} 
        strokeWidth="6.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right side of the heart (Cat/Bird outline) in Leaf Green */}
      <path 
        d="M50 85C62 78 88 55 88 35C88 22 78 12 65 12C58 12 53 16 50 20" 
        stroke={lightGreen} 
        strokeWidth="6.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small inner curves representing the rabbit/bird inside the heart */}
      <path 
        d="M30 42C33 39 37 39 40 42" 
        stroke={darkGreen} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M60 48C57 45 53 45 50 48" 
        stroke={lightGreen} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      {/* Central core bond dot */}
      <circle cx="50" cy="38" r="4.5" fill={lightGreen} />
    </svg>
  );

  if (variant === 'symbol') {
    return renderSymbol(className || 'h-16 w-16');
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderSymbol('h-11 w-11')}
        <div className="border-l border-zinc-200 dark:border-zinc-800 pl-3 flex flex-col justify-center">
          <span 
            className="text-lg font-black tracking-[0.25em] leading-none"
            style={{ color: darkGreen }}
          >
            OBEA
          </span>
          <span 
            className="text-[9px] font-bold mt-1 tracking-wider uppercase"
            style={{ color: subtextColor }}
          >
            Bem-Estar Animal
          </span>
        </div>
      </div>
    );
  }

  // Default: Vertical (Principal version)
  return (
    <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
      {renderSymbol('h-24 w-24 hover:scale-105 transition-transform duration-300')}
      <div className="space-y-1.5">
        <h1 
          className="text-3xl sm:text-4xl font-black tracking-[0.3em] leading-none translate-x-[0.15em]"
          style={{ color: darkGreen }}
        >
          OBEA
        </h1>
        
        {/* Horizontal line with dot in center */}
        <div className="flex items-center justify-center gap-2 py-0.5">
          <div className="h-[1.5px] w-12 rounded-full" style={{ backgroundColor: lightGreen }} />
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lightGreen }} />
          <div className="h-[1.5px] w-12 rounded-full" style={{ backgroundColor: lightGreen }} />
        </div>

        <p 
          className="text-xs sm:text-sm font-semibold tracking-widest uppercase"
          style={{ color: subtextColor }}
        >
          Observatório do Bem-Estar Animal
        </p>
      </div>
    </div>
  );
};
