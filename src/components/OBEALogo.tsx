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

  // Vector heart symbol representing the union of animals
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
      {/* Inner curves representing rabbit/bird */}
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
      {/* Central core dot */}
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
            className="text-[8px] font-bold mt-1 tracking-wider uppercase"
            style={{ color: subtextColor }}
          >
            Observatório do Bem-Estar Animal
          </span>
        </div>
      </div>
    );
  }

  // Default: Vertical (Principal version)
  // We use the exact official logo image uploaded by the user
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="/obea-logo.png" 
        alt="OBEA - Observatório do Bem-Estar Animal" 
        className="max-h-56 sm:max-h-64 w-auto object-contain hover:scale-102 transition-transform duration-300 dark:invert-0" 
      />
    </div>
  );
};
